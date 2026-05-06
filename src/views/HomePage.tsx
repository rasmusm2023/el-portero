"use client";

import Link from "next/link";
import { GallerySection } from "@/components/sections/GallerySection";
import { HomeEventsSection } from "@/components/sections/HomeEventsSection";
import { InstagramFeedSection } from "@/components/sections/InstagramFeedSection";
import { PageHeroSection } from "@/components/PageHeroSection";
import { bookTableHeroHollowButtonClass } from "@/components/layout/SiteHeader";
import { LogoWordmark } from "@/components/LogoWordmark";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";
import type { HeroMontageClip } from "@/lib/heroVideos";

type HomePageProps = {
  heroVideos: HeroMontageClip[];
};

export function HomePage({ heroVideos }: HomePageProps) {
  const { locale } = useLocale();
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeroSection
        heroImages={[]}
        heroVideos={heroVideos}
        accentVideo
        showOpeningCountdown
        bottomCta={
          <Link
            href="/menu"
            className={bookTableHeroHollowButtonClass}
          >
            {t(locale, "page.menu.title")}
          </Link>
        }
        bottomAside={
          <p className="max-w-[min(52rem,calc(100%-3rem))] shrink whitespace-pre-line text-right font-sans text-xs font-medium leading-snug tracking-[0.14em] text-paper/85 uppercase sm:max-w-[min(52rem,calc(100%-4rem))] sm:text-sm sm:tracking-[0.18em] lg:tracking-[0.22em] lg:pe-2 xl:pe-3">
            {t(locale, "page.home.heroTagline")}
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

      <GallerySection />
      <HomeEventsSection />
      <InstagramFeedSection />
    </div>
  );
}
