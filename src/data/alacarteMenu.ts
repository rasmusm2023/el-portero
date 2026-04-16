import type { MenuCategoryData } from "@/data/menuTypes";

/** Sample à la carte — replace with CMS later. */
export const alacarteMenuCategories: MenuCategoryData[] = [
  {
    title: {
      en: "Chef’s selection",
      es: "Selección del chef",
      sv: "Kockens utvalda",
    },
    items: [
      {
        name: {
          en: "Seasonal tasting sequence",
          es: "Secuencia de temporada",
          sv: "Säsongens avsmakningsmeny",
        },
        description: {
          en: "Five courses — menu evolves with the market.",
          es: "Cinco tiempos — el menú evoluciona con el mercado.",
          sv: "Fem serveringar — menyn följer säsong och utbud.",
        },
        priceEur: 85,
      },
      {
        name: {
          en: "À la carte mains",
          es: "Principales a la carta",
          sv: "Huvudrätter à la carte",
        },
        description: {
          en: "Choose individually — ask service for tonight’s cuts and fish.",
          es: "Elige por platos — consulta cortes y pescado del día.",
          sv: "Välj per rätt — fråga servering om dagens kött och fisk.",
        },
        priceEur: 42,
      },
    ],
  },
];
