"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode } from "react";
import { LogOut } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { t } from "@/i18n/strings";
import { useLocale } from "@/i18n/useLocale";
import { adminTextMuted } from "@/lib/adminUiStyles";

const deskButton =
  "inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50";

function CardMotif({
  tilt,
  children,
}: {
  tilt: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`pointer-events-none absolute -right-14 -bottom-16 size-[22rem] origin-bottom-right text-slate-400 opacity-[0.22] ${tilt}`}
      aria-hidden
    >
      {children}
    </div>
  );
}

function CalendarMotif() {
  const days = [
    [0, 0, 1, 0, 0, 0, 1],
    [0, 1, 0, 0, 1, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
    [1, 0, 0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0, 0, 0],
  ];

  return (
    <svg viewBox="0 0 200 220" className="size-full">
      <rect x="22" y="36" width="156" height="168" rx="22" fill="currentColor" opacity="0.14" />
      <rect x="22" y="36" width="156" height="48" rx="22" fill="currentColor" opacity="0.4" />
      <rect x="22" y="60" width="156" height="24" fill="currentColor" opacity="0.4" />
      <rect x="56" y="14" width="12" height="40" rx="6" fill="currentColor" opacity="0.72" />
      <rect x="132" y="14" width="12" height="40" rx="6" fill="currentColor" opacity="0.72" />
      {days.flatMap((row, rowIndex) =>
        row.map((marked, column) => (
          <rect
            key={`${rowIndex}-${column}`}
            x={32 + column * 22}
            y={98 + rowIndex * 20}
            width="14"
            height="14"
            rx="4"
            fill="currentColor"
            opacity={marked ? 0.78 : 0.2}
          />
        )),
      )}
    </svg>
  );
}

function MenuMotif() {
  const rows = [
    { name: 86, detail: 58 },
    { name: 74, detail: 48 },
    { name: 92, detail: 40 },
    { name: 68, detail: 54 },
  ];

  return (
    <svg viewBox="0 0 200 240" className="size-full">
      <rect x="42" y="34" width="132" height="176" rx="18" fill="currentColor" opacity="0.14" />
      <rect x="26" y="20" width="132" height="176" rx="18" fill="currentColor" opacity="0.24" />
      <rect x="46" y="40" width="58" height="9" rx="4.5" fill="currentColor" opacity="0.7" />
      <rect x="46" y="60" width="92" height="2" rx="1" fill="currentColor" opacity="0.32" />
      {rows.map((row, index) => {
        const y = 78 + index * 26;
        return (
          <g key={y}>
            <rect x="46" y={y} width={row.name} height="6" rx="3" fill="currentColor" opacity="0.55" />
            <rect x="46" y={y + 12} width={row.detail} height="4" rx="2" fill="currentColor" opacity="0.28" />
            <rect x="128" y={y} width="16" height="6" rx="3" fill="currentColor" opacity="0.4" />
          </g>
        );
      })}
    </svg>
  );
}

function ClockMotif() {
  const ticks = Array.from({ length: 12 }, (_, index) => index * 30);

  return (
    <svg viewBox="0 0 200 200" className="size-full">
      <circle cx="100" cy="100" r="92" fill="currentColor" opacity="0.1" />
      <circle cx="100" cy="100" r="74" fill="none" stroke="currentColor" strokeWidth="10" opacity="0.22" />
      {ticks.map((degrees) => {
        const hour = degrees % 90 === 0;
        return (
          <rect
            key={degrees}
            x="97"
            y={hour ? 22 : 28}
            width="6"
            height={hour ? 18 : 10}
            rx="3"
            fill="currentColor"
            opacity={hour ? 0.7 : 0.4}
            transform={`rotate(${degrees} 100 100)`}
          />
        );
      })}
      <rect
        x="96"
        y="46"
        width="8"
        height="56"
        rx="4"
        fill="currentColor"
        opacity="0.82"
        transform="rotate(28 100 100)"
      />
      <rect
        x="96"
        y="58"
        width="8"
        height="46"
        rx="4"
        fill="currentColor"
        opacity="0.62"
        transform="rotate(132 100 100)"
      />
      <circle cx="100" cy="100" r="8" fill="currentColor" opacity="0.9" />
      <circle cx="100" cy="100" r="3.5" fill="white" opacity="0.85" />
    </svg>
  );
}

function DashboardCard({
  href,
  motif,
  tilt,
  heading,
  description,
  link,
}: {
  href: string;
  motif: ReactNode;
  tilt: string;
  heading: string;
  description: string;
  link: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-slate-300"
    >
      <CardMotif tilt={tilt}>{motif}</CardMotif>
      <div className="relative flex min-h-40 flex-1 flex-col">
        <h2 className="text-lg font-semibold text-slate-900">{heading}</h2>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{description}</p>
        <p className="mt-4 text-sm font-medium text-blue-700 group-hover:text-blue-800">{link}</p>
      </div>
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
          motif={<CalendarMotif />}
          tilt="-rotate-12"
          heading={t(locale, "admin.dashboard.eventsHeading")}
          description={t(locale, "admin.dashboard.eventsDescription")}
          link={t(locale, "admin.dashboard.eventsLink")}
        />
        <DashboardCard
          href="/admin/menus"
          motif={<MenuMotif />}
          tilt="rotate-[9deg]"
          heading={t(locale, "admin.dashboard.menusHeading")}
          description={t(locale, "admin.dashboard.menusDescription")}
          link={t(locale, "admin.dashboard.menusLink")}
        />
        <DashboardCard
          href="/admin/opening-hours"
          motif={<ClockMotif />}
          tilt="-rotate-6"
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
