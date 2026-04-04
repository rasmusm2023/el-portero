"use client";

import { PageShell } from "@/components/layout/PageShell";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

export function ContactPage() {
  const { locale } = useLocale();
  const intro =
    locale === "es"
      ? "Envíe un mensaje al equipo. El envío real y anti-spam se conectarán al backend."
      : locale === "sv"
        ? "Skicka ett meddelande till teamet. Sändning och anti-spam kopplas senare."
        : "Write to the team. Submission, spam protection, and email routing will connect to the backend.";

  return (
    <PageShell title={t(locale, "page.contact.title")} intro={intro}>
      <form className="max-w-xl space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-ink">
            {locale === "es" ? "Nombre" : locale === "sv" ? "Namn" : "Name"}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            className="mt-2 w-full rounded-md border border-border bg-paper px-3 py-2 text-ink shadow-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-ink">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className="mt-2 w-full rounded-md border border-border bg-paper px-3 py-2 text-ink shadow-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-ink">
            {locale === "es" ? "Mensaje" : locale === "sv" ? "Meddelande" : "Message"}
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            className="mt-2 w-full rounded-md border border-border bg-paper px-3 py-2 text-ink shadow-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          />
        </div>
        <button
          type="button"
          className="rounded-md bg-ink px-6 py-3 text-sm font-medium tracking-[0.14em] text-paper uppercase transition-colors hover:bg-ink/90"
          disabled
        >
          {locale === "es"
            ? "Enviar (pronto)"
            : locale === "sv"
              ? "Skicka (snart)"
              : "Send (soon)"}
        </button>
      </form>
    </PageShell>
  );
}
