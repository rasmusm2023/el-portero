"use client";

import { Check, ChevronDown } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useClickAway } from "@/hooks/useClickAway";
import { localeLabels, locales } from "@/i18n/strings";
import { useLocale } from "@/i18n/useLocale";
import { LocaleFlag } from "./LocaleFlag";

type LanguageSwitcherProps = {
  /** Legacy prop — site chrome is dark; both variants use the same dark styling. */
  variant?: "default" | "onDark";
};

export function LanguageSwitcher({ variant = "default" }: LanguageSwitcherProps) {
  void variant;
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);
  useClickAway(rootRef, close, open);

  const triggerClass =
    "inline-flex h-10 shrink-0 items-center gap-1 rounded-md bg-paper/12 px-2.5 py-2 text-paper/90 transition-[background-color,color] hover:bg-paper/20";

  const listClass =
    "absolute right-0 z-[200] mt-1 min-w-[12.5rem] overflow-hidden rounded-md border border-paper/20 bg-ink shadow-lg shadow-black/40";

  const itemBase =
    "flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm";

  const itemActive = `${itemBase} bg-paper/5 text-paper`;

  const itemIdle = `${itemBase} text-paper/90 hover:bg-paper/10`;

  const currentLabel = localeLabels[locale];

  return (
    <div className="relative z-[190]" ref={rootRef}>
      <button
        type="button"
        className={triggerClass}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Language: ${currentLabel}`}
        onClick={() => setOpen((v) => !v)}
      >
        <LocaleFlag locale={locale} variant="onDark" />
        <ChevronDown
          className={`size-3.5 shrink-0 opacity-50 transition-transform duration-200 text-paper ${
            open ? "rotate-180" : ""
          }`}
          strokeWidth={2.25}
          aria-hidden
        />
      </button>
      {open ? (
        <ul
          className={listClass}
          role="listbox"
          aria-label="Language"
        >
          {locales.map((code) => {
            const selected = code === locale;
            return (
              <li key={code} role="option" aria-selected={selected}>
                <button
                  type="button"
                  className={selected ? itemActive : itemIdle}
                  onClick={() => {
                    setLocale(code);
                    setOpen(false);
                  }}
                >
                  <LocaleFlag locale={code} variant="onDark" />
                  <span className="min-w-0 flex-1 text-left">{localeLabels[code]}</span>
                  {selected ? (
                    <Check
                      className="size-4 shrink-0 text-paper"
                      strokeWidth={2.5}
                      aria-hidden
                    />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
