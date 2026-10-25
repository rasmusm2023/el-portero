"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode } from "react";
import { CalendarDays, Clock, LogOut, UtensilsCrossed } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { t } from "@/i18n/strings";
import { useLocale } from "@/i18n/useLocale";
import { adminTextMuted } from "@/lib/adminUiStyles";

const deskButton =
  "inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50";

function DashboardCard({
  href,
  icon,
  label,
  heading,
  description,
  link,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  heading: string;
  description: string;
  link: string;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-slate-300"
    >
      <span className="flex size-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
        {icon}
      </span>
      <p className="mt-4 text-xs font-medium text-slate-500">{label}</p>
      <h2 className="mt-1 text-base font-semibold text-slate-900">{heading}</h2>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{description}</p>
      <p className="mt-4 text-sm font-medium text-blue-700 group-hover:text-blue-800">{link}</p>
    </Link>
  );
}

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
        tone="admin"
        title={t(locale, "admin.dashboard.title")}
        intro={<p className={adminTextMuted}>{t(locale, "admin.loading")}</p>}
      >
        <p className={`text-sm ${adminTextMuted}`}>{t(locale, "admin.checkingSignIn")}</p>
      </PageShell>
    );
  }

  return (
    <PageShell
      tone="admin"
      title={t(locale, "admin.dashboard.title")}
      intro={<p className={adminTextMuted}>{t(locale, "admin.dashboard.intro")}</p>}
      maxWidthClassName="w-full max-w-[min(100%,112rem)]"
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          {t(locale, "admin.dashboard.signedInAs")}{" "}
          <span className="font-medium text-slate-900">{user?.email ?? user?.uid ?? "—"}</span>
        </p>
        <button type="button" className={deskButton} onClick={() => void onSignOut()}>
          <LogOut className="size-4" aria-hidden />
          {t(locale, "admin.signOut")}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          href="/admin/events"
          icon={<CalendarDays className="size-4" aria-hidden />}
          label={t(locale, "admin.dashboard.eventsLabel")}
          heading={t(locale, "admin.dashboard.eventsHeading")}
          description={t(locale, "admin.dashboard.eventsDescription")}
          link={t(locale, "admin.dashboard.eventsLink")}
        />
        <DashboardCard
          href="/admin/menus"
          icon={<UtensilsCrossed className="size-4" aria-hidden />}
          label={t(locale, "admin.dashboard.menusLabel")}
          heading={t(locale, "admin.dashboard.menusHeading")}
          description={t(locale, "admin.dashboard.menusDescription")}
          link={t(locale, "admin.dashboard.menusLink")}
        />
        <DashboardCard
          href="/admin/opening-hours"
          icon={<Clock className="size-4" aria-hidden />}
          label={t(locale, "admin.dashboard.hoursLabel")}
          heading={t(locale, "admin.dashboard.hoursHeading")}
          description={t(locale, "admin.dashboard.hoursDescription")}
          link={t(locale, "admin.dashboard.hoursLink")}
        />
      </div>

      <div className="mt-6">
        <Link href="/" className={deskButton}>
          {t(locale, "admin.dashboard.backToSite")}
        </Link>
      </div>
    </PageShell>
  );
}
