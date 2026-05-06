"use client";

import { useEffect } from "react";
import { LAUNCH_UI_OPENING_HOURS } from "@/config/launchUi";

/** Legacy `/hours` URL — forwards to home `#hours` when opening hours are live (`config/launchUi.ts`). */
export default function HoursRedirectPage() {
  useEffect(() => {
    window.location.replace(LAUNCH_UI_OPENING_HOURS ? "/#hours" : "/");
  }, []);
  return null;
}
