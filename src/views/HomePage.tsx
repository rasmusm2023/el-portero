"use client";

import { GallerySection } from "@/components/sections/GallerySection";
import { HomeEventsSection } from "@/components/sections/HomeEventsSection";
import { InstagramFeedSection } from "@/components/sections/InstagramFeedSection";
import {
  PageHeroSection,
  pageHeroHomeTaglineDesktopClass,
  pageHeroHomeTaglineMobileClass,
} from "@/components/PageHeroSection";
import { bookTableHeroHollowButtonClass } from "@/components/layout/SiteHeader";
import { LogoWordmark } from "@/components/LogoWordmark";
import Link from "next/link";
import { LAUNCH_UI_INSTAGRAM } from "@/config/launchUi";
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
        showOpeningCountdown
        bottomCta={
          <Link
            href="/menu"
            className={[bookTableHeroHollowButtonClass, "-translate-y-16 sm:-translate-y-11 md:-translate-y-14"]
              .filter(Boolean)
              .join(" ")}
          >
            {t(locale, "page.menu.title")}
          </Link>
        }
        bottomAside={
          <div className="min-w-0 max-w-full">
            <p
              className={[pageHeroHomeTaglineMobileClass, "text-sm"].filter(Boolean).join(" ")}
            >
              {t(locale, "page.home.heroTaglineMobile")}
            </p>
            <p
              className={[pageHeroHomeTaglineDesktopClass, "text-sm sm:text-base"]
                .filter(Boolean)
                .join(" ")}
            >
              {t(locale, "page.home.heroTagline")}
            </p>
          </div>
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
      {/* Instagram grid: gated by `LAUNCH_UI_INSTAGRAM` in `config/launchUi.ts`. */}
      {LAUNCH_UI_INSTAGRAM ? <InstagramFeedSection /> : null}
    </div>
  );
}
