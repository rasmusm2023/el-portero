import type { Metadata } from "next";
import { ContactPage } from "@/views/ContactPage";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact el PORTERO in Torrevieja by email or phone. Ask about reservations, private events, dietary notes, or anything else — we reply as soon as we can.",
};

export default function Page() {
  return <ContactPage />;
}
