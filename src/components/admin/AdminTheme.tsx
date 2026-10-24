"use client";

import { useEffect, type ReactNode } from "react";
import { t } from "@/i18n/strings";
import { useLocale } from "@/i18n/useLocale";

/**
 * Light staff workspace: flips `html[data-theme=admin]` so the public dark venue
 * chrome (header) stays, while the admin canvas below is paper-light.
 */
export function AdminTheme({ children }: { children: ReactNode }) {
  const { locale } = useLocale();

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", "admin");
    return () => {
      root.removeAttribute("data-theme");
    };
  }, []);

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-zinc-100 text-zinc-900">
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto w-full max-w-[min(100%,112rem)] px-4 py-2 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-zinc-500 uppercase">
            {t(locale, "admin.chrome.staff")}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}
