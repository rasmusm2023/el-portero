import type { Locale } from "@/i18n/strings";

export type LocalizedString = Record<Locale, string>;

export type MenuItemData = {
  name: LocalizedString;
  description: LocalizedString;
  priceEur: number;
};

export type MenuCategoryData = {
  title: LocalizedString;
  items: MenuItemData[];
};
