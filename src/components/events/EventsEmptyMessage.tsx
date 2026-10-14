"use client";

import Link from "next/link";
import { INSTAGRAM_HANDLE, INSTAGRAM_PROFILE_URL } from "@/config/site";
import { useLocale } from "@/i18n/useLocale";
import { t, type MessageKey } from "@/i18n/strings";

const linkClass =
  "font-medium text-paper underline decoration-paper/45 underline-offset-[0.2em] transition-colors hover:decoration-paper";

type EventsEmptyMessageProps = {
  messageKey: Extract<MessageKey, "page.home.eventsEmpty" | "page.events.listEmpty">;
  className?: string;
};

function withContactLink(chunk: string, contactLabel: string) {
  const [before, after] = chunk.split("{contact}");
  if (after === undefined) return chunk;
  return (
    <>
      {before}
      <Link href="/contact" className={linkClass}>
        {contactLabel}
      </Link>
      {after}
    </>
  );
}

export function EventsEmptyMessage({ messageKey, className }: EventsEmptyMessageProps) {
  const { locale } = useLocale();
  const text = t(locale, messageKey);
  const contactLabel = t(locale, "page.home.eventsEmptyContact");
  const [before, after] = text.split(INSTAGRAM_HANDLE);

  return (
    <p className={className}>
      {withContactLink(before ?? "", contactLabel)}
      <a
        href={INSTAGRAM_PROFILE_URL}
        target="_blank"
        rel="noreferrer noopener"
        className={linkClass}
      >
        {INSTAGRAM_HANDLE}
      </a>
      {withContactLink(after ?? "", contactLabel)}
    </p>
  );
}
