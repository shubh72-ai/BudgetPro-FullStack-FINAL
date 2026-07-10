"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";

const FRAME_COUNT = 240;
const FRAME_START = 48;
const FRAME_WIDTH = 1280;
const FRAME_HEIGHT = 720;
const FRAME_FIT = "cover";
const FRAME_NARROW_SCALE = 1.04;
const FRAME_WIDE_SCALE = 1.01;
const VISIBLE_FRAME_COUNT = FRAME_COUNT - FRAME_START + 1;
const PRELOAD_BATCH_SIZE = 3;
const PRELOAD_BATCH_DELAY = 90;
const INTRO_AMBIENT_END = FRAME_START + 12;
const HERO_CANVAS_MIN_DPR = 1;
const HERO_CANVAS_MAX_DPR = 1.65;

const frameSrc = (index) =>
  `/frames/frame_${String(index).padStart(4, "0")}.webp`;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const frameFromProgress = (progress) =>
  Math.floor(clamp(progress, 0, 1) * (VISIBLE_FRAME_COUNT - 1)) + FRAME_START;

function getContainRect(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  const baseScale =
    FRAME_FIT === "cover"
      ? Math.max(canvasWidth / imageWidth, canvasHeight / imageHeight)
      : Math.min(canvasWidth / imageWidth, canvasHeight / imageHeight);
  const canvasAspect = canvasWidth / canvasHeight;
  const heroScale =
    canvasAspect < 1.55 ? FRAME_NARROW_SCALE : FRAME_WIDE_SCALE;
  const scale = baseScale * heroScale;

  const drawWidth = imageWidth * scale;
  const drawHeight = imageHeight * scale;

  return {
    drawWidth,
    drawHeight,
    x: (canvasWidth - drawWidth) / 2,
    y: (canvasHeight - drawHeight) / 2,
  };
}

export default function HeroScrollSequence() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const loadedRef = useRef(new Set());
  const currentFrameRef = useRef(1);
  const targetFrameRef = useRef(1);
  const rafRef = useRef(null);
  const ambientTimerRef = useRef(null);
  const resizeObserverRef = useRef(null);
  const cleanupTimersRef = useRef([]);
  const isMountedRef = useRef(false);
  const canvasStateRef = useRef(null);
  const [status, setStatus] = useState("loading");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const glowOpacity = useTransform(scrollYProgress, [0, 0.35, 1], [0.95, 0.7, 0.52]);

  const findNearestLoadedFrame = useCallback((frameNumber) => {
    if (loadedRef.current.has(frameNumber)) return frameNumber;

    for (let distance = 1; distance < VISIBLE_FRAME_COUNT; distance += 1) {
      const before = frameNumber - distance;
      const after = frameNumber + distance;

      if (before >= FRAME_START && loadedRef.current.has(before)) return before;
      if (after <= FRAME_COUNT && loadedRef.current.has(after)) return after;
    }

    return null;
  }, []);

  const resizeCanvasToDisplaySize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const cssWidth = Math.max(1, Math.round(rect.width));
    const cssHeight = Math.max(1, Math.round(rect.height));
    const dpr = Math.min(
      Math.max(window.devicePixelRatio || 1, HERO_CANVAS_MIN_DPR),
      HERO_CANVAS_MAX_DPR
    );
    const pixelWidth = Math.round(cssWidth * dpr);
    const pixelHeight = Math.round(cssHeight * dpr);

    const existingState = canvasStateRef.current;
    if (
      existingState &&
      existingState.width === cssWidth &&
      existingState.height === cssHeight &&
      existingState.dpr === dpr &&
      canvas.width === pixelWidth &&
      canvas.height === pixelHeight
    ) {
      return existingState;
    }

    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }

    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "medium";

    const nextState = { ctx, width: cssWidth, height: cssHeight, dpr };
    canvasStateRef.current = nextState;
    return nextState;
  }, []);

  const drawFrame = useCallback((requestedFrame) => {
    const frameNumber = findNearestLoadedFrame(requestedFrame);
    if (!frameNumber) return;

    if (
      canvasStateRef.current &&
      frameNumber === currentFrameRef.current &&
      requestedFrame === targetFrameRef.current
    ) {
      return;
    }

    const img = imagesRef.current[frameNumber - 1];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const canvasState = canvasStateRef.current || resizeCanvasToDisplaySize();
    if (!canvasState) return;

    const { ctx, width, height } = canvasState;
    const { x, y, drawWidth, drawHeight } = getContainRect(
      width,
      height,
      img.naturalWidth || FRAME_WIDTH,
      img.naturalHeight || FRAME_HEIGHT
    );

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, x, y, drawWidth, drawHeight);
    currentFrameRef.current = frameNumber;

    window.__budgetProHeroSequence = {
      frame: frameNumber,
      targetFrame: requestedFrame,
      loaded: loadedRef.current.size,
      total: FRAME_COUNT,
      path: frameSrc(frameNumber),
    };
  }, [findNearestLoadedFrame, resizeCanvasToDisplaySize]);

  const scheduleDraw = useCallback((frameNumber) => {
    targetFrameRef.current = clamp(frameNumber, FRAME_START, FRAME_COUNT);

    if (rafRef.current) return;

    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      drawFrame(targetFrameRef.current);
    });
  }, [drawFrame]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const nextFrame = frameFromProgress(latest);
    scheduleDraw(nextFrame);
  });

  useEffect(() => {
    isMountedRef.current = true;
    imagesRef.current = new Array(FRAME_COUNT);
    loadedRef.current = new Set();
    currentFrameRef.current = FRAME_START;
    targetFrameRef.current = FRAME_START;
    setStatus("loading");

    const loadImage = (frameNumber, priority = false) => {
      const img = new Image();
      img.decoding = "async";
      img.loading = priority ? "eager" : "auto";
      img.fetchPriority = priority ? "high" : "low";

      img.onload = () => {
        if (!isMountedRef.current) return;

        imagesRef.current[frameNumber - 1] = img;
        loadedRef.current.add(frameNumber);

        if (frameNumber === FRAME_START) {
          setStatus("ready");
          drawFrame(FRAME_START);
        } else if (Math.abs(frameNumber - targetFrameRef.current) <= 1) {
          scheduleDraw(targetFrameRef.current);
        }
      };

      img.onerror = () => {
        console.warn("Frame failed:", frameSrc(frameNumber));
        if (frameNumber === FRAME_START && isMountedRef.current) {
          setStatus("error");
        }
      };

      imagesRef.current[frameNumber - 1] = img;
      img.src = frameSrc(frameNumber);
    };

    loadImage(FRAME_START, true);

    let nextFrame = FRAME_START + 1;
    const preloadBatch = () => {
      if (!isMountedRef.current || nextFrame > FRAME_COUNT) return;

      const batchEnd = Math.min(FRAME_COUNT + 1, nextFrame + PRELOAD_BATCH_SIZE);
      for (; nextFrame < batchEnd; nextFrame += 1) {
        loadImage(nextFrame);
      }

      const timer = window.setTimeout(() => {
        if ("requestIdleCallback" in window) {
          window.requestIdleCallback(preloadBatch, { timeout: 240 });
        } else {
          preloadBatch();
        }
      }, PRELOAD_BATCH_DELAY);
      cleanupTimersRef.current.push(timer);
    };

    const firstBatchTimer = window.setTimeout(preloadBatch, 130);
    cleanupTimersRef.current.push(firstBatchTimer);

    const onResize = () => {
      canvasStateRef.current = null;
      scheduleDraw(currentFrameRef.current);
    };

    ambientTimerRef.current = window.setInterval(() => {
      if (!isMountedRef.current) return;
      const progress = scrollYProgress.get();
      const isAtIntro = progress < 0.018 && window.scrollY < 16;
      const hasIntroFrames = loadedRef.current.size >= INTRO_AMBIENT_END - FRAME_START + 1;

      if (!isAtIntro || !hasIntroFrames) return;

      const nextAmbientFrame =
        currentFrameRef.current >= INTRO_AMBIENT_END
          ? FRAME_START
          : currentFrameRef.current + 1;
      scheduleDraw(nextAmbientFrame);
    }, 150);

    if (typeof ResizeObserver !== "undefined" && canvasRef.current) {
      resizeObserverRef.current = new ResizeObserver(onResize);
      resizeObserverRef.current.observe(canvasRef.current);
    }

    window.addEventListener("resize", onResize);

    return () => {
      isMountedRef.current = false;
      window.removeEventListener("resize", onResize);

      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      if (ambientTimerRef.current) {
        window.clearInterval(ambientTimerRef.current);
        ambientTimerRef.current = null;
      }

      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }

      cleanupTimersRef.current.forEach((timer) => window.clearTimeout(timer));
      cleanupTimersRef.current = [];

      imagesRef.current.forEach((img) => {
        if (!img) return;
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [drawFrame, scheduleDraw, scrollYProgress]);

  return (
    <section
      ref={containerRef}
      data-hero-scroll-sequence
      style={{
        position: "relative",
        height: "380vh",
        background: "#eef2ff",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          overflow: "hidden",
          background: "#eef2ff",
        }}
      >
        <motion.div
          aria-hidden="true"
          style={{
            opacity: glowOpacity,
            position: "absolute",
            inset: "-18% -10%",
            background:
              "radial-gradient(circle at 28% 30%, rgba(255,255,255,0.82), transparent 28%), radial-gradient(circle at 72% 24%, rgba(139,92,246,0.22), transparent 34%), radial-gradient(circle at 50% 78%, rgba(59,130,246,0.12), transparent 38%)",
            pointerEvents: "none",
          }}
        />

        <canvas
          ref={canvasRef}
          aria-label="BudgetPro Smart Expense Tracker scroll animation"
          role="img"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            display: "block",
            width: "100%",
            height: "100%",
            background: "transparent",
            filter: "contrast(1.03) saturate(1.02)",
            imageRendering: "auto",
          }}
        />

        {status === "loading" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 3,
              display: "grid",
              placeItems: "center",
              color: "#475569",
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: 0,
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.62), rgba(245,239,255,0.44))",
            }}
          >
            Loading dashboard preview...
          </div>
        )}

        {status === "error" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 3,
              display: "grid",
              placeItems: "center",
              padding: 24,
              textAlign: "center",
              color: "#b91c1c",
              fontSize: 14,
              fontWeight: 800,
              background: "#f8f7ff",
            }}
          >
            Could not load {frameSrc(FRAME_START)}.
          </div>
        )}
      </div>
    </section>
  );
}
