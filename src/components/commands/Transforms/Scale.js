const { scale } = require("@jscad/csg/api").transformations;


function scaleMesh(factor, bodies) {
  return Object.freeze(scale(factor, bodies));
}

export default scaleMesh;