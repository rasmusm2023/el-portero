"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Copy, Languages, LayoutDashboard, LogOut, Plus, Save, Trash2, Upload } from "lucide-react";
import { EventsAdminIntro } from "@/components/admin/EventsAdminIntro";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { EventCard } from "@/components/events/EventCard";
import { LocaleFlag } from "@/components/layout/LocaleFlag";
import { PageShell } from "@/components/layout/PageShell";
import {
  adminBtnBlue,
  adminBtnDanger,
  adminBtnGold,
  adminBtnGreen,
  adminBtnNeutral,
  adminBtnSignOut,
  adminCalloutSuccess,
  adminCheckbox,
  adminErrorBox,
  adminFieldInput,
  adminHint,
  adminLabel,
  adminPanel,
} from "@/lib/adminUiStyles";
import {
  DEFAULT_EVENT_TIME_END,
  DEFAULT_EVENT_TIME_START,
  emptyHomeEvent,
  toUpsertBody,
  type HomeEvent,
} from "@/lib/publicEventTypes";
import { formatSortDateForEventDisplay } from "@/lib/eventDisplayDate";
import {
  applySlotsToTimeDetail,
  clampEndAfterStart,
  EVENT_TIME_OPTIONS,
  isEventPastForAdmin,
  normalizeEventForEditor,
  parseHmToMinutes,
  suggestDuplicateEventId,
  syncDerivedEventFields,
} from "@/lib/eventSchedule";
import { adminContentLocales, pickLocaleText, sameLocaleTrio } from "@/i18n/localeMeta";
import { localeLabels, t, type Locale } from "@/i18n/strings";
import { useLocale } from "@/i18n/useLocale";
import { useAdminConfirm } from "@/hooks/useAdminConfirm";
import { unknownErrorMessage } from "@/lib/unknownErrorMessage";
import { getFirebaseFirestore } from "@/lib/firebase/client";
import { translateEventContent } from "@/lib/firebase/eventAi";
import { deleteEventImageIfManaged, uploadEventImage } from "@/lib/firebase/eventImageStorage";
import { removePublicEvent, subscribeAdminPublicEvents, upsertPublicEvent } from "@/lib/firebase/eventsStore";

function LocaleFieldLabel({ localeKey }: { localeKey: Locale }) {
  return (
    <span className="inline-flex items-center gap-2">
      <LocaleFlag locale={localeKey} />
      <span>{localeLabels[localeKey]}</span>
    </span>
  );
}

function AdminFormSection({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4 border-b border-zinc-200 pb-6 last:border-0 last:pb-0">
      <div>
        <h3 className="text-sm font-semibold tracking-wide text-zinc-900">{title}</h3>
        {hint ? <p className={`mt-1 ${adminHint}`}>{hint}</p> : null}
      </div>
      {children}
    </section>
  );
}

function todayYmd() {
  return new Date().toISOString().slice(0, 10);
}

function cloneHomeEvent(e: HomeEvent): HomeEvent {
  return JSON.parse(JSON.stringify(e)) as HomeEvent;
}

function homeEventsEqual(a: HomeEvent, b: HomeEvent) {
  if (a.id.trim() !== b.id.trim() || a.sortDate !== b.sortDate) return false;
  if ((a.published !== false) !== (b.published !== false)) return false;
  if ((a.fullyBooked ?? false) !== (b.fullyBooked ?? false)) return false;
  if ((a.hasSpecificTime !== false) !== (b.hasSpecificTime !== false)) return false;
  if (a.imageSrc !== b.imageSrc) return false;
  if ((a.imageStoragePath ?? "") !== (b.imageStoragePath ?? "")) return false;
  if ((a.timeSlotStart ?? "") !== (b.timeSlotStart ?? "")) return false;
  if ((a.timeSlotEnd ?? "") !== (b.timeSlotEnd ?? "")) return false;
  if (!sameLocaleTrio(a.timeDetail, b.timeDetail)) return false;
  if (!sameLocaleTrio(a.title, b.title)) return false;
  if (!sameLocaleTrio(a.excerpt, b.excerpt)) return false;
  if (!sameLocaleTrio(a.imageAlt, b.imageAlt)) return false;
  return true;
}

function sourceTextFromEvent(ev: HomeEvent, locale: Locale) {
  return {
    title: pickLocaleText(ev.title, locale),
    excerpt: pickLocaleText(ev.excerpt, locale),
  };
}

export function EventsAdminPage() {
  const router = useRouter();
  const { locale } = useLocale();
  const { confirm, dialog: confirmDialog } = useAdminConfirm(locale);
  const { user, ready, signOutUser } = useAdminAuth();
  const [busy, setBusy] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [rows, setRows] = useState<HomeEvent[]>([]);
  const [draft, setDraft] = useState<HomeEvent>(() =>
    applySlotsToTimeDetail(emptyHomeEvent(todayYmd())),
  );
  const [savedBaseline, setSavedBaseline] = useState<HomeEvent>(() =>
    applySlotsToTimeDetail(emptyHomeEvent(todayYmd())),
  );
  const [isNew, setIsNew] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [sourceTitle, setSourceTitle] = useState("");
  const [sourceExcerpt, setSourceExcerpt] = useState("");
  const [reviewLocale, setReviewLocale] = useState<Locale>("sv");
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [pendingImagePreview, setPendingImagePreview] = useState<string | null>(null);
  const [showImageLink, setShowImageLink] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDirty = useMemo(
    () => Boolean(pendingImageFile) || !homeEventsEqual(draft, savedBaseline),
    [draft, savedBaseline, pendingImageFile],
  );
  const previewEvent = useMemo(() => {
    const ev = syncDerivedEventFields(cloneHomeEvent(draft));
    if (pendingImagePreview) ev.imageSrc = pendingImagePreview;
    return ev;
  }, [draft, pendingImagePreview]);

  const clearPendingImage = useCallback(() => {
    setPendingImageFile(null);
    setPendingImagePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }, []);

  const applySourceFromEvent = useCallback(
    (ev: HomeEvent) => {
      const source = sourceTextFromEvent(ev, locale);
      setSourceTitle(source.title);
      setSourceExcerpt(source.excerpt);
    },
    [locale],
  );

  const load = useCallback(async () => {
    // No-op: Firestore is live-subscribed via onSnapshot below.
  }, []);

  useEffect(() => {
    if (!ready || !user) return;
    setError(null);
    const db = getFirebaseFirestore();
    const unsub = subscribeAdminPublicEvents(
      db,
      (events) => {
        setRows(events);
      },
      (err) => {
        console.error(err);
        setError(unknownErrorMessage(err, t(locale, "admin.events.loadError")));
      },
    );
    return () => unsub();
  }, [ready, user, locale]);

  useEffect(() => {
    return () => {
      if (pendingImagePreview) URL.revokeObjectURL(pendingImagePreview);
    };
  }, [pendingImagePreview]);

  async function onLogout() {
    setError(null);
    setBusy(true);
    try {
      await signOutUser();
      router.push("/admin");
    } finally {
      setBusy(false);
    }
  }

  const startNew = useCallback(() => {
    setIsNew(true);
    setEditingId(null);
    const blank = applySlotsToTimeDetail(emptyHomeEvent(todayYmd()));
    setDraft(cloneHomeEvent(blank));
    setSavedBaseline(cloneHomeEvent(blank));
    setSourceTitle("");
    setSourceExcerpt("");
    clearPendingImage();
    setShowImageLink(false);
    setError(null);
    setMessage(null);
  }, [clearPendingImage]);

  const duplicateFrom = useCallback(
    (ev: HomeEvent) => {
      const normalized = normalizeEventForEditor(cloneHomeEvent(ev));
      let id = suggestDuplicateEventId(ev.id);
      let guard = 0;
      while (rows.some((r) => r.id === id) && guard < 12) {
        id = suggestDuplicateEventId(ev.id);
        guard++;
      }
      const next = applySlotsToTimeDetail({
        ...normalized,
        id,
        published: normalized.published !== false,
        imageStoragePath: undefined,
      });
      setIsNew(true);
      setEditingId(null);
      setDraft(next);
      setSavedBaseline(cloneHomeEvent(emptyHomeEvent(todayYmd())));
      applySourceFromEvent(next);
      clearPendingImage();
      setShowImageLink(Boolean(next.imageSrc));
      setError(null);
      setMessage(t(locale, "admin.events.duplicateLoaded"));
    },
    [rows, locale, applySourceFromEvent, clearPendingImage],
  );

  const startEdit = (ev: HomeEvent) => {
    setIsNew(false);
    setEditingId(ev.id);
    const d = normalizeEventForEditor({
      ...ev,
      fullyBooked: ev.fullyBooked ?? false,
    });
    setDraft(d);
    setSavedBaseline(cloneHomeEvent(d));
    applySourceFromEvent(d);
    clearPendingImage();
    setShowImageLink(Boolean(d.imageSrc) && !d.imageStoragePath);
    setError(null);
    setMessage(null);
  };

  function onPickImage(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError(t(locale, "admin.events.imageUploadError"));
      return;
    }
    clearPendingImage();
    setPendingImageFile(file);
    setPendingImagePreview(URL.createObjectURL(file));
    setShowImageLink(false);
    setError(null);
  }

  function onRemoveImage() {
    clearPendingImage();
    setDraft((d) => ({ ...d, imageSrc: "", imageStoragePath: undefined }));
  }

  async function onTranslate() {
    if (!sourceTitle.trim() && !sourceExcerpt.trim()) {
      setError(t(locale, "admin.events.translateNeedText"));
      return;
    }
    setError(null);
    setMessage(null);
    setTranslating(true);
    try {
      const result = await translateEventContent({
        title: sourceTitle,
        excerpt: sourceExcerpt,
        imageFile: pendingImageFile,
      });
      setDraft((d) => ({
        ...d,
        title: result.title,
        excerpt: result.excerpt,
        imageAlt: result.imageAlt,
      }));
      setMessage(t(locale, "admin.events.translateSuccess"));
    } catch (err) {
      console.error(err);
      setError(unknownErrorMessage(err, t(locale, "admin.events.translateError")));
    } finally {
      setTranslating(false);
    }
  }

  async function onSave() {
    const wasNew = isNew;
    const idTrim = draft.id.trim();
    if (!isValidEventSlug(idTrim)) {
      setError(t(locale, "admin.events.invalidId"));
      return;
    }
    if (!isDirty) {
      return;
    }
    const sm = parseHmToMinutes(draft.timeSlotStart ?? DEFAULT_EVENT_TIME_START);
    const em = parseHmToMinutes(draft.timeSlotEnd ?? DEFAULT_EVENT_TIME_END);
    if (sm != null && em != null && em < sm) {
      setError(t(locale, "admin.events.invalidTime"));
      return;
    }
    setError(null);
    setMessage(null);
    setBusy(true);
    try {
      let nextDraft = syncDerivedEventFields({ ...draft, id: idTrim });
      const previousPath = savedBaseline.imageStoragePath;
      if (pendingImageFile) {
        const uploaded = await uploadEventImage(pendingImageFile);
        nextDraft = {
          ...nextDraft,
          imageSrc: uploaded.url,
          imageStoragePath: uploaded.path,
        };
      }
      if (previousPath && previousPath !== nextDraft.imageStoragePath) {
        await deleteEventImageIfManaged(previousPath);
      }

      const body = toUpsertBody(nextDraft);
      void body;

      const db = getFirebaseFirestore();
      await upsertPublicEvent(db, nextDraft);
      const saved = cloneHomeEvent(nextDraft);
      setDraft(saved);
      setSavedBaseline(cloneHomeEvent(saved));
      applySourceFromEvent(saved);
      clearPendingImage();
      setIsNew(false);
      setEditingId(saved.id);
      setMessage(wasNew ? t(locale, "admin.events.created") : t(locale, "admin.events.updated"));
    } catch (err) {
      console.error(err);
      const fallback = pendingImageFile
        ? t(locale, "admin.events.imageUploadError")
        : t(locale, "admin.events.saveError");
      setError(unknownErrorMessage(err, fallback));
    } finally {
      setBusy(false);
    }
  }

  const deleteEventById = useCallback(
    async (id: string) => {
      const ok = await confirm({
        message: t(locale, "admin.events.deleteConfirm").replace("{id}", id),
        confirmLabel: t(locale, "admin.confirm.delete"),
      });
      if (!ok) {
        return;
      }
      setError(null);
      setMessage(null);
      setBusy(true);
      try {
        const existing = rows.find((r) => r.id === id);
        const db = getFirebaseFirestore();
        await removePublicEvent(db, id);
        await deleteEventImageIfManaged(existing?.imageStoragePath);
        setMessage(t(locale, "admin.events.deleted"));
        if (editingId === id) {
          startNew();
        }
        await load();
      } catch (err) {
        console.error(err);
        setError(unknownErrorMessage(err, t(locale, "admin.events.deleteError")));
      } finally {
        setBusy(false);
      }
    },
    [locale, editingId, startNew, load, confirm, rows],
  );

  async function onDelete() {
    if (isNew || !editingId) return;
    await deleteEventById(editingId);
  }

  if (!ready || !user) {
    return (
      <PageShell
        tone="admin"
        title={t(locale, "admin.events.loadingTitle")}
        intro={t(locale, "admin.events.loadingIntro")}
      >
        <p className="text-sm text-zinc-600">{t(locale, "admin.checkingSignIn")}</p>
      </PageShell>
    );
  }

  const locked = busy || translating;

  return (
    <>
    <PageShell
      tone="admin"
      title={t(locale, "admin.events.title")}
      intro={<EventsAdminIntro locale={locale} />}
      maxWidthClassName="w-full max-w-[min(100%,112rem)]"
    >
      <div className="mb-6 flex flex-wrap items-center gap-2 sm:gap-3">
        <Link href="/admin/dashboard" className={`inline-flex items-center ${adminBtnNeutral}`}>
          <span className="inline-flex items-center gap-2">
            <LayoutDashboard className="size-4" aria-hidden />
            {t(locale, "admin.dashboard")}
          </span>
        </Link>
        <button type="button" className={adminBtnSignOut} onClick={onLogout} disabled={locked}>
          <span className="inline-flex items-center gap-2">
            <LogOut className="size-4" aria-hidden />
            {t(locale, "admin.signOut")}
          </span>
        </button>
      </div>

      {message ? <p className={`mb-4 ${adminCalloutSuccess}`}>{message}</p> : null}
      {error ? <p className={`mb-4 ${adminErrorBox}`}>{error}</p> : null}

      <div className="grid min-w-0 gap-8 xl:grid-cols-12 xl:gap-10 2xl:gap-12">
        <aside className="min-w-0 xl:col-span-4 2xl:col-span-3">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-base font-semibold text-zinc-900 sm:text-lg">
              {t(locale, "admin.events.allEvents")}
            </h2>
            <button type="button" className={adminBtnGreen} onClick={startNew} disabled={locked}>
              <span className="inline-flex items-center gap-2">
                <Plus className="size-4" aria-hidden />
                {t(locale, "admin.events.newEvent")}
              </span>
            </button>
          </div>
          <ul className="max-h-[min(50vh,24rem)] space-y-2 overflow-y-auto rounded-xl border border-zinc-200 bg-white p-2 text-sm shadow-sm xl:max-h-[min(72vh,40rem)] xl:p-3">
            {rows.length === 0 ? (
              <li className="px-2 py-4 text-zinc-500">{t(locale, "admin.events.emptyList")}</li>
            ) : (
              rows
                .slice()
                .sort((a, b) => a.sortDate.localeCompare(b.sortDate))
                .map((ev) => {
                  const past = isEventPastForAdmin(ev);
                  const selected = editingId === ev.id && !isNew;
                  return (
                    <li key={ev.id} className="flex gap-1.5">
                      <button
                        type="button"
                        aria-current={selected ? "true" : undefined}
                        className={[
                          "min-w-0 flex-1 rounded-md border px-3 py-2.5 text-left transition-[background-color,border-color,box-shadow]",
                          selected
                            ? "border-sky-400 bg-sky-50 shadow-sm ring-2 ring-sky-200 border-l-[5px] border-l-sky-500"
                            : past
                              ? "border-red-200 bg-red-50 hover:border-red-300"
                              : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50",
                        ].join(" ")}
                        onClick={() => startEdit(ev)}
                      >
                        <p
                          className={[
                            "text-[10px] font-mono",
                            selected ? "text-sky-700" : "text-zinc-400",
                          ].join(" ")}
                        >
                          {ev.id}
                        </p>
                        <p
                          className={[
                            "mt-0.5 leading-snug",
                            selected ? "font-semibold text-zinc-900" : "font-medium text-zinc-800",
                          ].join(" ")}
                        >
                          {pickLocaleText(ev.title, locale)}
                        </p>
                        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-zinc-500">
                          <span>{ev.sortDate}</span>
                          {ev.published === false ? (
                            <span className="rounded border border-amber-200 bg-amber-50 px-1.5 py-px text-[10px] font-semibold tracking-wide text-amber-800 uppercase">
                              {t(locale, "admin.events.draft")}
                            </span>
                          ) : null}
                          {past ? (
                            <span className="text-[10px] font-semibold text-red-700">
                              {t(locale, "admin.events.pastRemove")}
                            </span>
                          ) : null}
                        </div>
                      </button>
                      <div className="flex shrink-0 flex-col gap-1.5 self-stretch">
                        <button
                          type="button"
                          className="flex min-h-0 flex-1 items-center justify-center rounded-md border border-zinc-200 bg-white px-2 py-2 text-[11px] font-semibold tracking-wide text-zinc-700 uppercase transition-colors hover:bg-zinc-50 disabled:opacity-50"
                          onClick={() => duplicateFrom(ev)}
                          disabled={locked}
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <Copy className="size-3.5 shrink-0" aria-hidden />
                            {t(locale, "admin.events.duplicate")}
                          </span>
                        </button>
                        <button
                          type="button"
                          className="flex min-h-0 flex-1 items-center justify-center rounded-md border border-red-200 bg-red-50 px-2 py-2 text-[11px] font-semibold tracking-wide text-red-800 uppercase transition-colors hover:bg-red-100 disabled:opacity-50"
                          onClick={(e) => {
                            e.preventDefault();
                            void deleteEventById(ev.id);
                          }}
                          disabled={locked}
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <Trash2 className="size-3.5 shrink-0" aria-hidden />
                            {t(locale, "admin.events.delete")}
                          </span>
                        </button>
                      </div>
                    </li>
                  );
                })
            )}
          </ul>
        </aside>

        <div className="min-w-0 space-y-6 xl:col-span-8 2xl:col-span-9">
          <div className={adminPanel}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-3">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl">
                  {t(locale, "admin.events.preview")}
                </h2>
                <p className={`mt-1 ${adminHint}`}>{t(locale, "admin.events.previewHint")}</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold text-zinc-700">
                <LocaleFlag locale={locale} />
                {localeLabels[locale]}
              </span>
            </div>
            <div className="overflow-hidden rounded-xl bg-ink">
              <EventCard
                key={editingId ?? "new-event"}
                event={previewEvent}
                locale={locale}
                variant="home"
                bookingMode="disabled"
                imageFallbackLabel={t(locale, "admin.events.uploadImage")}
                loadImage={Boolean(previewEvent.imageSrc.trim())}
                imageLoading="eager"
              />
            </div>
          </div>

          <div className={`${adminPanel} lg:p-8`}>
            <h2 className="mb-6 border-b border-zinc-200 pb-3 text-lg font-semibold text-zinc-900 sm:text-xl">
              {isNew ? t(locale, "admin.events.formNew") : t(locale, "admin.events.formEdit")}
            </h2>

            <div className="space-y-6">
          <AdminFormSection
            title={t(locale, "admin.events.sectionBasics")}
            hint={t(locale, "admin.events.idHint")}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="w-full max-w-72">
                <label className={adminLabel} htmlFor="ev-id">
                  {t(locale, "admin.events.idLabel")}
                </label>
                <input
                  id="ev-id"
                  className={`${adminFieldInput} mt-1 font-mono text-sm tracking-tight`}
                  value={draft.id}
                  onChange={(e) => setDraft((d) => ({ ...d, id: e.target.value }))}
                  disabled={!isNew}
                  autoComplete="off"
                  placeholder={t(locale, "admin.events.idPlaceholder")}
                />
                {!isNew ? <p className={`mt-1 ${adminHint}`}>{t(locale, "admin.events.idLocked")}</p> : null}
              </div>
              <div className="w-full max-w-52">
                <label className={adminLabel} htmlFor="ev-date">
                  {t(locale, "admin.events.calendarDate")}
                </label>
                <input
                  id="ev-date"
                  type="date"
                  className={`${adminFieldInput} mt-1 font-sans`}
                  value={draft.sortDate}
                  onChange={(e) =>
                    setDraft((d) => syncDerivedEventFields({ ...d, sortDate: e.target.value }))
                  }
                />
                <p className={`mt-2 ${adminHint}`}>
                  {t(locale, "admin.events.guestDateLabel")}{" "}
                  <span className="font-medium text-zinc-700">
                    {formatSortDateForEventDisplay(draft.sortDate, locale) || "—"}
                  </span>
                </p>
              </div>
            </div>
            <details className="text-sm text-zinc-600">
              <summary className="cursor-pointer text-xs font-semibold text-zinc-500">
                {t(locale, "admin.events.datePreviewHint")}
              </summary>
              <ul className="mt-2 space-y-1">
                {adminContentLocales.map((k) => (
                  <li key={k} className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="font-semibold text-zinc-500">
                      <LocaleFieldLabel localeKey={k} />:
                    </span>
                    <span>{formatSortDateForEventDisplay(draft.sortDate, k) || "—"}</span>
                  </li>
                ))}
              </ul>
            </details>
          </AdminFormSection>

          <AdminFormSection
            title={t(locale, "admin.events.sectionTime")}
            hint={t(locale, "admin.events.timeOnlyHint")}
          >
            <label className="inline-flex items-center gap-2.5 text-sm font-medium text-zinc-800">
              <input
                type="checkbox"
                className={adminCheckbox}
                checked={draft.hasSpecificTime !== false}
                onChange={(e) => {
                  const on = e.target.checked;
                  setDraft((d) =>
                    syncDerivedEventFields(
                      applySlotsToTimeDetail({
                        ...d,
                        hasSpecificTime: on,
                        timeSlotStart: on ? d.timeSlotStart : undefined,
                        timeSlotEnd: on ? d.timeSlotEnd : undefined,
                      }),
                    ),
                  );
                }}
              />
              {t(locale, "admin.events.specificTime")}
            </label>
            {draft.hasSpecificTime !== false ? (
              <div className="flex flex-wrap items-end gap-3">
                <div className="w-full max-w-32">
                  <label className={adminLabel} htmlFor="ev-start">
                    {t(locale, "admin.events.startTime")}
                  </label>
                  <select
                    id="ev-start"
                    className={`${adminFieldInput} mt-1`}
                    value={draft.timeSlotStart ?? DEFAULT_EVENT_TIME_START}
                    onChange={(e) => {
                      const nextStart = e.target.value;
                      setDraft((d) =>
                        syncDerivedEventFields(
                          applySlotsToTimeDetail({
                            ...d,
                            timeSlotStart: nextStart,
                            timeSlotEnd: clampEndAfterStart(
                              nextStart,
                              d.timeSlotEnd ?? DEFAULT_EVENT_TIME_END,
                            ),
                          }),
                        ),
                      );
                    }}
                  >
                    {EVENT_TIME_OPTIONS.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-full max-w-32">
                  <label className={adminLabel} htmlFor="ev-end">
                    {t(locale, "admin.events.endTime")}
                  </label>
                  <select
                    id="ev-end"
                    className={`${adminFieldInput} mt-1`}
                    value={draft.timeSlotEnd ?? DEFAULT_EVENT_TIME_END}
                    onChange={(e) =>
                      setDraft((d) =>
                        syncDerivedEventFields(
                          applySlotsToTimeDetail({
                            ...d,
                            timeSlotEnd: e.target.value,
                          }),
                        ),
                      )
                    }
                  >
                    {EVENT_TIME_OPTIONS.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
                <p className={`pb-2 ${adminHint}`}>
                  {t(locale, "admin.events.preview")}:{" "}
                  <span className="font-medium text-zinc-700">
                    {draft.timeDetail.en?.trim() ? draft.timeDetail.en : "—"}
                  </span>
                </p>
              </div>
            ) : null}
          </AdminFormSection>

          <AdminFormSection
            title={t(locale, "admin.events.sectionPhoto")}
            hint={t(locale, "admin.events.imageHint")}
          >
            <div className="flex flex-wrap items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(e) => {
                  onPickImage(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
              <button
                type="button"
                className={adminBtnNeutral}
                onClick={() => fileInputRef.current?.click()}
                disabled={locked}
              >
                <span className="inline-flex items-center gap-2">
                  <Upload className="size-4" aria-hidden />
                  {draft.imageSrc || pendingImageFile
                    ? t(locale, "admin.events.replaceImage")
                    : t(locale, "admin.events.uploadImage")}
                </span>
              </button>
              {draft.imageSrc || pendingImageFile ? (
                <button
                  type="button"
                  className="text-xs font-semibold tracking-wide text-red-700 uppercase hover:text-red-800"
                  onClick={onRemoveImage}
                  disabled={locked}
                >
                  {t(locale, "admin.events.removeImage")}
                </button>
              ) : null}
              <button
                type="button"
                className="text-xs font-semibold tracking-wide text-zinc-500 uppercase hover:text-zinc-800"
                onClick={() => setShowImageLink((v) => !v)}
              >
                {t(locale, "admin.events.orPasteLink")}
              </button>
            </div>
            {showImageLink ? (
              <input
                id="ev-img"
                className={`${adminFieldInput} mt-1 max-w-xl`}
                value={draft.imageSrc}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    imageSrc: e.target.value,
                    imageStoragePath: undefined,
                  }))
                }
                placeholder="https://…"
                inputMode="url"
                autoComplete="off"
              />
            ) : null}
          </AdminFormSection>

          <AdminFormSection
            title={t(locale, "admin.events.sectionCopy")}
            hint={t(locale, "admin.events.sourceHint")}
          >
            <div className="max-w-xl">
              <label className={adminLabel} htmlFor="ev-title">
                {t(locale, "admin.events.titleField")}
              </label>
              <input
                id="ev-title"
                className={`${adminFieldInput} mt-1`}
                value={sourceTitle}
                onChange={(e) => {
                  const value = e.target.value;
                  setSourceTitle(value);
                  setDraft((d) => ({
                    ...d,
                    title: { ...d.title, [locale]: value },
                  }));
                }}
              />
            </div>
            <div className="max-w-2xl">
              <label className={adminLabel} htmlFor="ev-excerpt">
                {t(locale, "admin.events.excerpt")}
              </label>
              <textarea
                id="ev-excerpt"
                className={`${adminFieldInput} mt-1 min-h-28 resize-y`}
                value={sourceExcerpt}
                onChange={(e) => {
                  const value = e.target.value;
                  setSourceExcerpt(value);
                  setDraft((d) => ({
                    ...d,
                    excerpt: { ...d.excerpt, [locale]: value },
                  }));
                }}
              />
            </div>
            <button
              type="button"
              className={adminBtnGold}
              onClick={() => void onTranslate()}
              disabled={locked}
            >
              <span className="inline-flex items-center gap-2">
                <Languages className="size-4" aria-hidden />
                {translating ? t(locale, "admin.events.translating") : t(locale, "admin.events.translateContent")}
              </span>
            </button>
          </AdminFormSection>

          <AdminFormSection title={t(locale, "admin.events.sectionReview")}>
            <div className="flex flex-wrap gap-1.5">
              {adminContentLocales.map((code) => {
                const selected = reviewLocale === code;
                return (
                  <button
                    key={code}
                    type="button"
                    className={[
                      "inline-flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs font-semibold",
                      selected
                        ? "border-sky-400 bg-sky-50 text-sky-900"
                        : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50",
                    ].join(" ")}
                    onClick={() => setReviewLocale(code)}
                  >
                    <LocaleFlag locale={code} />
                    {localeLabels[code]}
                  </button>
                );
              })}
            </div>
            <div className="max-w-xl">
              <label className={adminLabel} htmlFor="ev-title-review">
                {t(locale, "admin.events.titleField")}
              </label>
              <input
                id="ev-title-review"
                className={`${adminFieldInput} mt-1`}
                value={draft.title[reviewLocale] ?? ""}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    title: { ...d.title, [reviewLocale]: e.target.value },
                  }))
                }
              />
            </div>
            <div className="max-w-2xl">
              <label className={adminLabel} htmlFor="ev-excerpt-review">
                {t(locale, "admin.events.excerpt")}
              </label>
              <textarea
                id="ev-excerpt-review"
                className={`${adminFieldInput} mt-1 min-h-24 resize-y`}
                value={draft.excerpt[reviewLocale] ?? ""}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    excerpt: { ...d.excerpt, [reviewLocale]: e.target.value },
                  }))
                }
              />
            </div>
            <div className="max-w-xl">
              <label className={adminLabel} htmlFor="ev-alt-review">
                {t(locale, "admin.events.imageAlt")}
              </label>
              <input
                id="ev-alt-review"
                className={`${adminFieldInput} mt-1`}
                value={draft.imageAlt[reviewLocale] ?? ""}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    imageAlt: { ...d.imageAlt, [reviewLocale]: e.target.value },
                  }))
                }
              />
              <p className={`mt-1 ${adminHint}`}>{t(locale, "admin.events.imageAltHint")}</p>
            </div>
          </AdminFormSection>

          <AdminFormSection title={t(locale, "admin.events.sectionPublish")}>
            <div className="flex flex-col gap-3">
              <label className="inline-flex items-center gap-2.5 text-sm font-medium text-zinc-800">
                <input
                  type="checkbox"
                  className={adminCheckbox}
                  checked={draft.published !== false}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      published: e.target.checked,
                    }))
                  }
                />
                {t(locale, "admin.events.published")}
              </label>
              <label className="inline-flex items-center gap-2.5 text-sm font-medium text-zinc-800">
                <input
                  type="checkbox"
                  className={adminCheckbox}
                  checked={draft.fullyBooked ?? false}
                  onChange={(e) => setDraft((d) => ({ ...d, fullyBooked: e.target.checked }))}
                />
                {t(locale, "admin.events.fullyBooked")}
              </label>
            </div>
          </AdminFormSection>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              className={[
                isNew ? adminBtnGreen : adminBtnBlue,
                isDirty ? "ring-2 ring-sky-300 ring-offset-2 ring-offset-white" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={onSave}
              disabled={locked || !isDirty}
              title={
                isDirty
                  ? isNew
                    ? t(locale, "admin.events.saveNewTooltip")
                    : t(locale, "admin.events.saveEditTooltip")
                  : isNew
                    ? t(locale, "admin.events.saveNewDisabledTooltip")
                    : t(locale, "admin.events.saveEditDisabledTooltip")
              }
            >
              <span className="inline-flex items-center gap-2">
                {isNew ? <Plus className="size-4" aria-hidden /> : <Save className="size-4" aria-hidden />}
                {isNew ? t(locale, "admin.events.create") : t(locale, "admin.events.saveChanges")}
              </span>
            </button>
            {!isNew && editingId ? (
              <button
                type="button"
                className={adminBtnDanger}
                onClick={(e) => {
                  e.preventDefault();
                  void onDelete();
                }}
                disabled={locked}
              >
                <span className="inline-flex items-center gap-2">
                  <Trash2 className="size-4" aria-hidden />
                  {t(locale, "admin.events.delete")}
                </span>
              </button>
            ) : null}
          </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
    {confirmDialog}
    </>
  );
}

function isValidEventSlug(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed || trimmed.length > 64) return false;
  if (trimmed[0] === "-" || trimmed.at(-1) === "-") return false;
  for (const c of trimmed) {
    if (c === "-" || (c >= "0" && c <= "9") || (c >= "a" && c <= "z")) continue;
    return false;
  }
  return true;
}
