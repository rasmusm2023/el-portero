"use client";

import { LunchMenuItemsList } from "@/components/menu/LunchMenuItemsList";
import { useWeeklyMenuCurrent } from "@/lib/weeklyMenuApi";
import { getIsoWeekNumberFromYmd } from "@/lib/isoWeek";
import { useLocale } from "@/i18n/useLocale";
import { t, weeklyMenuWeekTitle } from "@/i18n/strings";

export function WeeklyMenuSection() {
  const { locale } = useLocale();
  const { menu, ready } = useWeeklyMenuCurrent();

  if (!ready) {
    return (
      <section className="border-t border-border bg-ink" aria-busy="true">
        <div className="w-full px-5 py-16 sm:px-10 sm:py-20 lg:px-14 xl:px-20">
          <div className="mx-auto w-full max-w-[var(--container-max)]">
            <p className="text-sm font-medium text-ink-muted">{t(locale, "page.menu.weeklyLoading")}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!menu || !menu.items?.length) return null;

  return (
    <section
      aria-label={weeklyMenuWeekTitle(
        locale,
        getIsoWeekNumberFromYmd(menu.effectiveWeekStartDate || menu.weekStartDate),
      )}
      className="border-t border-border bg-ink"
    >
      <div className="w-full px-5 py-16 sm:px-10 sm:py-20 lg:px-14 xl:px-20">
        <div className="mx-auto w-full max-w-[var(--container-max)]">
          <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h2 className="font-display text-3xl font-medium tracking-tight text-paper uppercase sm:text-4xl">
                {weeklyMenuWeekTitle(
                  locale,
                  getIsoWeekNumberFromYmd(menu.effectiveWeekStartDate || menu.weekStartDate),
                )}
              </h2>
              <p className="mt-2 max-w-2xl text-lg text-ink-muted leading-relaxed">
                {menu.title ?? t(locale, "page.menu.weeklyServiceLine")}
              </p>
            </div>
            <p className="text-xs font-semibold tracking-[0.22em] text-ink-muted uppercase">
              {t(locale, "page.menu.weeklyEffectiveLabel")}{" "}
              {menu.effectiveWeekStartDate || menu.weekStartDate}
            </p>
          </header>

          <div className="mt-10 grid gap-14 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-16">
            <section className="min-w-0">
              <LunchMenuItemsList items={menu.items} className="mt-0" />
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
