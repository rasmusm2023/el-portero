"use client";

import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import type { KeyboardEvent } from "react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import type { Locale } from "@/i18n/strings";

function localeToBcp47(locale: Locale): string {
  if (locale === "es") return "es-ES";
  if (locale === "sv") return "sv-SE";
  return "en-GB";
}

function toIsoLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseIsoLocal(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function startOfToday(): Date {
  const t = new Date();
  return new Date(t.getFullYear(), t.getMonth(), t.getDate());
}

function formatDateDisplay(iso: string, locale: Locale): string {
  if (!iso) return "";
  const d = parseIsoLocal(iso);
  const lng = localeToBcp47(locale);
  return new Intl.DateTimeFormat(lng, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

function daysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

/** Monday-first column index (0–6) for the first day of the month. */
function mondayFirstOffset(year: number, monthIndex: number): number {
  const dow = new Date(year, monthIndex, 1).getDay();
  return (dow + 6) % 7;
}

type ReserveDateFieldProps = {
  id: string;
  name: string;
  labelId: string;
  value: string;
  /** Not named `onChange` — avoids confusion with DOM events. */
  onValueChange: (iso: string) => void;
  placeholder: string;
  /** e.g. translated "Date" for the dialog accessible name. */
  dialogAriaLabel: string;
  /** Mark calendar days as fully booked (no seats left). */
  isFullyBooked?: (iso: string) => boolean;
  /** Short label for tooltip / aria on booked days. */
  fullyBookedLabel?: string;
  locale: Locale;
  isOpen: boolean;
  onOpenToggle: () => void;
  onClose: () => void;
};

const PANEL =
  "absolute left-0 right-0 top-[calc(100%+0.25rem)] z-[200] w-[min(100vw-2rem,20.5rem)] rounded-md border border-ink/12 bg-white p-3 shadow-[0_8px_24px_rgba(10,10,10,0.1)] ring-1 ring-ink/4";

/**
 * Custom date picker — same visual language as {@link ReserveInlineSelect}
 * (native `input type="date"` cannot style the calendar popup).
 */
export function ReserveDateField({
  id,
  name,
  labelId,
  value,
  onValueChange,
  placeholder,
  dialogAriaLabel,
  isFullyBooked,
  fullyBookedLabel,
  locale,
  isOpen,
  onOpenToggle,
  onClose,
}: ReserveDateFieldProps) {
  const panelId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  const initialMonth = value
    ? parseIsoLocal(value)
    : startOfToday();
  const [visibleMonth, setVisibleMonth] = useState(() =>
    new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1),
  );

  useEffect(() => {
    if (isOpen && value) {
      const d = parseIsoLocal(value);
      setVisibleMonth(new Date(d.getFullYear(), d.getMonth(), 1));
    }
  }, [isOpen, value]);

  const lng = localeToBcp47(locale);
  const weekDayLabels = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(lng, { weekday: "short" });
    const monday = new Date(2024, 0, 8);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return fmt.format(d);
    });
  }, [lng]);

  const monthTitle = useMemo(() => {
    return new Intl.DateTimeFormat(lng, {
      month: "long",
      year: "numeric",
    }).format(visibleMonth);
  }, [lng, visibleMonth]);

  const year = visibleMonth.getFullYear();
  const monthIndex = visibleMonth.getMonth();
  const totalDays = daysInMonth(year, monthIndex);
  const offset = mondayFirstOffset(year, monthIndex);
  const today = startOfToday();
  const firstAllowedMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const canPrevMonth = visibleMonth.getTime() > firstAllowedMonth.getTime();

  const cells = useMemo(() => {
    const list: ({ day: number } | null)[] = [];
    for (let i = 0; i < offset; i++) {
      list.push(null);
    }
    for (let day = 1; day <= totalDays; day++) {
      list.push({ day });
    }
    return list;
  }, [offset, totalDays]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (containerRef.current?.contains(e.target as Node)) return;
      onClose();
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [isOpen, onClose]);

  const display = value ? formatDateDisplay(value, locale) : "";

  return (
    <div ref={containerRef} className="relative mt-1" onKeyDown={handleKeyDown}>
      <input type="hidden" name={name} value={value} />
      <button
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
        aria-labelledby={labelId}
        className="flex w-full min-w-0 cursor-pointer items-center justify-between gap-2 rounded-sm py-0.5 text-left font-sans text-sm font-medium outline-none transition-colors hover:text-ink/90 focus-visible:ring-2 focus-visible:ring-[#2563eb]/35 focus-visible:ring-offset-1"
        onClick={(e) => {
          e.preventDefault();
          onOpenToggle();
        }}
      >
        <span className={value ? "text-ink" : "text-ink/45"}>
          {display || placeholder}
        </span>
        <ChevronDown
          strokeWidth={2.25}
          className={`h-3.5 w-3.5 shrink-0 text-ink/40 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden
        />
      </button>

      {isOpen ? (
        <div
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-label={dialogAriaLabel}
          className={PANEL}
        >
          <div className="mb-3 flex items-center justify-between gap-2 px-0.5">
            <button
              type="button"
              disabled={!canPrevMonth}
              className="rounded-sm p-1.5 text-ink/70 transition-colors hover:bg-paper-dark/90 hover:text-ink disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
              aria-label={
                locale === "es"
                  ? "Mes anterior"
                  : locale === "sv"
                    ? "Föregående månad"
                    : "Previous month"
              }
              onClick={() =>
                setVisibleMonth(
                  new Date(year, monthIndex - 1, 1),
                )
              }
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={2} />
            </button>
            <span className="min-w-0 flex-1 text-center font-sans text-sm font-semibold text-ink">
              {monthTitle}
            </span>
            <button
              type="button"
              className="rounded-sm p-1.5 text-ink/70 transition-colors hover:bg-paper-dark/90 hover:text-ink"
              aria-label={
                locale === "es"
                  ? "Mes siguiente"
                  : locale === "sv"
                    ? "Nästa månad"
                    : "Next month"
              }
              onClick={() =>
                setVisibleMonth(
                  new Date(year, monthIndex + 1, 1),
                )
              }
            >
              <ChevronRight className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-y-0.5">
            {weekDayLabels.map((wd) => (
              <div
                key={wd}
                className="pb-1 text-center font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-ink/45"
              >
                {wd}
              </div>
            ))}
            {cells.map((cell, idx) => {
              if (!cell) {
                return <div key={`empty-${idx}`} className="aspect-square" />;
              }
              const { day } = cell;
              const cellDate = new Date(year, monthIndex, day);
              const iso = toIsoLocal(cellDate);
              const isBeforeToday = cellDate < today;
              const fullyBooked = isFullyBooked?.(iso) ?? false;
              const isSelected = value === iso;
              const isToday = toIsoLocal(cellDate) === toIsoLocal(today);
              const dayDisabled = isBeforeToday || fullyBooked;

              return (
                <div key={iso} className="flex aspect-square items-center justify-center p-0.5">
                  <button
                    type="button"
                    disabled={dayDisabled}
                    title={
                      fullyBooked && fullyBookedLabel ? fullyBookedLabel : undefined
                    }
                    aria-label={
                      fullyBooked && fullyBookedLabel
                        ? `${day} — ${fullyBookedLabel}`
                        : undefined
                    }
                    className={[
                      "flex h-9 w-9 items-center justify-center rounded-sm font-sans text-sm transition-colors",
                      dayDisabled
                        ? fullyBooked
                          ? "cursor-not-allowed bg-ink/[0.04] text-ink/30 line-through decoration-ink/25"
                          : "cursor-not-allowed text-ink/20"
                        : "text-ink/90 hover:bg-paper-dark/90",
                      isSelected && !fullyBooked
                        ? "bg-[#2563eb]/15 font-semibold text-ink ring-1 ring-[#2563eb]/35"
                        : "",
                      !isSelected && !dayDisabled && isToday
                        ? "ring-1 ring-ink/15"
                        : "",
                    ].join(" ")}
                    onClick={() => {
                      if (fullyBooked) return;
                      onValueChange(iso);
                      onClose();
                    }}
                  >
                    {day}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
