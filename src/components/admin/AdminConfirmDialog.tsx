"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { adminBtnDanger, adminBtnNeutral } from "@/lib/adminUiStyles";

type Props = {
  open: boolean;
  title: string;
  message: string;
  cancelLabel: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function AdminConfirmDialog({
  open,
  title,
  message,
  cancelLabel,
  confirmLabel,
  onConfirm,
  onCancel,
}: Props) {
  const titleId = useId();
  const descId = useId();
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    confirmRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onCancel]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
        aria-label={cancelLabel}
        onClick={onCancel}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative w-full max-w-md border-2 border-red-400/45 bg-gradient-to-b from-red-950 to-[#1a0a0c] p-6 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.75),0_0_0_1px_rgba(248,113,113,0.15)] ring-4 ring-red-600/25 sm:p-8"
      >
        <div className="flex gap-4">
          <div
            className="flex size-12 shrink-0 items-center justify-center rounded-full border border-red-400/35 bg-red-600/25 text-red-200"
            aria-hidden
          >
            <AlertTriangle className="size-7 stroke-[2px]" />
          </div>
          <div className="min-w-0 flex-1">
            <h2
              id={titleId}
              className="font-display text-xl font-semibold tracking-tight text-red-50 sm:text-2xl"
            >
              {title}
            </h2>
            <p
              id={descId}
              className="mt-3 text-sm leading-relaxed text-red-100/90 whitespace-pre-line"
            >
              {message}
            </p>
          </div>
        </div>
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" className={`w-full sm:w-auto ${adminBtnNeutral}`} onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            className={`w-full sm:w-auto ${adminBtnDanger}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
