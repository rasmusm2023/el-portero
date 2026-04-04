"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { t, type NavKey } from "@/i18n/strings";
import { useLocale } from "@/i18n/useLocale";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MenuToggleIcon } from "./MenuToggleIcon";

/** Full-screen menu: all pages except Reserve (Reserve is the header CTA). */
const primaryNavItems: { href: string; labelKey: NavKey }[] = [
  { href: "/", labelKey: "nav.home" },
  { href: "/menu", labelKey: "nav.menu" },
  { href: "/events", labelKey: "nav.events" },
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
    isActive ? "text-gold" : "text-paper/90 hover:text-gold",
  ].join(" ");
}

const headerInnerMax =
  "mx-auto w-full max-w-[min(100%,112rem)] px-5 sm:px-10 lg:px-14 xl:px-20";

const headerBarClass = `${headerInnerMax} flex h-[var(--header-h)] items-center justify-between gap-4 sm:gap-6`;

/** Overlay sits below the sticky bar so the header does not jump or duplicate. */
const navOverlayTopClass =
  "top-[calc(var(--header-h)+1px)]";

function lockBodyScroll() {
  const gap = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = "hidden";
  if (gap > 0) document.body.style.paddingRight = `${gap}px`;
}

function unlockBodyScroll() {
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
}

export function SiteHeader() {
  const { locale } = useLocale();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    lockBodyScroll();
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

  const headerSurface = menuOpen
    ? "border-paper/10 bg-ink backdrop-blur-md"
    : "border-border bg-paper/90 backdrop-blur-md";

  const headerInk = menuOpen ? "text-paper" : "text-ink";

  return (
    <>
      <header
        className={`sticky top-0 border-b transition-colors duration-300 ease-out ${
          menuOpen ? "z-110" : "z-50"
        } ${headerSurface}`}
      >
        <div className={headerBarClass}>
          <div className="flex min-w-0 shrink-0 items-center gap-4 md:gap-10">
            <Link
              href="/"
              className={`min-w-0 shrink font-display text-xl font-semibold tracking-[0.02em] transition-colors duration-300 sm:text-2xl ${headerInk}`}
            >
              El Portero
            </Link>
            <Link
              href="/reserve"
              className="inline-flex shrink-0 items-center justify-center rounded-md border border-gold bg-gold px-3 py-2 text-[10px] font-semibold tracking-[0.16em] text-ink uppercase shadow-sm transition-colors hover:bg-gold-bright hover:shadow-md sm:px-6 sm:py-2.5 sm:text-xs sm:tracking-[0.2em]"
            >
              {t(locale, "header.reserveTable")}
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-3 md:gap-5">
            <LanguageSwitcher variant={menuOpen ? "onDark" : "default"} />
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
                className="flex h-8 w-9 items-center justify-center sm:h-9 sm:w-10"
                aria-hidden
              >
                <span
                  className={`inline-block -rotate-90 whitespace-nowrap text-[9px] font-bold tracking-[0.35em] uppercase transition-colors duration-300 group-hover:text-gold sm:text-[10px] sm:tracking-[0.4em] ${headerInk}`}
                >
                  {t(locale, "header.menuLabel")}
                </span>
              </span>
              <MenuToggleIcon
                open={menuOpen}
                className={`transition-colors duration-300 group-hover:text-gold ${headerInk}`}
              />
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
            className={`fixed right-0 bottom-0 left-0 z-100 flex flex-col bg-ink text-paper ${navOverlayTopClass}`}
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
                className={`${headerInnerMax} flex shrink-0 items-center justify-center border-t border-paper/10 py-8 sm:py-10`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: easeOut, delay: 0.35 }}
              >
                <Link
                  href="/reserve"
                  className="mx-auto flex w-full max-w-md items-center justify-center rounded-md border border-gold bg-gold px-6 py-3 text-sm font-semibold tracking-[0.2em] text-ink uppercase transition-colors hover:bg-gold-bright"
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
