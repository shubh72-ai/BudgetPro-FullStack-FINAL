"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const START_FRAME = 31;
const END_FRAME = 240;
const FRAME_STEP = 2;
const ENDING_FRAME_START = 201;
const STATIC_FRAME = 151;
const INITIAL_PRELOAD_COUNT = 10;
const NEXT_FRAME_PRELOAD = 5;
const PREVIOUS_FRAME_PRELOAD = 3;
const IDLE_BATCH_SIZE = 4;
const MAX_DPR = 2;
const MAX_CANVAS_WIDTH = 2560;
const MAX_CANVAS_HEIGHT = 1440;
const HERO_FRAME_ZOOM = 1.08;

const frameNumbers = [];

for (
  let frame = START_FRAME;
  frame <= END_FRAME;
  frame += frame >= ENDING_FRAME_START ? 1 : FRAME_STEP
) {
  frameNumbers.push(frame);
}

const frameIndexByNumber = new Map(
  frameNumbers.map((frameNumber, index) => [frameNumber, index])
);

const LAST_SEQUENCE_FRAME = frameNumbers[frameNumbers.length - 1];
const LAST_SEQUENCE_INDEX = frameNumbers.length - 1;

const getFramePath = (frameNumber) =>
  `/frames/frame_${String(frameNumber).padStart(4, "0")}.webp`;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const getStaticPreference = () => {
  if (typeof window === "undefined" || !window.matchMedia) return false;

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

const requestIdle = (callback) => {
  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    return window.requestIdleCallback(callback, { timeout: 700 });
  }

  return window.setTimeout(() => {
    callback({
      didTimeout: true,
      timeRemaining: () => 0,
    });
  }, 140);
};

const cancelIdle = (id) => {
  if (!id) return;

  if (typeof window !== "undefined" && "cancelIdleCallback" in window) {
    window.cancelIdleCallback(id);
    return;
  }

  window.clearTimeout(id);
};

export default function HeroScrollSequence() {
  const sectionRef = useRef(null);
  const stickyRef = useRef(null);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const copyScrollStateRef = useRef(null);
  const imageCacheRef = useRef(new Map());
  const targetFrameRef = useRef(0);
  const renderedFrameRef = useRef(0);
  const displayedFrameRef = useRef(null);
  const animationFrameRef = useRef(null);
  const scrollRafRef = useRef(null);
  const resizeRafRef = useRef(null);
  const idleRequestRef = useRef(null);
  const destroyedRef = useRef(false);
  const [isStaticHero, setIsStaticHero] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;

    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMode = () => setIsStaticHero(getStaticPreference());

    updateMode();

    reduceMotionQuery.addEventListener?.("change", updateMode);

    return () => {
      reduceMotionQuery.removeEventListener?.("change", updateMode);
    };
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const cssWidth = Math.max(1, rect.width);
    const cssHeight = Math.max(1, rect.height);
    const dpr = Math.min(
      window.devicePixelRatio || 1,
      MAX_DPR,
      MAX_CANVAS_WIDTH / cssWidth,
      MAX_CANVAS_HEIGHT / cssHeight
    );
    const pixelWidth = Math.max(1, Math.round(rect.width * dpr));
    const pixelHeight = Math.max(1, Math.round(rect.height * dpr));

    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }

    const context =
      canvas.getContext("2d", { alpha: false, desynchronized: true }) ||
      canvas.getContext("2d");

    if (!context) return null;

    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    contextRef.current = context;

    return context;
  }, []);

  const getNearestLoadedFrame = useCallback((sequenceIndex, staticMode) => {
    if (staticMode) {
      const staticRecord = imageCacheRef.current.get(STATIC_FRAME);
      return staticRecord?.loaded ? STATIC_FRAME : null;
    }

    const targetIndex = clamp(Math.round(sequenceIndex), 0, LAST_SEQUENCE_INDEX);

    for (let distance = 0; distance <= LAST_SEQUENCE_INDEX; distance += 1) {
      const beforeFrame = frameNumbers[targetIndex - distance];
      const afterFrame = frameNumbers[targetIndex + distance];

      if (beforeFrame !== undefined && imageCacheRef.current.get(beforeFrame)?.loaded) {
        return beforeFrame;
      }

      if (
        distance > 0 &&
        afterFrame !== undefined &&
        imageCacheRef.current.get(afterFrame)?.loaded
      ) {
        return afterFrame;
      }
    }

    return null;
  }, []);

  const drawFrame = useCallback((image) => {
    const canvas = canvasRef.current;
    const context = contextRef.current || resizeCanvas();

    if (
      !canvas ||
      !context ||
      !image ||
      !image.complete ||
      image.naturalWidth === 0 ||
      image.naturalHeight === 0
    ) {
      return false;
    }

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (width <= 0 || height <= 0) return false;

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

    context.save();
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.globalAlpha = 1;
    context.filter = "none";

    const scale =
      Math.max(width / image.naturalWidth, height / image.naturalHeight) *
      HERO_FRAME_ZOOM;
    const renderedWidth = image.naturalWidth * scale;
    const renderedHeight = image.naturalHeight * scale;
    const x = (width - renderedWidth) / 2;
    const y = (height - renderedHeight) * 0.44;

    context.drawImage(
      image,
      x,
      y,
      renderedWidth,
      renderedHeight
    );

    context.restore();
    return true;
  }, [resizeCanvas]);

  const renderSequenceIndex = useCallback((sequenceIndex, staticMode = false) => {
    const frameNumber = getNearestLoadedFrame(sequenceIndex, staticMode);
    if (!frameNumber) return false;

    const record = imageCacheRef.current.get(frameNumber);
    const image = record?.img;
    const targetFrame = staticMode
      ? STATIC_FRAME
      : frameNumbers[clamp(Math.round(sequenceIndex), 0, LAST_SEQUENCE_INDEX)];

    if (!record?.loaded) return false;

    const drawSucceeded = drawFrame(image);

    window.__budgetProHeroSequence = {
      mode: staticMode ? "static" : "sequence",
      frame: frameNumber,
      targetFrame,
      startFrame: START_FRAME,
      endFrame: END_FRAME,
      lastSequenceFrame: LAST_SEQUENCE_FRAME,
      step: FRAME_STEP,
      drawSucceeded,
      loaded: imageCacheRef.current.size,
      total: staticMode ? 1 : frameNumbers.length,
      path: getFramePath(frameNumber),
    };

    if (!drawSucceeded) return false;

    displayedFrameRef.current = frameNumber;

    return true;
  }, [drawFrame, getNearestLoadedFrame]);

  useEffect(() => {
    destroyedRef.current = false;
    setIsLoading(true);
    imageCacheRef.current = new Map();
    targetFrameRef.current = 0;
    renderedFrameRef.current = 0;
    displayedFrameRef.current = null;
    contextRef.current = null;

    let hasLoadedPoster = false;
    const priorityFrames = Array.from(
      new Set([
        ...frameNumbers.slice(0, INITIAL_PRELOAD_COUNT),
        STATIC_FRAME,
        LAST_SEQUENCE_FRAME,
      ])
    );
    let resizeObserver = null;
    const renderRetryFrames = new Set();
    const renderRetryTimers = new Set();

    const getCopyState = (progress) => {
      if (progress <= 0.18) {
        return { opacity: 1, translateY: 0, scale: 1 };
      }

      if (progress >= 0.36) {
        return { opacity: 0, translateY: -22, scale: 0.985 };
      }

      const localProgress = (progress - 0.18) / (0.36 - 0.18);

      return {
        opacity: 1 - localProgress,
        translateY: -22 * localProgress,
        scale: 1 - 0.015 * localProgress,
      };
    };

    const updateCopyOverlay = (progress) => {
      const copyScrollState = copyScrollStateRef.current;
      if (!copyScrollState) return;

      const state = getCopyState(progress);
      copyScrollState.style.opacity = String(state.opacity);
      copyScrollState.style.transform = `translate3d(0, ${state.translateY}px, 0) scale(${state.scale})`;
      copyScrollState.style.pointerEvents = state.opacity < 0.1 ? "none" : "auto";
    };

    const retryRender = (sequenceIndex, staticMode) => {
      renderSequenceIndex(sequenceIndex, staticMode);

      const rafId = window.requestAnimationFrame(() => {
        renderRetryFrames.delete(rafId);
        renderSequenceIndex(sequenceIndex, staticMode);
      });
      renderRetryFrames.add(rafId);

      const timerId = window.setTimeout(() => {
        renderRetryTimers.delete(timerId);
        renderSequenceIndex(sequenceIndex, staticMode);
      }, 90);
      renderRetryTimers.add(timerId);
    };

    const loadImage = (frameNumber, priority = false) => {
      const existing = imageCacheRef.current.get(frameNumber);
      if (existing) return existing.promise;

      const img = new Image();
      img.decoding = "async";
      img.loading = priority ? "eager" : "auto";
      img.fetchPriority = priority ? "high" : "low";

      const record = {
        img,
        loaded: false,
        errored: false,
        promise: null,
      };

      record.promise = new Promise((resolve) => {
        img.onload = () => {
          if (destroyedRef.current) {
            resolve(false);
            return;
          }

          record.loaded = true;

          const isPosterFrame = isStaticHero
            ? frameNumber === STATIC_FRAME
            : frameNumber === START_FRAME;

          if (!hasLoadedPoster && isPosterFrame) {
            hasLoadedPoster = true;
            setIsLoading(false);
          } else if (!hasLoadedPoster && !isPosterFrame) {
            resolve(true);
            return;
          }

          const frameIndex = frameIndexByNumber.get(frameNumber) ?? 0;

          if (isStaticHero) {
            retryRender(0, true);
          } else if (
            frameNumber === START_FRAME ||
            frameNumber === LAST_SEQUENCE_FRAME ||
            Math.abs(frameIndex - targetFrameRef.current) <= NEXT_FRAME_PRELOAD
          ) {
            retryRender(renderedFrameRef.current, false);
          }

          resolve(true);
        };

        img.onerror = () => {
          record.errored = true;

          if (process.env.NODE_ENV !== "production") {
            console.error("Missing BudgetPro hero frame:", getFramePath(frameNumber));
          }

          renderSequenceIndex(renderedFrameRef.current, isStaticHero);
          resolve(false);
        };

        imageCacheRef.current.set(frameNumber, record);
        img.src = getFramePath(frameNumber);
      });

      return record.promise;
    };

    const loadPriorityAroundIndex = (sequenceIndex) => {
      if (isStaticHero) return;

      const targetIndex = clamp(Math.round(sequenceIndex), 0, LAST_SEQUENCE_INDEX);

      loadImage(frameNumbers[targetIndex], true);

      for (let offset = 1; offset <= NEXT_FRAME_PRELOAD; offset += 1) {
        const nextFrame = frameNumbers[targetIndex + offset];
        if (nextFrame !== undefined) loadImage(nextFrame);
      }

      for (let offset = 1; offset <= PREVIOUS_FRAME_PRELOAD; offset += 1) {
        const previousFrame = frameNumbers[targetIndex - offset];
        if (previousFrame !== undefined) loadImage(previousFrame);
      }
    };

    const animate = () => {
      const current = renderedFrameRef.current;
      const target = targetFrameRef.current;
      const next = current + (target - current) * 0.2;

      renderedFrameRef.current = Math.abs(target - next) < 0.025 ? target : next;
      renderSequenceIndex(renderedFrameRef.current, false);

      if (Math.abs(targetFrameRef.current - renderedFrameRef.current) > 0.025) {
        animationFrameRef.current = window.requestAnimationFrame(animate);
      } else {
        animationFrameRef.current = null;
      }
    };

    const startAnimation = () => {
      if (!animationFrameRef.current) {
        animationFrameRef.current = window.requestAnimationFrame(animate);
      }
    };

    const updateScrollTarget = () => {
      const section = sectionRef.current;
      const sticky = stickyRef.current;

      if (!section || !sticky) return;

      const maxScrollable = section.offsetHeight - sticky.offsetHeight;
      if (maxScrollable <= 0) return;

      const rawProgress = (window.scrollY - section.offsetTop) / maxScrollable;
      const progress = clamp(rawProgress, 0, 1);

      updateCopyOverlay(progress);

      if (isStaticHero) {
        renderSequenceIndex(0, true);
        return;
      }

      targetFrameRef.current = progress * LAST_SEQUENCE_INDEX;
      loadPriorityAroundIndex(targetFrameRef.current);
      startAnimation();
    };

    const onScroll = () => {
      if (scrollRafRef.current) return;

      scrollRafRef.current = window.requestAnimationFrame(() => {
        scrollRafRef.current = null;
        updateScrollTarget();
      });
    };

    const onResize = () => {
      if (resizeRafRef.current) return;

      resizeRafRef.current = window.requestAnimationFrame(() => {
        resizeRafRef.current = null;
        contextRef.current = null;
        resizeCanvas();
        updateScrollTarget();
        renderSequenceIndex(isStaticHero ? 0 : renderedFrameRef.current, isStaticHero);
      });
    };

    const startIdleLoading = () => {
      if (isStaticHero) return;

      const remainingFrames = frameNumbers.filter(
        (frameNumber) => !priorityFrames.includes(frameNumber)
      );
      let remainingIndex = 0;

      const loadIdleBatch = (deadline) => {
        if (destroyedRef.current || isStaticHero) return;

        let loadedInBatch = 0;

        while (
          remainingIndex < remainingFrames.length &&
          loadedInBatch < IDLE_BATCH_SIZE &&
          (deadline.didTimeout || deadline.timeRemaining() > 4 || loadedInBatch === 0)
        ) {
          loadImage(remainingFrames[remainingIndex]);
          remainingIndex += 1;
          loadedInBatch += 1;
        }

        if (remainingIndex < remainingFrames.length) {
          idleRequestRef.current = requestIdle(loadIdleBatch);
        }
      };

      idleRequestRef.current = requestIdle(loadIdleBatch);
    };

    resizeCanvas();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onScroll, { passive: true });
    window.addEventListener("touchmove", onScroll, { passive: true });

    if (typeof ResizeObserver !== "undefined" && stickyRef.current) {
      resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(stickyRef.current);
    }

    if (isStaticHero) {
      loadImage(STATIC_FRAME, true);
      updateScrollTarget();
    } else {
      priorityFrames.forEach((frameNumber, index) => {
        loadImage(frameNumber, index === 0 || frameNumber === STATIC_FRAME || frameNumber === LAST_SEQUENCE_FRAME);
      });
      loadPriorityAroundIndex(0);
      updateScrollTarget();
      startIdleLoading();
    }

    return () => {
      destroyedRef.current = true;
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onScroll);
      window.removeEventListener("touchmove", onScroll);
      resizeObserver?.disconnect();

      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      if (scrollRafRef.current) {
        window.cancelAnimationFrame(scrollRafRef.current);
        scrollRafRef.current = null;
      }

      if (resizeRafRef.current) {
        window.cancelAnimationFrame(resizeRafRef.current);
        resizeRafRef.current = null;
      }

      cancelIdle(idleRequestRef.current);
      idleRequestRef.current = null;

      renderRetryFrames.forEach((rafId) => window.cancelAnimationFrame(rafId));
      renderRetryFrames.clear();
      renderRetryTimers.forEach((timerId) => window.clearTimeout(timerId));
      renderRetryTimers.clear();

      imageCacheRef.current.forEach((record) => {
        record.img.onload = null;
        record.img.onerror = null;
        if (!record.loaded) record.img.src = "";
      });
      imageCacheRef.current.clear();
    };
  }, [isStaticHero, renderSequenceIndex, resizeCanvas]);

  return (
    <section
      ref={sectionRef}
      data-hero-scroll-sequence
      className="hero-sequence-section"
    >
      <style>{`
        .hero-sequence-section {
          position: relative;
          width: 100%;
          height: 280vh;
          margin: 0;
          padding: 0;
          overflow: visible;
          background: #f1eff8;
        }
        .hero-sequence-sticky {
          position: sticky;
          top: 0;
          width: 100%;
          height: 100svh;
          min-height: 100vh;
          overflow: hidden;
          background: #f1eff8;
          isolation: isolate;
        }
        .hero-sequence-canvas {
          position: absolute;
          inset: 0;
          display: block;
          width: 100%;
          height: 100%;
          max-width: none;
          max-height: none;
          margin: 0;
          padding: 0;
          filter: none !important;
          opacity: 1;
          transform: none !important;
          aspect-ratio: 16 / 9;
          image-rendering: auto;
        }
        .hero-copy-positioner {
          --hero-copy-gap: clamp(18px, 3svh, 34px);
          position: relative;
          z-index: 12;
          top: auto;
          left: auto;
          width: min(calc(100% - 48px), 820px);
          margin: var(--hero-copy-gap) auto;
          transform: none;
          pointer-events: auto;
          color: #0b1220;
        }
        .hero-copy-scroll-state {
          width: 100%;
          pointer-events: auto;
          opacity: 1 !important;
          transform: none !important;
          will-change: auto;
        }
        .hero-copy-float {
          animation: heroCopyFloat 7s ease-in-out infinite;
        }
        @keyframes heroCopyFloat {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -7px, 0); }
        }
        .hero-copy-card {
          position: relative;
          width: 100%;
          overflow: hidden;
          padding: clamp(22px, 2vw, 28px);
          border-radius: 30px;
          background:
            radial-gradient(
              circle at 15% 8%,
              rgba(255,255,255,0.94),
              rgba(255,255,255,0.20) 45%,
              transparent 70%
            ),
            linear-gradient(
              145deg,
              rgba(255,255,255,0.79),
              rgba(246,247,255,0.55)
            );
          border: 1px solid rgba(255,255,255,0.88);
          box-shadow:
            0 26px 72px rgba(15,23,42,0.14),
            0 12px 34px rgba(99,102,241,0.13),
            inset 0 1px 0 rgba(255,255,255,0.96);
          backdrop-filter: blur(16px) saturate(145%);
          -webkit-backdrop-filter: blur(16px) saturate(145%);
        }
        .hero-copy-card::before {
          display: none;
        }
        .hero-copy-title,
        .hero-copy-description,
        .hero-copy-card .hero-sequence-kicker,
        .hero-copy-card .hero-sequence-actions {
          position: relative;
          z-index: 2;
        }
        .hero-sequence-kicker {
          display: inline-flex;
          align-items: center;
          min-height: 29px;
          padding: 0 12px;
          margin-bottom: 16px;
          border-radius: 999px;
          color: #4338ca;
          background: rgba(255,255,255,0.76);
          border: 1px solid rgba(255,255,255,0.92);
          box-shadow:
            0 12px 32px rgba(79,70,229,0.10),
            inset 0 1px 0 rgba(255,255,255,0.95);
          font-family: var(--bp-body, 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
          font-size: 10px;
          line-height: 1;
          font-weight: 850;
          letter-spacing: 0.12em;
        }
        .hero-copy-title {
          margin: 18px 0 16px;
          max-width: 100%;
          color: #0b1220;
          font-family: "Playfair Display", Georgia, serif;
          font-size: clamp(38px, 3vw, 50px);
          font-weight: 700;
          line-height: 0.98;
          letter-spacing: -0.045em;
          text-wrap: balance;
          overflow-wrap: normal;
          word-break: normal;
          hyphens: none;
          text-shadow:
            0 1px 0 rgba(255,255,255,0.92),
            0 16px 34px rgba(15,23,42,0.16);
        }
        .hero-copy-title span {
          display: block;
        }
        .hero-copy-title span + span {
          margin-top: 10px;
        }
        .hero-copy-description {
          max-width: 38ch;
          margin: 0 0 22px;
          color: #475569;
          font-family: var(--bp-body, 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
          font-size: clamp(14px, 1.15vw, 17px);
          line-height: 1.65;
          font-weight: 650;
          text-shadow: 0 1px 0 rgba(255,255,255,0.82);
        }
        .hero-sequence-actions {
          display: flex;
          flex-wrap: nowrap;
          gap: 11px;
          align-items: center;
        }
        .hero-sequence-actions a {
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 18px;
          border-radius: 999px;
          text-decoration: none;
          font-family: var(--bp-body, 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
          font-size: 13px;
          font-weight: 850;
          color: #ffffff;
          background: linear-gradient(135deg, #2563eb, #4f46e5 48%, #8b5cf6);
          box-shadow:
            0 16px 38px rgba(79,70,229,0.26),
            inset 0 1px 0 rgba(255,255,255,0.48);
        }
        .hero-sequence-actions a + a {
          color: #1e293b;
          background: linear-gradient(145deg, rgba(255,255,255,0.84), rgba(219,234,254,0.54), rgba(237,233,254,0.58));
          border: 1px solid rgba(255,255,255,0.90);
          box-shadow:
            0 12px 30px rgba(15,23,42,0.08),
            inset 0 1px 0 rgba(255,255,255,0.94);
        }
        @media (max-height: 759.98px) and (min-width: 768px) {
          .hero-copy-positioner {
            --hero-copy-gap: 18px;
          }
        }
        .hero-sequence-status {
          position: absolute;
          right: 18px;
          bottom: 18px;
          z-index: 8;
          padding: 8px 12px;
          border-radius: 999px;
          color: #475569;
          background: rgba(255,255,255,0.74);
          border: 1px solid rgba(255,255,255,0.84);
          box-shadow: 0 10px 26px rgba(79,70,229,0.10);
          font-family: var(--bp-body, 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
          font-size: 12px;
          font-weight: 850;
        }
        @media (max-width: 767.98px), (prefers-reduced-motion: reduce) {
          .hero-copy-positioner {
            --hero-copy-gap: 14px;
          }
          .hero-copy-positioner {
            width: min(calc(100% - 28px), 640px);
            margin-top: var(--hero-copy-gap);
            margin-bottom: var(--hero-copy-gap);
          }
          .hero-copy-card {
            padding: 18px;
            border-radius: 24px;
          }
          .hero-sequence-kicker {
            min-height: 28px;
            margin-bottom: 12px;
            font-size: 9px;
            letter-spacing: 0.1em;
          }
          .hero-copy-title {
            max-width: 100%;
            font-size: clamp(34px, 9.5vw, 48px);
            line-height: 0.97;
          }
          .hero-copy-description {
            max-width: 100%;
            margin: 13px 0 17px;
            font-size: 13px;
            line-height: 1.54;
          }
          .hero-sequence-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 9px;
          }
          .hero-sequence-actions a {
            min-width: 0;
            min-height: 44px;
            padding: 0 12px;
            font-size: 12px;
            text-align: center;
          }
          .hero-sequence-status {
            right: 14px;
            bottom: auto;
            top: 14px;
          }
        }
        @media (max-width: 767.98px) {
          .hero-sequence-section {
            height: 220vh;
            margin: 0;
            padding: 0;
            overflow: visible;
          }
          .hero-sequence-sticky {
            position: sticky;
            top: 0;
            height: 100svh;
            min-height: 100vh;
            overflow: hidden;
          }
          .hero-sequence-canvas {
            position: absolute;
            height: 100%;
          }
          .hero-copy-positioner {
            position: relative;
            top: auto;
            left: auto;
            bottom: auto;
            width: min(calc(100% - 28px), 640px);
            margin: 14px auto;
            transform: none;
            pointer-events: auto;
          }
          .hero-copy-scroll-state {
            opacity: 1 !important;
            transform: none !important;
            pointer-events: auto !important;
          }
          .hero-copy-float {
            animation: none;
          }
        }
        @media (max-width: 389.98px) {
          .hero-sequence-actions {
            grid-template-columns: 1fr;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-sequence-section {
            height: auto;
            overflow: hidden;
          }
          .hero-sequence-sticky {
            position: relative;
            top: auto;
            height: min(100svh, 56.25vw);
            min-height: 320px;
            overflow: hidden;
          }
          .hero-sequence-canvas {
            position: absolute;
            height: 100%;
          }
          .hero-copy-float {
            animation: none;
          }
        }
      `}</style>

      <div ref={stickyRef} className="hero-sequence-sticky">
        <canvas
          ref={canvasRef}
          className="hero-sequence-canvas"
          aria-hidden="true"
        />

        {isLoading && (
          <div className="hero-sequence-status">Loading dashboard preview...</div>
        )}
      </div>
    </section>
  );
}

export function HeroSequenceCopy({ scrollStateRef = null }) {
  return (
    <div className="hero-copy-positioner">
      <div ref={scrollStateRef} className="hero-copy-scroll-state">
        <div className="hero-copy-float">
          <div className="hero-copy-card">
            <div className="hero-sequence-kicker">THE SMARTER WAY TO MANAGE MONEY</div>
            <h1 className="hero-copy-title">
              <span>Your money isn&apos;t disappearing &mdash;</span>
              <span>now you can see exactly where it goes.</span>
            </h1>
            <p className="hero-copy-description">
              A beautifully designed tracker that transforms everyday spending into complete financial clarity.
            </p>
            <div className="hero-sequence-actions">
              <a href="/#pricing">Get BudgetPro</a>
              <a href="/product">Explore Dashboard</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
