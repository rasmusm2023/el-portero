"use client";

import { useEffect, useState } from "react";
import { LunchMenuItemsList } from "@/components/menu/LunchMenuItemsList";
import { getApiBaseUrl } from "@/lib/apiBase";
import { getIsoWeekNumberFromYmd } from "@/lib/isoWeek";
import { getMadridWeekStartYmd } from "@/lib/madridWeek";
import type { WeeklyMenu } from "@/lib/weeklyMenuTypes";
import { useLocale } from "@/i18n/useLocale";
import { t, weeklyMenuWeekTitle } from "@/i18n/strings";

/** Home split-panel expansion: live lunch (weekly API), aligned with `/menu/weekly`. */
export function LunchMenuExpandedPreview() {
  const { locale } = useLocale();
  const apiBase = getApiBaseUrl();
  const [menu, setMenu] = useState<WeeklyMenu | null>(null);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(`${apiBase}/api/weekly-menu/current`, {
          cache: "no-store",
        });
        if (!r.ok) {
          if (!cancelled) {
            setMenu(null);
            setBusy(false);
          }
          return;
        }
        const data = (await r.json()) as WeeklyMenu;
        if (!cancelled) {
          setMenu(data);
          setBusy(false);
        }
      } catch {
        if (!cancelled) {
          setMenu(null);
          setBusy(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [apiBase]);

  const weekYmd =
    menu?.effectiveWeekStartDate || menu?.weekStartDate || getMadridWeekStartYmd();
  const isoWeek = getIsoWeekNumberFromYmd(weekYmd);

  return (
    <>
      <div className="min-w-0">
        <h2 className="font-hero-title text-[clamp(1.75rem,4.5vw,3rem)] font-normal leading-[1.05] tracking-[0.14em] text-ink uppercase">
          {weeklyMenuWeekTitle(locale, isoWeek)}
        </h2>
        <p className="mt-4 max-w-4xl font-display text-2xl text-ink leading-relaxed">
          {t(locale, "page.menu.weeklyIntro")}
        </p>
      </div>

      <div className="mt-10">
        {busy ? (
          <p className="text-sm text-ink-muted">{t(locale, "page.menu.weeklyLoading")}</p>
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
