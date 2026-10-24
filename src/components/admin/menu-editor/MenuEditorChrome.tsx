"use client";

import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { ChevronDown, ChevronRight, Eye, EyeOff, GripVertical } from "lucide-react";
import type { ReactNode } from "react";

const chromeBtnClass =
  "inline-flex shrink-0 items-center justify-center rounded-md border border-zinc-300 bg-white text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50";

export function MenuEditorDragHandle({
  label,
  disabled,
  listeners,
  attributes,
}: {
  label: string;
  disabled?: boolean;
  listeners?: SyntheticListenerMap;
  attributes?: DraggableAttributes;
}) {
  return (
    <button
      type="button"
      className={`${chromeBtnClass} size-9 cursor-grab touch-none active:cursor-grabbing`}
      aria-label={label}
      disabled={disabled}
      {...attributes}
      {...listeners}
    >
      <GripVertical className="size-4" aria-hidden />
    </button>
  );
}

/** Matches drag-handle chrome; icon + short Hide/Show label. */
export function MenuEditorVisibilityButton({
  hidden,
  hideLabel,
  showLabel,
  disabled,
  disabledTitle,
  onToggle,
}: {
  hidden: boolean;
  hideLabel: string;
  showLabel: string;
  disabled?: boolean;
  disabledTitle?: string;
  onToggle: () => void;
}) {
  const label = hidden ? showLabel : hideLabel;
  return (
    <button
      type="button"
      className={[
        chromeBtnClass,
        "h-9 min-w-9 gap-1 px-2 text-[10px] font-semibold leading-none tracking-[0.16em] uppercase",
        hidden
          ? "border-emerald-400 bg-emerald-50 text-emerald-900 hover:border-emerald-500 hover:bg-emerald-100"
          : "text-zinc-600",
      ].join(" ")}
      disabled={disabled}
      title={disabled && disabledTitle ? disabledTitle : label}
      aria-pressed={hidden}
      onClick={onToggle}
    >
      {hidden ? (
        <Eye className="size-3.5 shrink-0" aria-hidden />
      ) : (
        <EyeOff className="size-3.5 shrink-0" aria-hidden />
      )}
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}

export function MenuEditorExpandButton({
  expanded,
  expandLabel,
  collapseLabel,
  disabled,
  onToggle,
}: {
  expanded: boolean;
  expandLabel: string;
  collapseLabel: string;
  disabled?: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className={`${chromeBtnClass} size-9`}
      aria-expanded={expanded}
      aria-label={expanded ? collapseLabel : expandLabel}
      disabled={disabled}
      onClick={onToggle}
    >
      {expanded ? (
        <ChevronDown className="size-4" aria-hidden />
      ) : (
        <ChevronRight className="size-4" aria-hidden />
      )}
    </button>
  );
}

export function MenuEditorPanelHeader({
  dragHandle,
  visibilityButton,
  expandButton,
  title,
  meta,
  actions,
}: {
  dragHandle: ReactNode;
  visibilityButton?: ReactNode;
  expandButton: ReactNode;
  title: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start gap-2 border-b border-zinc-200 pb-3">
      <div className="flex shrink-0 items-center gap-1">
        {dragHandle}
        {visibilityButton}
        {expandButton}
      </div>
      <div className="min-w-0 flex-1">
        {title}
        {meta ? <p className="mt-1 text-xs text-zinc-500">{meta}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
