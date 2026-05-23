"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { t } from "@/i18n/strings";
import { useLocale } from "@/i18n/useLocale";
import {
  adminBtnBlue,
  adminBtnSignOut,
  adminDivider,
  adminTextMuted,
  adminTextOnLight,
} from "@/lib/adminUiStyles";

export function AdminDashboardPage() {
  const router = useRouter();
  const { locale } = useLocale();
  const { user, ready, signOutUser } = useAdminAuth();

  async function onSignOut() {
    await signOutUser();
    router.push("/admin");
  }

  if (!ready) {
    return (
      <PageShell
        title={t(locale, "admin.dashboard.title")}
        intro={<p className={adminTextMuted}>{t(locale, "admin.loading")}</p>}
      >
        <p className={`text-sm ${adminTextMuted}`}>{t(locale, "admin.checkingSignIn")}</p>
      </PageShell>
    );
  }

  return (
    <PageShell
      title={t(locale, "admin.dashboard.title")}
      intro={<p className={adminTextMuted}>{t(locale, "admin.dashboard.intro")}</p>}
      maxWidthClassName="w-full max-w-[min(100%,112rem)]"
    >
      <div className={`mb-8 flex flex-wrap items-center justify-between gap-4 border-b ${adminDivider} pb-6`}>
        <p className={`text-sm ${adminTextMuted}`}>
          {t(locale, "admin.dashboard.signedInAs")}{" "}
          <span className="font-medium text-paper">{user?.email ?? user?.uid ?? "—"}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={adminBtnSignOut} onClick={() => void onSignOut()}>
            <span className="inline-flex items-center gap-2">
              <LogOut className="size-4" aria-hidden />
              {t(locale, "admin.signOut")}
            </span>
          </button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Link
          href="/admin/events"
          className="group rounded-xl border border-violet-300/80 border-l-[6px] border-l-violet-600 bg-gradient-to-br from-violet-50 to-white p-8 shadow-sm transition-colors hover:border-violet-400"
        >
          <p className="text-xs font-semibold tracking-[0.18em] text-violet-900 uppercase">
            {t(locale, "admin.dashboard.eventsLabel")}
          </p>
          <h2 className="mt-2 font-display text-2xl font-medium text-ink">
            {t(locale, "admin.dashboard.eventsHeading")}
          </h2>
          <p className={`mt-3 text-sm leading-relaxed ${adminTextOnLight}`}>
            {t(locale, "admin.dashboard.eventsDescription")}
          </p>
          <p className="mt-6 text-sm font-semibold text-violet-900 group-hover:underline">
            {t(locale, "admin.dashboard.eventsLink")}
          </p>
        </Link>

        <Link
          href="/admin/menus"
          className="group rounded-xl border border-emerald-300/80 border-l-[6px] border-l-emerald-600 bg-gradient-to-br from-emerald-50 to-white p-8 shadow-sm transition-colors hover:border-emerald-400"
        >
          <p className="text-xs font-semibold tracking-[0.18em] text-emerald-900 uppercase">
            {t(locale, "admin.dashboard.menusLabel")}
          </p>
          <h2 className="mt-2 font-display text-2xl font-medium text-ink">
            {t(locale, "admin.dashboard.menusHeading")}
          </h2>
          <p className={`mt-3 text-sm leading-relaxed ${adminTextOnLight}`}>
            {t(locale, "admin.dashboard.menusDescription")}
          </p>
          <p className="mt-6 text-sm font-semibold text-emerald-900 group-hover:underline">
            {t(locale, "admin.dashboard.menusLink")}
          </p>
        </Link>
      </div>

      <div className="mt-6">
        <Link href="/" className={`inline-flex items-center text-sm ${adminBtnBlue}`}>
          {t(locale, "admin.dashboard.backToSite")}
        </Link>
      </div>
    </PageShell>
  );
}
