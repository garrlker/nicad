const { cylinder } = require("@jscad/csg/api").primitives3d;
const { scale } = require("@jscad/csg/api").transformations;
import Node from "../../../js/feature";

function createCylinder(r, len, center = true) {
  return new Node("Cylinder", "Cylinder", Object.freeze(scale([1, 1, len], cylinder({ r, center }))));
}

export { createCylinder };
