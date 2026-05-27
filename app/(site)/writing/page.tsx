import { getPayloadClient } from "@/lib/payload";
import { WritingList } from "@/components/sections/writing-list";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Writing",
  description: "Articles and thoughts on frontend engineering, architecture, and building at scale.",
});

export const revalidate = 60;

export default async function WritingIndex() {
  let posts: Awaited<ReturnType<typeof fetchPosts>> = [];

  try {
    posts = await fetchPosts();
  } catch {
    // Payload not available (missing env vars in dev) — show empty state
  }

  return <WritingList posts={posts} />;
}

async function fetchPosts() {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "posts",
    where: { status: { equals: "published" } },
    sort: "-publishedAt",
    limit: 50,
    depth: 0,
  });
  return result.docs.map((doc) => ({
    id: String(doc.id),
    title: doc.title,
    slug: doc.slug,
    excerpt: doc.excerpt ?? undefined,
    tags: doc.tags ?? undefined,
    publishedAt: doc.publishedAt ?? undefined,
    readingTime: doc.readingTime ?? undefined,
  }));
}
