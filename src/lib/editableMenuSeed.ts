import type { MenuCategoryData } from "@/data/menuTypes";
import type { EditableMenuDoc } from "@/lib/editableMenuTypes";

/** Builds an editable draft from static localized menu data (admin seed). Uses English copy. */
export function staticCategoriesToEditableDraft(categories: MenuCategoryData[]): EditableMenuDoc {
  return {
    title: "",
    isPublished: false,
    categories: categories.map((cat, ci) => ({
      position: ci,
      title: cat.title.en,
      items: cat.items.map((it, ii) => ({
        position: ii,
        name: it.name.en,
        description: it.description.en,
        price: it.priceEur === 0 ? "" : String(it.priceEur),
        dietaryTagIds: [],
      })),
    })),
  };
}
