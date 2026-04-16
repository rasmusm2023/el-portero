"use client";

import { Instagram } from "lucide-react";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";
import { INSTAGRAM_HANDLE, INSTAGRAM_PROFILE_URL } from "@/config/site";
import { useId, useState } from "react";

const INITIAL_POSTS = 4;
const EXPANDED_POSTS = 8;

/**
 * Placeholder for a future Instagram embed / API feed.
 */
export function InstagramFeedSection() {
  const { locale } = useLocale();
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();
  const count = expanded ? EXPANDED_POSTS : INITIAL_POSTS;

  return (
    <section
      aria-label={t(locale, "page.home.instagramAria")}
      className="border-t border-border bg-paper-dark/30"
    >
      <div className="w-full px-5 py-16 sm:px-10 sm:py-20 lg:px-14 xl:px-20">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
          <div className="flex min-w-0 flex-1 items-center gap-5 sm:gap-6">
            <a
              href={INSTAGRAM_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-ink text-paper shadow-sm ring-1 ring-ink/10 transition-colors hover:bg-ink-muted"
              aria-label={t(locale, "page.home.instagramAria")}
            >
              <Instagram className="size-[1.65rem]" strokeWidth={1.75} aria-hidden />
            </a>
            <div className="min-w-0 flex-1">
              <p className="m-0 leading-none">
                <a
                  href={INSTAGRAM_PROFILE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-0.5 font-sans transition-colors hover:text-ink"
                  aria-label={INSTAGRAM_HANDLE}
                >
                  <span
                    className="text-sm font-normal text-ink-muted/50 transition-colors group-hover:text-ink-muted sm:text-base"
                    aria-hidden
                  >
                    @
                  </span>
                  <span className="text-xl font-bold tracking-[0.16em] text-ink group-hover:text-ink sm:text-2xl">
                    {INSTAGRAM_HANDLE.replace(/^@/, "")}
                  </span>
                </a>
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3 sm:justify-end">
            <a
              href={INSTAGRAM_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-none border border-ink/40 bg-transparent px-6 py-2.5 text-sm font-semibold tracking-[0.16em] text-ink uppercase transition-colors hover:border-ink hover:bg-ink/5"
            >
              {t(locale, "page.home.instagramFollow")}
            </a>
          </div>
        </div>

        <div
          id={panelId}
          className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
          aria-live="polite"
        >
          {Array.from({ length: count }, (_, i) => (
            <div
              key={i}
              className="aspect-square rounded-none border border-dashed border-border bg-paper-dark/40 ring-1 ring-border/60"
              aria-hidden
            />
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-none border border-border bg-paper-dark/50 px-5 py-2.5 text-sm font-medium tracking-[0.12em] text-ink uppercase transition-colors hover:border-ink/25 hover:text-ink"
            onClick={() => setExpanded((e) => !e)}
            aria-expanded={expanded}
            aria-controls={panelId}
          >
            {expanded
              ? t(locale, "page.home.instagramShowLess")
              : t(locale, "page.home.instagramShowMore")}
          </button>
        </div>
      </div>
    </section>
  );
}
