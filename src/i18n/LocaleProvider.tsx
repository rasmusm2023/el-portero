"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { LocaleContext, type LocaleContextValue } from "./locale-context";
import type { Locale } from "./strings";

const STORAGE_KEY = "el-portero-locale";

function readStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === "en" || raw === "es" || raw === "sv") return raw;
  return null;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  /** Must match server render — never read `localStorage` in the initial state or SSR and client diverge (React #418). */
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const stored = readStoredLocale();
    if (!stored) return;
    setLocaleState(stored);
    document.documentElement.lang =
      stored === "en" ? "en" : stored === "es" ? "es" : "sv";
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    document.documentElement.lang =
      next === "en" ? "en" : next === "es" ? "es" : "sv";
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale }),
    [locale, setLocale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}
