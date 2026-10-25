"use client";

import type { ReactNode, Ref } from "react";
import { Copy, Eye, EyeOff, Trash2 } from "lucide-react";
import { intlLocaleTag, pickLocaleText } from "@/i18n/localeMeta";
import { t, type Locale } from "@/i18n/strings";
import type { HomeEvent } from "@/lib/publicEventTypes";

export const deskPanel =
  "rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6";

export const deskLabel = "block text-sm font-medium text-slate-700";

export const deskHint = "text-sm leading-relaxed text-slate-500";

export const deskField =
  "mt-1.5 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm transition-[border-color,box-shadow] placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";

export const deskPrimary =
  "inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export const deskGhost =
  "inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export const deskDanger =
  "inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 text-sm font-medium text-red-700 shadow-sm transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export const deskTimeSelect =
  "mt-1.5 h-10 w-28 shrink-0 rounded-lg border border-slate-300 bg-white px-2 text-center text-sm font-medium text-slate-900 tabular-nums shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";

export function StepHeading({
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
  const stepLabel = t(locale, "admin.events.step").replace("{n}", String(step));
  return (
    <div className="flex items-start gap-3">
      <span
        className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600"
        aria-hidden
      >
        {step}
      </span>
      <div className="min-w-0">
        <h2 className="text-base font-semibold text-slate-900">
          <span className="sr-only">{stepLabel}. </span>
          {title}
        </h2>
        {hint ? <p className={`mt-1 max-w-2xl ${deskHint}`}>{hint}</p> : null}
      </div>
    </div>
  );
}

export function DeskNotice({
  tone,
  children,
}: {
  tone: "success" | "error" | "info";
  children: ReactNode;
}) {
  const shell =
    tone === "error"
      ? "border-red-200 bg-red-50 text-red-900"
      : tone === "info"
        ? "border-blue-200 bg-blue-50 text-blue-950"
        : "border-emerald-200 bg-emerald-50 text-emerald-950";
  const dot =
    tone === "error" ? "bg-red-600" : tone === "info" ? "bg-blue-600" : "bg-emerald-600";

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`flex items-start gap-3 rounded-lg border px-3.5 py-3 text-sm leading-relaxed ${shell}`}
    >
      <span className={`mt-1.5 size-1.5 shrink-0 rounded-full ${dot}`} aria-hidden />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export function DeskToggle({
  checked,
  disabled,
  labelledBy,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  labelledBy?: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <span className="relative h-6 w-11 shrink-0">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        aria-labelledby={labelledBy}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span
        aria-hidden
        className="absolute inset-0 rounded-full bg-slate-300 transition-colors peer-checked:bg-blue-600 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2 peer-disabled:opacity-50"
      />
      <span
        aria-hidden
        className="absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5"
      />
    </span>
  );
}

function statusDotClass(checked: boolean) {
  return checked ? "bg-emerald-500 status-breathe" : "bg-slate-400";
}

export function WebsiteStatusCard({
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

  return (
    <label
      className={`flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3.5 transition-colors hover:border-slate-300 ${
        disabled ? "cursor-not-allowed opacity-60" : ""
      }`}
    >
      <span className="min-w-0">
        <span className="block text-xs font-medium text-slate-500">
          {t(locale, "admin.events.sectionPublish")}
        </span>
        <span className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-900">
          <span className={`size-2 shrink-0 rounded-full ${statusDotClass(checked)}`} aria-hidden />
          {checked ? (
            <Eye className="size-3.5 shrink-0 text-slate-400" aria-hidden />
          ) : (
            <EyeOff className="size-3.5 shrink-0 text-slate-400" aria-hidden />
          )}
          <span>{title}</span>
        </span>
        <span className="mt-1 block text-sm leading-relaxed text-slate-500">{hint}</span>
      </span>
      <DeskToggle checked={checked} disabled={disabled} onChange={onChange} />
    </label>
  );
}

export function eventIndexDateParts(sortDate: string, locale: Locale) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(sortDate.trim());
  if (!match) return { day: "–", month: "" };
  const utc = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12));
  const tag = intlLocaleTag(locale);
  return {
    day: new Intl.DateTimeFormat(tag, { day: "numeric", timeZone: "Europe/Madrid" }).format(utc),
    month: new Intl.DateTimeFormat(tag, { month: "short", timeZone: "Europe/Madrid" }).format(utc),
  };
}

function IndexIconButton({
  label,
  disabled,
  tone,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  tone: "neutral" | "danger";
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={[
        "inline-flex size-8 items-center justify-center rounded-md text-slate-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-40",
        tone === "danger"
          ? "hover:bg-red-50 hover:text-red-600"
          : "hover:bg-white hover:text-slate-800",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export function EventIndexRow({
  event,
  locale,
  selected,
  past,
  locked,
  rowRef,
  onEdit,
  onDuplicate,
  onDelete,
}: {
  event: HomeEvent;
  locale: Locale;
  selected: boolean;
  past: boolean;
  locked: boolean;
  rowRef?: Ref<HTMLLIElement>;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const { day, month } = eventIndexDateParts(event.sortDate, locale);
  const title = pickLocaleText(event.title, locale).trim() || event.id;

  return (
    <li
      ref={rowRef}
      className={[
        "flex items-stretch gap-0.5 rounded-lg border p-1 transition-colors",
        selected
          ? "border-blue-200 bg-blue-50 shadow-[inset_3px_0_0_0_#2563eb]"
          : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100",
      ].join(" ")}
    >
      <button
        type="button"
        aria-current={selected ? "true" : undefined}
        className="flex min-w-0 flex-1 items-center gap-3 rounded-md px-1.5 py-1.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        onClick={onEdit}
      >
        <span
          className={[
            "flex w-11 shrink-0 flex-col items-center justify-center rounded-md py-1.5",
            selected ? "bg-white shadow-sm" : "bg-slate-100",
          ].join(" ")}
        >
          <span
            className={[
              "text-sm leading-none font-semibold tabular-nums",
              past && !selected ? "text-slate-400" : "text-slate-900",
            ].join(" ")}
          >
            {day}
          </span>
          <span className="mt-1 text-[10px] font-medium text-slate-500 uppercase">
            {month}
          </span>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-slate-900">
            {title}
          </span>
          <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
            {event.published === false ? (
              <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[11px] font-medium text-amber-900">
                {t(locale, "admin.events.draft")}
              </span>
            ) : event.localOnly ? (
              <span className="rounded-md bg-sky-100 px-1.5 py-0.5 text-[11px] font-medium text-sky-900">
                {t(locale, "admin.events.localOnly")}
              </span>
            ) : null}
            {past ? (
              <span className="text-xs font-medium text-red-700">
                {t(locale, "admin.events.pastRemove")}
              </span>
            ) : null}
            <span className="truncate font-mono text-[11px] text-slate-400">{event.id}</span>
          </span>
        </span>
      </button>
      <div className="flex shrink-0 items-center">
        <IndexIconButton
          label={t(locale, "admin.events.duplicate")}
          disabled={locked}
          tone="neutral"
          onClick={onDuplicate}
        >
          <Copy className="size-3.5" aria-hidden />
        </IndexIconButton>
        <IndexIconButton
          label={t(locale, "admin.events.delete")}
          disabled={locked}
          tone="danger"
          onClick={onDelete}
        >
          <Trash2 className="size-3.5" aria-hidden />
        </IndexIconButton>
      </div>
    </li>
  );
}
