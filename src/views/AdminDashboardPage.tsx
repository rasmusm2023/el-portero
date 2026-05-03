"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { adminBtnBlue, adminBtnNeutral } from "@/lib/adminUiStyles";

export function AdminDashboardPage() {
  const router = useRouter();
  const { user, ready, signOutUser } = useAdminAuth();

  async function onSignOut() {
    await signOutUser();
    router.push("/admin");
  }

  if (!ready) {
    return (
      <PageShell title="Admin" intro="Loading…">
        <p className="text-sm text-ink-muted">Checking sign-in…</p>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Overview"
      intro="Choose what to edit."
      maxWidthClassName="w-full max-w-[min(100%,112rem)]"
    >
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <p className="text-sm text-ink-muted">
          Signed in as{" "}
          <span className="font-medium text-ink">{user?.email ?? user?.uid ?? "—"}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={adminBtnNeutral} onClick={() => void onSignOut()}>
            Sign out
          </button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Link
          href="/admin/events"
          className="group rounded-xl border border-violet-200 border-l-[6px] border-l-violet-600 bg-gradient-to-br from-violet-50/90 to-paper p-8 shadow-sm transition-colors hover:border-violet-400"
        >
          <p className="text-xs font-semibold tracking-[0.18em] text-violet-900 uppercase">Events</p>
          <h2 className="mt-2 font-display text-2xl font-medium text-ink">Public events</h2>
          <p className="mt-3 text-sm text-ink-muted leading-relaxed">
            Create, edit, or remove listings (home page + events page). Uses the API until Firestore is wired.
          </p>
          <p className="mt-6 text-sm font-semibold text-violet-800 group-hover:underline">
            Open events →
          </p>
        </Link>

        <Link
          href="/admin/menus"
          className="group rounded-xl border border-emerald-200 border-l-[6px] border-l-emerald-600 bg-gradient-to-br from-emerald-50/90 to-paper p-8 shadow-sm transition-colors hover:border-emerald-400"
        >
          <p className="text-xs font-semibold tracking-[0.18em] text-emerald-900 uppercase">Menus</p>
          <h2 className="mt-2 font-display text-2xl font-medium text-ink">Lunch & menus</h2>
          <p className="mt-3 text-sm text-ink-muted leading-relaxed">
            Weekly set lunch editor and related menu routes.
          </p>
          <p className="mt-6 text-sm font-semibold text-emerald-800 group-hover:underline">
            Open menus →
          </p>
        </Link>
      </div>

      <div className="mt-6">
        <Link href="/" className={`inline-flex items-center text-sm ${adminBtnBlue}`}>
          ← Back to site
        </Link>
      </div>
    </PageShell>
  );
}
