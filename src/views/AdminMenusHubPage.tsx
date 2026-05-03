"use client";

import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { adminBtnGreen, adminBtnNeutral } from "@/lib/adminUiStyles";

/**
 * Second-level hub: edit lunch / weekly menu tools (weekly route redirects to lunch editor today).
 */
export function AdminMenusHubPage() {
  return (
    <PageShell
      title="Menus"
      intro="Choose which menu to edit. Data will sync from Firebase once those editors are wired to Firestore."
      maxWidthClassName="w-full max-w-[min(100%,112rem)]"
    >
      <div className="mb-8 flex flex-wrap gap-3">
        <Link href="/admin/dashboard" className={`inline-flex items-center ${adminBtnNeutral}`}>
          Back to overview
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Link
          href="/admin/lunch-menu"
          className="group rounded-xl border border-emerald-200 border-l-[6px] border-l-emerald-600 bg-gradient-to-br from-emerald-50/90 to-paper p-8 shadow-sm transition-colors hover:border-emerald-400"
        >
          <p className="text-xs font-semibold tracking-[0.18em] text-emerald-900 uppercase">
            Weekly lunch
          </p>
          <h2 className="mt-2 font-display text-2xl font-medium text-ink">Set lunch menu</h2>
          <p className="mt-3 text-sm text-ink-muted leading-relaxed">
            Five dishes, week start, publish — same editor as before.
          </p>
          <p className="mt-6 text-sm font-semibold text-emerald-800 group-hover:underline">
            Open lunch editor →
          </p>
        </Link>

        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-8">
          <p className="text-xs font-semibold tracking-[0.18em] text-slate-600 uppercase">
            Weekly menu route
          </p>
          <h2 className="mt-2 font-display text-xl font-medium text-ink">Legacy URL</h2>
          <p className="mt-3 text-sm text-ink-muted leading-relaxed">
            <code className="font-mono text-xs">/admin/weekly-menu</code> redirects to the lunch editor.
          </p>
          <Link
            href="/admin/lunch-menu"
            className={`mt-6 inline-flex items-center ${adminBtnGreen}`}
          >
            Go to lunch editor
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
