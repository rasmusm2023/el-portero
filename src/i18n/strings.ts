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
  | "nav.bookTable"
  | "nav.contact"
  | "nav.gallery"
  | "nav.hours"
  | "nav.admin";

type PageKey =
  | "page.home.title"
  | "page.home.instagramAria"
  | "page.home.instagramFollow"
  | "page.home.instagramGridAria"
  | "page.home.eventsHeading"
  | "page.home.eventsIntro"
  | "page.home.eventsViewAll"
  | "page.home.eventsScrollHint"
  | "page.home.eventsEmpty"
  | "page.home.eventsLoading"
  | "page.home.heroReserveCta"
  | "page.home.heroTagline"
  | "page.home.countdownLabel"
  | "page.comingSoon.title"
  | "page.comingSoon.subtitle"
  | "page.comingSoon.contactCta"
  | "page.comingSoon.instagramCta"
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
  | "page.menu.scheduleLunch"
  | "page.menu.scheduleAlacarte"
  | "page.menu.scheduleBrunch"
  | "page.menu.scheduleDrinks"
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
  | "page.menu.hubHint"
  | "page.menu.preLaunchTitle"
  | "page.menu.preLaunchBody"
  | "page.menu.countdownHeading"
  | "page.menu.countdownDays"
  | "page.menu.countdownHours"
  | "page.menu.countdownMinutes"
  | "page.menu.countdownSeconds"
  | "page.menu.countdownLive"
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
  | "page.events.listLoading"
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
  | "page.story.comingSoonBody"
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
  | "page.contact.phoneLabel"
  | "page.contact.emailLabel"
  | "page.gallery.srHeading"
  | "page.gallery.imageAlt1"
  | "page.gallery.imageAlt2"
  | "page.gallery.imageAlt3"
  | "page.gallery.caption1"
  | "page.gallery.caption2"
  | "page.gallery.caption3"
  | "page.gallery.body1"
  | "page.gallery.body2"
  | "page.gallery.body3"
  | "page.hours.title"
  | "page.hours.map"
  | "page.hours.mapIframeTitle"
  | "page.admin.title";

type FooterKey =
  | "footer.whatsapp"
  | "footer.whatsappAria"
  | "footer.tagline"
  | "footer.links"
  | "footer.openInMaps";

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
    "nav.reserve": "Book a table",
    "nav.bookTable": "Book a table",
    "nav.contact": "Contact",
    "nav.gallery": "Look inside",
    "nav.hours": "Hours",
    "nav.admin": "Admin",
    "page.home.title": "Welcome",
    "page.home.instagramAria": "Instagram",
    "page.home.instagramFollow": "Follow us",
    "page.home.instagramGridAria": "Latest posts on Instagram",
    "page.home.eventsHeading": "Upcoming events",
    "page.home.eventsIntro":
      "Nights to book early — tastings, one-off menus, and collaborations that won’t roll around twice.",
    "page.home.eventsViewAll": "All events",
    "page.home.eventsScrollHint": "Scroll sideways for more",
    "page.home.eventsEmpty":
      "There are no published public events at the moment. Check back soon, follow us on Instagram, or ask about a private dinner.",
    "page.home.eventsLoading": "Loading events…",
    "page.home.heroReserveCta": "Book a table",
    "page.home.heroTagline":
      "Latin American heart meets Nordic elegance in Torrevieja.\n— Just a throw-in from the Mediterranean.",
    "page.home.countdownLabel": "Opening",
    "page.comingSoon.title": "Coming soon",
    "page.comingSoon.subtitle":
      "We’re setting the room, polishing the glassware, and finalising the menu. Check back soon—or follow along for opening updates.",
    "page.comingSoon.contactCta": "Contact us",
    "page.comingSoon.instagramCta": "Follow on Instagram",
    "page.menu.title": "Our menus",
    "page.menu.food": "Highlights",
    "page.menu.drinks": "Drinks",
    "page.menu.brunch": "Brunch",
    "page.menu.alacarte": "À la carte",
    "page.menu.foodHeading": "Seasonal highlights",
    "page.menu.drinksHeading": "Drinks menu",
    "page.menu.brunchHeading": "Brunch menu",
    "page.menu.alacarteHeading": "À la carte",
    "page.menu.drinksIntro":
      "Wines by the glass and bottle, apéritifs, and pairings — our list evolves with the cellar and the seasons.",
    "page.menu.foodIntro":
      "A rotating snapshot of how we cook — for this week’s set lunch menu, open Lunch.",
    "page.menu.brunchIntro":
      "Weekend brunch — pastries, eggs, and lighter plates. Times and dishes may change with the season.",
    "page.menu.alacarteIntro":
      "Order by course or choose the chef’s tasting — ingredients follow the market and the kitchen’s daily prep.",
    "page.menu.seeMenu": "See menu",
    "page.menu.scheduleLunch": "Mon–Fri · 11:00–15:00",
    "page.menu.scheduleAlacarte": "Mon–Sat · 15:00–22:00",
    "page.menu.scheduleBrunch": "Sat–Sun · 10:00–14:00",
    "page.menu.scheduleDrinks": "Daily · 12:00–00:00",
    "page.menu.weekly": "Lunch",
    "page.menu.weeklyHeading": "Lunch",
    "page.menu.weeklyWeekTitle": "Lunch week {week}",
    "page.menu.weeklyIntro": "Lunch is served Monday–Friday, 11:00–15:00.",
    "page.menu.weeklyServiceLine": "Monday–Friday, 11:00–15:00.",
    "page.menu.weeklyLoading": "Loading lunch…",
    "page.menu.weeklyEmpty":
      "This week’s lunch menu is not online yet. Please check back shortly or call us for today’s offering.",
    "page.menu.weeklyWeekLabel": "Week of",
    "page.menu.weeklyEffectiveLabel": "Goes live",
    "page.menu.weeklyMadridNote": "Lunch week anchor (Sat, Madrid)",
    "page.menu.hubHint":
      "Choose a menu above — each section opens in full beneath, dishes, pairings, and all.",
    "page.menu.preLaunchTitle": "Menus publish on opening night",
    "page.menu.preLaunchBody":
      "Lunch, à la carte, brunch, and our full drinks list go live here on 14 May — the same evening we raise the curtain in Torrevieja. Until then, we’re taking reservations and happy to answer questions by phone or WhatsApp.",
    "page.menu.countdownHeading": "Menus go live in",
    "page.menu.countdownDays": "Days",
    "page.menu.countdownHours": "Hours",
    "page.menu.countdownMinutes": "Minutes",
    "page.menu.countdownSeconds": "Seconds",
    "page.menu.countdownLive": "Days remaining until menus are published",
    "page.menu.subnavAria": "Menu sections",
    "page.events.title": "Events",
    "page.events.heroSubtitle":
      "We host our own evenings at the restaurant — themed dinners, watch parties on the big screen, and guest stints in the kitchen. Prefer something private? We also welcome weddings, corporate tables, and celebrations with a door you can close.",
    "page.events.heroInquiryCta": "Request a quote",
    "page.events.heroInquiryAria": "Go to contact — request a quote for private events",
    "page.events.explainPublicTitle": "Our public events",
    "page.events.explainPublicBody":
      "These are evenings we put on for everyone: special menus, guest chefs, football and sports nights on the big screen, and seasonal ideas as we go. Grab a table like any other visit — dates and details are below when something is live.",
    "page.events.explainPrivateTitle": "Your event here",
    "page.events.explainPrivateBody":
      "Hire the restaurant for your crowd — weddings, company dinners, birthdays, tastings, or a fully private celebration. Tell us your date, group size, and mood; we’ll come back with menus, pacing, and a clear way forward.",
    "page.events.listHeading": "Coming up",
    "page.events.listEmpty":
      "There are no published public events on the calendar right now. Check back soon, or contact us about a private booking.",
    "page.events.listLoading": "Loading events…",
    "page.events.sectionOverviewLabel": "Public nights and private events",
    "page.story.title": "Our story",
    "page.story.intro":
      "Fine dining with a dinner-club heartbeat on the Costa Blanca — South American warmth, Swedish clarity, and tables meant for unhurried nights by the sea.",
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
    "page.story.comingSoonBody":
      "We’re adding the final touch to our full story — you’ll find it here soon.",
    "page.reserve.title": "Reservations",
    "page.reserve.heroTitle": "Reserve your table",
    "page.reserve.heroBody":
      "Tell us when you’d like to join us — seasonal cooking, warm service, and the dinner-club spirit a few minutes from the water. We’ll confirm by email or phone.",
    "page.reserve.labelGuests": "Party size",
    "page.reserve.labelDate": "Date",
    "page.reserve.datePlaceholder": "Choose a date",
    "page.reserve.labelTime": "Time",
    "page.reserve.timePlaceholder": "Select a time",
    "page.reserve.policyNote":
      "We ask for at least 24 hours’ notice to cancel or change a booking. Late changes may be subject to our house policy.",
    "page.reserve.submitSoon": "Request a table",
    "page.reserve.bookNow": "Book now",
    "page.reserve.bookNowDisabledHint":
      "Complete party size, date, and time to continue — online confirmation will follow from our team.",
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
    "page.contact.heroTitle": "We’re listening",
    "page.contact.heroBody":
      "Call us or send an email — we’ll get back as soon as we can. Reservations are not confirmed until we reply.",
    "page.contact.phoneLabel": "Phone",
    "page.contact.emailLabel": "Email",
    "page.gallery.srHeading": "A glimpse of El Portero",
    "page.gallery.imageAlt1":
      "Grilled meat and vegetable skewers from the grill — South American–inspired cooking",
    "page.gallery.imageAlt2":
      "Swedish meatballs with mashed potatoes and cranberry sauce on the table",
    "page.gallery.imageAlt3":
      "Bartender mixing cocktails at the bar counter",
    "page.gallery.caption1":
      "South American soul, straight from the grill.",
    "page.gallery.caption2":
      "Swedish comfort meets Latin warmth — on one table.",
    "page.gallery.caption3":
      "A bar built for the long arc of the evening.",
    "page.gallery.body1":
      "We are a restaurant shaped by South American cooking — charcoal, bold marinades, and generous plates made for passing and sharing. The grill is where our flavours come alive, steps from the Mediterranean.",
    "page.gallery.body2":
      "We also bring Swedish food to the table — honest classics and Nordic comfort — and fuse it with our South American kitchen so every dinner feels like two traditions talking across the same menu.",
    "page.gallery.body3":
      "Our bar keeps pace with the kitchen: precise cocktails, warm service, and a counter where you can begin the night with a drink or settle in for one more after dessert.",
    "page.hours.title": "Opening hours",
    "page.hours.map": "Location",
    "page.hours.mapIframeTitle": "Map: El Portero, Torrevieja",
    "page.admin.title": "Admin sign-in",
    "header.menuLabel": "MENU",
    "header.closeNav": "Close menu",
    "header.openNav": "Open menu",
    "header.navDialog": "Site navigation",
    "header.reserveTable": "Book a table",
    "header.reserveNav": "Book a table",
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
    "footer.tagline":
      "A Torrevieja restaurant on Spain's Costa Blanca with dinner-club energy — Latin generosity at the table, Nordic discipline in the kitchen, and the Mediterranean a short walk away.",
    "footer.links": "Quick links",
    "footer.openInMaps": "Open in Google Maps",
    "brand.dinnerClub": "Dinner Club",
  },
  es: {
    "nav.home": "Inicio",
    "nav.story": "Nuestra historia",
    "nav.menu": "Cartas",
    "nav.events": "Eventos",
    "nav.reserve": "Reservar mesa",
    "nav.bookTable": "Reservar mesa",
    "nav.contact": "Contacto",
    "nav.gallery": "Echa un vistazo",
    "nav.hours": "Horario",
    "nav.admin": "Admin",
    "page.home.title": "Bienvenidos",
    "page.home.instagramAria": "Instagram",
    "page.home.instagramFollow": "Síguenos",
    "page.home.instagramGridAria": "Últimas publicaciones en Instagram",
    "page.home.eventsHeading": "Próximos eventos",
    "page.home.eventsIntro":
      "Noches para reservar con tiempo — catas, menús puntuales y colaboraciones que no se repiten.",
    "page.home.eventsViewAll": "Todos los eventos",
    "page.home.eventsScrollHint": "Desplázate horizontalmente para ver más",
    "page.home.eventsEmpty":
      "No hay eventos públicos publicados en este momento. Volved pronto, seguid en Instagram o escribid para una cena privada.",
    "page.home.eventsLoading": "Cargando eventos…",
    "page.home.heroReserveCta": "Reservar mesa",
    "page.home.heroTagline":
      "Corazón latinoamericano y elegancia nórdica en Torrevieja.\n— A solo un saque de banda del Mediterráneo.",
    "page.home.countdownLabel": "Apertura",
    "page.comingSoon.title": "Próximamente",
    "page.comingSoon.subtitle":
      "Estamos preparando la sala, puliendo las copas y cerrando la carta. Volved pronto o seguidnos para novedades de apertura.",
    "page.comingSoon.contactCta": "Contactar",
    "page.comingSoon.instagramCta": "Seguir en Instagram",
    "page.menu.title": "Nuestras cartas",
    "page.menu.food": "Selección",
    "page.menu.drinks": "Bebidas",
    "page.menu.brunch": "Brunch",
    "page.menu.alacarte": "A la carta",
    "page.menu.foodHeading": "Selección de temporada",
    "page.menu.drinksHeading": "Carta de bebidas",
    "page.menu.brunchHeading": "Brunch",
    "page.menu.alacarteHeading": "A la carta",
    "page.menu.drinksIntro":
      "Vinos por copa y botella, aperitivos y maridajes — la carta evoluciona con la bodega y la temporada.",
    "page.menu.foodIntro":
      "Una muestra viva de nuestra cocina — para el menú de almuerzo de la semana, abrid Almuerzo.",
    "page.menu.brunchIntro":
      "Brunch de fin de semana — bollería, huevos y platos ligeros. Horarios y carta pueden variar con la temporada.",
    "page.menu.alacarteIntro":
      "Elige por platos o el menú degustación del chef — el producto sigue el mercado y el día a día de cocina.",
    "page.menu.seeMenu": "Ver carta",
    "page.menu.scheduleLunch": "Lun–Vie · 11:00–15:00",
    "page.menu.scheduleAlacarte": "Lun–Sáb · 15:00–22:00",
    "page.menu.scheduleBrunch": "Sáb–Dom · 10:00–14:00",
    "page.menu.scheduleDrinks": "Diario · 12:00–00:00",
    "page.menu.weekly": "Almuerzo",
    "page.menu.weeklyHeading": "Almuerzo",
    "page.menu.weeklyWeekTitle": "Almuerzo semana {week}",
    "page.menu.weeklyIntro": "Almuerzo de lunes a viernes, 11:00–15:00.",
    "page.menu.weeklyServiceLine": "De lunes a viernes, 11:00–15:00.",
    "page.menu.weeklyLoading": "Cargando almuerzo…",
    "page.menu.weeklyEmpty":
      "La carta de almuerzo de esta semana aún no está en la web. Volved en breve o llamad para la oferta del día.",
    "page.menu.weeklyWeekLabel": "Semana del",
    "page.menu.weeklyEffectiveLabel": "Activo desde",
    "page.menu.weeklyMadridNote": "Ancla de la semana de almuerzo (sáb., Madrid)",
    "page.menu.hubHint":
      "Elegid una carta arriba — cada sección se abre completa debajo, con platos, maridajes y todo el detalle.",
    "page.menu.preLaunchTitle": "Las cartas se publican el día de la apertura",
    "page.menu.preLaunchBody":
      "Almuerzo, a la carta, brunch y la carta de bebidas completas estarán aquí el 14 de mayo — la misma noche del estreno en Torrevieja. Hasta entonces aceptamos reservas y resolvemos dudas por teléfono o WhatsApp.",
    "page.menu.countdownHeading": "Publicación de cartas en",
    "page.menu.countdownDays": "Días",
    "page.menu.countdownHours": "Horas",
    "page.menu.countdownMinutes": "Minutos",
    "page.menu.countdownSeconds": "Segundos",
    "page.menu.countdownLive": "Días restantes hasta publicar las cartas",
    "page.menu.subnavAria": "Secciones de la carta",
    "page.events.title": "Eventos",
    "page.events.heroSubtitle":
      "Montamos nuestras propias veladas en casa — cenas temáticas, grandes partidos en pantalla y invitados en cocina. ¿Celebración a medida? También acogemos bodas, empresas y fiestas con puerta cerrada.",
    "page.events.heroInquiryCta": "Solicitar presupuesto",
    "page.events.heroInquiryAria": "Ir a contacto — solicitar presupuesto para eventos privados",
    "page.events.explainPublicTitle": "Eventos abiertos",
    "page.events.explainPublicBody":
      "Son noches que montamos para todo el mundo: menús especiales, chefs invitados, noches de fútbol y deporte en pantalla grande, y propuestas de temporada. Reservad mesa como en cualquier otra visita — abajo tenéis fechas y detalles cuando haya cartel.",
    "page.events.explainPrivateTitle": "Vuestra celebración aquí",
    "page.events.explainPrivateBody":
      "Reservad el restaurante para vuestro grupo — bodas, cenas de empresa, cumpleaños, catas o una celebración a puerta cerrada. Decidnos fecha, tamaño del grupo y ambición; volveremos con menús, ritmo y siguientes pasos claros.",
    "page.events.listHeading": "Próximas fechas",
    "page.events.listEmpty":
      "No hay eventos públicos publicados en el calendario ahora mismo. Volved pronto o contactad para una reserva privada.",
    "page.events.listLoading": "Cargando eventos…",
    "page.events.sectionOverviewLabel": "Eventos abiertos y celebraciones privadas",
    "page.story.title": "Nuestra historia",
    "page.story.intro":
      "Alta cocina con latido de club en la Costa Blanca — calidez latina, claridad sueca y mesas para largas veladas junto al mar.",
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
    "page.story.comingSoonBody":
      "Estamos dando el toque final a nuestra historia completa — la encontraréis aquí en breve.",
    "page.reserve.title": "Reservas",
    "page.reserve.heroTitle": "Reservad mesa",
    "page.reserve.heroBody":
      "Decidnos cuándo queréis venir — cocina de temporada, servicio cercano y espíritu club a minutos del agua. Confirmaremos por correo o teléfono.",
    "page.reserve.labelGuests": "Comensales",
    "page.reserve.labelDate": "Fecha",
    "page.reserve.datePlaceholder": "Elija una fecha",
    "page.reserve.labelTime": "Hora",
    "page.reserve.timePlaceholder": "Elija una hora",
    "page.reserve.policyNote":
      "Pedimos aviso de al menos 24 horas para cancelar o cambiar una reserva. Los cambios tardíos pueden estar sujetos a nuestra política de casa.",
    "page.reserve.submitSoon": "Solicitar mesa",
    "page.reserve.bookNow": "Reservar",
    "page.reserve.bookNowDisabledHint":
      "Completad comensales, fecha y hora para continuar — la confirmación la enviará nuestro equipo.",
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
    "page.contact.heroTitle": "Escribidnos",
    "page.contact.heroBody":
      "Llamad o escribid un correo — contestamos en cuanto podamos. Las reservas no quedan confirmadas hasta que os respondamos.",
    "page.contact.phoneLabel": "Teléfono",
    "page.contact.emailLabel": "Correo",
    "page.gallery.srHeading": "Un vistazo a El Portero",
    "page.gallery.imageAlt1":
      "Brochetas de carne y verdura a la parrilla — cocina con alma sudamericana",
    "page.gallery.imageAlt2":
      "Albóndigas suecas con puré y arándanos en la mesa",
    "page.gallery.imageAlt3":
      "Camarero preparando cócteles en la barra",
    "page.gallery.caption1":
      "Alma sudamericana, directa desde la parrilla.",
    "page.gallery.caption2":
      "Confort nórdico y calor latino — en la misma mesa.",
    "page.gallery.caption3":
      "Una barra pensada para toda la velada.",
    "page.gallery.body1":
      "Somos un restaurante con la cocina sudamericana como brújula — brasa, marinados vivos y platos generosos para compartir. La parrilla es el corazón de cómo cocinamos, a un paso del Mediterráneo.",
    "page.gallery.body2":
      "También llevamos la cocina sueca a la mesa — clásicos sinceros y ese confort nórdico — y la fundimos con nuestra cocina sudamericana para que cada cena sea un diálogo entre dos orillas en la misma carta.",
    "page.gallery.body3":
      "Nuestra barra va al ritmo de cocina: cócteles cuidados, servicio cercano y un mostrador donde empezar la noche con un trago o quedaros para uno más después del postre.",
    "page.hours.title": "Horario",
    "page.hours.map": "Ubicación",
    "page.hours.mapIframeTitle": "Mapa: El Portero, Torrevieja",
    "page.admin.title": "Acceso admin",
    "footer.whatsapp": "WhatsApp",
    "footer.whatsappAria": "Abrir chat de WhatsApp con El Portero",
    "footer.tagline":
      "Restaurante en Torrevieja, en la Costa Blanca, con alma de dinner club — generosidad latina en la mesa, disciplina nórdica en cocina y el Mediterráneo a un paseo.",
    "footer.links": "Enlaces rápidos",
    "footer.openInMaps": "Abrir en Google Maps",
    "header.menuLabel": "MENÚ",
    "header.closeNav": "Cerrar menú",
    "header.openNav": "Abrir menú",
    "header.navDialog": "Navegación",
    "header.reserveTable": "Reservar mesa",
    "header.reserveNav": "Reservar mesa",
    "brand.dinnerClub": "Dinner Club",
  },
  sv: {
    "nav.home": "Hem",
    "nav.story": "Vår historia",
    "nav.menu": "Menyer",
    "nav.events": "Events",
    "nav.reserve": "Boka bord",
    "nav.bookTable": "Boka bord",
    "nav.contact": "Kontakt",
    "nav.gallery": "En glimt in",
    "nav.hours": "Öppettider",
    "nav.admin": "Admin",
    "page.home.title": "Välkommen",
    "page.home.instagramAria": "Instagram",
    "page.home.instagramFollow": "Följ oss",
    "page.home.instagramGridAria": "Senaste inläggen på Instagram",
    "page.home.eventsHeading": "Kommande evenemang",
    "page.home.eventsIntro":
      "Kvällar att boka i förväg — provningar, engångsmenyer och samarbeten som inte kommer tillbaka på repeat.",
    "page.home.eventsViewAll": "Alla evenemang",
    "page.home.eventsScrollHint": "Scrolla åt sidan för fler",
    "page.home.eventsEmpty":
      "Det finns inga publicerade publika evenemang just nu. Kom tillbaka snart, följ oss på Instagram eller hör av dig om en privat middag.",
    "page.home.eventsLoading": "Laddar evenemang…",
    "page.home.heroReserveCta": "Boka bord",
    "page.home.heroTagline":
      "Latinamerikanskt hjärta möter nordisk elegans i Torrevieja.\n— Bara ett inkast från Medelhavet.",
    "page.home.countdownLabel": "Öppning",
    "page.comingSoon.title": "Snart öppnar vi",
    "page.comingSoon.subtitle":
      "Vi dukar upp, putsar glasen och färdigställer menyn. Kom tillbaka snart – eller följ oss för öppningsnyheter.",
    "page.comingSoon.contactCta": "Kontakta oss",
    "page.comingSoon.instagramCta": "Följ på Instagram",
    "page.menu.title": "Våra menyer",
    "page.menu.food": "Höjdpunkter",
    "page.menu.drinks": "Dryck",
    "page.menu.brunch": "Brunch",
    "page.menu.alacarte": "À la carte",
    "page.menu.foodHeading": "Säsongens höjdpunkter",
    "page.menu.drinksHeading": "Dryckesmeny",
    "page.menu.brunchHeading": "Brunchmeny",
    "page.menu.alacarteHeading": "À la carte",
    "page.menu.drinksIntro":
      "Vin på glas och flaska, aperitifer och maridage — listan följer vinkällaren och säsongen.",
    "page.menu.foodIntro":
      "Ett levande urval av vårt kök — veckans lunchmeny finns under Lunch.",
    "page.menu.brunchIntro":
      "Helgbrunch — bakverk, ägg och lättare rätter. Tider och utbud kan ändras med säsongen.",
    "page.menu.alacarteIntro":
      "Välj rätter fristående eller kockens avsmakning — råvaror följer marknad och kökets dagsform.",
    "page.menu.seeMenu": "Se menyn",
    "page.menu.scheduleLunch": "Mån–Fre · 11:00–15:00",
    "page.menu.scheduleAlacarte": "Mån–Lör · 15:00–22:00",
    "page.menu.scheduleBrunch": "Lör–Sön · 10:00–14:00",
    "page.menu.scheduleDrinks": "Dagligen · 12:00–00:00",
    "page.menu.weekly": "Lunch",
    "page.menu.weeklyHeading": "Lunch",
    "page.menu.weeklyWeekTitle": "Lunch vecka {week}",
    "page.menu.weeklyIntro": "Lunch serveras måndag–fredag 11:00–15:00.",
    "page.menu.weeklyServiceLine": "Måndag–fredag 11:00–15:00.",
    "page.menu.weeklyLoading": "Laddar lunch…",
    "page.menu.weeklyEmpty":
      "Veckans lunchmeny är inte publicerad än. Kom tillbaka snart eller ring oss för dagens erbjudande.",
    "page.menu.weeklyWeekLabel": "Vecka från",
    "page.menu.weeklyEffectiveLabel": "Aktiveras",
    "page.menu.weeklyMadridNote": "Lunchveckans ankare (lör, Madrid)",
    "page.menu.hubHint":
      "Välj meny ovan — varje del öppnas i full längd nedanför, med rätter, maridage och allt du behöver.",
    "page.menu.preLaunchTitle": "Menyerna publiceras på öppningskvällen",
    "page.menu.preLaunchBody":
      "Lunch, à la carte, brunch och hela dryckeslistan publiceras här den 14 maj — samma kväll som vi sätter igång i Torrevieja. Tills dess tar vi emot bokningar och svarar gärna via telefon eller WhatsApp.",
    "page.menu.countdownHeading": "Menyerna publiceras om",
    "page.menu.countdownDays": "Dagar",
    "page.menu.countdownHours": "Timmar",
    "page.menu.countdownMinutes": "Minuter",
    "page.menu.countdownSeconds": "Sekunder",
    "page.menu.countdownLive": "Dagar kvar tills menyerna publiceras",
    "page.menu.subnavAria": "Menydelar",
    "page.events.title": "Events",
    "page.events.heroSubtitle":
      "Vi kör egna kvällar på restaurangen — temamiddagar, stora matcher på duk och gästkockar. Vill ni stänga dörren? Vi tar också emot bröllop, företag och privata firanden.",
    "page.events.heroInquiryCta": "Offertförfrågan",
    "page.events.heroInquiryAria": "Gå till kontakt — offertförfrågan för privata event",
    "page.events.explainPublicTitle": "Våra publika kvällar",
    "page.events.explainPublicBody":
      "Det här är kvällar vi lägger för alla gäster: specialmenyer, kockar på besök, sport och fotboll på storbild, och säsongsidéer längs vägen. Boka bord som vanligt — datum och info finns nedan när något är publicerat.",
    "page.events.explainPrivateTitle": "Ert event hos oss",
    "page.events.explainPrivateBody":
      "Ta över restaurangen för er skara — bröllop, företagsmiddagar, födelsedagar, provningar eller en helt privat fest. Berätta om datum, antal gäster och känsla; vi återkom med meny, upplägg och nästa steg.",
    "page.events.listHeading": "Kommande",
    "page.events.listEmpty":
      "Det finns inga publicerade publika evenemang i kalendern just nu. Kom tillbaka snart eller kontakta oss om en privat bokning.",
    "page.events.listLoading": "Laddar evenemang…",
    "page.events.sectionOverviewLabel": "Publika kvällar och privata event",
    "page.story.title": "Vår historia",
    "page.story.intro":
      "Fin gastronomi med dinner club-puls på Costa Blanca — latinamerikansk värme, svensk tydlighet och bord som får ta sin tid vid havet.",
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
    "page.story.comingSoonBody":
      "Vi lägger sista touchen på hela vår berättelse — du hittar den här inom kort.",
    "page.reserve.title": "Bokning",
    "page.reserve.heroTitle": "Boka ert bord",
    "page.reserve.heroBody":
      "Berätta när ni vill komma — säsongens råvaror, varmt värdskap och clubkänsla minuter från vattnet. Vi bekräftar via mejl eller telefon.",
    "page.reserve.labelGuests": "Gäster",
    "page.reserve.labelDate": "Datum",
    "page.reserve.datePlaceholder": "Välj datum",
    "page.reserve.labelTime": "Tid",
    "page.reserve.timePlaceholder": "Välj tid",
    "page.reserve.policyNote":
      "Vi ber om minst 24 timmars varsel vid avbokning eller ändring. Sena ändringar kan omfattas av vår huspolicy.",
    "page.reserve.submitSoon": "Begär bord",
    "page.reserve.bookNow": "Boka nu",
    "page.reserve.bookNowDisabledHint":
      "Fyll i antal gäster, datum och tid för att gå vidare — bekräftelse kommer från vårt team.",
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
      "Ring eller mejla — vi återkommer så fort vi kan. Bokningar är inte bekräftade förrän vi hört av oss.",
    "page.contact.phoneLabel": "Telefon",
    "page.contact.emailLabel": "E-post",
    "page.gallery.srHeading": "En glimt av El Portero",
    "page.gallery.imageAlt1":
      "Grillade kött- och grönsaksspett — sydamerikanskt inspirerad mat från grillen",
    "page.gallery.imageAlt2":
      "Svenska köttbullar med potatismos och lingon på tallriken",
    "page.gallery.imageAlt3":
      "Bartender som blandar drinkar i baren",
    "page.gallery.caption1":
      "Sydamerikansk själ, rakt från grillen.",
    "page.gallery.caption2":
      "Svensk hemkänsla möter latinamerikansk värme — vid samma bord.",
    "page.gallery.caption3":
      "En bar som hänger med hela kvällen.",
    "page.gallery.body1":
      "Vi är en restaurang formad av sydamerikansk matlagning — kolglöd, tydliga marinader och generösa tallrikar att dela. Grillen är navet i hur vi lagar mat, ett stenkast från Medelhavet.",
    "page.gallery.body2":
      "Vi för också svensk mat till bordet — ärliga klassiker och nordisk trygghet — och smälter ihop den med vårt sydamerikanska kök så varje middag känns som två traditioner i samma meny.",
    "page.gallery.body3":
      "Vår bar håller samma tempo som köket: genomtänkta cocktails, varm service och en disk där ni kan börja kvällen med en drink eller stanna för en sista efter desserten.",
    "page.hours.title": "Öppettider",
    "page.hours.map": "Plats",
    "page.hours.mapIframeTitle": "Karta: El Portero, Torrevieja",
    "page.admin.title": "Admininloggning",
    "footer.whatsapp": "WhatsApp",
    "footer.whatsappAria": "Öppna WhatsApp-chatt med El Portero",
    "footer.tagline":
      "Restaurang i Torrevieja på Costa Blanca med dinner club-känsla — latinamerikansk generositet vid bordet, nordisk disciplin i köket och Medelhavet inom gångavstånd.",
    "footer.links": "Snabblänkar",
    "footer.openInMaps": "Öppna i Google Maps",
    "header.menuLabel": "MENY",
    "header.closeNav": "Stäng meny",
    "header.openNav": "Öppna menyn",
    "header.navDialog": "Navigering",
    "header.reserveTable": "Boka bord",
    "header.reserveNav": "Boka bord",
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
