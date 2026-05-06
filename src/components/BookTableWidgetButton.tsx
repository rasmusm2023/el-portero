"use client";

import type { ComponentPropsWithoutRef } from "react";
import { BOKABORD_WIDGET_HASH } from "@/config/bokabord";

/** Class the hosted script uses to bind click handlers — append alongside your styles. */
const WIDGET_CLASS = "waiteraid-widget";

export type BookTableWidgetButtonProps = ComponentPropsWithoutRef<"button">;

/**
 * Opens the Boka bord / Waiteraid popup. Pass the same `className` you would use
 * for a `Link` or `button` so layout is unchanged ({@link WIDGET_CLASS} is merged in).
 */
export function BookTableWidgetButton({
  className,
  children,
  type = "button",
  ...rest
}: BookTableWidgetButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      data-hash={BOKABORD_WIDGET_HASH}
      className={[className, WIDGET_CLASS].filter(Boolean).join(" ")}
    >
      {children}
    </button>
  );
}
