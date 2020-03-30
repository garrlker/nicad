export const phongVertex = `
precision mediump float;
uniform mat4 projection, view;
attribute vec3 position, normal;
attribute vec4 color;
varying vec3 vnormal;
varying vec3 vFragPos;
varying vec4 vcolor;
void main () {
  vnormal = normal;
  vcolor = color;
  // vFragPos = vec3(model * vec4(position, 1.0));
  vFragPos = position;
  gl_Position = projection * view * vec4(position, 1.0);
}`;

export const phongFragment = `
precision mediump float;
uniform vec3 eye;
varying vec3 vnormal;
varying vec3 vFragPos;
varying vec4 vcolor;
vec3 lightColor = vec3(1.0, 1.0, 1.0);
void main () {
  // Ambient
  float ambientStrength = 0.1;
  vec3 ambient = ambientStrength * lightColor;

  //Diffuse
  // vec3 lightPos = vec3(10.0, 10.0, 10.0);
  vec3 lightPos = eye;
  vec3 norm = normalize(vnormal);
  vec3 lightDir = normalize(lightPos - vFragPos); 
  float diff = max(dot(norm, lightDir), 0.0);
  vec3 diffuse = diff * lightColor;


  //Specular
  float specularStrength = 1.0;
  vec3 viewDir = normalize(eye - vFragPos);
  vec3 reflectDir = reflect(-lightDir, norm);  
  float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
  vec3 specular = specularStrength * spec * lightColor; 
  vec3 result = (ambient + diffuse + specular) * vcolor.xyz;

  gl_FragColor = vec4(result, 1.0);
}`;