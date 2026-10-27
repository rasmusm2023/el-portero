"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, TriangleAlert } from "lucide-react";
import { t, type Locale } from "@/i18n/strings";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { getFirebaseFirestore } from "@/lib/firebase/client";
import { subscribeAdminPublicEvents } from "@/lib/firebase/eventsStore";
import {
  MAX_STORED_EVENTS,
  PREVIEW_EVENT_STORAGE_WARNING,
  eventStorageLimitState,
  fillEventStorageMessage,
} from "@/lib/eventStorageLimit";

export function EventStorageWarning({
  locale,
  className = "",
}: {
  locale: Locale;
  className?: string;
}) {
  const { user, ready } = useAdminAuth();
  const [storedCount, setStoredCount] = useState<number | null>(null);

  useEffect(() => {
    if (!ready || !user) return;
    const db = getFirebaseFirestore();
    return subscribeAdminPublicEvents(
      db,
      (events) => setStoredCount(events.length),
      () => setStoredCount(0),
    );
  }, [ready, user]);

  if (!PREVIEW_EVENT_STORAGE_WARNING && storedCount == null) return null;

  const state = eventStorageLimitState(storedCount ?? 0);
  if (!state.showWarning) return null;

  const count = state.displayCount;
  const meterLabel = fillEventStorageMessage(t(locale, "admin.events.storageMeterAria"), count);

  return (
    <div
      role="status"
      className={`rounded-xl border border-red-300 bg-red-50 px-4 py-4 text-red-950 shadow-sm sm:px-5 ${className}`}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-700">
          <TriangleAlert className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h2 className="text-sm font-semibold text-red-950">
              {t(locale, "admin.events.storageFullTitle")}
            </h2>
            <p className="text-sm font-semibold tabular-nums text-red-800">
              {fillEventStorageMessage(t(locale, "admin.events.storageCount"), count)}
            </p>
          </div>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-red-900">
            {fillEventStorageMessage(t(locale, "admin.events.storageFullBody"), count)}
          </p>
          <div className="mt-3 flex gap-1" role="img" aria-label={meterLabel}>
            {Array.from({ length: MAX_STORED_EVENTS }, (_, index) => (
              <span
                key={index}
                className={`h-1.5 flex-1 rounded-full ${index < count ? "bg-red-600" : "bg-red-200"}`}
              />
            ))}
          </div>
          <Link
            href="/admin/events"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-red-950 underline decoration-red-300 underline-offset-4 transition-colors hover:decoration-red-800"
          >
            {t(locale, "admin.dashboard.eventsLink")}
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}
