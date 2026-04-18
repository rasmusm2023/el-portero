"use client";

import { GallerySection } from "@/components/sections/GallerySection";
import { HomeEventsSection } from "@/components/sections/HomeEventsSection";
import { InstagramFeedSection } from "@/components/sections/InstagramFeedSection";
import { HoursAndMapSection } from "@/components/sections/HoursAndMapSection";
import { PageHeroSection } from "@/components/PageHeroSection";
import { LogoWordmark } from "@/components/LogoWordmark";

type HomePageProps = {
  heroImages?: string[];
};

export function HomePage({ heroImages = [] }: HomePageProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeroSection
        heroImages={heroImages}
        bottomAside={
          <p className="max-w-[28rem] text-right font-sans text-xs font-medium tracking-[0.22em] text-paper/85 uppercase sm:text-sm">
            South American cuisine fused with Swedish classics — dinner club
            nights in Torrevieja
          </p>
        }
      >
        <div className="mx-auto flex w-full max-w-[46rem] flex-col items-center">
          <LogoWordmark
            size="hero"
            showTagline={false}
            tone="onDark"
            className="mb-5 scale-[1.35] sm:mb-6 sm:scale-[1.5] md:mb-7 md:scale-[1.65]"
          />
        </div>
      </PageHeroSection>

      <HomeEventsSection />

      <GallerySection />
      <InstagramFeedSection />
      <HoursAndMapSection />
    </div>
  );
}
