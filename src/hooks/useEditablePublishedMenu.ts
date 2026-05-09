"use client";

import { useEffect, useState } from "react";
import type { EditableMenuKind, EditableMenuDoc } from "@/lib/editableMenuTypes";
import { getFirebaseFirestore, isFirebaseConfigured } from "@/lib/firebase/client";
import { subscribeEditableMenu } from "@/lib/firebase/editableMenuStore";

export type EditablePublishedMenuState = {
  /** Live doc from Firestore (may be unpublished). */
  remote: EditableMenuDoc | null;
  /** True after first snapshot when Firebase on; immediately true when Firebase off. */
  ready: boolean;
};

/**
 * Subscribes to `editableMenus/{kind}`. Does not apply fallback — callers merge with static demo data.
 */
export function useEditablePublishedMenu(kind: EditableMenuKind): EditablePublishedMenuState {
  const [state, setState] = useState<EditablePublishedMenuState>(() =>
    isFirebaseConfigured() ? { remote: null, ready: false } : { remote: null, ready: true },
  );

  useEffect(() => {
    if (!isFirebaseConfigured()) return;

    const db = getFirebaseFirestore();
    const unsub = subscribeEditableMenu(db, kind, (doc) => {
      setState({ remote: doc, ready: true });
    });
    return () => unsub();
  }, [kind]);

  return state;
}
