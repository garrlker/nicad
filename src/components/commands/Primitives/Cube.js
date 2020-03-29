const { cube } = require("@jscad/csg/api").primitives3d;

function createCube(size, center = true) {
  return Object.freeze(cube({ size, center }));
}

export { createCube };
