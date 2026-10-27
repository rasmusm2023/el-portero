"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ReactNode } from "react";
import {
  MenuEditorDragHandle,
  MenuEditorExpandButton,
  MenuEditorPanelHeader,
} from "@/components/admin/menu-editor/MenuEditorChrome";
import { itemSortableId } from "@/lib/menuEditorIds";

type Props = {
  ci: number;
  ii: number;
  collapsed: boolean;
  hidden: boolean;
  selected: boolean;
  busy: boolean;
  expandLabel: string;
  collapseLabel: string;
  dragLabel: string;
  contextLabel: string;
  summary: string;
  actions: ReactNode;
  visibilityButton?: ReactNode;
  onToggleCollapse: () => void;
  children: ReactNode;
};

export function SortableMenuItem({
  ci,
  ii,
  collapsed,
  hidden,
  selected,
  busy,
  expandLabel,
  collapseLabel,
  dragLabel,
  contextLabel,
  summary,
  actions,
  visibilityButton,
  onToggleCollapse,
  children,
}: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: itemSortableId(ci, ii),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <article
      ref={setNodeRef}
      id={`menu-item-${itemSortableId(ci, ii)}`}
      style={style}
      className={[
        "rounded-xl border bg-white p-3 shadow-sm transition-[opacity,border-color,background-color] sm:p-4",
        selected
          ? "border-blue-200 shadow-[inset_3px_0_0_0_#2563eb]"
          : hidden
            ? "border-amber-200"
            : "border-slate-200",
        hidden && !isDragging ? "bg-amber-50/60" : "",
        isDragging ? "z-10 opacity-70 ring-2 ring-blue-300" : "",
      ].join(" ")}
      data-menu-hidden={hidden ? "true" : undefined}
    >
      <MenuEditorPanelHeader
        dragHandle={
          <MenuEditorDragHandle
            label={dragLabel}
            disabled={busy}
            attributes={attributes}
            listeners={listeners}
          />
        }
        visibilityButton={visibilityButton}
        expandButton={
          <MenuEditorExpandButton
            expanded={!collapsed}
            expandLabel={expandLabel}
            collapseLabel={collapseLabel}
            disabled={busy}
            onToggle={onToggleCollapse}
          />
        }
        title={
          <button
            type="button"
            className="block w-full cursor-pointer rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            onClick={onToggleCollapse}
          >
            <span className="block truncate text-xs text-slate-500">{contextLabel}</span>
            <span
              className={[
                "mt-0.5 block truncate text-sm font-medium",
                hidden ? "text-slate-500" : "text-slate-900",
              ].join(" ")}
            >
              {summary}
            </span>
          </button>
        }
        actions={actions}
      />
      {!collapsed ? (
        <div className="mt-4 border-t border-slate-200 pt-4">{children}</div>
      ) : null}
    </article>
  );
}
