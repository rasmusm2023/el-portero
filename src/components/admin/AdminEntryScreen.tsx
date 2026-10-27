"use client";

import { Check, Loader2 } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { deskPanel } from "@/components/admin/events/EventsDesk";
import { t } from "@/i18n/strings";
import { useLocale } from "@/i18n/useLocale";

export function AdminEntryScreen({
  phase,
  email,
}: {
  phase: "checking" | "signed-in";
  email?: string | null;
}) {
  const { locale } = useLocale();
  const signedIn = phase === "signed-in";

  return (
    <PageShell
      tone="admin"
      title={t(locale, signedIn ? "admin.signedInTitle" : "page.admin.title")}
      intro={t(locale, signedIn ? "admin.signedInOpening" : "admin.checkingSignIn")}
      maxWidthClassName="w-full max-w-lg"
    >
      <div className={deskPanel} role="status" aria-live="polite">
        {signedIn ? (
          <>
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                <Check className="size-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500">
                  {t(locale, "admin.dashboard.signedInAs")}
                </p>
                <p className="truncate text-sm font-medium text-slate-900">
                  {email?.trim() || "—"}
                </p>
              </div>
            </div>
            <div className="mt-5 h-1 overflow-hidden rounded-full bg-slate-100">
              <div className="sign-in-slide h-full w-1/3 rounded-full bg-blue-600" />
            </div>
          </>
        ) : (
          <p className="flex items-center gap-2.5 text-sm text-slate-600">
            <Loader2 className="size-4 shrink-0 animate-spin text-blue-600" aria-hidden />
            {t(locale, "admin.checkingSignIn")}
          </p>
        )}
      </div>
    </PageShell>
  );
}
