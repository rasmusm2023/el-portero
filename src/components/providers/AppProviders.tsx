"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { LocaleProvider } from "@/i18n/LocaleProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    const onUnhandledRejection = (ev: PromiseRejectionEvent) => {
      const r = ev.reason;
      if (typeof Event !== "undefined" && r instanceof Event) {
        ev.preventDefault();
        console.warn("[app] Ignored promise rejection carrying a DOM Event:", r.type);
      }
    };
    window.addEventListener("unhandledrejection", onUnhandledRejection);
    return () => window.removeEventListener("unhandledrejection", onUnhandledRejection);
  }, []);

  return <LocaleProvider>{children}</LocaleProvider>;
}
