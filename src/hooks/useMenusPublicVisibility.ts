"use client";

import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { MENUS_PUBLIC_LIVE } from "@/config/menusPublic";

export type MenusPublicVisibility = {
  /** True once we know enough to decide what to render (auth + admin allowlist resolved). */
  ready: boolean;
  /**
   * True when the full menu should be shown:
   *   - menus are publicly live, OR
   *   - the current user is an approved admin (preview before launch).
   */
  showFullMenu: boolean;
};

/**
 * Centralises the launch gate for `/menu/*`. While Firebase auth is still resolving we
 * report `ready=false` so the page can render a brief loading state instead of flashing
 * the coming-soon screen for a signed-in admin who reloads directly on a menu route.
 */
export function useMenusPublicVisibility(): MenusPublicVisibility {
  const { firebaseConfigured, adminReady, isAdmin } = useAdminAuth();

  if (!firebaseConfigured) {
    return { ready: true, showFullMenu: MENUS_PUBLIC_LIVE };
  }

  if (!adminReady) {
    return { ready: false, showFullMenu: MENUS_PUBLIC_LIVE };
  }

  return { ready: true, showFullMenu: MENUS_PUBLIC_LIVE || isAdmin };
}
