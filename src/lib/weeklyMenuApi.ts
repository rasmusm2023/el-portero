"use client";

import { useEffect, useState } from "react";
import { STATIC_WEEKLY_MENU } from "@/data/weeklyMenuStatic";
import type { WeeklyMenu } from "@/lib/weeklyMenuTypes";
import { getFirebaseFirestore, isFirebaseConfigured } from "@/lib/firebase/client";
import { subscribeWeeklyMenuCurrent } from "@/lib/firebase/weeklyMenuStore";

export type WeeklyMenuCurrentState = {
  /** Resolved menu (Firestore published, or static fallback). Null only while waiting on Firestore. */
  menu: WeeklyMenu | null;
  /** False until the first Firestore snapshot (or error) when Firebase is configured; always true when Firebase is off. */
  ready: boolean;
};

/**
 * Public lunch menu source:
 * - If Firebase is configured, wait for the first Firestore snapshot before showing data (avoids a static “flash”).
 * - Published `weeklyMenus/current` replaces the fallback; unpublished / missing doc / errors → `weeklyMenuStatic`.
 * - If Firebase is not configured, `ready` is immediately true with the static menu.
 */
export function useWeeklyMenuCurrent(): WeeklyMenuCurrentState {
  const [state, setState] = useState<WeeklyMenuCurrentState>(() =>
    isFirebaseConfigured()
      ? { menu: null, ready: false }
      : { menu: STATIC_WEEKLY_MENU, ready: true },
  );

  useEffect(() => {
    if (!isFirebaseConfigured()) return;

    const db = getFirebaseFirestore();
    const unsub = subscribeWeeklyMenuCurrent(
      db,
      (m) => {
        if (m?.isPublished) {
          setState({ ready: true, menu: m });
          return;
        }
        setState({ ready: true, menu: STATIC_WEEKLY_MENU });
      },
      () => {
        setState({ ready: true, menu: STATIC_WEEKLY_MENU });
      },
    );
    return () => unsub();
  }, []);

  return state;
}
