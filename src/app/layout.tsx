import {
  Cormorant_Garamond,
  Courier_Prime,
  Dancing_Script,
  Figtree,
  Jaro,
  Plus_Jakarta_Sans,
} from "next/font/google";
import localFont from "next/font/local";
import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

const fontDisplay = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const fontSignature = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-signature",
  display: "swap",
});

const fontHeroTitle = localFont({
  src: "../assets/fonts/Sweetest Goods - Celesse Regular.otf",
  variable: "--font-bricolage-grotesque",
  display: "swap",
});

/** Wordmark only — Jaro (Google Fonts), distinct from `font-display` / `font-sans`. */
const fontLogo = Jaro({
  subsets: ["latin"],
  weight: "variable",
  axes: ["opsz"],
  variable: "--font-jaro",
  display: "swap",
});

/** Menu typography: typewriter face for section titles, dish names, descriptions. */
const fontMenuType = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal"],
  variable: "--font-courier",
  display: "swap",
});

/** Menu typography: clean geometric sans for prices (semibold). */
const fontMenuPrice = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "El Portero Restaurant & Bar · Welcome",
    template: "El Portero Restaurant & Bar · %s",
  },
  description:
    "El Portero — dinner club in Torrevieja where Peruvian, Spanish and Swedish flavours meet in a warm, lively atmosphere, minutes from the Mediterranean.",
  icons: {
    icon: [{ url: "/assets/favicon/el-portero-favicon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontDisplay.variable} ${fontSans.variable} ${fontLogo.variable} ${fontHeroTitle.variable} ${fontSignature.variable} ${fontMenuType.variable} ${fontMenuPrice.variable}`}
    >
      <body>
        <AppProviders>
          <div className="flex min-h-dvh min-w-0 flex-col overflow-x-clip">
            <SiteHeader />
            <main
              id="main"
              className="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-clip pt-[var(--header-h)]"
            >
              {children}
            </main>
            <SiteFooter />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
