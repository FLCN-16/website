import { getPayloadClient } from "@/lib/payload";
import { WritingList } from "@/components/sections/writing-list";
import { createMetadata } from "@/lib/metadata";
import type { Post } from "@/lib/types";

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
  return result.docs.map((doc) => {
    const cover = doc.cover as
      | { url?: string; width?: number; height?: number; alt?: string }
      | null
      | undefined;
    return {
      id: String(doc.id),
      title: doc.title,
      slug: doc.slug,
      excerpt: doc.excerpt ?? null,
      cover:
        cover && typeof cover === "object" && cover.url
          ? {
              url: cover.url,
              width: cover.width ?? 800,
              height: cover.height ?? 450,
              alt: cover.alt ?? null,
            }
          : null,
      tags: doc.tags ?? null,
      publishedAt: doc.publishedAt ?? null,
      readingTime: doc.readingTime ?? null,
      featured: doc.featured ?? undefined,
    };
  });
}
