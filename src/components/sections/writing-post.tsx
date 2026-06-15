"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { Heading } from "@/lib/lexical-headings";
import { PostToc } from "@/components/writing/post-toc";
import { PostGallery } from "@/components/writing/post-gallery";
import { ReadingProgress } from "@/components/writing/reading-progress";
import { RelatedPosts } from "@/components/writing/related-posts";
import { WritingSocialCTA } from "@/components/writing/social-cta";
import { PostShare } from "@/components/writing/post-share";
import { PostNav } from "@/components/writing/post-nav";
import { AuthorBio } from "@/components/writing/author-bio";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { PostCover, Post } from "@/lib/types";

interface WritingPostProps {
  slug: string;
  title: string;
  publishedAt?: string;
  readingTime?: number;
  tags?: string[];
  /** Section headings for the table of contents, extracted server-side. */
  headings: Heading[];
  /** The rich-text body, rendered on the server (keeps PrismJS off the client). */
  children: ReactNode;
  cover?: PostCover | null;
  relatedPosts?: Post[];
  prev?: { slug: string; title: string } | null;
  next?: { slug: string; title: string } | null;
  author?: {
    name: string;
    role: string;
    description: string;
    socials: Array<{ platform: string; url: string; label: string }>;
  };
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/** Date + reading time, title, and tags — shared by the desktop overlay and the mobile stacked layout.
 * Both copies are always in the DOM (toggled via CSS), so only one may render the title as an <h1>
 * to keep a single h1 in the document. */
function CoverMeta({
  publishedAt,
  readingTime,
  title,
  tags,
  authorName,
  titleAs: TitleTag = "h1",
}: {
  publishedAt?: string;
  readingTime?: number;
  title: string;
  tags?: string[];
  authorName?: string;
  titleAs?: "h1" | "p";
}) {
  return (
    <>
      <div className="mb-2 flex items-center gap-4 flex-wrap">
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
        {authorName && (
          <span className="font-mono text-xs text-muted-foreground">
            By <Link href="/" className="hover:text-foreground transition-colors">{authorName}</Link>
          </span>
        )}
      </div>
      <TitleTag className="font-sans text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight mb-3">
        {title}
      </TitleTag>
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Link key={tag} href={`/writing?tag=${encodeURIComponent(tag)}`}>
              <Badge variant="secondary" className="font-mono text-xs hover:opacity-80 transition-opacity cursor-pointer">
                {tag}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

export function WritingPost({
  slug,
  title,
  publishedAt,
  readingTime,
  tags,
  headings,
  children,
  cover,
  relatedPosts,
  prev,
  next,
  author,
}: WritingPostProps) {
  const showToc = headings.length >= 3;

  return (
    <>
      <ReadingProgress slug={slug} />

      <article className="pt-8 pb-16 md:pt-10 md:pb-24 max-w-6xl">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/writing">Writing</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Cover hero — text overlay on md+, stacked (image then content) on mobile */}
        {cover ? (
          <div className="mb-10">
            <div className="relative h-64 md:h-96 rounded-xl overflow-hidden">
              <Image
                src={cover.url}
                alt={cover.alt ?? title}
                fill
                sizes="(max-width: 1024px) 100vw, 1152px"
                className="object-cover"
                priority
              />
              {/* Gradient fade + overlay text — md and up only */}
              <div className="absolute inset-0 hidden md:block bg-gradient-to-t from-background via-background/85 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 hidden md:block">
                <CoverMeta
                  publishedAt={publishedAt}
                  readingTime={readingTime}
                  title={title}
                  tags={tags}
                  authorName={author?.name}
                  titleAs="p"
                />
              </div>
            </div>
            {/* Stacked content below the image — mobile only */}
            <div className="mt-5 md:hidden">
              <CoverMeta
                publishedAt={publishedAt}
                readingTime={readingTime}
                title={title}
                tags={tags}
                authorName={author?.name}
              />
            </div>
          </div>
        ) : (
          <>
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
              {author?.name && (
                <span className="font-mono text-xs text-muted-foreground">
                  By <Link href="/" className="hover:text-foreground transition-colors">{author.name}</Link>
                </span>
              )}
            </div>
            <h1 className="font-sans text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-4 leading-tight">
              {title}
            </h1>
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-10">
                {tags.map((tag) => (
                  <Link key={tag} href={`/writing?tag=${encodeURIComponent(tag)}`}>
                    <Badge variant="secondary" className="font-mono text-xs hover:opacity-80 transition-opacity cursor-pointer">
                      {tag}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {/* Body + TOC: body left, TOC sticky right on lg+ */}
        <div
          id="post-body"
          className={
            showToc
              ? "lg:grid lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-12"
              : undefined
          }
        >
          {/* Body — rendered on the server, passed in as children */}
          {children && <div>{children}</div>}

          {/* TOC — sticky right column on lg+ */}
          {showToc && (
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <PostToc headings={headings} />
              </div>
            </aside>
          )}
        </div>

        {/* Share */}
        <PostShare title={title} slug={slug} />

        {/* Prev / next */}
        {(prev || next) && <PostNav prev={prev ?? null} next={next ?? null} />}

        {/* Related posts */}
        <RelatedPosts posts={relatedPosts ?? []} />

        {/* Author bio */}
        {author && <AuthorBio {...author} />}

        {/* Subscribe + social CTA */}
        <div className="mt-16 border-t border-border pt-16">
          <WritingSocialCTA />
        </div>
      </article>

      {/* PhotoSwipe lightbox for all post images */}
      <PostGallery galleryId="post-body" />
    </>
  );
}
