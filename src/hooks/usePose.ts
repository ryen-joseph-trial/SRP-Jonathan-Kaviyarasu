import { useCallback, useEffect, useRef, useState } from "react";
import type { PoseLandmarker, NormalizedLandmark } from "@mediapipe/tasks-vision";
import { createPoseLandmarker, calcAngle, drawLandmarksOnCanvas, JOINT } from "@/lib/pose";

export type ExerciseKind = "squat" | "pushup" | "bicep_curl" | "generic";

export const usePose = (
  videoRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  exercise: ExerciseKind,
  onFeedback?: (type: "good" | "warning", message: string) => void
) => {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const [setCount, setSetCount] = useState(1);

  const landmarkerRef = useRef<PoseLandmarker | null>(null);
  const rafRef = useRef<number | null>(null);
  const phaseRef = useRef<"up" | "down">("up");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        landmarkerRef.current = await createPoseLandmarker();
        if (mounted) setReady(true);
      } catch (e) {
        console.error(e);
        setError(e instanceof Error ? e.message : "Failed to load pose model");
      }
    })();
    return () => {
      mounted = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const computeAngles = (lm: NormalizedLandmark[]) => {
    const leftKnee = calcAngle(lm[JOINT.LEFT_HIP], lm[JOINT.LEFT_KNEE], lm[JOINT.LEFT_ANKLE]);
    const rightKnee = calcAngle(lm[JOINT.RIGHT_HIP], lm[JOINT.RIGHT_KNEE], lm[JOINT.RIGHT_ANKLE]);
    const leftElbow = calcAngle(lm[JOINT.LEFT_SHOULDER], lm[JOINT.LEFT_ELBOW], lm[JOINT.LEFT_WRIST]);
    const rightElbow = calcAngle(lm[JOINT.RIGHT_SHOULDER], lm[JOINT.RIGHT_ELBOW], lm[JOINT.RIGHT_WRIST]);
    const leftHip = calcAngle(lm[JOINT.LEFT_SHOULDER], lm[JOINT.LEFT_HIP], lm[JOINT.LEFT_KNEE]);
    const rightHip = calcAngle(lm[JOINT.RIGHT_SHOULDER], lm[JOINT.RIGHT_HIP], lm[JOINT.RIGHT_KNEE]);
    return { leftKnee, rightKnee, leftElbow, rightElbow, leftHip, rightHip };
  };

  const updateCounters = (lm: NormalizedLandmark[]) => {
    const { leftKnee, rightKnee, leftElbow, rightElbow } = computeAngles(lm);
    if (exercise === "squat") {
      const knee = Math.min(leftKnee, rightKnee);
      if (phaseRef.current === "up" && knee < 85) phaseRef.current = "down";
      if (phaseRef.current === "down" && knee > 160) {
        phaseRef.current = "up";
        setRepCount((r) => {
          const next = r + 1;
          if (next % 10 === 0) setSetCount((s) => s + 1);
          return next;
        });
        onFeedback?.("good", "Nice squat! Drive through heels and keep chest up.");
      }
    } else if (exercise === "pushup") {
      const elbow = Math.min(leftElbow, rightElbow);
      if (phaseRef.current === "up" && elbow < 75) phaseRef.current = "down";
      if (phaseRef.current === "down" && elbow > 160) {
        phaseRef.current = "up";
        setRepCount((r) => {
          const next = r + 1;
          if (next % 10 === 0) setSetCount((s) => s + 1);
          return next;
        });
        onFeedback?.("good", "Strong push-up! Keep core tight and back straight.");
      }
    } else if (exercise === "bicep_curl") {
      const elbow = Math.min(leftElbow, rightElbow);
      if (phaseRef.current === "up" && elbow < 60) phaseRef.current = "down";
      if (phaseRef.current === "down" && elbow > 150) {
        phaseRef.current = "up";
        setRepCount((r) => r + 1);
      }
    }
  };

  const loop = useCallback(() => {
    const video = videoRef.current;
    const landmarker = landmarkerRef.current;
    if (!video || !landmarker) return;
    const now = performance.now();
    const res = landmarker.detectForVideo(video, now);
    const lm = res.landmarks?.[0] ?? null;
    drawLandmarksOnCanvas(canvasRef.current!, video, lm);
    if (lm) updateCounters(lm);
    rafRef.current = requestAnimationFrame(loop);
  }, [videoRef, canvasRef]);

  const start = () => {
    if (!ready) return;
    if (isMonitoring) return;
    setIsMonitoring(true);
    rafRef.current = requestAnimationFrame(loop);
  };

  const stop = () => {
    setIsMonitoring(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  const quickCheck = (): { type: "good" | "warning"; message: string } | null => {
    const video = videoRef.current;
    const landmarker = landmarkerRef.current;
    if (!video || !landmarker) return null;
    const res = landmarker.detectForVideo(video, performance.now());
    const lm = res.landmarks?.[0];
    if (!lm) return { type: "warning", message: "No person detected. Ensure full body is in frame." };
    const { leftHip, rightHip, leftKnee } = computeAngles(lm);
    if (exercise === "squat") {
      if (Math.min(leftHip, rightHip) < 150 && leftKnee < 170) {
        return { type: "good", message: "Good setup! Maintain neutral spine and track knees over toes." };
      }
      return { type: "warning", message: "Stand tall, engage core, and keep chest up before starting." };
    }
    return { type: "good", message: "Form looks decent. Keep core engaged and control movement." };
  };

  return { ready, error, isMonitoring, repCount, setCount, start, stop, quickCheck };
};

export default usePose;
