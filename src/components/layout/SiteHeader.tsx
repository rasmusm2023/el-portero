"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { t, type NavKey } from "@/i18n/strings";
import { useLocale } from "@/i18n/useLocale";
import { LogoWordmark } from "@/components/LogoWordmark";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MenuToggleIcon } from "./MenuToggleIcon";

/** Full-screen menu: all pages except Reserve (Reserve is the header CTA). */
const primaryNavItems: { href: string; labelKey: NavKey }[] = [
  { href: "/", labelKey: "nav.home" },
  { href: "/menu", labelKey: "nav.menu" },
  { href: "/events", labelKey: "nav.events" },
  { href: "/story", labelKey: "nav.story" },
  { href: "/contact", labelKey: "nav.contact" },
];

const easeOut = [0.22, 1, 0.36, 1] as const;
const easeIn = [0.4, 0, 1, 1] as const;

function overlayLinkClass(pathname: string, href: string) {
  const isActive =
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);
  return [
    "block w-full text-center font-sans text-5xl font-bold tracking-tight transition-colors sm:text-6xl md:text-7xl",
    isActive ? "text-ink" : "text-ink/40 hover:text-ink/75",
  ].join(" ");
}

/** Matches hero / footer horizontal gutters (`px-4 sm:px-6 lg:px-8`). */
const headerInnerMax =
  "mx-auto w-full max-w-[min(100%,112rem)] px-4 sm:px-6 lg:px-8";

/** Simple 2-rail header: logo left, controls right. */
const headerBarClass = `${headerInnerMax} relative flex min-h-[var(--header-h)] items-center justify-between gap-3 py-3 sm:gap-6 sm:py-4`;

/** Overlay sits below the fixed bar so the header does not jump or duplicate. */
const navOverlayTopClass =
  "top-[calc(var(--header-h)+1px)]";

/**
 * Lock viewport scroll when the full-screen menu is open.
 * With `scrollbar-gutter: stable` on `html`, the track is already reserved — do **not**
 * add `padding-right` equal to the scrollbar width or the page shifts twice (gutter + pad).
 */
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

/** Treat as “top of page” within this many px to avoid rubber-band flicker. */
const SCROLL_TOP_EPS = 8;

export function SiteHeader() {
  const { locale } = useLocale();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      setAtTop(window.scrollY <= SCROLL_TOP_EPS);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useLayoutEffect(() => {
    if (!menuOpen) return;
    lockBodyScroll();
    /* Unlock only in onExitComplete so scroll stays locked during overlay exit. */
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

  /** At top: frosted paper bar so nav stays readable over light page edges (e.g. inset hero). Scrolled: dark glass. */
  const onLightSurface = menuOpen || atTop;

  const headerSurface = menuOpen
    ? "border-border/50 bg-paper/95 backdrop-blur-md"
    : !atTop
      ? "border-b border-paper/10 bg-ink/65 backdrop-blur-md"
      : "border-b border-border/40 bg-paper/90 backdrop-blur-md";

  const headerInk = menuOpen ? "text-ink" : onLightSurface ? "text-ink" : "text-paper";

  const reserveBtnClass =
    menuOpen || onLightSurface
      ? "border-2 border-ink/45 bg-ink/[0.05] text-ink shadow-sm ring-1 ring-ink/10 hover:border-ink hover:bg-ink/10"
      : "border-2 border-paper/80 bg-paper/10 text-paper shadow-md shadow-black/30 ring-1 ring-white/15 hover:border-paper hover:bg-paper/18";

  return (
    <>
      <header
        className={`fixed top-0 right-0 left-0 w-full border-b transition-[background-color,backdrop-filter,border-color,box-shadow] duration-300 ease-out ${
          menuOpen ? "z-110" : "z-50"
        } ${headerSurface}`}
      >
        <div className={headerBarClass}>
          <div className="relative z-20 flex min-w-0 items-center justify-start">
            <Link href="/" className="flex min-w-0 max-w-full" aria-label="El Portero">
              <LogoWordmark
                size="header"
                showTagline={false}
                align="start"
                tone={menuOpen || onLightSurface ? "onLight" : "onDark"}
              />
            </Link>
          </div>

          <div className="relative z-20 flex min-w-0 items-center justify-end gap-2 sm:gap-4 md:gap-5">
            <LanguageSwitcher
              variant={menuOpen || onLightSurface ? "default" : "onDark"}
            />
            <Link
              href="/reserve"
              className={`inline-flex max-w-full shrink-0 items-center justify-center rounded-none px-2.5 py-2 text-[9px] font-bold tracking-[0.16em] uppercase transition-[color,background-color,border-color,box-shadow] sm:px-5 sm:py-2.5 sm:text-[11px] sm:tracking-[0.2em] ${reserveBtnClass}`}
            >
              {t(locale, "header.reserveNav")}
            </Link>
            <button
              type="button"
              className="group flex shrink-0 items-center gap-1.5 sm:gap-2"
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
                  className={`inline-block -rotate-90 whitespace-nowrap text-[9px] font-bold tracking-[0.35em] uppercase transition-colors duration-300 sm:text-[10px] sm:tracking-[0.4em] ${headerInk} ${
                    menuOpen || onLightSurface
                      ? "group-hover:text-ink/65"
                      : "group-hover:text-paper/80"
                  }`}
                >
                  {t(locale, "header.menuLabel")}
                </span>
              </span>
              <span className="relative flex size-7 shrink-0 items-center justify-center overflow-hidden sm:size-8">
                <MenuToggleIcon
                  open={menuOpen}
                  className={`transition-colors duration-300 ${headerInk} ${
                    menuOpen || onLightSurface
                      ? "group-hover:text-ink/65"
                      : "group-hover:text-paper/80"
                  }`}
                />
              </span>
            </button>
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
            className={`fixed right-0 bottom-0 left-0 z-100 flex flex-col border-t border-border/60 bg-paper text-ink ${navOverlayTopClass}`}
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
                      className={overlayLinkClass(pathname, item.href)}
                      onClick={closeMenu}
                    >
                      {t(locale, item.labelKey)}
                    </Link>
                  </motion.div>
                ))}
              </motion.nav>

              <motion.div
                className={`${headerInnerMax} flex shrink-0 items-center justify-center border-t border-border py-8 sm:py-10`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: easeOut, delay: 0.35 }}
              >
                <Link
                  href="/reserve"
                  className="mx-auto flex w-full max-w-md items-center justify-center rounded-none border-2 border-ink bg-ink px-6 py-3 text-sm font-bold tracking-[0.22em] text-paper uppercase shadow-md shadow-black/15 ring-1 ring-ink/20 transition-[color,background-color,border-color,box-shadow] hover:border-ink hover:bg-ink/92"
                  onClick={closeMenu}
                >
                  {t(locale, "header.reserveTable")}
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
