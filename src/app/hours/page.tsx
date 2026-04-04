"use client";

import { useEffect } from "react";

/** Old URL: send visitors to the hours & map block on the home page. */
export default function HoursRedirectPage() {
  useEffect(() => {
    window.location.replace("/#hours");
  }, []);
  return null;
}
