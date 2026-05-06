"use client";

import { GallerySection } from "@/components/sections/GallerySection";
import { HomeEventsSection } from "@/components/sections/HomeEventsSection";
import { InstagramFeedSection } from "@/components/sections/InstagramFeedSection";
import {
  PageHeroSection,
  pageHeroBottomAsideTextClass,
} from "@/components/PageHeroSection";
import { bookTableHeroHollowButtonClass } from "@/components/layout/SiteHeader";
import { LogoWordmark } from "@/components/LogoWordmark";
import { contactMailtoHref } from "@/config/site";
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
        accentVideo
        showOpeningCountdown
        bottomCta={
          <a
            href={contactMailtoHref()}
            className={bookTableHeroHollowButtonClass}
          >
            {t(locale, "page.contact.title")}
          </a>
        }
        bottomAside={
          <p className={pageHeroBottomAsideTextClass}>
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
      {/* Instagram grid: gated by `LAUNCH_UI_INSTAGRAM` in `config/launchUi.ts`. */}
      {LAUNCH_UI_INSTAGRAM ? <InstagramFeedSection /> : null}
    </div>
  );
}
