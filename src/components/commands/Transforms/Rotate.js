const { rotate } = require("@jscad/csg/api").transformations;


function rotateMesh(direction, bodies) {
  return Object.freeze(rotate(direction, bodies));
}

export default rotateMesh;