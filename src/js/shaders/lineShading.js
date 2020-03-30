export const lineVertex = `
precision mediump float;
uniform mat4 projection, view;
attribute vec3 position;
void main () {
  gl_Position = projection * view * vec4(position, 1.0);
}`;

export const lineFragment = `
precision mediump float;
void main () {
  gl_FragColor = vec4(0.0,0.0,0.0,1.0);
}`;