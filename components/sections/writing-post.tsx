"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { extractHeadings } from "@/lib/lexical-headings";
import { PostToc } from "@/components/writing/post-toc";
import { ReadingProgress } from "@/components/writing/reading-progress";
import { RelatedPosts } from "@/components/writing/related-posts";
import type { PostCover, Post } from "@/lib/types";

interface WritingPostProps {
  title: string;
  publishedAt?: string;
  readingTime?: number;
  tags?: Array<{ tag: string }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any;
  cover?: PostCover | null;
  related?: Post[];
}

const EMPTY_RELATED: Post[] = [];

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function WritingPost({
  title,
  publishedAt,
  readingTime,
  tags,
  body,
  cover,
  related = EMPTY_RELATED,
}: WritingPostProps) {
  const headings = extractHeadings(body);
  const showToc = headings.length >= 3;

  return (
    <>
      <ReadingProgress />

      <article className="py-16 md:py-24 max-w-4xl">
        {/* Back link */}
        <Link
          href="/writing"
          className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-10 inline-block"
        >
          ← Writing
        </Link>

        {/* Cover image */}
        {cover && (
          <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-8">
            <Image
              src={cover.url}
              alt={cover.alt ?? title}
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Meta */}
        <div className="mb-4 flex items-center gap-4 flex-wrap">
          {publishedAt && (
            <span className="font-mono text-xs text-muted-foreground">
              {formatDate(publishedAt)}
            </span>
          )}
          {readingTime && (
            <span className="font-mono text-xs text-muted-foreground">
              {readingTime} min read
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="font-sans text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-4 leading-tight">
          {title}
        </h1>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-10">
            {tags.map(({ tag }) => (
              <Badge key={tag} variant="secondary" className="font-mono text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Two-column: TOC + prose */}
        <div className={showToc ? "lg:grid lg:grid-cols-[12rem_minmax(0,42rem)] lg:gap-12" : undefined}>
          {/* TOC — sticky left column on lg+ */}
          {showToc && (
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <PostToc headings={headings} />
              </div>
            </aside>
          )}

          {/* Body */}
          {body && (
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <RichText
                data={body}
                converters={({ defaultConverters }) => ({
                  ...defaultConverters,
                  heading: headingConverter,
                })}
              />
            </div>
          )}
        </div>

        {/* Related posts */}
        <RelatedPosts posts={related} />
      </article>
    </>
  );
}

// Injects id attributes on h2/h3 heading elements so TOC anchor links work.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function headingConverter({ node, nodesToJSX }: any) {
  const tag = node.tag as string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const text = (node.children as any[])
    .map((c: any) => (typeof c?.text === "string" ? c.text : ""))
    .join("");
  const id = slugify(text);
  const Tag = tag as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  const children = nodesToJSX({ nodes: node.children });
  return <Tag id={id}>{children}</Tag>;
}
