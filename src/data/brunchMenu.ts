import type { MenuCategoryData } from "@/data/menuTypes";

/** Sample brunch — replace with CMS later. */
export const brunchMenuCategories: MenuCategoryData[] = [
  {
    title: {
      en: "Brunch",
      es: "Brunch",
      sv: "Brunch",
    },
    items: [
      {
        name: {
          en: "Eggs your way & sourdough",
          es: "Huevos al gusto y pan de masa madre",
          sv: "Ägg efter val och surdegsbröd",
        },
        description: {
          en: "With roasted tomatoes, greens, and house condiments.",
          es: "Con tomates asados, verduras y salsas de la casa.",
          sv: "Med rostade tomater, grönt och husets tillbehör.",
        },
        priceEur: 16,
      },
      {
        name: {
          en: "Smoked salmon & dill crème",
          es: "Salmón ahumado y crème de eneldo",
          sv: "Rökt lax och dillcrème",
        },
        description: {
          en: "Capers, pickled onion, rye crumb.",
          es: "Alcaparras, cebolla encurtida y migas de centeno.",
          sv: "Kapris, inlagd lök och rågströssel.",
        },
        priceEur: 18,
      },
    ],
  },
];
