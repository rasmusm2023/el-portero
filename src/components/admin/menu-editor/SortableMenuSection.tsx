"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2 } from "lucide-react";
import { MenuEditorDragHandle } from "@/components/admin/menu-editor/MenuEditorChrome";
import { categorySortableId } from "@/lib/menuEditorIds";

export type OutlineItem = {
  ii: number;
  label: string;
  hidden: boolean;
  selected: boolean;
};

type Props = {
  ci: number;
  title: string;
  meta: string;
  selected: boolean;
  hidden: boolean;
  busy: boolean;
  dragLabel: string;
  deleteLabel: string;
  hiddenLabel: string;
  items: OutlineItem[];
  onSelect: () => void;
  onSelectItem: (ii: number) => void;
  onDelete: () => void;
  deleteDisabled?: boolean;
};

export function SortableSectionOutline({
  ci,
  title,
  meta,
  selected,
  hidden,
  busy,
  dragLabel,
  deleteLabel,
  hiddenLabel,
  items,
  onSelect,
  onSelectItem,
  onDelete,
  deleteDisabled,
}: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: categorySortableId(ci),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={[
        "rounded-lg border transition-colors",
        selected
          ? "border-blue-200 bg-blue-50 shadow-[inset_3px_0_0_0_#2563eb]"
          : "border-slate-200 bg-slate-50 hover:border-slate-300",
        isDragging ? "z-10 opacity-70 ring-2 ring-blue-300" : "",
      ].join(" ")}
    >
      <div className="flex items-center gap-1 p-1">
        <MenuEditorDragHandle
          label={dragLabel}
          disabled={busy}
          attributes={attributes}
          listeners={listeners}
        />
        <button
          type="button"
          aria-current={selected ? "true" : undefined}
          className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-md px-1 py-1.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          onClick={onSelect}
        >
          <span
            className={[
              "flex size-9 shrink-0 items-center justify-center rounded-md text-sm font-semibold tabular-nums",
              selected ? "bg-white text-slate-900 shadow-sm" : "bg-slate-100 text-slate-600",
            ].join(" ")}
          >
            {ci + 1}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-slate-900">{title}</span>
            <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
              {hidden ? (
                <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[11px] font-medium text-amber-900">
                  {hiddenLabel}
                </span>
              ) : null}
              <span className="truncate text-xs text-slate-500">{meta}</span>
            </span>
          </span>
        </button>
        <button
          type="button"
          title={deleteLabel}
          aria-label={deleteLabel}
          disabled={busy || deleteDisabled}
          onClick={(e) => {
            e.preventDefault();
            onDelete();
          }}
          className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-white hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Trash2 className="size-3.5" aria-hidden />
        </button>
      </div>
      {selected && items.length > 0 ? (
        <ul className="mr-2 mb-2 ml-12 border-l border-blue-200">
          {items.map((item) => (
            <li key={item.ii}>
              <button
                type="button"
                aria-current={item.selected ? "true" : undefined}
                className={[
                  "flex w-full cursor-pointer items-center gap-2 rounded-r-md py-1.5 pr-2 pl-3 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                  item.selected
                    ? "bg-white font-medium text-slate-900 shadow-sm"
                    : "text-slate-600 hover:bg-white/70 hover:text-slate-900",
                ].join(" ")}
                onClick={() => onSelectItem(item.ii)}
              >
                <span
                  className={[
                    "size-1.5 shrink-0 rounded-full",
                    item.hidden ? "bg-amber-400" : item.selected ? "bg-blue-600" : "bg-slate-300",
                  ].join(" ")}
                  aria-hidden
                />
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}
