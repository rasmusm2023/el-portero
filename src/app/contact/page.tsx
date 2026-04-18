import type { Metadata } from "next";
import { ContactPage } from "@/views/ContactPage";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact El Portero in Torrevieja — reservations, events, dietary questions, and general inquiries.",
};

export default function Page() {
  return <ContactPage />;
}
