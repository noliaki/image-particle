transformed = rotateVector(rotate, transformed);
transformed *= scale;
transformed.xyz += cubicBezier(aStartPosition.xyz, vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), aEndPosition.xyz, tProgress);
transformed.x += xDist;
transformed.y += yDist;
transformed.z += zDist;
