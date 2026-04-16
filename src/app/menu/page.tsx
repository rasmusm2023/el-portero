import { redirect } from "next/navigation";

/** Default “Menu” URL sends guests to lunch (weekly menu). */
export default function MenuIndexPage() {
  redirect("/menu/weekly");
}
