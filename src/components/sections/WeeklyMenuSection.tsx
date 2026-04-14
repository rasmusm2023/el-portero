"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getApiBaseUrl } from "@/lib/apiBase";
import { lunchDishSlotLabel } from "@/lib/lunchDishSlots";
import type { WeeklyMenu } from "@/lib/weeklyMenuTypes";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

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
    <section aria-label={t(locale, "page.menu.weeklyHeading")} className="border-t border-border bg-paper">
      <div className="w-full px-5 py-16 sm:px-10 sm:py-20 lg:px-14 xl:px-20">
        <div className="mx-auto w-full max-w-[var(--container-max)]">
          <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h2 className="font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
                {t(locale, "page.menu.weeklyHeading")}
              </h2>
              {menu.title ? (
                <p className="mt-2 max-w-2xl text-ink-muted leading-relaxed">
                  {menu.title}
                </p>
              ) : null}
            </div>
            <p className="text-xs font-semibold tracking-[0.22em] text-ink-muted uppercase">
              {t(locale, "page.menu.weeklyEffectiveLabel")}{" "}
              {menu.effectiveWeekStartDate || menu.weekStartDate}
            </p>
          </header>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                  <p className="mt-3 text-ink-muted leading-relaxed">
                    {it.description}
                  </p>
                ) : null}
                {it.dietaryTags ? (
                  <p className="mt-4 text-xs font-semibold tracking-[0.18em] text-ink-muted uppercase">
                    {it.dietaryTags}
                  </p>
                ) : null}
              </article>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              href="/menu/weekly"
              className="inline-flex items-center justify-center rounded-none border border-border bg-paper px-6 py-3 text-sm font-semibold tracking-[0.18em] text-ink uppercase transition-colors hover:border-ink/35"
            >
              {t(locale, "page.menu.weeklyViewFull")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

