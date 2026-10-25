"use client";

import { useCallback, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { LocaleFlag } from "@/components/layout/LocaleFlag";
import { useClickAway } from "@/hooks/useClickAway";
import { adminContentLocales, eventCopyFilled } from "@/i18n/localeMeta";
import { localeLabels, t, type Locale } from "@/i18n/strings";
import type { LocaleTrio } from "@/lib/publicEventTypes";

type EventPreviewLocaleMenuProps = {
  uiLocale: Locale;
  previewLocale: Locale;
  title: LocaleTrio;
  excerpt: LocaleTrio;
  onChange: (locale: Locale) => void;
  disabled?: boolean;
};

export function EventPreviewLocaleMenu({
  uiLocale,
  previewLocale,
  title,
  excerpt,
  onChange,
  disabled,
}: EventPreviewLocaleMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const close = useCallback(() => setOpen(false), []);
  useClickAway(rootRef, close, open);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-300 bg-white px-2.5 text-sm font-medium text-slate-800 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={t(uiLocale, "admin.events.previewLanguage")}
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
      >
        <LocaleFlag locale={previewLocale} />
        {localeLabels[previewLocale]}
        <ChevronDown className={`size-3.5 text-stone-400 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label={t(uiLocale, "admin.events.chooseLanguage")}
          className="absolute right-0 z-30 mt-1.5 min-w-64 overflow-hidden rounded-lg border border-slate-200 bg-white p-1 shadow-lg"
        >
          {adminContentLocales.map((code) => {
            const selected = previewLocale === code;
            const translated = eventCopyFilled(title, excerpt, code);
            return (
              <li key={code} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={[
                    "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm",
                    selected ? "bg-blue-50 text-blue-900" : "text-slate-800 hover:bg-slate-50",
                  ].join(" ")}
                  onClick={() => {
                    onChange(code);
                    setOpen(false);
                  }}
                >
                  <LocaleFlag locale={code} />
                  <span className="min-w-0 flex-1 font-medium">{localeLabels[code]}</span>
                  {translated ? null : (
                    <span
                      className="max-w-32 shrink-0 text-right text-xs font-medium text-amber-700"
                    >
                      {t(uiLocale, "admin.events.notTranslatedYet")}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
