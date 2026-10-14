import { redirect } from "next/navigation";

/** Old URL: send visitors to the gallery block on the home page. */
export default function GalleryRedirectPage() {
  redirect("/#gallery");
}
