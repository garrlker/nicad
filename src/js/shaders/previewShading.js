export const previewVertex = `
precision mediump float;
uniform mat4 projection, view;
uniform vec4 color;
attribute vec3 position, normal;
varying vec4 vcolor;
void main () {
  vcolor = color;
  gl_Position = projection * view * vec4(position, 1.0);
}`;

export const previewFragment = `
precision mediump float;
uniform vec3 eye;
uniform vec4 color;
void main () {
  gl_FragColor = color * vec4(1.0,1.0,1.0,0.6);
}`;