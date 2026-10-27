"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { LayoutDashboard, Loader2, LogOut, Plus, Save, Sparkles, Trash2 } from "lucide-react";
import { EditableEventCard } from "@/components/admin/EditableEventCard";
import { EventPreviewLocaleMenu } from "@/components/admin/EventPreviewLocaleMenu";
import {
  DeskNotice,
  DeskToggle,
  EmptyEventSlot,
  EventCreateFullNotice,
  EventEditorBar,
  EventIndexRow,
  EventListFullNotice,
  StepHeading,
  WebsiteStatusCard,
  deskDanger,
  deskField,
  deskGhost,
  deskHint,
  deskLabel,
  deskPanel,
  deskPrimary,
  deskTimeSelect,
} from "@/components/admin/events/EventsDesk";
import { LocaleFlag } from "@/components/layout/LocaleFlag";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { PageShell } from "@/components/layout/PageShell";
import {
  DEFAULT_EVENT_TIME_END,
  DEFAULT_EVENT_TIME_START,
  emptyHomeEvent,
  toUpsertBody,
  type HomeEvent,
} from "@/lib/publicEventTypes";
import {
  applySlotsToTimeDetail,
  clampEndAfterStart,
  EVENT_TIME_OPTIONS,
  eventEndsNextMorning,
  isEventPastForAdmin,
  normalizeEventForEditor,
  parseHmToMinutes,
  suggestDuplicateEventId,
  syncDerivedEventFields,
} from "@/lib/eventSchedule";
import {
  applyTranslatedLocaleTrio,
  pickTranslateSourceLocale,
  sameLocaleTrio,
} from "@/i18n/localeMeta";
import { localeLabels, locales, t, type Locale } from "@/i18n/strings";
import { useLocale } from "@/i18n/useLocale";
import { useAdminConfirm } from "@/hooks/useAdminConfirm";
import { isLocalDevHost } from "@/lib/localDevHost";
import { unknownErrorMessage } from "@/lib/unknownErrorMessage";
import { getFirebaseFirestore } from "@/lib/firebase/client";
import { translateEventContent } from "@/lib/firebase/eventAi";
import { deleteEventImageIfManaged, uploadEventImage } from "@/lib/firebase/eventImageStorage";
import { removePublicEvent, subscribeAdminPublicEvents, upsertPublicEvent } from "@/lib/firebase/eventsStore";
import { MAX_STORED_EVENTS, eventStorageLimitState, fillEventStorageMessage } from "@/lib/eventStorageLimit";

function todayYmd() {
  return new Date().toISOString().slice(0, 10);
}

function cloneHomeEvent(e: HomeEvent): HomeEvent {
  return JSON.parse(JSON.stringify(e)) as HomeEvent;
}

function homeEventsEqual(a: HomeEvent, b: HomeEvent) {
  if (a.id.trim() !== b.id.trim() || a.sortDate !== b.sortDate) return false;
  if ((a.published !== false) !== (b.published !== false)) return false;
  if ((a.localOnly === true) !== (b.localOnly === true)) return false;
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

const translateWaitNotes = [
  "admin.events.translateWait1",
  "admin.events.translateWait2",
  "admin.events.translateWait3",
] as const;

function formatTranslateElapsed(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function translateResultMessage(
  locale: Locale,
  sourceLocale: Locale,
  titleLanguage: Locale | null,
  excerptLanguage: Locale | null,
): string {
  const source = localeLabels[sourceLocale];
  if (titleLanguage && excerptLanguage && titleLanguage !== excerptLanguage) {
    return t(locale, "admin.events.translateLanguageCorrectedSplit")
      .replaceAll("{titleLanguage}", localeLabels[titleLanguage])
      .replaceAll("{excerptLanguage}", localeLabels[excerptLanguage])
      .replaceAll("{source}", source);
  }
  const detected = titleLanguage ?? excerptLanguage;
  if (detected) {
    return t(locale, "admin.events.translateLanguageCorrected")
      .replaceAll("{detected}", localeLabels[detected])
      .replaceAll("{source}", source);
  }
  return t(locale, "admin.events.translateSuccess").replaceAll("{language}", source);
}

export function EventsAdminPage() {
  const router = useRouter();
  const { locale } = useLocale();
  const { confirm, dialog: confirmDialog } = useAdminConfirm(locale);
  const { user, ready, signOutUser } = useAdminAuth();
  const onLocalhost = useSyncExternalStore(
    () => () => {},
    () => isLocalDevHost(window.location.hostname),
    () => false,
  );
  const [busy, setBusy] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [translateSeconds, setTranslateSeconds] = useState(0);
  const [translateBeat, setTranslateBeat] = useState(0);
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
  const editingLiveEvent =
    !isNew && savedBaseline.published !== false && savedBaseline.localOnly !== true;
  const localPublish = onLocalhost && !editingLiveEvent;
  const publishOn = localPublish
    ? draft.localOnly === true || (isNew && draft.published !== false && draft.localOnly !== false)
    : draft.published !== false;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewLocale, setPreviewLocale] = useState<Locale>("en");
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [pendingImagePreview, setPendingImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedRowRef = useRef<HTMLLIElement>(null);

  const isDirty = useMemo(
    () => Boolean(pendingImageFile) || !homeEventsEqual(draft, savedBaseline),
    [draft, savedBaseline, pendingImageFile],
  );
  const sortedEvents = useMemo(
    () => rows.slice().sort((a, b) => a.sortDate.localeCompare(b.sortDate)),
    [rows],
  );
  const eventSlots = useMemo(
    () => Array.from({ length: MAX_STORED_EVENTS }, (_, index) => sortedEvents[index] ?? null),
    [sortedEvents],
  );
  const overflowEvents = sortedEvents.slice(MAX_STORED_EVENTS);
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

  useEffect(() => {
    if (!editingId || isNew) return;
    selectedRowRef.current?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [editingId, isNew]);

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
    if (eventStorageLimitState(rows.length).showWarning) return;
    setIsNew(true);
    setEditingId(null);
    const blank = applySlotsToTimeDetail(emptyHomeEvent(todayYmd()));
    setDraft(cloneHomeEvent(blank));
    setSavedBaseline(cloneHomeEvent(blank));
    setPreviewLocale("en");
    clearPendingImage();
    setError(null);
    setMessage(null);
  }, [clearPendingImage, rows.length]);

  const duplicateFrom = useCallback(
    (ev: HomeEvent, options?: { keepPendingImage?: boolean }) => {
      if (eventStorageLimitState(rows.length).blockNewEvents) {
        setError(
          fillEventStorageMessage(t(locale, "admin.events.storageFullSaveError"), rows.length),
        );
        setMessage(null);
        return;
      }
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
      setPreviewLocale("en");
      if (!options?.keepPendingImage) clearPendingImage();
      setError(null);
      setMessage(t(locale, "admin.events.duplicateLoaded"));
    },
    [rows, locale, clearPendingImage],
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
    setPreviewLocale("en");
    clearPendingImage();
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
    setError(null);
  }

  function onRemoveImage() {
    clearPendingImage();
    setDraft((d) => ({ ...d, imageSrc: "", imageStoragePath: undefined }));
  }

  useEffect(() => {
    if (!translating) return;
    const started = Date.now();
    const timer = window.setInterval(() => {
      const elapsed = Date.now() - started;
      setTranslateSeconds(Math.floor(elapsed / 1000));
      setTranslateBeat(Math.floor(elapsed / 650));
    }, 200);
    return () => window.clearInterval(timer);
  }, [translating]);

  async function onTranslate() {
    const sourceLocale = pickTranslateSourceLocale(draft.title, draft.excerpt, previewLocale);
    if (!sourceLocale) {
      setError(t(locale, "admin.events.translateNeedText"));
      return;
    }
    setError(null);
    setMessage(null);
    setTranslateSeconds(0);
    setTranslateBeat(0);
    setTranslating(true);
    try {
      const sourceTitle = draft.title[sourceLocale] ?? "";
      const sourceExcerpt = draft.excerpt[sourceLocale] ?? "";
      const sourceAlt = draft.imageAlt[sourceLocale] ?? "";
      const result = await translateEventContent({
        title: sourceTitle,
        excerpt: sourceExcerpt,
        imageAlt: sourceAlt,
        sourceLocale,
        imageFile: pendingImageFile,
      });
      const titleApplied = applyTranslatedLocaleTrio(
        draft.title,
        result.title,
        sourceLocale,
        result.detectedTitleLanguage,
        sourceTitle,
      );
      const excerptApplied = applyTranslatedLocaleTrio(
        draft.excerpt,
        result.excerpt,
        sourceLocale,
        result.detectedExcerptLanguage,
        sourceExcerpt,
      );
      const altApplied = applyTranslatedLocaleTrio(
        draft.imageAlt,
        result.imageAlt,
        sourceLocale,
        sourceAlt.trim() ? result.detectedImageAltLanguage : null,
        sourceAlt,
      );
      setDraft((d) => ({
        ...d,
        title: titleApplied.trio,
        excerpt: excerptApplied.trio,
        imageAlt: altApplied.trio,
      }));
      setMessage(
        translateResultMessage(locale, sourceLocale, titleApplied.correctedTo, excerptApplied.correctedTo),
      );
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
    if (wasNew && eventStorageLimitState(rows.length).blockNewEvents) {
      setError(fillEventStorageMessage(t(locale, "admin.events.storageFullSaveError"), rows.length));
      return;
    }
    const startHm = draft.timeSlotStart ?? DEFAULT_EVENT_TIME_START;
    const endHm = draft.timeSlotEnd ?? DEFAULT_EVENT_TIME_END;
    const sm = parseHmToMinutes(startHm);
    const em = parseHmToMinutes(endHm);
    if (
      draft.hasSpecificTime !== false &&
      sm != null &&
      em != null &&
      em < sm &&
      !eventEndsNextMorning(startHm, endHm)
    ) {
      setError(t(locale, "admin.events.invalidTime"));
      return;
    }
    setError(null);
    setMessage(null);
    setBusy(true);
    try {
      let nextDraft = syncDerivedEventFields({ ...draft, id: idTrim });
      const onLocalhost = isLocalDevHost(window.location.hostname);
      const alreadyLive =
        !wasNew && savedBaseline.published !== false && savedBaseline.localOnly !== true;
      if (onLocalhost && !alreadyLive) {
        const showLocally = nextDraft.localOnly === true || (wasNew && nextDraft.published !== false && nextDraft.localOnly !== false);
        nextDraft = { ...nextDraft, published: false, localOnly: showLocally };
      } else if (!onLocalhost) {
        nextDraft = { ...nextDraft, localOnly: false };
      }
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
  const storageLimit = eventStorageLimitState(rows.length);
  const storageFullMessage = fillEventStorageMessage(
    t(locale, "admin.events.storageFullSaveError"),
    storageLimit.displayCount,
  );

  return (
    <>
    <PageShell
      tone="admin"
      title={t(locale, "admin.events.title")}
      intro={t(locale, "admin.events.introLead")}
      maxWidthClassName="w-full max-w-[min(100%,112rem)]"
    >
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Link href="/admin/dashboard" className={deskGhost}>
          <LayoutDashboard className="size-3.5" aria-hidden />
          {t(locale, "admin.dashboard")}
        </Link>
        <button type="button" className={deskGhost} onClick={onLogout} disabled={locked}>
          <LogOut className="size-3.5" aria-hidden />
          {t(locale, "admin.signOut")}
        </button>
      </div>

      {message || error ? (
        <div className="mb-6 space-y-3">
          {message ? <DeskNotice tone="success">{message}</DeskNotice> : null}
          {error ? <DeskNotice tone="error">{error}</DeskNotice> : null}
        </div>
      ) : null}

      <div className="grid min-w-0 items-start gap-6 xl:grid-cols-12 xl:gap-8">
        <aside className="min-w-0 xl:sticky xl:top-6 xl:col-span-4 xl:self-start 2xl:col-span-3">
          <div className={`${deskPanel} p-4 sm:p-5`}>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-1.5">
              <div className="flex items-baseline gap-2.5">
                <h2 className="text-sm font-semibold text-slate-900">
                  {t(locale, "admin.events.allEvents")}
                </h2>
                <span
                  className={`rounded-md px-1.5 py-0.5 text-xs font-medium tabular-nums ${
                    rows.length >= MAX_STORED_EVENTS
                      ? "bg-red-100 text-red-800"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {fillEventStorageMessage(t(locale, "admin.events.storageCount"), rows.length)}
                </span>
              </div>
              <button
                type="button"
                className={deskPrimary}
                onClick={startNew}
                disabled={locked || storageLimit.showWarning}
                title={storageLimit.showWarning ? storageFullMessage : undefined}
                aria-pressed={isNew}
              >
                <Plus className="size-3.5" aria-hidden />
                {t(locale, "admin.events.newEvent")}
              </button>
            </div>
            {storageLimit.showWarning ? (
              <EventListFullNotice>{t(locale, "admin.events.storageListWarning")}</EventListFullNotice>
            ) : null}
            <ul className="max-h-[min(70vh,40rem)] space-y-1.5 overflow-y-auto [scrollbar-color:rgba(15,23,42,0.28)_transparent] [scrollbar-width:thin] xl:max-h-[min(78vh,48rem)]">
              {eventSlots.map((ev, index) => {
                if (!ev) {
                  return (
                    <EmptyEventSlot
                      key={`empty-slot-${index}`}
                      label={t(locale, "admin.events.storageEmptySlot")}
                    />
                  );
                }
                const past = isEventPastForAdmin(ev);
                const selected = editingId === ev.id && !isNew;
                return (
                  <EventIndexRow
                    key={ev.id}
                    event={ev}
                    locale={locale}
                    selected={selected}
                    past={past}
                    locked={locked}
                    duplicateBlocked={storageLimit.blockNewEvents}
                    rowRef={selected ? selectedRowRef : undefined}
                    onEdit={() => startEdit(ev)}
                    onDuplicate={() => duplicateFrom(ev)}
                    onDelete={() => void deleteEventById(ev.id)}
                  />
                );
              })}
              {overflowEvents.map((ev) => {
                const past = isEventPastForAdmin(ev);
                const selected = editingId === ev.id && !isNew;
                return (
                  <EventIndexRow
                    key={ev.id}
                    event={ev}
                    locale={locale}
                    selected={selected}
                    past={past}
                    locked={locked}
                    duplicateBlocked={storageLimit.blockNewEvents}
                    rowRef={selected ? selectedRowRef : undefined}
                    onEdit={() => startEdit(ev)}
                    onDuplicate={() => duplicateFrom(ev)}
                    onDelete={() => void deleteEventById(ev.id)}
                  />
                );
              })}
            </ul>
          </div>
        </aside>

        <div className="min-w-0 space-y-6 xl:col-span-8 2xl:col-span-9">
          <div className={deskPanel}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <StepHeading
                locale={locale}
                step={1}
                title={t(locale, "admin.events.step1Title")}
                hint={t(locale, "admin.events.previewHint")}
              />
              <EventPreviewLocaleMenu
                uiLocale={locale}
                previewLocale={previewLocale}
                title={draft.title}
                excerpt={draft.excerpt}
                onChange={setPreviewLocale}
                disabled={locked}
              />
            </div>
            <div className="mt-5">
              <EventEditorBar
                locale={locale}
                localPublish={localPublish}
                publishOn={publishOn}
                disabled={locked}
                isNew={isNew}
                isDirty={isDirty}
                past={!isNew && isEventPastForAdmin(draft)}
                fullyBooked={draft.fullyBooked === true}
                canCopy={Boolean(draft.id.trim())}
                copyBlocked={storageLimit.blockNewEvents}
                onPublishChange={(checked) =>
                  setDraft((d) =>
                    onLocalhost && !editingLiveEvent
                      ? { ...d, published: false, localOnly: checked }
                      : { ...d, published: checked },
                  )
                }
                onCopy={() => duplicateFrom(draft, { keepPendingImage: Boolean(pendingImageFile) })}
                onDelete={() => void onDelete()}
              />
            </div>
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
            <div className="mt-5 rounded-xl bg-ink p-3 sm:p-4">
              <EditableEventCard
                key={editingId ?? "new-event"}
                event={previewEvent}
                previewLocale={previewLocale}
                uiLocale={locale}
                disabled={locked}
                onRequestImagePick={() => fileInputRef.current?.click()}
                onChangeDate={(ymd) =>
                  setDraft((d) => syncDerivedEventFields({ ...d, sortDate: ymd }))
                }
                onChangeTitle={(value) =>
                  setDraft((d) => ({
                    ...d,
                    title: { ...d.title, [previewLocale]: value },
                  }))
                }
                onChangeExcerpt={(value) =>
                  setDraft((d) => ({
                    ...d,
                    excerpt: { ...d.excerpt, [previewLocale]: value },
                  }))
                }
                onChangeTime={(start, end) =>
                  setDraft((d) =>
                    syncDerivedEventFields(
                      applySlotsToTimeDetail({
                        ...d,
                        hasSpecificTime: true,
                        timeSlotStart: start,
                        timeSlotEnd: clampEndAfterStart(start, end),
                      }),
                    ),
                  )
                }
                onEnableTime={() =>
                  setDraft((d) =>
                    syncDerivedEventFields(
                      applySlotsToTimeDetail({
                        ...d,
                        hasSpecificTime: true,
                      }),
                    ),
                  )
                }
                onChangeFullyBooked={(fullyBooked) =>
                  setDraft((d) => ({ ...d, fullyBooked }))
                }
              />
            </div>
            <div className="mt-6 border-t border-slate-200 pt-6">
              <StepHeading
                locale={locale}
                step={2}
                title={t(locale, "admin.events.translateContent")}
                hint={t(locale, "admin.events.sourceHint")}
              />
              <div className="mt-4 ml-9">
                <button
                  type="button"
                  className={`${deskGhost} group`}
                  onClick={() => void onTranslate()}
                  disabled={locked}
                >
                  {translating ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                  ) : (
                    <Sparkles className="size-4 text-blue-600 motion-safe:group-hover:animate-[spin_0.7s_ease-in-out]" aria-hidden />
                  )}
                  {translating
                    ? t(locale, "admin.events.translating")
                    : t(locale, "admin.events.translateContent")}
                </button>
              </div>
              {translating ? (
                <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-slate-900">{t(locale, "admin.events.translating")}</p>
                    <p
                      className="font-mono text-sm tabular-nums text-slate-500"
                      aria-label={t(locale, "admin.events.translateElapsed").replaceAll(
                        "{time}",
                        formatTranslateElapsed(translateSeconds),
                      )}
                    >
                      {formatTranslateElapsed(translateSeconds)}
                    </p>
                  </div>
                  <div className="mt-3 flex gap-1" aria-hidden>
                    {locales.map((code, index) => (
                      <span
                        key={code}
                        className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                          index === translateBeat % locales.length ? "bg-blue-600" : "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <ul className="mt-3 flex flex-wrap gap-2" aria-hidden>
                    {locales.map((code, index) => {
                      const active = index === translateBeat % locales.length;
                      return (
                        <li
                          key={code}
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all duration-300 ${
                            active
                              ? "border-blue-200 bg-white text-slate-900 shadow-sm"
                              : "border-transparent bg-white/70 text-slate-500"
                          }`}
                        >
                          <LocaleFlag locale={code} />
                          {localeLabels[code]}
                        </li>
                      );
                    })}
                  </ul>
                  <p className="mt-3 text-slate-600" role="status" aria-live="polite">
                    {t(locale, translateWaitNotes[Math.floor(translateSeconds / 4) % translateWaitNotes.length]!)}
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          <div className={deskPanel}>
            <div className="space-y-10">
          <div className="space-y-6">
            <StepHeading
              locale={locale}
              step={3}
              title={t(locale, "admin.events.step3Title")}
            />
            <div className="grid items-start gap-6 lg:grid-cols-2">
              <div>
                <label className={deskLabel} htmlFor="ev-id">
                  {t(locale, "admin.events.idLabel")}
                </label>
                <input
                  id="ev-id"
                  className={`${deskField} font-mono text-[13px] tracking-tight`}
                  value={draft.id}
                  onChange={(e) => setDraft((d) => ({ ...d, id: e.target.value }))}
                  disabled={!isNew}
                  autoComplete="off"
                  placeholder={t(locale, "admin.events.idPlaceholder")}
                />
                <p className={`mt-2 ${deskHint}`}>
                  {isNew ? t(locale, "admin.events.idHint") : t(locale, "admin.events.idLocked")}
                </p>
              </div>
              <WebsiteStatusCard
                locale={locale}
                localPublish={onLocalhost && !editingLiveEvent}
                checked={publishOn}
                disabled={locked}
                onChange={(checked) =>
                  setDraft((d) =>
                    onLocalhost && !editingLiveEvent
                      ? { ...d, published: false, localOnly: checked }
                      : { ...d, published: checked },
                  )
                }
              />
            </div>
          </div>

          <div className="space-y-8 border-t border-slate-200 pt-8">
            <StepHeading
              locale={locale}
              step={4}
              title={t(locale, "admin.events.step4Title")}
              hint={t(locale, "admin.events.step4Hint")}
            />
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">
              {t(locale, "admin.events.sectionTime")}
            </h3>
            <div className={`flex flex-wrap items-end gap-3 ${draft.hasSpecificTime === false ? "opacity-45" : ""}`}>
              <div>
                <label className={deskLabel} htmlFor="ev-start">
                  {t(locale, "admin.events.startTime")}
                </label>
                <select
                  id="ev-start"
                  className={deskTimeSelect}
                  value={draft.timeSlotStart ?? DEFAULT_EVENT_TIME_START}
                  disabled={locked || draft.hasSpecificTime === false}
                  onChange={(e) => {
                    const start = e.target.value;
                    const end = clampEndAfterStart(start, draft.timeSlotEnd ?? DEFAULT_EVENT_TIME_END);
                    setDraft((d) =>
                      syncDerivedEventFields(
                        applySlotsToTimeDetail({
                          ...d,
                          hasSpecificTime: true,
                          timeSlotStart: start,
                          timeSlotEnd: end,
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
              <span className="mb-2 hidden text-slate-300 sm:block" aria-hidden>
                —
              </span>
              <div>
                <label className={deskLabel} htmlFor="ev-end">
                  {t(locale, "admin.events.endTime")}
                </label>
                <select
                  id="ev-end"
                  className={deskTimeSelect}
                  value={draft.timeSlotEnd ?? DEFAULT_EVENT_TIME_END}
                  disabled={locked || draft.hasSpecificTime === false}
                  onChange={(e) => {
                    const start = draft.timeSlotStart ?? DEFAULT_EVENT_TIME_START;
                    setDraft((d) =>
                      syncDerivedEventFields(
                        applySlotsToTimeDetail({
                          ...d,
                          hasSpecificTime: true,
                          timeSlotStart: start,
                          timeSlotEnd: e.target.value,
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
            </div>
            <label className="inline-flex cursor-pointer items-center gap-3">
              <DeskToggle
                checked={draft.hasSpecificTime === false}
                disabled={locked}
                onChange={(hide) => {
                  setDraft((d) =>
                    syncDerivedEventFields(
                      applySlotsToTimeDetail({
                        ...d,
                        hasSpecificTime: !hide,
                        timeSlotStart: hide ? undefined : d.timeSlotStart,
                        timeSlotEnd: hide ? undefined : d.timeSlotEnd,
                      }),
                    ),
                  );
                }}
              />
              <span className="text-sm font-medium text-slate-800">{t(locale, "admin.events.specificTime")}</span>
            </label>
            <p className={deskHint}>{t(locale, "admin.events.timeOnlyHint")}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">
              {t(locale, "admin.events.sectionPhoto")}
            </h3>
          <div className="grid items-start gap-6 lg:grid-cols-2">
            <div>
              <label className={deskLabel} htmlFor="ev-img">
                {t(locale, "admin.events.imageUrl")}
              </label>
              <input
                id="ev-img"
                className={deskField}
                value={pendingImageFile ? "" : draft.imageSrc}
                onChange={(e) => {
                  clearPendingImage();
                  setDraft((d) => ({
                    ...d,
                    imageSrc: e.target.value,
                    imageStoragePath: undefined,
                  }));
                }}
                placeholder={pendingImageFile?.name || "https://…"}
                inputMode="url"
                autoComplete="off"
              />
              <p className={`mt-2 ${deskHint}`}>{t(locale, "admin.events.imageHint")}</p>
              {draft.imageSrc || pendingImageFile ? (
                <button
                  type="button"
                  className="mt-2 cursor-pointer text-sm font-medium text-slate-500 transition-colors hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                  onClick={onRemoveImage}
                  disabled={locked}
                >
                  {t(locale, "admin.events.removeImage")}
                </button>
              ) : null}
            </div>
            <div>
              <label className={deskLabel} htmlFor="ev-alt">
                {t(locale, "admin.events.imageAlt")} ({localeLabels[previewLocale]})
              </label>
              <input
                id="ev-alt"
                className={deskField}
                value={draft.imageAlt[previewLocale] ?? ""}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    imageAlt: { ...d.imageAlt, [previewLocale]: e.target.value },
                  }))
                }
              />
              <p className={`mt-2 ${deskHint}`}>{t(locale, "admin.events.imageAltHint")}</p>
            </div>
          </div>
          </div>

          <div className="border-t border-slate-200 pt-5">
            {isNew && storageLimit.showWarning ? (
              <EventCreateFullNotice
                title={t(locale, "admin.events.storageCreateTitle")}
                body={t(locale, "admin.events.storageCreateBody")}
              />
            ) : null}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className={`min-w-0 flex-1 text-sm ${isDirty ? "font-medium text-amber-700" : "text-slate-500"}`}>
              {isDirty
                ? t(locale, isNew ? "admin.events.saveNewTooltip" : "admin.events.saveEditTooltip")
                : t(locale, isNew ? "admin.events.saveNewDisabledTooltip" : "admin.events.saveEditDisabledTooltip")}
            </p>
            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
              {!isNew && editingId ? (
                <button
                  type="button"
                  className={deskDanger}
                  onClick={(e) => {
                    e.preventDefault();
                    void onDelete();
                  }}
                  disabled={locked}
                >
                  <Trash2 className="size-3.5" aria-hidden />
                  {t(locale, "admin.events.delete")}
                </button>
              ) : null}
              <button
                type="button"
                className={deskPrimary}
                onClick={onSave}
                disabled={locked || !isDirty || (isNew && storageLimit.blockNewEvents)}
                title={
                  isNew && storageLimit.blockNewEvents
                    ? storageFullMessage
                    : isDirty
                      ? isNew
                        ? t(locale, "admin.events.saveNewTooltip")
                        : t(locale, "admin.events.saveEditTooltip")
                      : isNew
                        ? t(locale, "admin.events.saveNewDisabledTooltip")
                        : t(locale, "admin.events.saveEditDisabledTooltip")
                }
              >
                {busy ? (
                  <Loader2 className="size-3.5 animate-spin" aria-hidden />
                ) : isNew ? (
                  <Plus className="size-3.5" aria-hidden />
                ) : (
                  <Save className="size-3.5" aria-hidden />
                )}
                {isNew ? t(locale, "admin.events.create") : t(locale, "admin.events.saveChanges")}
              </button>
            </div>
          </div>
          </div>
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
