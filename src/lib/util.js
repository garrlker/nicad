/* eslint-disable */
import * as THREE from 'three';
const debug = require('debug')('utils');

/* TODO:
 * Cap the mesh at 65000 vertices
 * Cache faces
 * 
 * 
 */

function csgToGeometry(inputGeometry){
  // Canons the geometry, i dont know

  // var csg = inputGeometry.canonicalized(); // Do we need to canonicalize?
  var csg = inputGeometry;

  // Geometry Attributes
  var preindices = [];
  var indices = [];
  var vertices = [];

  // Tag Indices for Geometry Attributes
  var vertexTagIndex = {};
  var indexTagIndex = {};

  // Debug Stats
  var uniqueTags = 0;
  var triangleCount = 0;
  var vertexCount = 0;

  // Process the input geometry
  csg.toTriangles().forEach( (triangle, triangleIndex) => {
    
    var currentTags= [];

    // debug("Length", triangle.vertices.length);

    // Triangle
    if(triangle.vertices.length === 3){
      // debug("Triangle", triangle.vertices);
      // Push vertices into array
      triangle.vertices.forEach( (vertex, vertexIndex) => {
        let vertexTag = vertex.getTag();
        var currentIndex = indices.length;
  
        // If tag doesn't exists, create one
        // if(!vertexTagIndex[vertexTag]){
        vertices.push(vertex.pos._x, vertex.pos._y, vertex.pos._z);
        //vertexTagIndex[vertexTag] = currentIndex; // Now we know that this tag corresponds to this index in our vertices array
        currentTags.push(vertexCount);
        // indices.push(currentIndex); // Push the current face index into our indices array
        // }else{
        // debug("Non Unique Tag", vertices[vertexTagIndex[vertexTag]], vertex);
        // uniqueTags += 1;
        // indices.push(vertexTagIndex[vertexTag]); // Fetch then push the current face index into our indices array
        // }

        vertexCount += 1;
      });

      indices.push(currentTags[0]);
      indices.push(currentTags[1]);
      indices.push(currentTags[2]);
    }
    
    triangleCount += 1;
  });
  var n = 3;
  debug(`\n triangles: ${triangleCount} \n Vertices: ${vertexCount} \n Unique Vertex Tags: ${uniqueTags}`)
  debug("csgToGeometry - vertices", vertices.reduce((r, e, i) =>
  (i % n ? r[r.length - 1].push(e) : r.push([e])) && r
, []));
  debug("csgToGeometry - indices", indices);

  // The mesh we return on output
  var outputGeometry = new THREE.BufferGeometry();

  outputGeometry.setIndex(new THREE.BufferAttribute(new Uint16Array(indices), 1));
  outputGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( new Float32Array(vertices), 3 ) );
  // geometry.setAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ) );
  // geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
  outputGeometry.computeVertexNormals();

  return outputGeometry;
}

export { csgToGeometry };