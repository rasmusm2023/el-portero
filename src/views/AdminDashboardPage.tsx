"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { getApiBaseUrl } from "@/lib/apiBase";
import { adminBtnBlue } from "@/lib/adminUiStyles";

type AuthState = "unknown" | "in" | "out";

export function AdminDashboardPage() {
  const apiBase = getApiBaseUrl();
  const [auth, setAuth] = useState<AuthState>("unknown");

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${apiBase}/api/admin/lunch-menu/status`, { credentials: "include" });
        setAuth(r.ok ? "in" : "out");
      } catch {
        setAuth("out");
      }
    })();
  }, [apiBase]);

  if (auth === "unknown") {
    return (
      <PageShell title="Admin" intro="Loading…">
        <p className="text-sm text-ink-muted">Checking sign-in…</p>
      </PageShell>
    );
  }

  if (auth === "out") {
    return (
      <PageShell
        title="Admin"
        intro="You’re not signed in yet. Go to the sign-in page, then come back here."
      >
        <Link href="/admin" className={`inline-flex items-center justify-center px-8 ${adminBtnBlue}`}>
          Sign in
        </Link>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Dashboard"
      intro="Choose what to edit."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/lunch-menu"
          className="group rounded-none border border-emerald-200 border-l-[6px] border-l-emerald-600 bg-gradient-to-br from-emerald-50/90 to-paper p-6 shadow-sm transition-colors hover:border-emerald-400"
        >
          <p className="text-xs font-semibold tracking-[0.22em] text-emerald-900 uppercase">Menu</p>
          <h2 className="mt-2 font-display text-2xl font-medium text-ink">Lunch menu</h2>
          <p className="mt-1 text-xs font-medium tracking-wide text-ink-muted">This week’s dishes</p>
          <p className="mt-3 text-sm text-ink-muted leading-relaxed">
            Update the 5 dishes and publish.
          </p>
          <p className="mt-5 text-sm font-semibold text-emerald-800 group-hover:underline">Open lunch editor →</p>
        </Link>

        <Link
          href="/admin/media"
          className="group rounded-none border border-sky-200 border-l-[6px] border-l-sky-600 bg-gradient-to-br from-sky-50/80 to-paper p-6 shadow-sm transition-colors hover:border-sky-400"
        >
          <p className="text-xs font-semibold tracking-[0.22em] text-sky-900 uppercase">Media</p>
          <h2 className="mt-2 font-display text-2xl font-medium text-ink">Photos</h2>
          <p className="mt-3 text-sm text-ink-muted leading-relaxed">
            Upload an image to cloud storage (for events and pages later).
          </p>
          <p className="mt-5 text-sm font-semibold text-sky-800 group-hover:underline">Open media →</p>
        </Link>

        <div className="rounded-none border border-dashed border-slate-300 border-l-[6px] border-l-slate-400 bg-slate-50/60 p-6">
          <p className="text-xs font-semibold tracking-[0.22em] text-slate-600 uppercase">Soon</p>
          <h2 className="mt-2 font-display text-2xl font-medium text-ink">More tools</h2>
          <p className="mt-3 text-sm text-ink-muted leading-relaxed">
            We’ll add more admin tasks here as the site grows.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
