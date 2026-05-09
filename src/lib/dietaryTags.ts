import type { LucideIcon } from "lucide-react";
import { LeafyGreen, MilkOff, Sprout, WheatOff, WineOff } from "lucide-react";

/**
 * Stored on menu items (Firestore + admin). Display order: drinks-friendly tags first,
 * then typical food labels.
 */
export const DIETARY_TAG_IDS = [
  "alcoholFree",
  "vegan",
  "vegetarian",
  "glutenFree",
  "lactoseFree",
] as const;

export type DietaryTagId = (typeof DIETARY_TAG_IDS)[number];

export function isDietaryTagId(v: string): v is DietaryTagId {
  return (DIETARY_TAG_IDS as readonly string[]).includes(v);
}

export type DietaryTagOption = {
  id: DietaryTagId;
  label: string;
  /** Icon shown in pills (public + admin). */
  Icon: LucideIcon;
  /** Tailwind classes for the public menu pill (dark backgrounds). */
  pillClass: string;
};

/**
 * Icons: vegan = sprout, vegetarian = leafy green, gluten-free = wheat-off,
 * lactose-free = milk-off (“no milk”).
 */
/** À la carte + brunch: labels guests expect on food. */
export const FOOD_MENU_DIETARY_TAG_IDS: readonly DietaryTagId[] = [
  "vegan",
  "vegetarian",
  "glutenFree",
  "lactoseFree",
];

/** Drinks: alcohol + common beverage dietary notes (no “vegetarian” — rarely used for drinks). */
export const DRINKS_MENU_DIETARY_TAG_IDS: readonly DietaryTagId[] = [
  "alcoholFree",
  "glutenFree",
  "vegan",
  "lactoseFree",
];

export function dietaryTagOptionsForMenuIds(ids: readonly DietaryTagId[]): DietaryTagOption[] {
  return ids.map((id) => dietaryOption(id));
}

/** Public menu: soft pill chrome; label + icon use a clearer tint so tags stay readable. */
export const DIETARY_TAG_OPTIONS: readonly DietaryTagOption[] = [
  {
    id: "alcoholFree",
    label: "Alcohol-free",
    Icon: WineOff,
    pillClass:
      "border border-violet-400/[0.09] bg-violet-950/[0.11] text-violet-200/90",
  },
  {
    id: "vegan",
    label: "Vegan",
    Icon: Sprout,
    pillClass:
      "border border-emerald-400/[0.09] bg-emerald-950/[0.12] text-emerald-200/90",
  },
  {
    id: "vegetarian",
    label: "Vegetarian",
    Icon: LeafyGreen,
    pillClass:
      "border border-lime-400/[0.08] bg-lime-950/[0.10] text-lime-200/88",
  },
  {
    id: "glutenFree",
    label: "Gluten-free",
    Icon: WheatOff,
    pillClass:
      "border border-amber-400/[0.09] bg-amber-950/[0.11] text-amber-200/90",
  },
  {
    id: "lactoseFree",
    label: "Lactose-free",
    Icon: MilkOff,
    pillClass: "border border-sky-400/[0.09] bg-sky-950/[0.11] text-sky-200/90",
  },
] as const;

const OPTION_BY_ID: Record<DietaryTagId, DietaryTagOption> = Object.fromEntries(
  DIETARY_TAG_OPTIONS.map((o) => [o.id, o]),
) as Record<DietaryTagId, DietaryTagOption>;

export function dietaryOption(id: DietaryTagId): DietaryTagOption {
  return OPTION_BY_ID[id];
}

/** Dedupe, keep canonical {@link DIETARY_TAG_IDS} order for stable UI. */
export function normalizeDietaryTagIds(ids: unknown): DietaryTagId[] {
  if (!Array.isArray(ids)) return [];
  const set = new Set<string>();
  for (const x of ids) {
    if (typeof x === "string" && isDietaryTagId(x)) set.add(x);
  }
  return DIETARY_TAG_IDS.filter((id) => set.has(id));
}

/** Migrate legacy free-text `dietaryTags` strings from older saves. */
export function migrateLegacyDietaryString(raw: string): DietaryTagId[] {
  const t = raw.trim().toLowerCase();
  if (!t) return [];
  const out: DietaryTagId[] = [];
  const add = (id: DietaryTagId) => {
    if (!out.includes(id)) out.push(id);
  };
  if (/\bvegetarian\b|\bveggie\b/.test(t)) add("vegetarian");
  if (/\bvegan\b/.test(t)) add("vegan");
  if (/\bgluten[\s-]?free\b|\bgf\b|\bwheat[\s-]?free\b|\bno\s*gluten\b/.test(t)) add("glutenFree");
  if (/\blactose[\s-]?free\b|\bdairy[\s-]?free\b|\bmilk[\s-]?free\b|\bno\s*(lactose|milk|dairy)\b/.test(t))
    add("lactoseFree");
  if (
    /\balcohol[\s-]?free\b|\bnon[\s-]?alcoholic\b|\bnonalcoholic\b|\bno\s*alcohol\b|\b0\.0\s*%|\bzero\s*alcohol\b/i.test(
      t,
    )
  )
    add("alcoholFree");
  return normalizeDietaryTagIds(out);
}
