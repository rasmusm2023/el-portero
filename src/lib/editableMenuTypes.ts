import type { DietaryTagId } from "@/lib/dietaryTags";
import type { AllergenId } from "@/lib/menuAllergens";

export type EditableMenuKind = "dinner" | "drinks";

/**
 * Labeled price variant for items sold in multiple sizes (drinks: small / large,
 * glass / bottle, 33cl / 50cl, etc.). The numeric portion follows the same rules
 * as {@link EditableMenuItem.price} (bare number, no currency symbol).
 */
export type EditableMenuPriceOption = {
  /** Display label shown beside the price, e.g. "Small", "Large", "33cl", "Bottle". */
  label: string;
  /** Numeric price string ("4" or "4.50"). */
  price: string;
};

export type EditableMenuItem = {
  position: number;
  /** When true, item stays in the draft but is omitted on the public menu. */
  hidden: boolean;
  name: string;
  /**
   * Optional suffix shown after the dish name (same visual style as the name, smaller type).
   * Empty string means omit on the public menu.
   */
  nameExtension: string;
  description: string;
  /** Numeric price string — currency symbol is added by the menu page chrome, not per item. */
  price: string;
  /**
   * Optional labeled size variants. When non-empty, the public menu renders these
   * instead of {@link price} (mainly used for drinks).
   */
  priceOptions: EditableMenuPriceOption[];
  /** Selected dietary labels; empty means none. */
  dietaryTagIds: DietaryTagId[];
  /** EU Annex II allergens present in the dish (food menus only; empty for drinks). */
  allergenIds: AllergenId[];
};

export type EditableMenuCategory = {
  position: number;
  /** When true, section title and all its items are omitted on the public menu. */
  hidden: boolean;
  title: string;
  items: EditableMenuItem[];
};

export type EditableMenuDoc = {
  /** Shown as page heading when published (replaces default i18n title). */
  title: string;
  isPublished: boolean;
  updatedAtUtc?: string;
  categories: EditableMenuCategory[];
};

/**
 * Coerce any value (e.g. from Firestore, the admin draft, or CSV parsing) into a
 * clean `EditableMenuPriceOption[]`. Drops entries with empty/blank label or price
 * so partially filled rows in the admin UI don't leak into the published menu.
 */
export function normalizePriceOptions(value: unknown): EditableMenuPriceOption[] {
  if (!Array.isArray(value)) return [];
  const out: EditableMenuPriceOption[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object") continue;
    const row = entry as Record<string, unknown>;
    const label = typeof row.label === "string" ? row.label.trim() : "";
    const price = typeof row.price === "string" ? row.price.trim() : "";
    if (!label || !price) continue;
    out.push({ label, price });
  }
  return out;
}
