"use client";

import { contactMailtoHref } from "@/config/site";
import { LogoWordmark } from "@/components/LogoWordmark";
import { PageHeroSection } from "@/components/PageHeroSection";
import { bookTableHeroHollowButtonClass } from "@/components/layout/SiteHeader";
import { VENUE_ADDRESS, googleMapsSearchUrl } from "@/constants/venue";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

type ComingSoonPageProps = {
  heroImages: string[];
};

export function ComingSoonPage({ heroImages }: ComingSoonPageProps) {
  const { locale } = useLocale();

  return (
    <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
      <PageHeroSection
        heroImages={heroImages}
        accentVideo={false}
        bottomCta={
          <a href={contactMailtoHref()} className={bookTableHeroHollowButtonClass}>
            {t(locale, "page.contact.title")}
          </a>
        }
        bottomAside={
          <p className="max-w-[min(52rem,calc(100%-3rem))] shrink text-right font-sans text-xs font-medium leading-relaxed tracking-normal text-paper/85 normal-case sm:max-w-[min(52rem,calc(100%-4rem))] sm:text-sm lg:pe-2 xl:pe-3">
            {t(locale, "page.comingSoon.heroAside")}
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
          <p className="mt-2 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-paper/70 sm:mt-3">
            {t(locale, "page.comingSoon.title")}
          </p>
        </div>
      </PageHeroSection>

      <section
        aria-labelledby="coming-soon-venue-heading"
        className="border-t border-border bg-ink px-4 py-10 text-paper sm:px-6 sm:py-14"
      >
        <h2 id="coming-soon-venue-heading" className="sr-only">
          {t(locale, "page.hours.map")}
        </h2>
        <div className="mx-auto w-full max-w-[var(--container-max)] text-center">
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
