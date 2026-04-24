"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";
import { getApiBaseUrl } from "@/lib/apiBase";
import { adminBtnBlue, adminCalloutInfo } from "@/lib/adminUiStyles";

export function AdminLoginPage() {
  const { locale } = useLocale();
  const router = useRouter();
  const apiBase = getApiBaseUrl();

  const intro =
    locale === "es"
      ? "Acceso restringido para el equipo."
      : locale === "sv"
        ? "Begränsad åtkomst."
        : "Restricted access for staff.";

  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const r = await fetch(`${apiBase}/api/auth/login`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      if (!r.ok) {
        setError(
          locale === "es"
            ? "Credenciales inválidas."
            : locale === "sv"
              ? "Ogiltiga inloggningsuppgifter."
              : "Invalid credentials.",
        );
        return;
      }

      router.push("/admin/dashboard");
    } catch (err) {
      const detail =
        err instanceof Error && err.message ? ` (${err.message})` : "";
      setError(
        locale === "es"
          ? `No se pudo conectar con el servidor${detail}. ¿Está el API en marcha y la URL correcta?`
          : locale === "sv"
            ? `Kunde inte nå servern${detail}. Körs API:et och är adressen rätt?`
            : `Could not reach the server${detail}. Is the API running at the URL shown above?`,
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageShell title={t(locale, "page.admin.title")} intro={intro}>
      <div className={`mb-8 max-w-sm space-y-3 text-sm ${adminCalloutInfo}`}>
        <p className="font-mono text-xs break-all text-sky-950">{apiBase}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href="/admin/lunch-menu"
            className="inline-flex rounded-none border border-emerald-300 bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-950 hover:bg-emerald-200"
          >
            Lunch menu
          </Link>
          <Link
            href="/admin/media"
            className="inline-flex rounded-none border border-sky-300 bg-sky-100 px-3 py-1.5 text-xs font-semibold text-sky-950 hover:bg-sky-200"
          >
            Media
          </Link>
          <Link
            href="/admin/events"
            className="inline-flex rounded-none border border-violet-300 bg-violet-100 px-3 py-1.5 text-xs font-semibold text-violet-950 hover:bg-violet-200"
          >
            Events
          </Link>
        </div>
      </div>

      <form className="max-w-sm space-y-6" onSubmit={onSubmit}>
        <div>
          <label htmlFor="admin-username" className="block text-sm font-medium text-ink">
            {locale === "es"
              ? "Usuario"
              : locale === "sv"
                ? "Användarnamn"
                : "Username"}
          </label>
          <input
            id="admin-username"
            name="username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-none border border-border bg-paper px-3 py-2 text-ink shadow-sm focus:border-ink/35 focus:outline-none focus:ring-1 focus:ring-ink/20"
          />
        </div>
        <button type="submit" className={`w-full ${adminBtnBlue}`} disabled={busy}>
          {locale === "es"
            ? "Entrar"
            : locale === "sv"
              ? "Logga in"
              : "Sign in"}
        </button>
      </form>

      {error ? (
        <div className="mt-6 max-w-sm rounded-none border border-red-500/30 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
    </PageShell>
  );
}
