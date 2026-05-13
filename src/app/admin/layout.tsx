"use client";

import { AdminGate } from "@/components/admin/AdminGate";
import type { ReactNode } from "react";

/**
 * AdminAuthProvider now lives at the app root (see `AppProviders`) so site chrome can
 * react to the admin session. This layout only enforces the gate.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminGate>{children}</AdminGate>;
}
