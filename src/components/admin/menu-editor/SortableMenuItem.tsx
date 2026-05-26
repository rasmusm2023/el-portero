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
  busy: boolean;
  expandLabel: string;
  collapseLabel: string;
  dragLabel: string;
  summary?: string;
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
  busy,
  expandLabel,
  collapseLabel,
  dragLabel,
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
    <div
      ref={setNodeRef}
      style={style}
      className={[
        "rounded-none border bg-paper/5 p-4 transition-[opacity,border-color,background-color]",
        hidden ? "border-amber-500/25 bg-amber-950/10" : "border-paper/10",
        hidden && !isDragging ? "opacity-50" : "",
        isDragging ? "z-10 opacity-70 ring-2 ring-sky-400/30" : "",
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
          collapsed && summary ? (
            <p
              className={[
                "text-sm font-medium",
                hidden ? "text-paper/55" : "text-paper",
              ].join(" ")}
            >
              {summary}
            </p>
          ) : null
        }
        actions={actions}
      />
      {!collapsed ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}
