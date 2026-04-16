import {
  Cormorant_Garamond,
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

export const metadata: Metadata = {
  title: {
    default: "El Portero | Torrevieja",
    template: "%s | El Portero",
  },
  description:
    "El Portero — fine dining in Torrevieja, Alicante. Mediterranean soul and warm hospitality.",
  icons: {
    icon: [{ url: "/favicon/el-portero-favicon.svg", type: "image/svg+xml" }],
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
      className={`${fontDisplay.variable} ${fontSans.variable} ${fontLogo.variable} ${fontHeroTitle.variable}`}
    >
      <body>
        <AppProviders>
          <div className="flex min-h-dvh flex-col">
            <SiteHeader />
            <main id="main" className="flex-1 pt-[var(--header-h)]">
              {children}
            </main>
            <SiteFooter />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
