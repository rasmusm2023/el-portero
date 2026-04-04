"use client";

import type { ReactNode } from "react";

type PageShellProps = {
  title: string;
  intro?: string;
  children: ReactNode;
};

export function PageShell({ title, intro, children }: PageShellProps) {
  return (
    <div className="mx-auto max-w-[var(--container-max)] px-4 py-16 sm:px-6 lg:px-8">
      <header className="mb-12 max-w-2xl">
        <h1 className="font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
          {title}
        </h1>
        {intro ? (
          <p className="mt-4 text-lg text-ink-muted leading-relaxed">{intro}</p>
        ) : null}
      </header>
      {children}
    </div>
  );
}
