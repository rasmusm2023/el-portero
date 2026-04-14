import { getApiBaseUrl } from "@/lib/apiBase";
import type { WeeklyMenu } from "@/lib/weeklyMenuTypes";

export async function fetchWeeklyMenuCurrent(): Promise<WeeklyMenu | null> {
  const apiBase = getApiBaseUrl();
  const r = await fetch(`${apiBase}/api/weekly-menu/current`, {
    cache: "no-store",
  });
  if (r.status === 404) return null;
  if (!r.ok) {
    throw new Error(`Weekly menu request failed (${r.status}).`);
  }
  return (await r.json()) as WeeklyMenu;
}
