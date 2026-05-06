"use client";

import Link from "next/link";
import { useEffect } from "react";
import { unknownErrorMessage } from "@/lib/unknownErrorMessage";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app/error]", error);
  }, [error]);

  const message = unknownErrorMessage(error, error.message);

  return (
    <div className="mx-auto flex min-h-[min(70vh,calc(100dvh-var(--header-h)-4rem))] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="font-hero-title text-2xl tracking-[0.12em] text-paper uppercase">
        Something went wrong
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-ink-muted">{message}</p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg border border-paper/20 bg-paper-dark px-6 py-2.5 text-sm font-semibold text-paper shadow-[0_8px_28px_-12px_rgba(0,0,0,0.45)] transition-colors hover:bg-paper-dark/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold/50"
        >
          Try again
        </button>
        <Link
          href="/"
          className="text-sm font-semibold tracking-[0.14em] text-gold-bright uppercase underline-offset-4 transition-colors hover:text-gold"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
