import type { WeeklyMenu } from "@/lib/weeklyMenuTypes";

/**
 * Set lunch for the site (home preview, /menu/weekly, optional home section).
 * Update `effectiveWeekStartDate` / `weekStartDate` to the Monday (Europe/Madrid)
 * for the week you are publishing, then replace `items` when the team sends the menu.
 */
export const STATIC_WEEKLY_MENU: WeeklyMenu = {
  weekStartDate: "2026-04-27",
  effectiveWeekStartDate: "2026-04-27",
  title: "",
  isPublished: true,
  updatedAtUtc: "2026-05-01T12:00:00.000Z",
  items: [
    {
      position: 1,
      name: "Pan de masa madre · aceite de oliva",
      description: "Bread service with olive oil from the groves behind Alicante.",
      price: "—",
      dietaryTags: "V",
    },
    {
      position: 2,
      name: "Ensalada de tomate · burrata · albahaca",
      description: "Tomatoes, burrata, basil, aged balsamic.",
      price: "—",
      dietaryTags: "V · GF",
    },
    {
      position: 3,
      name: "Arroz meloso de pescado de lonja",
      description: "Creamy rice with today’s market fish and saffron stock.",
      price: "—",
      dietaryTags: "",
    },
    {
      position: 4,
      name: "Secreto ibérico · puré de patata · glaseado",
      description: "Iberian pork, potato purée, reduced jus.",
      price: "—",
      dietaryTags: "",
    },
    {
      position: 5,
      name: "Tarta de queso · frutos rojos",
      description: "Baked cheesecake, berry compote.",
      price: "—",
      dietaryTags: "V",
    },
  ],
};
