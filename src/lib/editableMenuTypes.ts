import type { DietaryTagId } from "@/lib/dietaryTags";

export type EditableMenuKind = "alacarte" | "drinks" | "brunch";

export type EditableMenuItem = {
  position: number;
  name: string;
  description: string;
  /** Freeform display, e.g. "24" or "€24". */
  price: string;
  /** Selected dietary labels; empty means none. */
  dietaryTagIds: DietaryTagId[];
};

export type EditableMenuCategory = {
  position: number;
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
