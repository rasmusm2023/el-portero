"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getApiBaseUrl } from "@/lib/apiBase";
import { lunchDishSlotLabel } from "@/lib/lunchDishSlots";
import type { WeeklyMenu } from "@/lib/weeklyMenuTypes";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

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

  if (busy) {
    return (
      <p className="text-sm text-ink-muted">{t(locale, "page.menu.weeklyLoading")}</p>
    );
  }

  if (!menu?.items?.length) {
    return (
      <div className="rounded-none border border-border bg-paper-dark/40 px-4 py-3 text-sm text-ink-muted">
        {t(locale, "page.menu.weeklyEmpty")}
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {menu.items.map((it) => (
          <article
            key={it.position}
            className="border border-border bg-paper-dark/40 p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold tracking-[0.2em] text-ink-muted uppercase">
                  {lunchDishSlotLabel(it.position)}
                </p>
                <h3 className="mt-1 font-display text-xl font-medium text-ink">{it.name}</h3>
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
      <div className="mt-8 flex justify-center">
        <Link
          href="/menu/weekly"
          className="inline-flex items-center justify-center rounded-none border border-border bg-paper px-6 py-3 text-sm font-semibold tracking-[0.18em] text-ink uppercase transition-colors hover:border-ink/35"
        >
          {t(locale, "page.menu.weeklyViewFull")}
        </Link>
      </div>
    </>
  );
}
