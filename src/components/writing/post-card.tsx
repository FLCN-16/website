import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import type { Post } from "@/lib/types"

function formatDate(iso?: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

interface PostCardProps {
  post: Post
  className?: string
}

export function PostCard({ post, className }: PostCardProps) {
  return (
    <div
      className={cn(
        "group relative block border border-border overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl dark:hover:shadow-none",
        className,
      )}
    >
      {/* Invisible full-card link (z-0) — aria-hidden; h3 heading provides the accessible name */}
      <Link
        href={`/writing/${post.slug}`}
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-0 z-0"
      />

      {/* Cover image */}
      <div className="relative aspect-[16/9] bg-muted overflow-hidden">
        {post.cover ? (
          <Image
            src={post.cover.url}
            alt={post.cover.alt ?? post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-muted-foreground/5 to-muted-foreground/15" />
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2">
        {post.tags && post.tags.length > 0 && (
          <div className="relative z-10 flex flex-wrap gap-2">
            {post.tags.slice(0, 2).map((tag) => (
              <Link
                key={tag}
                href={`/writing?tag=${encodeURIComponent(tag)}`}
                className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground/70 hover:text-muted-foreground transition-colors rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        <h3 className="font-sans text-sm font-semibold tracking-tight leading-snug line-clamp-2">
          <Link
            href={`/writing/${post.slug}`}
            className="hover:text-primary transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm"
          >
            {post.title}
          </Link>
        </h3>

        <div className="flex items-center gap-1.5 pt-2 border-t border-border/60 mt-auto">
          <span className="font-mono text-xs text-muted-foreground">
            {formatDate(post.publishedAt)}
          </span>
          {post.readingTime && (
            <>
              <span className="text-muted-foreground/30 text-xs">·</span>
              <span className="font-mono text-xs text-muted-foreground">
                {post.readingTime} min read
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
