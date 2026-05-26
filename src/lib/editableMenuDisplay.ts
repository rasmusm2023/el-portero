import type { EditableMenuDoc } from "@/lib/editableMenuTypes";
import type { SimpleMenuCategory } from "@/components/menu/SimpleMenuCategoryGrid";

/** Categories and items visible to guests (respects `hidden` flags). */
export function editableDocToSimpleCategories(doc: EditableMenuDoc): SimpleMenuCategory[] {
  return doc.categories
    .filter((c) => !c.hidden)
    .map((c) => ({
      title: c.title,
      items: c.items
        .filter((it) => !it.hidden)
        .map((it) => ({
          name: it.name,
          nameExtension: it.nameExtension,
          description: it.description,
          price: it.price,
          priceOptions: it.priceOptions,
          dietaryTagIds: it.dietaryTagIds,
          allergenIds: it.allergenIds,
        })),
    }))
    .filter((c) => c.items.length > 0);
}
