const { sphere } = require("@jscad/csg/api").primitives3d;
import Node from "../../../js/feature";

function createSphere(r, center = true) {
  return new Node("Sphere", "Sphere", Object.freeze(sphere({ r, center })));
}

export { createSphere };
