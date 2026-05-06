import {
  Anton,
  Cormorant_Garamond,
  Jaro,
  Plus_Jakarta_Sans,
} from "next/font/google";
import localFont from "next/font/local";
import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";
import { headers } from "next/headers";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { effectiveComingSoonForHost } from "@/config/siteMode";

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

/** Ultra-heavy display for hero countdown numerals (single weight; reads as “black”). */
const fontCountdown = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-countdown-heavy",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "El Portero Restaurant & Bar · Welcome",
    template: "El Portero Restaurant & Bar · %s",
  },
  description:
    "El Portero — restaurant and dinner club in Torrevieja. Seasonal cooking where Latin warmth meets Nordic precision, a short stroll from the Mediterranean.",
  icons: {
    icon: [{ url: "/favicon/el-portero-favicon.svg", type: "image/svg+xml" }],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hdrs = await headers();
  const comingSoon = effectiveComingSoonForHost(
    hdrs.get("x-forwarded-host"),
    hdrs.get("host"),
  );

  return (
    <html
      lang="en"
      className={`${fontDisplay.variable} ${fontSans.variable} ${fontLogo.variable} ${fontHeroTitle.variable} ${fontCountdown.variable}`}
    >
      <body>
        <AppProviders>
          <div className="flex min-h-dvh min-w-0 flex-col overflow-x-clip">
            {!comingSoon ? <SiteHeader /> : null}
            <main
              id="main"
              className={
                comingSoon
                  ? "flex min-h-dvh min-w-0 flex-1 flex-col overflow-x-clip"
                  : "flex min-h-0 min-w-0 flex-1 flex-col overflow-x-clip pt-[var(--header-h)]"
              }
            >
              {children}
            </main>
            {!comingSoon ? <SiteFooter /> : null}
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
