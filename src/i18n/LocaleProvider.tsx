"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type TransitionEvent,
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

function persistLocale(next: Locale) {
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* ignore */
  }
  document.documentElement.lang =
    next === "en" ? "en" : next === "es" ? "es" : "sv";
}

type FadePhase = "idle" | "exiting" | "entering";

export function LocaleProvider({ children }: { children: ReactNode }) {
  /** Must match server render — never read `localStorage` in the initial state or SSR and client diverge (React #418). */
  const [locale, setLocaleState] = useState<Locale>("en");
  const [uiOpacity, setUiOpacity] = useState(1);
  const [blockPointer, setBlockPointer] = useState(false);

  const localeRef = useRef(locale);
  useEffect(() => {
    localeRef.current = locale;
  }, [locale]);

  const phaseRef = useRef<FadePhase>("idle");
  const pendingRef = useRef<Locale | null>(null);

  useEffect(() => {
    const stored = readStoredLocale();
    if (!stored) return;
    setLocaleState(stored);
    document.documentElement.lang =
      stored === "en" ? "en" : stored === "es" ? "es" : "sv";
  }, []);

  const setLocale = useCallback((next: Locale) => {
    if (next === localeRef.current) return;
    if (phaseRef.current !== "idle") return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      setLocaleState(next);
      persistLocale(next);
      return;
    }

    pendingRef.current = next;
    phaseRef.current = "exiting";
    setBlockPointer(true);
    setUiOpacity(0);
  }, []);

  const handleShellTransitionEnd = useCallback((e: TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== "opacity") return;
    if (e.target !== e.currentTarget) return;

    if (phaseRef.current === "exiting") {
      const next = pendingRef.current;
      if (!next) return;
      pendingRef.current = null;
      setLocaleState(next);
      persistLocale(next);
      phaseRef.current = "entering";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setUiOpacity(1));
      });
      return;
    }

    if (phaseRef.current === "entering") {
      phaseRef.current = "idle";
      setBlockPointer(false);
    }
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale }),
    [locale, setLocale],
  );

  return (
    <LocaleContext.Provider value={value}>
      <div
        className={`transition-opacity duration-700 ease-in-out motion-reduce:transition-none ${
          blockPointer ? "pointer-events-none" : ""
        }`}
        style={{ opacity: uiOpacity }}
        onTransitionEnd={handleShellTransitionEnd}
        aria-busy={blockPointer}
      >
        {children}
      </div>
    </LocaleContext.Provider>
  );
}
