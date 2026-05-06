"use client";

import { LunchMenuItemsList } from "@/components/menu/LunchMenuItemsList";
import { MenuPager } from "@/components/menu/MenuPager";
import { PageShell } from "@/components/layout/PageShell";
import { useWeeklyMenuCurrent } from "@/lib/weeklyMenuApi";
import { getIsoWeekNumberFromYmd } from "@/lib/isoWeek";
import { getMadridLunchWeekSaturdayYmd } from "@/lib/madridWeek";
import { useLocale } from "@/i18n/useLocale";
import { t, weeklyMenuWeekTitle } from "@/i18n/strings";

export function WeeklyMenuBrowsePage() {
  const { locale } = useLocale();
  const { menu, ready } = useWeeklyMenuCurrent();
  const madridLunchSaturday = getMadridLunchWeekSaturdayYmd();

  return (
    <PageShell
      title={t(locale, "page.menu.title")}
      intro={t(locale, "page.menu.weeklyIntro")}
      introVariant="display"
      titleVariant="hero"
    >
      <MenuPager />

      {!ready ? (
        <div className="rounded-none border border-border bg-paper-dark/40 px-4 py-3 text-sm text-ink-muted">
          {t(locale, "page.menu.weeklyLoading")}
        </div>
      ) : !menu || !menu.items?.length ? (
        <div className="rounded-none border border-border bg-paper-dark/40 px-4 py-3 text-sm text-ink-muted">
          {t(locale, "page.menu.weeklyEmpty")}
        </div>
      ) : (
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-16">
          <section className="min-w-0">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="font-display text-2xl font-medium tracking-tight text-paper uppercase">
                {weeklyMenuWeekTitle(
                  locale,
                  getIsoWeekNumberFromYmd(menu.effectiveWeekStartDate || menu.weekStartDate),
                )}
              </h2>
              <p className="shrink-0 text-xs font-semibold tracking-[0.22em] text-ink-muted uppercase">
                {t(locale, "page.menu.weeklyEffectiveLabel")}:{" "}
                {menu.effectiveWeekStartDate || menu.weekStartDate}{" "}
                <span className="normal-case tracking-normal text-ink-muted/70">
                  ({t(locale, "page.menu.weeklyMadridNote")}: {madridLunchSaturday})
                </span>
              </p>
            </div>
            <p className="mt-2 text-lg text-ink-muted leading-relaxed">
              {menu.title ?? t(locale, "page.menu.weeklyServiceLine")}
            </p>
            <LunchMenuItemsList items={menu.items} />
          </section>
        </div>
      )}
    </PageShell>
  );
}
