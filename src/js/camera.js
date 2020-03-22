var mouseChange = require('mouse-change')
var mouseWheel = require('mouse-wheel')

import {
  mat4,
  vec3,
  quat
} from "gl-matrix";

var {
  identity,
  multiply,
  perspective,
  ortho,
  fromRotation,
  lookAt
} = mat4;

var {
  add,
  copy,
  cross,
  scale,
  normalize,
  rotateX,
  rotateY,
  transformQuat
} = vec3;

var {
  setAxisAngle
} = quat;

function createCamera(regl, props_) {
  var canvas = regl._gl.canvas;
  var props = props_ || {}
  var eye = [0, 0, 100];
  var rotationQuat = [0, 0, 0, 0];  

  // Camera Setting
  var zoomInScale = 0.8;

  // Internal
  var prevX, prevY;
  var right = new Float32Array(3);
  var panUp = new Float32Array(3);

  var cameraState = {
    view: identity(new Float32Array(16)),
    projection: identity(new Float32Array(16)),
    center: new Float32Array(props.center || 3),
    eye: new Float32Array(eye),
    up: new Float32Array(props.up || [0, 1, 0]),
    right: new Float32Array([1, 0, 0]),
    fovy: props.fovy || Math.PI / 4.0,
    near: typeof props.near !== 'undefined' ? props.near : -1000,
    far: typeof props.far !== 'undefined' ? props.far : 1000.0,
    frustumWidth: 100,
    frustumHeight: 100,
    rotationSpeed: typeof props.rotationSpeed !== 'undefined' ? props.rotationSpeed : 1,
    zoomSpeed: typeof props.zoomSpeed !== 'undefined' ? props.zoomSpeed : 1,
    renderOnDirty: typeof props.renderOnDirty !== undefined ? !!props.renderOnDirty : false
  }

  var aspect = getWidth() / getHeight();
  cameraState.frustumWidth *= aspect;
  cameraState.frustumHeight = cameraState.frustumWidth * (1 / aspect);

  function getWidth() {
    return canvas ? canvas.offsetWidth : window.innerWidth
  }

  function getHeight() {
    return canvas ? canvas.offsetHeight : window.innerHeight
  }

  mouseChange(canvas, function (buttons, x, y) {
    // Rotate
    if (buttons & 1) {
      var dx = (x - prevX) / getWidth()
      var dy = (y - prevY) / getHeight()

      if(dx !== 0){
        setAxisAngle(rotationQuat, cameraState.up, -dx * 5);
        transformQuat(cameraState.eye, cameraState.eye, rotationQuat);
        transformQuat(cameraState.right, cameraState.right, rotationQuat);
      }

      if(dy !== 0){
        setAxisAngle(rotationQuat, cameraState.right, -dy * 5);
        transformQuat(cameraState.eye, cameraState.eye, rotationQuat);
        transformQuat(cameraState.up, cameraState.up, rotationQuat);
      }
      // console.log(cameraState.eye);
    }

    // Pan
    if (buttons & 4) {
      var dx = (x - prevX) / getWidth()
      var dy = (y - prevY) / getHeight()

      if(dx !== 0){
        let normalEye = new Float32Array(3);
        normalize(normalEye, cameraState.eye);
        cross(right, normalEye, cameraState.up);
        scale(right, right, dx * cameraState.frustumWidth );
        add(cameraState.eye, cameraState.eye, right);
        add(cameraState.center, cameraState.center, right);
      }

      if(dy !== 0){
        let normalEye = new Float32Array(3);
        normalize(normalEye, cameraState.eye);

        copy(panUp, cameraState.up);
        scale(panUp, panUp, dy * cameraState.frustumHeight);
        // console.log(panUp);

        add(cameraState.eye, cameraState.eye, panUp);
        add(cameraState.center, cameraState.center, panUp);
      }
    }

    prevX = x
    prevY = y
  })

  mouseWheel(canvas, function (dx, dy) {
    // Perspective
    // if (dy < 0) {
    //   scale(cameraState.eye, cameraState.eye, zoomInScale);
    // } else {
    //   scale(cameraState.eye, cameraState.eye, 1 / zoomInScale);
    // }

    // Orthographic
    if (dy < 0) {
      cameraState.frustumWidth *= zoomInScale;
      cameraState.frustumHeight *= zoomInScale;
    } else {
      cameraState.frustumWidth *= 1 / zoomInScale;
      cameraState.frustumHeight *= 1 / zoomInScale;
    }
  }, true)

  /*        perspective(cameraState.projection,
          0.785,
          window.innerWidth / window.innerHeight,
          cameraState.near,
          cameraState.far)
*/

  var injectContext = regl({
    context: Object.assign({}, cameraState, {
      dirty: function () {
        return cameraState.dirty;
      },
      projection: function (context) {
        ortho(
          cameraState.projection,
          -( cameraState.frustumWidth / 2),
          ( cameraState.frustumWidth / 2),
          -( cameraState.frustumHeight / 2 ),
          ( cameraState.frustumHeight / 2 ),
          cameraState.near,
          cameraState.far  
        )
        return cameraState.projection
      }
    }),
    uniforms: Object.keys(cameraState).reduce(function (uniforms, name) {
      uniforms[name] = regl.context(name)
      return uniforms
    }, {})
  })

  function setupCamera(props, block) {
    // If no regl block argument was passed, then props is probably the regl block
    if (!block) {
      block = props
      props = {}
    }

    lookAt(cameraState.view, cameraState.eye, cameraState.center, cameraState.up)

    // updateCamera(props)
    injectContext(block)
  }

  return setupCamera
}

export default createCamera;