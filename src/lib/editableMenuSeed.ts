import type { MenuCategoryData } from "@/data/menuTypes";
import type { EditableMenuDoc } from "@/lib/editableMenuTypes";

/** Builds an editable draft from static localized menu data (admin seed). Uses English copy. */
export function staticCategoriesToEditableDraft(categories: MenuCategoryData[]): EditableMenuDoc {
  return {
    title: "",
    isPublished: false,
    categories: categories.map((cat, ci) => ({
      position: ci,
      hidden: false,
      title: cat.title.en,
      items: cat.items.map((it, ii) => ({
        position: ii,
        hidden: false,
        name: it.name.en,
        nameExtension: "",
        description: it.description.en,
        price: it.priceEur === 0 ? "" : String(it.priceEur),
        priceOptions: [],
        dietaryTagIds: [],
        allergenIds: [],
      })),
    })),
  };
}
