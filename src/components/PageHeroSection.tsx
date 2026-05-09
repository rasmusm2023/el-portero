"use client";

import type { ReactNode, RefObject } from "react";
import { useEffect, useRef } from "react";
import { HeroOpeningCountdown } from "@/components/HeroOpeningCountdown";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { HeroVideoMontage } from "@/components/HeroVideoMontage";
import type { HeroMontageClip } from "@/lib/heroVideos";
import { CLOUDINARY_IMG } from "@/lib/cloudinaryStillImages";
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

function HeroAccentImage({
  containerRef,
}: {
  containerRef: RefObject<HTMLElement | null>;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const smoothRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const img = imgRef.current;
    if (!img || typeof window === "undefined") return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    /** Lower = silkier follow (more frames to settle); higher = snappier. */
    const ease = reduceMotion ? 1 : 0.11;

    /** Keep focal point inside the frame — large % past ~90 / below ~40 show empty with `object-cover`. */
    const apply = (shift: number) => {
      const ox = 76 + shift * 14;
      const oy = 50 - shift * 10;
      img.style.objectPosition = `${ox}% ${oy}%`;
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
        <picture className="block h-full w-full">
          <source srcSet={CLOUDINARY_IMG.galleryTostada.webp} type="image/webp" />
          <img
            ref={imgRef}
            src={CLOUDINARY_IMG.galleryTostada.jpeg}
            alt=""
            className="h-full w-full object-cover will-change-[object-position]"
            style={{ objectPosition: "76% 50%" }}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </picture>
      </div>
    </div>
  );
}

const heroRadialOverlayStyle = {
  backgroundImage: `radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.06) 0%, transparent 55%),
    radial-gradient(ellipse at 70% 80%, rgba(255,255,255,0.04) 0%, transparent 50%)`,
} as const;

/** Font + tracking for hero tagline / aside (no white-space mode — add `whitespace-pre-line` for single-block copy). */
const pageHeroTaglineTypographyCore =
  "shrink text-left font-sans text-xs font-semibold leading-snug tracking-[0.14em] text-paper/85 uppercase sm:text-sm sm:tracking-[0.18em] lg:tracking-[0.22em] lg:ps-2 xl:ps-3";

/** Shared typography for bottom hero aside when using `\n` inside one `<p>`. */
const pageHeroBottomAsideTextBase =
  `${pageHeroTaglineTypographyCore} whitespace-pre-line`;

/** @deprecated Kept for imports; same typography as home with a smaller max width. Prefer mobile/desktop tagline classes on `/`. */
export const pageHeroBottomAsideTextClass =
  `${pageHeroBottomAsideTextBase} max-w-[min(52rem,calc(100%-3rem))] sm:max-w-[min(52rem,calc(100%-4rem))]`;

/** Mobile only — shorter copy, no line clamp. */
export const pageHeroHomeTaglineMobileClass =
  `${pageHeroBottomAsideTextBase} max-w-[min(36rem,calc(100%-2.5rem))] sm:hidden`;

/**
 * sm+ — home hero tagline: natural wrap, no line clamp; width steps up from tablet to large desktop.
 */
export const pageHeroHomeTaglineDesktopClass =
  `${pageHeroTaglineTypographyCore} hidden whitespace-normal sm:block max-w-[min(36rem,calc(100%-2.5rem))] md:max-w-[min(42rem,calc(100%-3rem))] lg:max-w-[min(48rem,calc(100%-3.5rem))] xl:max-w-[min(56rem,calc(100%-4rem))]`;

/** @deprecated Prefer {@link pageHeroHomeTaglineMobileClass} + {@link pageHeroHomeTaglineDesktopClass}. */
export const pageHeroHomeTaglineTextClass =
  `${pageHeroTaglineTypographyCore} whitespace-normal max-w-[min(36rem,calc(100%-2.5rem))] md:max-w-[min(42rem,calc(100%-3rem))] lg:max-w-[min(48rem,calc(100%-3.5rem))] xl:max-w-[min(56rem,calc(100%-4rem))]`;

type PageHeroSectionProps = {
  heroImages: string[];
  /** Default: `cover` (cinematic crop). `contain` shows full image (no crop) for pages like Story. */
  heroImageFit?: "cover" | "contain";
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
  /** Optional bottom-left block (e.g. home tagline). */
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
  heroImageFit = "cover",
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
            <HeroVideoMontage
              clips={heroVideos}
              containerRef={heroSectionRef}
            />
          ) : (
            <HeroSlideshow
              images={heroImages}
              containerRef={heroSectionRef}
              fit={heroImageFit}
            />
          )}
          {hasHeroMedia && (
            <div className="absolute inset-0 z-[1] bg-ink/50" aria-hidden />
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
            <HeroAccentImage containerRef={heroSectionRef} />
          ) : null}
          <div className="relative z-10 flex w-full min-h-[min(82vh,54rem)] flex-col items-center px-5 pb-14 pt-10 sm:px-10 sm:pb-20 sm:pt-12 md:pt-14 lg:px-14 xl:px-20">
            <div className="flex flex-1 flex-col items-center justify-center px-2 py-10 sm:py-14 md:py-16">
              <div className="relative z-[6] w-full max-w-5xl text-center text-paper">
                {children}
              </div>
            </div>
            {bottomCta ? (
              <div className="relative z-20 -mt-10 mb-8 flex w-full justify-center px-2 pb-2 sm:-mt-14 sm:mb-10 sm:pb-0 md:-mt-16">
                {bottomCta}
              </div>
            ) : null}
            {bottomAside ? (
              <div className="absolute inset-x-5 bottom-8 z-20 box-border flex w-full min-w-0 justify-start pl-7 sm:inset-x-10 sm:bottom-10 sm:pl-10 lg:inset-x-14 lg:pl-14 xl:inset-x-20 xl:pl-16 2xl:pl-20">
                {bottomAside}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
