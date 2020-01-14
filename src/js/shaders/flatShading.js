export const flatShadingVert = `
precision mediump float;
uniform mat4 projection, view;
attribute vec3 position, normal;
attribute vec4 color;
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
varying vec3 vnormal;
varying vec4 vcolor;
void main () {
  gl_FragColor = vcolor * ( vec4(1.0,1.0,1.0,1.0) * clamp(dot(normalize(eye), normalize(vnormal)), 0.0, 1.0));
}`;