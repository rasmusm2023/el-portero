"use client";

import { PageShell } from "@/components/layout/PageShell";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

export function StoryPage() {
  const { locale } = useLocale();

  return (
    <PageShell title={t(locale, "page.story.title")} intro={t(locale, "page.story.intro")}>
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
  );
}
