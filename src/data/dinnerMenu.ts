import type { MenuCategoryData } from "@/data/menuTypes";

/** Sample dinner menu — replace with CMS later. Meat sourcing and ageing called out explicitly. */
export const dinnerMenuCategories: MenuCategoryData[] = [
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
          en: "Seven moments — two meat-led courses feature dry-aged beef and Ibérico in smaller formats; menu follows the market.",
          es: "Siete momentos — dos pasos centrados en carne con vacuno madurado y cerdo ibérico en formato reducido; el menú sigue el mercado.",
          sv: "Sju moment — två köttfokuserade serveringar med torkmognad nöt och iberico i mindre format; menyn följer marknaden.",
        },
        priceEur: 98,
      },
      {
        name: {
          en: "Dinner mains",
          es: "Principales de cena",
          sv: "Huvudrätter till middag",
        },
        description: {
          en: "Choose individually — your server will walk through tonight’s beef ageing, Ibérico cuts, and whole fish.",
          es: "Elige por platos — el equipo explica el madurado del vacuno, los cortes ibéricos y el pescado entero del día.",
          sv: "Välj per rätt — serveringen går igenom kvällens nötmognad, ibericoinsnitt och hel fisk.",
        },
        priceEur: 46,
      },
    ],
  },
  {
    title: {
      en: "To begin",
      es: "Para empezar",
      sv: "Till att börja med",
    },
    items: [
      {
        name: {
          en: "Hand-cut beef tartare",
          es: "Steak tartar cortado a cuchillo",
          sv: "Handskuren oxfilétartar",
        },
        description: {
          en: "Rubia Gallega trimmings from our ageing room, cornichon, capers, quail egg, sourdough — mustard on the side.",
          es: "Recorte de Rubia Gallega de nuestra cámara de maduración, pepinillo, alcaparras, huevo de codorniz, masa madre — mostaza aparte.",
          sv: "Trimmning av Rubia Gallega från vårt mogningsrum, cornichon, kapris, vaktelägg, surdeg — senap vid sidan.",
        },
        priceEur: 24,
      },
      {
        name: {
          en: "Jamón Ibérico de bellota",
          es: "Jamón Ibérico de bellota",
          sv: "Jamón Ibérico de bellota",
        },
        description: {
          en: "Hand-sliced D.O. Jabugo–style shoulder cut, 36+ months — picos and arbequina oil.",
          es: "Loncheado a mano, paletilla estilo Jabugo D.O., más de 36 meses — picos y aceite de arbequina.",
          sv: "Handskivat, Jabugo-liknande palett, 36+ månader — picos och arbequinaolja.",
        },
        priceEur: 28,
      },
      {
        name: {
          en: "Veal sweetbreads, grilled",
          es: "Mollejas de ternera lechal a la parrilla",
          sv: "Grillade kalvsötsbröd",
        },
        description: {
          en: "Milk-fed Pyrenean veal, blanched and finished over vine embers — lemon, caper brown butter.",
          es: "Ternera lechal de los Pirineos, escaldada y acabada en brasa de sarmiento — limón y mantequilla tostada con alcaparras.",
          sv: "Mjölkkalv från Pyrenéerna, blancherad och klar på ved — citron och kapriskaramelliserat smör.",
        },
        priceEur: 26,
      },
      {
        name: {
          en: "Duck liver terrine",
          es: "Terrina de foie y magret curado",
          sv: "Ankleverterrin",
        },
        description: {
          en: "Rouennaise-style terrine with cured magret trim, sour cherry mostarda, toasted brioche.",
          es: "Terrina estilo rouennais con recorte de magret curado, mostarda de guindas, brioche tostada.",
          sv: "Terrin i rouennestil med magrettrimm, surkörsbärsmostarda, rostad brioche.",
        },
        priceEur: 22,
      },
    ],
  },
  {
    title: {
      en: "Fish & shellfish",
      es: "Pescado y marisco",
      sv: "Fisk och skaldjur",
    },
    items: [
      {
        name: {
          en: "Wild sea bass en papillote",
          es: "Lubina salvaje en papillote",
          sv: "Vild havsabborre en papillote",
        },
        description: {
          en: "Line-caught Atlantic, fennel pollen, Padrón peppers, fino reduction.",
          es: "Línea del Atlántico, polen de hinojo, pimientos de Padrón, reducción de fino.",
          sv: "Havsfångad från Atlanten, fänkålspollen, Padrónpeppar, finoreduktion.",
        },
        priceEur: 38,
      },
      {
        name: {
          en: "Red prawns, plancha",
          es: "Carabineros a la plancha",
          sv: "Röda räkor, plancha",
        },
        description: {
          en: "Huelva deep-water carabineros — head butter for the bread, sea salt, lemon.",
          es: "Carabineros de Huelva — mantequilla de la cabeza para el pan, sal marina, limón.",
          sv: "Djuphavsräkor från Huelva — huvudsmör till brödet, havssalt, citron.",
        },
        priceEur: 34,
      },
      {
        name: {
          en: "Salt-baked turbot for two",
          es: "Rodaballo a la sal (para dos)",
          sv: "Saltbakad piggvar för två",
        },
        description: {
          en: "Whole North Atlantic turbot, herb salt crust, pil-pil on the side — please order in advance.",
          es: "Rodaballo entero del Atlántico Norte, costra de sal con hierbas, pil-pil aparte — pedir con antelación.",
          sv: "Hel nordatlantisk piggvar, örtsaltstjärta, pil-pil vid sidan — beställ gärna i förväg.",
        },
        priceEur: 96,
      },
    ],
  },
  {
    title: {
      en: "Beef — dry-aged in house",
      es: "Vacuno — madurado en seco en casa",
      sv: "Nöt — torkmognad på plats",
    },
    items: [
      {
        name: {
          en: "Chuletón — bone-in rib, Rubia Gallega",
          es: "Chuletón de Rubia Gallega con hueso",
          sv: "Chuletón på ben — Rubia Gallega",
        },
        description: {
          en: "Minimum 45 days dry-age on the bone, grass-fed Galician cattle — carved for two, roasted potato, chimichurri.",
          es: "Mínimo 45 días de maduración en seco con hueso, vacuno gallego de pasto — cortado para dos, patata asada, chimichurri.",
          sv: "Minst 45 dagars torkmognad på ben, betad galicisk nöt — skuren för två, rostad potatis, chimichurri.",
        },
        priceEur: 118,
      },
      {
        name: {
          en: "Entrecôte — Simmental x Charolais",
          es: "Entrecôte — Simmental x Charolais",
          sv: "Entrecôte — Simmental x Charolais",
        },
        description: {
          en: "35-day dry-aged entrecôte, French-trimmed — Café de Paris butter, frites, watercress.",
          es: "Entrecôte madurada 35 días en seco, limpieza francesa — mantequilla Café de Paris, frites, berros.",
          sv: "35 dagars torkmognad entrecôte, fransk trim — Café de Paris-smör, pommes frites, vattenkrasse.",
        },
        priceEur: 56,
      },
      {
        name: {
          en: "Solomillo — centre-cut fillet",
          es: "Solomillo — centro de filete",
          sv: "Oxfilé — mittenbit",
        },
        description: {
          en: "Prime Irish grass-fed fillet, 28-day dry-aged — porcini jus, smoked bone marrow on toast.",
          es: "Solomillo irlandés de pasto, centro, madurado 28 días en seco — jugo de boletus, tuétano ahumado sobre tosta.",
          sv: "Primär irländsk filé av gräsbetad nöt, 28 dagars torkmognad — karljohansås, rökt märg på rostat bröd.",
        },
        priceEur: 52,
      },
      {
        name: {
          en: "Vaca vieja presa",
          es: "Presa de vaca vieja",
          sv: "Presa av gammal ko",
        },
        description: {
          en: "Shoulder presa from mature dairy cow, 60+ day dry-age — intense marbling, grilled rare, piquillo confit.",
          es: "Presa de vaca de descarte, más de 60 días de maduración en seco — veteado profundo, brasa en punto, piquillo confitado.",
          sv: "Presa från äldre mjökkossa, 60+ dagars torkmognad — tydlig marmorering, grillad rare, konfiterad piquillo.",
        },
        priceEur: 48,
      },
      {
        name: {
          en: "Supplement: A5 Wagyu striploin (120 g)",
          es: "Suplemento: lomo bajo Wagyu A5 (120 g)",
          sv: "Tillägg: striploin Wagyu A5 (120 g)",
        },
        description: {
          en: "Kagoshima prefecture — lightly torched, sea salt only; add to any main or share as a course.",
          es: "Prefectura de Kagoshima — sellado suave, solo sal marina; añadir a un principal o compartir.",
          sv: "Kagoshima prefektur — lätt tänd, enbart havssalt; lägg till en huvudrätt eller dela som moment.",
        },
        priceEur: 72,
      },
    ],
  },
  {
    title: {
      en: "Ibérico, pork & lamb",
      es: "Ibérico, cerdo y cordero",
      sv: "Iberico, fläsk och lamm",
    },
    items: [
      {
        name: {
          en: "Presa Ibérica de bellota",
          es: "Presa Ibérica de bellota",
          sv: "Presa Ibérico de bellota",
        },
        description: {
          en: "D.O. Los Pedroches shoulder presa — charcoal, smoked pimentón rub, roasted onion purée.",
          es: "Presa de paletilla D.O. Los Pedroches — carbón vegetal, rub de pimentón ahumado, puré de cebolla asada.",
          sv: "Presa från Los Pedroches D.O. — kolglöd, rökt pimentonrub, rostad lökpuré.",
        },
        priceEur: 44,
      },
      {
        name: {
          en: "Secreto & pluma combo",
          es: "Secreto y pluma a la brasa",
          sv: "Secreto och pluma från glöd",
        },
        description: {
          en: "Two signature Ibérico cuts from the same animal, acorn-finished — pickled mustard seed, crisp crackling.",
          es: "Dos cortes ibéricos del mismo animal, terminación en bellota — mostaza en grano encurtida, chicharrón crujiente.",
          sv: "Två signaturinsnitt från samma ibericodjur, ekollonfärdig — inlagd senapsfrö, spröd svål.",
        },
        priceEur: 46,
      },
      {
        name: {
          en: "Lamb rack — Pyrenees milk-fed",
          es: "Costillar de lechal de los Pirineos",
          sv: "Lammrack — mjölkfödd från Pyrenéerna",
        },
        description: {
          en: "French-trimmed rack, herb crust, slow-roasted — spring garlic, lamb jus.",
          es: "Costillar limpio francés, costra de hierbas, asado lento — ajetes, jugo de cordero.",
          sv: "Franskt trimmat rack, örtkrust, långsamt rostat — vitlöksknoppar, lammjus.",
        },
        priceEur: 48,
      },
      {
        name: {
          en: "Duck magret — Challans",
          es: "Magret de pato — Challans",
          sv: "Varmrökt anbröst — Challans",
        },
        description: {
          en: "Dry-aged duck breast, skin scored crisp — sour cherry, turnip, duck demi-glace.",
          es: "Magret madurado en seco, piel crujiente — guinda, nabo, demi-glace de pato.",
          sv: "Torkmognat anbröst, knaprig skinnsida — surkörsbär, majrova, an demi-glace.",
        },
        priceEur: 40,
      },
      {
        name: {
          en: "Iberian pork cheek, long braise",
          es: "Carrillera ibérica estofada",
          sv: "Långkokt iberico-kind",
        },
        description: {
          en: "Diced Ibérico cheek, oloroso sherry, smoked paprika — silky potato purée.",
          es: "Carrillera ibérica en dados, oloroso, pimentón ahumado — puré de patata sedosa.",
          sv: "Tärnad ibericokind, oloroso, rökt paprika — silkeslen potatispuré.",
        },
        priceEur: 36,
      },
    ],
  },
];
