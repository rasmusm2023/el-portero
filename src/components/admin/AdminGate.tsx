"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { getFirebaseWebConfig } from "@/lib/firebase/client";

/**
 * `/admin` = public login route. All other `/admin/*` require Firebase user.
 */
export function AdminGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, ready, firebaseConfigured, adminReady, isAdmin, adminError } = useAdminAuth();

  const isLoginRoute = pathname === "/admin";

  useEffect(() => {
    if (!firebaseConfigured || !ready || isLoginRoute) return;
    if (!user) {
      router.replace("/admin");
      return;
    }
  }, [firebaseConfigured, ready, user, isLoginRoute, router]);

  if (!firebaseConfigured) {
    return (
      <PageShell title="Admin" intro="Firebase is not configured for this build.">
        <p className="max-w-xl text-sm text-ink-muted leading-relaxed">
          Add the <code className="font-mono text-xs">NEXT_PUBLIC_FIREBASE_*</code> variables from your
          Firebase project (see <code className="font-mono text-xs">.env.example</code>), restart the dev
          server, and reload.
        </p>
      </PageShell>
    );
  }

  if (!ready || !adminReady) {
    return (
      <PageShell title="Admin" intro="Loading…">
        <p className="text-sm text-ink-muted">Checking sign-in…</p>
      </PageShell>
    );
  }

  if (!isLoginRoute && !user) {
    const cfg = getFirebaseWebConfig();
    return (
      <PageShell title="Admin" intro="Redirecting…">
        <p className="text-sm text-ink-muted">
          Taking you to sign-in.
        </p>
        <div className="mt-4 max-w-xl rounded-none border border-border bg-paper px-4 py-3 text-xs text-ink-muted">
          <p>
            <span className="font-semibold text-ink">Project:</span>{" "}
            <span className="font-mono break-all">{cfg?.projectId ?? "unknown"}</span>
          </p>
        </div>
      </PageShell>
    );
  }

  if (!isLoginRoute && user && !isAdmin) {
    const cfg = getFirebaseWebConfig();
    return (
      <PageShell title="Admin" intro="Access denied">
        <p className="text-sm text-ink-muted">
          This account is signed in, but it is not approved for admin access yet.
        </p>
        <div className="mt-4 max-w-xl rounded-none border border-amber-500/25 bg-amber-50 px-4 py-3 text-xs text-amber-950">
          <p>
            <span className="font-semibold">UID:</span>{" "}
            <span className="font-mono break-all">{user.uid}</span>
          </p>
          <p className="mt-1">
            <span className="font-semibold">Expected allowlist doc:</span>{" "}
            <span className="font-mono break-all">admins/{user.uid}</span>
          </p>
          <p className="mt-1">
            <span className="font-semibold">Project:</span>{" "}
            <span className="font-mono break-all">{cfg?.projectId ?? "unknown"}</span>
          </p>
          {adminError ? (
            <p className="mt-2">
              <span className="font-semibold">Admin check error:</span>{" "}
              <span className="font-mono break-all">{adminError}</span>
            </p>
          ) : null}
        </div>
        <p className="mt-6 text-xs text-ink-muted">
          If you believe you should have access, add the allowlist document in Firestore, then refresh.
        </p>
      </PageShell>
    );
  }

  return <>{children}</>;
}
