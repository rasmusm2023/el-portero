"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Copy, Eye, EyeOff, LayoutDashboard, Loader2, LogOut, Plus, Save, Sparkles, Trash2 } from "lucide-react";
import { EditableEventCard } from "@/components/admin/EditableEventCard";
import { EventPreviewLocaleMenu } from "@/components/admin/EventPreviewLocaleMenu";
import { LocaleFlag } from "@/components/layout/LocaleFlag";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { PageShell } from "@/components/layout/PageShell";
import {
  adminBtnBlue,
  adminBtnDanger,
  adminBtnAi,
  adminBtnGreen,
  adminBtnNeutral,
  adminBtnSignOut,
  adminCalloutInfo,
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
  pickLocaleText,
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

function StepHeading({
  locale,
  step,
  title,
  hint,
}: {
  locale: Locale;
  step: 1 | 2 | 3 | 4;
  title: string;
  hint?: string;
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold tracking-[0.18em] text-zinc-500 uppercase">
        {t(locale, "admin.events.step").replace("{n}", String(step))}
      </p>
      <h2 className="mt-1 text-lg font-semibold text-zinc-900 sm:text-xl">{title}</h2>
      {hint ? <p className={`mt-1 ${adminHint}`}>{hint}</p> : null}
    </div>
  );
}

function WebsiteStatusCard({
  locale,
  localPublish,
  checked,
  disabled,
  onChange,
}: {
  locale: Locale;
  localPublish: boolean;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}) {
  const title = checked
    ? t(locale, localPublish ? "admin.events.publishedLocal" : "admin.events.published")
    : t(locale, "admin.events.statusHidden");
  const hint = checked
    ? t(locale, localPublish ? "admin.events.publishedLocalHint" : "admin.events.publishedHint")
    : t(locale, localPublish ? "admin.events.statusHiddenLocalHint" : "admin.events.statusHiddenHint");
  const tone = checked
    ? localPublish
      ? "border-sky-500 bg-sky-50 text-sky-950"
      : "border-emerald-600 bg-emerald-50 text-emerald-950"
    : "border-amber-500 bg-amber-50 text-amber-950";

  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-lg border-2 p-4 shadow-sm ${tone} ${
        disabled ? "cursor-not-allowed opacity-60" : ""
      }`}
    >
      <input
        type="checkbox"
        className="mt-1 size-5 shrink-0 rounded border-current/40 bg-white text-current focus:ring-2 focus:ring-current/30"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="min-w-0">
        <span className="block text-[11px] font-semibold tracking-[0.16em] uppercase opacity-70">
          {t(locale, "admin.events.sectionPublish")}
        </span>
        <span className="mt-1 flex items-center gap-2 text-base font-semibold">
          {checked ? <Eye className="size-4 shrink-0" aria-hidden /> : <EyeOff className="size-4 shrink-0" aria-hidden />}
          {title}
        </span>
        <span className="mt-1 block text-sm leading-relaxed">{hint}</span>
      </span>
    </label>
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

const eventTimeSelectClass =
  "mt-1 h-16 w-24 shrink-0 rounded-md border border-zinc-300 bg-white px-1 text-center text-base font-medium tabular-nums text-zinc-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500";

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
    setPreviewLocale("en");
    clearPendingImage();
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
      setPreviewLocale("en");
      clearPendingImage();
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

  return (
    <>
    <PageShell
      tone="admin"
      title={t(locale, "admin.events.title")}
      intro={t(locale, "admin.events.introLead")}
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
                          ) : ev.localOnly ? (
                            <span className="rounded border border-sky-200 bg-sky-50 px-1.5 py-px text-[10px] font-semibold tracking-wide text-sky-800 uppercase">
                              {t(locale, "admin.events.localOnly")}
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
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-zinc-200 pb-3">
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
            <div className="rounded-xl bg-ink">
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
            <div className="mt-4 flex flex-col items-start gap-3 border-t border-zinc-200 pt-4">
              <StepHeading
                locale={locale}
                step={2}
                title={t(locale, "admin.events.translateContent")}
                hint={t(locale, "admin.events.sourceHint")}
              />
              <button
                type="button"
                className={adminBtnAi}
                onClick={() => void onTranslate()}
                disabled={locked}
              >
                <span className="inline-flex items-center gap-2">
                  {translating ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                  ) : (
                    <Sparkles className="size-4" aria-hidden />
                  )}
                  {translating
                    ? t(locale, "admin.events.translating")
                    : t(locale, "admin.events.translateContent")}
                </span>
              </button>
              {translating ? (
                <div className={`${adminCalloutInfo} w-full`}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{t(locale, "admin.events.translating")}</p>
                    <p
                      className="font-mono text-sm tabular-nums text-sky-800/80"
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
                        className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                          index === translateBeat % locales.length ? "bg-sky-600" : "bg-sky-200"
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
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition-all duration-300 ${
                            active
                              ? "border-sky-400 bg-white text-sky-950 shadow-sm"
                              : "border-transparent bg-sky-100/70 text-sky-900/55"
                          }`}
                        >
                          <LocaleFlag locale={code} />
                          {localeLabels[code]}
                        </li>
                      );
                    })}
                  </ul>
                  <p className="mt-3" role="status" aria-live="polite">
                    {t(locale, translateWaitNotes[Math.floor(translateSeconds / 4) % translateWaitNotes.length]!)}
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          <div className={`${adminPanel} lg:p-8`}>
            <div className="space-y-8">
          <div className="space-y-6">
            <StepHeading
              locale={locale}
              step={3}
              title={t(locale, "admin.events.step3Title")}
            />
            <div className="grid items-start gap-6 lg:grid-cols-2">
              <div>
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
                <p className={`mt-1 ${adminHint}`}>
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

          <div className="space-y-6 border-t border-zinc-200 pt-8">
            <StepHeading
              locale={locale}
              step={4}
              title={t(locale, "admin.events.step4Title")}
              hint={t(locale, "admin.events.step4Hint")}
            />
          <div className="space-y-3">
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
            <div className="flex flex-wrap gap-8">
              <div>
                <label className={adminLabel} htmlFor="ev-start">
                  {t(locale, "admin.events.startTime")}
                </label>
                <select
                  id="ev-start"
                  className={eventTimeSelectClass}
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
              <div>
                <label className={adminLabel} htmlFor="ev-end">
                  {t(locale, "admin.events.endTime")}
                </label>
                <select
                  id="ev-end"
                  className={eventTimeSelectClass}
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
            <p className={adminHint}>{t(locale, "admin.events.timeOnlyHint")}</p>
          </div>

          <div className="grid items-start gap-6 lg:grid-cols-2">
            <div>
              <label className={adminLabel} htmlFor="ev-img">
                {t(locale, "admin.events.imageUrl")}
              </label>
              <input
                id="ev-img"
                className={`${adminFieldInput} mt-1`}
                value={pendingImageFile ? "" : draft.imageSrc}
                onChange={(e) => {
                  clearPendingImage();
                  setDraft((d) => ({
                    ...d,
                    imageSrc: e.target.value,
                    imageStoragePath: undefined,
                  }));
                }}
                placeholder="https://…"
                inputMode="url"
                autoComplete="off"
              />
              <p className={`mt-1 ${adminHint}`}>{t(locale, "admin.events.imageHint")}</p>
              {draft.imageSrc || pendingImageFile ? (
                <button
                  type="button"
                  className="mt-2 text-xs font-semibold tracking-wide text-red-700 uppercase hover:text-red-800"
                  onClick={onRemoveImage}
                  disabled={locked}
                >
                  {t(locale, "admin.events.removeImage")}
                </button>
              ) : null}
            </div>
            <div>
              <label className={adminLabel} htmlFor="ev-alt">
                {t(locale, "admin.events.imageAlt")} ({localeLabels[previewLocale]})
              </label>
              <input
                id="ev-alt"
                className={`${adminFieldInput} mt-1`}
                value={draft.imageAlt[previewLocale] ?? ""}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    imageAlt: { ...d.imageAlt, [previewLocale]: e.target.value },
                  }))
                }
              />
              <p className={`mt-1 ${adminHint}`}>{t(locale, "admin.events.imageAltHint")}</p>
            </div>
          </div>

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
