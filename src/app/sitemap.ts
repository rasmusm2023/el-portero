import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ?? "";
  const url = (path: string) => (baseUrl ? `${baseUrl}${path}` : path);

  const now = new Date();

  const routes: { path: string; changeFrequency?: MetadataRoute.Sitemap[0]["changeFrequency"] }[] =
    [
      { path: "/", changeFrequency: "weekly" },
      { path: "/menus", changeFrequency: "weekly" },
      { path: "/events", changeFrequency: "weekly" },
      { path: "/gallery", changeFrequency: "monthly" },
      { path: "/hours", changeFrequency: "monthly" },
      { path: "/story", changeFrequency: "monthly" },
      { path: "/contact", changeFrequency: "yearly" },
    ];

  return routes.map((r) => ({
    url: url(r.path),
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.path === "/" ? 1 : 0.7,
  }));
}

