import { TriangleAlert } from "lucide-react";
import { t, type Locale } from "@/i18n/strings";
import { MAX_STORED_EVENTS, eventStorageLimitState } from "@/lib/eventStorageLimit";

export function EventStorageWarning({
  locale,
  storedCount,
  className = "",
}: {
  locale: Locale;
  storedCount: number;
  className?: string;
}) {
  const state = eventStorageLimitState(storedCount);
  if (!state.showWarning) return null;

  const body = t(locale, "admin.events.storageFullBody");
  const [beforeMax, afterMax = ""] = body.split("{max}");

  return (
    <div
      role="status"
      className={`rounded-lg border border-red-300 bg-red-50 px-3 py-3 text-red-950 ${className}`}
    >
      <div className="flex items-center gap-3">
        <TriangleAlert className="size-12 shrink-0 text-red-600" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-red-950">{t(locale, "admin.events.storageFullTitle")}</p>
          <p className="mt-1 text-sm leading-relaxed text-red-900">
            {beforeMax}
            <strong className="font-bold tabular-nums">{MAX_STORED_EVENTS}</strong>
            {afterMax}
          </p>
        </div>
      </div>
    </div>
  );
}
