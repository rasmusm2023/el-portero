/**
 * Master gate for the public `/menus` routes. When `true`, every visitor sees the
 * full dinner / drinks menus. When `false`, guests see the coming-soon page and
 * only signed-in admins get a preview (via `useMenusPublicVisibility`).
 *
 * Flip back to `false` if we ever need to pull menus offline pre-relaunch.
 */
export const MENUS_PUBLIC_LIVE = true;
