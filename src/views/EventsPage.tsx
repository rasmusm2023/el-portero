"use client";

import { PageShell } from "@/components/layout/PageShell";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

export function EventsPage() {
  const { locale } = useLocale();
  const intro =
    locale === "es"
      ? "Próximos eventos aparecerán aquí. Los pasados se archivan para el equipo."
      : locale === "sv"
        ? "Kommande evenemang visas här. Avslutade arkiveras för teamet."
        : "Upcoming events will appear here. Past events stay in the admin archive only.";

  return (
    <PageShell title={t(locale, "page.events.title")} intro={intro}>
      <div className="rounded-none border border-dashed border-border bg-paper-dark/50 px-6 py-12 text-center">
        <p className="text-ink-muted">
          {locale === "es"
            ? "Sin eventos publicados todavía."
            : locale === "sv"
              ? "Inga publicerade evenemang ännu."
              : "No published events yet."}
        </p>
      </div>
    </PageShell>
  );
}
