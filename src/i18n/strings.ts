import { deMessages } from "./messages.de";
import { frMessages } from "./messages.fr";

export type Locale = "en" | "es" | "sv" | "de" | "fr";

export const locales: Locale[] = ["en", "es", "sv", "de", "fr"];

export const localeLabels: Record<Locale, string> = {
  en: "English",
  es: "Español",
  sv: "Svenska",
  de: "Deutsch",
  fr: "Français",
};

/**
 * Flag SVGs from Wikimedia (same files used on Wikipedia language articles).
 * — en: en.wikipedia File:Flag_of_the_United_Kingdom.svg
 * — es: commons File:Flag_of_Spain.svg
 * — sv: commons File:Flag_of_Sweden.svg
 * — de: en.wikipedia File:Flag_of_Germany.svg
 * — fr: en.wikipedia File:Flag_of_France.svg
 */
export const localeFlagSrc: Record<Locale, string> = {
  en: "https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg",
  es: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg",
  sv: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Flag_of_Sweden.svg",
  de: "https://upload.wikimedia.org/wikipedia/en/b/ba/Flag_of_Germany.svg",
  fr: "https://upload.wikimedia.org/wikipedia/en/c/c3/Flag_of_France.svg",
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
  | "page.home.eventsEmptyContact"
  | "page.home.eventsLoading"
  | "page.home.heroReserveCta"
  | "page.home.heroTagline"
  | "page.home.heroTaglineMobile"
  | "page.comingSoon.title"
  | "page.comingSoon.subtitle"
  | "page.comingSoon.heroAside"
  | "page.comingSoon.lowerSectionAria"
  | "page.menu.title"
  | "page.menu.food"
  | "page.menu.drinks"
  | "page.menu.dinner"
  | "page.menu.foodHeading"
  | "page.menu.drinksHeading"
  | "page.menu.dinnerHeading"
  | "page.menu.drinksIntro"
  | "page.menu.foodIntro"
  | "page.menu.dinnerIntro"
  | "page.menu.seeMenu"
  | "page.menu.scheduleLunch"
  | "page.menu.scheduleDinner"
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
  | "page.menu.comingSoonTitle"
  | "page.menu.comingSoonBody"
  | "page.menu.preLaunchTitle"
  | "page.menu.preLaunchBody"
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
  | "page.storyDraft.badge"
  | "page.storyDraft.title"
  | "page.storyDraft.lead"
  | "page.storyDraft.dreamKicker"
  | "page.storyDraft.dreamTitle"
  | "page.storyDraft.dreamP1"
  | "page.storyDraft.dreamP2"
  | "page.storyDraft.twoDreamsKicker"
  | "page.storyDraft.twoDreamsTitle"
  | "page.storyDraft.twoDreamsP1"
  | "page.storyDraft.twoDreamsP2"
  | "page.storyDraft.placeKicker"
  | "page.storyDraft.placeTitle"
  | "page.storyDraft.placeP1"
  | "page.storyDraft.placeP2"
  | "page.storyDraft.nameKicker"
  | "page.storyDraft.nameTitle"
  | "page.storyDraft.nameP1"
  | "page.storyDraft.nameP2"
  | "page.storyDraft.nameP3"
  | "page.storyDraft.welcomeTitle"
  | "page.storyDraft.welcomeP1"
  | "page.storyDraft.welcomeP2"
  | "page.storyDraft.signatureLead"
  | "page.storyDraft.altDream"
  | "page.storyDraft.altTwoDreams"
  | "page.storyDraft.altPlace"
  | "page.storyDraft.altName"
  | "page.storyDraft.altWelcome"
  | "page.storyDraft.altPortrait"
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
  | "page.admin.title"
  | "page.admin.intro"
  | "page.admin.email"
  | "page.admin.password"
  | "page.admin.signIn"
  | "page.admin.backToSite";

type AdminKey =
  | "admin.signOut"
  | "admin.signOutAria"
  | "admin.dashboard"
  | "admin.dashboard.title"
  | "admin.dashboard.intro"
  | "admin.dashboard.signedInAs"
  | "admin.dashboard.eventsLabel"
  | "admin.dashboard.eventsHeading"
  | "admin.dashboard.eventsDescription"
  | "admin.dashboard.eventsLink"
  | "admin.dashboard.menusLabel"
  | "admin.dashboard.menusHeading"
  | "admin.dashboard.menusDescription"
  | "admin.dashboard.menusLink"
  | "admin.dashboard.hoursLabel"
  | "admin.dashboard.hoursHeading"
  | "admin.dashboard.hoursDescription"
  | "admin.dashboard.hoursLink"
  | "admin.dashboard.backToSite"
  | "admin.dashboard.now"
  | "admin.dashboard.liveEvents"
  | "admin.dashboard.inactiveEvents"
  | "admin.dashboard.nextEvent"
  | "admin.dashboard.noUpcoming"
  | "admin.dashboard.fullyBookedCount"
  | "openingHours.day.mon"
  | "openingHours.day.tue"
  | "openingHours.day.wed"
  | "openingHours.day.thu"
  | "openingHours.day.fri"
  | "openingHours.day.sat"
  | "openingHours.day.sun"
  | "openingHours.closed"
  | "admin.openingHours.title"
  | "admin.openingHours.intro"
  | "admin.openingHours.statusTitle"
  | "admin.openingHours.statusIntro"
  | "admin.openingHours.scheduleTitle"
  | "admin.openingHours.scheduleIntro"
  | "admin.openingHours.dayStatus"
  | "admin.openingHours.statusOpen"
  | "admin.openingHours.statusClosed"
  | "admin.openingHours.openFrom"
  | "admin.openingHours.openUntil"
  | "admin.openingHours.day.mon"
  | "admin.openingHours.day.tue"
  | "admin.openingHours.day.wed"
  | "admin.openingHours.day.thu"
  | "admin.openingHours.day.fri"
  | "admin.openingHours.day.sat"
  | "admin.openingHours.day.sun"
  | "admin.openingHours.loadError"
  | "admin.openingHours.saved"
  | "admin.openingHours.saveError"
  | "admin.openingHours.publishedSuccess"
  | "admin.openingHours.publishError"
  | "admin.openingHours.unpublishedSuccess"
  | "admin.openingHours.unpublishError"
  | "admin.loading"
  | "admin.checkingSignIn"
  | "admin.signingIn"
  | "admin.signedInTitle"
  | "admin.signedInOpening"
  | "admin.chrome.staff"
  | "admin.events.title"
  | "admin.events.introLead"
  | "admin.events.allEvents"
  | "admin.events.newEvent"
  | "admin.events.emptyList"
  | "admin.events.draft"
  | "admin.events.pastRemove"
  | "admin.events.duplicate"
  | "admin.events.makeCopy"
  | "admin.events.unsaved"
  | "admin.events.saved"
  | "admin.events.openEventsPage"
  | "admin.events.formNew"
  | "admin.events.formEdit"
  | "admin.events.idLabel"
  | "admin.events.idPlaceholder"
  | "admin.events.idHint"
  | "admin.events.idLocked"
  | "admin.events.sectionBasics"
  | "admin.events.sectionTime"
  | "admin.events.sectionPhoto"
  | "admin.events.sectionCopy"
  | "admin.events.sectionReview"
  | "admin.events.sectionPublish"
  | "admin.events.previewHint"
  | "admin.events.guestDateLabel"
  | "admin.events.calendarDate"
  | "admin.events.specificTime"
  | "admin.events.fullyBooked"
  | "admin.events.published"
  | "admin.events.publishedHint"
  | "admin.events.publishedLocal"
  | "admin.events.publishedLocalHint"
  | "admin.events.statusHidden"
  | "admin.events.statusHiddenHint"
  | "admin.events.statusHiddenLocalHint"
  | "admin.events.localOnly"
  | "admin.events.imageUrl"
  | "admin.events.imageUrlHint"
  | "admin.events.datePreviewHint"
  | "admin.events.timeOnly"
  | "admin.events.timeOnlyHint"
  | "admin.events.startTime"
  | "admin.events.endTime"
  | "admin.events.preview"
  | "admin.events.titleField"
  | "admin.events.excerpt"
  | "admin.events.imageAlt"
  | "admin.events.create"
  | "admin.events.saveChanges"
  | "admin.events.delete"
  | "admin.events.saveNewTooltip"
  | "admin.events.saveEditTooltip"
  | "admin.events.saveNewDisabledTooltip"
  | "admin.events.saveEditDisabledTooltip"
  | "admin.events.duplicateLoaded"
  | "admin.events.created"
  | "admin.events.updated"
  | "admin.events.deleted"
  | "admin.events.deleteConfirm"
  | "admin.events.loadError"
  | "admin.events.saveError"
  | "admin.events.deleteError"
  | "admin.events.storageFullTitle"
  | "admin.events.storageFullBody"
  | "admin.events.storageCreateTitle"
  | "admin.events.storageCreateBody"
  | "admin.events.storageListWarning"
  | "admin.events.storageEmptySlot"
  | "admin.events.storageCount"
  | "admin.events.storageMeterAria"
  | "admin.events.storageFullSaveError"
  | "admin.events.invalidId"
  | "admin.events.invalidTime"
  | "admin.events.loadingTitle"
  | "admin.events.loadingIntro"
  | "admin.events.translateContent"
  | "admin.events.translating"
  | "admin.events.translateWait1"
  | "admin.events.translateWait2"
  | "admin.events.translateWait3"
  | "admin.events.translateElapsed"
  | "admin.events.translateLanguageCorrected"
  | "admin.events.translateLanguageCorrectedSplit"
  | "admin.events.translateError"
  | "admin.events.translateSuccess"
  | "admin.events.translateNeedText"
  | "admin.events.reviewTranslations"
  | "admin.events.uploadImage"
  | "admin.events.replaceImage"
  | "admin.events.removeImage"
  | "admin.events.imageUploading"
  | "admin.events.imageUploadError"
  | "admin.events.imageHint"
  | "admin.events.imageAltHint"
  | "admin.events.sourceHint"
  | "admin.events.orPasteLink"
  | "admin.events.notTranslatedYet"
  | "admin.events.previewLanguage"
  | "admin.events.changePhoto"
  | "admin.events.addTime"
  | "admin.events.descriptionText"
  | "admin.events.descriptionBullets"
  | "admin.events.descriptionBold"
  | "admin.events.descriptionItalic"
  | "admin.events.available"
  | "admin.events.editDate"
  | "admin.events.editTime"
  | "admin.events.editAvailability"
  | "admin.events.chooseLanguage"
  | "admin.events.staffHint"
  | "admin.events.step"
  | "admin.events.step1Title"
  | "admin.events.step3Title"
  | "admin.events.step4Title"
  | "admin.events.step4Hint"
  | "admin.menus.title"
  | "admin.menus.intro"
  | "admin.menus.reload"
  | "admin.menus.tabDinner"
  | "admin.menus.tabDrinks"
  | "admin.menus.status"
  | "admin.menus.statusIntro"
  | "admin.menus.publishedLabel"
  | "admin.menus.yes"
  | "admin.menus.no"
  | "admin.menus.publish"
  | "admin.menus.unpublish"
  | "admin.menus.menuTitleLabel"
  | "admin.menus.menuTitlePlaceholder"
  | "admin.menus.sectionTitleLabel"
  | "admin.menus.removeSection"
  | "admin.menus.hideSection"
  | "admin.menus.showSection"
  | "admin.menus.hideBtn"
  | "admin.menus.showBtn"
  | "admin.menus.saveBeforeHide"
  | "admin.menus.hideDish"
  | "admin.menus.showDish"
  | "admin.menus.hideDrink"
  | "admin.menus.showDrink"
  | "admin.menus.hiddenFromGuests"
  | "admin.menus.hiddenItemsCount"
  | "admin.menus.removeDish"
  | "admin.menus.removeDrink"
  | "admin.menus.addDish"
  | "admin.menus.addSection"
  | "admin.menus.addDrink"
  | "admin.menus.dragSection"
  | "admin.menus.dragItem"
  | "admin.menus.expandSection"
  | "admin.menus.collapseSection"
  | "admin.menus.expandItem"
  | "admin.menus.collapseItem"
  | "admin.menus.nameLabel"
  | "admin.menus.nameExtensionLabel"
  | "admin.menus.optional"
  | "admin.menus.nameExtensionPlaceholder"
  | "admin.menus.descriptionLabel"
  | "admin.menus.priceLabel"
  | "admin.menus.priceExamplePlaceholder"
  | "admin.menus.priceHiddenPlaceholder"
  | "admin.menus.priceHiddenNote"
  | "admin.menus.sizeVariantsTitle"
  | "admin.menus.sizeVariantsHint"
  | "admin.menus.sizeLabelPlaceholder"
  | "admin.menus.priceFieldPlaceholder"
  | "admin.menus.removeVariant"
  | "admin.menus.removeVariantAria"
  | "admin.menus.addSize"
  | "admin.menus.dietaryTagsTitle"
  | "admin.menus.dietaryHintDrinks"
  | "admin.menus.dietaryHintFood"
  | "admin.menus.allergensTitle"
  | "admin.menus.allergensHint"
  | "admin.menus.loadError"
  | "admin.menus.saved"
  | "admin.menus.saveError"
  | "admin.menus.publishedSuccess"
  | "admin.menus.publishError"
  | "admin.menus.unpublishedSuccess"
  | "admin.menus.unpublishError"
  | "admin.menus.removeSectionConfirm"
  | "admin.menus.removeDishConfirm"
  | "admin.menus.removeDrinkConfirm"
  | "admin.menus.untitledSection"
  | "admin.menus.untitledDish"
  | "admin.menus.untitledDrink"
  | "admin.menus.outline"
  | "admin.menus.sectionsLabel"
  | "admin.menus.connectionHint"
  | "admin.menus.editingSection"
  | "admin.menus.noSection"
  | "admin.menus.visibleOnSite"
  | "admin.menus.hiddenOnSite"
  | "admin.menus.shownToGuests"
  | "admin.menus.unsavedChanges"
  | "admin.menus.allSaved"
  | "admin.menus.breadcrumb"
  | "admin.menus.menuTitleHint"
  | "admin.menus.chooseSection"
  | "admin.confirm.title"
  | "admin.confirm.cancel"
  | "admin.confirm.proceed"
  | "admin.confirm.delete"
  | "admin.confirm.remove";

type FooterKey =
  | "footer.whatsapp"
  | "footer.whatsappAria"
  | "footer.tagline"
  | "footer.links"
  | "footer.follow"
  | "footer.sitemap"
  | "footer.openInMaps";

type HeaderKey =
  | "header.menuLabel"
  | "header.closeNav"
  | "header.openNav"
  | "header.navDialog"
  | "header.reserveTable"
  | "header.reserveNav";

type BrandKey = "brand.dinnerClub";

export type MessageKey = NavKey | PageKey | AdminKey | FooterKey | HeaderKey | BrandKey;

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
      "Nothing to book just yet. We’re in the back plotting the restaurant’s next great nights — follow @elporterorestaurant so they don’t sneak past you, or {contact} if you’ve got an event of your own.",
    "page.home.eventsEmptyContact": "contact us",
    "page.home.eventsLoading": "Loading events…",
    "page.home.heroReserveCta": "Book a table",
    "page.home.heroTagline":
      "At el PORTERO, flavours from Peru, Spain and Sweden come together in a warm, lively dinner-club atmosphere, with the Mediterranean just a throw-in away.",
    "page.home.heroTaglineMobile":
      "Peru, Spain & Sweden — warm dinner club in Torrevieja with the Mediterranean just steps away.",
    "page.comingSoon.title": "Coming soon",
    "page.comingSoon.subtitle": "IN THE WORKS",
    "page.comingSoon.heroAside":
      "Stay tuned. A dinner club where Peruvian, Spanish and Swedish flavours meet is taking shape in Torrevieja on the Costa Blanca.",
    "page.comingSoon.lowerSectionAria": "Updates, contact, and location",
    "page.menu.title": "Our menus",
    "page.menu.food": "Highlights",
    "page.menu.drinks": "Drinks",
    "page.menu.dinner": "Dinner",
    "page.menu.foodHeading": "Seasonal highlights",
    "page.menu.drinksHeading": "Drinks menu",
    "page.menu.dinnerHeading": "Dinner",
    "page.menu.drinksIntro":
      "Wines by the glass and bottle, apéritifs, and pairings — our list evolves with the cellar and the seasons.",
    "page.menu.foodIntro":
      "A rotating snapshot of how we cook — for this week’s set lunch menu, open Lunch.",
    "page.menu.dinnerIntro":
      "Order by course or choose the chef’s tasting — ingredients follow the market and the kitchen’s daily prep.",
    "page.menu.seeMenu": "See menu",
    "page.menu.scheduleLunch": "Mon–Fri · 11:00–15:00",
    "page.menu.scheduleDinner": "Mon–Sat · 15:00–22:00",
    "page.menu.scheduleDrinks": "Daily · 12:00–00:00",
    "page.menu.weekly": "Lunch",
    "page.menu.weeklyHeading": "Lunch",
    "page.menu.weeklyWeekTitle": "Lunch week {week}",
    "page.menu.weeklyIntro": "Lunch is served Monday–Friday, 11:00–15:00.",
    "page.menu.weeklyServiceLine": "Monday–Friday, 11:00–15:00.",
    "page.menu.weeklyLoading": "Loading lunch…",
    "page.menu.weeklyEmpty":
      "This week’s lunch menu is not online yet. Please check back shortly for today’s offering.",
    "page.menu.weeklyWeekLabel": "Week of",
    "page.menu.weeklyEffectiveLabel": "Goes live",
    "page.menu.weeklyMadridNote": "Lunch week anchor (Sat, Madrid)",
    "page.menu.hubHint":
      "Choose a menu above — each section opens in full beneath, dishes, pairings, and all.",
    "page.menu.comingSoonTitle": "Menus are coming soon",
    "page.menu.comingSoonBody":
      "We’re finalizing them now — they’ll be here when we open the doors on 14 May.",
    "page.menu.preLaunchTitle": "Menus publish on opening night",
    "page.menu.preLaunchBody":
      "All our menus go live here on 14 May — the same evening we raise the curtain in Torrevieja.",
    "page.menu.subnavAria": "Menu sections",
    "page.events.title": "Events",
    "page.events.heroSubtitle":
      "We host our own evenings at the restaurant — themed dinners, watch parties on the big screen, and guest stints in the kitchen. Prefer something private? We also welcome weddings, corporate tables, and celebrations with a door you can close.",
    "page.events.heroInquiryCta": "Request a quote",
    "page.events.heroInquiryAria":
      "Go to contact — request a quote for private events",
    "page.events.explainPublicTitle": "Our public events",
    "page.events.explainPublicBody":
      "These are evenings we put on for everyone: special menus, guest chefs, football and sports nights on the big screen, and seasonal ideas as we go. Grab a table like any other visit — dates and details are below when something is live.",
    "page.events.explainPrivateTitle": "Your event here",
    "page.events.explainPrivateBody":
      "Hire the restaurant for your crowd — weddings, company dinners, birthdays, tastings, or a fully private celebration. Tell us your date, group size, and mood; we’ll come back with menus, pacing, and a clear way forward.",
    "page.events.listHeading": "Coming up",
    "page.events.listEmpty":
      "Nothing to book just yet. We’re in the back plotting the restaurant’s next great nights — follow @elporterorestaurant so they don’t sneak past you, or {contact} if you’ve got an event of your own.",
    "page.events.listLoading": "Loading events…",
    "page.events.sectionOverviewLabel": "Public nights and private events",
    "page.story.title": "Our story",
    "page.story.intro":
      "A dinner club on the Costa Blanca where Peruvian, Spanish and Swedish flavours meet — warm, lively evenings a short walk from the Mediterranean.",
    "page.story.sectionOriginTitle": "What brings us together",
    "page.story.sectionOriginP1":
      "el PORTERO began with a simple idea: a restaurant that feels both celebratory and precise. Flavours from Peru, Spain and Sweden meet at the table — Mediterranean seasons, honest sourcing, and service that stays in step with a warm, lively room.",
    "page.story.sectionOriginP2":
      "We chose Torrevieja because the light, the produce, and the sea set the tone. Whether you are here for a long tasting menu or a lively evening with friends, we want every visit to feel intentional.",
    "page.story.sectionMagnusTitle": "The keeper of the house",
    "page.story.sectionMagnusP1":
      "el PORTERO is led by Magnus Hedman — former professional goalkeeper, capped for Sweden, and trusted between the posts at the highest level of the game. A career spent reading the room, holding the line, and delivering under pressure translates naturally to hospitality: calm pacing, trust at the table, and a team that moves as one.",
    "page.story.sectionMagnusP2":
      "Today Magnus brings that same focus to welcoming guests, shaping the room, and keeping the restaurant’s character: warm, disciplined, and never ordinary.",
    "page.story.sectionPhilosophyTitle": "How we cook & host",
    "page.story.sectionPhilosophyBody":
      "We build menus around seasonal ingredients, thoughtful wines, and the moment you are in — from tasting journeys to generous plates meant to share. Big-match nights, private celebrations, and quiet midweek dinners all belong here; the through-line is care you can taste, in the open, sociable spirit of a dinner club.",
    "page.story.sectionCoastTitle": "On the Mediterranean",
    "page.story.sectionCoastBody":
      "A short walk from the water in Torrevieja, Alicante, el PORTERO welcomes travellers and locals alike. Book ahead when you can, and tell us if you are celebrating — we will do our best to make it memorable.",
    "page.story.ctaReserve": "Reserve a table",
    "page.story.ctaReserveAria":
      "Go to reservations — book a table at el PORTERO",
    "page.story.photoAltOrigin": "Cooking at the pass — energy in the kitchen",
    "page.story.photoAltMagnus":
      "A football pitch from above — focus, lines, and teamwork",
    "page.story.photoAltTileA": "Wine glasses and candlelight on the table",
    "page.story.photoAltTileB": "A carefully plated dish",
    "page.story.photoAltTileC": "Mediterranean ingredients spread for sharing",
    "page.story.photoAltCoast": "Mediterranean shoreline and open water",
    "page.story.comingSoonBody":
      "The dream of opening a restaurant wasn’t formed overnight. Neither is this page that will tell you that very story. Stay tuned — soon you can explore it here.",
    "page.storyDraft.badge": "Story draft",
    "page.storyDraft.title": "Our story",
    "page.storyDraft.lead": "It all started with a dream.",
    "page.storyDraft.dreamKicker": "Where it began",
    "page.storyDraft.dreamTitle": "A feeling I never forgot",
    "page.storyDraft.dreamP1":
      "When I was 10, I was at a restaurant with my mum, looking around. I don’t remember exactly what I ate that night — but I remember the feeling.",
    "page.storyDraft.dreamP2":
      "The light. The people. The hum of the room. The laughter. And how a restaurant can make people feel something together.",
    "page.storyDraft.twoDreamsKicker": "Two dreams",
    "page.storyDraft.twoDreamsTitle": "Football — and a restaurant of my own",
    "page.storyDraft.twoDreamsP1":
      "Right then and there, two dreams were born: to become a professional footballer, and one day to open my own restaurant.",
    "page.storyDraft.twoDreamsP2":
      "The football dream came true and took me around the world — through stadiums and dressing rooms, highs and lows. But the other dream always lived on inside me.",
    "page.storyDraft.placeKicker": "A place",
    "page.storyDraft.placeTitle": "An evening you don’t want to end",
    "page.storyDraft.placeP1":
      "The dream was to create a place where people meet, celebrate life, laugh a little louder, and stay a little longer than they planned.",
    "page.storyDraft.placeP2":
      "To me, a restaurant is more than food and drink. It’s the feeling when you walk through the door. The music. The energy. The people around the table.",
    "page.storyDraft.nameKicker": "The name",
    "page.storyDraft.nameTitle": "el PORTERO",
    "page.storyDraft.nameP1": "el PORTERO is the result of that dream.",
    "page.storyDraft.nameP2":
      "The name means “the goalkeeper” in Spanish — a nod to my background, but also to the role of protecting, welcoming, and creating a sense of safety.",
    "page.storyDraft.nameP3":
      "We want el PORTERO to be a place where elegance meets warmth. Where dinner slowly turns into an evening you don’t want to end — and every guest feels seen and welcome.",
    "page.storyDraft.welcomeTitle": "From a boy’s dream to reality",
    "page.storyDraft.welcomeP1":
      "From a 10-year-old boy’s dream, to reality in Torrevieja.",
    "page.storyDraft.welcomeP2": "A warm welcome to el PORTERO.",
    "page.storyDraft.signatureLead": "With warmth,",
    "page.storyDraft.altDream": "Restaurant atmosphere",
    "page.storyDraft.altTwoDreams": "Magnus Hedman during his football career",
    "page.storyDraft.altPlace": "el PORTERO outside patio",
    "page.storyDraft.altName": "el PORTERO bar",
    "page.storyDraft.altWelcome": "Torrevieja beach walk",
    "page.storyDraft.altPortrait": "Portrait of Magnus Hedman",
    "page.reserve.title": "Reservations",
    "page.reserve.heroTitle": "Reserve your table",
    "page.reserve.heroBody":
      "Tell us when you’d like to join us — Peruvian, Spanish and Swedish flavours in a warm, lively dinner-club setting, minutes from the water. We’ll confirm by email.",
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
      "Call or email — we’ll get back as soon as we can.",
    "page.contact.phoneLabel": "Phone",
    "page.contact.emailLabel": "Email",
    "page.gallery.srHeading": "A glimpse of el PORTERO",
    "page.gallery.imageAlt1":
      "Grilled meat and vegetable skewers from the grill — Peruvian- and Spanish-inspired cooking",
    "page.gallery.imageAlt2": "Seasonal dish from the el PORTERO kitchen",
    "page.gallery.imageAlt3": "Bartender mixing cocktails at the bar counter",
    "page.gallery.caption1": "Peruvian soul and Spanish heat from the grill.",
    "page.gallery.caption2":
      "Swedish comfort meets Peruvian and Spanish flavours — at one table.",
    "page.gallery.caption3": "A bar built for the long arc of the evening.",
    "page.gallery.body1":
      "We cook where Peru, Spain and Sweden meet — charcoal, coastal southern Spanish produce, Peruvian accents, and Nordic comfort on one menu. The grill is where many of those flavours come alive, steps from the Mediterranean.",
    "page.gallery.body2":
      "Swedish classics sit alongside Peruvian and Iberian dishes — a dinner-club table where the three kitchens can share the same evening.",
    "page.gallery.body3":
      "Our bar keeps pace with the kitchen: precise cocktails, warm service, and a counter where you can begin the night with a drink or settle in for one more after dessert.",
    "page.hours.title": "Opening hours",
    "page.hours.map": "Location",
    "page.hours.mapIframeTitle": "Map: el PORTERO, Torrevieja",
    "page.admin.title": "Admin sign-in",
    "page.admin.intro": "Restricted access for staff.",
    "page.admin.email": "Email",
    "page.admin.password": "Password",
    "page.admin.signIn": "Sign in",
    "page.admin.backToSite": "Back to site",
    "admin.signOut": "Sign out",
    "admin.signOutAria": "Sign out of admin",
    "admin.dashboard": "Dashboard",
    "admin.dashboard.title": "Dashboard",
    "admin.dashboard.intro": "Choose what you want to edit.",
    "admin.dashboard.signedInAs": "Signed in as",
    "admin.dashboard.eventsLabel": "Events",
    "admin.dashboard.eventsHeading": "Events",
    "admin.dashboard.eventsDescription":
      "Add and update evenings and happenings on the home page and Events page. Keep drafts hidden until you are ready for guests to see them.",
    "admin.dashboard.eventsLink": "Manage events",
    "admin.dashboard.menusLabel": "Menus",
    "admin.dashboard.menusHeading": "Menu",
    "admin.dashboard.menusDescription":
      "Edit dinner and drinks menus section by section. Save your draft, then publish when guests should see the menu on the website.",
    "admin.dashboard.menusLink": "Manage menus",
    "admin.dashboard.hoursLabel": "Hours",
    "admin.dashboard.hoursHeading": "Opening hours",
    "admin.dashboard.hoursDescription":
      "Weekly schedule and open/closed times shown on the home page. Save, then publish when guests should see updates.",
    "admin.dashboard.hoursLink": "Manage opening hours",
    "admin.dashboard.backToSite": "← Back to site",
    "admin.dashboard.now": "Right now",
    "admin.dashboard.liveEvents": "Live on the website",
    "admin.dashboard.inactiveEvents": "Inactive or past",
    "admin.dashboard.nextEvent": "Next",
    "admin.dashboard.noUpcoming": "Nothing coming up",
    "admin.dashboard.fullyBookedCount": "Fully booked: {count}",
    "openingHours.day.mon": "Mon",
    "openingHours.day.tue": "Tue",
    "openingHours.day.wed": "Wed",
    "openingHours.day.thu": "Thu",
    "openingHours.day.fri": "Fri",
    "openingHours.day.sat": "Sat",
    "openingHours.day.sun": "Sun",
    "openingHours.closed": "Closed",
    "admin.openingHours.title": "Opening hours",
    "admin.openingHours.intro":
      "Edit the weekly schedule guests see on the home page. Each day uses dropdowns — the open/closed indicator updates automatically from today's hours (Europe/Madrid).",
    "admin.openingHours.statusTitle": "Status",
    "admin.openingHours.statusIntro":
      "Save your draft first, then publish when the website should show the new hours.",
    "admin.openingHours.scheduleTitle": "Weekly schedule",
    "admin.openingHours.scheduleIntro":
      "Choose Open or Closed for each day. If open, pick opening and closing times in half-hour steps. Closing after midnight (e.g. 01:00) is supported.",
    "admin.openingHours.dayStatus": "Day status",
    "admin.openingHours.statusOpen": "Open",
    "admin.openingHours.statusClosed": "Closed",
    "admin.openingHours.openFrom": "Opens at",
    "admin.openingHours.openUntil": "Closes at",
    "admin.openingHours.day.mon": "Monday",
    "admin.openingHours.day.tue": "Tuesday",
    "admin.openingHours.day.wed": "Wednesday",
    "admin.openingHours.day.thu": "Thursday",
    "admin.openingHours.day.fri": "Friday",
    "admin.openingHours.day.sat": "Saturday",
    "admin.openingHours.day.sun": "Sunday",
    "admin.openingHours.loadError": "Could not load opening hours.",
    "admin.openingHours.saved": "Saved. Guests only see published hours.",
    "admin.openingHours.saveError": "Could not save. Check your connection and try again.",
    "admin.openingHours.publishedSuccess": "Published — visible on the website.",
    "admin.openingHours.publishError": "Could not publish. Try again.",
    "admin.openingHours.unpublishedSuccess": "Unpublished — hidden from guests (draft kept).",
    "admin.openingHours.unpublishError": "Could not unpublish. Try again.",
    "admin.loading": "Loading…",
    "admin.checkingSignIn": "Checking sign-in…",
    "admin.signingIn": "Signing in…",
    "admin.signedInTitle": "Signed in",
    "admin.signedInOpening": "Opening the workspace…",
    "admin.chrome.staff": "Staff workspace",
    "admin.events.title": "Events",
    "admin.events.introLead":
      "Here you manage the evenings and happenings that guests see on the home page and Events page.",
    "admin.events.allEvents": "All events",
    "admin.events.newEvent": "New event",
    "admin.events.emptyList": "No events yet. Tap New event above to add the first one.",
    "admin.events.draft": "Draft",
    "admin.events.pastRemove": "Past — you can delete",
    "admin.events.duplicate": "Duplicate",
    "admin.events.makeCopy": "Make a copy",
    "admin.events.unsaved": "Unsaved changes",
    "admin.events.saved": "Saved",
    "admin.events.openEventsPage": "Open events page",
    "admin.events.formNew": "New event",
    "admin.events.formEdit": "Edit event",
    "admin.events.idLabel": "Short name (ID)",
    "admin.events.idPlaceholder": "e.g. wine-night-june-2026",
    "admin.events.idHint":
      "Guests never see this short name. It is only used in this list and when saving the event.",
    "admin.events.idLocked": "The short name cannot be changed after the event is created.",
    "admin.events.sectionBasics": "Name and date",
    "admin.events.sectionTime": "Time",
    "admin.events.sectionPhoto": "Photo",
    "admin.events.sectionCopy": "Text guests will see",
    "admin.events.sectionReview": "Review translations",
    "admin.events.sectionPublish": "Website status",
    "admin.events.previewHint": "Click the card to edit what guests see. Switch language at the top right.",
    "admin.events.guestDateLabel": "Shown to guests as",
    "admin.events.calendarDate": "Date on calendar",
    "admin.events.specificTime": "Don't show",
    "admin.events.fullyBooked": "Fully booked",
    "admin.events.published": "Live on the real website",
    "admin.events.publishedHint": "Guests on www.el-portero.com can see this event.",
    "admin.events.publishedLocal": "Only on this computer",
    "admin.events.publishedLocalHint":
      "Visible here on localhost. The real website will not show it.",
    "admin.events.statusHidden": "Hidden",
    "admin.events.statusHiddenHint": "Guests on www.el-portero.com cannot see this event.",
    "admin.events.statusHiddenLocalHint":
      "Not shown on localhost, and not on the real website.",
    "admin.events.localOnly": "Local only",
    "admin.events.imageUrl": "Photo link",
    "admin.events.imageUrlHint":
      "Upload a photo from your computer (we resize it automatically). You can still paste an image link if you prefer.",
    "admin.events.datePreviewHint":
      "Date shown to guests (filled in automatically from the calendar date above):",
    "admin.events.timeOnly": "Time",
    "admin.events.timeOnlyHint":
      "Start and end times appear on the website (24-hour clock).",
    "admin.events.startTime": "Start time",
    "admin.events.endTime": "End time",
    "admin.events.preview": "Preview",
    "admin.events.titleField": "Title",
    "admin.events.excerpt": "Short description",
    "admin.events.imageAlt": "Photo description (for accessibility)",
    "admin.events.create": "Create",
    "admin.events.saveChanges": "Save changes",
    "admin.events.delete": "Delete",
    "admin.events.saveNewTooltip": "Save new event",
    "admin.events.saveEditTooltip": "Save your edits",
    "admin.events.saveNewDisabledTooltip": "Edit the preview or the details below to create an event",
    "admin.events.saveEditDisabledTooltip": "No unsaved changes — edit the preview or the details below to save",
    "admin.events.duplicateLoaded":
      "Copy loaded — check the short name (ID) and date, then tap Create.",
    "admin.events.created": "Event created.",
    "admin.events.updated": "Event updated.",
    "admin.events.deleted": "Event deleted.",
    "admin.events.deleteConfirm": "Delete “{id}”? This cannot be undone.",
    "admin.events.loadError": "Could not load events. Try refreshing the page.",
    "admin.events.saveError": "Could not save. Check your connection and try again.",
    "admin.events.deleteError": "Could not delete. Try again.",
    "admin.events.storageFullTitle": "The event list is full",
    "admin.events.storageFullBody": "You can keep {max} events. Delete one before you add another.",
    "admin.events.storageCreateTitle": "You can’t save a new event yet",
    "admin.events.storageCreateBody": "The list is full. Delete an event on the left, then try again.",
    "admin.events.storageListWarning": "The list is full. Delete an event to add a new one.",
    "admin.events.storageEmptySlot": "Empty",
    "admin.events.storageCount": "{count} of {max}",
    "admin.events.storageMeterAria": "{count} of {max} events",
    "admin.events.storageFullSaveError": "The list is full. Delete an event first.",
    "admin.events.invalidId":
      "Short name (ID): use 1–64 characters — lowercase letters, numbers, and hyphens only (e.g. summer-dinner-2026).",
    "admin.events.invalidTime": "End time must be the same as or after the start time.",
    "admin.events.loadingTitle": "Events",
    "admin.events.loadingIntro": "Loading…",
    "admin.events.translateContent": "Translate content",
    "admin.events.translating": "Translating…",
    "admin.events.translateWait1": "Translation is running. Please wait a couple of seconds.",
    "admin.events.translateWait2": "Checking which language you wrote in, then translating the rest.",
    "admin.events.translateWait3": "The preview updates when every language is ready. You can leave this open.",
    "admin.events.translateElapsed": "Elapsed time {time}",
    "admin.events.translateLanguageCorrected":
      "What you wrote in the {source} field is {detected}. That original text is saved as {detected}, and {source} now has the translation. Other empty languages were filled too. Switch language on the preview to review, then save.",
    "admin.events.translateLanguageCorrectedSplit":
      "The title is {titleLanguage} and the description is {excerptLanguage}. Each original is saved in that language, and the {source} fields now have the {source} translation. Switch language on the preview to review, then save.",
    "admin.events.translateError":
      "Could not translate. Firebase AI Logic needs to be enabled on the project, then try again.",
    "admin.events.translateSuccess":
      "Empty languages and photo descriptions were filled from {language}. Switch language on the preview to review, then save.",
    "admin.events.translateNeedText": "Add a title or description before translating.",
    "admin.events.reviewTranslations": "Review translations",
    "admin.events.uploadImage": "Upload photo",
    "admin.events.replaceImage": "Replace photo",
    "admin.events.removeImage": "Remove photo",
    "admin.events.imageUploading": "Uploading photo…",
    "admin.events.imageUploadError":
      "Could not upload the photo. Try again, or paste a link instead.",
    "admin.events.imageHint": "Prefer a link? Paste it here instead.",
    "admin.events.imageAltHint":
      "Applies to the language selected on the preview. Filled when you translate. Edit if you want it more specific.",
    "admin.events.sourceHint":
      "Write the title and description on the card, then press Translate content.",
    "admin.events.orPasteLink": "Or paste a photo link",
    "admin.events.notTranslatedYet": "Not translated yet",
    "admin.events.previewLanguage": "Preview language",
    "admin.events.changePhoto": "Change photo",
    "admin.events.addTime": "Add time",
    "admin.events.descriptionText": "Text",
    "admin.events.descriptionBullets": "Bullets",
    "admin.events.descriptionBold": "Bold",
    "admin.events.descriptionItalic": "Italic",
    "admin.events.available": "Available",
    "admin.events.editDate": "Event date",
    "admin.events.editTime": "Start and end time",
    "admin.events.editAvailability": "Booking status",
    "admin.events.chooseLanguage": "Choose preview language",
    "admin.events.staffHint": "Guests do not see these fields. They are only used here.",
    "admin.events.step": "Step {n}",
    "admin.events.step1Title": "Details & Preview",
    "admin.events.step3Title": "Short name and website status",
    "admin.events.step4Title": "Double-check",
    "admin.events.step4Hint": "Look over the rest before you save.",
    "admin.menus.title": "Menus",
    "admin.menus.intro":
      "Dinner and drinks are separate menus. Each menu is made of sections, and each section holds the dishes guests see under that heading.",
    "admin.menus.reload": "Reload",
    "admin.menus.tabDinner": "Dinner",
    "admin.menus.tabDrinks": "Drinks",
    "admin.menus.status": "Status",
    "admin.menus.statusIntro":
      "Unpublished menus fall back to demo content on the public site until you publish.",
    "admin.menus.publishedLabel": "Published:",
    "admin.menus.yes": "Yes",
    "admin.menus.no": "No",
    "admin.menus.publish": "Publish",
    "admin.menus.unpublish": "Unpublish",
    "admin.menus.menuTitleLabel": "Menu title",
    "admin.menus.menuTitlePlaceholder": "e.g. Spring dinner menu",
    "admin.menus.sectionTitleLabel": "Section title",
    "admin.menus.removeSection": "Remove section",
    "admin.menus.hideSection": "Hide section",
    "admin.menus.showSection": "Show section",
    "admin.menus.hideBtn": "Hide",
    "admin.menus.showBtn": "Show",
    "admin.menus.saveBeforeHide": "Save changes before hiding or showing items for guests",
    "admin.menus.hideDish": "Hide dish",
    "admin.menus.showDish": "Show dish",
    "admin.menus.hideDrink": "Hide drink",
    "admin.menus.showDrink": "Show drink",
    "admin.menus.hiddenFromGuests": "Hidden from guests",
    "admin.menus.hiddenItemsCount": "{count} hidden from guests",
    "admin.menus.removeDish": "Remove dish",
    "admin.menus.removeDrink": "Remove drink",
    "admin.menus.addDish": "Add dish",
    "admin.menus.addSection": "Add section",
    "admin.menus.addDrink": "Add drink",
    "admin.menus.dragSection": "Drag to reorder section",
    "admin.menus.dragItem": "Drag to reorder item",
    "admin.menus.expandSection": "Expand section",
    "admin.menus.collapseSection": "Collapse section",
    "admin.menus.expandItem": "Expand item",
    "admin.menus.collapseItem": "Collapse item",
    "admin.menus.nameLabel": "Name",
    "admin.menus.nameExtensionLabel": "Name extension",
    "admin.menus.optional": "(optional)",
    "admin.menus.nameExtensionPlaceholder":
      "Shown below the name, same style, smaller — e.g. region or vintage",
    "admin.menus.descriptionLabel": "Description",
    "admin.menus.priceLabel": "Price",
    "admin.menus.priceExamplePlaceholder": "e.g. 24 or 24.50",
    "admin.menus.priceHiddenPlaceholder": "Hidden — size variants below override this",
    "admin.menus.priceHiddenNote":
      "The single price above is hidden on the public menu while size variants are set.",
    "admin.menus.sizeVariantsTitle": "Size variants (optional)",
    "admin.menus.sizeVariantsHint":
      "For drinks sold in multiple sizes (e.g. Small / Large, 33cl / 50cl, Glass / Bottle). When set, these replace the single price on the public menu.",
    "admin.menus.sizeLabelPlaceholder": "Label (e.g. Small)",
    "admin.menus.priceFieldPlaceholder": "Price",
    "admin.menus.removeVariant": "Remove",
    "admin.menus.removeVariantAria": "Remove size variant {n}",
    "admin.menus.addSize": "Add size",
    "admin.menus.dietaryTagsTitle": "Dietary tags",
    "admin.menus.dietaryHintDrinks":
      "Optional — e.g. alcohol-free mocktails, gluten-free beer, vegan or dairy-free ingredients.",
    "admin.menus.dietaryHintFood": "Optional — select any that apply.",
    "admin.menus.allergensTitle": "Allergens (EU 1–14)",
    "admin.menus.allergensHint":
      "Tap the numbered circles for any allergens present. Numbers match the legend shown on the public menu.",
    "admin.menus.loadError": "Could not load menu.",
    "admin.menus.saved": "Saved. Guests only see published menus.",
    "admin.menus.saveError": "Could not save. Check your connection and try again.",
    "admin.menus.publishedSuccess": "Published — visible on the website.",
    "admin.menus.publishError": "Could not publish. Try again.",
    "admin.menus.unpublishedSuccess": "Unpublished — hidden from guests (draft kept).",
    "admin.menus.unpublishError": "Could not unpublish. Try again.",
    "admin.menus.removeSectionConfirm":
      "Remove the section «{section}»?\n\nThis deletes the section heading and every dish listed under it ({countPhrase}) — not just the title. Guests will not see the change on the website until you tap Save changes.",
    "admin.menus.removeDishConfirm":
      "Remove the dish «{dish}» from this section?\n\nIt will be removed from your draft. Tap Save changes when you are finished editing.",
    "admin.menus.removeDrinkConfirm":
      "Remove the drink «{dish}» from this section?\n\nIt will be removed from your draft. Tap Save changes when you are finished editing.",
    "admin.menus.untitledSection": "Untitled section",
    "admin.menus.untitledDish": "Untitled dish",
    "admin.menus.untitledDrink": "Untitled drink",
    "admin.menus.outline": "Menus",
    "admin.menus.sectionsLabel": "Sections",
    "admin.menus.connectionHint":
      "A section is a heading on the menu. The dishes nested under it are what guests read in that group.",
    "admin.menus.editingSection": "Dishes in this section",
    "admin.menus.noSection": "This menu has no sections yet. Add one to start a group of dishes.",
    "admin.menus.visibleOnSite": "On the website",
    "admin.menus.hiddenOnSite": "Draft only",
    "admin.menus.shownToGuests": "Shown to guests",
    "admin.menus.unsavedChanges": "Unsaved changes",
    "admin.menus.allSaved": "All changes saved",
    "admin.menus.breadcrumb": "Where you are in the menu",
    "admin.menus.menuTitleHint":
      "This is the button at the top of the menu on the website. Without a title, that button is not shown.",
    "admin.menus.chooseSection": "Choose a section on the left to edit its dishes.",
    "admin.confirm.title": "Warning",
    "admin.confirm.cancel": "Cancel",
    "admin.confirm.proceed": "Yes, continue",
    "admin.confirm.delete": "Delete",
    "admin.confirm.remove": "Remove",
    "header.menuLabel": "MENU",
    "header.closeNav": "Close menu",
    "header.openNav": "Open menu",
    "header.navDialog": "Site navigation",
    "header.reserveTable": "Book a table",
    "header.reserveNav": "Book a table",
    "page.reserve.altBookingTitle": "Book by email or WhatsApp",
    "page.reserve.altBookingOr": "Or",
    "page.reserve.altCall": "Email",
    "page.reserve.altWhatsApp": "WhatsApp",
    "page.reserve.altWhatsAppHint":
      "Message us with your date, time, and party size.",
    "page.reserve.altCallAria": "Email to reserve a table",
    "page.reserve.altWhatsAppAria": "Reserve via WhatsApp",
    "footer.whatsapp": "WhatsApp",
    "footer.whatsappAria": "Open WhatsApp chat with el PORTERO",
    "footer.tagline":
      "el PORTERO in Torrevieja — Peruvian, Spanish and Swedish flavours in a warm, lively dinner-club setting on the Costa Blanca, minutes from the Mediterranean.",
    "footer.links": "Quick links",
    "footer.follow": "Follow",
    "footer.sitemap": "Sitemap",
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
      "Todavía no hay nada que reservar. En la cocina estamos tramando las próximas grandes noches del restaurante — seguid a @elporterorestaurant para que no se os escapen en cuanto salgan, o {contact} si tenéis un evento propio.",
    "page.home.eventsEmptyContact": "escribidnos",
    "page.home.eventsLoading": "Cargando eventos…",
    "page.home.heroReserveCta": "Reservar mesa",
    "page.home.heroTagline":
      "En el PORTERO, sabores de Perú, España y Suecia se encuentran en un ambiente cálido y lleno de vida de dinner club, con el Mediterráneo a un saque de banda.",
    "page.home.heroTaglineMobile":
      "Perú, España y Suecia — dinner club en Torrevieja.\nMediterráneo a un paso.",
    "page.comingSoon.title": "Próximamente",
    "page.comingSoon.subtitle": "EN PROCESO",
    "page.comingSoon.heroAside":
      "Manteneos atentos. Un dinner club donde se encuentran sabores de Perú, España y Suecia está tomando forma en Torrevieja, en la Costa Blanca.",
    "page.comingSoon.lowerSectionAria": "Novedades, contacto y ubicación",
    "page.menu.title": "Nuestras cartas",
    "page.menu.food": "Selección",
    "page.menu.drinks": "Bebidas",
    "page.menu.dinner": "Cena",
    "page.menu.foodHeading": "Selección de temporada",
    "page.menu.drinksHeading": "Carta de bebidas",
    "page.menu.dinnerHeading": "Cena",
    "page.menu.drinksIntro":
      "Vinos por copa y botella, aperitivos y maridajes — la carta evoluciona con la bodega y la temporada.",
    "page.menu.foodIntro":
      "Una muestra viva de nuestra cocina — para el menú de almuerzo de la semana, abrid Almuerzo.",
    "page.menu.dinnerIntro":
      "Elige por platos o el menú degustación del chef — el producto sigue el mercado y el día a día de cocina.",
    "page.menu.seeMenu": "Ver carta",
    "page.menu.scheduleLunch": "Lun–Vie · 11:00–15:00",
    "page.menu.scheduleDinner": "Lun–Sáb · 15:00–22:00",
    "page.menu.scheduleDrinks": "Diario · 12:00–00:00",
    "page.menu.weekly": "Almuerzo",
    "page.menu.weeklyHeading": "Almuerzo",
    "page.menu.weeklyWeekTitle": "Almuerzo semana {week}",
    "page.menu.weeklyIntro": "Almuerzo de lunes a viernes, 11:00–15:00.",
    "page.menu.weeklyServiceLine": "De lunes a viernes, 11:00–15:00.",
    "page.menu.weeklyLoading": "Cargando almuerzo…",
    "page.menu.weeklyEmpty":
      "La carta de almuerzo de esta semana aún no está en la web. Volved en breve para la oferta del día.",
    "page.menu.weeklyWeekLabel": "Semana del",
    "page.menu.weeklyEffectiveLabel": "Activo desde",
    "page.menu.weeklyMadridNote":
      "Ancla de la semana de almuerzo (sáb., Madrid)",
    "page.menu.hubHint":
      "Elegid una carta arriba — cada sección se abre completa debajo, con platos, maridajes y todo el detalle.",
    "page.menu.comingSoonTitle": "Las cartas, muy pronto",
    "page.menu.comingSoonBody":
      "Las estamos finalizando — estarán aquí cuando abramos el 14 de mayo.",
    "page.menu.preLaunchTitle": "Las cartas se publican el día de la apertura",
    "page.menu.preLaunchBody":
      "Todas nuestras cartas se publican aquí el 14 de mayo — la misma noche del estreno en Torrevieja.",
    "page.menu.subnavAria": "Secciones de la carta",
    "page.events.title": "Eventos",
    "page.events.heroSubtitle":
      "Montamos nuestras propias veladas en casa — cenas temáticas, grandes partidos en pantalla y invitados en cocina. ¿Celebración a medida? También acogemos bodas, empresas y fiestas con puerta cerrada.",
    "page.events.heroInquiryCta": "Solicitar presupuesto",
    "page.events.heroInquiryAria":
      "Ir a contacto — solicitar presupuesto para eventos privados",
    "page.events.explainPublicTitle": "Eventos abiertos",
    "page.events.explainPublicBody":
      "Son noches que montamos para todo el mundo: menús especiales, chefs invitados, noches de fútbol y deporte en pantalla grande, y propuestas de temporada. Reservad mesa como en cualquier otra visita — abajo tenéis fechas y detalles cuando haya cartel.",
    "page.events.explainPrivateTitle": "Vuestra celebración aquí",
    "page.events.explainPrivateBody":
      "Reservad el restaurante para vuestro grupo — bodas, cenas de empresa, cumpleaños, catas o una celebración a puerta cerrada. Decidnos fecha, tamaño del grupo y ambición; volveremos con menús, ritmo y siguientes pasos claros.",
    "page.events.listHeading": "Próximas fechas",
    "page.events.listEmpty":
      "Todavía no hay nada que reservar. En la cocina estamos tramando las próximas grandes noches del restaurante — seguid a @elporterorestaurant para que no se os escapen en cuanto salgan, o {contact} si tenéis un evento propio.",
    "page.events.listLoading": "Cargando eventos…",
    "page.events.sectionOverviewLabel":
      "Eventos abiertos y celebraciones privadas",
    "page.story.title": "Nuestra historia",
    "page.story.intro":
      "Un dinner club en la Costa Blanca donde se dan cita sabores de Perú, España y Suecia — veladas cálidas y llenas de vida a pasos del Mediterráneo.",
    "page.story.sectionOriginTitle": "Lo que nos une",
    "page.story.sectionOriginP1":
      "el PORTERO nació de una idea sencilla: un restaurante que sea a la vez festivo y preciso. Los sabores de Perú, España y Suecia se encuentran en la mesa — estaciones mediterráneas, producto honesto y servicio al ritmo de una sala acogedora y animada.",
    "page.story.sectionOriginP2":
      "Estamos en Torrevieja porque la luz, el producto y el mar marcan el tono. Vengáis para un menú degustación largo o una velada animada con amigos, queremos que cada visita se sienta intencionada.",
    "page.story.sectionMagnusTitle": "el PORTERO de la casa",
    "page.story.sectionMagnusP1":
      "el PORTERO lo dirige Magnus Hedman — ex portero profesional, internacional con Suecia y habituado a la exigencia bajo palos al máximo nivel. Una carrera leyendo la sala, cerrando línea y respondiendo bajo presión encaja con la hospitalidad: ritmo sereno, confianza en la mesa y un equipo que juega como uno.",
    "page.story.sectionMagnusP2":
      "Hoy Magnus lleva esa misma exigencia a acoger a los invitados, marcar el ambiente y conservar el carácter del restaurante: cálido, disciplinado y nunca ordinario.",
    "page.story.sectionPhilosophyTitle": "Cómo cocinamos y recibimos",
    "page.story.sectionPhilosophyBody":
      "Montamos cartas alrededor de ingredientes de temporada, vinos con criterio y el momento que vivís — desde recorridos de degustación hasta platos generosos para compartir. Noches de partido, celebraciones privadas y cenas tranquilas de entre semana tienen cabida; el hilo conductor es el cuidado que se nota en el plato, con el espíritu abierto y sociable de un dinner club.",
    "page.story.sectionCoastTitle": "Frente al Mediterráneo",
    "page.story.sectionCoastBody":
      "A un paso del mar en Torrevieja, Alicante, el PORTERO recibe a viajeros y vecinos. Reservad con antelación cuando podáis y contadnos si celebráis algo especial — haremos lo posible para que sea memorable.",
    "page.story.ctaReserve": "Reservar mesa",
    "page.story.ctaReserveAria": "Ir a reservas — reservar mesa en el PORTERO",
    "page.story.photoAltOrigin": "Cocina al paso — energía detrás del fuego",
    "page.story.photoAltMagnus":
      "Campo de fútbol visto desde arriba — foco, líneas y trabajo en equipo",
    "page.story.photoAltTileA": "Copas y luz de vela sobre la mesa",
    "page.story.photoAltTileB": "Un plato servido con mimo",
    "page.story.photoAltTileC": "Ingredientes mediterráneos para compartir",
    "page.story.photoAltCoast": "Costa mediterránea y mar abierto",
    "page.story.comingSoonBody":
      "El sueño de abrir un restaurante no se formó de la noche a la mañana. Tampoco esta página que contará esa historia. Mantente atento: pronto podrás descubrirla aquí.",
    "page.storyDraft.badge": "Borrador",
    "page.storyDraft.title": "Nuestra historia",
    "page.storyDraft.lead": "Todo empezó con un sueño.",
    "page.storyDraft.dreamKicker": "El comienzo",
    "page.storyDraft.dreamTitle": "Una sensación que no olvidé",
    "page.storyDraft.dreamP1":
      "Cuando tenía 10 años, estaba en un restaurante con mi madre mirando a mi alrededor. No recuerdo exactamente qué comí esa noche — pero sí recuerdo la sensación.",
    "page.storyDraft.dreamP2":
      "La luz. La gente. El murmullo de la sala. Las risas. Y cómo un restaurante puede hacer que la gente sienta algo en común.",
    "page.storyDraft.twoDreamsKicker": "Dos sueños",
    "page.storyDraft.twoDreamsTitle": "Fútbol — y un restaurante propio",
    "page.storyDraft.twoDreamsP1":
      "En ese momento nacieron dos sueños: ser futbolista profesional y, algún día, abrir mi propio restaurante.",
    "page.storyDraft.twoDreamsP2":
      "El sueño del fútbol se hizo realidad y me llevó por el mundo — estadios y vestuarios, victorias y derrotas. Pero el otro sueño siempre siguió conmigo.",
    "page.storyDraft.placeKicker": "Un lugar",
    "page.storyDraft.placeTitle": "Una noche que no quieres que termine",
    "page.storyDraft.placeP1":
      "El sueño era crear un lugar donde la gente se encuentre, celebre la vida, ría un poco más alto y se quede un poco más de lo que pensaba.",
    "page.storyDraft.placeP2":
      "Para mí, un restaurante es más que comida y bebida. Es la sensación al cruzar la puerta. La música. La energía. La gente alrededor de la mesa.",
    "page.storyDraft.nameKicker": "El nombre",
    "page.storyDraft.nameTitle": "el PORTERO",
    "page.storyDraft.nameP1": "el PORTERO es el resultado de ese sueño.",
    "page.storyDraft.nameP2":
      "El nombre significa “el portero” en español — un guiño a mi pasado, pero también al papel de proteger, dar la bienvenida y crear un lugar seguro.",
    "page.storyDraft.nameP3":
      "Queremos que el PORTERO sea un lugar donde la elegancia se encuentre con la calidez. Donde la cena se convierta poco a poco en una noche que no quieres que termine — y cada invitado se sienta visto y bienvenido.",
    "page.storyDraft.welcomeTitle": "De un sueño a la realidad",
    "page.storyDraft.welcomeP1":
      "De un sueño de un niño de 10 años, a hacerse realidad en Torrevieja.",
    "page.storyDraft.welcomeP2": "Bienvenidos a el PORTERO.",
    "page.storyDraft.signatureLead": "Con cariño,",
    "page.storyDraft.altDream": "Ambiente del restaurante",
    "page.storyDraft.altTwoDreams": "Magnus Hedman en su carrera futbolística",
    "page.storyDraft.altPlace": "Terraza exterior de el PORTERO",
    "page.storyDraft.altName": "Bar de el PORTERO",
    "page.storyDraft.altWelcome": "Paseo por la playa de Torrevieja",
    "page.storyDraft.altPortrait": "Retrato de Magnus Hedman",
    "page.reserve.title": "Reservas",
    "page.reserve.heroTitle": "Reservad mesa",
    "page.reserve.heroBody":
      "Decidnos cuándo queréis venir — sabores de Perú, España y Suecia en un dinner club cálido y lleno de vida, a minutos del mar. Confirmaremos por correo.",
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
    "page.reserve.altBookingTitle": "Reservar por correo o WhatsApp",
    "page.reserve.altBookingOr": "O",
    "page.reserve.altCall": "Correo",
    "page.reserve.altWhatsApp": "WhatsApp",
    "page.reserve.altWhatsAppHint": "Escribidnos con fecha, hora y comensales.",
    "page.reserve.altCallAria": "Enviar correo para reservar mesa",
    "page.reserve.altWhatsAppAria": "Reservar por WhatsApp",
    "page.contact.title": "Contacto",
    "page.contact.heroTitle": "Escribidnos",
    "page.contact.heroBody":
      "Llamad o escribid — contestamos en cuanto podamos.",
    "page.contact.phoneLabel": "Teléfono",
    "page.contact.emailLabel": "Correo",
    "page.gallery.srHeading": "Un vistazo a el PORTERO",
    "page.gallery.imageAlt1":
      "Brochetas de carne y verdura a la parrilla — cocina con acento peruano y español",
    "page.gallery.imageAlt2": "Plato de temporada de la cocina de el PORTERO",
    "page.gallery.imageAlt3": "Camarero preparando cócteles en la barra",
    "page.gallery.caption1": "Alma peruana y calor español desde la parrilla.",
    "page.gallery.caption2":
      "Confort sueco y sabores de Perú y España — en la misma mesa.",
    "page.gallery.caption3": "Una barra pensada para toda la velada.",
    "page.gallery.body1":
      "Cocinamos en el punto donde se encuentran Perú, España y Suecia — brasa, producto mediterráneo del sur y acentos peruanos con confort nórdico en la misma carta. La parrilla es donde muchos de esos sabores cobran vida, a un paso del Mediterráneo.",
    "page.gallery.body2":
      "Los clásicos suecos conviven con platos peruanos e ibéricos — una mesa de dinner club donde las tres cocinas comparten la misma velada.",
    "page.gallery.body3":
      "Nuestra barra va al ritmo de cocina: cócteles cuidados, servicio cercano y un mostrador donde empezar la noche con un trago o quedaros para uno más después del postre.",
    "page.hours.title": "Horario",
    "page.hours.map": "Ubicación",
    "page.hours.mapIframeTitle": "Mapa: el PORTERO, Torrevieja",
    "page.admin.title": "Acceso admin",
    "page.admin.intro": "Acceso restringido para el equipo.",
    "page.admin.email": "Correo",
    "page.admin.password": "Contraseña",
    "page.admin.signIn": "Entrar",
    "page.admin.backToSite": "Volver al sitio",
    "admin.signOut": "Cerrar sesión",
    "admin.signOutAria": "Cerrar sesión de administración",
    "admin.dashboard": "Panel",
    "admin.dashboard.title": "Panel",
    "admin.dashboard.intro": "Elegid qué queréis editar.",
    "admin.dashboard.signedInAs": "Sesión iniciada como",
    "admin.dashboard.eventsLabel": "Eventos",
    "admin.dashboard.eventsHeading": "Eventos",
    "admin.dashboard.eventsDescription":
      "Añadid y actualizad veladas y actividades en la página de inicio y en Eventos. Dejad los borradores ocultos hasta que estén listos para los clientes.",
    "admin.dashboard.eventsLink": "Gestionar eventos",
    "admin.dashboard.menusLabel": "Cartas",
    "admin.dashboard.menusHeading": "Carta",
    "admin.dashboard.menusDescription":
      "Editad las cartas de cena y bebidas por secciones. Guardad el borrador y publicad cuando los clientes deban ver la carta en la web.",
    "admin.dashboard.menusLink": "Gestionar cartas",
    "admin.dashboard.hoursLabel": "Horario",
    "admin.dashboard.hoursHeading": "Horario de apertura",
    "admin.dashboard.hoursDescription":
      "Horario semanal y horas de apertura/cierre en la página de inicio. Guardad y publicad cuando los clientes deban ver los cambios.",
    "admin.dashboard.hoursLink": "Gestionar horario",
    "admin.dashboard.backToSite": "← Volver al sitio",
    "admin.dashboard.now": "Ahora",
    "admin.dashboard.liveEvents": "En la web",
    "admin.dashboard.inactiveEvents": "Inactivos o pasados",
    "admin.dashboard.nextEvent": "Siguiente",
    "admin.dashboard.noUpcoming": "Nada próximo",
    "admin.dashboard.fullyBookedCount": "Completos: {count}",
    "openingHours.day.mon": "Lun",
    "openingHours.day.tue": "Mar",
    "openingHours.day.wed": "Mié",
    "openingHours.day.thu": "Jue",
    "openingHours.day.fri": "Vie",
    "openingHours.day.sat": "Sáb",
    "openingHours.day.sun": "Dom",
    "openingHours.closed": "Cerrado",
    "admin.openingHours.title": "Horario de apertura",
    "admin.openingHours.intro":
      "Editad el horario semanal de la página de inicio. Cada día usa menús desplegables — el indicador abierto/cerrado se actualiza automáticamente según el horario de hoy (Europa/Madrid).",
    "admin.openingHours.statusTitle": "Estado",
    "admin.openingHours.statusIntro":
      "Guardad el borrador y publicad cuando la web deba mostrar el nuevo horario.",
    "admin.openingHours.scheduleTitle": "Horario semanal",
    "admin.openingHours.scheduleIntro":
      "Elegid Abierto o Cerrado para cada día. Si está abierto, elegid hora de apertura y cierre en pasos de media hora. Se admite cierre después de medianoche (p. ej. 01:00).",
    "admin.openingHours.dayStatus": "Estado del día",
    "admin.openingHours.statusOpen": "Abierto",
    "admin.openingHours.statusClosed": "Cerrado",
    "admin.openingHours.openFrom": "Abre a las",
    "admin.openingHours.openUntil": "Cierra a las",
    "admin.openingHours.day.mon": "Lunes",
    "admin.openingHours.day.tue": "Martes",
    "admin.openingHours.day.wed": "Miércoles",
    "admin.openingHours.day.thu": "Jueves",
    "admin.openingHours.day.fri": "Viernes",
    "admin.openingHours.day.sat": "Sábado",
    "admin.openingHours.day.sun": "Domingo",
    "admin.openingHours.loadError": "No se pudo cargar el horario.",
    "admin.openingHours.saved": "Guardado. Los clientes solo ven horarios publicados.",
    "admin.openingHours.saveError": "No se pudo guardar. Comprobad la conexión e intentad de nuevo.",
    "admin.openingHours.publishedSuccess": "Publicado — visible en la web.",
    "admin.openingHours.publishError": "No se pudo publicar. Intentad de nuevo.",
    "admin.openingHours.unpublishedSuccess": "Despublicado — oculto para clientes (borrador conservado).",
    "admin.openingHours.unpublishError": "No se pudo despublicar. Intentad de nuevo.",
    "admin.loading": "Cargando…",
    "admin.checkingSignIn": "Comprobando acceso…",
    "admin.signingIn": "Entrando…",
    "admin.signedInTitle": "Sesión iniciada",
    "admin.signedInOpening": "Abriendo el espacio de trabajo…",
    "admin.chrome.staff": "Zona de personal",
    "admin.events.title": "Eventos",
    "admin.events.introLead":
      "Aquí gestionáis las veladas y actividades que ven los clientes en la página de inicio y en Eventos.",
    "admin.events.allEvents": "Todos los eventos",
    "admin.events.newEvent": "Nuevo evento",
    "admin.events.emptyList": "Aún no hay eventos. Pulsad Nuevo evento arriba para añadir el primero.",
    "admin.events.draft": "Borrador",
    "admin.events.pastRemove": "Pasado — podéis borrarlo",
    "admin.events.duplicate": "Duplicar",
    "admin.events.makeCopy": "Hacer una copia",
    "admin.events.unsaved": "Cambios sin guardar",
    "admin.events.saved": "Guardado",
    "admin.events.openEventsPage": "Abrir la página de eventos",
    "admin.events.formNew": "Nuevo evento",
    "admin.events.formEdit": "Editar evento",
    "admin.events.idLabel": "Nombre corto (ID)",
    "admin.events.idPlaceholder": "p. ej. cena-vino-junio-2026",
    "admin.events.idHint":
      "Los clientes no ven este nombre corto. Solo se usa en esta lista y al guardar el evento.",
    "admin.events.idLocked": "El nombre corto no se puede cambiar después de crear el evento.",
    "admin.events.sectionBasics": "Nombre y fecha",
    "admin.events.sectionTime": "Hora",
    "admin.events.sectionPhoto": "Foto",
    "admin.events.sectionCopy": "Texto que verán los clientes",
    "admin.events.sectionReview": "Revisar traducciones",
    "admin.events.sectionPublish": "Estado en la web",
    "admin.events.previewHint": "Pulsad la tarjeta para editar lo que ven los clientes. El idioma se cambia arriba a la derecha.",
    "admin.events.guestDateLabel": "Los clientes lo ven como",
    "admin.events.calendarDate": "Fecha en el calendario",
    "admin.events.specificTime": "No mostrar",
    "admin.events.fullyBooked": "Completo",
    "admin.events.published": "Visible en la web real",
    "admin.events.publishedHint": "Los clientes en www.el-portero.com pueden ver este evento.",
    "admin.events.publishedLocal": "Solo en este ordenador",
    "admin.events.publishedLocalHint":
      "Se ve aquí en localhost. La web real no lo mostrará.",
    "admin.events.statusHidden": "Oculto",
    "admin.events.statusHiddenHint": "Los clientes en www.el-portero.com no pueden ver este evento.",
    "admin.events.statusHiddenLocalHint": "No se muestra en localhost ni en la web real.",
    "admin.events.localOnly": "Solo local",
    "admin.events.imageUrl": "Enlace de la foto",
    "admin.events.imageUrlHint":
      "Subid una foto desde el ordenador (la redimensionamos). También podéis pegar un enlace si lo preferís.",
    "admin.events.datePreviewHint":
      "Fecha que verán los clientes (se rellena sola según la fecha del calendario):",
    "admin.events.timeOnly": "Hora",
    "admin.events.timeOnlyHint":
      "Las horas de inicio y fin se muestran en la web (24 h).",
    "admin.events.startTime": "Hora de inicio",
    "admin.events.endTime": "Hora de fin",
    "admin.events.preview": "Vista previa",
    "admin.events.titleField": "Título",
    "admin.events.excerpt": "Descripción breve",
    "admin.events.imageAlt": "Descripción de la foto (accesibilidad)",
    "admin.events.create": "Crear",
    "admin.events.saveChanges": "Guardar cambios",
    "admin.events.delete": "Eliminar",
    "admin.events.saveNewTooltip": "Guardar nuevo evento",
    "admin.events.saveEditTooltip": "Guardar cambios",
    "admin.events.saveNewDisabledTooltip": "Editad la vista previa o los datos de abajo para crear un evento",
    "admin.events.saveEditDisabledTooltip": "Sin cambios pendientes — editad la vista previa o los datos de abajo para guardar",
    "admin.events.duplicateLoaded":
      "Copia cargada — revisad el nombre corto (ID) y la fecha, luego pulsad Crear.",
    "admin.events.created": "Evento creado.",
    "admin.events.updated": "Evento actualizado.",
    "admin.events.deleted": "Evento eliminado.",
    "admin.events.deleteConfirm": "¿Eliminar «{id}»? No se puede deshacer.",
    "admin.events.loadError": "No se pudieron cargar los eventos. Actualizad la página.",
    "admin.events.saveError": "No se pudo guardar. Comprobad la conexión e intentad de nuevo.",
    "admin.events.deleteError": "No se pudo eliminar. Intentad de nuevo.",
    "admin.events.storageFullTitle": "La lista de eventos está llena",
    "admin.events.storageFullBody": "Podéis guardar {max} eventos. Borrad uno antes de añadir otro.",
    "admin.events.storageCreateTitle": "Aún no podéis guardar un evento nuevo",
    "admin.events.storageCreateBody": "La lista está llena. Borrad un evento de la izquierda e intentadlo de nuevo.",
    "admin.events.storageListWarning": "La lista está llena. Borrad un evento para añadir uno nuevo.",
    "admin.events.storageEmptySlot": "Vacío",
    "admin.events.storageCount": "{count} de {max}",
    "admin.events.storageMeterAria": "{count} de {max} eventos",
    "admin.events.storageFullSaveError": "La lista está llena. Borrad un evento primero.",
    "admin.events.invalidId":
      "Nombre corto (ID): de 1 a 64 caracteres — solo letras minúsculas, números y guiones (p. ej. cena-verano-2026).",
    "admin.events.invalidTime": "La hora de fin debe ser igual o posterior a la de inicio.",
    "admin.events.loadingTitle": "Eventos",
    "admin.events.loadingIntro": "Cargando…",
    "admin.events.translateContent": "Traducir contenido",
    "admin.events.translating": "Traduciendo…",
    "admin.events.translateWait1": "La traducción está en marcha. Esperad un par de segundos.",
    "admin.events.translateWait2": "Comprobamos en qué idioma escribisteis y luego traducimos el resto.",
    "admin.events.translateWait3":
      "La vista previa se actualiza cuando todos los idiomas están listos. Podéis dejar esto abierto.",
    "admin.events.translateElapsed": "Tiempo transcurrido {time}",
    "admin.events.translateLanguageCorrected":
      "Lo que escribisteis en el campo de {source} está en {detected}. Ese texto original queda guardado como {detected}, y {source} tiene ahora la traducción. También se rellenaron los demás idiomas vacíos. Cambiad el idioma en la vista previa para revisarlos y guardad.",
    "admin.events.translateLanguageCorrectedSplit":
      "El título está en {titleLanguage} y la descripción en {excerptLanguage}. Cada original se guarda en su idioma, y los campos de {source} tienen ahora la traducción. Cambiad el idioma en la vista previa para revisarlos y guardad.",
    "admin.events.translateError":
      "No se pudo traducir. Hay que activar Firebase AI Logic en el proyecto e intentarlo de nuevo.",
    "admin.events.translateSuccess":
      "Los idiomas vacíos y las descripciones de la foto se rellenaron desde {language}. Cambiad el idioma en la vista previa para revisarlos y guardad.",
    "admin.events.translateNeedText": "Añadid un título o una descripción antes de traducir.",
    "admin.events.reviewTranslations": "Revisar traducciones",
    "admin.events.uploadImage": "Subir foto",
    "admin.events.replaceImage": "Sustituir foto",
    "admin.events.removeImage": "Quitar foto",
    "admin.events.imageUploading": "Subiendo foto…",
    "admin.events.imageUploadError":
      "No se pudo subir la foto. Intentad de nuevo o pegad un enlace.",
    "admin.events.imageHint": "¿Preferís un enlace? Pegadlo aquí.",
    "admin.events.imageAltHint":
      "Corresponde al idioma seleccionado en la vista previa. Se rellena al traducir. Editadla si queréis más detalle.",
    "admin.events.sourceHint":
      "Escribid el título y la descripción en la tarjeta y pulsad Traducir contenido.",
    "admin.events.orPasteLink": "O pegar un enlace de foto",
    "admin.events.notTranslatedYet": "Aún no traducido",
    "admin.events.previewLanguage": "Idioma de la vista previa",
    "admin.events.changePhoto": "Cambiar foto",
    "admin.events.addTime": "Añadir hora",
    "admin.events.descriptionText": "Texto",
    "admin.events.descriptionBullets": "Viñetas",
    "admin.events.descriptionBold": "Negrita",
    "admin.events.descriptionItalic": "Cursiva",
    "admin.events.available": "Disponible",
    "admin.events.editDate": "Fecha del evento",
    "admin.events.editTime": "Hora de inicio y fin",
    "admin.events.editAvailability": "Estado de reserva",
    "admin.events.chooseLanguage": "Elegir idioma de la vista previa",
    "admin.events.staffHint": "Los clientes no ven estos campos. Solo se usan aquí.",
    "admin.events.step": "Paso {n}",
    "admin.events.step1Title": "Detalles y vista previa",
    "admin.events.step3Title": "Nombre corto y estado en la web",
    "admin.events.step4Title": "Repaso",
    "admin.events.step4Hint": "Revisad el resto antes de guardar.",
    "admin.menus.title": "Cartas",
    "admin.menus.intro":
      "Cena y bebidas son cartas distintas. Cada carta se compone de secciones, y cada sección agrupa los platos que ven los clientes bajo ese título.",
    "admin.menus.reload": "Recargar",
    "admin.menus.tabDinner": "Cena",
    "admin.menus.tabDrinks": "Bebidas",
    "admin.menus.status": "Estado",
    "admin.menus.statusIntro":
      "Las cartas no publicadas muestran contenido de demostración en la web hasta que publiquéis.",
    "admin.menus.publishedLabel": "Publicado:",
    "admin.menus.yes": "Sí",
    "admin.menus.no": "No",
    "admin.menus.publish": "Publicar",
    "admin.menus.unpublish": "Despublicar",
    "admin.menus.menuTitleLabel": "Título de la carta",
    "admin.menus.menuTitlePlaceholder": "p. ej. Carta de primavera",
    "admin.menus.sectionTitleLabel": "Título de sección",
    "admin.menus.removeSection": "Eliminar sección",
    "admin.menus.hideSection": "Ocultar sección",
    "admin.menus.showSection": "Mostrar sección",
    "admin.menus.hideBtn": "Ocultar",
    "admin.menus.showBtn": "Mostrar",
    "admin.menus.saveBeforeHide": "Guardad los cambios antes de ocultar o mostrar para los clientes",
    "admin.menus.hideDish": "Ocultar plato",
    "admin.menus.showDish": "Mostrar plato",
    "admin.menus.hideDrink": "Ocultar bebida",
    "admin.menus.showDrink": "Mostrar bebida",
    "admin.menus.hiddenFromGuests": "Oculto para clientes",
    "admin.menus.hiddenItemsCount": "{count} ocultos para clientes",
    "admin.menus.removeDish": "Eliminar plato",
    "admin.menus.removeDrink": "Eliminar bebida",
    "admin.menus.addDish": "Añadir plato",
    "admin.menus.addSection": "Añadir sección",
    "admin.menus.addDrink": "Añadir bebida",
    "admin.menus.dragSection": "Arrastrar para reordenar sección",
    "admin.menus.dragItem": "Arrastrar para reordenar elemento",
    "admin.menus.expandSection": "Expandir sección",
    "admin.menus.collapseSection": "Contraer sección",
    "admin.menus.expandItem": "Expandir elemento",
    "admin.menus.collapseItem": "Contraer elemento",
    "admin.menus.nameLabel": "Nombre",
    "admin.menus.nameExtensionLabel": "Complemento del nombre",
    "admin.menus.optional": "(opcional)",
    "admin.menus.nameExtensionPlaceholder":
      "Debajo del nombre, mismo estilo, más pequeño — p. ej. región o añada",
    "admin.menus.descriptionLabel": "Descripción",
    "admin.menus.priceLabel": "Precio",
    "admin.menus.priceExamplePlaceholder": "p. ej. 24 o 24,50",
    "admin.menus.priceHiddenPlaceholder": "Oculto — las variantes de tamaño abajo lo sustituyen",
    "admin.menus.priceHiddenNote":
      "El precio único de arriba no se muestra en la carta pública mientras haya variantes de tamaño.",
    "admin.menus.sizeVariantsTitle": "Variantes de tamaño (opcional)",
    "admin.menus.sizeVariantsHint":
      "Para bebidas en varios tamaños (p. ej. Pequeño / Grande, 33cl / 50cl, Copa / Botella). Si se rellenan, sustituyen al precio único en la web.",
    "admin.menus.sizeLabelPlaceholder": "Etiqueta (p. ej. Pequeño)",
    "admin.menus.priceFieldPlaceholder": "Precio",
    "admin.menus.removeVariant": "Quitar",
    "admin.menus.removeVariantAria": "Quitar variante de tamaño {n}",
    "admin.menus.addSize": "Añadir tamaño",
    "admin.menus.dietaryTagsTitle": "Etiquetas dietéticas",
    "admin.menus.dietaryHintDrinks":
      "Opcional — p. ej. mocktails sin alcohol, cerveza sin gluten, vegano o sin lácteos.",
    "admin.menus.dietaryHintFood": "Opcional — marcá las que correspondan.",
    "admin.menus.allergensTitle": "Alérgenos (UE 1–14)",
    "admin.menus.allergensHint":
      "Pulsad los círculos numerados de los alérgenos presentes. Los números coinciden con la leyenda de la carta pública.",
    "admin.menus.loadError": "No se pudo cargar la carta.",
    "admin.menus.saved": "Guardado. Los clientes solo ven cartas publicadas.",
    "admin.menus.saveError": "No se pudo guardar. Comprobad la conexión e intentad de nuevo.",
    "admin.menus.publishedSuccess": "Publicado — visible en la web.",
    "admin.menus.publishError": "No se pudo publicar. Intentad de nuevo.",
    "admin.menus.unpublishedSuccess": "Despublicado — oculto para clientes (borrador conservado).",
    "admin.menus.unpublishError": "No se pudo despublicar. Intentad de nuevo.",
    "admin.menus.removeSectionConfirm":
      "¿Eliminar la sección «{section}»?\n\nSe borra el título de la sección y todos los platos que hay debajo ({countPhrase}) — no solo el título. Los clientes no verán el cambio en la web hasta que pulséis Guardar cambios.",
    "admin.menus.removeDishConfirm":
      "¿Eliminar el plato «{dish}» de esta sección?\n\nSe quita del borrador. Pulsad Guardar cambios cuando terminéis de editar.",
    "admin.menus.removeDrinkConfirm":
      "¿Eliminar la bebida «{dish}» de esta sección?\n\nSe quita del borrador. Pulsad Guardar cambios cuando terminéis de editar.",
    "admin.menus.untitledSection": "Sección sin título",
    "admin.menus.untitledDish": "Plato sin nombre",
    "admin.menus.untitledDrink": "Bebida sin nombre",
    "admin.menus.outline": "Cartas",
    "admin.menus.sectionsLabel": "Secciones",
    "admin.menus.connectionHint":
      "Una sección es un título de la carta. Los platos anidados debajo son lo que leen los clientes en ese grupo.",
    "admin.menus.editingSection": "Platos de esta sección",
    "admin.menus.noSection": "Esta carta aún no tiene secciones. Añadid una para empezar un grupo de platos.",
    "admin.menus.visibleOnSite": "En la web",
    "admin.menus.hiddenOnSite": "Solo borrador",
    "admin.menus.shownToGuests": "Visible para clientes",
    "admin.menus.unsavedChanges": "Cambios sin guardar",
    "admin.menus.allSaved": "Todos los cambios guardados",
    "admin.menus.breadcrumb": "Dónde estáis en la carta",
    "admin.menus.menuTitleHint":
      "Este es el botón en la parte superior de la carta en la web. Sin título, ese botón no se muestra.",
    "admin.menus.chooseSection": "Elegid una sección a la izquierda para editar sus platos.",
    "admin.confirm.title": "Atención",
    "admin.confirm.cancel": "Cancelar",
    "admin.confirm.proceed": "Sí, continuar",
    "admin.confirm.delete": "Eliminar",
    "admin.confirm.remove": "Quitar",
    "footer.whatsapp": "WhatsApp",
    "footer.whatsappAria": "Abrir chat de WhatsApp con el PORTERO",
    "footer.tagline":
      "el PORTERO en Torrevieja — sabores de Perú, España y Suecia en un dinner club cálido y lleno de vida en la Costa Blanca, a minutos del Mediterráneo.",
    "footer.links": "Enlaces rápidos",
    "footer.follow": "Síguenos",
    "footer.sitemap": "Mapa del sitio",
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
    "nav.story": "Vår story",
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
      "Inget att boka än. Vi står i köket och kokar ihop restaurangens nästa stora kvällar — följ @elporterorestaurant så de inte smiter förbi er, eller {contact} om ni har ett eget event på gång.",
    "page.home.eventsEmptyContact": "hör av er",
    "page.home.eventsLoading": "Laddar evenemang…",
    "page.home.heroReserveCta": "Boka bord",
    "page.home.heroTagline":
      "På el PORTERO möts smaker från Peru, Spanien och Sverige i en varm och levande dinner club-atmosfär, med Medelhavet bara ett inkast bort.",
    "page.home.heroTaglineMobile":
      "Peru, Spanien & Sverige — dinner club i Torrevieja.\nMedelhavet nära.",
    "page.comingSoon.title": "Snart öppnar vi",
    "page.comingSoon.subtitle": "UNDER ARBETE",
    "page.comingSoon.heroAside":
      "Håll utkik. En dinner club där smaker från Peru, Spanien och Sverige möts tar form i Torrevieja på Costa Blanca.",
    "page.comingSoon.lowerSectionAria": "Nyheter, kontakt och adress",
    "page.menu.title": "Våra menyer",
    "page.menu.food": "Höjdpunkter",
    "page.menu.drinks": "Dryck",
    "page.menu.dinner": "Middag",
    "page.menu.foodHeading": "Säsongens höjdpunkter",
    "page.menu.drinksHeading": "Dryckesmeny",
    "page.menu.dinnerHeading": "Middag",
    "page.menu.drinksIntro":
      "Vin på glas och flaska, aperitifer och maridage — listan följer vinkällaren och säsongen.",
    "page.menu.foodIntro":
      "Ett levande urval av vårt kök — veckans lunchmeny finns under Lunch.",
    "page.menu.dinnerIntro":
      "Välj rätter fristående eller kockens avsmakning — råvaror följer marknad och kökets dagsform.",
    "page.menu.seeMenu": "Se menyn",
    "page.menu.scheduleLunch": "Mån–Fre · 11:00–15:00",
    "page.menu.scheduleDinner": "Mån–Lör · 15:00–22:00",
    "page.menu.scheduleDrinks": "Dagligen · 12:00–00:00",
    "page.menu.weekly": "Lunch",
    "page.menu.weeklyHeading": "Lunch",
    "page.menu.weeklyWeekTitle": "Lunch vecka {week}",
    "page.menu.weeklyIntro": "Lunch serveras måndag–fredag 11:00–15:00.",
    "page.menu.weeklyServiceLine": "Måndag–fredag 11:00–15:00.",
    "page.menu.weeklyLoading": "Laddar lunch…",
    "page.menu.weeklyEmpty":
      "Veckans lunchmeny är inte publicerad än. Kom tillbaka snart för dagens erbjudande.",
    "page.menu.weeklyWeekLabel": "Vecka från",
    "page.menu.weeklyEffectiveLabel": "Aktiveras",
    "page.menu.weeklyMadridNote": "Lunchveckans ankare (lör, Madrid)",
    "page.menu.hubHint":
      "Välj meny ovan — varje del öppnas i full längd nedanför, med rätter, maridage och allt du behöver.",
    "page.menu.comingSoonTitle": "Menyerna kommer snart",
    "page.menu.comingSoonBody":
      "Vi slutför menyerna nu — de publiceras när vi öppnar dörrarna den 14 maj.",
    "page.menu.preLaunchTitle": "Menyerna publiceras på öppningskvällen",
    "page.menu.preLaunchBody":
      "Alla våra menyer släpps här den 14 maj — samma kväll som vi drar upp ridån i Torrevieja.",
    "page.menu.subnavAria": "Menydelar",
    "page.events.title": "Events",
    "page.events.heroSubtitle":
      "Vi kör egna kvällar på restaurangen — temamiddagar, stora matcher på duk och gästkockar. Vill ni stänga dörren? Vi tar också emot bröllop, företag och privata firanden.",
    "page.events.heroInquiryCta": "Offertförfrågan",
    "page.events.heroInquiryAria":
      "Gå till kontakt — offertförfrågan för privata event",
    "page.events.explainPublicTitle": "Våra publika kvällar",
    "page.events.explainPublicBody":
      "Det här är kvällar vi lägger för alla gäster: specialmenyer, kockar på besök, sport och fotboll på storbild, och säsongsidéer längs vägen. Boka bord som vanligt — datum och info finns nedan när något är publicerat.",
    "page.events.explainPrivateTitle": "Ert event hos oss",
    "page.events.explainPrivateBody":
      "Ta över restaurangen för er skara — bröllop, företagsmiddagar, födelsedagar, provningar eller en helt privat fest. Berätta om datum, antal gäster och känsla; vi återkom med meny, upplägg och nästa steg.",
    "page.events.listHeading": "Kommande",
    "page.events.listEmpty":
      "Inget att boka än. Vi står i köket och kokar ihop restaurangens nästa stora kvällar — följ @elporterorestaurant så de inte smiter förbi er, eller {contact} om ni har ett eget event på gång.",
    "page.events.listLoading": "Laddar evenemang…",
    "page.events.sectionOverviewLabel": "Publika kvällar och privata event",
    "page.story.title": "Vår historia",
    "page.story.intro":
      "En dinner club på Costa Blanca där smaker från Peru, Spanien och Sverige möts — varma, levande kvällar ett stenkast från Medelhavet.",
    "page.story.sectionOriginTitle": "Det som förenar oss",
    "page.story.sectionOriginP1":
      "el PORTERO växte ur en enkel tanke: en restaurang som känns både festlig och precis. Smaker från Peru, Spanien och Sverige möts vid bordet — medelhavssäsong, ärliga råvaror och service som följer en varm och levande salong.",
    "page.story.sectionOriginP2":
      "Vi finns i Torrevieja för att ljuset, råvarorna och havet sätter stämningen. Oavsett om du kommer för en lång avsmakningsmeny eller en livlig kväll med vänner vill vi att varje besök ska kännas genomtänkt.",
    "page.story.sectionMagnusTitle": "Husets målvakt",
    "page.story.sectionMagnusP1":
      "el PORTERO leds av Magnus Hedman — före detta professionell målvakt, landslagsman för Sverige och van vid trycket mellan stolparna på högsta nivå. Ett liv av att läsa spelet, hålla linjen och leverera när det gäller översätter väl till gästfrihet: lugnt tempo, förtroende vid bordet och ett lag som rör sig som ett.",
    "page.story.sectionMagnusP2":
      "I dag kanaliserar Magnus samma fokus till att välkomna gäster, forma salongen och bevara restaurangens särprägel — varm, tydlig och alltid mer än vardag.",
    "page.story.sectionPhilosophyTitle": "Hur vi lagar och värdskapar",
    "page.story.sectionPhilosophyBody":
      "Vi bygger menyer kring säsong, viner med omsorg och stunden du är i — från smakresor till generösa rätter att dela. Stora matcher, privata firanden och tysta vardagskvällar får plats här; den röda tråden är omsorg du känner på tallriken — och den öppna, sociala känslan i en dinner club.",
    "page.story.sectionCoastTitle": "Vid Medelhavet",
    "page.story.sectionCoastBody":
      "På promenadavstånd från vattnet i Torrevieja, Alicante, välkomnar el PORTERO både resenärer och grannar. Boka gärna i förväg och berätta om ni firar något särskilt — vi gör vårt bästa för att göra kvällen minnesvärd.",
    "page.story.ctaReserve": "Boka bord",
    "page.story.ctaReserveAria": "Gå till bokning — boka bord på el PORTERO",
    "page.story.photoAltOrigin": "Tillagning vid pass — energi i köket",
    "page.story.photoAltMagnus":
      "Fotbollsplan ovanifrån — fokus, linjer och lagarbete",
    "page.story.photoAltTileA": "Vinglas och stämningsljus vid bordet",
    "page.story.photoAltTileB": "En varsamt komponerad rätt",
    "page.story.photoAltTileC": "Medelhavsråvaror att dela",
    "page.story.photoAltCoast": "Medelhavskust och öppet vatten",
    "page.story.comingSoonBody":
      "Drömmen om att öppna en restaurang växte inte fram över en natt. Det gör inte heller den här sidan som kommer att berätta den historien. Håll utkik – snart kan du utforska den här.",
    "page.storyDraft.badge": "Utkast",
    "page.storyDraft.title": "Vår story",
    "page.storyDraft.lead": "Allt började med en dröm.",
    "page.storyDraft.dreamKicker": "Allt började",
    "page.storyDraft.dreamTitle": "En känsla jag aldrig glömde",
    "page.storyDraft.dreamP1":
      "När jag var 10 år satt jag på restaurang med min mamma och tittade mig omkring. Jag minns inte exakt vad jag åt den kvällen — men jag minns känslan.",
    "page.storyDraft.dreamP2":
      "Ljuset. Människorna. Sorlet. Skratten. Och hur en restaurang kan få människor att känna något tillsammans.",
    "page.storyDraft.twoDreamsKicker": "Två drömmar",
    "page.storyDraft.twoDreamsTitle": "Fotboll — och en egen restaurang",
    "page.storyDraft.twoDreamsP1":
      "Där och då föddes två drömmar: att bli fotbollsproffs, och att en dag öppna en egen restaurang.",
    "page.storyDraft.twoDreamsP2":
      "Fotbollsdrömmen blev verklighet och tog mig runt världen — genom arenor och omklädningsrum, medgångar och motgångar. Men den andra drömmen levde alltid kvar inom mig.",
    "page.storyDraft.placeKicker": "En plats",
    "page.storyDraft.placeTitle": "En kväll man inte vill ska ta slut",
    "page.storyDraft.placeP1":
      "Drömmen var att skapa en plats där människor möts, firar livet, skrattar lite högre och stannar lite längre än de tänkt.",
    "page.storyDraft.placeP2":
      "För mig handlar en restaurang om mer än mat och dryck. Det handlar om känslan när du kliver in genom dörren. Musiken. Energin. Människorna runt bordet.",
    "page.storyDraft.nameKicker": "Namnet",
    "page.storyDraft.nameTitle": "el PORTERO",
    "page.storyDraft.nameP1": "el PORTERO är resultatet av den drömmen.",
    "page.storyDraft.nameP2":
      "Namnet betyder “målvakten” på spanska. Det är en hyllning till min bakgrund — men också till rollen att skydda, välkomna och skapa trygghet.",
    "page.storyDraft.nameP3":
      "Vi vill att el PORTERO ska vara en plats där elegans möter värme. Där middagen långsamt förvandlas till en kväll man inte vill ska ta slut. Där varje gäst känner sig sedd och välkommen.",
    "page.storyDraft.welcomeTitle": "Från en pojkes dröm till verklighet",
    "page.storyDraft.welcomeP1":
      "Från en 10-årig pojkes dröm, till verklighet i Torrevieja.",
    "page.storyDraft.welcomeP2": "Varmt välkomna till el PORTERO.",
    "page.storyDraft.signatureLead": "Med värme,",
    "page.storyDraft.altDream": "Restaurangstämning",
    "page.storyDraft.altTwoDreams": "Magnus Hedman under sin fotbollskarriär",
    "page.storyDraft.altPlace": "Uteservering på el PORTERO",
    "page.storyDraft.altName": "Baren på el PORTERO",
    "page.storyDraft.altWelcome": "Promenad på stranden i Torrevieja",
    "page.storyDraft.altPortrait": "Porträtt av Magnus Hedman",
    "page.reserve.title": "Bokning",
    "page.reserve.heroTitle": "Boka ert bord",
    "page.reserve.heroBody":
      "Berätta när ni vill komma — smaker från Peru, Spanien och Sverige i en varm och levande dinner club-stämning, minuter från vattnet. Vi bekräftar via mejl.",
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
    "page.reserve.altBookingTitle": "Boka via mejl eller WhatsApp",
    "page.reserve.altBookingOr": "Eller",
    "page.reserve.altCall": "Mejl",
    "page.reserve.altWhatsApp": "WhatsApp",
    "page.reserve.altWhatsAppHint": "Skriv datum, tid och antal gäster.",
    "page.reserve.altCallAria": "Mejla för att boka bord",
    "page.reserve.altWhatsAppAria": "Boka via WhatsApp",
    "page.contact.title": "Kontakt",
    "page.contact.heroTitle": "Hör av dig",
    "page.contact.heroBody": "Ring eller mejla — vi återkommer så fort vi kan.",
    "page.contact.phoneLabel": "Telefon",
    "page.contact.emailLabel": "E-post",
    "page.gallery.srHeading": "En glimt av el PORTERO",
    "page.gallery.imageAlt1":
      "Grillade kött- och grönsaksspett — peruansk- och spanskinspirerad mat från grillen",
    "page.gallery.imageAlt2": "Säsongsrätt från el PORTEROs kök",
    "page.gallery.imageAlt3": "Bartender som blandar drinkar i baren",
    "page.gallery.caption1": "Peruansk själ och spansk värme från grillen.",
    "page.gallery.caption2":
      "Svensk trygghet möter peruanska och spanska smaker — vid samma bord.",
    "page.gallery.caption3": "En bar som hänger med hela kvällen.",
    "page.gallery.body1":
      "Vi lagar mat där Peru, Spanien och Sverige möts — kolglöd, medelhavsråvaror från söder, peruanska accenter och nordisk trygghet på samma meny. Grillen är navet i hur smakerna möts, ett stenkast från Medelhavet.",
    "page.gallery.body2":
      "Svenska klassiker samsas med peruanska och iberiska rätter — ett dinner club-bord där alla tre köken får plats i samma kväll.",
    "page.gallery.body3":
      "Vår bar håller samma tempo som köket: genomtänkta cocktails, varm service och en disk där ni kan börja kvällen med en drink eller stanna för en sista efter desserten.",
    "page.hours.title": "Öppettider",
    "page.hours.map": "Plats",
    "page.hours.mapIframeTitle": "Karta: el PORTERO, Torrevieja",
    "page.admin.title": "Admininloggning",
    "page.admin.intro": "Begränsad åtkomst för personal.",
    "page.admin.email": "E-post",
    "page.admin.password": "Lösenord",
    "page.admin.signIn": "Logga in",
    "page.admin.backToSite": "Tillbaka till sajten",
    "admin.signOut": "Logga ut",
    "admin.signOutAria": "Logga ut från admin",
    "admin.dashboard": "Översikt",
    "admin.dashboard.title": "Översikt",
    "admin.dashboard.intro": "Välj vad ni vill redigera.",
    "admin.dashboard.signedInAs": "Inloggad som",
    "admin.dashboard.eventsLabel": "Evenemang",
    "admin.dashboard.eventsHeading": "Evenemang",
    "admin.dashboard.eventsDescription":
      "Lägg till och uppdatera kvällar och aktiviteter på startsidan och under Evenemang. Behåll utkast dolda tills ni är redo för gäster.",
    "admin.dashboard.eventsLink": "Hantera evenemang",
    "admin.dashboard.menusLabel": "Menyer",
    "admin.dashboard.menusHeading": "Meny",
    "admin.dashboard.menusDescription":
      "Redigera middags- och dryckesmenyer sektion för sektion. Spara utkastet och publicera när gäster ska se menyn på webbplatsen.",
    "admin.dashboard.menusLink": "Hantera menyer",
    "admin.dashboard.hoursLabel": "Öppettider",
    "admin.dashboard.hoursHeading": "Öppettider",
    "admin.dashboard.hoursDescription":
      "Veckoschema och öppet/stängt på startsidan. Spara och publicera när gäster ska se uppdateringarna.",
    "admin.dashboard.hoursLink": "Hantera öppettider",
    "admin.dashboard.backToSite": "← Tillbaka till sajten",
    "admin.dashboard.now": "Just nu",
    "admin.dashboard.liveEvents": "Synliga på sajten",
    "admin.dashboard.inactiveEvents": "Inaktiva eller passerade",
    "admin.dashboard.nextEvent": "Nästa",
    "admin.dashboard.noUpcoming": "Inget på gång",
    "admin.dashboard.fullyBookedCount": "Fullbokade: {count}",
    "openingHours.day.mon": "Mån",
    "openingHours.day.tue": "Tis",
    "openingHours.day.wed": "Ons",
    "openingHours.day.thu": "Tor",
    "openingHours.day.fri": "Fre",
    "openingHours.day.sat": "Lör",
    "openingHours.day.sun": "Sön",
    "openingHours.closed": "Stängt",
    "admin.openingHours.title": "Öppettider",
    "admin.openingHours.intro":
      "Redigera veckoschemat på startsidan. Varje dag har rullgardinsmenyer — öppet/stängt-indikatorn uppdateras automatiskt utifrån dagens tider (Europa/Madrid).",
    "admin.openingHours.statusTitle": "Status",
    "admin.openingHours.statusIntro":
      "Spara utkastet först, publicera sedan när webbplatsen ska visa nya tider.",
    "admin.openingHours.scheduleTitle": "Veckoschema",
    "admin.openingHours.scheduleIntro":
      "Välj Öppet eller Stängt för varje dag. Om öppet, välj öppnings- och stängningstid i halvtimmessteg. Stängning efter midnatt (t.ex. 01:00) stöds.",
    "admin.openingHours.dayStatus": "Dagsstatus",
    "admin.openingHours.statusOpen": "Öppet",
    "admin.openingHours.statusClosed": "Stängt",
    "admin.openingHours.openFrom": "Öppnar",
    "admin.openingHours.openUntil": "Stänger",
    "admin.openingHours.day.mon": "Måndag",
    "admin.openingHours.day.tue": "Tisdag",
    "admin.openingHours.day.wed": "Onsdag",
    "admin.openingHours.day.thu": "Torsdag",
    "admin.openingHours.day.fri": "Fredag",
    "admin.openingHours.day.sat": "Lördag",
    "admin.openingHours.day.sun": "Söndag",
    "admin.openingHours.loadError": "Kunde inte ladda öppettider.",
    "admin.openingHours.saved": "Sparat. Gäster ser bara publicerade öppettider.",
    "admin.openingHours.saveError": "Kunde inte spara. Kontrollera anslutningen och försök igen.",
    "admin.openingHours.publishedSuccess": "Publicerad — synlig på webbplatsen.",
    "admin.openingHours.publishError": "Kunde inte publicera. Försök igen.",
    "admin.openingHours.unpublishedSuccess": "Avpublicerad — dold för gäster (utkast behålls).",
    "admin.openingHours.unpublishError": "Kunde inte avpublicera. Försök igen.",
    "admin.loading": "Laddar…",
    "admin.checkingSignIn": "Kontrollerar inloggning…",
    "admin.signingIn": "Loggar in…",
    "admin.signedInTitle": "Inloggad",
    "admin.signedInOpening": "Öppnar arbetsytan…",
    "admin.chrome.staff": "Personalyta",
    "admin.events.title": "Evenemang",
    "admin.events.introLead":
      "Här hanterar ni kvällar och aktiviteter som gäster ser på startsidan och under Evenemang.",
    "admin.events.allEvents": "Alla evenemang",
    "admin.events.newEvent": "Nytt evenemang",
    "admin.events.emptyList": "Inga evenemang ännu. Tryck Nytt evenemang ovan för att lägga till det första.",
    "admin.events.draft": "Utkast",
    "admin.events.pastRemove": "Passerat — kan tas bort",
    "admin.events.duplicate": "Duplicera",
    "admin.events.makeCopy": "Gör en kopia",
    "admin.events.unsaved": "Osparade ändringar",
    "admin.events.saved": "Sparat",
    "admin.events.openEventsPage": "Öppna evenemangssidan",
    "admin.events.formNew": "Nytt evenemang",
    "admin.events.formEdit": "Redigera evenemang",
    "admin.events.idLabel": "Kort namn (ID)",
    "admin.events.idPlaceholder": "t.ex. vin-kvall-juni-2026",
    "admin.events.idHint":
      "Gäster ser inte det här kortnamnet. Det används bara i den här listan och när evenemanget sparas.",
    "admin.events.idLocked": "Det korta namnet kan inte ändras efter att evenemanget skapats.",
    "admin.events.sectionBasics": "Namn och datum",
    "admin.events.sectionTime": "Tid",
    "admin.events.sectionPhoto": "Foto",
    "admin.events.sectionCopy": "Text som gästerna ser",
    "admin.events.sectionReview": "Granska översättningar",
    "admin.events.sectionPublish": "Status på webbplatsen",
    "admin.events.previewHint": "Klicka på kortet för att redigera det gästerna ser. Byt språk uppe till höger.",
    "admin.events.guestDateLabel": "Visas för gäster som",
    "admin.events.calendarDate": "Datum i kalendern",
    "admin.events.specificTime": "Visa inte",
    "admin.events.fullyBooked": "Fullbokat",
    "admin.events.published": "Synligt på den riktiga webbplatsen",
    "admin.events.publishedHint": "Gäster på www.el-portero.com kan se evenemanget.",
    "admin.events.publishedLocal": "Bara på den här datorn",
    "admin.events.publishedLocalHint":
      "Syns här på localhost. Den riktiga webbplatsen visar det inte.",
    "admin.events.statusHidden": "Dolt",
    "admin.events.statusHiddenHint": "Gäster på www.el-portero.com kan inte se evenemanget.",
    "admin.events.statusHiddenLocalHint":
      "Visas inte på localhost och inte på den riktiga webbplatsen.",
    "admin.events.localOnly": "Bara lokalt",
    "admin.events.imageUrl": "Fotolänk",
    "admin.events.imageUrlHint":
      "Ladda upp ett foto från datorn (vi förminskar det). Ni kan fortfarande klistra in en länk om ni vill.",
    "admin.events.datePreviewHint":
      "Datum som gäster ser (fylls i automatiskt från kalenderdatumet ovan):",
    "admin.events.timeOnly": "Tid",
    "admin.events.timeOnlyHint":
      "Start- och sluttid visas på webbplatsen (24-timmarsklocka).",
    "admin.events.startTime": "Starttid",
    "admin.events.endTime": "Sluttid",
    "admin.events.preview": "Förhandsvisning",
    "admin.events.titleField": "Titel",
    "admin.events.excerpt": "Kort beskrivning",
    "admin.events.imageAlt": "Bildbeskrivning (tillgänglighet)",
    "admin.events.create": "Skapa",
    "admin.events.saveChanges": "Spara ändringar",
    "admin.events.delete": "Ta bort",
    "admin.events.saveNewTooltip": "Spara nytt evenemang",
    "admin.events.saveEditTooltip": "Spara dina ändringar",
    "admin.events.saveNewDisabledTooltip": "Redigera förhandsvisningen eller uppgifterna nedan för att skapa ett evenemang",
    "admin.events.saveEditDisabledTooltip": "Inga osparade ändringar — redigera förhandsvisningen eller uppgifterna nedan för att spara",
    "admin.events.duplicateLoaded":
      "Kopia inläst — kontrollera kort namn (ID) och datum, tryck sedan Skapa.",
    "admin.events.created": "Evenemanget skapades.",
    "admin.events.updated": "Evenemanget uppdaterades.",
    "admin.events.deleted": "Evenemanget togs bort.",
    "admin.events.deleteConfirm": "Ta bort «{id}»? Det går inte att ångra.",
    "admin.events.loadError": "Kunde inte ladda evenemang. Uppdatera sidan.",
    "admin.events.saveError": "Kunde inte spara. Kontrollera anslutningen och försök igen.",
    "admin.events.deleteError": "Kunde inte ta bort. Försök igen.",
    "admin.events.storageFullTitle": "Evenemangslistan är full",
    "admin.events.storageFullBody": "Ni kan spara {max} evenemang. Ta bort ett innan ni lägger till ett nytt.",
    "admin.events.storageCreateTitle": "Ni kan inte spara ett nytt evenemang ännu",
    "admin.events.storageCreateBody": "Listan är full. Ta bort ett evenemang till vänster och försök igen.",
    "admin.events.storageListWarning": "Listan är full. Ta bort ett evenemang för att lägga till ett nytt.",
    "admin.events.storageEmptySlot": "Tom",
    "admin.events.storageCount": "{count} av {max}",
    "admin.events.storageMeterAria": "{count} av {max} evenemang",
    "admin.events.storageFullSaveError": "Listan är full. Ta bort ett evenemang först.",
    "admin.events.invalidId":
      "Kort namn (ID): 1–64 tecken — endast små bokstäver, siffror och bindestreck (t.ex. sommar-middag-2026).",
    "admin.events.invalidTime": "Sluttiden måste vara samma som eller efter starttiden.",
    "admin.events.loadingTitle": "Evenemang",
    "admin.events.loadingIntro": "Laddar…",
    "admin.events.translateContent": "Översätt innehåll",
    "admin.events.translating": "Översätter…",
    "admin.events.translateWait1": "Översättningen pågår. Vänta ett par sekunder.",
    "admin.events.translateWait2": "Vi kontrollerar vilket språk ni skrev på och översätter sedan resten.",
    "admin.events.translateWait3":
      "Förhandsvisningen uppdateras när alla språk är klara. Ni kan låta det här vara öppet.",
    "admin.events.translateElapsed": "Förfluten tid {time}",
    "admin.events.translateLanguageCorrected":
      "Texten i fältet för {source} är på {detected}. Originalet sparas som {detected}, och {source} har nu översättningen. Övriga tomma språk fylldes också i. Byt språk i förhandsvisningen för att granska och spara sedan.",
    "admin.events.translateLanguageCorrectedSplit":
      "Titeln är på {titleLanguage} och beskrivningen på {excerptLanguage}. Varje original sparas på sitt språk, och fälten för {source} har nu översättningen. Byt språk i förhandsvisningen för att granska och spara sedan.",
    "admin.events.translateError":
      "Kunde inte översätta. Firebase AI Logic måste vara aktiverat i projektet. Försök sedan igen.",
    "admin.events.translateSuccess":
      "Tomma språk och bildbeskrivningar fylldes i från {language}. Byt språk i förhandsvisningen för att granska och spara sedan.",
    "admin.events.translateNeedText": "Lägg till en titel eller beskrivning innan ni översätter.",
    "admin.events.reviewTranslations": "Granska översättningar",
    "admin.events.uploadImage": "Ladda upp foto",
    "admin.events.replaceImage": "Byt foto",
    "admin.events.removeImage": "Ta bort foto",
    "admin.events.imageUploading": "Laddar upp foto…",
    "admin.events.imageUploadError":
      "Kunde inte ladda upp fotot. Försök igen, eller klistra in en länk.",
    "admin.events.imageHint": "Hellre en länk? Klistra in den här.",
    "admin.events.imageAltHint":
      "Gäller språket som är valt i förhandsvisningen. Fylls i när ni översätter. Redigera om ni vill mer precist.",
    "admin.events.sourceHint":
      "Skriv titel och beskrivning på kortet och tryck sedan på Översätt innehåll.",
    "admin.events.orPasteLink": "Eller klistra in en fotolänk",
    "admin.events.notTranslatedYet": "Inte översatt än",
    "admin.events.previewLanguage": "Förhandsvisningsspråk",
    "admin.events.changePhoto": "Byt foto",
    "admin.events.addTime": "Lägg till tid",
    "admin.events.descriptionText": "Text",
    "admin.events.descriptionBullets": "Punkter",
    "admin.events.descriptionBold": "Fet",
    "admin.events.descriptionItalic": "Kursiv",
    "admin.events.available": "Ledigt",
    "admin.events.editDate": "Evenemangsdatum",
    "admin.events.editTime": "Start- och sluttid",
    "admin.events.editAvailability": "Bokningsstatus",
    "admin.events.chooseLanguage": "Välj förhandsvisningsspråk",
    "admin.events.staffHint": "Gäster ser inte de här fälten. De används bara här.",
    "admin.events.step": "Steg {n}",
    "admin.events.step1Title": "Detaljer och förhandsvisning",
    "admin.events.step3Title": "Kort namn och status på webbplatsen",
    "admin.events.step4Title": "Dubbelkolla",
    "admin.events.step4Hint": "Gå igenom resten innan ni sparar.",
    "admin.menus.title": "Menyer",
    "admin.menus.intro":
      "Middag och dryck är separata menyer. Varje meny består av sektioner, och varje sektion samlar rätterna gästerna ser under den rubriken.",
    "admin.menus.reload": "Ladda om",
    "admin.menus.tabDinner": "Middag",
    "admin.menus.tabDrinks": "Dryck",
    "admin.menus.status": "Status",
    "admin.menus.statusIntro":
      "Opublicerade menyer visar demoinnehåll på webbplatsen tills ni publicerar.",
    "admin.menus.publishedLabel": "Publicerad:",
    "admin.menus.yes": "Ja",
    "admin.menus.no": "Nej",
    "admin.menus.publish": "Publicera",
    "admin.menus.unpublish": "Avpublicera",
    "admin.menus.menuTitleLabel": "Menytitel",
    "admin.menus.menuTitlePlaceholder": "t.ex. Vårmiddagsmeny",
    "admin.menus.sectionTitleLabel": "Sektionsrubrik",
    "admin.menus.removeSection": "Ta bort sektion",
    "admin.menus.hideSection": "Dölj sektion",
    "admin.menus.showSection": "Visa sektion",
    "admin.menus.hideBtn": "Dölj",
    "admin.menus.showBtn": "Visa",
    "admin.menus.saveBeforeHide": "Spara ändringar innan ni döljer eller visar för gäster",
    "admin.menus.hideDish": "Dölj rätt",
    "admin.menus.showDish": "Visa rätt",
    "admin.menus.hideDrink": "Dölj dryck",
    "admin.menus.showDrink": "Visa dryck",
    "admin.menus.hiddenFromGuests": "Dold för gäster",
    "admin.menus.hiddenItemsCount": "{count} dolda för gäster",
    "admin.menus.removeDish": "Ta bort rätt",
    "admin.menus.removeDrink": "Ta bort dryck",
    "admin.menus.addDish": "Lägg till rätt",
    "admin.menus.addSection": "Lägg till sektion",
    "admin.menus.addDrink": "Lägg till dryck",
    "admin.menus.dragSection": "Dra för att ändra ordning på sektion",
    "admin.menus.dragItem": "Dra för att ändra ordning på post",
    "admin.menus.expandSection": "Visa sektion",
    "admin.menus.collapseSection": "Dölj sektion",
    "admin.menus.expandItem": "Visa post",
    "admin.menus.collapseItem": "Dölj post",
    "admin.menus.nameLabel": "Namn",
    "admin.menus.nameExtensionLabel": "Namnförtydligande",
    "admin.menus.optional": "(valfritt)",
    "admin.menus.nameExtensionPlaceholder":
      "Visas under namnet, samma stil, mindre — t.ex. region eller årgång",
    "admin.menus.descriptionLabel": "Beskrivning",
    "admin.menus.priceLabel": "Pris",
    "admin.menus.priceExamplePlaceholder": "t.ex. 24 eller 24,50",
    "admin.menus.priceHiddenPlaceholder": "Dolt — storleksvarianter nedan ersätter detta",
    "admin.menus.priceHiddenNote":
      "Det enskilda priset ovan döljs på den publika menyn när storleksvarianter är satta.",
    "admin.menus.sizeVariantsTitle": "Storleksvarianter (valfritt)",
    "admin.menus.sizeVariantsHint":
      "För drycker i flera storlekar (t.ex. Liten / Stor, 33cl / 50cl, Glas / Flaska). När de är satta ersätter de det enskilda priset på webbplatsen.",
    "admin.menus.sizeLabelPlaceholder": "Etikett (t.ex. Liten)",
    "admin.menus.priceFieldPlaceholder": "Pris",
    "admin.menus.removeVariant": "Ta bort",
    "admin.menus.removeVariantAria": "Ta bort storleksvariant {n}",
    "admin.menus.addSize": "Lägg till storlek",
    "admin.menus.dietaryTagsTitle": "Dietmärkningar",
    "admin.menus.dietaryHintDrinks":
      "Valfritt — t.ex. alkoholfria mocktails, glutenfri öl, veganska eller mejerifria ingredienser.",
    "admin.menus.dietaryHintFood": "Valfritt — välj de som passar.",
    "admin.menus.allergensTitle": "Allergener (EU 1–14)",
    "admin.menus.allergensHint":
      "Tryck på numrerade cirklar för allergener som finns. Siffrorna matchar förklaringen på den publika menyn.",
    "admin.menus.loadError": "Kunde inte ladda menyn.",
    "admin.menus.saved": "Sparat. Gäster ser bara publicerade menyer.",
    "admin.menus.saveError": "Kunde inte spara. Kontrollera anslutningen och försök igen.",
    "admin.menus.publishedSuccess": "Publicerad — synlig på webbplatsen.",
    "admin.menus.publishError": "Kunde inte publicera. Försök igen.",
    "admin.menus.unpublishedSuccess": "Avpublicerad — dold för gäster (utkast behålls).",
    "admin.menus.unpublishError": "Kunde inte avpublicera. Försök igen.",
    "admin.menus.removeSectionConfirm":
      "Ta bort sektionen «{section}»?\n\nDetta tar bort sektionsrubriken och alla rätter under den ({countPhrase}) — inte bara rubriken. Gäster ser ändringen på webbplatsen först när ni trycker Spara ändringar.",
    "admin.menus.removeDishConfirm":
      "Ta bort rätten «{dish}» från den här sektionen?\n\nDen försvinner från utkastet. Tryck Spara ändringar när ni är klara.",
    "admin.menus.removeDrinkConfirm":
      "Ta bort drycken «{dish}» från den här sektionen?\n\nDen försvinner från utkastet. Tryck Spara ändringar när ni är klara.",
    "admin.menus.untitledSection": "Sektion utan titel",
    "admin.menus.untitledDish": "Rätt utan namn",
    "admin.menus.untitledDrink": "Dryck utan namn",
    "admin.menus.outline": "Menyer",
    "admin.menus.sectionsLabel": "Sektioner",
    "admin.menus.connectionHint":
      "En sektion är en rubrik på menyn. Rätterna under den är det gästerna läser i den gruppen.",
    "admin.menus.editingSection": "Rätter i den här sektionen",
    "admin.menus.noSection": "Den här menyn har inga sektioner ännu. Lägg till en för att starta en grupp rätter.",
    "admin.menus.visibleOnSite": "På webbplatsen",
    "admin.menus.hiddenOnSite": "Endast utkast",
    "admin.menus.shownToGuests": "Visas för gäster",
    "admin.menus.unsavedChanges": "Osparade ändringar",
    "admin.menus.allSaved": "Alla ändringar sparade",
    "admin.menus.breadcrumb": "Var ni är i menyn",
    "admin.menus.menuTitleHint":
      "Det här är knappen högst upp på menyn på webbplatsen. Utan titel visas inte knappen.",
    "admin.menus.chooseSection": "Välj en sektion till vänster för att redigera dess rätter.",
    "admin.confirm.title": "Varning",
    "admin.confirm.cancel": "Avbryt",
    "admin.confirm.proceed": "Ja, fortsätt",
    "admin.confirm.delete": "Ta bort",
    "admin.confirm.remove": "Ta bort",
    "footer.whatsapp": "WhatsApp",
    "footer.whatsappAria": "Öppna WhatsApp-chatt med el PORTERO",
    "footer.tagline":
      "el PORTERO i Torrevieja — smaker från Peru, Spanien och Sverige i en varm och levande dinner club-stämning på Costa Blanca, nära Medelhavet.",
    "footer.links": "Snabblänkar",
    "footer.follow": "Följ oss",
    "footer.sitemap": "Webbplatskarta",
    "footer.openInMaps": "Öppna i Google Maps",
    "header.menuLabel": "MENY",
    "header.closeNav": "Stäng meny",
    "header.openNav": "Öppna menyn",
    "header.navDialog": "Navigering",
    "header.reserveTable": "Boka bord",
    "header.reserveNav": "Boka bord",
    "brand.dinnerClub": "Dinner Club",
  },
  de: deMessages,
  fr: frMessages,
};

export function t(locale: Locale, key: MessageKey): string {
  return messages[locale][key];
}
