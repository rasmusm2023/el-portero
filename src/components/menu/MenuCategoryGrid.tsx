"use client";

import type { MenuCategoryData } from "@/data/menuTypes";
import type { Locale } from "@/i18n/strings";
import { formatEur } from "@/lib/formatEur";

type Props = {
  categories: MenuCategoryData[];
  locale: Locale;
};

export function MenuCategoryGrid({ categories, locale }: Props) {
  return (
    <div className="grid gap-14 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-16">
      {categories.map((cat) => (
        <section key={cat.title.en}>
          <h2 className="font-display text-2xl text-ink">{cat.title[locale]}</h2>
          <ul className="mt-6 border-t border-border">
            {cat.items.map((item) => (
              <li
                key={item.name.en}
                className="flex justify-between gap-6 border-b border-border py-6 last:border-b-0"
              >
                <div className="min-w-0">
                  <p className="font-medium text-ink">{item.name[locale]}</p>
                  <p className="mt-1 text-sm text-ink-muted leading-relaxed">
                    {item.description[locale]}
                  </p>
                </div>
                <p className="shrink-0 text-ink tabular-nums">
                  {formatEur(locale, item.priceEur)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
