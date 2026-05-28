import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPayloadClient } from "@/lib/payload";
import { WritingPost } from "@/components/sections/writing-post";
import { createMetadata } from "@/lib/metadata";
import type { Post } from "@/lib/types";
import { mapPayloadPost, resolvePostCover } from "@/lib/posts";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await fetchPost(slug);
    if (!post) return { title: "Not Found" };
    return createMetadata({
      title: (post.meta as { title?: string })?.title ?? post.title,
      description: (post.meta as { description?: string })?.description ?? post.excerpt ?? undefined,
    });
  } catch {
    return { title: slug };
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  let post: Awaited<ReturnType<typeof fetchPost>> | undefined;
  try {
    post = await fetchPost(slug);
  } catch {
    // Payload unavailable — fall through to notFound below
  }

  if (!post) notFound();

  const relatedPosts = await fetchRelated(post as unknown as { slug: string; tags?: Array<{ tag: string }> | null }).catch(() => []);

  const coverResolved = resolvePostCover(post.cover);

  return (
    <WritingPost
      title={post.title}
      publishedAt={post.publishedAt ?? undefined}
      readingTime={post.readingTime ?? undefined}
      tags={post.tags?.map((t: { tag?: string | null }) => ({ tag: t.tag ?? "" }))}
      body={post.body}
      cover={coverResolved}
      related={relatedPosts}
    />
  );
}

async function fetchPost(slug: string) {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "posts",
    where: {
      slug: { equals: slug },
      status: { equals: "published" },
    },
    limit: 1,
    depth: 1,
  });
  return result.docs[0] ?? null;
}

async function fetchRelated(post: { slug: string; tags?: Array<{ tag: string }> | null }): Promise<Post[]> {
  if (!post.tags?.length) return fetchRecent(post.slug);

  const payload = await getPayloadClient();
  const tagValues = post.tags.map((t) => t.tag);

  const result = await payload.find({
    collection: "posts",
    where: {
      and: [
        { status: { equals: "published" } },
        { slug: { not_equals: post.slug } },
        { "tags.tag": { in: tagValues } },
      ],
    },
    sort: "-publishedAt",
    limit: 3,
    depth: 1,
  });

  const docs = result.docs;
  if (docs.length >= 3) return docs.map(mapPayloadPost);

  // top up with recent posts excluding what we already have
  const existing = new Set(docs.map((d) => d.slug));
  existing.add(post.slug);
  const recent = await fetchRecent(post.slug, existing);
  const combined = [...docs.map(mapPayloadPost), ...recent].slice(0, 3);
  return combined;
}

async function fetchRecent(excludeSlug: string, excludeSlugs?: Set<string>): Promise<Post[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "posts",
    where: {
      and: [
        { status: { equals: "published" } },
        { slug: { not_equals: excludeSlug } },
      ],
    },
    sort: "-publishedAt",
    limit: 6,
    depth: 1,
  });
  const all = result.docs.map(mapPayloadPost);
  if (!excludeSlugs) return all.slice(0, 3);
  return all.filter((p) => !excludeSlugs.has(p.slug)).slice(0, 3);
}
