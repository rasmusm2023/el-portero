"use client";

import { PageShell } from "@/components/layout/PageShell";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

export function AdminLoginPage() {
  const { locale } = useLocale();
  const intro =
    locale === "es"
      ? "Acceso restringido para el equipo. Autenticación con Supabase o Firebase en una fase posterior."
      : locale === "sv"
        ? "Begränsad åtkomst. Inloggning via Supabase eller Firebase senare."
        : "Restricted access for staff. Authentication will plug into Supabase or Firebase later.";

  return (
    <PageShell title={t(locale, "page.admin.title")} intro={intro}>
      <form className="max-w-sm space-y-6">
        <div>
          <label htmlFor="admin-email" className="block text-sm font-medium text-ink">
            Email
          </label>
          <input
            id="admin-email"
            name="email"
            type="email"
            autoComplete="username"
            className="mt-2 w-full rounded-none border border-border bg-paper px-3 py-2 text-ink shadow-sm focus:border-ink/35 focus:outline-none focus:ring-1 focus:ring-ink/20"
          />
        </div>
        <div>
          <label htmlFor="admin-password" className="block text-sm font-medium text-ink">
            {locale === "es"
              ? "Contraseña"
              : locale === "sv"
                ? "Lösenord"
                : "Password"}
          </label>
          <input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            className="mt-2 w-full rounded-none border border-border bg-paper px-3 py-2 text-ink shadow-sm focus:border-ink/35 focus:outline-none focus:ring-1 focus:ring-ink/20"
          />
        </div>
        <button
          type="button"
          className="w-full rounded-none border border-paper/15 bg-gold px-6 py-3 text-sm font-medium tracking-[0.14em] text-paper uppercase transition-colors hover:bg-gold-bright"
          disabled
        >
          {locale === "es"
            ? "Entrar (pronto)"
            : locale === "sv"
              ? "Logga in (snart)"
              : "Sign in (soon)"}
        </button>
      </form>
    </PageShell>
  );
}
