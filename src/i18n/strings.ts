export type Locale = "en" | "es" | "sv";

export const locales: Locale[] = ["en", "es", "sv"];

export const localeLabels: Record<Locale, string> = {
  en: "English",
  es: "Español",
  sv: "Svenska",
};

/**
 * Flag SVGs from Wikimedia (same files used on Wikipedia language articles).
 * — en: en.wikipedia File:Flag_of_the_United_Kingdom.svg
 * — es: commons File:Flag_of_Spain.svg
 * — sv: commons File:Flag_of_Sweden.svg
 */
export const localeFlagSrc: Record<Locale, string> = {
  en: "https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg",
  es: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg",
  sv: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Flag_of_Sweden.svg",
};

export type NavKey =
  | "nav.home"
  | "nav.story"
  | "nav.menu"
  | "nav.events"
  | "nav.reserve"
  | "nav.contact"
  | "nav.gallery"
  | "nav.hours"
  | "nav.admin";

type PageKey =
  | "page.home.title"
  | "page.home.instagramAria"
  | "page.home.instagramFollow"
  | "page.home.instagramShowMore"
  | "page.home.instagramShowLess"
  | "page.menu.title"
  | "page.menu.food"
  | "page.menu.drinks"
  | "page.menu.brunch"
  | "page.menu.alacarte"
  | "page.menu.foodHeading"
  | "page.menu.drinksHeading"
  | "page.menu.brunchHeading"
  | "page.menu.alacarteHeading"
  | "page.menu.drinksIntro"
  | "page.menu.foodIntro"
  | "page.menu.brunchIntro"
  | "page.menu.alacarteIntro"
  | "page.menu.seeMenu"
  | "page.menu.weekly"
  | "page.menu.weeklyHeading"
  | "page.menu.weeklyIntro"
  | "page.menu.weeklyLoading"
  | "page.menu.weeklyEmpty"
  | "page.menu.weeklyWeekLabel"
  | "page.menu.weeklyEffectiveLabel"
  | "page.menu.weeklyMadridNote"
  | "page.menu.weeklyViewFull"
  | "page.menu.subnavAria"
  | "page.events.title"
  | "page.story.title"
  | "page.story.intro"
  | "page.reserve.title"
  | "page.contact.title"
  | "page.gallery.title"
  | "page.hours.title"
  | "page.hours.map"
  | "page.hours.mapIframeTitle"
  | "page.hours.openInMaps"
  | "page.admin.title";

type FooterKey = "footer.staff";

type HeaderKey =
  | "header.menuLabel"
  | "header.closeNav"
  | "header.openNav"
  | "header.navDialog"
  | "header.reserveTable"
  | "header.reserveNav";

type BrandKey = "brand.dinnerClub";

export type MessageKey = NavKey | PageKey | FooterKey | HeaderKey | BrandKey;

const messages: Record<Locale, Record<MessageKey, string>> = {
  en: {
    "nav.home": "Home",
    "nav.story": "Our story",
    "nav.menu": "Menus",
    "nav.events": "Events",
    "nav.reserve": "Reserve",
    "nav.contact": "Contact",
    "nav.gallery": "Gallery",
    "nav.hours": "Hours",
    "nav.admin": "Admin",
    "page.home.title": "Welcome",
    "page.home.instagramAria": "Instagram",
    "page.home.instagramFollow": "Follow us",
    "page.home.instagramShowMore": "Show more posts",
    "page.home.instagramShowLess": "Show fewer",
    "page.menu.title": "Our menus",
    "page.menu.food": "Lunch",
    "page.menu.drinks": "Drinks",
    "page.menu.brunch": "Brunch",
    "page.menu.alacarte": "À la carte",
    "page.menu.foodHeading": "Lunch menu",
    "page.menu.drinksHeading": "Drinks menu",
    "page.menu.brunchHeading": "Brunch menu",
    "page.menu.alacarteHeading": "À la carte",
    "page.menu.drinksIntro":
      "Sample list — bottle vintages and pairings will be updated with the cellar.",
    "page.menu.foodIntro":
      "Sample lunch menu — dishes and allergens are confirmed by the kitchen before service.",
    "page.menu.brunchIntro":
      "Weekend brunch — pastries, eggs, and lighter plates. Times and dishes may change with the season.",
    "page.menu.alacarteIntro":
      "Order by course or choose the chef’s tasting — ingredients follow the market and the kitchen’s daily prep.",
    "page.menu.seeMenu": "See menu",
    "page.menu.weekly": "Weekly",
    "page.menu.weeklyHeading": "Weekly menu",
    "page.menu.weeklyIntro":
      "A short rotating selection that changes with the week. If nothing appears yet, publish the current week in admin.",
    "page.menu.weeklyLoading": "Loading this week’s menu…",
    "page.menu.weeklyEmpty":
      "No weekly menu is published for this week yet. Check back soon — or ask staff to publish it in admin.",
    "page.menu.weeklyWeekLabel": "Week of",
    "page.menu.weeklyEffectiveLabel": "Goes live",
    "page.menu.weeklyMadridNote": "Madrid week start",
    "page.menu.weeklyViewFull": "View full weekly menu",
    "page.menu.subnavAria": "Menu sections",
    "page.events.title": "Events",
    "page.story.title": "Our story",
    "page.story.intro":
      "El Portero is where South American warmth meets Scandinavian clarity — fine dining and a dinner club spirit on the Mediterranean coast. This page is ready for your full narrative, milestones, and the people behind the stoves.",
    "page.reserve.title": "Reservations",
    "page.contact.title": "Contact",
    "page.gallery.title": "Gallery",
    "page.hours.title": "Opening hours",
    "page.hours.map": "Location",
    "page.hours.mapIframeTitle": "Map: El Portero, Torrevieja",
    "page.hours.openInMaps": "Open in Google Maps",
    "page.admin.title": "Admin sign-in",
    "footer.staff": "Staff",
    "header.menuLabel": "MENU",
    "header.closeNav": "Close menu",
    "header.openNav": "Open menu",
    "header.navDialog": "Site navigation",
    "header.reserveTable": "Make reservation",
    "header.reserveNav": "Reservation",
    "brand.dinnerClub": "Dinner Club",
  },
  es: {
    "nav.home": "Inicio",
    "nav.story": "Nuestra historia",
    "nav.menu": "Cartas",
    "nav.events": "Eventos",
    "nav.reserve": "Reservar",
    "nav.contact": "Contacto",
    "nav.gallery": "Galería",
    "nav.hours": "Horario",
    "nav.admin": "Admin",
    "page.home.title": "Bienvenidos",
    "page.home.instagramAria": "Instagram",
    "page.home.instagramFollow": "Síguenos",
    "page.home.instagramShowMore": "Ver más publicaciones",
    "page.home.instagramShowLess": "Ver menos",
    "page.menu.title": "Nuestras cartas",
    "page.menu.food": "Almuerzo",
    "page.menu.drinks": "Bebidas",
    "page.menu.brunch": "Brunch",
    "page.menu.alacarte": "A la carta",
    "page.menu.foodHeading": "Menú de almuerzo",
    "page.menu.drinksHeading": "Carta de bebidas",
    "page.menu.brunchHeading": "Brunch",
    "page.menu.alacarteHeading": "A la carta",
    "page.menu.drinksIntro":
      "Lista de ejemplo — añadas y maridajes se actualizarán con la bodega.",
    "page.menu.foodIntro":
      "Menú de ejemplo de almuerzo — platos y alérgenos se confirman en sala antes del servicio.",
    "page.menu.brunchIntro":
      "Brunch de fin de semana — bollería, huevos y platos ligeros. Horarios y carta pueden variar con la temporada.",
    "page.menu.alacarteIntro":
      "Elige por platos o el menú degustación del chef — el producto sigue el mercado y el día a día de cocina.",
    "page.menu.seeMenu": "Ver carta",
    "page.menu.weekly": "Semanal",
    "page.menu.weeklyHeading": "Menú semanal",
    "page.menu.weeklyIntro":
      "Una selección breve que rota cada semana. Si no aparece nada, publica la semana actual en admin.",
    "page.menu.weeklyLoading": "Cargando el menú de la semana…",
    "page.menu.weeklyEmpty":
      "Aún no hay menú semanal publicado para esta semana. Vuelve pronto — o pide al equipo que lo publique en admin.",
    "page.menu.weeklyWeekLabel": "Semana del",
    "page.menu.weeklyEffectiveLabel": "Activo desde",
    "page.menu.weeklyMadridNote": "Inicio de semana (Madrid)",
    "page.menu.weeklyViewFull": "Ver menú semanal completo",
    "page.menu.subnavAria": "Secciones de la carta",
    "page.events.title": "Eventos",
    "page.story.title": "Nuestra historia",
    "page.story.intro":
      "El Portero es el encuentro entre la calidez sudamericana y la claridad nórdica — alta cocina y espíritu de cena club en la costa mediterránea. Esta página está lista para vuestro relato, hitos y el equipo detrás de los fogones.",
    "page.reserve.title": "Reservas",
    "page.contact.title": "Contacto",
    "page.gallery.title": "Galería",
    "page.hours.title": "Horario",
    "page.hours.map": "Ubicación",
    "page.hours.mapIframeTitle": "Mapa: El Portero, Torrevieja",
    "page.hours.openInMaps": "Abrir en Google Maps",
    "page.admin.title": "Acceso admin",
    "footer.staff": "Personal",
    "header.menuLabel": "MENÚ",
    "header.closeNav": "Cerrar menú",
    "header.openNav": "Abrir menú",
    "header.navDialog": "Navegación",
    "header.reserveTable": "Hacer reserva",
    "header.reserveNav": "Reserva",
    "brand.dinnerClub": "Dinner Club",
  },
  sv: {
    "nav.home": "Hem",
    "nav.story": "Vår historia",
    "nav.menu": "Menyer",
    "nav.events": "Evenemang",
    "nav.reserve": "Boka",
    "nav.contact": "Kontakt",
    "nav.gallery": "Galleri",
    "nav.hours": "Öppettider",
    "nav.admin": "Admin",
    "page.home.title": "Välkommen",
    "page.home.instagramAria": "Instagram",
    "page.home.instagramFollow": "Följ oss",
    "page.home.instagramShowMore": "Visa fler inlägg",
    "page.home.instagramShowLess": "Visa färre",
    "page.menu.title": "Våra menyer",
    "page.menu.food": "Lunch",
    "page.menu.drinks": "Dryck",
    "page.menu.brunch": "Brunch",
    "page.menu.alacarte": "À la carte",
    "page.menu.foodHeading": "Lunchmeny",
    "page.menu.drinksHeading": "Dryckesmeny",
    "page.menu.brunchHeading": "Brunchmeny",
    "page.menu.alacarteHeading": "À la carte",
    "page.menu.drinksIntro":
      "Exempellista — årgångar och maridage uppdateras med vinkällaren.",
    "page.menu.foodIntro":
      "Exempellunchmeny — rätter och allergener bekräftas av köket före servering.",
    "page.menu.brunchIntro":
      "Helgbrunch — bakverk, ägg och lättare rätter. Tider och utbud kan ändras med säsongen.",
    "page.menu.alacarteIntro":
      "Välj rätter fristående eller kockens avsmakning — råvaror följer marknad och kökets dagsform.",
    "page.menu.seeMenu": "Se menyn",
    "page.menu.weekly": "Veckans",
    "page.menu.weeklyHeading": "Veckans meny",
    "page.menu.weeklyIntro":
      "Ett kort roterande urval som byts veckovis. Om inget visas ännu, publicera aktuell vecka i admin.",
    "page.menu.weeklyLoading": "Laddar veckans meny…",
    "page.menu.weeklyEmpty":
      "Ingen veckomeny är publicerad för den här veckan än. Kom tillbaka snart — eller be personalen publicera den i admin.",
    "page.menu.weeklyWeekLabel": "Vecka från",
    "page.menu.weeklyEffectiveLabel": "Aktiveras",
    "page.menu.weeklyMadridNote": "Veckostart (Madrid)",
    "page.menu.weeklyViewFull": "Se hela veckans meny",
    "page.menu.subnavAria": "Menydelar",
    "page.events.title": "Evenemang",
    "page.story.title": "Vår historia",
    "page.story.intro":
      "El Portero är mötet mellan sydamerikansk värme och skandinavisk tydlighet — finare matlagning och dinner club vid Medelhavet. Sidan är redo för er berättelse, milstolpar och köket bakom grytorna.",
    "page.reserve.title": "Bokning",
    "page.contact.title": "Kontakt",
    "page.gallery.title": "Galleri",
    "page.hours.title": "Öppettider",
    "page.hours.map": "Plats",
    "page.hours.mapIframeTitle": "Karta: El Portero, Torrevieja",
    "page.hours.openInMaps": "Öppna i Google Maps",
    "page.admin.title": "Admininloggning",
    "footer.staff": "Personal",
    "header.menuLabel": "MENY",
    "header.closeNav": "Stäng meny",
    "header.openNav": "Öppna menyn",
    "header.navDialog": "Navigering",
    "header.reserveTable": "Gör bokning",
    "header.reserveNav": "Bokning",
    "brand.dinnerClub": "Dinner Club",
  },
};

export function t(locale: Locale, key: MessageKey): string {
  return messages[locale][key];
}
