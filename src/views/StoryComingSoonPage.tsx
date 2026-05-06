"use client";

import { PageHeroSection } from "@/components/PageHeroSection";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

type StoryComingSoonPageProps = {
  heroImages: string[];
};

export function StoryComingSoonPage({ heroImages }: StoryComingSoonPageProps) {
  const { locale } = useLocale();

  return (
    <PageHeroSection heroImages={heroImages}>
      <h1 className="font-hero-title text-[clamp(2.25rem,6vw,4.25rem)] font-normal leading-[1.05] tracking-[0.14em] text-paper uppercase">
        {t(locale, "page.story.title")}
      </h1>
      <p className="mt-8 font-sans text-sm font-semibold tracking-[0.28em] text-paper/95 uppercase sm:mt-9 sm:text-base">
        {t(locale, "page.comingSoon.title")}
      </p>
      <p className="mx-auto mt-6 max-w-2xl font-sans text-base leading-[1.75] text-paper/85 sm:mt-7 sm:text-lg">
        {t(locale, "page.story.comingSoonBody")}
      </p>
    </PageHeroSection>
  );
}
