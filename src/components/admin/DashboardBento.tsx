"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { EventStorageWarning } from "@/components/admin/events/EventStorageWarning";
import { intlLocaleTag, pickLocaleText } from "@/i18n/localeMeta";
import { t, type Locale, type MessageKey } from "@/i18n/strings";
import { useLocale } from "@/i18n/useLocale";
import { isEventPastForAdmin } from "@/lib/eventSchedule";
import { eventStorageLimitState } from "@/lib/eventStorageLimit";
import { getFirebaseFirestore } from "@/lib/firebase/client";
import { subscribeEditableMenu } from "@/lib/firebase/editableMenuStore";
import { subscribeAdminPublicEvents } from "@/lib/firebase/eventsStore";
import { subscribeOpeningHours } from "@/lib/firebase/openingHoursStore";
import type { EditableMenuDoc, EditableMenuKind } from "@/lib/editableMenuTypes";
import { guestMenuTabLabel } from "@/lib/editableMenuPublished";
import type { HomeEvent } from "@/lib/publicEventTypes";
import {
  OPENING_HOURS_DAY_KEYS,
  type OpeningHoursDoc,
  type OpeningHoursDayKey,
} from "@/lib/openingHoursTypes";
import {
  currentOpeningDayKey,
  formatDayHoursLine,
  getVenueStatus,
} from "@/lib/openingHoursVenueStatus";

const DAY_LABEL: Record<OpeningHoursDayKey, MessageKey> = {
  mon: "openingHours.day.mon",
  tue: "openingHours.day.tue",
  wed: "openingHours.day.wed",
  thu: "openingHours.day.thu",
  fri: "openingHours.day.fri",
  sat: "openingHours.day.sat",
  sun: "openingHours.day.sun",
};

const tileClass =
  "group flex h-full cursor-pointer flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50 focus-visible:border-blue-200 focus-visible:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2";

function isLiveOnWebsite(event: HomeEvent): boolean {
  return event.published !== false && event.localOnly !== true && !isEventPastForAdmin(event);
}

function menuIsLive(menu: EditableMenuDoc | null): boolean {
  return Boolean(menu?.isPublished && menu.categories?.length && menu.title?.trim());
}

function shortEventDate(sortDate: string, locale: Locale): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(sortDate.trim());
  if (!match) return sortDate;
  const utc = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12));
  return new Intl.DateTimeFormat(intlLocaleTag(locale), {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "Europe/Madrid",
  }).format(utc);
}

function TileLabel({ children }: { children: string }) {
  return <p className="text-sm font-medium text-slate-500">{children}</p>;
}

function TileLink({ children, className = "mt-auto pt-5" }: { children: string; className?: string }) {
  return <p className={`${className} text-sm font-medium text-blue-700 group-hover:text-blue-800`}>{children}</p>;
}

function StatusDot({ on }: { on: boolean }) {
  return (
    <span
      className={`size-1.5 shrink-0 rounded-full ${on ? "bg-emerald-500 status-breathe" : "bg-slate-400"}`}
      aria-hidden
    />
  );
}

export function DashboardBento() {
  const { locale } = useLocale();
  const { user, ready } = useAdminAuth();
  const [events, setEvents] = useState<HomeEvent[] | null>(null);
  const [hours, setHours] = useState<OpeningHoursDoc | null>(null);
  const [hoursReady, setHoursReady] = useState(false);
  const [menus, setMenus] = useState<Partial<Record<EditableMenuKind, EditableMenuDoc | null>>>({});
  const [menusReady, setMenusReady] = useState(false);
  const [clock, setClock] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setClock((n) => n + 1), 30_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!ready || !user) return;
    const db = getFirebaseFirestore();
    const unsubEvents = subscribeAdminPublicEvents(
      db,
      (next) => setEvents(next),
      (err) => {
        console.error(err);
        setEvents([]);
      },
    );
    const unsubHours = subscribeOpeningHours(
      db,
      (doc) => {
        setHours(doc);
        setHoursReady(true);
      },
      (err) => {
        console.error(err);
        setHoursReady(true);
      },
    );
    let dinner: EditableMenuDoc | null | undefined;
    let drinks: EditableMenuDoc | null | undefined;
    const publishMenus = () => {
      if (dinner === undefined || drinks === undefined) return;
      setMenus({ dinner, drinks });
      setMenusReady(true);
    };
    const unsubDinner = subscribeEditableMenu(
      db,
      "dinner",
      (doc) => {
        dinner = doc;
        publishMenus();
      },
      (err) => {
        console.error(err);
        dinner = null;
        publishMenus();
      },
    );
    const unsubDrinks = subscribeEditableMenu(
      db,
      "drinks",
      (doc) => {
        drinks = doc;
        publishMenus();
      },
      (err) => {
        console.error(err);
        drinks = null;
        publishMenus();
      },
    );
    return () => {
      unsubEvents();
      unsubHours();
      unsubDinner();
      unsubDrinks();
    };
  }, [ready, user]);

  const liveEvents = useMemo(
    () => (events ?? []).filter(isLiveOnWebsite).sort((a, b) => a.sortDate.localeCompare(b.sortDate)),
    [events, clock],
  );
  const inactiveCount = events == null ? null : events.length - liveEvents.length;
  const fullyBooked = liveEvents.filter((event) => event.fullyBooked).length;
  const nextEvent = liveEvents[0];
  const storageLimit = events == null ? null : eventStorageLimitState(events.length);

  const venue = useMemo(() => (hours ? getVenueStatus(locale, hours) : null), [hours, locale, clock]);
  const todayKey = currentOpeningDayKey();

  return (
    <section aria-label={t(locale, "admin.dashboard.now")}>
      <h2 className="mb-3 text-sm font-semibold text-slate-900">{t(locale, "admin.dashboard.now")}</h2>
      <div className="grid items-stretch gap-4 lg:grid-cols-6">
        <Link href="/admin/opening-hours" className={`${tileClass} lg:col-span-3 lg:row-span-2`}>
          <TileLabel>{t(locale, "admin.dashboard.hoursHeading")}</TileLabel>
          {!hoursReady ? (
            <p className="mt-4 text-sm text-slate-500">{t(locale, "admin.loading")}</p>
          ) : hours && venue ? (
            <>
              <p className="mt-4 flex items-center gap-2 text-2xl font-semibold text-slate-900">
                <StatusDot on={venue.isOpen} />
                {venue.label}
              </p>
              <p className="mt-1 text-sm text-slate-600">{venue.detail}</p>
              {hours.isPublished ? null : (
                <p className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                  <StatusDot on={false} />
                  {t(locale, "admin.menus.hiddenOnSite")}
                </p>
              )}
              <ul className="mt-4 space-y-1">
                {OPENING_HOURS_DAY_KEYS.map((dayKey) => {
                  const row = hours.rows.find((entry) => entry.dayKey === dayKey);
                  if (!row) return null;
                  const today = dayKey === todayKey;
                  return (
                    <li
                      key={dayKey}
                      className={`flex items-center justify-between gap-3 rounded-md px-2 py-1 text-sm ${
                        today ? "bg-slate-100 font-medium text-slate-900" : "text-slate-600"
                      }`}
                    >
                      <span>{t(locale, DAY_LABEL[dayKey])}</span>
                      <span className="tabular-nums">{formatDayHoursLine(locale, row)}</span>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <p className="mt-4 text-sm text-slate-600">{t(locale, "admin.menus.hiddenOnSite")}</p>
          )}
          <TileLink>{t(locale, "admin.dashboard.hoursLink")}</TileLink>
        </Link>

        <Link href="/admin/events" className={`${tileClass} lg:col-span-3`}>
          <TileLabel>{t(locale, "admin.dashboard.eventsHeading")}</TileLabel>
          {events == null ? (
            <p className="mt-4 text-sm text-slate-500">{t(locale, "admin.loading")}</p>
          ) : (
            <>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-3xl font-semibold tabular-nums text-slate-900">{liveEvents.length}</p>
                  <p className="mt-1 text-sm text-slate-600">{t(locale, "admin.dashboard.liveEvents")}</p>
                </div>
                <div>
                  <p className="text-3xl font-semibold tabular-nums text-slate-900">{inactiveCount}</p>
                  <p className="mt-1 text-sm text-slate-600">{t(locale, "admin.dashboard.inactiveEvents")}</p>
                </div>
              </div>
              <div className="mt-4 border-t border-slate-200 pt-4">
                <p className="text-xs font-medium text-slate-500">{t(locale, "admin.dashboard.nextEvent")}</p>
                {nextEvent ? (
                  <>
                    <p className="mt-1 text-sm font-medium text-slate-900">
                      {pickLocaleText(nextEvent.title, locale) || nextEvent.id}
                    </p>
                    <p className="text-sm text-slate-600">{shortEventDate(nextEvent.sortDate, locale)}</p>
                  </>
                ) : (
                  <p className="mt-1 text-sm text-slate-600">{t(locale, "admin.dashboard.noUpcoming")}</p>
                )}
                {fullyBooked > 0 ? (
                  <p className="mt-3 text-sm font-medium text-amber-800">
                    {t(locale, "admin.dashboard.fullyBookedCount").replaceAll("{count}", String(fullyBooked))}
                  </p>
                ) : null}
              </div>
            </>
          )}
          <div className={storageLimit?.showWarning ? "mt-auto flex flex-col" : "contents"}>
            {storageLimit?.showWarning && events ? (
              <EventStorageWarning locale={locale} storedCount={events.length} className="mt-4" />
            ) : null}
            <TileLink className={storageLimit?.showWarning ? "pt-4" : "mt-auto pt-5"}>
              {t(locale, "admin.dashboard.eventsLink")}
            </TileLink>
          </div>
        </Link>

        <Link href="/admin/menus" className={`${tileClass} lg:col-span-3`}>
          <TileLabel>{t(locale, "admin.dashboard.menusHeading")}</TileLabel>
          {!menusReady ? (
            <p className="mt-4 text-sm text-slate-500">{t(locale, "admin.loading")}</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {(["dinner", "drinks"] as const).map((kind) => {
                const menu = menus[kind] ?? null;
                const live = menuIsLive(menu);
                const fallback = t(locale, kind === "dinner" ? "admin.menus.tabDinner" : "admin.menus.tabDrinks");
                const title = guestMenuTabLabel(menu, fallback);
                return (
                  <li key={kind} className="flex items-start justify-between gap-3">
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-slate-900">{fallback}</span>
                      {title !== fallback ? (
                        <span className="block truncate text-sm text-slate-500">{title}</span>
                      ) : null}
                    </span>
                    <span className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-slate-600">
                      <StatusDot on={live} />
                      {t(locale, live ? "admin.menus.visibleOnSite" : "admin.menus.hiddenOnSite")}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
          <TileLink>{t(locale, "admin.dashboard.menusLink")}</TileLink>
        </Link>
      </div>
    </section>
  );
}
