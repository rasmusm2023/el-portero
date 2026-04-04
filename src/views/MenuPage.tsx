"use client";

import { PageShell } from "@/components/layout/PageShell";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

export function MenuPage() {
  const { locale } = useLocale();
  const intro =
    locale === "es"
      ? "Estructura de ejemplo — el contenido vendrá del panel de administración."
      : locale === "sv"
        ? "Exempelstruktur — innehållet kommer från admin senare."
        : "Placeholder structure — dishes, prices, and copy will be managed in admin.";

  return (
    <PageShell title={t(locale, "page.menu.title")} intro={intro}>
      <div className="grid gap-12 lg:grid-cols-2">
        <section>
          <h2 className="font-display text-2xl text-ink">Starters</h2>
          <ul className="mt-6 space-y-6 border-t border-border pt-6">
            <li className="flex justify-between gap-6 border-b border-border pb-6">
              <div>
                <p className="font-medium text-ink">Jamón & manchego</p>
                <p className="mt-1 text-sm text-ink-muted">
                  Cured ham, aged cheese, olive oil
                </p>
              </div>
              <p className="shrink-0 text-gold tabular-nums">—</p>
            </li>
            <li className="flex justify-between gap-6">
              <div>
                <p className="font-medium text-ink">Sea bass crudo</p>
                <p className="mt-1 text-sm text-ink-muted">
                  Citrus, herbs, finishing oil
                </p>
              </div>
              <p className="shrink-0 text-gold tabular-nums">—</p>
            </li>
          </ul>
        </section>
        <section>
          <h2 className="font-display text-2xl text-ink">Mains</h2>
          <ul className="mt-6 space-y-6 border-t border-border pt-6">
            <li className="flex justify-between gap-6 border-b border-border pb-6">
              <div>
                <p className="font-medium text-ink">Catch of the day</p>
                <p className="mt-1 text-sm text-ink-muted">
                  Market fish, seasonal vegetables
                </p>
              </div>
              <p className="shrink-0 text-gold tabular-nums">—</p>
            </li>
            <li className="flex justify-between gap-6">
              <div>
                <p className="font-medium text-ink">Ribeye</p>
                <p className="mt-1 text-sm text-ink-muted">
                  Embered potato, red wine jus
                </p>
              </div>
              <p className="shrink-0 text-gold tabular-nums">—</p>
            </li>
          </ul>
        </section>
      </div>
    </PageShell>
  );
}
