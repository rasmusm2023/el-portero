import type { EditableMenuDoc } from "@/lib/editableMenuTypes";
import type { SimpleMenuCategory } from "@/components/menu/SimpleMenuCategoryGrid";

export function editableDocToSimpleCategories(doc: EditableMenuDoc): SimpleMenuCategory[] {
  return doc.categories.map((c) => ({
    title: c.title,
    items: c.items.map((it) => ({
      name: it.name,
      nameExtension: it.nameExtension,
      description: it.description,
      price: it.price,
      priceOptions: it.priceOptions,
      dietaryTagIds: it.dietaryTagIds,
      allergenIds: it.allergenIds,
    })),
  }));
}
