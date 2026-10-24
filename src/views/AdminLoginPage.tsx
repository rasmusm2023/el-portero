"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { firebaseAuthErrorMessage } from "@/lib/firebase/authErrors";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";
import { adminBtnBlue, adminErrorBox, adminFieldInput } from "@/lib/adminUiStyles";

export function AdminLoginPage() {
  const { locale } = useLocale();
  const router = useRouter();
  const { user, ready, firebaseConfigured, adminReady, isAdmin, signInWithEmailPassword } =
    useAdminAuth();
  const lastLoginAttemptAt = useRef<number>(0);

  const intro = t(locale, "page.admin.intro");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
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
    try {
      lastLoginAttemptAt.current = Date.now();
      await signInWithEmailPassword(email, password);
      router.push("/admin/dashboard");
    } catch (err: unknown) {
      const code =
        err && typeof err === "object" && "code" in err
          ? String((err as { code?: string }).code)
          : undefined;
      setError(firebaseAuthErrorMessage(code));
    } finally {
      setBusy(false);
    }
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
      <form className="max-w-sm space-y-6" onSubmit={onSubmit}>
        <div>
          <label htmlFor="admin-email" className="block text-sm font-medium text-zinc-800">
            {t(locale, "page.admin.email")}
          </label>
          <input
            id="admin-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`mt-2 ${adminFieldInput}`}
          />
        </div>
        <div>
          <label htmlFor="admin-password" className="block text-sm font-medium text-zinc-800">
            {t(locale, "page.admin.password")}
          </label>
          <input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`mt-2 ${adminFieldInput}`}
          />
        </div>
        <button type="submit" className={`w-full ${adminBtnBlue}`} disabled={busy}>
          {t(locale, "page.admin.signIn")}
        </button>
      </form>

      {error ? <div className={`mt-6 max-w-sm ${adminErrorBox}`}>{error}</div> : null}

      <p className="mt-10 text-xs text-zinc-500">
        <Link href="/" className="underline-offset-4 hover:underline">
          ← {t(locale, "page.admin.backToSite")}
        </Link>
      </p>
    </PageShell>
  );
}
