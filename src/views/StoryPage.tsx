"use client";

import { PageHeroSection } from "@/components/PageHeroSection";
import { PageShell } from "@/components/layout/PageShell";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

type StoryPageProps = {
  heroImages: string[];
};

export function StoryPage({ heroImages }: StoryPageProps) {
  const { locale } = useLocale();

  return (
    <>
      <PageHeroSection heroImages={heroImages}>
        <h1 className="font-hero-title text-[clamp(2.25rem,6vw,4.25rem)] font-normal leading-[1.05] tracking-[0.14em] text-paper uppercase">
          {t(locale, "page.story.title")}
        </h1>
        <p className="mx-auto mt-8 max-w-2xl font-sans text-base leading-[1.75] text-paper/85 sm:mt-10 sm:text-lg">
          {t(locale, "page.story.intro")}
        </p>
      </PageHeroSection>

      <PageShell showDocumentHeader={false}>
        <div className="max-w-2xl rounded-none border border-dashed border-border bg-paper-dark/50 px-6 py-12 text-center">
          <p className="text-ink-muted">
            {locale === "es"
              ? "Añade aquí el texto definitivo de la historia del restaurante."
              : locale === "sv"
                ? "Lägg till er slutgiltiga berättelse om restaurangen här."
                : "Replace this placeholder with your full restaurant story when ready."}
          </p>
        </div>
      </PageShell>
    </>
  );
}
