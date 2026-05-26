import type { EditableMenuDoc } from "@/lib/editableMenuTypes";

/** Menu JSON for persistence / full draft comparison (includes `hidden` flags). */
export function menuDraftSnapshot(doc: EditableMenuDoc, isPublished: boolean): string {
  return JSON.stringify({
    title: doc.title ?? "",
    isPublished: Boolean(isPublished),
    categories: (doc.categories ?? []).map((c) => ({
      position: c.position,
      hidden: Boolean(c.hidden),
      title: c.title ?? "",
      items: (c.items ?? []).map((it) => ({
        position: it.position,
        hidden: Boolean(it.hidden),
        name: it.name ?? "",
        nameExtension: it.nameExtension ?? "",
        description: it.description ?? "",
        price: it.price ?? "",
        priceOptions: it.priceOptions ?? [],
        dietaryTagIds: it.dietaryTagIds ?? [],
        allergenIds: it.allergenIds ?? [],
      })),
    })),
  });
}

/**
 * Same as {@link menuDraftSnapshot} but ignores hide/show flags — used to gate
 * visibility controls only when names, prices, structure, etc. are unsaved.
 */
export function menuContentSnapshot(doc: EditableMenuDoc, isPublished: boolean): string {
  return menuDraftSnapshot(
    {
      ...doc,
      categories: doc.categories.map((c) => ({
        ...c,
        hidden: false,
        items: c.items.map((it) => ({ ...it, hidden: false })),
      })),
    },
    isPublished,
  );
}
