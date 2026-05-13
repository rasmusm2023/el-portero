"use client";

import { ChevronDown } from "lucide-react";
import { ALLERGEN_OPTIONS } from "@/lib/menuAllergens";

/**
 * Public reference shown on the dinner menu. Lists all 14 EU Annex II allergens with
 * their canonical numbers — matches the badges rendered on each dish.
 *
 * Rendered as a `<details>` so guests can collapse it once they've checked. The chevron
 * uses `group-open:` on the wrapping `<details>` (Tailwind v4 understands this) so it
 * rotates from down → up as the panel opens; if the variant isn't supported, the
 * fallback rotation via `[details[open]_&]:` ensures it still flips.
 */
export function AllergenLegend() {
  return (
    <details className="group mt-12 border-t border-paper/15 pt-6 text-paper" open>
      <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-paper/80 marker:hidden hover:text-paper">
        <span>Allergen key (1–14)</span>
        <ChevronDown
          aria-hidden
          className="size-4 shrink-0 transition-transform duration-200 group-open:rotate-180 [details[open]_&]:rotate-180"
          strokeWidth={2}
        />
      </summary>
      <p className="mt-3 max-w-prose text-xs leading-relaxed text-ink-muted">
        Numbers shown next to each dish indicate the EU-listed allergens it contains.
        If you have an allergy or intolerance, please tell your server before ordering —
        traces may be present even when not listed.
      </p>
      <ul className="mt-5 grid gap-x-6 gap-y-2.5 text-sm text-paper/85 sm:grid-cols-2 lg:grid-cols-3">
        {ALLERGEN_OPTIONS.map(({ number, name }) => (
          <li key={number} className="flex items-center gap-3">
            <span
              aria-hidden
              className="inline-flex size-[22px] shrink-0 items-center justify-center rounded-full border border-paper/15 bg-paper/[0.04] text-[11px] font-normal tabular-nums leading-none text-ink-muted"
            >
              {number}
            </span>
            <span className="min-w-0 font-medium text-paper">{name}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}
