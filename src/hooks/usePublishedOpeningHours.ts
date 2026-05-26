"use client";

import { useEffect, useState } from "react";
import type { OpeningHoursDoc } from "@/lib/openingHoursTypes";
import { getFirebaseFirestore, isFirebaseConfigured } from "@/lib/firebase/client";
import { subscribeOpeningHours } from "@/lib/firebase/openingHoursStore";

export type PublishedOpeningHoursState = {
  remote: OpeningHoursDoc | null;
  ready: boolean;
};

export function usePublishedOpeningHours(): PublishedOpeningHoursState {
  const [state, setState] = useState<PublishedOpeningHoursState>(() =>
    isFirebaseConfigured() ? { remote: null, ready: false } : { remote: null, ready: true },
  );

  useEffect(() => {
    if (!isFirebaseConfigured()) return;

    const db = getFirebaseFirestore();
    const unsub = subscribeOpeningHours(db, (doc) => {
      setState({ remote: doc, ready: true });
    });
    return () => unsub();
  }, []);

  return state;
}
