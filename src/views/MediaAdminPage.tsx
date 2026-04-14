"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import {
  adminBtnBlue,
  adminBtnGreen,
  adminBtnNeutral,
  adminCalloutSuccess,
} from "@/lib/adminUiStyles";
import { getApiBaseUrl } from "@/lib/apiBase";
import type { MediaAssetDto, PresignMediaPutResponse } from "@/lib/mediaTypes";

type AuthState =
  | { status: "unknown" }
  | { status: "logged_out" }
  | { status: "logged_in" };

export function MediaAdminPage() {
  const apiBase = getApiBaseUrl();

  const [auth, setAuth] = useState<AuthState>({ status: "unknown" });
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [recent, setRecent] = useState<MediaAssetDto[]>([]);

  const canUpload = useMemo(() => auth.status === "logged_in" && file, [auth.status, file]);

  async function refreshRecent() {
    const r = await fetch(`${apiBase}/api/admin/media/recent`, { credentials: "include" });
    if (!r.ok) return;
    setRecent((await r.json()) as MediaAssetDto[]);
  }

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${apiBase}/api/admin/lunch-menu/status`, {
          credentials: "include",
        });
        setAuth({ status: r.ok ? "logged_in" : "logged_out" });
        if (r.ok) {
          await refreshRecent();
        }
      } catch {
        setAuth({ status: "logged_out" });
      }
    })();
  }, [apiBase]);

  async function onLogin() {
    setError(null);
    setMessage(null);
    setBusy(true);
    try {
      const r = await fetch(`${apiBase}/api/auth/login`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      if (!r.ok) {
        setAuth({ status: "logged_out" });
        setError("Invalid credentials.");
        return;
      }
      setAuth({ status: "logged_in" });
      setMessage("Signed in.");
      await refreshRecent();
    } catch {
      setError("Login failed (network error).");
    } finally {
      setBusy(false);
    }
  }

  async function onLogout() {
    setError(null);
    setMessage(null);
    setBusy(true);
    try {
      await fetch(`${apiBase}/api/auth/logout`, { method: "POST", credentials: "include" });
    } finally {
      setAuth({ status: "logged_out" });
      setBusy(false);
    }
  }

  async function onUpload() {
    if (!file) return;
    setError(null);
    setMessage(null);
    setBusy(true);
    try {
      const presignRes = await fetch(`${apiBase}/api/admin/media/presign-put`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type || "application/octet-stream",
          sizeBytes: file.size,
        }),
      });

      if (presignRes.status === 401) {
        setAuth({ status: "logged_out" });
        setError("Not signed in.");
        return;
      }
      if (presignRes.status === 503) {
        setError(
          "R2 is not configured on the server yet. Make sure you restarted the backend after setting R2 env vars.",
        );
        return;
      }
      if (!presignRes.ok) {
        const text = await presignRes.text();
        setError(text || `Presign failed (${presignRes.status}).`);
        return;
      }

      const presign = (await presignRes.json()) as PresignMediaPutResponse;

      const putHeaders = new Headers();
      for (const [k, v] of Object.entries(presign.requiredHeaders ?? {})) {
        putHeaders.set(k, v);
      }

      const putRes = await fetch(presign.uploadUrl, {
        method: "PUT",
        headers: putHeaders,
        body: file,
      });
      if (!putRes.ok) {
        setError(`Upload to R2 failed (${putRes.status}).`);
        return;
      }

      const completeRes = await fetch(`${apiBase}/api/admin/media/complete`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          objectKey: presign.objectKey,
          fileName: file.name,
          contentType: file.type || "application/octet-stream",
          sizeBytes: file.size,
        }),
      });
      if (!completeRes.ok) {
        const text = await completeRes.text();
        setError(text || `Complete failed (${completeRes.status}).`);
        return;
      }

      setMessage("Upload complete.");
      setFile(null);
      await refreshRecent();
    } catch {
      setError("Upload failed (network error).");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageShell
      title="Media uploads"
      intro="Upload files for the site."
    >
      <div className="max-w-3xl space-y-8">
        {error ? (
          <div className="rounded-none border border-red-500/30 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}
        {message ? (
          <div className={adminCalloutSuccess}>{message}</div>
        ) : null}

        <div className="rounded-none border border-slate-300 border-l-4 border-l-violet-600 bg-violet-50/40 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium tracking-[0.18em] text-violet-900 uppercase">Backend</p>
              <p className="mt-1 font-mono text-sm text-violet-950/80 break-all">{apiBase}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/admin/dashboard"
                className={`inline-flex items-center justify-center ${adminBtnNeutral}`}
              >
                Dashboard
              </Link>
              {auth.status === "logged_in" ? (
                <button
                  type="button"
                  className={`inline-flex items-center justify-center ${adminBtnNeutral}`}
                  onClick={onLogout}
                  disabled={busy}
                >
                  Sign out
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {auth.status !== "logged_in" ? (
          <div className="rounded-none border border-slate-300 border-l-4 border-l-sky-600 bg-sky-50/30 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-ink">Username</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  className="mt-2 w-full rounded-none border border-border bg-paper px-3 py-2 text-ink shadow-sm focus:border-ink/35 focus:outline-none focus:ring-1 focus:ring-ink/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink">Password</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  autoComplete="current-password"
                  className="mt-2 w-full rounded-none border border-border bg-paper px-3 py-2 text-ink shadow-sm focus:border-ink/35 focus:outline-none focus:ring-1 focus:ring-ink/20"
                />
              </div>
            </div>
            <div className="mt-5">
              <button type="button" className={`w-full ${adminBtnBlue}`} onClick={onLogin} disabled={busy}>
                Sign in
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-none border border-slate-300 border-l-4 border-l-emerald-600 bg-emerald-50/20 p-6">
              <label className="block text-sm font-medium text-ink">Choose a file</label>
              <input
                type="file"
                accept="image/*,application/pdf"
                className="mt-3 w-full text-sm text-ink"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                disabled={busy}
              />
              <div className="mt-5 space-y-2">
                <button
                  type="button"
                  className={`w-full ${adminBtnGreen}`}
                  onClick={onUpload}
                  disabled={busy || !canUpload}
                >
                  Upload to storage
                </button>
              </div>
              <p className="mt-4 text-sm text-ink-muted leading-relaxed">
                Tip: if uploads succeed but you don’t get a public URL, set{" "}
                <span className="font-mono text-xs">R2__PublicBaseUrl</span> on the server (optional).
              </p>
            </div>

            <div className="rounded-none border border-slate-300 bg-paper p-6">
              <h2 className="font-display text-2xl font-medium text-ink">Recent uploads</h2>
              <ul className="mt-6 space-y-4">
                {recent.length === 0 ? (
                  <li className="text-sm text-ink-muted">No uploads yet.</li>
                ) : (
                  recent.map((a) => (
                    <li key={a.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                      <p className="text-sm font-medium text-ink">{a.originalFileName}</p>
                      <p className="mt-1 font-mono text-xs text-ink-muted break-all">{a.objectKey}</p>
                      {a.publicUrl ? (
                        <a
                          className="mt-2 inline-block text-sm underline-offset-4 hover:underline"
                          href={a.publicUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open public URL
                        </a>
                      ) : (
                        <p className="mt-2 text-xs text-ink-muted">
                          No public URL configured (upload still stored in R2).
                        </p>
                      )}
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
