import type { Locale } from "@/i18n/strings";

/** Static menu copy. Missing locales fall back via `pickLocaleText` (usually English). */
export type LocalizedString = Partial<Record<Locale, string>> & { en: string };

export type MenuItemData = {
  name: LocalizedString;
  description: LocalizedString;
  priceEur: number;
};

export type MenuCategoryData = {
  title: LocalizedString;
  items: MenuItemData[];
};
