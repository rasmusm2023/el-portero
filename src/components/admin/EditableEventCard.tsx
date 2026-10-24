"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { Bold, ChevronDown, Italic, List, Type } from "lucide-react";
import { EventImage } from "@/components/events/EventImage";
import { useClickAway } from "@/hooks/useClickAway";
import { t, type Locale } from "@/i18n/strings";
import { descriptionToEditorHtml, EVENT_DESCRIPTION_BULLET } from "@/lib/eventDescriptionText";
import { formatSortDateForEventDisplay } from "@/lib/eventDisplayDate";
import {
  DEFAULT_EVENT_TIME_END,
  DEFAULT_EVENT_TIME_START,
  type HomeEvent,
} from "@/lib/publicEventTypes";
import {
  EVENT_TIME_OPTIONS,
  clampEndAfterStart,
  formatTimeDetailLine,
} from "@/lib/eventSchedule";

const editHit =
  "rounded-sm transition-[background-color,box-shadow] hover:bg-paper/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper/35";

type EditableEventCardProps = {
  event: HomeEvent;
  previewLocale: Locale;
  uiLocale: Locale;
  disabled?: boolean;
  onRequestImagePick: () => void;
  onChangeDate: (ymd: string) => void;
  onChangeTitle: (value: string) => void;
  onChangeExcerpt: (value: string) => void;
  onChangeTime: (start: string, end: string) => void;
  onEnableTime: () => void;
  onChangeFullyBooked: (fullyBooked: boolean) => void;
};

export function EditableEventCard({
  event,
  previewLocale,
  uiLocale,
  disabled,
  onRequestImagePick,
  onChangeDate,
  onChangeTitle,
  onChangeExcerpt,
  onChangeTime,
  onEnableTime,
  onChangeFullyBooked,
}: EditableEventCardProps) {
  const title = event.title[previewLocale] ?? "";
  const excerpt = event.excerpt[previewLocale] ?? "";
  const imageAlt = (event.imageAlt[previewLocale] ?? "").trim() || title;
  const imageSrc = event.imageSrc.trim();
  const showTime = event.hasSpecificTime !== false;
  const start = event.timeSlotStart ?? DEFAULT_EVENT_TIME_START;
  const end = event.timeSlotEnd ?? DEFAULT_EVENT_TIME_END;
  const timeDetail = formatTimeDetailLine(start, end);
  const dateLabel =
    formatSortDateForEventDisplay(event.sortDate, previewLocale) ||
    t(uiLocale, "admin.events.calendarDate");
  const fullyBooked = Boolean(event.fullyBooked);

  const [timeOpen, setTimeOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const timeRef = useRef<HTMLDivElement>(null);
  const bookingRef = useRef<HTMLDivElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const excerptRef = useRef<HTMLDivElement>(null);
  const excerptEmitted = useRef<string | null>(null);
  const [excerptFocused, setExcerptFocused] = useState(false);

  const closeTime = useCallback(() => setTimeOpen(false), []);
  const closeBooking = useCallback(() => setBookingOpen(false), []);
  useClickAway(timeRef, closeTime, timeOpen);
  useClickAway(bookingRef, closeBooking, bookingOpen);

  useEffect(() => {
    if (disabled) {
      setTimeOpen(false);
      setBookingOpen(false);
    }
  }, [disabled]);

  function openDatePicker() {
    const input = dateInputRef.current;
    if (!input || disabled) return;
    try {
      input.showPicker();
    } catch {
      input.focus();
    }
  }

  function publishExcerpt() {
    const field = excerptRef.current;
    if (!field) return;
    const next = serializeDescriptionEditor(field);
    excerptEmitted.current = next;
    onChangeExcerpt(next);
  }

  function formatExcerpt(command: "bold" | "italic" | "bullets" | "text") {
    const field = excerptRef.current;
    if (!field || disabled) return;
    field.focus();
    ensureEditorSelection(field);
    if (command === "bold" || command === "italic") document.execCommand(command);
    if (command === "text") {
      document.execCommand("removeFormat");
      if (document.queryCommandState("insertUnorderedList")) {
        document.execCommand("insertUnorderedList");
      }
      selectedDescriptionLines(field).forEach(stripDescriptionBullet);
    }
    if (command === "bullets") {
      const alreadyList = document.queryCommandState("insertUnorderedList");
      document.execCommand("insertUnorderedList");
      if (!alreadyList && !field.querySelector("li")) addDescriptionBullet(field);
      placeCaretInListItem(field);
    }
    publishExcerpt();
  }

  function openTimeEditor() {
    if (disabled) return;
    setBookingOpen(false);
    if (!showTime) onEnableTime();
    setTimeOpen(true);
  }

  return (
    <article className="flex w-full flex-col overflow-visible rounded-2xl border border-border bg-paper-dark/35 shadow-sm ring-1 ring-border/60 sm:rounded-3xl md:min-h-60 md:flex-row">
      <div className="group relative aspect-16/10 w-full shrink-0 overflow-hidden rounded-t-2xl bg-ink/5 sm:rounded-t-3xl md:aspect-auto md:w-[46%] md:min-w-44 md:max-w-md md:rounded-l-3xl md:rounded-tr-none xl:max-w-136 2xl:max-w-152">
        {imageSrc ? (
          <EventImage
            src={imageSrc}
            alt={imageAlt || t(uiLocale, "admin.events.titleField")}
            fill
            className="object-cover"
            sizes="(max-width: 767px) 100vw, (max-width: 1024px) 90vw, (max-width: 1536px) 45vw, 640px"
            loading="eager"
          />
        ) : (
          <div className="flex h-full min-h-48 items-center justify-center bg-paper/8 px-6" />
        )}
        <div
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/35 via-transparent to-transparent md:bg-linear-to-r md:from-transparent md:via-transparent md:to-paper/8"
          aria-hidden
        />
        <button
          type="button"
          className="absolute inset-0 z-10 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-paper/40 disabled:cursor-not-allowed"
          onClick={onRequestImagePick}
          disabled={disabled}
          aria-label={
            imageSrc
              ? t(uiLocale, "admin.events.changePhoto")
              : t(uiLocale, "admin.events.uploadImage")
          }
        >
          <span
            className={[
              "rounded-md border border-paper/25 bg-ink/70 px-3 py-1.5 text-xs font-semibold tracking-[0.16em] text-paper uppercase",
              imageSrc
                ? "opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
                : "",
            ].join(" ")}
          >
            {imageSrc
              ? t(uiLocale, "admin.events.changePhoto")
              : t(uiLocale, "admin.events.uploadImage")}
          </span>
        </button>
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-between gap-4 px-5 py-6 sm:gap-5 sm:px-6 sm:py-7">
        <div className="min-w-0">
          <label className={`relative mb-3 block cursor-pointer ${editHit}`}>
            <span className="sr-only">{t(uiLocale, "admin.events.editDate")}</span>
            <span
              aria-hidden
              className="pointer-events-none block px-1 py-0.5 text-left text-[10px] font-semibold leading-snug tracking-[0.2em] text-ink-muted uppercase sm:text-[11px]"
            >
              {dateLabel}
            </span>
            <input
              ref={dateInputRef}
              type="date"
              className="absolute inset-0 cursor-pointer opacity-0"
              value={event.sortDate}
              onChange={(e) => onChangeDate(e.target.value)}
              onClick={openDatePicker}
              disabled={disabled}
            />
          </label>

          <AutoGrowField
            aria-label={t(uiLocale, "admin.events.titleField")}
            className={`-mx-1 w-[calc(100%+0.5rem)] resize-none bg-transparent px-1 py-0.5 font-display text-lg font-medium leading-snug tracking-tight text-paper placeholder:text-paper/35 sm:text-xl ${editHit}`}
            value={title}
            placeholder={t(uiLocale, "admin.events.titleField")}
            onChange={onChangeTitle}
            disabled={disabled}
          />

          {showTime ? (
            <div ref={timeRef} className="relative mt-2">
              <button
                type="button"
                className={`-mx-1 px-1 py-0.5 text-left text-[11px] font-semibold leading-snug tracking-[0.18em] text-ink-muted uppercase sm:text-xs sm:tracking-[0.2em] ${editHit}`}
                aria-label={t(uiLocale, "admin.events.editTime")}
                aria-expanded={timeOpen}
                aria-haspopup="dialog"
                disabled={disabled}
                onClick={openTimeEditor}
              >
                {timeDetail}
              </button>
              {timeOpen ? (
                <TimePopover
                  uiLocale={uiLocale}
                  start={start}
                  end={end}
                  disabled={disabled}
                  onChangeTime={onChangeTime}
                />
              ) : null}
            </div>
          ) : (
            <button
              type="button"
              className={`mt-2 -mx-1 px-1 py-0.5 text-left text-[11px] font-semibold leading-snug tracking-[0.18em] text-ink-muted/70 uppercase sm:text-xs sm:tracking-[0.2em] ${editHit}`}
              aria-label={t(uiLocale, "admin.events.addTime")}
              disabled={disabled}
              onClick={openTimeEditor}
            >
              {t(uiLocale, "admin.events.addTime")}
            </button>
          )}

          <div
            className={`relative mt-2.5 -mx-1 flex flex-col rounded-md px-1 ${
              excerptFocused ? "bg-paper/6 ring-1 ring-paper/25" : ""
            }`}
            onFocus={() => setExcerptFocused(true)}
            onBlur={(event) => {
              const next = event.relatedTarget;
              if (!(next instanceof Node) || !event.currentTarget.contains(next)) {
                setExcerptFocused(false);
              }
            }}
          >
            <DescriptionEditor
              editorRef={excerptRef}
              value={excerpt}
              emittedRef={excerptEmitted}
              disabled={disabled}
              ariaLabel={t(uiLocale, "admin.events.excerpt")}
              onInput={publishExcerpt}
            />
            {!excerpt && !excerptFocused ? (
              <span className="pointer-events-none absolute top-1 left-2 text-sm text-ink-muted/45">
                {t(uiLocale, "admin.events.excerpt")}
              </span>
            ) : null}
            {excerptFocused ? (
              <div
                className="order-1 flex flex-wrap gap-1 border-b border-paper/15 py-1"
                role="toolbar"
              >
                <DescriptionFormatButton
                  label={t(uiLocale, "admin.events.descriptionText")}
                  disabled={disabled}
                  onClick={() => formatExcerpt("text")}
                >
                  <Type className="size-3.5" aria-hidden />
                </DescriptionFormatButton>
                <DescriptionFormatButton
                  label={t(uiLocale, "admin.events.descriptionBold")}
                  disabled={disabled}
                  onClick={() => formatExcerpt("bold")}
                >
                  <Bold className="size-3.5" aria-hidden />
                </DescriptionFormatButton>
                <DescriptionFormatButton
                  label={t(uiLocale, "admin.events.descriptionItalic")}
                  disabled={disabled}
                  onClick={() => formatExcerpt("italic")}
                >
                  <Italic className="size-3.5" aria-hidden />
                </DescriptionFormatButton>
                <DescriptionFormatButton
                  label={t(uiLocale, "admin.events.descriptionBullets")}
                  disabled={disabled}
                  onClick={() => formatExcerpt("bullets")}
                >
                  <List className="size-3.5" aria-hidden />
                </DescriptionFormatButton>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <div ref={bookingRef} className="relative">
            <button
              type="button"
              className={
                fullyBooked
                  ? `inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-border bg-ink/10 px-3.5 py-2.5 text-[10px] font-semibold tracking-[0.2em] text-ink-muted uppercase sm:px-4 sm:py-2.5 sm:text-xs ${editHit}`
                  : "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-ink bg-ink px-3.5 py-2.5 text-[10px] font-semibold tracking-[0.2em] text-paper uppercase transition-colors hover:bg-ink/90 sm:px-4 sm:py-2.5 sm:text-xs"
              }
              aria-label={t(uiLocale, "admin.events.editAvailability")}
              aria-haspopup="listbox"
              aria-expanded={bookingOpen}
              disabled={disabled}
              onClick={() => {
                setTimeOpen(false);
                setBookingOpen((v) => !v);
              }}
            >
              {fullyBooked
                ? t(previewLocale, "page.reserve.fullyBooked")
                : t(previewLocale, "nav.reserve")}
              <ChevronDown className="size-3 opacity-80" aria-hidden />
            </button>
            {bookingOpen ? (
              <ul
                role="listbox"
                aria-label={t(uiLocale, "admin.events.editAvailability")}
                className="absolute bottom-full left-0 z-20 mb-2 min-w-44 overflow-hidden rounded-lg border border-zinc-200 bg-white py-1 shadow-lg"
              >
                <BookingOption
                  selected={!fullyBooked}
                  label={t(uiLocale, "admin.events.available")}
                  onSelect={() => {
                    onChangeFullyBooked(false);
                    setBookingOpen(false);
                  }}
                />
                <BookingOption
                  selected={fullyBooked}
                  label={t(uiLocale, "admin.events.fullyBooked")}
                  onSelect={() => {
                    onChangeFullyBooked(true);
                    setBookingOpen(false);
                  }}
                />
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

function TimePopover({
  uiLocale,
  start,
  end,
  disabled,
  onChangeTime,
}: {
  uiLocale: Locale;
  start: string;
  end: string;
  disabled?: boolean;
  onChangeTime: (start: string, end: string) => void;
}) {
  const labelId = useId();
  return (
    <div
      role="dialog"
      aria-labelledby={labelId}
      className="absolute left-0 top-full z-20 mt-2 flex flex-wrap gap-3 rounded-lg border border-zinc-200 bg-white p-3 shadow-lg"
    >
      <p id={labelId} className="sr-only">
        {t(uiLocale, "admin.events.editTime")}
      </p>
      <label className="block text-[10px] font-semibold tracking-wide text-zinc-600 uppercase">
        {t(uiLocale, "admin.events.startTime")}
        <select
          className="mt-1 block rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm font-medium tracking-normal text-zinc-900 normal-case"
          value={start}
          disabled={disabled}
          onChange={(e) => {
            const nextStart = e.target.value;
            onChangeTime(nextStart, clampEndAfterStart(nextStart, end));
          }}
        >
          {EVENT_TIME_OPTIONS.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-[10px] font-semibold tracking-wide text-zinc-600 uppercase">
        {t(uiLocale, "admin.events.endTime")}
        <select
          className="mt-1 block rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm font-medium tracking-normal text-zinc-900 normal-case"
          value={end}
          disabled={disabled}
          onChange={(e) => onChangeTime(start, e.target.value)}
        >
          {EVENT_TIME_OPTIONS.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

function BookingOption({
  selected,
  label,
  onSelect,
}: {
  selected: boolean;
  label: string;
  onSelect: () => void;
}) {
  return (
    <li role="presentation">
      <button
        type="button"
        role="option"
        aria-selected={selected}
        className={[
          "w-full px-3 py-2 text-left text-xs font-semibold",
          selected ? "bg-sky-50 text-sky-900" : "text-zinc-700 hover:bg-zinc-50",
        ].join(" ")}
        onClick={onSelect}
      >
        {label}
      </button>
    </li>
  );
}

function DescriptionEditor({
  editorRef,
  value,
  emittedRef,
  disabled,
  ariaLabel,
  onInput,
}: {
  editorRef: RefObject<HTMLDivElement | null>;
  value: string;
  emittedRef: RefObject<string | null>;
  disabled?: boolean;
  ariaLabel: string;
  onInput: () => void;
}) {
  useLayoutEffect(() => {
    const field = editorRef.current;
    if (!field || value === emittedRef.current) return;
    if (document.activeElement === field && serializeDescriptionEditor(field) === value) {
      emittedRef.current = value;
      return;
    }
    emittedRef.current = value;
    field.innerHTML = descriptionToEditorHtml(value);
  }, [editorRef, emittedRef, value]);

  return (
    <div
      ref={editorRef}
      role="textbox"
      aria-multiline="true"
      aria-label={ariaLabel}
      contentEditable={disabled ? "false" : "true"}
      suppressContentEditableWarning
      className="relative order-2 min-h-16 w-full py-1 text-sm leading-relaxed whitespace-pre-wrap text-ink-muted outline-none [&_li]:list-item [&_ol]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:my-1 [&_ul]:list-disc [&_ul]:pl-5"
      onInput={onInput}
    />
  );
}

function DescriptionFormatButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 rounded-md border border-paper/25 bg-ink/25 px-2 py-1 text-[10px] font-semibold tracking-[0.14em] text-paper/85 uppercase transition-colors hover:bg-paper/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper/35 disabled:cursor-not-allowed disabled:opacity-50"
      aria-label={label}
      disabled={disabled}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
    >
      {children}
      {label}
    </button>
  );
}

function AutoGrowField({
  value,
  onChange,
  className,
  placeholder,
  disabled,
  fieldRef,
  "aria-label": ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  className: string;
  placeholder: string;
  disabled?: boolean;
  fieldRef?: RefObject<HTMLTextAreaElement | null>;
  "aria-label": string;
}) {
  const localRef = useRef<HTMLTextAreaElement>(null);
  const ref = fieldRef ?? localRef;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      rows={1}
      className={className}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      aria-label={ariaLabel}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function serializeDescriptionEditor(root: HTMLElement): string {
  return serializeDescriptionChildren(root).replace(/\u00a0/g, " ").replace(/\n$/, "");
}

function serializeDescriptionChildren(parent: Node): string {
  let out = "";
  parent.childNodes.forEach((child) => {
    if (child instanceof HTMLElement && (child.tagName === "UL" || child.tagName === "OL")) {
      child.childNodes.forEach((item) => {
        if (!(item instanceof HTMLElement) || item.tagName !== "LI") return;
        if (out.length && !out.endsWith("\n")) out += "\n";
        out += serializeListItem(item);
      });
      if (out.length && !out.endsWith("\n")) out += "\n";
      return;
    }
    if (child instanceof HTMLElement && child.tagName === "LI") {
      if (out.length && !out.endsWith("\n")) out += "\n";
      out += serializeListItem(child);
      if (!out.endsWith("\n")) out += "\n";
      return;
    }
    if (child instanceof HTMLElement && (child.tagName === "DIV" || child.tagName === "P")) {
      if (out.length && !out.endsWith("\n")) out += "\n";
      out += serializeDescriptionChildren(child);
      return;
    }
    if (child instanceof HTMLElement && child.tagName === "BR") {
      out += "\n";
      return;
    }
    if (child.nodeType === Node.TEXT_NODE) {
      out += child.textContent ?? "";
      return;
    }
    if (!(child instanceof HTMLElement)) return;
    out += wrapDescriptionInline(child, serializeDescriptionChildren(child));
  });
  return out;
}

function directDescriptionChild(root: HTMLElement, node: Node): Node {
  if (node === root) return root;
  let current = node;
  while (current.parentNode && current.parentNode !== root) {
    current = current.parentNode;
  }
  return current;
}

function wrapDescriptionInline(el: HTMLElement, inner: string): string {
  const name = el.tagName;
  const weight = el.style.fontWeight;
  const bold =
    name === "STRONG" || name === "B" || weight === "bold" || (weight !== "" && Number(weight) >= 600);
  const italic = name === "EM" || name === "I" || el.style.fontStyle === "italic";
  let wrapped = inner;
  if (italic) wrapped = `_${wrapped}_`;
  if (bold) wrapped = `**${wrapped}**`;
  return wrapped;
}

function selectedDescriptionLines(root: HTMLElement): Node[] {
  const selection = window.getSelection();
  if (!selection?.anchorNode || !root.contains(selection.anchorNode)) return [];
  const start = directDescriptionChild(root, selection.anchorNode);
  const end =
    selection.focusNode && root.contains(selection.focusNode)
      ? directDescriptionChild(root, selection.focusNode)
      : start;
  if (start === root || end === root) return [root];
  const children = Array.from(root.childNodes);
  let from = children.indexOf(start as ChildNode);
  let to = children.indexOf(end as ChildNode);
  if (from === -1) return [];
  if (to === -1) to = from;
  if (from > to) [from, to] = [to, from];
  return children
    .slice(from, to + 1)
    .filter((node) => !(node instanceof HTMLElement && node.tagName === "BR"));
}

function firstDescriptionText(node: Node): Text | null {
  if (node.nodeType === Node.TEXT_NODE) return node as Text;
  for (const child of node.childNodes) {
    const found = firstDescriptionText(child);
    if (found) return found;
  }
  return null;
}

const descriptionBulletPrefix = /^[•\u2022]\s?/;

function serializeListItem(item: HTMLElement): string {
  const body = serializeDescriptionChildren(item)
    .replace(/\u00a0/g, " ")
    .replace(/\n+/g, " ")
    .trim()
    .replace(descriptionBulletPrefix, "");
  return `${EVENT_DESCRIPTION_BULLET}${body}`;
}

function ensureEditorSelection(field: HTMLElement) {
  const selection = window.getSelection();
  if (selection?.rangeCount && selection.anchorNode && field.contains(selection.anchorNode)) return;
  const range = document.createRange();
  range.selectNodeContents(field);
  range.collapse(false);
  selection?.removeAllRanges();
  selection?.addRange(range);
}

function placeCaretInListItem(field: HTMLElement) {
  const selection = window.getSelection();
  const anchor = selection?.anchorNode;
  const current =
    anchor instanceof Element ? anchor.closest("li") : anchor?.parentElement?.closest("li");
  const item = current && field.contains(current) ? current : field.querySelector("li");
  if (!item) return;
  const range = document.createRange();
  const text = firstDescriptionText(item);
  if (text?.textContent?.replace(/\u00a0/g, " ").trim()) {
    range.setStart(text, text.textContent.length);
  } else {
    range.setStart(item, 0);
  }
  range.collapse(true);
  selection?.removeAllRanges();
  selection?.addRange(range);
}

function addDescriptionBullet(field: HTMLElement) {
  const line = selectedDescriptionLines(field)[0] ?? field;
  const host = line instanceof HTMLElement ? line : line.parentElement;
  if (!host) return;
  [...host.childNodes].forEach((node) => {
    if (node instanceof HTMLElement && node.tagName === "BR") node.remove();
  });
  const text = document.createTextNode(EVENT_DESCRIPTION_BULLET);
  host.appendChild(text);
  const range = document.createRange();
  range.setStart(text, text.textContent?.length ?? 0);
  range.collapse(true);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}

function stripDescriptionBullet(line: Node) {
  if (line.nodeType === Node.TEXT_NODE) {
    const text = line as Text;
    text.textContent = (text.textContent ?? "").replace(descriptionBulletPrefix, "");
    return;
  }
  if (!(line instanceof HTMLElement)) return;
  const first = line.firstChild;
  if (first?.nodeType === Node.TEXT_NODE) {
    first.textContent = (first.textContent ?? "").replace(descriptionBulletPrefix, "");
    if (!first.textContent) first.remove();
    return;
  }
  const text = firstDescriptionText(line);
  if (!text?.textContent) return;
  text.textContent = text.textContent.replace(descriptionBulletPrefix, "");
}
