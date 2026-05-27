import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPayloadClient } from "@/lib/payload";
import { WritingPost } from "@/components/sections/writing-post";

interface PostProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await fetchPost(slug);
    if (!post) return { title: "Not Found" };
    return {
      title: post.seo?.title ?? `${post.title} — Rishabh Kumar`,
      description: post.seo?.description ?? post.excerpt ?? undefined,
    };
  } catch {
    return { title: slug };
  }
}

export default async function PostPage({ params }: PostProps) {
  const { slug } = await params;

  let post: Awaited<ReturnType<typeof fetchPost>>;
  try {
    post = await fetchPost(slug);
  } catch {
    notFound();
  }

  if (!post) notFound();

  return (
    <WritingPost
      title={post.title}
      publishedAt={post.publishedAt}
      readingTime={post.readingTime}
      tags={post.tags}
      body={post.body}
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
