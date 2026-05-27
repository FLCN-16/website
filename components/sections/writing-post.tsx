"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { RichText } from "@payloadcms/richtext-lexical/react";

interface WritingPostProps {
  title: string;
  publishedAt?: string;
  readingTime?: number;
  tags?: Array<{ tag: string }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any;
}

export function WritingPost({
  title,
  publishedAt,
  readingTime,
  tags,
  body,
}: WritingPostProps) {
  return (
    <article className="py-16 md:py-24 max-w-2xl">
      {/* Back link */}
      <Link
        href="/writing"
        className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-10 inline-block"
      >
        ← Writing
      </Link>

      {/* Meta */}
      <div className="mb-6 flex items-center gap-4 flex-wrap">
        {publishedAt && (
          <span className="font-mono text-xs text-muted-foreground">
            {new Date(publishedAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        )}
        {readingTime && (
          <span className="font-mono text-xs text-muted-foreground">
            {readingTime} min read
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="font-sans text-3xl md:text-4xl font-semibold tracking-tight mb-4">
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

      {/* Body */}
      {body && (
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <RichText data={body} />
        </div>
      )}
    </article>
  );
}
