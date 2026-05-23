export function categorySortableId(ci: number): string {
  return `cat-${ci}`;
}

export function itemSortableId(ci: number, ii: number): string {
  return `item-${ci}-${ii}`;
}

export function parseCategorySortableId(id: string): number | null {
  const m = /^cat-(\d+)$/.exec(id);
  return m ? Number(m[1]) : null;
}

export function parseItemSortableId(id: string): { ci: number; ii: number } | null {
  const m = /^item-(\d+)-(\d+)$/.exec(id);
  if (!m) return null;
  return { ci: Number(m[1]), ii: Number(m[2]) };
}
