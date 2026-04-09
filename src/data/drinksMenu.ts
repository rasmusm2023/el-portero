import type { MenuCategoryData } from "@/data/menuTypes";

/** Imaginary sample list — replace with wine list / admin later. */
export const drinksMenuCategories: MenuCategoryData[] = [
  {
    title: {
      en: "Wine by the glass",
      es: "Vino por copas",
      sv: "Vin på glas",
    },
    items: [
      {
        name: {
          en: "Albariño, Rías Baixas",
          es: "Albariño, Rías Baixas",
          sv: "Albariño, Rías Baixas",
        },
        description: {
          en: "Citrus, mineral, green apple — pairs with fish and seafood.",
          es: "Cítrico, mineral y manzana verde — ideal con pescado y marisco.",
          sv: "Citrus, mineral, grönt äpple — passar fisk och skaldjur.",
        },
        priceEur: 8,
      },
      {
        name: {
          en: "Tempranillo crianza",
          es: "Tempranillo crianza",
          sv: "Tempranillo crianza",
        },
        description: {
          en: "Ribera style — red fruit, spice, soft tannins.",
          es: "Estilo Ribera — fruta roja, especias y taninos suaves.",
          sv: "Ribera-stil — röd frukt, krydda, mjuka tanniner.",
        },
        priceEur: 7.5,
      },
      {
        name: {
          en: "Cava brut nature",
          es: "Cava brut nature",
          sv: "Cava brut nature",
        },
        description: {
          en: "Traditional method, crisp, brioche, fine mousse.",
          es: "Método tradicional, brioche fresco y fina burbuja.",
          sv: "Traditionell metod, krispig, brioche, fin mousse.",
        },
        priceEur: 9,
      },
    ],
  },
  {
    title: {
      en: "Wine (bottles)",
      es: "Vino (botellas)",
      sv: "Vin (flaskor)",
    },
    items: [
      {
        name: {
          en: "Albariño, single estate",
          es: "Albariño, viña única",
          sv: "Albariño, single estate",
        },
        description: {
          en: "Galicia — saline, stone fruit, long finish.",
          es: "Galicia — salino, fruta de hueso y final largo.",
          sv: "Galicien — salinitet, stenfrukt, lång eftersmak.",
        },
        priceEur: 45,
      },
      {
        name: {
          en: "Ribera del Duero reserva",
          es: "Ribera del Duero reserva",
          sv: "Ribera del Duero reserva",
        },
        description: {
          en: "Black cherry, cedar, leather — decant 30 minutes.",
          es: "Cereza negra, cedro y cuero — decantar 30 minutos.",
          sv: "Svart körsbär, ceder, läder — dekantera 30 minuter.",
        },
        priceEur: 52,
      },
      {
        name: {
          en: "Manzanilla, Sanlúcar",
          es: "Manzanilla, Sanlúcar",
          sv: "Manzanilla, Sanlúcar",
        },
        description: {
          en: "Dry sherry, almond, saline — ideal with tapas.",
          es: "Fino seco, almendras y salino — ideal con tapas.",
          sv: "Torr sherry, mandel, sälta — utmärkt till tapas.",
        },
        priceEur: 38,
      },
    ],
  },
  {
    title: {
      en: "Cocktails & aperitifs",
      es: "Cócteles y aperitivos",
      sv: "Cocktails & aperitifs",
    },
    items: [
      {
        name: {
          en: "House vermouth",
          es: "Vermut de casa",
          sv: "Husets vermouth",
        },
        description: {
          en: "Infused vermouth, orange peel, olive, ice.",
          es: "Vermut de maceración, cáscara de naranja y aceituna.",
          sv: "Macererad vermouth, apelsinskal och oliver.",
        },
        priceEur: 6.5,
      },
      {
        name: {
          en: "Gin & tonic",
          es: "Gin tonic",
          sv: "Gin & tonic",
        },
        description: {
          en: "London dry gin, Mediterranean tonic, botanicals.",
          es: "Gin london dry, tónica mediterránea y botánicos.",
          sv: "London dry gin, medelhavstonic, botaniska.",
        },
        priceEur: 8,
      },
      {
        name: {
          en: "Negroni",
          es: "Negroni",
          sv: "Negroni",
        },
        description: {
          en: "Gin, vermouth rosso, Campari, orange twist.",
          es: "Gin, vermut rosso, Campari y twist de naranja.",
          sv: "Gin, vermouth rosso, Campari, apelsin.",
        },
        priceEur: 9,
      },
    ],
  },
  {
    title: {
      en: "Beer & cider",
      es: "Cerveza y sidra",
      sv: "Öl & cider",
    },
    items: [
      {
        name: {
          en: "Local craft draft",
          es: "Cerveza artesanal local",
          sv: "Lokalt fatöl",
        },
        description: {
          en: "Rotating tap — ask for today’s pour.",
          es: "Grifo rotativo — pregunte por el barril del día.",
          sv: "Roterande fat — fråga om dagens fat.",
        },
        priceEur: 4.5,
      },
      {
        name: {
          en: "Asturian cider",
          es: "Sidra asturiana",
          sv: "Asturisk cider",
        },
        description: {
          en: "Dry, lightly sparkling, apple and hay.",
          es: "Seca, ligera burbuja, manzana y heno.",
          sv: "Torr, lätt bubblig, äpple och hö.",
        },
        priceEur: 5,
      },
    ],
  },
  {
    title: {
      en: "Coffee & non-alcoholic",
      es: "Café y sin alcohol",
      sv: "Kaffe & alkoholfritt",
    },
    items: [
      {
        name: {
          en: "Espresso / cortado",
          es: "Espresso / cortado",
          sv: "Espresso / cortado",
        },
        description: {
          en: "Single-origin beans, roasted in Torrevieja.",
          es: "Grano de origen único, tostado en Torrevieja.",
          sv: "Single origin, rostat i Torrevieja.",
        },
        priceEur: 2.5,
      },
      {
        name: {
          en: "Homemade lemonade",
          es: "Limonada casera",
          sv: "Hemgjord lemonad",
        },
        description: {
          en: "Fresh lemons, mint, sparkling water.",
          es: "Limón fresco, menta y agua con gas.",
          sv: "Färsk citron, mynta och kolsyrat vatten.",
        },
        priceEur: 4,
      },
      {
        name: {
          en: "Still / sparkling water",
          es: "Agua mineral / con gas",
          sv: "Stillastående / kolsyrat vatten",
        },
        description: {
          en: "75 cl — local mineral water.",
          es: "75 cl — agua mineral local.",
          sv: "75 cl — lokalt mineralvatten.",
        },
        priceEur: 3,
      },
    ],
  },
];
