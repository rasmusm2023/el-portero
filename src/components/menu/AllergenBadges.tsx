"use client";

import type { AllergenId } from "@/lib/menuAllergens";
import { ALLERGEN_IDS, allergenOption } from "@/lib/menuAllergens";

type Props = {
  /** Stable display order — always sorted by EU Annex II number. */
  ids: AllergenId[];
  className?: string;
};

/**
 * Renders a quiet "Allergens — N N N" row under each dish. Designed to be ignorable
 * unless a guest is actively looking for it: tone-matched to the price column, smaller
 * than the dietary chips, and never bold. Hover/focus shows `Contains <name>` via the
 * native `title` attribute (also exposed to screen readers through `aria-label`).
 */
export function AllergenBadges({ ids, className }: Props) {
  if (!ids.length) return null;

  const ordered = ALLERGEN_IDS.filter((id) => ids.includes(id));

  return (
    <div
      className={["mt-2 flex flex-wrap items-center gap-1.5", className].filter(Boolean).join(" ")}
      aria-label="Allergens present in this dish"
    >
      <span className="text-[10px] font-normal tracking-[0.12em] uppercase text-ink-muted/75">
        Allergens —
      </span>
      <ul className="flex flex-wrap items-center gap-1">
        {ordered.map((id) => {
          const { number, name } = allergenOption(id);
          const tip = `Contains ${name}`;
          return (
            <li key={id}>
              <span
                role="img"
                aria-label={tip}
                title={tip}
                className="inline-flex size-[18px] items-center justify-center rounded-full border border-paper/15 bg-paper/[0.04] text-[10px] font-normal tabular-nums leading-none text-ink-muted"
              >
                {number}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
