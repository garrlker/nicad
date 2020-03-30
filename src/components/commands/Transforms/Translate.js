const { translate } = require("@jscad/csg/api").transformations;


function translateMesh(offset, bodies) {
  return Object.freeze(translate(offset, bodies));
}

export default translateMesh;