"use client";

import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { homeEvents } from "@/data/homeEvents";
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

  const sorted = [...homeEvents].sort((a, b) => a.sortDate.localeCompare(b.sortDate));

  return (
    <PageShell title={t(locale, "page.events.title")} intro={intro}>
      {sorted.length === 0 ? (
        <div className="rounded-none border border-dashed border-border bg-paper-dark/50 px-6 py-12 text-center">
          <p className="text-ink-muted">
            {locale === "es"
              ? "Sin eventos publicados todavía."
              : locale === "sv"
                ? "Inga publicerade evenemang ännu."
                : "No published events yet."}
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-10">
          {sorted.map((ev) => (
            <li key={ev.id}>
              <article className="overflow-hidden rounded-2xl border border-border bg-paper-dark/35 ring-1 ring-border/60 sm:rounded-3xl">
                <div className="flex flex-col md:flex-row">
                  <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-ink/5 md:aspect-auto md:w-[min(100%,30rem)] md:min-h-[280px]">
                    <Image
                      src={ev.imageSrc}
                      alt={ev.imageAlt[locale]}
                      fill
                      className="object-cover"
                      sizes="(max-width: 767px) 100vw, 30rem"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-between px-6 py-8 sm:px-10 sm:py-10">
                    <div>
                      <p className="text-xs font-semibold tracking-[0.22em] text-ink-muted uppercase">
                        {ev.weekdayDate[locale]}
                      </p>
                      <p className="mt-2 text-xs font-semibold tracking-[0.18em] text-ink-muted/90 uppercase">
                        {ev.timeDetail[locale]}
                      </p>
                      <h2 className="mt-3 font-display text-2xl font-medium text-ink sm:text-3xl">
                        {ev.title[locale]}
                      </h2>
                      <p className="mt-4 text-ink-muted leading-relaxed">{ev.excerpt[locale]}</p>
                    </div>
                    <div className="mt-8 flex flex-wrap gap-2.5">
                      <Link
                        href="/reserve"
                        className="inline-flex shrink-0 items-center justify-center rounded-lg border border-ink bg-ink px-4 py-2.5 text-xs font-semibold tracking-[0.2em] text-paper uppercase transition-colors hover:bg-ink/90 sm:text-sm"
                      >
                        {t(locale, "nav.reserve")}
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
