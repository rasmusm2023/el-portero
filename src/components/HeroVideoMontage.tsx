"use client";

import type { RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import type { HeroMontageClip } from "@/lib/heroVideos";
import { HERO_MONTAGE_CLIP_MS } from "@/lib/heroVideos";

/** Longer dissolve + smooth easing so cuts read like one graded edit. */
const FADE_MS = 2100;
const FADE_EASE = "cubic-bezier(0.38, 0.02, 0.18, 1)";
/** Start loading the next clip slightly before the nominal cut so playback never freezes on a paused frame. */
const ADVANCE_PRE_BUFFER_MS = 380;
/** If `HTMLMediaElement.play()` never settles (browser quirk), force recovery instead of hanging forever. */
const PLAY_PROMISE_TIMEOUT_MS = 9000;
/** If a transition never finishes (stuck `advancingRef`), force another advance attempt. */
const ADVANCE_STUCK_MS = 14000;
/** Match {@link HeroSlideshow}: scroll multiplier for background vs foreground. */
const PARALLAX_FACTOR = 0.32;
/** Extra scale so parallax does not reveal edges. */
const PARALLAX_SCALE = 1.12;

type Props = {
  clips: HeroMontageClip[];
  containerRef: RefObject<HTMLElement | null>;
};

function applyClipFraming(el: HTMLVideoElement, clip: HeroMontageClip) {
  if (clip.objectPosition) {
    el.style.objectPosition = clip.objectPosition;
  } else {
    el.style.removeProperty("object-position");
  }
  const scale = clip.objectScale ?? 1;
  if (scale !== 1 && Number.isFinite(scale)) {
    el.style.transform = `scale(${scale})`;
    el.style.transformOrigin =
      clip.transformOrigin ?? clip.objectPosition ?? "center center";
  } else {
    el.style.removeProperty("transform");
    el.style.removeProperty("transform-origin");
  }
}

export function HeroVideoMontage({ clips, containerRef }: Props) {
  const [parallaxY, setParallaxY] = useState(0);
  const [opacities, setOpacities] = useState<[number, number]>([1, 0]);
  const [reduceMotionSingle, setReduceMotionSingle] = useState(false);

  const videoRef0 = useRef<HTMLVideoElement>(null);
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const topLayerRef = useRef(0);
  const clipIndexRef = useRef(0);
  const advancingRef = useRef(false);
  /** Cleared on each new advance so an old load fallback cannot fire mid-transition. */
  const loadFallbackTimerRef = useRef<number | null>(null);
  const clipsRef = useRef(clips);
  /** Wall-clock start for the clip currently on screen (after fade commit or first `playing`). */
  const clipShownAtRef = useRef<number | null>(null);

  clipsRef.current = clips;

  useEffect(() => {
    if (clips.length === 0) return;

    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const scrollY = window.scrollY;
      const max = el.offsetHeight + 120;
      const y = Math.min(Math.max(scrollY, 0), max) * PARALLAX_FACTOR;
      setParallaxY(y);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [clips.length, containerRef]);

  /** deps: `clips.length` only — a new `clips` array reference each render would remount and kill the montage mid-loop. */
  useEffect(() => {
    const v0 = videoRef0.current;
    const v1 = videoRef1.current;
    if (!v0 || clips.length === 0) return;

    /** When crossfade holds `advancingRef`, queue one advance after idle (e.g. `ended`). */
    const enqueueAdvanceWhenIdle = (runAdvance: () => void) => {
      let retries = 0;
      const maxRetries = 600;
      const tick = () => {
        if (!advancingRef.current) {
          runAdvance();
          return;
        }
        if (retries >= maxRetries) return;
        retries += 1;
        window.setTimeout(tick, 40);
      };
      tick();
    };

    const markClipShownNow = () => {
      clipShownAtRef.current = performance.now();
    };

    function playWithTimeout(el: HTMLVideoElement): Promise<void> {
      return new Promise((resolve, reject) => {
        const tid = window.setTimeout(() => {
          reject(new Error("play timeout"));
        }, PLAY_PROMISE_TIMEOUT_MS);
        void el.play().then(
          () => {
            clearTimeout(tid);
            resolve();
          },
          (e) => {
            clearTimeout(tid);
            reject(e);
          },
        );
      });
    }

    /**
     * Wall-clock poll vs `visibleMs`. Calls `advance()` directly when not mid-crossfade — avoids
     * silent failure when `enqueueAdvanceWhenIdle` exhausts retries.
     */
    const tickClipBudget = (runAdvance: () => void) => {
      const list = clipsRef.current;
      if (list.length <= 1) return;
      if (advancingRef.current) return;
      const since = clipShownAtRef.current;
      if (since == null) return;
      const idx = clipIndexRef.current;
      const clip = list[idx];
      if (!clip) return;
      const budget = clip.visibleMs ?? HERO_MONTAGE_CLIP_MS;
      const threshold = Math.max(400, budget - ADVANCE_PRE_BUFFER_MS);
      if (performance.now() - since >= threshold) {
        runAdvance();
      }
    };

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const list = clipsRef.current;

    if (reduceMotion || list.length === 1) {
      setReduceMotionSingle(true);
      setOpacities([1, 0]);
      const first = list[0];
      v0.src = first.src;
      v0.playbackRate = first.playbackRate ?? 1;
      applyClipFraming(v0, first);
      v0.loop = true;
      v0.muted = true;
      v0.playsInline = true;
      void v0.play().catch(() => {});
      return () => {
        v0.pause();
      };
    }

    setReduceMotionSingle(false);
    topLayerRef.current = 0;
    clipIndexRef.current = 0;
    advancingRef.current = false;
    setOpacities([1, 0]);

    let advanceStuckTimerId: number | null = null;
    const clearAdvanceStuckTimer = () => {
      if (advanceStuckTimerId != null) {
        clearTimeout(advanceStuckTimerId);
        advanceStuckTimerId = null;
      }
    };

    const advance = () => {
      const clipList = clipsRef.current;
      if (clipList.length <= 1) return;
      if (advancingRef.current) return;
      advancingRef.current = true;
      clearAdvanceStuckTimer();
      advanceStuckTimerId = window.setTimeout(() => {
        advanceStuckTimerId = null;
        if (!advancingRef.current) return;
        console.warn("[HeroVideoMontage] Advance stuck; forcing recovery.");
        advancingRef.current = false;
        advance();
      }, ADVANCE_STUCK_MS);
      if (loadFallbackTimerRef.current != null) {
        clearTimeout(loadFallbackTimerRef.current);
        loadFallbackTimerRef.current = null;
      }

      const nextIdx = (clipIndexRef.current + 1) % clipList.length;
      const nextClip = clipList[nextIdx];
      const curTop = topLayerRef.current;
      const backIdx = 1 - curTop;
      const backEl = backIdx === 0 ? videoRef0.current : videoRef1.current;
      const topEl = curTop === 0 ? videoRef0.current : videoRef1.current;
      if (!backEl || !topEl) {
        advancingRef.current = false;
        clearAdvanceStuckTimer();
        return;
      }

      backEl.src = nextClip.src;
      backEl.playbackRate = nextClip.playbackRate ?? 1;
      applyClipFraming(backEl, nextClip);
      backEl.muted = true;
      backEl.playsInline = true;
      backEl.loop = false;
      backEl.currentTime = 0;
      backEl.load();

      const startFade = () => {
        void playWithTimeout(backEl)
          .then(() => {
            backEl.addEventListener(
              "ended",
              () => enqueueAdvanceWhenIdle(advance),
              { once: true },
            );
            setOpacities(backIdx === 0 ? [1, 0] : [0, 1]);
            window.setTimeout(() => {
              topEl.pause();
              topEl.removeAttribute("src");
              topEl.style.removeProperty("object-position");
              topEl.style.removeProperty("transform");
              topEl.style.removeProperty("transform-origin");
              topEl.load();
              clipIndexRef.current = nextIdx;
              topLayerRef.current = backIdx;
              advancingRef.current = false;
              clearAdvanceStuckTimer();
              /** Wall-clock budget starts once this clip owns the stack (matches visible edit point). */
              markClipShownNow();
            }, FADE_MS);
          })
          .catch(() => {
            clearAdvanceStuckTimer();
            advancingRef.current = false;
            window.setTimeout(() => advance(), 80);
          });
      };

      /** Wait for new `src` to be decodable — never use readyState right after `load()` (stale / races). */
      let fadeArmStarted = false;

      const onLoadError = () => {
        console.warn("[HeroVideoMontage] Clip failed to load:", nextClip.src);
        if (loadFallbackTimerRef.current != null) {
          clearTimeout(loadFallbackTimerRef.current);
          loadFallbackTimerRef.current = null;
        }
        try {
          backEl.removeAttribute("src");
          backEl.load();
        } catch {
          /* ignore */
        }
        /** Pretend we advanced past this index so the next `advance()` loads the following clip (skip bad file). */
        clipIndexRef.current = nextIdx;
        advancingRef.current = false;
        clearAdvanceStuckTimer();
        markClipShownNow();
        window.setTimeout(() => advance(), 0);
      };

      const armFade = () => {
        if (fadeArmStarted) return;
        if (backEl.error) {
          onLoadError();
          return;
        }
        fadeArmStarted = true;
        if (loadFallbackTimerRef.current != null) {
          clearTimeout(loadFallbackTimerRef.current);
          loadFallbackTimerRef.current = null;
        }
        backEl.removeEventListener("canplaythrough", armFade);
        backEl.removeEventListener("canplay", armFade);
        backEl.removeEventListener("loadeddata", armFade);
        startFade();
      };

      backEl.addEventListener("error", onLoadError, { once: true });

      backEl.addEventListener("canplaythrough", armFade);
      backEl.addEventListener("canplay", armFade);
      backEl.addEventListener("loadeddata", armFade);
      loadFallbackTimerRef.current = window.setTimeout(() => {
        loadFallbackTimerRef.current = null;
        if (!fadeArmStarted) armFade();
      }, 2800);
    };

    clipShownAtRef.current = null;

    /** Wall-clock poll — survives effect quirks better than a single `setTimeout` from `play()`. */
    const watchdogId = window.setInterval(() => {
      tickClipBudget(advance);
    }, 200);

    const first = list[0];
    v0.src = first.src;
    v0.playbackRate = first.playbackRate ?? 1;
    applyClipFraming(v0, first);
    v0.muted = true;
    v0.playsInline = true;
    v0.loop = false;
    v0.addEventListener(
      "ended",
      () => enqueueAdvanceWhenIdle(advance),
      { once: true },
    );
    void playWithTimeout(v0)
      .then(() => {
        markClipShownNow();
      })
      .catch(() => {
        markClipShownNow();
        void v0.play().catch(() => {});
      });

    return () => {
      window.clearInterval(watchdogId);
      clearAdvanceStuckTimer();
      clipShownAtRef.current = null;
      if (loadFallbackTimerRef.current != null) {
        clearTimeout(loadFallbackTimerRef.current);
        loadFallbackTimerRef.current = null;
      }
      v0.pause();
      v1?.pause();
    };
  }, [clips.length]);

  if (clips.length === 0) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-ink"
      aria-hidden
    >
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          transform: `translate3d(0, ${parallaxY}px, 0) scale(${PARALLAX_SCALE})`,
        }}
      >
        {[0, 1].map((i) => {
          const o = i === 0 ? opacities[0] : opacities[1];
          const other = i === 0 ? opacities[1] : opacities[0];
          return (
            <div
              key={i}
              className="absolute inset-0 overflow-hidden transition-opacity"
              style={{
                opacity: o,
                transitionDuration: `${FADE_MS}ms`,
                transitionTimingFunction: FADE_EASE,
                zIndex: o > other ? 2 : o < other ? 1 : i === 0 ? 2 : 1,
              }}
            >
              <video
                ref={i === 0 ? videoRef0 : videoRef1}
                className="h-full w-full object-cover will-change-transform"
                muted
                playsInline
                preload={reduceMotionSingle && i === 1 ? "none" : "metadata"}
                autoPlay={i === 0 && reduceMotionSingle}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
