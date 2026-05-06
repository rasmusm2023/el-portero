"use client";

import { INSTAGRAM_PROFILE_URL, contactMailtoHref } from "@/config/site";
import { LAUNCH_UI_INSTAGRAM } from "@/config/launchUi";
import { PageHeroSection } from "@/components/PageHeroSection";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

type ComingSoonPageProps = {
  heroImages: string[];
};

const ctaClass =
  "inline-flex min-h-12 items-center justify-center rounded-none bg-gradient-to-r from-gold-bright/95 via-gold to-gold-bright/95 px-8 py-3 text-xs font-semibold tracking-[0.12em] text-ink shadow-[0_12px_38px_rgba(0,0,0,0.45)] ring-1 ring-gold-bright/45 transition-[filter,box-shadow] hover:brightness-105 hover:shadow-[0_16px_44px_rgba(201,164,74,0.22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold/55 active:brightness-95 sm:min-h-13 sm:px-10 sm:py-3.5 sm:text-sm";

const secondaryCtaClass =
  "inline-flex min-h-12 items-center justify-center rounded-none border border-paper/55 bg-transparent px-8 py-3 text-xs font-semibold tracking-[0.12em] text-paper transition-colors hover:border-paper/80 hover:bg-paper/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper/50 sm:min-h-13 sm:px-10 sm:py-3.5 sm:text-sm";

export function ComingSoonPage({ heroImages }: ComingSoonPageProps) {
  const { locale } = useLocale();

  return (
    <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
      <PageHeroSection
        heroImages={heroImages}
        accentVideo={false}
        bottomCta={
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <a href={contactMailtoHref()} className={ctaClass}>
              {t(locale, "page.comingSoon.contactCta")}
            </a>
            {LAUNCH_UI_INSTAGRAM ? (
              <a
                href={INSTAGRAM_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={secondaryCtaClass}
              >
                {t(locale, "page.comingSoon.instagramCta")}
              </a>
            ) : null}
          </div>
        }
      >
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-paper/75 uppercase">
            El Portero
          </p>
          <h1 className="mt-5 font-hero-title text-[clamp(2.25rem,6vw,4.25rem)] font-normal leading-[1.05] tracking-[0.14em] text-paper uppercase">
            {t(locale, "page.comingSoon.title")}
          </h1>
          <p className="mx-auto mt-8 max-w-2xl font-sans text-base leading-[1.75] text-paper/85 sm:mt-10 sm:text-lg">
            {t(locale, "page.comingSoon.subtitle")}
          </p>
        </div>
      </PageHeroSection>
    </div>
  );
}
