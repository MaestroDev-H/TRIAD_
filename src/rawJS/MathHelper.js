// export function calculateTriangleVertices(x1, y1, height, width) {
//   // Ensure that the top vertex is always above the base vertices
//   const x2 = x1 - width / 2;
//   const y2 = y1 + height; // Adjusted to ensure the base is below the top vertex

//   const x3 = x1 + width / 2;
//   const y3 = y1 + height; // Adjusted to ensure the base is below the top vertex

//   return [x1, y1, x2, y2, x3, y3];
// }
export function calculateTriangleVertices(x1, y1, height) {
  // Calculate the side length of the equilateral triangle based on the height
  const sideLength = (2 * height) / Math.sqrt(3);

  // Ensure that the top vertex is at (x1, y1), and calculate the other two vertices
  const x2 = x1 - sideLength / 2;
  const y2 = y1 + height; // Base vertex on the left

  const x3 = x1 + sideLength / 2;
  const y3 = y1 + height; // Base vertex on the right

  return [x1, y1, x2, y2, x3, y3];
}

export function calculateCentroid(x1, y1, x2, y2, x3, y3) {
  const x_c = Math.abs(x1 + x2 + x3) / 3;
  const y_c = Math.abs(y1 + y2 + y3) / 3;
  return { x: x_c, y: y_c };
}

export function distanceCalculator(x1, y1, x2, y2, h, k, r) {
  const A = y2 - y1;
  const B = x1 - x2;
  const C = x2 * y1 - x1 * y2;

  // Perpendicular distance from point (h, k) to the line Ax + By + C = 0
  const distance = Math.abs(A * h + B * k + C) / Math.sqrt(A * A + B * B);

  // Check if the perpendicular from (h, k) to the line actually intersects the segment
  const dotProduct1 = (h - x1) * (x2 - x1) + (k - y1) * (y2 - y1);
  const dotProduct2 = (h - x2) * (x1 - x2) + (k - y2) * (y1 - y2);
  if (dotProduct1 >= 0 && dotProduct2 >= 0) {
    return distance; // The perpendicular does intersect the segment
  }

  // If not, return the distance to the closest endpoint
  const distanceToPoint1 = Math.sqrt((h - x1) * (h - x1) + (k - y1) * (k - y1));
  const distanceToPoint2 = Math.sqrt((h - x2) * (h - x2) + (k - y2) * (k - y2));
  return Math.min(distanceToPoint1, distanceToPoint2);
}
export function keepCircleInsideTriangle(circle, triangle) {
  const [A, B, C] = triangle;
  const { x: cx, y: cy, radius } = circle;

  // Calculate the centroid of the triangle
  const centroid = {
    x: (A.x + B.x + C.x) / 3,
    y: (A.y + B.y + C.y) / 3,
  };

  function sign(p1, p2, p3) {
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
  }

  function isPointInTriangle(pt, v1, v2, v3) {
    const d1 = sign(pt, v1, v2);
    const d2 = sign(pt, v2, v3);
    const d3 = sign(pt, v3, v1);

    const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
    const hasPos = d1 > 0 || d2 > 0 || d3 > 0;

    return !(hasNeg && hasPos);
  }

  function closestPointOnSegment(px, py, ax, ay, bx, by) {
    const abx = bx - ax;
    const aby = by - ay;
    const apx = px - ax;
    const apy = py - ay;
    const abLenSq = abx * abx + aby * aby;
    const abDotAp = abx * apx + aby * apy;
    const t = Math.max(0, Math.min(1, abDotAp / abLenSq));
    return { x: ax + t * abx, y: ay + t * aby };
  }

  // Calculate closest point on each triangle edge
  const closestAB = closestPointOnSegment(cx, cy, A.x, A.y, B.x, B.y);
  const closestBC = closestPointOnSegment(cx, cy, B.x, B.y, C.x, C.y);
  const closestCA = closestPointOnSegment(cx, cy, C.x, C.y, A.x, A.y);

  // Find the closest point among the three edges
  const distAB = Math.hypot(closestAB.x - cx, closestAB.y - cy);
  const distBC = Math.hypot(closestBC.x - cx, closestBC.y - cy);
  const distCA = Math.hypot(closestCA.x - cx, closestCA.y - cy);

  let closestPoint = closestAB;
  let minDist = distAB;

  if (distBC < minDist) {
    closestPoint = closestBC;
    minDist = distBC;
  }

  if (distCA < minDist) {
    closestPoint = closestCA;
    minDist = distCA;
  }

  // Adjust the circle center to keep it inside the triangle
  const adjustedPosition = {
    x: closestPoint.x,
    y: closestPoint.y,
  };

  // If the circle is already inside the triangle, just return the original position
  if (isPointInTriangle({ x: cx, y: cy }, A, B, C)) {
    return { x: cx, y: cy };
  }

  return adjustedPosition;
}


export function calculateDistanceBetweenTwoPoint(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}
export function findMatchingCoordinate(
  x1,
  y1,
  x2,
  y2,
  x3,
  y3,
  x4,
  y4,
  x5,
  y5,
  x6,
  y6,
  tolerance
) {
  const points = [
    { x: x1, y: y1 },
    { x: x2, y: y2 },
    { x: x3, y: y3 },
    { x: x4, y: y4 },
    { x: x5, y: y5 },
    { x: x6, y: y6 },
  ];

  // Check for matching coordinates within the tolerance
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const dx = Math.abs(points[i].x - points[j].x);
      const dy = Math.abs(points[i].y - points[j].y);

      if (dx <= tolerance && dy <= tolerance) {
        return points[i]; // Return the matching coordinate
      }
    }
  }

  return null; // No matching coordinate found
}
export function getClosestPointOnLine(x1, y1, x2, y2, h, k) {
  // Calculate the vector from point 1 to point 2
  const dx = x2 - x1;
  const dy = y2 - y1;

  // Calculate the vector from point 1 to the circle's center
  const t = ((h - x1) * dx + (k - y1) * dy) / (dx * dx + dy * dy);

  // Clamp t to the range [0, 1] to ensure the point is on the segment
  const clampedT = Math.max(0, Math.min(1, t));

  // Calculate the closest point on the line segment
  const closestX = x1 + clampedT * dx;
  const closestY = y1 + clampedT * dy;

  return { x: closestX, y: closestY };
}
export function getInnerLine(x1, y1, x2, y2, x3, y3, distance) {
  // Calculate the full length of the main line
  const fullLength = Math.sqrt((x3 - x1) ** 2 + (y3 - y1) ** 2);

  // Calculate the unit direction vector for the main line
  const dx = (x3 - x1) / fullLength;
  const dy = (y3 - y1) / fullLength;

  // Normalize distance to control line length
  // const normalizedDistance = Math.max(0.01, 1 / distance);
  // const normalizedDistance = distance

  // Calculate the desired length of the inner line based on distance
  // const desiredLength = Math.min(fullLength, normalizedDistance * fullLength);
  const desiredLength = distance;

  // Calculate half of the desired length
  const halfLength = desiredLength / 2;

  // Ensure the new line doesn't exceed the bounds of the main line
  const maxHalfLength = Math.min(
    halfLength,
    Math.min(
      fullLength / 2,
      Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2),
      Math.sqrt((x3 - x2) ** 2 + (y3 - y2) ** 2)
    )
  );

  // Calculate the new points based on the direction vector and maxHalfLength
  const newX1 = x2 - dx * maxHalfLength;
  const newY1 = y2 - dy * maxHalfLength;
  const newX2 = x2 + dx * maxHalfLength;
  const newY2 = y2 + dy * maxHalfLength;

  return {
    x1: newX1,
    y1: newY1,
    x2: newX2,
    y2: newY2,
  };
}

export function calculateTriangleAngles(x1, y1, x2, y2, x3, y3) {
  // Function to calculate the distance between two points
  function distance(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
  }

  // Calculate the lengths of the sides of the triangle
  const a = distance(x2, y2, x3, y3); // Length of side opposite (x1, y1)
  const b = distance(x1, y1, x3, y3); // Length of side opposite (x2, y2)
  const c = distance(x1, y1, x2, y2); // Length of side opposite (x3, y3)

  // Law of cosines to calculate each angle in radians
  const x1y1 = Math.acos((b * b + c * c - a * a) / (2 * b * c)); // Angle at (x1, y1)
  const x2y2 = Math.acos((a * a + c * c - b * b) / (2 * a * c)); // Angle at (x2, y2)
  const x3y3 = Math.acos((a * a + b * b - c * c) / (2 * a * b)); // Angle at (x3, y3)

  // Convert the angles from radians to degrees
  return {
    x1y1: (x1y1 * 180) / Math.PI,
    x2y2: (x2y2 * 180) / Math.PI,
    x3y3: (x3y3 * 180) / Math.PI,
  };
}

export function findClosestTwoPoints(refPoint, points) {
  let distances = [];

  // Calculate the distance from the reference point to each of the other points
  for (let i = 0; i < points.length; i++) {
    const distance = calculateDistanceBetweenTwoPoint(
      refPoint.x,
      refPoint.y,
      points[i].x(), // Accessing x via the current property
      points[i].y() // Accessing y via the current property
    );
    distances.push({ point: points[i], distance: distance });
  }

  // Sort the array based on the distances
  distances.sort((a, b) => a.distance - b.distance);

  // Return the original object references for the two closest points
  return [distances[0].point, distances[1].point];
}

export function getMidPoint(x1, y1, x2, y2) {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  return { x: midX, y: midY };
}

export function connectWithCorner(x1, y1, x2, y2, alignAxis) {
  // Check if a 90-degree corner is possible
  if (x1 === x2 || y1 === y2) {
      return [x1, y1, x2, y2]; // Points are already aligned, no 90-degree corner possible
  }

  let center = { x: x1, y: y1 }; // The point where we turn 90 degrees

  // Align along the specified axis
  if (alignAxis === 'x') {
      center.x = x2; // Align x with point2
  } else if (alignAxis === 'y') {
      center.y = y2; // Align y with point2
  }

  // Return [x1, y1, center.x, center.y, x2, y2]
  return [x1, y1, center.x, center.y, x2, y2];
}


export function calculateSlicePositions(y, width, slices, itemWidth, gap) {
  const totalItemWidth = slices * itemWidth; // Total width of all items
  const totalGapWidth = (slices - 1) * gap; // Total width of all gaps
  const totalWidth = totalItemWidth + totalGapWidth; // Total width of items + gaps

  // Calculate starting x position to center the items
  const startX = (width - totalWidth) / 2;

  let positions = [];

  for (let i = 0; i < slices; i++) {
    // Calculate the x position for each slice
    const xPosition = startX + i * (itemWidth + gap);
    positions.push({ x: xPosition, y: y });
  }

  return positions;
}

export function fixLeftRight(leftPoint, rightPoint) {

    // Check if the leftPoint is actually to the left of rightPoint
    if (leftPoint.x > rightPoint.x) {
        // Swap points if leftPoint is to the right of rightPoint
        return [rightPoint, leftPoint];
    }
    
    // If already in correct order, return as is
    return [leftPoint, rightPoint];
}

export function shrinkTriangle(points, gap) {
  const [x1, y1, x2, y2, x3, y3] = points;
  const centroid=calculateCentroid(x1, y1, x2, y2, x3, y3)
  const centroidX=centroid.x
  const centroidY=centroid.y

  // Helper function to move a point towards the centroid by a fixed amount (gap)
  function movePointTowardsCentroid(x, y, centroidX, centroidY, gap) {
      const dx = centroidX - x;
      const dy = centroidY - y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Calculate the new point based on the fixed gap
      const newX = x + (dx / distance) * gap;
      const newY = y + (dy / distance) * gap;

      return [newX, newY];
  }

  // Move each vertex of the triangle towards the centroid by the gap amount
  const [newX1, newY1] = movePointTowardsCentroid(x1, y1, centroidX, centroidY, gap);
  const [newX2, newY2] = movePointTowardsCentroid(x2, y2, centroidX, centroidY, gap);
  const [newX3, newY3] = movePointTowardsCentroid(x3, y3, centroidX, centroidY, gap);

  return [newX1, newY1, newX2, newY2, newX3, newY3];
}
export function restrictCircleToLine(circle,triangle) {
  // Destructure triangle points
  const { x: x1, y: y1 } = triangle[0];
  const { x: x2, y: y2 } = triangle[1];
  const { x: x3, y: y3 } = triangle[2];

  // Destructure circle properties
  const { x: cx, y: cy, radius } = circle;

  // Calculate centroid of the triangle
  const centroidX = (x1 + x2 + x3) / 3;
  const centroidY = (y1 + y2 + y3) / 3;

  // Create lines from centroid to each corner
  const corners = [
    { x: x1, y: y1 },
    { x: x2, y: y2 },
    { x: x3, y: y3 },
  ];

  // Find the closest line to the current circle position
  let closestPoint = null;
  let minDistance = Infinity;

  for (const corner of corners) {
    // Calculate the projection of the circle's center onto the line (centroid to corner)
    const vectorX = corner.x - centroidX;
    const vectorY = corner.y - centroidY;
    const lengthSquared = vectorX * vectorX + vectorY * vectorY;
    
    // Projection factor t in the range [0,1] that keeps the point on the line segment
    const t = Math.max(0, Math.min(1, ((cx - centroidX) * vectorX + (cy - centroidY) * vectorY) / lengthSquared));

    // Compute the projected point on the line
    const projectedX = centroidX + t * vectorX;
    const projectedY = centroidY + t * vectorY;

    // Compute distance from current circle position to the projected point
    const dist = Math.sqrt((projectedX - cx) * (projectedX - cx) + (projectedY - cy) * (projectedY - cy));

    if (dist < minDistance) {
      minDistance = dist;
      closestPoint = { x: projectedX, y: projectedY };
    }
  }

  // Return the new position that restricts the circle to the closest line from centroid to corner
  return {
    x: closestPoint.x,
    y: closestPoint.y
  };
}
export function getValidPoint(circle, line) {
  // Destructure line points
  const { x: x1, y: y1 } = line[0];
  const { x: x2, y: y2 } = line[1];

  // Destructure circle properties
  const { x: cx, y: cy, radius } = circle;

  // Create vector for the line
  const vectorX = x2 - x1;
  const vectorY = y2 - y1;
  const lengthSquared = vectorX * vectorX + vectorY * vectorY;

  // Projection factor t in the range [0,1] that keeps the point on the line segment
  const t = Math.max(0, Math.min(1, ((cx - x1) * vectorX + (cy - y1) * vectorY) / lengthSquared));

  // Compute the projected point on the line
  const projectedX = x1 + t * vectorX;
  const projectedY = y1 + t * vectorY;

  // Return the new position that restricts the circle to the closest point on the line
  return {
    x: projectedX,
    y: projectedY
  };
}

export function calculateRectangleVertices(x1, y1, height, width) {
  // Calculate the coordinates of the four corners of the rectangle
  const x2 = x1 + width; // Right top corner
  const y2 = y1; // Same y-level as top-left corner

  const x3 = x1 + width; // Right bottom corner
  const y3 = y1 + height; // Moved down by height

  const x4 = x1; // Left bottom corner
  const y4 = y1 + height; // Moved down by height

  return [x1, y1, x2, y2, x3, y3, x4, y4];
}
export function calculateRadius(height, width) {
  const baseWidth = 320; // Original width for ratio
  const baseRadius = 7;  // Original radius for 320 width
  
  // Determine the longest side (width or height)
  const longestSide = Math.max(height, width);
  
  // Maintain the radius ratio based on the longest side
  const radius = (longestSide / baseWidth) * baseRadius;
  
  return radius;
}