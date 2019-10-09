vec2 p = (aEndPosition.xy + uSize / 2.0) / uSize;
vec4 beforeColor = texture2D(map, p);
vec4 afterColor = texture2D(map2, p);
// float tProgress = mod(uTime / 50., interval + delay) - delay;
float tProgress = clamp(uProgress - aDelayDuration.x, 0.0, aDelayDuration.y) / aDelayDuration.y;
tProgress = easeCubicInOut(tProgress);
vec4 texelColor = beforeColor + (afterColor - beforeColor) * tProgress;
float colorAvg = (texelColor.r + texelColor.g + texelColor.b / 3.0);
vec4 rotate = quatFromAxisAngle(vec3(aRotate), rad * aRotate.w * (uTime / aStaggerTime.x) * (1.0 - tProgress));

float lat = (uTime / aStaggerTime.y) + aStagger.x;
float lng = (uTime / aStaggerTime.z) + aStagger.y;

float phi = lat * rad;
float theta = (lng - 180.0) * rad;
float staggerProgress = sin((uTime + aStaggerTime.w) / aStaggerTime.x) * (1.0 - tProgress);
float xDist = -(aStagger.w * staggerProgress) * cos(theta) * cos(phi);
float yDist = (aStagger.w * staggerProgress) * sin(phi);
float zDist = (aStagger.w * staggerProgress) * cos(phi) * sin(theta);
// float scaleRate = max(1.0, aScale.x * (1.0 - tProgress) * smoothstep(0.0, 0.5, sin(uTime / 100.0)));
float scaleRate = 1.0 - ((mod(uTime / 2.0, aScale.z) / aScale.z)) * step(0.9, aScale.w);
float scale = max(1.0, scaleRate * aScale.x * (1.0 - tProgress));
