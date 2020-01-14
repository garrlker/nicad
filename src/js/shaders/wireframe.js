import * as THREE from 'three';

function setupAttributes( geometry ) {
  var vectors = [
    new THREE.Vector3( 1, 0, 0 ),
    new THREE.Vector3( 0, 1, 0 ),
    new THREE.Vector3( 0, 0, 1 )
  ];
  var position = geometry.attributes.position;
  var centers = new Float32Array( position.count * 3 );
  for ( var i = 0, l = position.count; i < l; i ++ ) {
    vectors[ i % 3 ].toArray( centers, i * 3 );
  }
  geometry.setAttribute( 'center', new THREE.BufferAttribute( centers, 3 ) );
}

let wireframeFragment = `
uniform float widthFactor;
varying vec3 vCenter;

float edgeFactorTri() {
  vec3 d = fwidth( vCenter.xyz );
  vec3 a3 = smoothstep( vec3( 0.0 ), d * widthFactor, vCenter.xyz );
  return min( min( a3.x, a3.y ), a3.z );
}

void main() {
  if ( edgeFactorTri() > 0.99 ) discard;
  gl_FragColor = gl_FrontFacing ? vec4( 0.9, 0.9, 1.0, 1.0 ) : vec4( 0.4, 0.4, 0.5, 1.0 );
}
`;


let wireframeVertex = `
attribute vec3 center;
varying vec3 vCenter;

void main() {
  vCenter = center;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;

export { setupAttributes, wireframeVertex, wireframeFragment };