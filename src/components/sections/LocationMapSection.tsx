"use client";

import { LocationMap } from "@/components/LocationMap";
import { useLocale } from "@/i18n/useLocale";

export function LocationMapSection() {
  const { locale } = useLocale();

  return (
    <section
      aria-label="Map"
      className="border-t-2 border-ink bg-paper"
    >
      <div className="mx-auto w-full max-w-[var(--container-max)] px-5 py-16 sm:px-10 sm:py-20 lg:px-14 xl:px-20">
        <div className="sr-only" aria-hidden>
          Map
        </div>
        <LocationMap locale={locale} />
      </div>
    </section>
  );
}

