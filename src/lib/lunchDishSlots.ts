/** Fixed slot labels for the 5 lunch positions (guest + admin UI). */
export const LUNCH_DISH_SLOT_LABELS = [
  "Lunch Pasta",
  "Lunch Salad",
  "Lunch 3",
  "Lunch 4",
  "Lunch 5",
] as const;

export function lunchDishSlotLabel(position: number): string {
  const i = position - 1;
  if (i >= 0 && i < LUNCH_DISH_SLOT_LABELS.length) return LUNCH_DISH_SLOT_LABELS[i];
  return `Lunch ${position}`;
}
