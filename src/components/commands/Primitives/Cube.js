const { cube } = require("@jscad/csg/api").primitives3d;
import Node from "../../../js/feature";

function createCube(size, center = true) {
  return new Node("Cube", "Cube", Object.freeze(cube({ size, center })));
}

export { createCube };
