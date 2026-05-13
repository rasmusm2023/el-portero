"use client";

import type { MenuCategoryData } from "@/data/menuTypes";
import type { Locale } from "@/i18n/strings";
import { formatEur } from "@/lib/formatEur";
import { MenuPriceDisclaimer } from "@/components/menu/MenuPriceDisclaimer";

type Props = {
  categories: MenuCategoryData[];
  locale: Locale;
};

export function MenuCategoryGrid({ categories, locale }: Props) {
  return (
    <div className="flex flex-col gap-14">
      <MenuPriceDisclaimer className="-mb-10" />
      {categories.map((cat) => (
        <section key={cat.title.en}>
          <header className="pb-2">
            <h2 className="font-display text-2xl text-paper">{cat.title[locale]}</h2>
          </header>
          <ul className="mt-6 flex flex-col gap-y-8">
            {cat.items.map((item) => (
              <li
                key={item.name.en}
                className="flex justify-between gap-6"
              >
                <div className="min-w-0">
                  <p className="font-medium uppercase text-paper">{item.name[locale]}</p>
                  <p className="mt-1 text-sm italic text-ink-muted leading-relaxed">
                    {item.description[locale]}
                  </p>
                </div>
                <p className="shrink-0 text-ink-muted tabular-nums">
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
