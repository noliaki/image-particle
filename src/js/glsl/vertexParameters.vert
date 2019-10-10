uniform float uProgress;
uniform float uTime;
uniform vec2 uSize;
uniform sampler2D map;
attribute vec4 aStartPosition;
attribute vec4 aEndPosition;
attribute vec4 aDelayDuration;
attribute vec4 aControl0;
attribute vec4 aControl1;
attribute vec4 aStaggerTime;
attribute vec4 aStagger;
attribute vec4 aScale;
attribute vec4 aRotate;
const float rad = PI / 180.0;

vec3 hsv(float h, float s, float v){
  vec4 t = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(vec3(h) + t.xyz) * 6.0 - vec3(t.w));
  return v * mix(vec3(t.x), clamp(p - vec3(t.x), 0.0, 1.0), s);
}

vec3 dPosition(float u, float v, float r){
  float theta = PI2 * u;
  float phi = acos(2.0 * v - 1.0);

  return vec3(sin(theta) * sin(phi) * r, cos(theta) * sin(phi) * r, cos(phi) * r);
}
