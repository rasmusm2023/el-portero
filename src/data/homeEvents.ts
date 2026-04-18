import type { Locale } from "@/i18n/strings";

export type HomeEvent = {
  id: string;
  /** ISO date for ordering (chronological). */
  sortDate: string;
  /** When true, show a "Fully booked" indicator (and avoid implying seats are available). */
  fullyBooked?: boolean;
  /** Weekday + calendar date — shown on the home timeline. */
  weekdayDate: Record<Locale, string>;
  /** Time and optional context (venue, format) — shown inside the home event card. */
  timeDetail: Record<Locale, string>;
  title: Record<Locale, string>;
  excerpt: Record<Locale, string>;
  /** Remote or `/…` under `public`. */
  imageSrc: string;
  imageAlt: Record<Locale, string>;
};

/**
 * Upcoming highlights for the home page. Replace or extend when events are backed by CMS/API.
 */
export const homeEvents: HomeEvent[] = [
  {
    id: "mock-coastal-tasting-2026",
    sortDate: "2026-05-24",
    fullyBooked: true,
    weekdayDate: {
      en: "Saturday 24 May",
      es: "Sábado 24 de mayo",
      sv: "Lördag 24 maj",
    },
    timeDetail: {
      en: "19:30 · Torrevieja",
      es: "19:30 · Torrevieja",
      sv: "19:30 · Torrevieja",
    },
    title: {
      en: "Coastal tasting — five courses & paired wines",
      es: "Degustación costera — cinco tiempos y maridajes",
      sv: "Kustprovning — fem serveringar och vinparningar",
    },
    excerpt: {
      en:
        "A one-night menu where Nordic technique meets Mediterranean produce. Limited seats; dietary notes on request.",
      es:
        "Una carta de una noche donde la técnica nórdica encuentra el producto mediterráneo. Plazas limitadas.",
      sv:
        "En kvällsmeny där nordisk teknik möter medelhavets råvaror. Begränsat antal platser.",
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
    weekdayDate: {
      en: "Thursday 11 June",
      es: "Jueves 11 de junio",
      sv: "Torsdag 11 juni",
    },
    timeDetail: {
      en: "From 17:30 · Opening match on screen",
      es: "Desde las 17:30 · Partido inaugural en pantalla",
      sv: "Från 17.30 · Öppningsmatch på skärm",
    },
    title: {
      en: "World Cup kicks off — opening night at the bar",
      es: "Arranca el Mundial — noche inaugural en la barra",
      sv: "VM drar igång — invigningskväll i baren",
    },
    excerpt: {
      en:
        "First whistle, big screen, tapas and cold beer. Come early for a seat — we’ll run the sound up for the anthem.",
      es:
        "Primer pitido, pantalla grande, tapas y cerveza fría. Llega con tiempo — subiremos el volumen para el himno.",
      sv:
        "Första pip, stor skärm, tapas och kall öl. Kom i tid — vi höjer volymen för nationalsångerna.",
    },
    imageSrc:
      "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?auto=format&fit=crop&w=1600&q=80",
    imageAlt: {
      en: "Stadium stands and pitch under evening light",
      es: "Gradas y campo al atardecer",
      sv: "Läktare och plan i kvällsljus",
    },
  },
  {
    id: "wc-2026-group-stage-sunday",
    sortDate: "2026-06-21",
    weekdayDate: {
      en: "Sunday 21 June",
      es: "Domingo 21 de junio",
      sv: "Söndag 21 juni",
    },
    timeDetail: {
      en: "12:00–late · Multi-match Sunday",
      es: "12:00–tarde · Domingo de varios partidos",
      sv: "12.00–sent · Flera matcher samma dag",
    },
    title: {
      en: "Group stage — three matches, one terrace",
      es: "Fase de grupos — tres partidos, una terraza",
      sv: "Gruppspel — tre matcher, samma terrass",
    },
    excerpt: {
      en:
        "We’ll line up kick-off times on the chalkboard and keep the kitchen open for grazing plates between games.",
      es:
        "Horarios en la pizarra y cocina abierta para picar entre partido y partido.",
      sv:
        "Avsparkstider på tavlan och köket håller öppet mellan matcherna.",
    },
    imageSrc:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1600&q=80",
    imageAlt: {
      en: "Football on grass, close-up",
      es: "Balón de fútbol sobre el césped",
      sv: "Fotboll på gräs",
    },
  },
  {
    id: "wc-2026-goalkeeper-stories",
    sortDate: "2026-06-28",
    weekdayDate: {
      en: "Sunday 28 June",
      es: "Domingo 28 de junio",
      sv: "Söndag 28 juni",
    },
    timeDetail: {
      en: "18:00 · Stories + late match",
      es: "18:00 · Charla + partido nocturno",
      sv: "18.00 · Samtal + sen match",
    },
    title: {
      en: "Between the posts — an evening with a former pro keeper",
      es: "Bajo palos — velada con un ex portero profesional",
      sv: "Mellan stolparna — kväll med före detta proffsmålvakt",
    },
    excerpt: {
      en:
        "Our host swaps gloves for the grill for one night: honest stories from the penalty box, a Q&A, then we watch the late kick-off together.",
      es:
        "Nuestro anfitrión cuelga los guantes unas horas: anécdotas desde el área pequeña, preguntas del público y luego el partido en pantalla.",
      sv:
        "Vår värd lägger handskarna på hyllan för en kväll: berättelser från straffområdet, frågestund och sen gemensam match på TV.",
    },
    imageSrc:
      "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1600&q=80",
    imageAlt: {
      en: "Goalkeeper gloves resting on grass",
      es: "Guantes de portero sobre el césped",
      sv: "Målvaktshandskar på gräset",
    },
  },
  {
    id: "wc-2026-round-of-16",
    sortDate: "2026-07-05",
    weekdayDate: {
      en: "Sunday 5 July",
      es: "Domingo 5 de julio",
      sv: "Söndag 5 juli",
    },
    timeDetail: {
      en: "Kick-offs from 16:00 · Knockout day",
      es: "Partidos desde las 16:00 · Día de eliminatorias",
      sv: "Avspark från 16.00 · Slutspelsdag",
    },
    title: {
      en: "Round of 16 — win or go home",
      es: "Octavos — a todo o nada",
      sv: "Åttondelsfinal — vinn eller försvinn",
    },
    excerpt: {
      en:
        "Extra time and pens are on the menu. We’ll save seats for groups who book together — singles welcome at the bar.",
      es:
        "Prórroga y penaltis incluidos. Reservamos mesas para grupos — los solitarios, a la barra.",
      sv:
        "Övertid och straffar ingår. Vi sparar platser för sällskap — enskilda välkomna i baren.",
    },
    imageSrc:
      "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?auto=format&fit=crop&w=1600&q=80",
    imageAlt: {
      en: "Green pitch and stadium atmosphere",
      es: "Césped y ambiente de estadio",
      sv: "Gräsplan och stämning från läktaren",
    },
  },
  {
    id: "wc-2026-quarter-finals",
    sortDate: "2026-07-10",
    weekdayDate: {
      en: "Friday 10 July",
      es: "Viernes 10 de julio",
      sv: "Fredag 10 juli",
    },
    timeDetail: {
      en: "18:00 & 21:00 · Two quarter-finals",
      es: "18:00 y 21:00 · Dos cuartos",
      sv: "18.00 och 21.00 · Två kvartsfinaler",
    },
    title: {
      en: "Quarter-finals — double-header night",
      es: "Cuartos de final — noche doble",
      sv: "Kvartsfinaler — dubbelkväll",
    },
    excerpt: {
      en:
        "Eight teams left — we run two screens if kick-offs overlap, same sound for the room you care about.",
      es:
        "Quedan ocho: si coinciden los horarios, segunda pantalla y el sonido donde toque.",
      sv:
        "Åtta lag kvar: vid krockande tider kör vi två skärmar och ljud där du vill sitta.",
    },
    imageSrc:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1600&q=80",
    imageAlt: {
      en: "Football on grass before a match",
      es: "Balón sobre el césped antes del partido",
      sv: "Boll på gräset före match",
    },
  },
  {
    id: "wc-2026-semi-finals",
    sortDate: "2026-07-14",
    weekdayDate: {
      en: "Tuesday 14 July",
      es: "Martes 14 de julio",
      sv: "Tisdag 14 juli",
    },
    timeDetail: {
      en: "From 19:00 · Semi-final",
      es: "Desde las 19:00 · Semifinal",
      sv: "Från 19.00 · Semifinal",
    },
    title: {
      en: "Semi-final — last step before the final",
      es: "Semifinal — a un paso de la final",
      sv: "Semifinal — sista steget före finalen",
    },
    excerpt: {
      en:
        "Nerves, set pieces, maybe penalties — house pour on draft while it’s tense. Reservations strongly recommended.",
      es:
        "Nervios, balón parado, quizá penaltis — caña de barril mientras aprieta. Reserva casi obligatoria.",
      sv:
        "Nerver, fasta situationer, kanske straffar — fatöl medan det drar ihop sig. Boka gärna i förväg.",
    },
    imageSrc:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1600&q=80",
    imageAlt: {
      en: "Floodlit stadium before kick-off",
      es: "Estadio iluminado antes del pitido",
      sv: "Strålkastararena före avspark",
    },
  },
  {
    id: "mock-world-cup-final-2026",
    sortDate: "2026-07-19",
    fullyBooked: true,
    weekdayDate: {
      en: "Sunday 19 July",
      es: "Domingo 19 de julio",
      sv: "Söndag 19 juli",
    },
    timeDetail: {
      en: "From 18:00 · Big screen",
      es: "Desde las 18:00 · Pantalla grande",
      sv: "Från kl. 18 · Stor skärm",
    },
    title: {
      en: "World Cup final — live at El Portero",
      es: "Final del Mundial — en directo en El Portero",
      sv: "VM-final — live på El Portero",
    },
    excerpt: {
      en:
        "Watch the decider on our screen with a laid-back bar menu, cold beer and wine, and shared plates. Reserve a table — when it’s full, it’s full.",
      es:
        "El partido en pantalla con carta informal, cerveza y vino, y platos para compartir. Reserva mesa — plazas limitadas.",
      sv:
        "Se finalen på vår skärm med avslappnad bar meny, öl och vin och rätter att dela. Boka bord — begränsat antal platser.",
    },
    imageSrc:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1600&q=80",
    imageAlt: {
      en: "Football stadium under floodlights",
      es: "Estadio de fútbol con focos",
      sv: "Fotbollsarena i strålkastarsken",
    },
  },
];
