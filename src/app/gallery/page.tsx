"use client";

import { useEffect } from "react";

/** Old URL: send visitors to the gallery block on the home page. */
export default function GalleryRedirectPage() {
  useEffect(() => {
    window.location.replace("/#gallery");
  }, []);
  return null;
}
