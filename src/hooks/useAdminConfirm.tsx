"use client";

import { useCallback, useState } from "react";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { t, type Locale } from "@/i18n/strings";

type ConfirmOptions = {
  message: string;
  confirmLabel?: string;
  title?: string;
};

type Pending = ConfirmOptions & {
  resolve: (value: boolean) => void;
};

export function useAdminConfirm(locale: Locale) {
  const [pending, setPending] = useState<Pending | null>(null);

  const confirm = useCallback(
    (options: ConfirmOptions) =>
      new Promise<boolean>((resolve) => {
        setPending({ ...options, resolve });
      }),
    [],
  );

  const close = useCallback((value: boolean) => {
    setPending((current) => {
      current?.resolve(value);
      return null;
    });
  }, []);

  const dialog = (
    <AdminConfirmDialog
      open={pending != null}
      title={pending?.title ?? t(locale, "admin.confirm.title")}
      message={pending?.message ?? ""}
      cancelLabel={t(locale, "admin.confirm.cancel")}
      confirmLabel={
        pending?.confirmLabel ?? t(locale, "admin.confirm.proceed")
      }
      onConfirm={() => close(true)}
      onCancel={() => close(false)}
    />
  );

  return { confirm, dialog };
}
