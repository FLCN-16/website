import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPayloadClient } from "@/lib/payload";
import { WritingPost } from "@/components/sections/writing-post";
import { createMetadata } from "@/lib/metadata";
import type { Post, PostCover } from "@/lib/types";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await fetchPost(slug);
    if (!post) return { title: "Not Found" };
    return createMetadata({
      title: post.seo?.title ?? post.title,
      description: post.seo?.description ?? post.excerpt ?? undefined,
    });
  } catch {
    return { title: slug };
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  let post: Awaited<ReturnType<typeof fetchPost>>;
  try {
    post = await fetchPost(slug);
  } catch {
    notFound();
  }

  if (!post) notFound();

  const relatedPosts = await fetchRelated(post as unknown as { slug: string; tags?: Array<{ tag: string }> | null }).catch(() => []);

  const cover = post.cover as
    | { url?: string; width?: number; height?: number; alt?: string }
    | null
    | undefined;

  const coverResolved: PostCover | null =
    cover && typeof cover === "object" && cover.url
      ? {
          url: cover.url,
          width: cover.width ?? 800,
          height: cover.height ?? 450,
          alt: cover.alt ?? null,
        }
      : null;

  return (
    <WritingPost
      title={post.title}
      publishedAt={post.publishedAt ?? undefined}
      readingTime={post.readingTime ?? undefined}
      tags={post.tags ?? undefined}
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
  if (docs.length >= 3) return docs.map(mapPost);

  // top up with recent posts excluding what we already have
  const existing = new Set(docs.map((d) => d.slug));
  existing.add(post.slug);
  const recent = await fetchRecent(post.slug, existing);
  const combined = [...docs.map(mapPost), ...recent].slice(0, 3);
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
  const all = result.docs.map(mapPost);
  if (!excludeSlugs) return all.slice(0, 3);
  return all.filter((p) => !excludeSlugs.has(p.slug)).slice(0, 3);
}

function mapPost(doc: Record<string, unknown>): Post {
  const cover = doc.cover as
    | { url?: string; width?: number; height?: number; alt?: string }
    | null
    | undefined;
  return {
    id: String(doc.id),
    title: doc.title as string,
    slug: doc.slug as string,
    excerpt: (doc.excerpt as string | null) ?? null,
    cover:
      cover && typeof cover === "object" && cover.url
        ? {
            url: cover.url,
            width: cover.width ?? 800,
            height: cover.height ?? 450,
            alt: cover.alt ?? null,
          }
        : null,
    tags: (doc.tags as Array<{ tag: string }> | null) ?? null,
    publishedAt: (doc.publishedAt as string | null) ?? null,
    readingTime: (doc.readingTime as number | null) ?? null,
    featured: (doc.featured as boolean | null) ?? undefined,
  };
}
