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
  | "page.menu.weeklyWeekTitle"
  | "page.menu.weeklyIntro"
  | "page.menu.weeklyServiceLine"
  | "page.menu.weeklyLoading"
  | "page.menu.weeklyEmpty"
  | "page.menu.weeklyWeekLabel"
  | "page.menu.weeklyEffectiveLabel"
  | "page.menu.weeklyMadridNote"
  | "page.menu.subnavAria"
  | "page.events.title"
  | "page.events.heroSubtitle"
  | "page.events.heroInquiryCta"
  | "page.events.heroInquiryAria"
  | "page.events.explainPublicTitle"
  | "page.events.explainPublicBody"
  | "page.events.explainPrivateTitle"
  | "page.events.explainPrivateBody"
  | "page.events.listHeading"
  | "page.events.listEmpty"
  | "page.events.sectionOverviewLabel"
  | "page.story.title"
  | "page.story.intro"
  | "page.story.sectionOriginTitle"
  | "page.story.sectionOriginP1"
  | "page.story.sectionOriginP2"
  | "page.story.sectionMagnusTitle"
  | "page.story.sectionMagnusP1"
  | "page.story.sectionMagnusP2"
  | "page.story.sectionPhilosophyTitle"
  | "page.story.sectionPhilosophyBody"
  | "page.story.sectionCoastTitle"
  | "page.story.sectionCoastBody"
  | "page.story.ctaReserve"
  | "page.story.ctaReserveAria"
  | "page.story.photoAltOrigin"
  | "page.story.photoAltMagnus"
  | "page.story.photoAltTileA"
  | "page.story.photoAltTileB"
  | "page.story.photoAltTileC"
  | "page.story.photoAltCoast"
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
  | "page.reserve.altBookingTitle"
  | "page.reserve.altBookingOr"
  | "page.reserve.altCall"
  | "page.reserve.altWhatsApp"
  | "page.reserve.altWhatsAppHint"
  | "page.reserve.altCallAria"
  | "page.reserve.altWhatsAppAria"
  | "page.contact.title"
  | "page.contact.heroTitle"
  | "page.contact.heroBody"
  | "page.contact.labelName"
  | "page.contact.labelEmail"
  | "page.contact.labelSubject"
  | "page.contact.labelMessage"
  | "page.contact.subjectPlaceholder"
  | "page.contact.submitSoon"
  | "page.contact.policyNote"
  | "page.contact.validationName"
  | "page.contact.validationEmail"
  | "page.contact.validationEmailFormat"
  | "page.contact.validationSubject"
  | "page.contact.validationMessage"
  | "page.contact.validationOkNotSent"
  | "page.contact.validationSummary"
  | "page.contact.validationTooFast"
  | "page.contact.placeholderName"
  | "page.contact.placeholderEmail"
  | "page.contact.placeholderMessage"
  | "page.contact.spamNote"
  | "page.contact.subject.general"
  | "page.contact.subject.reservation"
  | "page.contact.subject.privateEvent"
  | "page.contact.subject.feedbackVisit"
  | "page.contact.subject.dietaryAllergies"
  | "page.contact.subject.largeGroup"
  | "page.contact.subject.giftCard"
  | "page.contact.subject.pressMedia"
  | "page.contact.subject.partnership"
  | "page.contact.subject.careers"
  | "page.contact.subject.lostProperty"
  | "page.contact.subject.accessibility"
  | "page.contact.subject.wineCellar"
  | "page.contact.subject.hoursLocation"
  | "page.contact.subject.billing"
  | "page.contact.subject.privateDining"
  | "page.contact.subject.specialOccasion"
  | "page.contact.subject.other"
  | "page.gallery.title"
  | "page.hours.title"
  | "page.hours.map"
  | "page.hours.mapIframeTitle"
  | "page.admin.title";

type FooterKey = "footer.whatsapp" | "footer.whatsappAria";

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
    "nav.reserve": "Reservations",
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
    "page.menu.weeklyWeekTitle": "Lunch week {week}",
    "page.menu.weeklyIntro": "Lunch is served Monday–Friday, 11:00–15:00.",
    "page.menu.weeklyServiceLine": "Monday–Friday, 11:00–15:00.",
    "page.menu.weeklyLoading": "Loading lunch…",
    "page.menu.weeklyEmpty":
      "No lunch menu is published for this week yet. Check back soon — or ask staff to publish it in admin.",
    "page.menu.weeklyWeekLabel": "Week of",
    "page.menu.weeklyEffectiveLabel": "Goes live",
    "page.menu.weeklyMadridNote": "Madrid week start",
    "page.menu.subnavAria": "Menu sections",
    "page.events.title": "Events",
    "page.events.heroSubtitle":
      "We host our own open nights at the restaurant — think themed dinners, big-match screenings, and one-off collaborations. You can also work with us to host yours: weddings, business dinners, and private parties.",
    "page.events.heroInquiryCta": "Request a quote",
    "page.events.heroInquiryAria": "Go to contact — request a quote for private events",
    "page.events.explainPublicTitle": "Our public events",
    "page.events.explainPublicBody":
      "These are evenings we put on for everyone: special menus, guest chefs, football and sports nights on the big screen, and seasonal ideas as we go. Grab a table like any other visit — dates and details are below when something is live.",
    "page.events.explainPrivateTitle": "Your event here",
    "page.events.explainPrivateBody":
      "Hire the restaurant for your crowd — weddings, company dinners, birthdays, tastings, or a fully private celebration. Tell us your date, group size, and mood; we’ll come back with menus, pacing, and a clear way forward.",
    "page.events.listHeading": "Coming up",
    "page.events.listEmpty": "No published events yet — check back soon.",
    "page.events.sectionOverviewLabel": "Public nights and private events",
    "page.story.title": "Our story",
    "page.story.intro":
      "Fine dining with a dinner club spirit on the Costa Blanca — where South American warmth meets Scandinavian clarity. El Portero is our invitation to slow down and eat well by the sea.",
    "page.story.sectionOriginTitle": "What brings us together",
    "page.story.sectionOriginP1":
      "El Portero began with a simple idea: a restaurant that feels both celebratory and precise. Our cooking follows Mediterranean seasons and the convivial tables of Latin America, filtered through Nordic directness — generous flavour, honest sourcing, and service that stays in step with the room.",
    "page.story.sectionOriginP2":
      "We chose Torrevieja because the light, the produce, and the sea set the tone. Whether you are here for a long tasting menu or a lively evening with friends, we want every visit to feel intentional.",
    "page.story.sectionMagnusTitle": "The keeper of the house",
    "page.story.sectionMagnusP1":
      "El Portero is led by Magnus Hedman — former professional goalkeeper, capped for Sweden, and trusted between the posts at the highest level of the game. A career spent reading the room, holding the line, and delivering under pressure translates naturally to hospitality: calm pacing, trust at the table, and a team that moves as one.",
    "page.story.sectionMagnusP2":
      "Today Magnus brings that same focus to welcoming guests, shaping the room, and keeping the restaurant’s character: warm, disciplined, and never ordinary.",
    "page.story.sectionPhilosophyTitle": "How we cook & host",
    "page.story.sectionPhilosophyBody":
      "We build menus around seasonal ingredients, thoughtful wines, and the moment you are in — from tasting journeys to generous plates meant to share. Big-match nights, private celebrations, and quiet midweek dinners all belong here; the through-line is care you can taste.",
    "page.story.sectionCoastTitle": "On the Mediterranean",
    "page.story.sectionCoastBody":
      "A short walk from the water in Torrevieja, Alicante, El Portero welcomes travellers and locals alike. Book ahead when you can, and tell us if you are celebrating — we will do our best to make it memorable.",
    "page.story.ctaReserve": "Reserve a table",
    "page.story.ctaReserveAria": "Go to reservations — book a table at El Portero",
    "page.story.photoAltOrigin": "Cooking at the pass — energy in the kitchen",
    "page.story.photoAltMagnus":
      "A football pitch from above — focus, lines, and teamwork",
    "page.story.photoAltTileA": "Wine glasses and candlelight on the table",
    "page.story.photoAltTileB": "A carefully plated dish",
    "page.story.photoAltTileC": "Mediterranean ingredients spread for sharing",
    "page.story.photoAltCoast": "Mediterranean shoreline and open water",
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
    "page.contact.heroTitle": "Get in touch",
    "page.contact.heroBody":
      "Questions about reservations, events, dietary needs, or anything else — send us a note. Submission and email routing will connect to the backend soon; for now this form is a preview of the experience.",
    "page.contact.labelName": "Name",
    "page.contact.labelEmail": "Email",
    "page.contact.labelSubject": "Subject",
    "page.contact.labelMessage": "Message",
    "page.contact.subjectPlaceholder": "Choose a topic",
    "page.contact.submitSoon": "Send message (coming soon)",
    "page.contact.policyNote":
      "We read every message. Replies typically arrive within a few business days. No payment or booking is confirmed through this form yet.",
    "page.contact.validationName": "Please enter your name.",
    "page.contact.validationEmail": "Please enter your email address.",
    "page.contact.validationEmailFormat": "That doesn’t look like a valid email address.",
    "page.contact.validationSubject": "Please choose a subject.",
    "page.contact.validationMessage": "Please enter a message.",
    "page.contact.validationOkNotSent":
      "Your message looks ready to send — online delivery isn’t enabled yet, so nothing was transmitted.",
    "page.contact.validationSummary": "Please correct the highlighted fields.",
    "page.contact.validationTooFast":
      "Please wait a moment before sending — this helps us block automated submissions.",
    "page.contact.placeholderName": "Your name",
    "page.contact.placeholderEmail": "example@example.com",
    "page.contact.placeholderMessage":
      "Tell us what you need — dates, party size, dietary notes…",
    "page.contact.spamNote":
      "Protected against spam: please don’t fill in any hidden fields and wait a second after the page loads before submitting.",
    "page.contact.subject.general": "General inquiry",
    "page.contact.subject.reservation": "Reservation question",
    "page.contact.subject.privateEvent": "Private event or catering",
    "page.contact.subject.feedbackVisit": "Feedback on a recent visit",
    "page.contact.subject.dietaryAllergies": "Dietary needs or allergies",
    "page.contact.subject.largeGroup": "Large group / party size",
    "page.contact.subject.giftCard": "Gift card or voucher",
    "page.contact.subject.pressMedia": "Press & media",
    "page.contact.subject.partnership": "Collaboration or partnership",
    "page.contact.subject.careers": "Jobs & careers",
    "page.contact.subject.lostProperty": "Lost & found",
    "page.contact.subject.accessibility": "Accessibility",
    "page.contact.subject.wineCellar": "Wine list or cellar",
    "page.contact.subject.hoursLocation": "Hours, parking, or directions",
    "page.contact.subject.billing": "Invoice, receipt, or billing",
    "page.contact.subject.privateDining": "Private dining room",
    "page.contact.subject.specialOccasion": "Birthday or celebration",
    "page.contact.subject.other": "Something else",
    "page.gallery.title": "Gallery",
    "page.hours.title": "Opening hours",
    "page.hours.map": "Location",
    "page.hours.mapIframeTitle": "Map: El Portero, Torrevieja",
    "page.admin.title": "Admin sign-in",
    "header.menuLabel": "MENU",
    "header.closeNav": "Close menu",
    "header.openNav": "Open menu",
    "header.navDialog": "Site navigation",
    "header.reserveTable": "Make reservation",
    "header.reserveNav": "Reservation",
    "page.reserve.altBookingTitle": "Book by phone or WhatsApp",
    "page.reserve.altBookingOr": "Or",
    "page.reserve.altCall": "Call",
    "page.reserve.altWhatsApp": "WhatsApp",
    "page.reserve.altWhatsAppHint":
      "Message us with your date, time, and party size.",
    "page.reserve.altCallAria": "Call to reserve a table",
    "page.reserve.altWhatsAppAria": "Reserve via WhatsApp",
    "footer.whatsapp": "WhatsApp",
    "footer.whatsappAria": "Open WhatsApp chat with El Portero",
    "brand.dinnerClub": "Dinner Club",
  },
  es: {
    "nav.home": "Inicio",
    "nav.story": "Nuestra historia",
    "nav.menu": "Cartas",
    "nav.events": "Eventos",
    "nav.reserve": "Reservas",
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
    "page.menu.weeklyWeekTitle": "Almuerzo semana {week}",
    "page.menu.weeklyIntro": "Almuerzo de lunes a viernes, 11:00–15:00.",
    "page.menu.weeklyServiceLine": "De lunes a viernes, 11:00–15:00.",
    "page.menu.weeklyLoading": "Cargando almuerzo…",
    "page.menu.weeklyEmpty":
      "Aún no hay carta de almuerzo publicada para esta semana. Vuelve pronto — o pide al equipo que la publique en admin.",
    "page.menu.weeklyWeekLabel": "Semana del",
    "page.menu.weeklyEffectiveLabel": "Activo desde",
    "page.menu.weeklyMadridNote": "Inicio de semana (Madrid)",
    "page.menu.subnavAria": "Secciones de la carta",
    "page.events.title": "Eventos",
    "page.events.heroSubtitle":
      "Organizamos nuestras propias veladas abiertas — cenas temáticas, grandes partidos en pantalla y colaboraciones puntuales. También podéis confiar en nosotros para el vuestro: bodas, empresas y celebraciones privadas.",
    "page.events.heroInquiryCta": "Solicitar presupuesto",
    "page.events.heroInquiryAria": "Ir a contacto — solicitar presupuesto para eventos privados",
    "page.events.explainPublicTitle": "Eventos abiertos",
    "page.events.explainPublicBody":
      "Son noches que montamos para todo el mundo: menús especiales, chefs invitados, noches de fútbol y deporte en pantalla grande, y propuestas de temporada. Reservad mesa como en cualquier otra visita — abajo tenéis fechas y detalles cuando haya cartel.",
    "page.events.explainPrivateTitle": "Vuestra celebración aquí",
    "page.events.explainPrivateBody":
      "Reservad el restaurante para vuestro grupo — bodas, cenas de empresa, cumpleaños, catas o una celebración a puerta cerrada. Decidnos fecha, tamaño del grupo y ambición; volveremos con menús, ritmo y siguientes pasos claros.",
    "page.events.listHeading": "Próximas fechas",
    "page.events.listEmpty": "Aún no hay eventos publicados — pronto habrá novedades.",
    "page.events.sectionOverviewLabel": "Eventos abiertos y celebraciones privadas",
    "page.story.title": "Nuestra historia",
    "page.story.intro":
      "Alta cocina con espíritu de cena club en la Costa Blanca — donde la calidez sudamericana se encuentra con la claridad escandinava. El Portero es nuestra invitación a tomarse tiempo y comer bien junto al mar.",
    "page.story.sectionOriginTitle": "Lo que nos une",
    "page.story.sectionOriginP1":
      "El Portero nació de una idea sencilla: un restaurante que sea a la vez festivo y preciso. Cocinamos con las estaciones mediterráneas y la generosidad de mesa latina, con la franqueza nórdica — sabor abundante, producto honesto y servicio al ritmo de la sala.",
    "page.story.sectionOriginP2":
      "Estamos en Torrevieja porque la luz, el producto y el mar marcan el tono. Vengáis para un menú degustación largo o una velada animada con amigos, queremos que cada visita se sienta intencionada.",
    "page.story.sectionMagnusTitle": "El portero de la casa",
    "page.story.sectionMagnusP1":
      "El Portero lo dirige Magnus Hedman — ex portero profesional, internacional con Suecia y habituado a la exigencia bajo palos al máximo nivel. Una carrera leyendo la sala, cerrando línea y respondiendo bajo presión encaja con la hospitalidad: ritmo sereno, confianza en la mesa y un equipo que juega como uno.",
    "page.story.sectionMagnusP2":
      "Hoy Magnus lleva esa misma exigencia a acoger a los invitados, marcar el ambiente y conservar el carácter del restaurante: cálido, disciplinado y nunca ordinario.",
    "page.story.sectionPhilosophyTitle": "Cómo cocinamos y recibimos",
    "page.story.sectionPhilosophyBody":
      "Montamos cartas alrededor de ingredientes de temporada, vinos con criterio y el momento que vivís — desde recorridos de degustación hasta platos generosos para compartir. Noches de partido, celebraciones privadas y cenas tranquilas de entre semana tienen cabida; el hilo conductor es el cuidado que se nota en el plato.",
    "page.story.sectionCoastTitle": "Frente al Mediterráneo",
    "page.story.sectionCoastBody":
      "A un paso del mar en Torrevieja, Alicante, El Portero recibe a viajeros y vecinos. Reservad con antelación cuando podáis y contadnos si celebráis algo especial — haremos lo posible para que sea memorable.",
    "page.story.ctaReserve": "Reservar mesa",
    "page.story.ctaReserveAria": "Ir a reservas — reservar mesa en El Portero",
    "page.story.photoAltOrigin": "Cocina al paso — energía detrás del fuego",
    "page.story.photoAltMagnus":
      "Campo de fútbol visto desde arriba — foco, líneas y trabajo en equipo",
    "page.story.photoAltTileA": "Copas y luz de vela sobre la mesa",
    "page.story.photoAltTileB": "Un plato servido con mimo",
    "page.story.photoAltTileC": "Ingredientes mediterráneos para compartir",
    "page.story.photoAltCoast": "Costa mediterránea y mar abierto",
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
    "page.reserve.altBookingTitle": "Reservar por teléfono o WhatsApp",
    "page.reserve.altBookingOr": "O",
    "page.reserve.altCall": "Llamar",
    "page.reserve.altWhatsApp": "WhatsApp",
    "page.reserve.altWhatsAppHint":
      "Escribidnos con fecha, hora y comensales.",
    "page.reserve.altCallAria": "Llamar para reservar mesa",
    "page.reserve.altWhatsAppAria": "Reservar por WhatsApp",
    "page.contact.title": "Contacto",
    "page.contact.heroTitle": "Escríbenos",
    "page.contact.heroBody":
      "Dudas sobre reservas, eventos, alimentación o cualquier otra cosa — déjanos un mensaje. El envío y el correo se conectarán al backend pronto; por ahora el formulario es una vista previa.",
    "page.contact.labelName": "Nombre",
    "page.contact.labelEmail": "Correo electrónico",
    "page.contact.labelSubject": "Asunto",
    "page.contact.labelMessage": "Mensaje",
    "page.contact.subjectPlaceholder": "Elige un tema",
    "page.contact.submitSoon": "Enviar mensaje (pronto)",
    "page.contact.policyNote":
      "Leemos todos los mensajes. Las respuestas suelen tardar unos días laborables. Aún no se confirma pago ni reserva por este formulario.",
    "page.contact.validationName": "Indica tu nombre.",
    "page.contact.validationEmail": "Indica tu correo electrónico.",
    "page.contact.validationEmailFormat": "Ese correo no parece válido.",
    "page.contact.validationSubject": "Elige un asunto.",
    "page.contact.validationMessage": "Escribe un mensaje.",
    "page.contact.validationOkNotSent":
      "El mensaje está listo para enviar — el envío online aún no está activo, no se ha enviado nada.",
    "page.contact.validationSummary": "Revisa los campos marcados.",
    "page.contact.validationTooFast":
      "Espera un momento antes de enviar — nos ayuda a frenar envíos automáticos.",
    "page.contact.placeholderName": "Tu nombre",
    "page.contact.placeholderEmail": "ejemplo@ejemplo.com",
    "page.contact.placeholderMessage":
      "Cuéntanos qué necesitas — fechas, comensales, alimentación…",
    "page.contact.spamNote":
      "Protección antispam: no rellenes campos ocultos y espera un instante tras cargar la página antes de enviar.",
    "page.contact.subject.general": "Consulta general",
    "page.contact.subject.reservation": "Pregunta sobre reserva",
    "page.contact.subject.privateEvent": "Evento privado o catering",
    "page.contact.subject.feedbackVisit": "Opinión sobre una visita reciente",
    "page.contact.subject.dietaryAllergies": "Dieta o alergias",
    "page.contact.subject.largeGroup": "Grupo grande / comensales",
    "page.contact.subject.giftCard": "Tarjeta regalo o vale",
    "page.contact.subject.pressMedia": "Prensa y medios",
    "page.contact.subject.partnership": "Colaboración o partnership",
    "page.contact.subject.careers": "Empleo y prácticas",
    "page.contact.subject.lostProperty": "Objetos perdidos",
    "page.contact.subject.accessibility": "Accesibilidad",
    "page.contact.subject.wineCellar": "Carta de vinos o bodega",
    "page.contact.subject.hoursLocation": "Horario, parking o cómo llegar",
    "page.contact.subject.billing": "Factura, ticket o pagos",
    "page.contact.subject.privateDining": "Comedor privado",
    "page.contact.subject.specialOccasion": "Cumpleaños o celebración",
    "page.contact.subject.other": "Otro tema",
    "page.gallery.title": "Galería",
    "page.hours.title": "Horario",
    "page.hours.map": "Ubicación",
    "page.hours.mapIframeTitle": "Mapa: El Portero, Torrevieja",
    "page.admin.title": "Acceso admin",
    "footer.whatsapp": "WhatsApp",
    "footer.whatsappAria": "Abrir chat de WhatsApp con El Portero",
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
    "nav.events": "Events",
    "nav.reserve": "Bokningar",
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
    "page.menu.weeklyWeekTitle": "Lunch vecka {week}",
    "page.menu.weeklyIntro": "Lunch serveras måndag–fredag 11:00–15:00.",
    "page.menu.weeklyServiceLine": "Måndag–fredag 11:00–15:00.",
    "page.menu.weeklyLoading": "Laddar lunch…",
    "page.menu.weeklyEmpty":
      "Ingen lunchmeny är publicerad för den här veckan än. Kom tillbaka snart — eller be personalen publicera den i admin.",
    "page.menu.weeklyWeekLabel": "Vecka från",
    "page.menu.weeklyEffectiveLabel": "Aktiveras",
    "page.menu.weeklyMadridNote": "Veckostart (Madrid)",
    "page.menu.subnavAria": "Menydelar",
    "page.events.title": "Events",
    "page.events.heroSubtitle":
      "Vi kör egna öppna kvällar på restaurangen — temamiddagar, stora matcher på duk och gästspel i köket. Ni kan också låta oss värd för ert event: bröllop, företag och privata fester.",
    "page.events.heroInquiryCta": "Offertförfrågan",
    "page.events.heroInquiryAria": "Gå till kontakt — offertförfrågan för privata event",
    "page.events.explainPublicTitle": "Våra publika kvällar",
    "page.events.explainPublicBody":
      "Det här är kvällar vi lägger för alla gäster: specialmenyer, kockar på besök, sport och fotboll på storbild, och säsongsidéer längs vägen. Boka bord som vanligt — datum och info finns nedan när något är publicerat.",
    "page.events.explainPrivateTitle": "Ert event hos oss",
    "page.events.explainPrivateBody":
      "Ta över restaurangen för er skara — bröllop, företagsmiddagar, födelsedagar, provningar eller en helt privat fest. Berätta om datum, antal gäster och känsla; vi återkom med meny, upplägg och nästa steg.",
    "page.events.listHeading": "Kommande",
    "page.events.listEmpty": "Inga publicerade event ännu — kika snart igen.",
    "page.events.sectionOverviewLabel": "Publika kvällar och privata event",
    "page.story.title": "Vår historia",
    "page.story.intro":
      "Fin mat med dinner club-känsla på Costa Blanca — där sydamerikansk värme möter skandinavisk tydlighet. El Portero är vår inbjudan att ta tid och äta gott vid havet.",
    "page.story.sectionOriginTitle": "Det som förenar oss",
    "page.story.sectionOriginP1":
      "El Portero växte ur en enkel tanke: en restaurang som känns både festlig och precis. Vi lagar utifrån medelhavssäsonger och latinamerikansk generositet vid bordet, filtrerat genom nordisk rakhet — smakrikedom, ärliga råvaror och service som följer rummet.",
    "page.story.sectionOriginP2":
      "Vi finns i Torrevieja för att ljuset, råvarorna och havet sätter stämningen. Oavsett om du kommer för en lång avsmakningsmeny eller en livlig kväll med vänner vill vi att varje besök ska kännas genomtänkt.",
    "page.story.sectionMagnusTitle": "Husets målvakt",
    "page.story.sectionMagnusP1":
      "El Portero leds av Magnus Hedman — före detta professionell målvakt, landslagsman för Sverige och van vid trycket mellan stolparna på högsta nivå. Ett liv av att läsa spelet, hålla linjen och leverera när det gäller översätter väl till gästfrihet: lugnt tempo, förtroende vid bordet och ett lag som rör sig som ett.",
    "page.story.sectionMagnusP2":
      "I dag kanaliserar Magnus samma fokus till att välkomna gäster, forma salongen och bevara restaurangens särprägel — varm, tydlig och alltid mer än vardag.",
    "page.story.sectionPhilosophyTitle": "Hur vi lagar och värdskapar",
    "page.story.sectionPhilosophyBody":
      "Vi bygger menyer kring säsong, viner med omsorg och stunden du är i — från smakresor till generösa rätter att dela. Stora matcher, privata firanden och tysta vardagskvällar får plats här; den röda tråden är omsorg du känner på tallriken.",
    "page.story.sectionCoastTitle": "Vid Medelhavet",
    "page.story.sectionCoastBody":
      "På promenadavstånd från vattnet i Torrevieja, Alicante, välkomnar El Portero både resenärer och grannar. Boka gärna i förväg och berätta om ni firar något särskilt — vi gör vårt bästa för att göra kvällen minnesvärd.",
    "page.story.ctaReserve": "Boka bord",
    "page.story.ctaReserveAria": "Gå till bokning — boka bord på El Portero",
    "page.story.photoAltOrigin": "Tillagning vid pass — energi i köket",
    "page.story.photoAltMagnus":
      "Fotbollsplan ovanifrån — fokus, linjer och lagarbete",
    "page.story.photoAltTileA": "Vinglas och stämningsljus vid bordet",
    "page.story.photoAltTileB": "En varsamt komponerad rätt",
    "page.story.photoAltTileC": "Medelhavsråvaror att dela",
    "page.story.photoAltCoast": "Medelhavskust och öppet vatten",
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
    "page.reserve.altBookingTitle": "Boka via telefon eller WhatsApp",
    "page.reserve.altBookingOr": "Eller",
    "page.reserve.altCall": "Ring",
    "page.reserve.altWhatsApp": "WhatsApp",
    "page.reserve.altWhatsAppHint":
      "Skriv datum, tid och antal gäster.",
    "page.reserve.altCallAria": "Ring och boka bord",
    "page.reserve.altWhatsAppAria": "Boka via WhatsApp",
    "page.contact.title": "Kontakt",
    "page.contact.heroTitle": "Hör av dig",
    "page.contact.heroBody":
      "Frågor om bokningar, event, allergier eller annat — skriv en rad. Sändning och e-post kopplas snart till backend; formuläret är ännu en förhandsvisning.",
    "page.contact.labelName": "Namn",
    "page.contact.labelEmail": "E-post",
    "page.contact.labelSubject": "Ämne",
    "page.contact.labelMessage": "Meddelande",
    "page.contact.subjectPlaceholder": "Välj ett ämne",
    "page.contact.submitSoon": "Skicka meddelande (snart)",
    "page.contact.policyNote":
      "Vi läser allt. Svar brukar komma inom några vardagar. Ingen betalning eller bokning bekräftas via formuläret ännu.",
    "page.contact.validationName": "Ange ditt namn.",
    "page.contact.validationEmail": "Ange din e-postadress.",
    "page.contact.validationEmailFormat": "E-postadressen verkar ogiltig.",
    "page.contact.validationSubject": "Välj ett ämne.",
    "page.contact.validationMessage": "Skriv ett meddelande.",
    "page.contact.validationOkNotSent":
      "Meddelandet ser redo ut — onlineutskick är inte aktiverat än, inget skickades.",
    "page.contact.validationSummary": "Korrigera de markerade fälten.",
    "page.contact.validationTooFast":
      "Vänta lite innan du skickar — det hjälper oss stoppa automatiska inskick.",
    "page.contact.placeholderName": "Ditt namn",
    "page.contact.placeholderEmail": "exempel@exempel.se",
    "page.contact.placeholderMessage":
      "Skriv vad du behöver — datum, antal gäster, allergier…",
    "page.contact.spamNote":
      "Skydd mot skräppost: fyll inte i dolda fält och vänta en kort stund efter att sidan laddats innan du skickar.",
    "page.contact.subject.general": "Allmän fråga",
    "page.contact.subject.reservation": "Fråga om bokning",
    "page.contact.subject.privateEvent": "Privat event eller catering",
    "page.contact.subject.feedbackVisit": "Synpunkter efter besök",
    "page.contact.subject.dietaryAllergies": "Kost eller allergier",
    "page.contact.subject.largeGroup": "Större sällskap",
    "page.contact.subject.giftCard": "Presentkort eller värdebevis",
    "page.contact.subject.pressMedia": "Press och media",
    "page.contact.subject.partnership": "Samarbete eller partnerskap",
    "page.contact.subject.careers": "Jobb och karriär",
    "page.contact.subject.lostProperty": "Hittegods",
    "page.contact.subject.accessibility": "Tillgänglighet",
    "page.contact.subject.wineCellar": "Vinlista eller källare",
    "page.contact.subject.hoursLocation": "Tider, parkering eller vägbeskrivning",
    "page.contact.subject.billing": "Faktura, kvitto eller betalning",
    "page.contact.subject.privateDining": "Privat matsal",
    "page.contact.subject.specialOccasion": "Födelsedag eller firande",
    "page.contact.subject.other": "Annat",
    "page.gallery.title": "Galleri",
    "page.hours.title": "Öppettider",
    "page.hours.map": "Plats",
    "page.hours.mapIframeTitle": "Karta: El Portero, Torrevieja",
    "page.admin.title": "Admininloggning",
    "footer.whatsapp": "WhatsApp",
    "footer.whatsappAria": "Öppna WhatsApp-chatt med El Portero",
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

/** e.g. "Lunch week 16" — pair with `uppercase` + tracking classes for "LUNCH WEEK 16". */
export function weeklyMenuWeekTitle(locale: Locale, isoWeek: number): string {
  return messages[locale]["page.menu.weeklyWeekTitle"].replace("{week}", String(isoWeek));
}
