import type { HomeEvent } from "@/lib/publicEventTypes";

/**
 * Reference sample events (not used by the live site). The home page and /events load **published**
 * documents from Firestore only (`usePublicEvents`). Keep this file for fixtures or local experiments.
 */
export const PUBLIC_EVENTS_STATIC: HomeEvent[] = [
  {
    id: "mock-coastal-tasting-2026",
    sortDate: "2026-05-24",
    published: true,
    timeSlotStart: "19:30",
    timeSlotEnd: "23:00",
    eventPlace: "Torrevieja",
    fullyBooked: true,
    weekdayDate: {
      en: "Saturday 24 May",
      es: "Sábado 24 de mayo",
      sv: "Lördag 24 maj",
    },
    timeDetail: {
      en: "19:30-23:00 · Torrevieja",
      es: "19:30-23:00 · Torrevieja",
      sv: "19:30-23:00 · Torrevieja",
    },
    title: {
      en: "Coastal tasting — five courses & paired wines",
      es: "Degustación costera — cinco tiempos y maridajes",
      sv: "Kustprovning — fem serveringar och vinparningar",
    },
    excerpt: {
      en: "A one-night menu where Nordic technique meets Mediterranean produce. Limited seats; dietary notes on request.",
      es: "Una carta de una noche donde la técnica nórdica encuentra el producto mediterráneo. Plazas limitadas.",
      sv: "En kvällsmeny där nordisk teknik möter medelhavets råvaror. Begränsat antal platser.",
    },
    imageSrc:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80",
    imageAlt: {
      en: "Candlelit restaurant table with wine glasses",
      es: "Mesa de restaurante con velas y copas de vino",
      sv: "Restaurangbord med ljus och vinglas",
    },
  },
  {
    id: "wc-2026-opening-night",
    sortDate: "2026-06-11",
    published: true,
    timeSlotStart: "17:30",
    timeSlotEnd: "23:30",
    eventPlace: "Torrevieja",
    fullyBooked: false,
    weekdayDate: {
      en: "Thursday 11 June",
      es: "Jueves 11 de junio",
      sv: "Torsdag 11 juni",
    },
    timeDetail: {
      en: "17:30-23:30 · Torrevieja",
      es: "17:30-23:30 · Torrevieja",
      sv: "17:30-23:30 · Torrevieja",
    },
    title: {
      en: "World Cup kicks off — opening night at the bar",
      es: "Arranca el Mundial — noche inaugural en la barra",
      sv: "VM drar igång — invigningskväll i baren",
    },
    excerpt: {
      en: "First whistle, big screen, tapas and cold beer. Come early for a seat — we’ll run the sound up for the anthem.",
      es: "Primer pitido, pantalla grande, tapas y cerveza fría. Llega con tiempo — subiremos el volumen para el himno.",
      sv: "Första pip, stor skärm, tapas och kall öl. Kom i tid — vi höjer volymen för nationalsångerna.",
    },
    imageSrc:
      "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?auto=format&fit=crop&w=1600&q=80",
    imageAlt: {
      en: "Stadium stands and pitch under evening light",
      es: "Gradas y campo al atardecer",
      sv: "Läktare och plan i kvällsljus",
    },
  },
];

export function getSortedPublicEvents(): HomeEvent[] {
  return [...PUBLIC_EVENTS_STATIC].sort((a, b) => a.sortDate.localeCompare(b.sortDate));
}
