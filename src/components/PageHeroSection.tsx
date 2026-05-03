"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { HeroSlideshow } from "@/components/HeroSlideshow";

const heroRadialOverlayStyle = {
  backgroundImage: `radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.06) 0%, transparent 55%),
    radial-gradient(ellipse at 70% 80%, rgba(255,255,255,0.04) 0%, transparent 50%)`,
} as const;

type PageHeroSectionProps = {
  heroImages: string[];
  children: ReactNode;
  /** Centered action(s) toward the lower third of the hero (e.g. primary CTA). */
  bottomCta?: ReactNode;
  /** Optional bottom-right block (e.g. home tagline). */
  bottomAside?: ReactNode;
};

/**
 * Shared full-bleed hero shell: slideshow, dim + radial overlays, rounded ink card.
 * Matches the home page visual language for continuity across routes.
 */
export function PageHeroSection({
  heroImages,
  children,
  bottomCta,
  bottomAside,
}: PageHeroSectionProps) {
  const heroSectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={heroSectionRef}
      className="relative bg-paper pb-6 pt-0 text-ink sm:pb-8"
    >
      <div className="mx-auto w-full max-w-[min(100%,112rem)] px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-ink text-paper shadow-[0_28px_64px_-18px_rgba(10,10,10,0.18)] ring-1 ring-ink/10 sm:rounded-3xl">
          <HeroSlideshow images={heroImages} containerRef={heroSectionRef} />
          {heroImages.length > 0 && (
            <div className="absolute inset-0 z-[1] bg-ink/50" aria-hidden />
          )}
          <div
            className="absolute inset-0 z-[2] opacity-40"
            style={heroRadialOverlayStyle}
            aria-hidden
          />
          <div className="relative z-10 flex w-full min-h-[min(82vh,54rem)] flex-col items-center px-5 pb-14 pt-10 sm:px-10 sm:pb-20 sm:pt-12 md:pt-14 lg:px-14 xl:px-20">
            <div className="flex flex-1 flex-col items-center justify-center px-2 py-10 sm:py-14 md:py-16">
              <div className="w-full max-w-5xl text-center text-paper">{children}</div>
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
