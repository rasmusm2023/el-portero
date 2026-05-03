"use client";

import { AdminAuthProvider } from "@/components/admin/AdminAuthProvider";
import { AdminGate } from "@/components/admin/AdminGate";
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminGate>{children}</AdminGate>
    </AdminAuthProvider>
  );
}
