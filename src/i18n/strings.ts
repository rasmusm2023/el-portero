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
  | "nav.menu"
  | "nav.events"
  | "nav.reserve"
  | "nav.contact"
  | "nav.gallery"
  | "nav.hours"
  | "nav.admin";

type PageKey =
  | "page.home.title"
  | "page.menu.title"
  | "page.events.title"
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
  | "header.reserveTable";

export type MessageKey = NavKey | PageKey | FooterKey | HeaderKey;

const messages: Record<Locale, Record<MessageKey, string>> = {
  en: {
    "nav.home": "Home",
    "nav.menu": "Menu",
    "nav.events": "Events",
    "nav.reserve": "Reserve",
    "nav.contact": "Contact",
    "nav.gallery": "Gallery",
    "nav.hours": "Hours",
    "nav.admin": "Admin",
    "page.home.title": "Welcome",
    "page.menu.title": "Menu",
    "page.events.title": "Events",
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
    "header.reserveTable": "Reserve table",
  },
  es: {
    "nav.home": "Inicio",
    "nav.menu": "Carta",
    "nav.events": "Eventos",
    "nav.reserve": "Reservar",
    "nav.contact": "Contacto",
    "nav.gallery": "Galería",
    "nav.hours": "Horario",
    "nav.admin": "Admin",
    "page.home.title": "Bienvenidos",
    "page.menu.title": "Carta",
    "page.events.title": "Eventos",
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
    "header.reserveTable": "Reservar mesa",
  },
  sv: {
    "nav.home": "Hem",
    "nav.menu": "Meny",
    "nav.events": "Evenemang",
    "nav.reserve": "Boka",
    "nav.contact": "Kontakt",
    "nav.gallery": "Galleri",
    "nav.hours": "Öppettider",
    "nav.admin": "Admin",
    "page.home.title": "Välkommen",
    "page.menu.title": "Meny",
    "page.events.title": "Evenemang",
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
    "header.reserveTable": "Boka bord",
  },
};

export function t(locale: Locale, key: MessageKey): string {
  return messages[locale][key];
}
