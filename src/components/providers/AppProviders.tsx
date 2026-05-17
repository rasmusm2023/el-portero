"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { AdminAuthProvider } from "@/components/admin/AdminAuthProvider";
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

  /**
   * AdminAuthProvider lives at the root so non-admin chrome (site header sign-out,
   * coming-soon override on /menus/*) can react to the admin session. The admin layout
   * no longer needs its own provider — AdminGate just consumes the same context.
   */
  return (
    <LocaleProvider>
      <AdminAuthProvider>{children}</AdminAuthProvider>
    </LocaleProvider>
  );
}
