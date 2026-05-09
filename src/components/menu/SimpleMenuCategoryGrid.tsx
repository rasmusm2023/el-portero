"use client";

import type { DietaryTagId } from "@/lib/dietaryTags";
import { DietaryTagPills } from "@/components/menu/DietaryTagPills";

/**
 * Single-language menu display (admin-authored copy shown for every locale).
 */
export type SimpleMenuCategory = {
  title: string;
  items: {
    name: string;
    description: string;
    price: string;
    dietaryTagIds: DietaryTagId[];
  }[];
};

type Props = {
  categories: SimpleMenuCategory[];
};

export function SimpleMenuCategoryGrid({ categories }: Props) {
  return (
    <div className="grid gap-14 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-16">
      {categories.map((cat, idx) => (
        <section key={`${cat.title}-${idx}`}>
          <header className="border-b border-paper/15 pb-3">
            <h2 className="font-display text-2xl text-paper">{cat.title}</h2>
          </header>
          <ul className="mt-6 flex flex-col gap-y-8">
            {cat.items.map((item, j) => (
              <li key={`${item.name}-${j}`} className="flex justify-between gap-6">
                <div className="min-w-0">
                  <p className="font-medium text-paper">{item.name}</p>
                  {item.description ? (
                    <p className="mt-1 text-sm italic text-ink-muted leading-relaxed">{item.description}</p>
                  ) : null}
                  <DietaryTagPills ids={item.dietaryTagIds} />
                </div>
                {item.price?.trim() ? (
                  <p className="shrink-0 text-ink-muted tabular-nums">{item.price.trim()}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
