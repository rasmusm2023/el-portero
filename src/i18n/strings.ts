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
  | "page.home.eventsHeading"
  | "page.home.eventsIntro"
  | "page.home.eventsViewAll"
  | "page.home.eventsCta"
  | "page.home.eventsScrollHint"
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
  | "page.reserve.heroTitle"
  | "page.reserve.heroBody"
  | "page.reserve.labelGuests"
  | "page.reserve.labelDate"
  | "page.reserve.datePlaceholder"
  | "page.reserve.labelTime"
  | "page.reserve.timePlaceholder"
  | "page.reserve.policyNote"
  | "page.reserve.submitSoon"
  | "page.reserve.bookNow"
  | "page.reserve.bookNowDisabledHint"
  | "page.reserve.bookIncompleteHint"
  | "page.reserve.fullyBooked"
  | "page.reserve.timeUnavailable"
  | "page.reserve.noTimesForDate"
  | "page.reserve.newsletterHeading"
  | "page.reserve.newsletterBody"
  | "page.reserve.newsletterEmailPlaceholder"
  | "page.reserve.newsletterSubmit"
  | "page.reserve.newsletterThanks"
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
    "page.home.eventsHeading": "Upcoming events",
    "page.home.eventsIntro":
      "Evenings worth reserving — tastings, collaborations, and one-off menus at the table.",
    "page.home.eventsViewAll": "All events",
    "page.home.eventsCta": "Details",
    "page.home.eventsScrollHint": "Scroll sideways for more",
    "page.menu.title": "Our menus",
    "page.menu.food": "Sample",
    "page.menu.drinks": "Drinks",
    "page.menu.brunch": "Brunch",
    "page.menu.alacarte": "À la carte",
    "page.menu.foodHeading": "Sample menu",
    "page.menu.drinksHeading": "Drinks menu",
    "page.menu.brunchHeading": "Brunch menu",
    "page.menu.alacarteHeading": "À la carte",
    "page.menu.drinksIntro":
      "Sample list — bottle vintages and pairings will be updated with the cellar.",
    "page.menu.foodIntro":
      "Placeholder dishes for layout — for this week’s real lunch, open Lunch.",
    "page.menu.brunchIntro":
      "Weekend brunch — pastries, eggs, and lighter plates. Times and dishes may change with the season.",
    "page.menu.alacarteIntro":
      "Order by course or choose the chef’s tasting — ingredients follow the market and the kitchen’s daily prep.",
    "page.menu.seeMenu": "See menu",
    "page.menu.weekly": "Lunch",
    "page.menu.weeklyHeading": "Lunch",
    "page.menu.weeklyIntro":
      "What we serve for lunch through the week changes regularly. If nothing appears yet, publish the current week in admin.",
    "page.menu.weeklyLoading": "Loading lunch…",
    "page.menu.weeklyEmpty":
      "No lunch menu is published for this week yet. Check back soon — or ask staff to publish it in admin.",
    "page.menu.weeklyWeekLabel": "Week of",
    "page.menu.weeklyEffectiveLabel": "Goes live",
    "page.menu.weeklyMadridNote": "Madrid week start",
    "page.menu.weeklyViewFull": "View full lunch menu",
    "page.menu.subnavAria": "Menu sections",
    "page.events.title": "Events",
    "page.story.title": "Our story",
    "page.story.intro":
      "El Portero is where South American warmth meets Scandinavian clarity — fine dining and a dinner club spirit on the Mediterranean coast. This page is ready for your full narrative, milestones, and the people behind the stoves.",
    "page.reserve.title": "Reservations",
    "page.reserve.heroTitle": "Dine with us",
    "page.reserve.heroBody":
      "Join us at El Portero for an unforgettable evening on the Mediterranean — seasonal cooking, warm hospitality, and the dinner club spirit. Reserve your table below; we’ll confirm by email or phone once online booking is live.",
    "page.reserve.labelGuests": "Party size",
    "page.reserve.labelDate": "Date",
    "page.reserve.datePlaceholder": "Choose a date",
    "page.reserve.labelTime": "Time",
    "page.reserve.timePlaceholder": "Select a time",
    "page.reserve.policyNote":
      "Cancellations at least 24 hours in advance. Late cancellation terms follow the restaurant’s policy. No payment is taken on this website yet.",
    "page.reserve.submitSoon": "Request table (coming soon)",
    "page.reserve.bookNow": "Book now",
    "page.reserve.bookNowDisabledHint":
      "Online booking is not connected yet — this button will open your reservation when the system is live.",
    "page.reserve.bookIncompleteHint":
      "Choose party size, date, and time before booking.",
    "page.reserve.fullyBooked": "Fully booked",
    "page.reserve.timeUnavailable": "Unavailable",
    "page.reserve.noTimesForDate":
      "No open times left on this date — try another day.",
    "page.reserve.newsletterHeading": "Newsletter signup",
    "page.reserve.newsletterBody":
      "For restaurant news, private events, and seasonal menus, sign up with your email below.",
    "page.reserve.newsletterEmailPlaceholder": "Email address",
    "page.reserve.newsletterSubmit": "Sign up",
    "page.reserve.newsletterThanks": "Thank you!",
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
    "page.home.eventsHeading": "Próximos eventos",
    "page.home.eventsIntro":
      "Noches para reservar — catas, colaboraciones y menús únicos en la mesa.",
    "page.home.eventsViewAll": "Todos los eventos",
    "page.home.eventsCta": "Detalles",
    "page.home.eventsScrollHint": "Desplázate horizontalmente para ver más",
    "page.menu.title": "Nuestras cartas",
    "page.menu.food": "Ejemplo",
    "page.menu.drinks": "Bebidas",
    "page.menu.brunch": "Brunch",
    "page.menu.alacarte": "A la carta",
    "page.menu.foodHeading": "Carta de ejemplo",
    "page.menu.drinksHeading": "Carta de bebidas",
    "page.menu.brunchHeading": "Brunch",
    "page.menu.alacarteHeading": "A la carta",
    "page.menu.drinksIntro":
      "Lista de ejemplo — añadas y maridajes se actualizarán con la bodega.",
    "page.menu.foodIntro":
      "Platos de ejemplo para maquetación — el almuerzo real de la semana está en Almuerzo.",
    "page.menu.brunchIntro":
      "Brunch de fin de semana — bollería, huevos y platos ligeros. Horarios y carta pueden variar con la temporada.",
    "page.menu.alacarteIntro":
      "Elige por platos o el menú degustación del chef — el producto sigue el mercado y el día a día de cocina.",
    "page.menu.seeMenu": "Ver carta",
    "page.menu.weekly": "Almuerzo",
    "page.menu.weeklyHeading": "Almuerzo",
    "page.menu.weeklyIntro":
      "El almuerzo a lo largo de la semana cambia con frecuencia. Si no aparece nada, publica la semana actual en admin.",
    "page.menu.weeklyLoading": "Cargando almuerzo…",
    "page.menu.weeklyEmpty":
      "Aún no hay carta de almuerzo publicada para esta semana. Vuelve pronto — o pide al equipo que la publique en admin.",
    "page.menu.weeklyWeekLabel": "Semana del",
    "page.menu.weeklyEffectiveLabel": "Activo desde",
    "page.menu.weeklyMadridNote": "Inicio de semana (Madrid)",
    "page.menu.weeklyViewFull": "Ver carta de almuerzo completa",
    "page.menu.subnavAria": "Secciones de la carta",
    "page.events.title": "Eventos",
    "page.story.title": "Nuestra historia",
    "page.story.intro":
      "El Portero es el encuentro entre la calidez sudamericana y la claridad nórdica — alta cocina y espíritu de cena club en la costa mediterránea. Esta página está lista para vuestro relato, hitos y el equipo detrás de los fogones.",
    "page.reserve.title": "Reservas",
    "page.reserve.heroTitle": "Cena con nosotros",
    "page.reserve.heroBody":
      "Os esperamos en El Portero para una velada memorable en el Mediterráneo — cocina de temporada, hospitalidad cercana y espíritu de cena club. Reservad vuestra mesa abajo; confirmaremos por correo o teléfono cuando la reserva online esté activa.",
    "page.reserve.labelGuests": "Comensales",
    "page.reserve.labelDate": "Fecha",
    "page.reserve.datePlaceholder": "Elija una fecha",
    "page.reserve.labelTime": "Hora",
    "page.reserve.timePlaceholder": "Elija una hora",
    "page.reserve.policyNote":
      "Cancelación con al menos 24 horas de antelación. La cancelación tardía se gestiona según la política del restaurante. Aún no hay pago en la web.",
    "page.reserve.submitSoon": "Solicitar mesa (pronto)",
    "page.reserve.bookNow": "Reservar",
    "page.reserve.bookNowDisabledHint":
      "La reserva online aún no está conectada — este botón abrirá la reserva cuando el sistema esté activo.",
    "page.reserve.bookIncompleteHint":
      "Elige tamaño del grupo, fecha y hora antes de reservar.",
    "page.reserve.fullyBooked": "Completo",
    "page.reserve.timeUnavailable": "No disponible",
    "page.reserve.noTimesForDate":
      "No quedan horas libres en esta fecha — prueba otro día.",
    "page.reserve.newsletterHeading": "Boletín",
    "page.reserve.newsletterBody":
      "Para novedades del restaurante, eventos privados y cartas de temporada, dejad vuestro correo abajo.",
    "page.reserve.newsletterEmailPlaceholder": "Correo electrónico",
    "page.reserve.newsletterSubmit": "Suscribirse",
    "page.reserve.newsletterThanks": "¡Gracias!",
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
    "page.home.eventsHeading": "Kommande evenemang",
    "page.home.eventsIntro":
      "Kvällar värda att boka — provningar, samarbeten och unika menyer vid bordet.",
    "page.home.eventsViewAll": "Alla evenemang",
    "page.home.eventsCta": "Läs mer",
    "page.home.eventsScrollHint": "Scrolla åt sidan för fler",
    "page.menu.title": "Våra menyer",
    "page.menu.food": "Exempel",
    "page.menu.drinks": "Dryck",
    "page.menu.brunch": "Brunch",
    "page.menu.alacarte": "À la carte",
    "page.menu.foodHeading": "Exempelmeny",
    "page.menu.drinksHeading": "Dryckesmeny",
    "page.menu.brunchHeading": "Brunchmeny",
    "page.menu.alacarteHeading": "À la carte",
    "page.menu.drinksIntro":
      "Exempellista — årgångar och maridage uppdateras med vinkällaren.",
    "page.menu.foodIntro":
      "Exempelrätter för layout — veckans riktiga lunch finns under Lunch.",
    "page.menu.brunchIntro":
      "Helgbrunch — bakverk, ägg och lättare rätter. Tider och utbud kan ändras med säsongen.",
    "page.menu.alacarteIntro":
      "Välj rätter fristående eller kockens avsmakning — råvaror följer marknad och kökets dagsform.",
    "page.menu.seeMenu": "Se menyn",
    "page.menu.weekly": "Lunch",
    "page.menu.weeklyHeading": "Lunch",
    "page.menu.weeklyIntro":
      "Lunchen under veckan växlar ofta. Om inget visas ännu, publicera aktuell vecka i admin.",
    "page.menu.weeklyLoading": "Laddar lunch…",
    "page.menu.weeklyEmpty":
      "Ingen lunchmeny är publicerad för den här veckan än. Kom tillbaka snart — eller be personalen publicera den i admin.",
    "page.menu.weeklyWeekLabel": "Vecka från",
    "page.menu.weeklyEffectiveLabel": "Aktiveras",
    "page.menu.weeklyMadridNote": "Veckostart (Madrid)",
    "page.menu.weeklyViewFull": "Se hela lunchmenyn",
    "page.menu.subnavAria": "Menydelar",
    "page.events.title": "Evenemang",
    "page.story.title": "Vår historia",
    "page.story.intro":
      "El Portero är mötet mellan sydamerikansk värme och skandinavisk tydlighet — finare matlagning och dinner club vid Medelhavet. Sidan är redo för er berättelse, milstolpar och köket bakom grytorna.",
    "page.reserve.title": "Bokning",
    "page.reserve.heroTitle": "Ät med oss",
    "page.reserve.heroBody":
      "Välkommen till El Portero för en minnesvärd kväll vid Medelhavet — säsongens råvaror, varm gästfrihet och dinner club-känsla. Boka bord nedan; vi bekräftar via mejl eller telefon när onlinebokning är kopplad.",
    "page.reserve.labelGuests": "Gäster",
    "page.reserve.labelDate": "Datum",
    "page.reserve.datePlaceholder": "Välj datum",
    "page.reserve.labelTime": "Tid",
    "page.reserve.timePlaceholder": "Välj tid",
    "page.reserve.policyNote":
      "Avbokning minst 24 timmar i förväg. Sen avbokning enligt restaurangens policy. Ingen betalning på webben ännu.",
    "page.reserve.submitSoon": "Begär bord (kommer snart)",
    "page.reserve.bookNow": "Boka nu",
    "page.reserve.bookNowDisabledHint":
      "Onlinebokning är inte kopplad än — knappen öppnar din bokning när systemet är igång.",
    "page.reserve.bookIncompleteHint":
      "Välj sällskapsstorlek, datum och tid innan du bokar.",
    "page.reserve.fullyBooked": "Fullbokat",
    "page.reserve.timeUnavailable": "Upptaget",
    "page.reserve.noTimesForDate":
      "Inga lediga tider det här datumet — prova en annan dag.",
    "page.reserve.newsletterHeading": "Nyhetsbrev",
    "page.reserve.newsletterBody":
      "För nyheter om restaurangen, privata event och säsongsmenyer — anmäl din e-post nedan.",
    "page.reserve.newsletterEmailPlaceholder": "E-postadress",
    "page.reserve.newsletterSubmit": "Skicka",
    "page.reserve.newsletterThanks": "Tack!",
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
