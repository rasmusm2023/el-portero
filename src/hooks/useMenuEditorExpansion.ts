"use client";

import { useCallback, useEffect, useState } from "react";
import { remapCollapsedItems, remapCollapsedSections } from "@/lib/menuEditorCollapse";

function itemKey(ci: number, ii: number): string {
  return `${ci}-${ii}`;
}

function remapExpandedItemsAfterCategoryMove(
  expanded: Set<string>,
  from: number,
  to: number,
): Set<string> {
  if (from === to) return expanded;
  const next = new Set<string>();
  for (const key of expanded) {
    const [c, i] = key.split("-").map(Number);
    let nc = c;
    if (c === from) nc = to;
    else if (from < to && c > from && c <= to) nc = c - 1;
    else if (from > to && c >= to && c < from) nc = c + 1;
    next.add(`${nc}-${i}`);
  }
  return next;
}

export function useMenuEditorExpansion(tabKey: string) {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(() => new Set());
  const [expandedItems, setExpandedItems] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    setExpandedSections(new Set());
    setExpandedItems(new Set());
  }, [tabKey]);

  const isSectionCollapsed = useCallback(
    (ci: number) => !expandedSections.has(ci),
    [expandedSections],
  );

  const isItemCollapsed = useCallback(
    (ci: number, ii: number) => !expandedItems.has(itemKey(ci, ii)),
    [expandedItems],
  );

  const toggleSection = useCallback((ci: number) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(ci)) next.delete(ci);
      else next.add(ci);
      return next;
    });
  }, []);

  const toggleItem = useCallback((ci: number, ii: number) => {
    const key = itemKey(ci, ii);
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const onCategoriesReordered = useCallback((from: number, to: number) => {
    setExpandedSections((prev) => remapCollapsedSections(prev, from, to));
    setExpandedItems((prev) => remapExpandedItemsAfterCategoryMove(prev, from, to));
  }, []);

  const onItemsReordered = useCallback((ci: number, from: number, to: number) => {
    setExpandedItems((prev) => remapCollapsedItems(prev, ci, from, to));
  }, []);

  const expandItem = useCallback((ci: number, ii: number) => {
    const key = itemKey(ci, ii);
    setExpandedItems((prev) => {
      if (prev.has(key)) return prev;
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  }, []);

  return {
    isSectionCollapsed,
    isItemCollapsed,
    toggleSection,
    toggleItem,
    onCategoriesReordered,
    onItemsReordered,
    expandItem,
  };
}
