var mouseChange = require("mouse-change");
var mouseWheel = require("mouse-wheel");
import Hammer from "hammerjs";

import { mat4, vec3, quat } from "gl-matrix";

var { setAxisAngle } = quat;

function createCamera(regl, props_) {
  var canvas = regl._gl.canvas;
  var props = props_ || {};
  var eye = [0, 0, 100];
  var rotationQuat = [0, 0, 0, 0];
  var modelCenter = [0, 0, 0]; //TODO: Models can have non 0,0,0 centers, this is hardcoded for now. Should be prop in future

  // Camera Settings
  var zoomScale = 0.8;

  // Internal
  var prevX, prevY;
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
    near: typeof props.near !== "undefined" ? props.near : -1000,
    far: typeof props.far !== "undefined" ? props.far : 1000.0,
    frustumWidth: 100,
    frustumHeight: 100,
    rotationSpeed:
      typeof props.rotationSpeed !== "undefined" ? props.rotationSpeed : 1,
    zoomSpeed: typeof props.zoomSpeed !== "undefined" ? props.zoomSpeed : 1,
    renderOnDirty:
      typeof props.renderOnDirty !== undefined ? !!props.renderOnDirty : false
  };

  var aspect = getWidth() / getHeight();
  cameraState.frustumWidth *= aspect;
  cameraState.frustumHeight = cameraState.frustumWidth * (1 / aspect);

  // TODO: Regl does pass width and height as context variables, should use those instead of our own functions
  function getWidth() {
    return canvas ? canvas.offsetWidth : window.innerWidth;
  }

  function getHeight() {
    return canvas ? canvas.offsetHeight : window.innerHeight;
  }

  /* Mouse Controls */
  mouseChange(canvas, function(buttons, x, y) {
    if (buttons & 1) {
      var dx = (x - prevX) / getWidth();
      var dy = (y - prevY) / getHeight();

      rotateCamera(dx, dy);
    }

    if (buttons & 4) {
      var dx = (x - prevX) / getWidth();
      var dy = (y - prevY) / getHeight();

      panCamera(dx, dy);
    }

    prevX = x;
    prevY = y;
  });

  mouseWheel(
    canvas,
    function(_dx, scrollDelta, _dz, ev) {
      var x = ev.clientX;
      var y = ev.clientY;
      var centerX = getWidth() / 2;
      var centerY = getHeight() / 2;

      var dx = (centerX - x) / getWidth();
      var dy = (centerY - y) / getHeight();

      panCamera(dx, dy);
      zoomCamera(scrollDelta > 0 ? 1 / zoomScale : zoomScale);
      panCamera(-dx, -dy);
    },
    true
  );

  /* Touch Controls */
  var mc = new Hammer(canvas, {});

  // Compute delta values with these
  var touchPrevX, touchPrevY, prevScale, prevPanX, prevPanY, prevAngle;

  // Recognizers
  var pan = new Hammer.Pan({
    direction: Hammer.DIRECTION_ALL,
    pointers: 1,
    threshold: 24
  });
  var pinch = new Hammer.Pinch();
  var rotate = new Hammer.Rotate();

  // we want to detect both the same time
  pinch.recognizeWith(rotate);

  // Register Recognizers
  mc.add([pan, pinch, rotate]);

  mc.on("panleft panright panup pandown", function(ev) {
    // A desktop mouse will still fire the pan handler in hammerjs, we don't want that
    if (ev.pointerType === "mouse") {
      return;
    }

    if (touchPrevX && touchPrevY) {
      var dx = (ev.deltaX - touchPrevX) / getWidth();
      var dy = (ev.deltaY - touchPrevY) / getHeight();

      // X and Y Axis camera rotation
      rotateCamera(dx, dy);
    }

    touchPrevX = ev.deltaX;
    touchPrevY = ev.deltaY;
  });

  mc.on("panend", function(ev) {
    ev.pointers.length === 1;
    touchPrevX = undefined;
    touchPrevY = undefined;
  });

  mc.on("pinchstart", function(ev) {
    prevScale = ev.scale;
  });

  // Pan the Camera
  mc.on("pinchmove rotatemove", ev => {
    if (prevPanX && prevPanY) {
      panCamera(
        (ev.deltaX - prevPanX) / getWidth(),
        (ev.deltaY - prevPanY) / getHeight()
      );
    }
    prevPanX = ev.deltaX;
    prevPanY = ev.deltaY;
  });

  mc.on("pinch rotate", function(ev) {
    // Pinch Zoom
    if (prevScale) {
      zoomCamera(1 + (prevScale - ev.scale));
    }

    // Z-Axis Roll
    // TODO: There is a noticable "jump" when the angle crosses a multiple of 360
    if (prevAngle) {
      rotateCamera(0, 0, (prevAngle - ev.rotation) / 360);
    }
    prevAngle = ev.rotation;
    prevScale = ev.scale;
  });

  // Clear Pan/Zoom/Roll variables
  mc.on("pinchend rotateend", function(ev) {
    prevAngle = undefined;
    prevScale = undefined;
    prevPanX = undefined;
    prevPanY = undefined;
  });

  /* Camera Functions */
  function rotateCamera(xDelta, yDelta, zDelta) {
    let difference = [0, 0, 0];
    vec3.sub(difference, cameraState.target, modelCenter);

    if (xDelta !== 0) {
      setAxisAngle(rotationQuat, cameraState.up, -xDelta * 5);
      vec3.transformQuat(cameraState.eye, cameraState.eye, rotationQuat);
      vec3.transformQuat(cameraState.right, cameraState.right, rotationQuat);
      vec3.transformQuat(difference, difference, rotationQuat);
    }

    if (yDelta !== 0) {
      setAxisAngle(rotationQuat, cameraState.right, -yDelta * 5);
      vec3.transformQuat(cameraState.eye, cameraState.eye, rotationQuat);
      vec3.transformQuat(cameraState.up, cameraState.up, rotationQuat);
      vec3.transformQuat(difference, difference, rotationQuat);
    }

    if (zDelta && zDelta !== 0) {
      let normalEye = [0, 0, 0];
      vec3.normalize(normalEye, cameraState.eye);

      setAxisAngle(rotationQuat, normalEye, -zDelta * 5);
      vec3.transformQuat(cameraState.eye, cameraState.eye, rotationQuat);
      vec3.transformQuat(cameraState.up, cameraState.up, rotationQuat);
      vec3.transformQuat(cameraState.right, cameraState.right, rotationQuat);
      vec3.transformQuat(difference, difference, rotationQuat);
    }

    vec3.add(difference, difference, modelCenter);
    vec3.copy(cameraState.target, difference);
  }

  /* 
   *  TODO: This math is slightly wrong atleast on the screen X axis, my screen Y axis is perfect,
   *       but it is probably slightly wrong too
   */
  function panCamera(xDelta, yDelta) {
    if (xDelta !== 0) {
      let normalEye = new Float32Array(3);
      vec3.normalize(normalEye, cameraState.eye);

      vec3.cross(right, normalEye, cameraState.up);
      vec3.scale(right, right, xDelta * cameraState.frustumWidth);

      vec3.add(cameraState.eye, cameraState.eye, right);
      vec3.add(cameraState.target, cameraState.target, right);
    }

    if (yDelta !== 0) {
      let normalEye = new Float32Array(3);
      vec3.normalize(normalEye, cameraState.eye);

      vec3.copy(panUp, cameraState.up);
      vec3.scale(panUp, panUp, yDelta * cameraState.frustumHeight);

      vec3.add(cameraState.eye, cameraState.eye, panUp);
      vec3.add(cameraState.target, cameraState.target, panUp);
    }
  }

  function zoomCamera(zoomScale) {
    // Perspective
    // vec3.scale(cameraState.eye, cameraState.eye, zoomScale);

    // Orthographic
    cameraState.frustumWidth *= zoomScale;
    cameraState.frustumHeight *= zoomScale;
  }

  var injectContext = regl({
    context: Object.assign({}, cameraState, {
      dirty: function() {
        return cameraState.dirty;
      },
      projection: function(context) {
        mat4.ortho(
          cameraState.projection,
          -(cameraState.frustumWidth / 2),
          cameraState.frustumWidth / 2,
          -(cameraState.frustumHeight / 2),
          cameraState.frustumHeight / 2,
          cameraState.near,
          cameraState.far
        );
        return cameraState.projection;
      }
    }),
    uniforms: Object.keys(cameraState).reduce(function(uniforms, name) {
      uniforms[name] = regl.context(name);
      return uniforms;
    }, {})
  });

  function setupCamera(props, block) {
    // If no regl block argument was passed, then props is probably the regl block
    if (!block) {
      block = props;
      props = {};
    }

    mat4.lookAt(
      cameraState.view,
      cameraState.eye,
      cameraState.target,
      cameraState.up
    );

    // updateCamera(props)
    injectContext(block);
  }

  return setupCamera;
}

export default createCamera;
