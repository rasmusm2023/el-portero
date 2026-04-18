"use client";

import type { WeeklyMenuItem } from "@/lib/weeklyMenuTypes";

type Props = {
  items: WeeklyMenuItem[];
  /** Default `mt-6` after a section heading; use `mt-0` when the list follows other page chrome. */
  className?: string;
};

/**
 * Dish list aligned with {@link MenuCategoryGrid} — name + italic description, price right.
 */
export function LunchMenuItemsList({ items, className }: Props) {
  return (
    <ul
      className={["mt-6 flex flex-col gap-y-8", className].filter(Boolean).join(" ")}
    >
      {items.map((it) => (
        <li key={it.position} className="flex justify-between gap-6">
          <div className="min-w-0">
            <p className="font-medium text-ink">{it.name}</p>
            {it.description ? (
              <p className="mt-1 text-sm italic text-ink-muted leading-relaxed">{it.description}</p>
            ) : null}
            {it.dietaryTags ? (
              <p className="mt-3 text-xs font-semibold tracking-[0.18em] text-ink-muted uppercase">
                {it.dietaryTags}
              </p>
            ) : null}
          </div>
          {it.price ? (
            <p className="shrink-0 text-ink-muted tabular-nums">{it.price}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
