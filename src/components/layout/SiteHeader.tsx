"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Instagram } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { INSTAGRAM_PROFILE_URL } from "@/config/site";
import { LAUNCH_UI_INSTAGRAM } from "@/config/launchUi";
import { t, type NavKey } from "@/i18n/strings";
import { useLocale } from "@/i18n/useLocale";
import { LogoWordmark } from "@/components/LogoWordmark";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MenuToggleIcon } from "./MenuToggleIcon";

/** Legacy split (used only to build {@link primaryNavItems} order). */
const navLeftItems: { href: string; labelKey: NavKey }[] = [
  { href: "/", labelKey: "nav.home" },
  { href: "/menu", labelKey: "nav.menu" },
  { href: "/events", labelKey: "nav.events" },
];

const navRightItems: { href: string; labelKey: NavKey }[] = [
  { href: "/story", labelKey: "nav.story" },
  { href: "/contact", labelKey: "nav.contact" },
];

/** Text links only — “Book a table” is a separate button (desktop + mobile). */
const primaryNavItems: { href: string; labelKey: NavKey }[] = [
  ...navLeftItems,
  ...navRightItems,
];

const easeOut = [0.22, 1, 0.36, 1] as const;
const easeIn = [0.4, 0, 1, 1] as const;

/** Nav link hover: soft ease + long enough duration for text + gradient bar (see navTopAccentBar). */
const navLinkTransition =
  "transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]";

function isActivePath(pathname: string, href: string, locationHash: string) {
  const hashIdx = href.indexOf("#");
  if (hashIdx !== -1) {
    const path = href.slice(0, hashIdx) || "/";
    const expectedHash = href.slice(hashIdx);
    if (pathname !== path) return false;
    return locationHash === expectedHash;
  }
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Top nav accent: same `gold` as borders, but soft fade at left/right (not a solid stripe). */
const navTopAccentBar =
  "relative before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-0.5 before:content-[''] " +
  "before:bg-[linear-gradient(90deg,transparent_0%,rgba(201,164,74,0)_6%,rgba(201,164,74,0.45)_18%,var(--color-gold)_32%,var(--color-gold)_68%,rgba(201,164,74,0.45)_82%,rgba(201,164,74,0)_94%,transparent_100%)] " +
  "before:opacity-0 before:transition-opacity before:duration-700 before:ease-[cubic-bezier(0.22,1,0.36,1)] hover:before:opacity-100";

/** Horizontal rule: solid in the center, fades to transparent at both ends. */
function HeaderFadedRule() {
  return (
    <div
      className="pointer-events-none h-px w-full shrink-0 bg-linear-to-r from-transparent via-paper/12 to-transparent"
      aria-hidden
    />
  );
}

/** Desktop nav: top accent = gradient bar (see {@link navTopAccentBar}). */
function desktopNavLinkClass(
  pathname: string,
  href: string,
  locationHash: string,
) {
  const active = isActivePath(pathname, href, locationHash);
  return [
    `inline-flex min-h-14 items-center px-6 font-sans text-base tracking-[0.02em] sm:px-7 ${navLinkTransition}`,
    navTopAccentBar,
    active
      ? "font-bold text-paper before:opacity-100"
      : "font-normal text-paper/62 hover:text-paper",
  ].join(" ");
}

function overlayNavLinkClass(
  pathname: string,
  href: string,
  locationHash: string,
) {
  const active = isActivePath(pathname, href, locationHash);
  return [
    `mx-auto block w-fit px-8 py-4 text-center font-sans text-5xl tracking-tight sm:px-10 sm:py-5 sm:text-6xl md:text-7xl ${navLinkTransition}`,
    navTopAccentBar,
    active
      ? "font-bold text-paper before:opacity-100"
      : "font-medium text-paper/40 hover:text-paper",
  ].join(" ");
}

const headerInnerMax =
  "mx-auto w-full max-w-[min(100%,112rem)] px-4 sm:px-6 lg:px-8";

/** Square “double frame”: 2px ink, 2px gap, 2px outer ink (no rounding). Hover gap matches dark header bg. */
export const bookTableNavButtonClass =
  [
    "inline-flex max-w-[min(11.5rem,calc(100%-2rem))] shrink-0 items-center justify-center truncate rounded-none",
    "bg-paper px-3 py-2 font-sans text-[11px] font-semibold tracking-[0.06em] text-ink",
    "shadow-[0_0_0_2px_var(--color-ink),0_0_0_4px_var(--color-paper),0_0_0_6px_var(--color-ink)]",
    "transition-[color,background-color,box-shadow] duration-300 ease-out",
    "hover:bg-paper-dark/35 hover:text-gold hover:shadow-[0_0_0_2px_var(--color-gold),0_0_0_4px_var(--color-ink),0_0_0_6px_var(--color-gold-bright)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/45 focus-visible:ring-offset-[8px] focus-visible:ring-offset-paper",
    "sm:max-w-none sm:px-5 sm:py-2.5 sm:text-sm sm:tracking-[0.08em]",
  ].join(" ");

/** Hero “Our menus” etc.: same double-frame rhythm as {@link bookTableNavButtonClass}, transparent fill. */
export const bookTableHeroHollowButtonClass =
  [
    "inline-flex items-center justify-center rounded-none",
    "bg-transparent px-8 py-3.5 font-sans text-xs font-semibold tracking-[0.08em] text-paper",
    "shadow-[0_0_0_2px_var(--color-paper),0_0_0_4px_var(--color-ink),0_0_0_6px_var(--color-paper)]",
    "transition-[color,background-color,box-shadow] duration-300 ease-out",
    "hover:bg-transparent hover:text-gold hover:shadow-[0_0_0_2px_var(--color-gold),0_0_0_4px_var(--color-ink),0_0_0_6px_var(--color-gold-bright)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/45 focus-visible:ring-offset-[8px] focus-visible:ring-offset-ink",
    "active:brightness-95",
    "sm:px-10 sm:py-4 sm:text-sm sm:tracking-[0.1em]",
  ].join(" ");

/** Below fixed header bar (see `--header-h` in design-system.css, includes faded rule). */
const navOverlayTopClass = "top-[var(--header-h)]";

function lockBodyScroll() {
  const root = document.documentElement;
  root.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
}

function unlockBodyScroll() {
  const root = document.documentElement;
  root.style.overflow = "";
  document.body.style.overflow = "";
}

export function SiteHeader() {
  const { locale } = useLocale();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [locationHash, setLocationHash] = useState("");

  useEffect(() => {
    const syncHash = () => setLocationHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      setAtTop(window.scrollY <= 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  /** Client navigations can interrupt Framer exit — always clear scroll lock + overlay state. */
  useLayoutEffect(() => {
    unlockBodyScroll();
    setMenuOpen(false);
  }, [pathname]);

  useLayoutEffect(() => {
    if (menuOpen) {
      lockBodyScroll();
    } else {
      unlockBodyScroll();
    }
  }, [menuOpen]);

  useEffect(() => () => unlockBodyScroll(), []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  /** Bottom edge uses {@link HeaderFadedRule} on desktop; mobile adds its own. */
  const headerSurface = [
    "bg-ink",
    atTop ? "" : "shadow-[0_1px_0_rgba(255,255,255,0.06)]",
    menuOpen ? "z-110" : "z-50",
  ]
    .filter(Boolean)
    .join(" ");

  const headerInk = "text-paper";

  return (
    <>
      <header
        className={`fixed top-0 right-0 left-0 w-full transition-shadow duration-300 ease-out ${headerSurface}`}
      >
        {/* —— Mobile / tablet: single row —— */}
        <div className="lg:hidden">
          <div
            className={`flex min-h-18 items-center justify-between gap-3 py-2.5 ${headerInnerMax}`}
          >
          <Link href="/" className="flex min-w-0 max-w-[55%]" aria-label="El Portero">
            <LogoWordmark
              size="header"
              showTagline={false}
              align="start"
              tone="onDark"
            />
          </Link>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            <LanguageSwitcher variant="onDark" />
            <Link
              href="/reserve"
              className={bookTableNavButtonClass}
              title={t(locale, "nav.bookTable")}
            >
              {t(locale, "nav.bookTable")}
            </Link>
            <button
              type="button"
              className="group flex shrink-0 items-center gap-1.5"
              aria-expanded={menuOpen}
              aria-controls="fullpage-nav"
              aria-label={
                menuOpen
                  ? t(locale, "header.closeNav")
                  : t(locale, "header.openNav")
              }
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span
                className="flex h-8 w-9 shrink-0 items-center justify-center sm:h-9 sm:w-10"
                aria-hidden
              >
                <span
                  className={`inline-block -rotate-90 whitespace-nowrap text-[9px] font-bold tracking-[0.35em] uppercase transition-colors duration-300 sm:text-[10px] sm:tracking-[0.4em] ${headerInk} group-hover:text-paper/65`}
                >
                  {t(locale, "header.menuLabel")}
                </span>
              </span>
              <span className="relative flex size-7 shrink-0 items-center justify-center overflow-hidden sm:size-8">
                <MenuToggleIcon
                  open={menuOpen}
                  className={`transition-colors duration-300 ${headerInk} group-hover:text-paper/65`}
                />
              </span>
            </button>
          </div>
        </div>
          <HeaderFadedRule />
        </div>

        {/* —— Desktop: two tiers (reference: logo band + centered text nav) —— */}
        <div className="hidden lg:block">
          <div
            className={`grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-3 ${headerInnerMax}`}
          >
            <div className="flex min-h-10 items-center justify-start">
              {LAUNCH_UI_INSTAGRAM ? (
                <a
                  href={INSTAGRAM_PROFILE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex size-10 items-center justify-center text-paper/40 transition-colors hover:text-paper/75"
                  aria-label={t(locale, "page.home.instagramAria")}
                >
                  <Instagram className="size-[1.35rem]" strokeWidth={1.5} />
                </a>
              ) : (
                // Placeholder keeps logo centred in the 3-col grid (see `LAUNCH_UI_INSTAGRAM` in `config/launchUi.ts`).
                <span className="inline-flex size-10 shrink-0" aria-hidden />
              )}
            </div>
            <div className="flex justify-center">
              <Link href="/" className="flex" aria-label="El Portero">
                <LogoWordmark
                  size="header"
                  showTagline={false}
                  align="center"
                  tone="onDark"
                />
              </Link>
            </div>
            <div className="flex items-center justify-end">
              <LanguageSwitcher variant="onDark" />
            </div>
          </div>

          <HeaderFadedRule />

          <div className={`flex items-center py-3 ${headerInnerMax}`}>
            <div className="min-w-0 flex-1" aria-hidden />
            <nav
              className="flex flex-wrap items-stretch justify-center gap-x-16 gap-y-0 sm:gap-x-20"
              aria-label="Primary"
            >
              {primaryNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={desktopNavLinkClass(pathname, item.href, locationHash)}
                >
                  {t(locale, item.labelKey)}
                </Link>
              ))}
            </nav>
            <div className="flex min-w-0 flex-1 items-center justify-end pl-4">
              <Link href="/reserve" className={bookTableNavButtonClass}>
                {t(locale, "nav.bookTable")}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence
        mode="wait"
        onExitComplete={() => {
          unlockBodyScroll();
        }}
      >
        {menuOpen ? (
          <motion.div
            key="fullpage-nav"
            id="fullpage-nav"
            role="dialog"
            aria-modal="true"
            aria-label={t(locale, "header.navDialog")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.26, ease: easeIn } }}
            transition={{ duration: 0.34, ease: easeOut }}
            className={`fixed right-0 bottom-0 left-0 z-100 flex flex-col border-t border-border/60 bg-ink text-paper lg:hidden ${navOverlayTopClass}`}
          >
            <motion.div
              className="flex min-h-0 flex-1 flex-col"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: easeOut, delay: 0.02 }}
            >
              <motion.nav
                className="flex flex-1 flex-col items-center justify-center gap-6 px-6 pt-4 pb-6 sm:gap-8 sm:px-10 sm:pt-6"
                aria-label="Primary"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.055,
                      delayChildren: 0.12,
                    },
                  },
                  hidden: {},
                }}
              >
                {primaryNavItems.map((item) => (
                  <motion.div
                    key={item.href}
                    variants={{
                      hidden: { opacity: 0, y: 18 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.4, ease: easeOut },
                      },
                    }}
                    className="w-full max-w-2xl"
                  >
                    <Link
                      href={item.href}
                      className={overlayNavLinkClass(
                        pathname,
                        item.href,
                        locationHash,
                      )}
                      onClick={closeMenu}
                    >
                      {t(locale, item.labelKey)}
                    </Link>
                  </motion.div>
                ))}
              </motion.nav>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
