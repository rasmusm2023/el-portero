/** Public guest-facing menu URLs (App Router segment is `menus`). */
export const MENUS_HUB_PATH = "/menus" as const;
export const MENUS_DINNER_PATH = "/menus/dinner" as const;
export const MENUS_DRINKS_PATH = "/menus/drinks" as const;

export type PublicMenusPath =
  | typeof MENUS_HUB_PATH
  | typeof MENUS_DINNER_PATH
  | typeof MENUS_DRINKS_PATH;
