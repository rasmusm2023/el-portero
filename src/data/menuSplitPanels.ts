import type { MessageKey } from "@/i18n/strings";

export type MenuSplitKey = "lunch" | "drinks" | "brunch" | "alacarte";

export type MenuSplitPanel = {
  key: MenuSplitKey;
  src: string;
  href: string;
  labelKey: MessageKey;
  srKey: MessageKey;
};

const FOOD_BG =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=2400&q=80";
const DRINKS_BG =
  "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=2400&q=80";
const BRUNCH_BG =
  "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=2400&q=80";
const ALACARTE_BG =
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=2400&q=80";

/** Shared config for horizontal (`MenuSplitSection`) and vertical demo (`MenuSplitSectionVertical`). */
export const MENU_SPLIT_PANELS: MenuSplitPanel[] = [
  {
    key: "lunch",
    src: FOOD_BG,
    href: "/menu/weekly",
    labelKey: "page.menu.weekly",
    srKey: "page.menu.weeklyHeading",
  },
  {
    key: "alacarte",
    src: ALACARTE_BG,
    href: "/menu/alacarte",
    labelKey: "page.menu.alacarte",
    srKey: "page.menu.alacarteHeading",
  },
  {
    key: "brunch",
    src: BRUNCH_BG,
    href: "/menu/brunch",
    labelKey: "page.menu.brunch",
    srKey: "page.menu.brunchHeading",
  },
  {
    key: "drinks",
    src: DRINKS_BG,
    href: "/menu/drinks",
    labelKey: "page.menu.drinks",
    srKey: "page.menu.drinksHeading",
  },
];
