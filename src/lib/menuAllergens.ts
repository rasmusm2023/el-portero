/**
 * The 14 allergens required by EU Regulation 1169/2011, Annex II (mandatory disclosure
 * in Spain). Numbered 1–14 in the canonical Annex II order. Used on dinner menu items;
 * not surfaced on drinks (per launch spec).
 */

export const ALLERGEN_IDS = [
  "gluten",
  "crustaceans",
  "eggs",
  "fish",
  "peanuts",
  "soy",
  "milk",
  "nuts",
  "celery",
  "mustard",
  "sesame",
  "sulphites",
  "lupin",
  "molluscs",
] as const;

export type AllergenId = (typeof ALLERGEN_IDS)[number];

export type AllergenOption = {
  id: AllergenId;
  /** 1-based EU Annex II position, shown inside the circle badge on menu items. */
  number: number;
  /** Short display name (English; shown in legend + tooltip). */
  name: string;
  /** Detail line shown in the legend for clarification. */
  summary: string;
};

/** Order matches {@link ALLERGEN_IDS} so the array index + 1 is always the number. */
export const ALLERGEN_OPTIONS: readonly AllergenOption[] = [
  {
    id: "gluten",
    number: 1,
    name: "Gluten",
    summary: "Cereals containing gluten — wheat, rye, barley, oats, spelt, kamut, and their hybrids.",
  },
  { id: "crustaceans", number: 2, name: "Crustaceans", summary: "Prawns, langoustines, crab, lobster and products thereof." },
  { id: "eggs", number: 3, name: "Eggs", summary: "Eggs and egg-based products (mayonnaise, custards, fresh pasta, glazes)." },
  { id: "fish", number: 4, name: "Fish", summary: "Fish and fish-based products (including anchovy, fish stock, Worcestershire sauce)." },
  { id: "peanuts", number: 5, name: "Peanuts", summary: "Peanuts and peanut-based products (including peanut oils)." },
  { id: "soy", number: 6, name: "Soy", summary: "Soybeans and soybean products (soy sauce, tofu, edamame, soy lecithin)." },
  { id: "milk", number: 7, name: "Milk", summary: "Milk and dairy products, including lactose, butter, cream and cheese." },
  {
    id: "nuts",
    number: 8,
    name: "Tree nuts",
    summary: "Almonds, hazelnuts, walnuts, cashews, pecans, Brazil nuts, pistachios, macadamia.",
  },
  { id: "celery", number: 9, name: "Celery", summary: "Celery and celeriac, including stocks, broths and bouillons." },
  { id: "mustard", number: 10, name: "Mustard", summary: "Mustard and mustard-based products (including dressings and marinades)." },
  { id: "sesame", number: 11, name: "Sesame", summary: "Sesame seeds and sesame products (tahini, gomashio, sesame oil)." },
  {
    id: "sulphites",
    number: 12,
    name: "Sulphites",
    summary: "Sulphur dioxide and sulphites at concentrations above 10 mg/kg or 10 mg/L (wine, dried fruits).",
  },
  { id: "lupin", number: 13, name: "Lupin", summary: "Lupin and lupin-based products (flour, seeds — common in some breads)." },
  { id: "molluscs", number: 14, name: "Molluscs", summary: "Mussels, clams, octopus, squid, oysters, scallops and products thereof." },
] as const;

const OPTION_BY_ID: Record<AllergenId, AllergenOption> = Object.fromEntries(
  ALLERGEN_OPTIONS.map((o) => [o.id, o]),
) as Record<AllergenId, AllergenOption>;

const OPTION_BY_NUMBER: Record<number, AllergenOption> = Object.fromEntries(
  ALLERGEN_OPTIONS.map((o) => [o.number, o]),
);

export function isAllergenId(v: unknown): v is AllergenId {
  return typeof v === "string" && (ALLERGEN_IDS as readonly string[]).includes(v);
}

export function allergenOption(id: AllergenId): AllergenOption {
  return OPTION_BY_ID[id];
}

export function allergenOptionByNumber(n: number): AllergenOption | undefined {
  return OPTION_BY_NUMBER[n];
}

/** Dedupe + keep canonical {@link ALLERGEN_IDS} order so the badge row is always stable. */
export function normalizeAllergenIds(ids: unknown): AllergenId[] {
  if (!Array.isArray(ids)) return [];
  const set = new Set<string>();
  for (const x of ids) {
    if (isAllergenId(x)) set.add(x);
  }
  return ALLERGEN_IDS.filter((id) => set.has(id));
}
