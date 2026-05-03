"use client";

import { Instagram } from "lucide-react";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";
import { INSTAGRAM_HANDLE, INSTAGRAM_PROFILE_URL } from "@/config/site";
import { useEffect, useId, useState } from "react";

const GRID_SIZE = 4;

type FeedPost = {
  id: string;
  permalink: string;
  imageUrl: string;
  alt: string;
};

function InstagramFeedGrid({
  posts,
  loading,
  panelId,
  locale,
}: {
  posts: (FeedPost | null)[];
  loading: boolean;
  panelId: string;
  locale: "en" | "es" | "sv";
}) {
  return (
    <div
      id={panelId}
      className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
      aria-label={t(locale, "page.home.instagramGridAria")}
    >
      {loading
        ? Array.from({ length: GRID_SIZE }, (_, i) => (
            <div
              key={`sk-${i}`}
              className="aspect-square animate-pulse rounded-none bg-paper-dark/50 ring-1 ring-border/60"
              aria-hidden
            />
          ))
        : posts.map((post, i) =>
            post ? (
              <a
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden rounded-none ring-1 ring-border/60 transition-opacity hover:opacity-95 focus-visible:ring-2 focus-visible:ring-ink"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- Instagram CDN hostnames vary; avoid remotePatterns churn */}
                <img
                  src={post.imageUrl}
                  alt={post.alt}
                  className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
              </a>
            ) : (
              <div
                key={`empty-${i}`}
                className="aspect-square rounded-none border border-dashed border-border bg-paper-dark/40 ring-1 ring-border/60"
                aria-hidden
              />
            ),
          )}
    </div>
  );
}

export function InstagramFeedSection() {
  const { locale } = useLocale();
  const panelId = useId();
  const [posts, setPosts] = useState<(FeedPost | null)[]>(() =>
    Array.from({ length: GRID_SIZE }, () => null),
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/instagram/feed", {
          credentials: "same-origin",
        });
        const data = (await res.json()) as {
          posts?: FeedPost[];
        };
        const list = Array.isArray(data.posts) ? data.posts : [];
        const padded: (FeedPost | null)[] = Array.from(
          { length: GRID_SIZE },
          (_, i) => list[i] ?? null,
        );
        if (!cancelled) setPosts(padded);
      } catch {
        if (!cancelled)
          setPosts(Array.from({ length: GRID_SIZE }, () => null));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      aria-label={t(locale, "page.home.instagramAria")}
      className="border-t border-border bg-paper-dark/30"
    >
      <div className="mx-auto w-full max-w-[min(100%,112rem)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
          <div className="flex min-w-0 flex-1 items-center gap-5 sm:gap-6">
            <a
              href={INSTAGRAM_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-ink text-paper shadow-sm ring-1 ring-ink/10 transition-colors hover:bg-ink-muted"
              aria-label={t(locale, "page.home.instagramAria")}
            >
              <Instagram className="size-[1.65rem]" strokeWidth={1.75} aria-hidden />
            </a>
            <div className="min-w-0 flex-1">
              <p className="m-0 leading-none">
                <a
                  href={INSTAGRAM_PROFILE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-0.5 font-sans transition-colors hover:text-ink"
                  aria-label={INSTAGRAM_HANDLE}
                >
                  <span
                    className="text-sm font-normal text-ink-muted/50 transition-colors group-hover:text-ink-muted sm:text-base"
                    aria-hidden
                  >
                    @
                  </span>
                  <span className="text-xl font-bold tracking-[0.12em] text-ink group-hover:text-ink sm:text-2xl">
                    {INSTAGRAM_HANDLE.replace(/^@/, "")}
                  </span>
                </a>
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3 sm:justify-end">
            <a
              href={INSTAGRAM_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-none border border-ink/40 bg-transparent px-6 py-2.5 text-sm font-semibold tracking-[0.16em] text-ink uppercase transition-colors hover:border-ink hover:bg-ink/5"
            >
              {t(locale, "page.home.instagramFollow")}
            </a>
          </div>
        </div>

        <InstagramFeedGrid
          posts={posts}
          loading={loading}
          panelId={panelId}
          locale={locale}
        />
      </div>
    </section>
  );
}
