/** Remap collapsed section indices after reordering categories. */
export function remapCollapsedSections(
  collapsed: Set<number>,
  from: number,
  to: number,
): Set<number> {
  if (from === to) return collapsed;
  const next = new Set<number>();
  for (const i of collapsed) {
    let n = i;
    if (i === from) n = to;
    else if (from < to && i > from && i <= to) n = i - 1;
    else if (from > to && i >= to && i < from) n = i + 1;
    next.add(n);
  }
  return next;
}

/** Remap collapsed item keys (`ci-ii`) after reordering items within one category. */
export function remapCollapsedItems(
  collapsed: Set<string>,
  ci: number,
  from: number,
  to: number,
): Set<string> {
  if (from === to) return collapsed;
  const next = new Set<string>();
  for (const key of collapsed) {
    const [c, i] = key.split("-").map(Number);
    if (c !== ci) {
      next.add(key);
      continue;
    }
    let n = i;
    if (i === from) n = to;
    else if (from < to && i > from && i <= to) n = i - 1;
    else if (from > to && i >= to && i < from) n = i + 1;
    next.add(`${ci}-${n}`);
  }
  return next;
}
