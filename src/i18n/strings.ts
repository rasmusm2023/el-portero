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
  | "page.home.instagramGridAria"
  | "page.home.eventsHeading"
  | "page.home.eventsIntro"
  | "page.home.eventsViewAll"
  | "page.home.eventsCta"
  | "page.home.eventsScrollHint"
  | "page.home.eventsEmpty"
  | "page.home.heroReserveCta"
  | "page.home.heroTagline"
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
  | "footer.findUs"
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
    "nav.reserve": "Reservations",
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
    "page.home.eventsCta": "Details",
    "page.home.eventsScrollHint": "Scroll sideways for more",
    "page.home.eventsEmpty":
      "The calendar is being set — we’ll list dates here as soon as they’re public. For now, follow us on Instagram or drop us a line about a private dinner.",
    "page.home.heroReserveCta": "RESERVATION",
    "page.home.heroTagline":
      "South American heart, Nordic poise — dinner-club nights one step from the Mediterranean.",
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
    "page.menu.weeklyMadridNote": "Madrid week start",
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
      "No dates on the board yet — check back shortly, or ask us about a private booking.",
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
      "Reservations, private events, dietary requirements, directions — we read every message and reply as soon as we can.",
    "page.contact.labelName": "Name",
    "page.contact.labelEmail": "Email",
    "page.contact.labelSubject": "Subject",
    "page.contact.labelMessage": "Message",
    "page.contact.subjectPlaceholder": "Choose a topic",
    "page.contact.submitSoon": "Send message",
    "page.contact.policyNote":
      "We aim to respond within a few business days. Reservations and payments are not confirmed until we reply.",
    "page.contact.validationName": "Please enter your name.",
    "page.contact.validationEmail": "Please enter your email address.",
    "page.contact.validationEmailFormat": "That doesn’t look like a valid email address.",
    "page.contact.validationSubject": "Please choose a subject.",
    "page.contact.validationMessage": "Please enter a message.",
    "page.contact.validationOkNotSent":
      "Your message is ready to send — if outbound email is not yet enabled here, please call or WhatsApp us instead.",
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
    "page.gallery.srHeading": "A glimpse of El Portero",
    "page.gallery.imageAlt1":
      "Dining room with warm light, set tables, and an inviting atmosphere",
    "page.gallery.imageAlt2":
      "Wine glasses and table setting for an evening at the restaurant",
    "page.gallery.imageAlt3":
      "Chef carefully plating a dish at the pass",
    "page.gallery.caption1":
      "Soft light, crisp linen, and a room made for long evenings by the sea.",
    "page.gallery.caption2":
      "Glassware and pairings chosen with the same care we bring to every course.",
    "page.gallery.caption3":
      "From the pass to your plate — seasonal, deliberate, never on autopilot.",
    "page.gallery.body1":
      "Anchored in Torrevieja, our dining room is dressed for unhurried conversation — the kind of evening that begins with a glass and ends with the lights low.",
    "page.gallery.body2":
      "Wines, cocktails, and pairings that keep pace with the kitchen — the coast gives us the ingredients; we give them a reason to dress up.",
    "page.gallery.body3":
      "Every service is choreographed from the pass: timing, temperature, and the small gestures that turn a meal into a memory.",
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
    "footer.tagline":
      "Fine dining on the Costa Blanca with a dinner-club pulse — Latin generosity at the table, Nordic discipline in the kitchen, and the sea within walking distance.",
    "footer.findUs": "Find us",
    "footer.links": "Quick links",
    "footer.openInMaps": "Open in Google Maps",
    "brand.dinnerClub": "Dinner Club",
  },
  es: {
    "nav.home": "Inicio",
    "nav.story": "Nuestra historia",
    "nav.menu": "Cartas",
    "nav.events": "Eventos",
    "nav.reserve": "Reservas",
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
    "page.home.eventsCta": "Detalles",
    "page.home.eventsScrollHint": "Desplázate horizontalmente para ver más",
    "page.home.eventsEmpty":
      "Estamos cerrando el calendario — en cuanto haya fechas públicas, las veréis aquí. Mientras tanto, seguid en Instagram o escribid para una cena privada.",
    "page.home.heroReserveCta": "Reserva",
    "page.home.heroTagline":
      "Corazón latino, pulso nórdico — veladas club a un paso del Mediterráneo.",
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
    "page.menu.weeklyMadridNote": "Inicio de semana (Madrid)",
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
      "Aún no hay fechas en cartel — volved en breve o preguntad por una reserva privada.",
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
      "Reservas, eventos privados, alimentación, cómo llegar — leemos cada mensaje y respondemos en cuanto podemos.",
    "page.contact.labelName": "Nombre",
    "page.contact.labelEmail": "Correo electrónico",
    "page.contact.labelSubject": "Asunto",
    "page.contact.labelMessage": "Mensaje",
    "page.contact.subjectPlaceholder": "Elige un tema",
    "page.contact.submitSoon": "Enviar mensaje",
    "page.contact.policyNote":
      "Intentamos responder en unos días laborables. Reservas y pagos no quedan confirmados hasta que os contestemos.",
    "page.contact.validationName": "Indica tu nombre.",
    "page.contact.validationEmail": "Indica tu correo electrónico.",
    "page.contact.validationEmailFormat": "Ese correo no parece válido.",
    "page.contact.validationSubject": "Elige un asunto.",
    "page.contact.validationMessage": "Escribe un mensaje.",
    "page.contact.validationOkNotSent":
      "El mensaje está listo — si el envío automático no está activo aún, llamad o escribidnos por WhatsApp.",
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
    "page.gallery.srHeading": "Un vistazo a El Portero",
    "page.gallery.imageAlt1":
      "Comedor con luz cálida, mesas puestas y ambiente acogedor",
    "page.gallery.imageAlt2":
      "Copas y mesa preparada para una velada en el restaurante",
    "page.gallery.imageAlt3":
      "Chef emplatando con mimo en el paso de cocina",
    "page.gallery.caption1":
      "Luz suave, mantelería impecable y un espacio para largas veladas junto al mar.",
    "page.gallery.caption2":
      "Copas y maridajes elegidos con el mismo mimo que cada servicio.",
    "page.gallery.caption3":
      "Del paso a vuestra mesa — de temporada, con criterio y nunca en piloto automático.",
    "page.gallery.body1":
      "En Torrevieja, el comedor se prepara para veladas sin prisa — copa al inicio, conversación al centro y la luz baja al final.",
    "page.gallery.body2":
      "Vinos, cócteles y maridajes al ritmo de cocina — el Mediterráneo nos da el producto; nosotros le damos motivos para vestir bien la mesa.",
    "page.gallery.body3":
      "Cada servicio se orquesta en el paso: ritmo, temperatura y el detalle que convierte la cena en recuerdo.",
    "page.hours.title": "Horario",
    "page.hours.map": "Ubicación",
    "page.hours.mapIframeTitle": "Mapa: El Portero, Torrevieja",
    "page.admin.title": "Acceso admin",
    "footer.whatsapp": "WhatsApp",
    "footer.whatsappAria": "Abrir chat de WhatsApp con El Portero",
    "footer.tagline":
      "Alta cocina en la Costa Blanca con pulso de club — generosidad latina en la mesa, rigor nórdico en cocina y el mar a un paseo.",
    "footer.findUs": "Dónde estamos",
    "footer.links": "Enlaces rápidos",
    "footer.openInMaps": "Abrir en Google Maps",
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
    "page.home.eventsCta": "Läs mer",
    "page.home.eventsScrollHint": "Scrolla åt sidan för fler",
    "page.home.eventsEmpty":
      "Kalendern sätts just nu — datum publiceras här så fort de är officiella. Under tiden: följ oss på Instagram eller hör av dig om en privat middag.",
    "page.home.heroReserveCta": "Bokning",
    "page.home.heroTagline":
      "Latinamerikanskt hjärta, nordisk tyngd — dinner club-kvällar ett steg från Medelhavet.",
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
    "page.menu.weeklyMadridNote": "Veckostart (Madrid)",
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
      "Inga datum uppslagna ännu — titta snart igen eller fråga om en privat bokning.",
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
      "Bokningar, privata event, allergier, vägen hit — vi läser allt och återkommer så fort vi kan.",
    "page.contact.labelName": "Namn",
    "page.contact.labelEmail": "E-post",
    "page.contact.labelSubject": "Ämne",
    "page.contact.labelMessage": "Meddelande",
    "page.contact.subjectPlaceholder": "Välj ett ämne",
    "page.contact.submitSoon": "Skicka meddelande",
    "page.contact.policyNote":
      "Vi siktar på svar inom några vardagar. Bokningar och betalningar är inte bekräftade förrän vi hört av oss.",
    "page.contact.validationName": "Ange ditt namn.",
    "page.contact.validationEmail": "Ange din e-postadress.",
    "page.contact.validationEmailFormat": "E-postadressen verkar ogiltig.",
    "page.contact.validationSubject": "Välj ett ämne.",
    "page.contact.validationMessage": "Skriv ett meddelande.",
    "page.contact.validationOkNotSent":
      "Meddelandet är redo — om automatisk utskickning inte är påslaget än, ring eller WhatsApp oss.",
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
    "page.gallery.srHeading": "En glimt av El Portero",
    "page.gallery.imageAlt1":
      "Matsal i varmt ljus med dukade bord och inbjudande stämning",
    "page.gallery.imageAlt2":
      "Vinglas och dukning för en kväll på restaurangen",
    "page.gallery.imageAlt3":
      "Kock som varsamt lägger sista handen vid en rätt vid pass",
    "page.gallery.caption1":
      "Mjukt ljus, skarp linneväv och ett rum för långa kvällar vid havet.",
    "page.gallery.caption2":
      "Glas och maridage utvalda med samma omsorg som varje servering.",
    "page.gallery.caption3":
      "Från passet till ert bord — säsong, omsorg och aldrig på autopilot.",
    "page.gallery.body1":
      "I Torrevieja dukas rummet för långa kvällar — glas först, samtal längs vägen och dämpat ljus mot slutet.",
    "page.gallery.body2":
      "Vin, cocktails och maridage i takt med köket — kusten ger råvarorna; vi ger dem en anledning att klä upp sig.",
    "page.gallery.body3":
      "Varje servering är regisserad vid passet: tempo, värme och de små gesterna som gör middagen minnesvärd.",
    "page.hours.title": "Öppettider",
    "page.hours.map": "Plats",
    "page.hours.mapIframeTitle": "Karta: El Portero, Torrevieja",
    "page.admin.title": "Admininloggning",
    "footer.whatsapp": "WhatsApp",
    "footer.whatsappAria": "Öppna WhatsApp-chatt med El Portero",
    "footer.tagline":
      "Fin gastronomi på Costa Blanca med dinner club-puls — latinamerikansk generositet vid bordet, nordisk disciplin i köket och havet på promenadavstånd.",
    "footer.findUs": "Hitta hit",
    "footer.links": "Snabblänkar",
    "footer.openInMaps": "Öppna i Google Maps",
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
