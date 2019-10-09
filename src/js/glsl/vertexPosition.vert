transformed = rotateVector(rotate, transformed);
transformed *= scale;
transformed.xyz += cubicBezier(aStartPosition.xyz, aControl0.xyz, aControl1.xyz, aEndPosition.xyz, tProgress);
transformed.x += xDist;
transformed.y += yDist;
transformed.z += zDist;
