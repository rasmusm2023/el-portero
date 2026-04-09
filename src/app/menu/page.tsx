import { redirect } from "next/navigation";

/** Default “Menu” URL sends guests to the food menu. */
export default function MenuIndexPage() {
  redirect("/menu/food");
}
