const { difference } = require("@jscad/csg/api").booleanOps;


function subtract(bodies) {
  return Object.freeze(difference(bodies));
}

export default subtract;