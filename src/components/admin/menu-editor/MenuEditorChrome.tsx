"use client";

import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { ChevronDown, ChevronRight, Eye, EyeOff, GripVertical } from "lucide-react";
import type { ReactNode } from "react";

const chromeBtnClass =
  "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md border border-slate-300 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50";

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
      className={`${chromeBtnClass} size-8 cursor-grab touch-none active:cursor-grabbing`}
      aria-label={label}
      disabled={disabled}
      {...attributes}
      {...listeners}
    >
      <GripVertical className="size-3.5" aria-hidden />
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
        "h-8 gap-1.5 px-2.5 text-xs font-medium",
        hidden
          ? "border-amber-300 bg-amber-50 text-amber-900 hover:border-amber-400 hover:bg-amber-100"
          : "text-slate-600",
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
      className={`${chromeBtnClass} size-8`}
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
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex shrink-0 items-center gap-1">
        {dragHandle}
        {expandButton}
      </div>
      <div className="min-w-0 flex-1">
        {title}
        {meta ? <p className="mt-0.5 truncate text-xs text-slate-500">{meta}</p> : null}
      </div>
      {visibilityButton}
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
