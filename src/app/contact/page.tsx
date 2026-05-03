import type { Metadata } from "next";
import { ContactPage } from "@/views/ContactPage";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach El Portero in Torrevieja — reservations, private events, dietary notes, and every other enquiry.",
};

export default function Page() {
  return <ContactPage />;
}
