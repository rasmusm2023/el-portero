"use client";

import { AdminGate } from "@/components/admin/AdminGate";
import { AdminTheme } from "@/components/admin/AdminTheme";
import type { ReactNode } from "react";

/**
 * AdminAuthProvider now lives at the app root (see `AppProviders`) so site chrome can
 * react to the admin session. This layout paints the light staff workspace and the gate.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminTheme>
      <AdminGate>{children}</AdminGate>
    </AdminTheme>
  );
}
