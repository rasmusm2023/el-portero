import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sitemap",
};

type SitemapGroup = {
  title: string;
  items: { href: string; label: string; description?: string }[];
};

const GROUPS: SitemapGroup[] = [
  {
    title: "Pages",
    items: [
      { href: "/", label: "Home" },
      { href: "/menus", label: "Menus" },
      { href: "/events", label: "Events" },
      { href: "/gallery", label: "Gallery" },
      { href: "/hours", label: "Opening hours" },
      { href: "/story", label: "Our story" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <div className="mx-auto w-full max-w-[min(100%,64rem)] px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-22">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold tracking-[0.22em] text-ink-muted uppercase">
          El Portero
        </p>
        <h1 className="mt-3 font-display text-3xl font-medium tracking-tight text-paper sm:text-4xl">
          Sitemap
        </h1>
        <p className="mt-4 text-ink-muted leading-relaxed sm:text-lg">
          A quick index of the main sections of the site.
        </p>
      </header>

      <div className="mt-12 space-y-12">
        {GROUPS.map((group) => (
          <section key={group.title} aria-label={group.title}>
            <h2 className="font-display text-2xl font-medium tracking-tight text-paper sm:text-3xl">
              {group.title}
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {group.items.map((it) => (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    className="group block rounded-2xl border border-border bg-paper-dark/35 px-5 py-4 ring-1 ring-border/60 transition-colors hover:bg-paper-dark/45"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-sans text-sm font-semibold tracking-[0.14em] text-paper uppercase">
                        {it.label}
                      </span>
                      <span
                        aria-hidden
                        className="text-paper/70 transition-transform group-hover:translate-x-0.5"
                      >
                        →
                      </span>
                    </div>
                    {it.description ? (
                      <p className="mt-2 text-sm text-ink-muted">{it.description}</p>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-14 border-t border-border/70 pt-8 text-sm text-ink-muted">
        <p>
          Looking for the XML version?{" "}
          <a className="underline decoration-paper/20 underline-offset-4 hover:decoration-gold/55" href="/sitemap.xml">
            Open `sitemap.xml`
          </a>
          .
        </p>
      </div>
    </div>
  );
}

