import type { EditableMenuDoc } from "@/lib/editableMenuTypes";
import {
  MENUS_DRINKS_PATH,
  MENUS_DINNER_PATH,
  MENUS_HUB_PATH,
  type PublicMenusPath,
} from "@/lib/menusRoutes";
import { isFirebaseConfigured } from "@/lib/firebase/client";

/** True when a Firestore menu doc is published and has at least one category. */
export function isEditableMenuPublished(
  remote: EditableMenuDoc | null | undefined,
): boolean {
  return Boolean(remote?.isPublished && remote.categories?.length);
}

/**
 * Whether a menu tab/link should appear for guests. Firebase off → show (static seed data).
 * Firebase on → show until the first snapshot, then only if the doc is published with categories.
 */
export function showGuestMenuTab(ready: boolean, remote: EditableMenuDoc | null): boolean {
  if (!isFirebaseConfigured()) return true;
  if (!ready) return true;
  return isEditableMenuPublished(remote);
}

/** @deprecated alias — use {@link showGuestMenuTab} */
export const showDrinksMenuPublic = showGuestMenuTab;

/**
 * Best destination when the current menu route is unpublished (uses resolved snapshot state, not optimistic tabs).
 */
export function primaryPublishedMenusPath(
  dinnerReady: boolean,
  dinnerRemote: EditableMenuDoc | null,
  drinksReady: boolean,
  drinksRemote: EditableMenuDoc | null,
): PublicMenusPath {
  if (!isFirebaseConfigured()) return MENUS_DINNER_PATH;

  const dinnerLive = dinnerReady && isEditableMenuPublished(dinnerRemote);
  const drinksLive = drinksReady && isEditableMenuPublished(drinksRemote);
  if (dinnerLive) return MENUS_DINNER_PATH;
  if (drinksLive) return MENUS_DRINKS_PATH;
  return MENUS_HUB_PATH;
}
