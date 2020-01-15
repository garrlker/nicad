var mouseChange = require('mouse-change')
var mouseWheel = require('mouse-wheel')
import Hammer from "hammerjs";

import {
  mat4,
  vec3,
  quat
} from "gl-matrix";

var {
  setAxisAngle
} = quat;

function createCamera(regl, props_) {
  var canvas = regl._gl.canvas;
  var props = props_ || {}
  var eye = [0, 0, 10];
  var rotationQuat = [0, 0, 0, 0];  
  var modelCenter = [0, 0, 0] //TODO: Models can have non 0,0,0 centers, this is hardcoded for now. Should be prop in future

  // Camera Settings
  var zoomScale = 0.8;

  // Internal
  var prevX, prevY;
  var touchPrevX = 0, touchPrevY = 0;
  var right = new Float32Array(3);
  var panUp = new Float32Array(3);

  var cameraState = {
    view: mat4.identity(new Float32Array(16)),
    projection: mat4.identity(new Float32Array(16)),
    target: new Float32Array(props.target || 3),
    eye: new Float32Array(eye),
    up: new Float32Array(props.up || [0, 1, 0]),
    right: new Float32Array([1, 0, 0]),
    fovy: props.fovy || Math.PI / 4.0,
    near: typeof props.near !== 'undefined' ? props.near : 0.01,
    far: typeof props.far !== 'undefined' ? props.far : 1000.0,
    frustumWidth: 10,
    frustumHeight: 10,
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

  /* Mouse Handling */
  mouseChange(canvas, function (buttons, x, y) {
    if (buttons & 1) {
      var dx = (x - prevX) / getWidth()
      var dy = (y - prevY) / getHeight()

      rotateCamera(dx, dy);
    }

    if (buttons & 4) {
      var dx = (x - prevX) / getWidth()
      var dy = (y - prevY) / getHeight()

      panCamera(dx, dy);
    }

    prevX = x
    prevY = y
  })

  mouseWheel(canvas, function (dx, dy) {
    zoomCamera(dy);
  }, true)

  /* Touch Handling */
  var hammer = Hammer(canvas, {});

  hammer.on('panstart', function(ev) {
    if(ev.pointerType === "mouse"){
      return;
    }

    var dx = (ev.deltaX - touchPrevX) / getWidth();
    var dy = (ev.deltaY - touchPrevY) / getHeight();

    touchPrevX = ev.deltaX;
    touchPrevY = ev.deltaY;
    console.log('panstart', touchPrevX, touchPrevY);
  });

  hammer.on('pan', function(ev) {
    // console.log(ev);
    if(ev.pointerType === "mouse"){
      return;
    }

    var dx = (ev.deltaX - touchPrevX) / getWidth();
    var dy = (ev.deltaY - touchPrevY) / getHeight();

    rotateCamera(dx, dy);
    // console.log("Touch Deltas", dx, dy);
    touchPrevX = ev.deltaX;
    touchPrevY = ev.deltaY;
    console.log("pan", touchPrevX, touchPrevY);
  });


  /* Camera Functions */
  function rotateCamera(xDelta, yDelta){
    let difference = [0, 0, 0];
    vec3.sub(difference, cameraState.target, modelCenter);

    if(xDelta !== 0){
      setAxisAngle(rotationQuat, cameraState.up, -xDelta * 5);
      vec3.transformQuat(cameraState.eye, cameraState.eye, rotationQuat);
      vec3.transformQuat(cameraState.right, cameraState.right, rotationQuat);
      vec3.transformQuat(difference, difference, rotationQuat);
    }

    if(yDelta !== 0){
      setAxisAngle(rotationQuat, cameraState.right, -yDelta * 5);
      vec3.transformQuat(cameraState.eye, cameraState.eye, rotationQuat);
      vec3.transformQuat(cameraState.up, cameraState.up, rotationQuat);
      vec3.transformQuat(difference, difference, rotationQuat);
    }

    vec3.add(difference, difference, modelCenter)
    vec3.copy(cameraState.target, difference);
  }

  function panCamera(xDelta, yDelta){
    if(xDelta !== 0){
      let normalEye = new Float32Array(3);
      vec3.normalize(normalEye, cameraState.eye);
      vec3.cross(right, normalEye, cameraState.up);
      vec3.scale(right, right, xDelta * cameraState.frustumWidth );
      vec3.add(cameraState.eye, cameraState.eye, right);
      vec3.add(cameraState.target, cameraState.target, right);
    }

    if(yDelta !== 0){
      let normalEye = new Float32Array(3);
      vec3.normalize(normalEye, cameraState.eye);

      vec3.copy(panUp, cameraState.up);
      vec3.scale(panUp, panUp, yDelta * cameraState.frustumHeight);

      vec3.add(cameraState.eye, cameraState.eye, panUp);
      vec3.add(cameraState.target, cameraState.target, panUp);
    }
  }

  function zoomCamera(yDelta){
    // Perspective
    // if (yDelta < 0) {
    //   vec3.scale(cameraState.eye, cameraState.eye, zoomScale);
    // } else {
    //   vec3.scale(cameraState.eye, cameraState.eye, 1 / zoomScale);
    // }

    // Orthographic
    if (yDelta < 0) {
      cameraState.frustumWidth *= zoomScale;
      cameraState.frustumHeight *= zoomScale;
    } else {
      cameraState.frustumWidth *= 1 / zoomScale;
      cameraState.frustumHeight *= 1 / zoomScale;
    }
  }

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
        mat4.ortho(
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

    mat4.lookAt(cameraState.view, cameraState.eye, cameraState.target, cameraState.up)

    // updateCamera(props)
    injectContext(block)
  }

  return setupCamera
}

export default createCamera;