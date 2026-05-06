"use client";

import type { ReactNode, RefObject } from "react";
import { useEffect, useRef } from "react";
import { HeroOpeningCountdown } from "@/components/HeroOpeningCountdown";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { HeroVideoMontage } from "@/components/HeroVideoMontage";
import type { HeroMontageClip } from "@/lib/heroVideos";
import { OPENING_COUNTDOWN_END } from "@/lib/openingCountdown";

/** Scroll progress 0→1 as the user scrolls through / past the hero (drives object-position). */
function heroScrollShift(containerRef: RefObject<HTMLElement | null>): number {
  const el = containerRef.current;
  if (!el) return 0;
  const rect = el.getBoundingClientRect();
  const scrollY = window.scrollY;
  const vh = window.innerHeight;
  const heroTop = scrollY + rect.top;
  const h = rect.height;
  const start = heroTop - vh * 0.15;
  const end = heroTop + h * 0.5;
  const t = (scrollY - start) / Math.max(end - start, 1);
  return Math.min(1, Math.max(0, t));
}

function HeroAccentVideo({ containerRef }: { containerRef: RefObject<HTMLElement | null> }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const smoothRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || typeof window === "undefined") return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    /** Lower = silkier follow (more frames to settle); higher = snappier. */
    const ease = reduceMotion ? 1 : 0.11;

    /** Keep focal point inside the frame — large % past ~90 / below ~40 show empty with `object-cover`. */
    const apply = (shift: number) => {
      const ox = 76 + shift * 14;
      const oy = 50 - shift * 10;
      video.style.objectPosition = `${ox}% ${oy}%`;
    };

    const tick = () => {
      const target = heroScrollShift(containerRef);
      const cur = smoothRef.current;
      const next = reduceMotion ? target : cur + (target - cur) * ease;
      smoothRef.current = next;
      apply(next);

      if (!reduceMotion && Math.abs(target - next) > 0.0004) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        smoothRef.current = target;
        apply(target);
        rafRef.current = 0;
      }
    };

    const kick = () => {
      if (reduceMotion) {
        smoothRef.current = heroScrollShift(containerRef);
        apply(smoothRef.current);
        return;
      }
      if (rafRef.current === 0) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    kick();
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick, { passive: true });
    return () => {
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };
  }, [containerRef]);

  /* Vertical nudge: subtract 180px from the pull-up so the clip overlaps the hero edge a bit lower. */
  return (
    <div
      className="pointer-events-none absolute left-[max(0.5rem,9vw)] top-full z-[8] -translate-y-[calc(54%+0.28rem-180px)] sm:left-[max(0.75rem,11vw)] sm:-translate-y-[calc(57%+0.38rem-180px)] md:left-[max(1rem,13vw)] lg:left-[max(1.25rem,14vw)]"
      aria-hidden
    >
      <div className="aspect-[3/4] w-[clamp(7rem,28vw,18rem)] translate-x-[6%] overflow-hidden shadow-[0_22px_56px_-10px_rgba(0,0,0,0.55)] sm:w-[clamp(8rem,24vw,20rem)] sm:translate-x-[8%] md:w-[clamp(8.75rem,20vw,22rem)] md:translate-x-[10%] lg:w-[clamp(9.25rem,18vw,24rem)] lg:translate-x-[12%]">
        <video
          ref={videoRef}
          className="h-full w-full object-cover will-change-[object-position]"
          style={{ objectPosition: "76% 50%" }}
          src="/videos/bartender-making-drink.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      </div>
    </div>
  );
}

const heroRadialOverlayStyle = {
  backgroundImage: `radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.06) 0%, transparent 55%),
    radial-gradient(ellipse at 70% 80%, rgba(255,255,255,0.04) 0%, transparent 50%)`,
} as const;

/** Bottom-right `<p>` in `/` hero and coming-soon hero — identical tracking and uppercase rhythm. */
export const pageHeroBottomAsideTextClass =
  "max-w-[min(52rem,calc(100%-3rem))] shrink whitespace-pre-line text-right font-sans text-xs font-medium leading-snug tracking-[0.14em] text-paper/85 uppercase sm:max-w-[min(52rem,calc(100%-4rem))] sm:text-sm sm:tracking-[0.18em] lg:tracking-[0.22em] lg:pe-2 xl:pe-3";

type PageHeroSectionProps = {
  heroImages: string[];
  /**
   * When non-empty, replaces the image slideshow with a muted, parallax video montage.
   * Takes precedence over `heroImages` for the background layer.
   */
  heroVideos?: HeroMontageClip[];
  children: ReactNode;
  /** Large opening countdown (May 14); sits above video, below logo. */
  showOpeningCountdown?: boolean;
  /** Centered action(s) toward the lower third of the hero (e.g. primary CTA). */
  bottomCta?: ReactNode;
  /** Optional bottom-right block (e.g. home tagline). */
  bottomAside?: ReactNode;
  /**
   * Portrait video accent beside the hero (e.g. bartender clip). Use only on `/` — other routes
   * should leave this false so heroes stay image-only.
   */
  accentVideo?: boolean;
};

/**
 * Shared full-bleed hero shell: edge-to-edge slideshow, dim + radial overlays, optional portrait video accent.
 */
export function PageHeroSection({
  heroImages,
  heroVideos,
  children,
  bottomCta,
  bottomAside,
  accentVideo = false,
  showOpeningCountdown = false,
}: PageHeroSectionProps) {
  const heroSectionRef = useRef<HTMLElement>(null);
  const useVideoBg = heroVideos != null && heroVideos.length > 0;
  const hasHeroMedia = useVideoBg || heroImages.length > 0;

  return (
    <section
      ref={heroSectionRef}
      className="relative w-full overflow-x-clip bg-ink pb-6 pt-0 text-paper sm:pb-8"
    >
      <div className="relative w-full">
        <div className="relative w-full overflow-visible bg-ink text-paper shadow-[0_28px_64px_-18px_rgba(10,10,10,0.18)]">
          {useVideoBg ? (
            <HeroVideoMontage clips={heroVideos} containerRef={heroSectionRef} />
          ) : (
            <HeroSlideshow images={heroImages} containerRef={heroSectionRef} />
          )}
          {hasHeroMedia && (
            <div className="absolute inset-0 z-[1] bg-ink/62" aria-hidden />
          )}
          <div
            className="absolute inset-0 z-[2] opacity-40"
            style={heroRadialOverlayStyle}
            aria-hidden
          />
          {hasHeroMedia && showOpeningCountdown ? (
            <HeroOpeningCountdown targetDate={OPENING_COUNTDOWN_END} />
          ) : null}
          {hasHeroMedia && accentVideo ? (
            <HeroAccentVideo containerRef={heroSectionRef} />
          ) : null}
          <div className="relative z-10 flex w-full min-h-[min(82vh,54rem)] flex-col items-center px-5 pb-14 pt-10 sm:px-10 sm:pb-20 sm:pt-12 md:pt-14 lg:px-14 xl:px-20">
            <div className="flex flex-1 flex-col items-center justify-center px-2 py-10 sm:py-14 md:py-16">
              <div className="relative z-[6] w-full max-w-5xl text-center text-paper">
                {children}
              </div>
            </div>
            {bottomCta ? (
              <div className="relative z-20 -mt-6 mb-6 flex w-full justify-center px-2 pb-2 sm:-mt-8 sm:mb-10 sm:pb-0 md:-mt-10">
                {bottomCta}
              </div>
            ) : null}
            {bottomAside ? (
              <div className="absolute inset-x-5 bottom-8 z-20 box-border flex w-full min-w-0 justify-end pr-7 sm:inset-x-10 sm:bottom-10 sm:pr-10 lg:inset-x-14 lg:pr-14 xl:inset-x-20 xl:pr-16 2xl:pr-20">
                {bottomAside}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
