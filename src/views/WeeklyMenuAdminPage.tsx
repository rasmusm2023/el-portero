"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PageShell } from "@/components/layout/PageShell";

export function WeeklyMenuAdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/lunch-menu");
  }, [router]);

  return (
    <PageShell title="Redirecting…" intro="This page moved. Taking you to the new lunch menu editor.">
      <p className="text-sm text-ink-muted">If you are not redirected automatically, open `/admin/lunch-menu`.</p>
    </PageShell>
  );
}

