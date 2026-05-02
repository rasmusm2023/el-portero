"use client";

import Link from "next/link";
import { GallerySection } from "@/components/sections/GallerySection";
import { HomeEventsSection } from "@/components/sections/HomeEventsSection";
import { InstagramFeedSection } from "@/components/sections/InstagramFeedSection";
import { PageHeroSection } from "@/components/PageHeroSection";
import { LogoWordmark } from "@/components/LogoWordmark";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

type HomePageProps = {
  heroImages?: string[];
};

export function HomePage({ heroImages = [] }: HomePageProps) {
  const { locale } = useLocale();
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeroSection
        heroImages={heroImages}
        bottomCta={
          <Link
            href="/reserve"
            className="inline-flex items-center justify-center rounded-lg border border-paper/45 bg-paper/10 px-8 py-3.5 text-xs font-semibold tracking-[0.24em] text-paper uppercase transition-colors hover:border-paper hover:bg-paper hover:text-ink sm:px-10 sm:py-4 sm:text-sm sm:tracking-[0.28em]"
          >
            {t(locale, "page.home.heroReserveCta")}
          </Link>
        }
        bottomAside={
          <p className="max-w-[28rem] text-right font-sans text-xs font-medium tracking-[0.22em] text-paper/85 uppercase sm:text-sm">
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
