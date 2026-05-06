"use client";

import { contactMailtoHref } from "@/config/site";
import { LogoWordmark } from "@/components/LogoWordmark";
import { PageHeroSection } from "@/components/PageHeroSection";
import { HeroOpeningCountdown } from "@/components/HeroOpeningCountdown";
import { bookTableHeroHollowButtonClass } from "@/components/layout/SiteHeader";
import { VENUE_ADDRESS, googleMapsSearchUrl } from "@/constants/venue";
import { OPENING_COUNTDOWN_END } from "@/lib/openingCountdown";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

type ComingSoonPageProps = {
  heroImages: string[];
};

export function ComingSoonPage({ heroImages }: ComingSoonPageProps) {
  const { locale } = useLocale();

  return (
    <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
      <PageHeroSection heroImages={heroImages} accentVideo={false}>
        <div className="mx-auto flex w-full max-w-[46rem] flex-col items-center">
          <LogoWordmark
            size="hero"
            showTagline={false}
            tone="onDark"
            className="mb-5 scale-[1.35] sm:mb-6 sm:scale-[1.5] md:mb-7 md:scale-[1.65]"
          />
          <p className="mt-14 font-hero-title text-[clamp(1.75rem,5.5vw,3.65rem)] font-normal leading-[1.06] tracking-[0.14em] text-paper uppercase sm:mt-16 md:mt-20">
            {t(locale, "page.comingSoon.title")}
          </p>
          <HeroOpeningCountdown
            targetDate={OPENING_COUNTDOWN_END}
            variant="inline"
          />
        </div>
      </PageHeroSection>

      <section
        aria-labelledby="coming-soon-lower-heading"
        className="border-t border-border bg-ink px-4 py-10 text-paper sm:px-6 sm:py-14"
      >
        <h2 id="coming-soon-lower-heading" className="sr-only">
          {t(locale, "page.comingSoon.lowerSectionAria")}
        </h2>
        <div className="mx-auto flex w-full max-w-[var(--container-max)] flex-col items-center gap-8 text-center sm:gap-10">
          <p className="mx-auto max-w-[min(42rem,calc(100%-2rem))] font-sans text-sm leading-relaxed text-paper/90 sm:text-base">
            {t(locale, "page.comingSoon.heroAside")}
          </p>
          <a
            href={contactMailtoHref()}
            className={bookTableHeroHollowButtonClass}
          >
            {t(locale, "page.contact.title")}
          </a>
          <a
            href={googleMapsSearchUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-sans text-sm leading-relaxed text-paper/90 underline decoration-paper/35 underline-offset-[5px] transition-colors hover:text-gold hover:decoration-gold/55 sm:text-base"
          >
            {VENUE_ADDRESS}
            <span className="sr-only"> — {t(locale, "footer.openInMaps")}</span>
          </a>
        </div>
      </section>
    </div>
  );
}
