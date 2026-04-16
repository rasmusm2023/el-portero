"use client";

import { useEffect, useState } from "react";
import { MenuPager } from "@/components/menu/MenuPager";
import { PageShell } from "@/components/layout/PageShell";
import { fetchWeeklyMenuCurrent } from "@/lib/weeklyMenuApi";
import { getMadridWeekStartYmd } from "@/lib/madridWeek";
import { lunchDishSlotLabel } from "@/lib/lunchDishSlots";
import type { WeeklyMenu } from "@/lib/weeklyMenuTypes";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

export function WeeklyMenuBrowsePage() {
  const { locale } = useLocale();
  const [menu, setMenu] = useState<WeeklyMenu | null>(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setBusy(true);
      setError(null);
      try {
        const data = await fetchWeeklyMenuCurrent();
        if (!cancelled) setMenu(data);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load lunch menu.");
        }
      } finally {
        if (!cancelled) setBusy(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const madridWeekStart = getMadridWeekStartYmd();

  return (
    <PageShell title={t(locale, "page.menu.weeklyHeading")} intro={t(locale, "page.menu.weeklyIntro")}>
      <MenuPager />

      {busy ? (
        <p className="text-sm text-ink-muted">{t(locale, "page.menu.weeklyLoading")}</p>
      ) : error ? (
        <div className="rounded-none border border-red-500/30 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : !menu ? (
        <div className="rounded-none border border-border bg-paper-dark/40 px-4 py-3 text-sm text-ink-muted">
          {t(locale, "page.menu.weeklyEmpty")}
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              {menu.title ? (
                <p className="text-lg text-ink-muted leading-relaxed">{menu.title}</p>
              ) : null}
            </div>
            <p className="text-xs font-semibold tracking-[0.22em] text-ink-muted uppercase">
              {t(locale, "page.menu.weeklyEffectiveLabel")}:{" "}
              {menu.effectiveWeekStartDate || menu.weekStartDate}{" "}
              <span className="normal-case tracking-normal text-ink-muted/70">
                ({t(locale, "page.menu.weeklyMadridNote")}: {madridWeekStart})
              </span>
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {menu.items.map((it) => (
              <article key={it.position} className="border border-border bg-paper-dark/40 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold tracking-[0.2em] text-ink-muted uppercase">
                      {lunchDishSlotLabel(it.position)}
                    </p>
                    <h2 className="mt-1 font-display text-2xl font-medium text-ink">{it.name}</h2>
                  </div>
                  {it.price ? (
                    <p className="shrink-0 font-sans text-sm font-semibold text-ink tabular-nums">
                      {it.price}
                    </p>
                  ) : null}
                </div>
                {it.description ? (
                  <p className="mt-3 text-ink-muted leading-relaxed">{it.description}</p>
                ) : null}
                {it.dietaryTags ? (
                  <p className="mt-4 text-xs font-semibold tracking-[0.18em] text-ink-muted uppercase">
                    {it.dietaryTags}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
}
