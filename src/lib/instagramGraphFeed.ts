/**
 * Fetches recent media for an Instagram **Business or Creator** account via the
 * Meta Graph API (graph.facebook.com). Requires:
 *
 * 1. Instagram Professional account linked to a Facebook Page
 * 2. A Meta app with Instagram Graph API / Facebook Login configured
 * 3. Long-lived **Page** access token with permission to read that Page’s linked
 *    Instagram account (e.g. `instagram_basic` / current equivalents such as
 *    `instagram_manage_insights` — check Meta’s latest docs for your app type)
 * 4. `INSTAGRAM_BUSINESS_ACCOUNT_ID` — the Instagram user id (numeric string),
 *    from Page settings or `GET /{page-id}?fields=instagram_business_account`
 *
 * Env: `INSTAGRAM_ACCESS_TOKEN`, `INSTAGRAM_BUSINESS_ACCOUNT_ID`
 */

const GRAPH_API_VERSION = "v21.0";

export type InstagramFeedPost = {
  id: string;
  permalink: string;
  imageUrl: string;
  alt: string;
};

type MediaNode = {
  id?: string;
  caption?: string;
  media_type?: string;
  media_url?: string;
  permalink?: string;
  thumbnail_url?: string;
  children?: { data?: MediaNode[] };
};

function resolveImageUrl(node: MediaNode): string | null {
  const type = node.media_type;
  if (type === "IMAGE" && node.media_url) return node.media_url;
  if (type === "VIDEO")
    return node.thumbnail_url ?? node.media_url ?? null;
  if (type === "CAROUSEL_ALBUM") {
    const first = node.children?.data?.[0];
    if (!first) return null;
    if (first.media_type === "VIDEO")
      return first.thumbnail_url ?? first.media_url ?? null;
    if (first.media_url) return first.media_url;
  }
  return null;
}

export async function fetchInstagramFeed(
  limit: number,
): Promise<InstagramFeedPost[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();
  const igUserId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID?.trim();
  if (!token || !igUserId) {
    return [];
  }

  const fields = [
    "id",
    "caption",
    "media_type",
    "media_url",
    "permalink",
    "thumbnail_url",
    "timestamp",
    "children{media_url,media_type,thumbnail_url}",
  ].join(",");

  const base = `https://graph.facebook.com/${GRAPH_API_VERSION}/${igUserId}/media`;
  const url = `${base}?fields=${encodeURIComponent(fields)}&limit=${limit}&access_token=${encodeURIComponent(token)}`;

  const res = await fetch(url, { next: { revalidate: 600 } });

  if (!res.ok) {
    const body = await res.text();
    console.error(
      "[instagram] Graph API HTTP",
      res.status,
      body.slice(0, 300),
    );
    return [];
  }

  const json = (await res.json()) as {
    data?: MediaNode[];
    error?: { message?: string };
  };

  if (json.error?.message) {
    console.error("[instagram] Graph API:", json.error.message);
    return [];
  }

  const list = json.data ?? [];
  const out: InstagramFeedPost[] = [];

  for (const node of list) {
    const imageUrl = resolveImageUrl(node);
    if (!node.id || !node.permalink || !imageUrl) continue;
    const raw = node.caption?.replace(/\s+/g, " ").trim() ?? "";
    const alt =
      raw.slice(0, 220) || "Post from El Portero on Instagram";
    out.push({
      id: node.id,
      permalink: node.permalink,
      imageUrl,
      alt,
    });
    if (out.length >= limit) break;
  }

  return out;
}
