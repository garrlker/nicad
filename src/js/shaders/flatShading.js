export const flatShadingVert = `
precision mediump float;
uniform mat4 projection, view;
uniform vec4 color;
attribute vec3 position, normal;
varying vec3 vnormal;
varying vec4 vcolor;
void main () {
  vnormal = normal;
  vcolor = color;
  gl_Position = projection * view * vec4(position, 1.0);
}`;

export const flatShadingFrag = `
precision mediump float;
uniform vec3 eye;
uniform vec4 color;
varying vec3 vnormal;
void main () {
  gl_FragColor = color * ( vec4(1.0,1.0,1.0,1.0) * clamp(dot(normalize(eye), normalize(vnormal)), 0.0, 1.0));
}`;