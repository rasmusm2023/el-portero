"use client";

import { useEffect, useState } from "react";
import { LunchMenuItemsList } from "@/components/menu/LunchMenuItemsList";
import { getApiBaseUrl } from "@/lib/apiBase";
import { getIsoWeekNumberFromYmd } from "@/lib/isoWeek";
import type { WeeklyMenu } from "@/lib/weeklyMenuTypes";
import { useLocale } from "@/i18n/useLocale";
import { t, weeklyMenuWeekTitle } from "@/i18n/strings";

export function WeeklyMenuSection() {
  const { locale } = useLocale();
  const apiBase = getApiBaseUrl();
  const [menu, setMenu] = useState<WeeklyMenu | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(`${apiBase}/api/weekly-menu/current`, {
          cache: "no-store",
        });
        if (!r.ok) return;
        const data = (await r.json()) as WeeklyMenu;
        if (!cancelled) setMenu(data);
      } catch {
        // ignore: fallback is simply "no section"
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [apiBase]);

  if (!menu) return null;

  return (
    <section
      aria-label={weeklyMenuWeekTitle(
        locale,
        getIsoWeekNumberFromYmd(menu.effectiveWeekStartDate || menu.weekStartDate),
      )}
      className="border-t border-border bg-paper"
    >
      <div className="w-full px-5 py-16 sm:px-10 sm:py-20 lg:px-14 xl:px-20">
        <div className="mx-auto w-full max-w-[var(--container-max)]">
          <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h2 className="font-display text-3xl font-medium tracking-tight text-ink uppercase sm:text-4xl">
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
