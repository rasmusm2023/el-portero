"use client";

import { LogOut } from "lucide-react";
import { useState } from "react";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { adminBtnSignOut } from "@/lib/adminUiStyles";

type Variant = "desktop" | "mobile";

type Props = {
  variant: Variant;
  /** Called after a successful sign-out — mobile overlay uses this to close itself. */
  onAfterSignOut?: () => void;
  className?: string;
};

/**
 * Renders nothing for visitors and signed-in non-admins; only approved admins see it.
 * Lives in `SiteHeader` so admins can sign out without navigating to `/admin/*`.
 */
export function HeaderAdminSignOut({ variant, onAfterSignOut, className }: Props) {
  const { adminReady, isAdmin, signOutUser } = useAdminAuth();
  const [busy, setBusy] = useState(false);

  if (!adminReady || !isAdmin) return null;

  const onClick = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await signOutUser();
      onAfterSignOut?.();
    } catch (err) {
      console.error("[admin] sign out failed:", err);
    } finally {
      setBusy(false);
    }
  };

  if (variant === "desktop") {
    const compactClass = [
      "inline-flex h-10 shrink-0 items-center gap-1.5 rounded-md",
      "border border-red-300/15 bg-red-950/25 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-100 shadow-sm",
      "transition-colors hover:bg-red-950/40",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    ]
      .filter(Boolean)
      .join(" ");
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={busy}
        className={compactClass}
        aria-label="Sign out of admin"
      >
        <LogOut className="size-4" aria-hidden />
        <span>Sign out</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className={["w-full", adminBtnSignOut, className].filter(Boolean).join(" ")}
    >
      <span className="inline-flex items-center justify-center gap-2">
        <LogOut className="size-4" aria-hidden />
        Sign out
      </span>
    </button>
  );
}
