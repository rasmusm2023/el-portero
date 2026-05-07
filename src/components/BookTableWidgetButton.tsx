"use client";

import type { ComponentPropsWithoutRef } from "react";
import { BOKABORD_WIDGET_HASH } from "@/config/bokabord";
import { useLocale } from "@/i18n/useLocale";
import { openBokabordReservation } from "@/lib/bokabordOpen";

/** Class name documented by Waiteraid (kept for parity with their embed). */
const WIDGET_CLASS = "waiteraid-widget";

export type BookTableWidgetButtonProps = ComponentPropsWithoutRef<"button">;

/**
 * Table booking: opens Boka bord in a full-screen layer (desktop) or navigates (mobile).
 * Styling is unchanged — we handle click ourselves so Next.js doesn’t depend on their script init.
 */
export function BookTableWidgetButton({
  className,
  children,
  type = "button",
  onClick,
  ...rest
}: BookTableWidgetButtonProps) {
  const { locale } = useLocale();

  return (
    <button
      {...rest}
      type={type}
      data-hash={BOKABORD_WIDGET_HASH}
      data-lang={locale}
      className={[className, "cursor-pointer", WIDGET_CLASS]
        .filter(Boolean)
        .join(" ")}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        e.preventDefault();
        openBokabordReservation(locale);
      }}
    >
      {children}
    </button>
  );
}
