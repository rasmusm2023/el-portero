import type { MenuCategoryData } from "@/data/menuTypes";

/** Imaginary sample menu — replace with CMS / admin later. */
export const foodMenuCategories: MenuCategoryData[] = [
  {
    title: {
      en: "Starters",
      es: "Para empezar",
      sv: "Förrätter",
    },
    items: [
      {
        name: {
          en: "Jamón ibérico de bellota",
          es: "Jamón ibérico de bellota",
          sv: "Jamón ibérico de bellota",
        },
        description: {
          en: "Hand-carved acorn-fed ham, manchego, arbequina olive oil, picos.",
          es: "Jamón cortado a mano, manchego, aceite de arbequina y picos.",
          sv: "Skuren för hand, manchego, arbequinaolja och picos.",
        },
        priceEur: 24,
      },
      {
        name: {
          en: "Boquerones en vinagre",
          es: "Boquerones en vinagre",
          sv: "Marinerade sardeller",
        },
        description: {
          en: "White anchovies, sherry vinegar, caper berries, parsley oil.",
          es: "Boquerones, vinagre de Jerez, alcaparras y aceite de perejil.",
          sv: "Sardeller, sherryvinäger, kaprisbär och persiljeolja.",
        },
        priceEur: 12,
      },
      {
        name: {
          en: "Burrata & heritage tomatoes",
          es: "Burrata y tomate de huerta",
          sv: "Burrata & tomat",
        },
        description: {
          en: "Creamy burrata, basil, aged balsamic, toasted sourdough.",
          es: "Burrata cremosa, albahaca, balsámico añejo y pan de masa madre.",
          sv: "Burrata, basilika, balsamico och rostat surdegsbröd.",
        },
        priceEur: 14,
      },
      {
        name: {
          en: "Chilled gazpacho",
          es: "Gazpacho andaluz",
          sv: "Kall gazpacho",
        },
        description: {
          en: "Andalusian tomato soup, cucumber, green pepper, olive oil.",
          es: "Gazpacho andaluz con pepino, pimiento verde y aceite de oliva.",
          sv: "Tomatsoppa med gurka, paprika och olivolja.",
        },
        priceEur: 9,
      },
    ],
  },
  {
    title: {
      en: "Tapas",
      es: "Tapas",
      sv: "Tapas",
    },
    items: [
      {
        name: {
          en: "Patatas bravas",
          es: "Patatas bravas",
          sv: "Patatas bravas",
        },
        description: {
          en: "Crispy potatoes, brava sauce, alioli.",
          es: "Patatas crujientes, salsa brava y alioli.",
          sv: "Potatis, bravasås och alioli.",
        },
        priceEur: 8.5,
      },
      {
        name: {
          en: "Pulpo a la gallega",
          es: "Pulpo a la gallega",
          sv: "Galicisk bläckfisk",
        },
        description: {
          en: "Galician octopus, paprika, rock salt, olive oil.",
          es: "Pulpo gallego, pimentón, sal gorda y aceite de oliva.",
          sv: "Bläckfisk, paprika, havssalt och olivolja.",
        },
        priceEur: 16,
      },
      {
        name: {
          en: "Jamón croquetas",
          es: "Croquetas de jamón",
          sv: "Skinkcroquetter",
        },
        description: {
          en: "Creamy béchamel, ibérico ham, panko.",
          es: "Bechamel cremosa, jamón ibérico y panko.",
          sv: "Béchamel, ibéricoskinka och panko.",
        },
        priceEur: 11,
      },
      {
        name: {
          en: "Gambas al ajillo",
          es: "Gambas al ajillo",
          sv: "Vitlöksräkor",
        },
        description: {
          en: "Wild prawns, garlic, guindilla, fino sherry.",
          es: "Gambas, ajo, guindilla y fino.",
          sv: "Räkor, vitlök, chili och fino.",
        },
        priceEur: 14.5,
      },
    ],
  },
  {
    title: {
      en: "Mains",
      es: "Principales",
      sv: "Huvudrätter",
    },
    items: [
      {
        name: {
          en: "Salt-baked sea bass",
          es: "Lubina a la sal",
          sv: "Saltbakad havsabborre",
        },
        description: {
          en: "Whole fish, roasted fennel, lemon, salmoriglio.",
          es: "Lubina entera, hinojo asado, limón y salmoriglio.",
          sv: "Hel fisk, rostad fänkål, citron och salmoriglio.",
        },
        priceEur: 28,
      },
      {
        name: {
          en: "Grilled ribeye",
          es: "Chuletón de vaca vieja",
          sv: "Grillad entrecôte",
        },
        description: {
          en: "Dry-aged ribeye, embered potato, red wine jus, chimichurri.",
          es: "Chuletón madurado, patata al carbón, jus de vino tinto y chimichurri.",
          sv: "Mörnad entrecôte, kolgrillad potatis, rödvinsås och chimichurri.",
        },
        priceEur: 32,
      },
      {
        name: {
          en: "Arroz negro",
          es: "Arroz negro",
          sv: "Svart risotto",
        },
        description: {
          en: "Squid ink rice, aioli, lemon, parsley.",
          es: "Arroz con tinta de calamar, alioli, limón y perejil.",
          sv: "Bläckfiskris, aioli, citron och persilja.",
        },
        priceEur: 26,
      },
      {
        name: {
          en: "Slow-roasted lamb shoulder",
          es: "Cordero asado lento",
          sv: "Långbakad lammstek",
        },
        description: {
          en: "Herb-rubbed lamb, rosemary jus, roasted roots.",
          es: "Cordero con hierbas, jus de romero y tubérculos asados.",
          sv: "Lamm med örter, rosmarinsås och rostade rotfrukter.",
        },
        priceEur: 34,
      },
    ],
  },
  {
    title: {
      en: "Desserts",
      es: "Postres",
      sv: "Efterrätter",
    },
    items: [
      {
        name: {
          en: "Basque cheesecake",
          es: "Tarta de queso vasca",
          sv: "Baskisk cheesecake",
        },
        description: {
          en: "Burnt caramel top, seasonal compote.",
          es: "Tarta de queso vasca con compota de temporada.",
          sv: "Baskisk cheesecake med säsongscompote.",
        },
        priceEur: 9,
      },
      {
        name: {
          en: "Crema catalana",
          es: "Crema catalana",
          sv: "Crema catalana",
        },
        description: {
          en: "Vanilla custard, citrus zest, caramelised sugar.",
          es: "Crema de vainilla, ralladura de cítricos y azúcar caramelizado.",
          sv: "Vaniljkräm, citruszest och karamelliserat socker.",
        },
        priceEur: 8,
      },
      {
        name: {
          en: "Churros & chocolate",
          es: "Churros con chocolate",
          sv: "Churros & choklad",
        },
        description: {
          en: "Crispy churros, thick chocolate, cinnamon sugar.",
          es: "Churros crujientes, chocolate espeso y azúcar con canela.",
          sv: "Churros, tjock choklad och kanel socker.",
        },
        priceEur: 8.5,
      },
    ],
  },
];
