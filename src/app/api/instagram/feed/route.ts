import { fetchInstagramFeed } from "@/lib/instagramGraphFeed";

export const revalidate = 600;

const LIMIT = 4;

export async function GET() {
  const hasCredentials =
    Boolean(process.env.INSTAGRAM_ACCESS_TOKEN?.trim()) &&
    Boolean(process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID?.trim());

  if (!hasCredentials) {
    return Response.json({ posts: [] });
  }

  const posts = await fetchInstagramFeed(LIMIT);
  return Response.json({ posts });
}
