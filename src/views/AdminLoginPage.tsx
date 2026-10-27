"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { AdminEntryScreen } from "@/components/admin/AdminEntryScreen";
import { PageShell } from "@/components/layout/PageShell";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { DeskNotice, deskField, deskLabel, deskPrimary } from "@/components/admin/events/EventsDesk";
import { firebaseAuthErrorMessage } from "@/lib/firebase/authErrors";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

export function AdminLoginPage() {
  const { locale } = useLocale();
  const router = useRouter();
  const { user, ready, firebaseConfigured, adminReady, isAdmin, signInWithEmailPassword } =
    useAdminAuth();

  const intro = t(locale, "page.admin.intro");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [entered, setEntered] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready || !firebaseConfigured || !adminReady || !user) return;
    if (isAdmin) {
      router.replace("/admin/dashboard");
    }
  }, [ready, firebaseConfigured, adminReady, user, isAdmin, router]);

  // Note: if Firebase remembers a previous session that isn't allowlisted, we still show
  // the sign-in form here (no "access denied" UI, no automatic sign-out).

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!firebaseConfigured) {
      setError("Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* env vars and restart.");
      return;
    }
    setBusy(true);
    let signedIn = false;
    try {
      await signInWithEmailPassword(email, password);
      signedIn = true;
      setEntered(true);
      router.push("/admin/dashboard");
    } catch (err: unknown) {
      const code =
        err && typeof err === "object" && "code" in err
          ? String((err as { code?: string }).code)
          : undefined;
      setError(firebaseAuthErrorMessage(code));
    } finally {
      if (!signedIn) setBusy(false);
    }
  }

  const openingWorkspace =
    (entered && (!user || !adminReady || isAdmin)) || (Boolean(user) && (!adminReady || isAdmin));

  if (openingWorkspace && !error) {
    return <AdminEntryScreen phase="signed-in" email={user?.email ?? email} />;
  }

  if (!firebaseConfigured) {
    return (
      <PageShell tone="admin" title={t(locale, "page.admin.title")} intro={intro}>
        <p className="max-w-xl text-sm text-ink-muted leading-relaxed">
          Add Firebase web config to <code className="font-mono text-xs">.env.local</code> (see{" "}
          <code className="font-mono text-xs">.env.example</code>), then restart{" "}
          <code className="font-mono text-xs">npm run dev</code>.
        </p>
      </PageShell>
    );
  }

  return (
    <PageShell tone="admin" title={t(locale, "page.admin.title")} intro={intro}>
      <form className="max-w-sm space-y-5" onSubmit={onSubmit}>
        <div>
          <label htmlFor="admin-email" className={deskLabel}>
            {t(locale, "page.admin.email")}
          </label>
          <input
            id="admin-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={deskField}
            disabled={busy}
          />
        </div>
        <div>
          <label htmlFor="admin-password" className={deskLabel}>
            {t(locale, "page.admin.password")}
          </label>
          <input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={deskField}
            disabled={busy}
          />
        </div>
        <button type="submit" className={`w-full ${deskPrimary}`} disabled={busy}>
          {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          {t(locale, busy ? "admin.signingIn" : "page.admin.signIn")}
        </button>
      </form>

      {error ? (
        <div className="mt-6 max-w-sm">
          <DeskNotice tone="error">{error}</DeskNotice>
        </div>
      ) : null}

      <p className="mt-10 text-xs text-zinc-500">
        <Link href="/" className="underline-offset-4 hover:underline">
          ← {t(locale, "page.admin.backToSite")}
        </Link>
      </p>
    </PageShell>
  );
}
