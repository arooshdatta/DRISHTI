// Utility functions for calculating Health Metrics from MediaPipe FaceMesh landmarks

// Calculate the 3D Euclidean distance between two landmarks
export function getDistance(point1, point2) {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y;
  const dz = point1.z - point2.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// Calculate Eye Aspect Ratio (EAR) for blink detection
export function getBlinkStatus(landmarks) {
  if (!landmarks || landmarks.length === 0) return false;

  // MediaPipe FaceMesh Iris/Eye indices
  // Left eye indices
  const leftEye_p1 = landmarks[33];   // Outer corner
  const leftEye_p4 = landmarks[133];  // Inner corner
  const leftEye_p2 = landmarks[159];  // Top
  const leftEye_p6 = landmarks[145];  // Bottom
  const leftEye_p3 = landmarks[158];  // Top
  const leftEye_p5 = landmarks[153];  // Bottom

  // Right eye indices
  const rightEye_p1 = landmarks[362]; // Outer corner
  const rightEye_p4 = landmarks[263]; // Inner corner
  const rightEye_p2 = landmarks[386]; // Top
  const rightEye_p6 = landmarks[374]; // Bottom
  const rightEye_p3 = landmarks[385]; // Top
  const rightEye_p5 = landmarks[380]; // Bottom

  // Calculate EAR for both eyes
  const leftEAR = (getDistance(leftEye_p2, leftEye_p6) + getDistance(leftEye_p3, leftEye_p5)) / (2.0 * getDistance(leftEye_p1, leftEye_p4));
  const rightEAR = (getDistance(rightEye_p2, rightEye_p6) + getDistance(rightEye_p3, rightEye_p5)) / (2.0 * getDistance(rightEye_p1, rightEye_p4));

  // Average EAR
  const averageEAR = (leftEAR + rightEAR) / 2.0;

  // Blink threshold (typical range 0.15 to 0.25 depending on eye shape)
  // Making it tighter (e.g. 0.20) to prevent resting eyes triggering it.
  const BLINK_THRESHOLD = 0.20;
  return averageEAR < BLINK_THRESHOLD;
}

// Estimate approximate distance from screen using facial landmarks
export function getScreenDistance(landmarks) {
  if (!landmarks || landmarks.length === 0) return 45;

  // We use Inter-Pupillary Distance (approximate via eye centers) instead of 
  // full face bounds (forehead/chin), which tend to get cut off when the user 
  // is very close to the camera, skewing the bounding box calculation.
  const leftEyeCenter = landmarks[159];
  const rightEyeCenter = landmarks[386];

  const ipd = getDistance(leftEyeCenter, rightEyeCenter);

  if (ipd === 0) return 45; 

  // Calibrated mapping: 
  // F = Distance_actual * Distance_px
  // Adjusted IPD constant based on user feedback to be lower
  const IPD_CONSTANT = 4.8; 
  let approxCm = Math.round(IPD_CONSTANT / ipd);
  
  // Bound limit to standard laptop usage distances
  if (approxCm > 120) approxCm = 120;
  if (approxCm < 5) approxCm = 5;

  return approxCm;
}
