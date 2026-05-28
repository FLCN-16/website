import { getPayloadClient } from "@/lib/payload";
import { WritingList } from "@/components/sections/writing-list";
import { createMetadata } from "@/lib/metadata";
import type { Post } from "@/lib/types";
import { mapPayloadPost } from "@/lib/posts";

export const metadata = createMetadata({
  title: "Writing",
  description: "Articles and thoughts on frontend engineering, architecture, and building at scale.",
});

export const revalidate = 60;

export default async function WritingIndex() {
  let posts: Post[] = [];

  try {
    posts = await fetchPosts();
  } catch {
    // Payload not available (missing env vars in dev) — show empty state
  }

  const heroPost = pickHero(posts);

  return <WritingList posts={posts} heroPost={heroPost} />;
}

function pickHero(posts: Post[]): Post | null {
  // Prefer editor-flagged featured post with a cover image
  const featured = posts.find((p) => p.featured && p.cover);
  if (featured) return featured;
  // Fall back to most-recent post with a cover
  return posts.find((p) => p.cover) ?? null;
}

async function fetchPosts(): Promise<Post[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "posts",
    where: { status: { equals: "published" } },
    sort: "-publishedAt",
    limit: 50,
    depth: 1,
  });
  return result.docs.map(mapPayloadPost);
}
