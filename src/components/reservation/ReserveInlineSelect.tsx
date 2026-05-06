"use client";

import { ChevronDown } from "lucide-react";
import type { KeyboardEvent } from "react";
import { useCallback, useEffect, useId, useRef } from "react";

export type ReserveSelectOption = {
  value: string;
  label: string;
  /** Show as unavailable (e.g. slot taken). */
  disabled?: boolean;
};

type ReserveInlineSelectProps = {
  id: string;
  name: string;
  /** Visible label (for aria-labelledby). */
  labelId: string;
  /** Current value; empty string shows placeholder. */
  value: string;
  /** Deliberately not named `onChange` — avoids ever receiving a raw DOM event. */
  onValueChange: (value: string) => void;
  options: ReserveSelectOption[];
  placeholder?: string;
  isOpen: boolean;
  onOpenToggle: () => void;
  onClose: () => void;
  /** Optional id(s) of error/description elements (e.g. validation). */
  ariaDescribedBy?: string;
  /** When true, exposes invalid state to assistive tech. */
  ariaInvalid?: boolean;
};

/**
 * Custom dropdown styled to match the reservation bar (dark panel, light text, gold focus ring).
 */
export function ReserveInlineSelect({
  id,
  name,
  labelId,
  value,
  onValueChange,
  options,
  placeholder,
  isOpen,
  onOpenToggle,
  onClose,
  ariaDescribedBy,
  ariaInvalid,
}: ReserveInlineSelectProps) {
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  const match = options.find((o) => o.value === value);
  const selected = match && !match.disabled ? match : undefined;
  const display = selected?.label ?? placeholder ?? "";

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

  return (
    <div ref={containerRef} className="relative mt-1" onKeyDown={handleKeyDown}>
      <input type="hidden" name={name} value={value} />
      <button
        id={id}
        type="button"
        role="combobox"
        aria-autocomplete="none"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listId : undefined}
        aria-labelledby={labelId}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid || undefined}
        className="flex w-full min-w-0 cursor-pointer items-center justify-between gap-2 rounded-sm py-0.5 text-left font-sans text-sm font-medium text-paper outline-none transition-colors hover:text-paper/90 focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-1 focus-visible:ring-offset-paper-dark"
        onClick={(e) => {
          e.preventDefault();
          onOpenToggle();
        }}
      >
        <span className={selected ? "text-paper" : "text-paper/45"}>{display}</span>
        <ChevronDown
          strokeWidth={2.25}
          className={`h-3.5 w-3.5 shrink-0 text-paper/40 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden
        />
      </button>

      {isOpen ? (
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={labelId}
          className="absolute left-0 right-0 top-[calc(100%+0.25rem)] z-[200] max-h-[min(16rem,50vh)] overflow-auto rounded-md border border-paper/15 bg-paper-dark py-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.55)] ring-1 ring-black/30"
        >
          {options.map((opt) => {
            const active = opt.value === value && !opt.disabled;
            return (
              <li key={opt.value} role="presentation" className="px-1">
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  disabled={opt.disabled}
                  title={opt.disabled ? opt.label : undefined}
                  className={[
                    "w-full rounded-sm px-3 py-2.5 text-left font-sans text-sm transition-colors",
                    opt.disabled
                      ? "cursor-not-allowed text-paper/35 line-through decoration-paper/25 opacity-70"
                      : active
                        ? "bg-gold/15 font-semibold text-paper"
                        : "font-medium text-paper/90 hover:bg-paper/8",
                  ].join(" ")}
                  onClick={() => {
                    if (opt.disabled) return;
                    onValueChange(opt.value);
                    onClose();
                  }}
                >
                  {opt.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
