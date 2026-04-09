"use client";

import { PageShell } from "@/components/layout/PageShell";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

export function ReservePage() {
  const { locale } = useLocale();
  const intro =
    locale === "es"
      ? "Formulario de reserva con franjas de 15 minutos y mesa por 2 horas — lógica en el siguiente hito."
      : locale === "sv"
        ? "Bokningsformulär med 15-minutersluckor och 2 timmars sittning — logik i nästa steg."
        : "Reservation form with 15-minute slots and a 2-hour seating — wiring to backend next.";

  return (
    <PageShell title={t(locale, "page.reserve.title")} intro={intro}>
      <form className="max-w-xl space-y-6" aria-labelledby="reserve-heading">
        <p id="reserve-heading" className="sr-only">
          {t(locale, "page.reserve.title")}
        </p>
        <div>
          <label htmlFor="guests" className="block text-sm font-medium text-ink">
            {locale === "es"
              ? "Comensales"
              : locale === "sv"
                ? "Gäster"
                : "Guests"}
          </label>
          <input
            id="guests"
            name="guests"
            type="number"
            min={1}
            max={12}
            defaultValue={2}
            className="mt-2 w-full rounded-none border border-border bg-paper px-3 py-2 text-ink shadow-sm focus:border-ink/35 focus:outline-none focus:ring-1 focus:ring-ink/20"
          />
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-ink">
              {locale === "es" ? "Fecha" : locale === "sv" ? "Datum" : "Date"}
            </label>
            <input
              id="date"
              name="date"
              type="date"
              className="mt-2 w-full rounded-none border border-border bg-paper px-3 py-2 text-ink shadow-sm focus:border-ink/35 focus:outline-none focus:ring-1 focus:ring-ink/20"
            />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-ink">
              {locale === "es" ? "Hora" : locale === "sv" ? "Tid" : "Time"}
            </label>
            <select
              id="time"
              name="time"
              className="mt-2 w-full rounded-none border border-border bg-paper px-3 py-2 text-ink shadow-sm focus:border-ink/35 focus:outline-none focus:ring-1 focus:ring-ink/20"
              defaultValue=""
            >
              <option value="" disabled>
                {locale === "es"
                  ? "Elija una franja"
                  : locale === "sv"
                    ? "Välj tid"
                    : "Select a slot"}
              </option>
              <option value="18:00">18:00</option>
              <option value="18:15">18:15</option>
              <option value="18:30">18:30</option>
            </select>
          </div>
        </div>
        <p className="text-xs leading-relaxed text-ink-muted">
          {locale === "es"
            ? "Cancelación con al menos 24 horas de antelación. Política de cancelación tardía comunicada por el restaurante (sin pago en web)."
            : locale === "sv"
              ? "Avbokning minst 24 timmar i förväg. Sen avbokning hanteras en enlighet med restaurangens policy (ingen betalning på webben)."
              : "Cancellations at least 24 hours in advance. Late cancellation terms are handled by the restaurant (no payment on this website)."}
        </p>
        <button
          type="button"
          className="rounded-none bg-ink px-6 py-3 text-sm font-medium tracking-[0.14em] text-paper uppercase transition-colors hover:bg-ink/90"
          disabled
        >
          {locale === "es"
            ? "Enviar (pronto)"
            : locale === "sv"
              ? "Skicka (snart)"
              : "Submit (soon)"}
        </button>
      </form>
    </PageShell>
  );
}
