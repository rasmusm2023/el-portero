"use client";

import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { ChevronDown, ChevronRight, GripVertical } from "lucide-react";
import type { ReactNode } from "react";

const chromeBtnClass =
  "inline-flex shrink-0 items-center justify-center rounded-none border border-paper/15 bg-paper/8 text-paper/80 transition-colors hover:bg-paper/12 hover:text-paper disabled:cursor-not-allowed disabled:opacity-50";

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
  expandButton,
  title,
  meta,
  actions,
}: {
  dragHandle: ReactNode;
  expandButton: ReactNode;
  title: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start gap-2 border-b border-paper/10 pb-3">
      <div className="flex shrink-0 items-center gap-1">
        {dragHandle}
        {expandButton}
      </div>
      <div className="min-w-0 flex-1">
        {title}
        {meta ? <p className="mt-1 text-xs text-paper/55">{meta}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
