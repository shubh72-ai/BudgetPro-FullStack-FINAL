"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SOURCE_START_FRAME = 51;
const SOURCE_END_FRAME = 240;
const DESKTOP_FRAME_STEP = 2;
const MOBILE_FRAME_STEP = 4;
const STATIC_FRAME = 151;
const HERO_FRAME_ZOOM = 1.06;
const INITIAL_PRELOAD_COUNT = 12;
const NEXT_FRAME_PRELOAD = 6;
const PREVIOUS_FRAME_PRELOAD = 4;
const IDLE_BATCH_SIZE = 4;
const MAX_DPR = 2;

const createFrameNumbers = (start, end, step) => {
  const numbers = [];

  for (let frame = start; frame <= end; frame += step) {
    numbers.push(frame);
  }

  if (numbers[numbers.length - 1] !== end) {
    numbers.push(end);
  }

  return numbers;
};

const desktopFrameNumbers = createFrameNumbers(
  SOURCE_START_FRAME,
  SOURCE_END_FRAME,
  DESKTOP_FRAME_STEP
);
const mobileFrameNumbers = createFrameNumbers(
  SOURCE_START_FRAME,
  SOURCE_END_FRAME,
  MOBILE_FRAME_STEP
);
const desktopFrameIndexByNumber = new Map(
  desktopFrameNumbers.map((frameNumber, index) => [frameNumber, index])
);
const mobileFrameIndexByNumber = new Map(
  mobileFrameNumbers.map((frameNumber, index) => [frameNumber, index])
);

const getFramePath = (frameNumber) =>
  `/frames/frame_${String(frameNumber).padStart(4, "0")}.webp`;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const getStaticPreference = () => {
  if (typeof window === "undefined" || !window.matchMedia) return false;

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

const getNavOffset = () => {
  if (typeof window === "undefined") return 66;

  const rawValue = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue("--budgetpro-nav-height");
  const parsedValue = Number.parseFloat(rawValue);

  return Number.isFinite(parsedValue) ? parsedValue : 66;
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
  const scrollHintRef = useRef(null);
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
  const [isMobileHero, setIsMobileHero] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const activeFrameNumbers = isMobileHero ? mobileFrameNumbers : desktopFrameNumbers;
  const activeFrameIndexByNumber = isMobileHero
    ? mobileFrameIndexByNumber
    : desktopFrameIndexByNumber;
  const activeFrameStep = isMobileHero ? MOBILE_FRAME_STEP : DESKTOP_FRAME_STEP;
  const lastSequenceFrame = activeFrameNumbers[activeFrameNumbers.length - 1];
  const lastSequenceIndex = activeFrameNumbers.length - 1;

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;

    const mobileQuery = window.matchMedia("(max-width: 767.98px)");
    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMode = () => {
      setIsMobileHero(mobileQuery.matches);
      setIsStaticHero(getStaticPreference());
    };

    updateMode();

    mobileQuery.addEventListener?.("change", updateMode);
    reduceMotionQuery.addEventListener?.("change", updateMode);

    return () => {
      mobileQuery.removeEventListener?.("change", updateMode);
      reduceMotionQuery.removeEventListener?.("change", updateMode);
    };
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const sticky = stickyRef.current;
    if (!canvas || !sticky) return null;

    const rect = sticky.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
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

    const targetIndex = clamp(Math.round(sequenceIndex), 0, lastSequenceIndex);

    for (let distance = 0; distance <= lastSequenceIndex; distance += 1) {
      const beforeFrame = activeFrameNumbers[targetIndex - distance];
      const afterFrame = activeFrameNumbers[targetIndex + distance];

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
  }, [activeFrameNumbers, lastSequenceIndex]);

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
    context.globalCompositeOperation = "source-over";
    context.filter = "none";

    const baseScale = Math.max(
      width / image.naturalWidth,
      height / image.naturalHeight
    );
    const scale = baseScale * HERO_FRAME_ZOOM;
    const renderedWidth = image.naturalWidth * scale;
    const renderedHeight = image.naturalHeight * scale;
    const focalX = 0.5;
    const focalY = 0.46;
    const x = width * focalX - renderedWidth * focalX;
    const y = height * focalY - renderedHeight * focalY;

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
      : activeFrameNumbers[clamp(Math.round(sequenceIndex), 0, lastSequenceIndex)];

    if (!record?.loaded) return false;

    const drawSucceeded = drawFrame(image);

    window.__budgetProHeroSequence = {
      mode: staticMode ? "static" : "sequence",
      frame: frameNumber,
      targetFrame,
      sourceStartFrame: SOURCE_START_FRAME,
      sourceEndFrame: SOURCE_END_FRAME,
      lastSequenceFrame: lastSequenceFrame,
      step: activeFrameStep,
      drawSucceeded,
      loaded: imageCacheRef.current.size,
      total: staticMode ? 1 : activeFrameNumbers.length,
      path: getFramePath(frameNumber),
    };

    if (!drawSucceeded) return false;

    displayedFrameRef.current = frameNumber;

    return true;
  }, [
    activeFrameNumbers,
    activeFrameStep,
    drawFrame,
    getNearestLoadedFrame,
    lastSequenceFrame,
    lastSequenceIndex,
  ]);

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
        activeFrameNumbers[0],
        ...activeFrameNumbers.slice(0, INITIAL_PRELOAD_COUNT),
        STATIC_FRAME,
        lastSequenceFrame,
      ])
    );
    let resizeObserver = null;
    const renderRetryFrames = new Set();
    const renderRetryTimers = new Set();

    const updateScrollHint = (progress) => {
      const scrollHint = scrollHintRef.current;
      if (!scrollHint) return;

      const opacity = progress >= 0.12 ? 0 : 1 - progress / 0.12;
      scrollHint.style.opacity = String(opacity);
      scrollHint.style.transform = `translate3d(-50%, ${progress > 0.02 ? 6 : 0}px, 0)`;
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
            : frameNumber === activeFrameNumbers[0];

          if (!hasLoadedPoster && isPosterFrame) {
            hasLoadedPoster = true;
            setIsLoading(false);
          } else if (!hasLoadedPoster && !isPosterFrame) {
            resolve(true);
            return;
          }

          const frameIndex = activeFrameIndexByNumber.get(frameNumber) ?? 0;

          if (isStaticHero) {
            retryRender(0, true);
          } else if (
            frameNumber === activeFrameNumbers[0] ||
            frameNumber === lastSequenceFrame ||
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

      const targetIndex = clamp(Math.round(sequenceIndex), 0, lastSequenceIndex);

      loadImage(activeFrameNumbers[targetIndex], true);

      for (let offset = 1; offset <= NEXT_FRAME_PRELOAD; offset += 1) {
        const nextFrame = activeFrameNumbers[targetIndex + offset];
        if (nextFrame !== undefined) loadImage(nextFrame);
      }

      for (let offset = 1; offset <= PREVIOUS_FRAME_PRELOAD; offset += 1) {
        const previousFrame = activeFrameNumbers[targetIndex - offset];
        if (previousFrame !== undefined) loadImage(previousFrame);
      }
    };

    const animate = () => {
      const current = renderedFrameRef.current;
      const target = targetFrameRef.current;
      const next = current + (target - current) * 0.18;

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

      const navOffset = getNavOffset();
      const trackStart = section.offsetTop - navOffset;
      const trackEnd = trackStart + maxScrollable;
      const rawProgress = (window.scrollY - trackStart) / maxScrollable;
      const progress = clamp(rawProgress, 0, 1);

      sticky.classList.toggle(
        "is-fixed",
        window.scrollY >= trackStart && window.scrollY <= trackEnd
      );
      sticky.classList.toggle("is-ended", window.scrollY > trackEnd);

      updateScrollHint(progress);

      if (isStaticHero) {
        renderSequenceIndex(0, true);
        return;
      }

      targetFrameRef.current = progress * lastSequenceIndex;
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

      const remainingFrames = activeFrameNumbers.filter(
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
    window.addEventListener("orientationchange", onResize);
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
        loadImage(frameNumber, index === 0 || frameNumber === STATIC_FRAME || frameNumber === lastSequenceFrame);
      });
      loadPriorityAroundIndex(0);
      updateScrollTarget();
      startIdleLoading();
    }

    return () => {
      destroyedRef.current = true;
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
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
  }, [
    activeFrameIndexByNumber,
    activeFrameNumbers,
    isStaticHero,
    lastSequenceFrame,
    lastSequenceIndex,
    renderSequenceIndex,
    resizeCanvas,
  ]);

  return (
    <>
    <section
      ref={sectionRef}
      data-hero-scroll-sequence
      className="hero-sequence-section"
    >
      <style>{`
        :root {
          --budgetpro-nav-height: 66px;
        }
        .hero-sequence-section {
          position: relative;
          width: 100%;
          height: 190svh;
          min-height: 1200px;
          margin: 0;
          padding: 0;
          overflow: visible;
          background: #f1eff8;
        }
        .hero-sequence-sticky {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          height: calc(100svh - var(--budgetpro-nav-height));
          min-height: calc(100vh - var(--budgetpro-nav-height));
          margin: 0;
          padding: 0;
          overflow: hidden;
          background: #f1eff8;
          isolation: isolate;
        }
        .hero-sequence-sticky.is-fixed {
          position: fixed;
          top: var(--budgetpro-nav-height);
          bottom: auto;
        }
        .hero-sequence-sticky.is-ended {
          position: absolute;
          top: auto;
          bottom: 0;
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
          image-rendering: auto;
        }
        .hero-copy-section {
          position: relative;
          z-index: 2;
          margin: 0;
          padding: clamp(34px, 5vw, 72px) 20px clamp(38px, 5vw, 80px);
          background: #f1eff8;
          color: #0b1220;
        }
        .hero-copy-positioner {
          width: min(100%, 980px);
          margin: 0 auto;
          color: #0b1220;
        }
        .hero-copy-scroll-state,
        .hero-copy-float,
        .hero-copy-card {
          width: 100%;
        }
        .hero-copy-card {
          position: relative;
          overflow: visible;
          padding: 0;
          background: transparent;
          border: 0;
          box-shadow: none;
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
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
          margin: 19px 0 14px;
          width: 100%;
          max-width: 100%;
          color: #0b1220;
          font-family: "Playfair Display", Georgia, serif;
          font-size: clamp(38px, 3.1vw, 53px);
          font-weight: 700;
          line-height: 0.96;
          letter-spacing: 0;
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
          margin-top: 8px;
        }
        .hero-copy-description {
          max-width: 36ch;
          margin: 0 0 20px;
          color: #475569;
          font-family: var(--bp-body, 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
          font-size: clamp(14px, 1vw, 16px);
          line-height: 1.58;
          font-weight: 650;
          text-shadow: 0 1px 0 rgba(255,255,255,0.82);
        }
        .hero-copy-actions {
          display: flex;
          align-items: center;
          gap: 11px;
          flex-wrap: nowrap;
        }
        .hero-copy-actions a {
          min-height: 50px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 20px;
          border-radius: 999px;
          text-decoration: none;
          font-family: var(--bp-body, 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
          font-size: 13px;
          font-weight: 850;
          white-space: nowrap;
          color: #ffffff;
          background: linear-gradient(135deg, #2563eb, #4f46e5 48%, #8b5cf6);
          box-shadow:
            0 16px 38px rgba(79,70,229,0.26),
            inset 0 1px 0 rgba(255,255,255,0.48);
        }
        .hero-copy-actions a:focus-visible {
          outline: 3px solid rgba(59,130,246,0.55);
          outline-offset: 3px;
        }
        .hero-copy-actions a + a {
          color: #1e293b;
          background: linear-gradient(145deg, rgba(255,255,255,0.84), rgba(219,234,254,0.54), rgba(237,233,254,0.58));
          border: 1px solid rgba(255,255,255,0.90);
          box-shadow:
            0 12px 30px rgba(15,23,42,0.08),
            inset 0 1px 0 rgba(255,255,255,0.94);
        }
        @media (max-height: 760px) {
          .hero-sequence-section {
            height: 175svh;
            min-height: 980px;
          }
          .hero-copy-title {
            font-size: clamp(38px, 5vw, 62px);
          }
        }
        .hero-scroll-hint {
          position: absolute;
          left: 50%;
          bottom: 20px;
          z-index: 10;
          transform: translateX(-50%);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 36px;
          padding: 8px 13px;
          border-radius: 999px;
          color: #475569;
          font-family: var(--bp-body, 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
          font-size: 10px;
          font-weight: 850;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          white-space: nowrap;
          background: rgba(255,255,255,0.62);
          border: 1px solid rgba(255,255,255,0.82);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 10px 28px rgba(15,23,42,0.08);
          pointer-events: none;
          transition: opacity 160ms ease, transform 160ms ease;
        }
        .hero-scroll-hint__mouse {
          content: "";
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: #6366f1;
          box-shadow: 0 0 0 4px rgba(99,102,241,0.12);
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
          .hero-copy-section {
            padding: 30px 14px 44px;
          }
          .hero-copy-positioner {
            width: 100%;
          }
          .hero-sequence-kicker {
            min-height: 28px;
            margin-bottom: 12px;
            font-size: 9px;
            letter-spacing: 0.1em;
          }
          .hero-copy-title {
            max-width: 100%;
            font-size: clamp(32px, 9vw, 45px);
            line-height: 0.97;
          }
          .hero-copy-description {
            max-width: 100%;
            margin: 13px 0 17px;
            font-size: 14px;
            line-height: 1.55;
          }
          .hero-copy-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 9px;
          }
          .hero-copy-actions a {
            flex: 1;
            min-width: 0;
            padding: 0 12px;
            font-size: 13px;
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
            height: 145svh;
            min-height: 920px;
            margin: 0;
            padding: 0;
            overflow: visible;
          }
          .hero-sequence-sticky {
            height: calc(100svh - var(--budgetpro-nav-height));
            min-height: calc(100vh - var(--budgetpro-nav-height));
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
        @media (max-width: 389.98px) {
          .hero-copy-actions {
            grid-template-columns: 1fr;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-sequence-section {
            height: calc(100svh - var(--budgetpro-nav-height));
            min-height: 520px;
            overflow: hidden;
          }
          .hero-sequence-sticky {
            position: relative;
            top: 0;
            height: calc(100svh - var(--budgetpro-nav-height));
            min-height: 320px;
            overflow: hidden;
          }
          .hero-sequence-canvas {
            position: absolute;
            height: 100%;
          }
          .hero-scroll-hint {
            display: none;
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

        <div ref={scrollHintRef} className="hero-scroll-hint" aria-hidden="true">
          <span>Scroll to explore</span>
          <span className="hero-scroll-hint__mouse" />
        </div>

        {isLoading && (
          <div className="hero-sequence-status">Loading dashboard preview...</div>
        )}
      </div>
    </section>
    <section className="hero-copy-section" aria-labelledby="budgetpro-hero-title">
      <div className="hero-copy-positioner">
        <div className="hero-copy-scroll-state">
          <div className="hero-copy-float">
            <div className="hero-copy-card">
              <div className="hero-sequence-kicker">THE SMARTER WAY TO MANAGE MONEY</div>
              <h1 id="budgetpro-hero-title" className="hero-copy-title">
                <span>Your money isn&apos;t disappearing &mdash;</span>
                <span>now you can see exactly where it goes.</span>
              </h1>
              <p className="hero-copy-description">
                A beautifully designed tracker that transforms everyday spending into complete financial clarity.
              </p>
              <div className="hero-copy-actions">
                <a href="/#pricing">Get BudgetPro</a>
                <a href="/product">Explore Dashboard</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
