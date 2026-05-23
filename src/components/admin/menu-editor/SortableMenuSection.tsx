"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ReactNode } from "react";
import {
  MenuEditorDragHandle,
  MenuEditorExpandButton,
  MenuEditorPanelHeader,
} from "@/components/admin/menu-editor/MenuEditorChrome";
import { categorySortableId } from "@/lib/menuEditorIds";

type Props = {
  ci: number;
  collapsed: boolean;
  busy: boolean;
  expandLabel: string;
  collapseLabel: string;
  dragLabel: string;
  meta?: string;
  title: ReactNode;
  actions: ReactNode;
  onToggleCollapse: () => void;
  children: ReactNode;
};

export function SortableMenuSection({
  ci,
  collapsed,
  busy,
  expandLabel,
  collapseLabel,
  dragLabel,
  meta,
  title,
  actions,
  onToggleCollapse,
  children,
}: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: categorySortableId(ci),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <section
      ref={setNodeRef}
      style={style}
      className={[
        "rounded-none border border-paper/12 bg-paper/[0.03] p-4",
        isDragging ? "z-10 opacity-70 ring-2 ring-gold/35" : "",
      ].join(" ")}
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
        expandButton={
          <MenuEditorExpandButton
            expanded={!collapsed}
            expandLabel={expandLabel}
            collapseLabel={collapseLabel}
            disabled={busy}
            onToggle={onToggleCollapse}
          />
        }
        title={title}
        meta={collapsed ? meta : undefined}
        actions={actions}
      />
      {!collapsed ? <div className="mt-4">{children}</div> : null}
    </section>
  );
}
