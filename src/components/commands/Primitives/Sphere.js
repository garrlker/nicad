const { sphere } = require("@jscad/csg/api").primitives3d;

function createSphere(r, center = true) {
  return Object.freeze(sphere({ r, center }));
}

export { createSphere };
