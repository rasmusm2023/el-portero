"use client";

import { Check } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useClickAway } from "@/hooks/useClickAway";
import { localeLabels, locales } from "@/i18n/strings";
import { useLocale } from "@/i18n/useLocale";
import { LocaleFlag } from "./LocaleFlag";

type LanguageSwitcherProps = {
  /** For dark backgrounds (e.g. full-screen nav overlay). */
  variant?: "default" | "onDark";
};

export function LanguageSwitcher({ variant = "default" }: LanguageSwitcherProps) {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);
  useClickAway(rootRef, close, open);

  const isDark = variant === "onDark";

  const triggerClass = isDark
    ? "inline-flex items-center justify-center rounded-md border border-paper/30 bg-paper/5 p-1.5 text-paper/90 transition-colors hover:border-gold hover:text-gold"
    : "inline-flex items-center justify-center rounded-md border border-border p-1.5 text-ink transition-colors hover:border-gold hover:text-gold";

  const listClass = isDark
    ? "absolute right-0 z-[70] mt-1 min-w-[12.5rem] rounded-md border border-paper/20 bg-ink py-1 shadow-lg shadow-black/40"
    : "absolute right-0 z-[70] mt-1 min-w-[12.5rem] rounded-md border border-border bg-paper py-1 shadow-lg";

  const itemBase =
    "flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm";

  const itemActive = isDark
    ? `${itemBase} bg-paper/5 text-gold`
    : `${itemBase} bg-gold-dim/80 text-gold`;

  const itemIdle = isDark
    ? `${itemBase} text-paper/90 hover:bg-paper/10`
    : `${itemBase} text-ink hover:bg-paper-dark`;

  const currentLabel = localeLabels[locale];
  const flagVariant = isDark ? "onDark" : "default";

  return (
    <div className="relative z-[60]" ref={rootRef}>
      <button
        type="button"
        className={triggerClass}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Language: ${currentLabel}`}
        onClick={() => setOpen((v) => !v)}
      >
        <LocaleFlag locale={locale} variant={flagVariant} />
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
                  <LocaleFlag locale={code} variant={flagVariant} />
                  <span className="min-w-0 flex-1 text-left">{localeLabels[code]}</span>
                  {selected ? (
                    <Check className="size-4 shrink-0 text-gold" strokeWidth={2.5} aria-hidden />
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
