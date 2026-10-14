import { redirect } from "next/navigation";
import { LAUNCH_UI_OPENING_HOURS } from "@/config/launchUi";

/** Legacy `/hours` URL — forwards to home `#hours` when opening hours are live (`config/launchUi.ts`). */
export default function HoursRedirectPage() {
  redirect(LAUNCH_UI_OPENING_HOURS ? "/#hours" : "/");
}
