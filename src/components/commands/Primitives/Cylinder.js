const { cylinder } = require("@jscad/csg/api").primitives3d;
const { scale } = require("@jscad/csg/api").transformations;

function createCylinder(r, len, center = true) {
  return Object.freeze(scale([1, 1, len], cylinder({ r, center })));
}

export { createCylinder };
