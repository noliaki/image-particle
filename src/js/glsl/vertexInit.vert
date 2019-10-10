float tProgress = clamp(uProgress - aDelayDuration.x, 0.0, aDelayDuration.y) / aDelayDuration.y;
tProgress = easeCubicInOut(tProgress);
float revProgress = 1.0 - tProgress;
vec2 p = (aEndPosition.xy + uSize / 2.0) / uSize;
float noise = snoise(vec3(aStagger.x, aStagger.y, uTime / 1000.0));
vec4 hsvColor = vec4(hsv(sin(uTime / 100.0) + aStaggerTime.w, 0.4, 0.7), 1.0);
vec4 endColor = texture2D(map, p);
vec4 texelColor = hsvColor + (endColor - hsvColor) * tProgress + abs(sin(uTime / 5.0)) * revProgress * step(0.9, aScale.w);
float angle = rad * aRotate.w * ((uTime + aStaggerTime.z) / aStaggerTime.x) * revProgress;
vec4 rotate = quatFromAxisAngle(vec3(aRotate), angle);

float lat = (uTime / aStaggerTime.y) + aStagger.x;
float lng = (uTime / aStaggerTime.z) + aStagger.y;

float phi = lat * rad;
float theta = (lng - 180.0) * rad;
vec3 offsetPosition = dPosition(abs(cos((uTime + aStaggerTime.x) / 1000.0)), abs(sin((uTime + aStaggerTime.y) / 1000.0)), aStagger.w);
float xDist = offsetPosition.x * noise * revProgress;
float yDist = offsetPosition.y * noise * revProgress;
float zDist = offsetPosition.z * noise * revProgress;
float scaleRate = 1.0 - ((mod(uTime / 2.0, aScale.z) / aScale.z)) * step(0.5, aScale.w);
float scale = max(1.0, scaleRate * aScale.x * revProgress);
