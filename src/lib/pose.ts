import { FilesetResolver, PoseLandmarker, DrawingUtils, NormalizedLandmark } from "@mediapipe/tasks-vision";

export type PoseResult = {
  landmarks: NormalizedLandmark[] | null;
};

export async function createPoseLandmarker() {
  const fileset = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.8/wasm"
  );
  const landmarker = await PoseLandmarker.createFromOptions(fileset, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
    },
    runningMode: "VIDEO",
    numPoses: 1,
  });
  return landmarker;
}

export const JOINT = {
  NOSE: 0,
  LEFT_EYE_INNER: 1,
  LEFT_EYE: 2,
  LEFT_EYE_OUTER: 3,
  RIGHT_EYE_INNER: 4,
  RIGHT_EYE: 5,
  RIGHT_EYE_OUTER: 6,
  LEFT_EAR: 7,
  RIGHT_EAR: 8,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
} as const;

export function calcAngle(a: NormalizedLandmark, b: NormalizedLandmark, c: NormalizedLandmark) {
  const ab = { x: a.x - b.x, y: a.y - b.y };
  const cb = { x: c.x - b.x, y: c.y - b.y };
  const dot = ab.x * cb.x + ab.y * cb.y;
  const magAB = Math.hypot(ab.x, ab.y);
  const magCB = Math.hypot(cb.x, cb.y);
  const cos = dot / (magAB * magCB + 1e-6);
  const angle = Math.acos(Math.max(-1, Math.min(1, cos)));
  return (angle * 180) / Math.PI;
}

export function drawLandmarksOnCanvas(canvas: HTMLCanvasElement, video: HTMLVideoElement, landmarks: NormalizedLandmark[] | null) {
  if (!canvas || !video) return;
  const w = video.videoWidth || video.clientWidth;
  const h = video.videoHeight || video.clientHeight;
  if (canvas.width !== w) canvas.width = w;
  if (canvas.height !== h) canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!landmarks) return;
  const utils = new DrawingUtils(ctx);
  utils.drawLandmarks(landmarks, { color: "#7c3aed", radius: 2 });
  // @ts-ignore - PoseLandmarker exposes POSE_CONNECTIONS
  utils.drawConnectors(landmarks as any, (PoseLandmarker as any).POSE_CONNECTIONS, { color: "#06b6d4", lineWidth: 2 });
}
