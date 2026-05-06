"use client";

import { LunchMenuItemsList } from "@/components/menu/LunchMenuItemsList";
import { useWeeklyMenuCurrent } from "@/lib/weeklyMenuApi";
import { getIsoWeekNumberFromYmd } from "@/lib/isoWeek";
import { getMadridLunchWeekSaturdayYmd } from "@/lib/madridWeek";
import { useLocale } from "@/i18n/useLocale";
import { t, weeklyMenuWeekTitle } from "@/i18n/strings";

/** Home split-panel expansion: same lunch as `/menu/weekly` (Saturday-anchored week in `weeklyMenuStatic`). */
export function LunchMenuExpandedPreview() {
  const { locale } = useLocale();
  const { menu, ready } = useWeeklyMenuCurrent();

  const weekYmd =
    menu?.effectiveWeekStartDate || menu?.weekStartDate || getMadridLunchWeekSaturdayYmd();
  const isoWeek = getIsoWeekNumberFromYmd(weekYmd);

  return (
    <>
      <div className="min-w-0">
        <h2 className="font-hero-title text-[clamp(1.75rem,4.5vw,3rem)] font-normal leading-[1.05] tracking-[0.14em] text-paper uppercase">
          {weeklyMenuWeekTitle(locale, isoWeek)}
        </h2>
        <p className="mt-4 max-w-4xl font-display text-2xl text-paper leading-relaxed">
          {t(locale, "page.menu.weeklyIntro")}
        </p>
      </div>

      <div className="mt-10">
        {!ready ? (
          <div className="rounded-none border border-border bg-paper-dark/40 px-4 py-3 text-sm text-ink-muted">
            {t(locale, "page.menu.weeklyLoading")}
          </div>
        ) : !menu?.items?.length ? (
          <div className="rounded-none border border-border bg-paper-dark/40 px-4 py-3 text-sm text-ink-muted">
            {t(locale, "page.menu.weeklyEmpty")}
          </div>
        ) : (
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-16">
            <section className="min-w-0">
              <LunchMenuItemsList items={menu.items} className="mt-0" />
            </section>
          </div>
        )}
      </div>
    </>
  );
}
