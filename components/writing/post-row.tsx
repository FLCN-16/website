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

interface PostRowProps {
  post: Post
  className?: string
}

export function PostRow({ post, className }: PostRowProps) {
  return (
    <Link
      href={`/writing/${post.slug}`}
      className={cn(
        "group flex items-center gap-6 py-6 border-b border-border last:border-b-0 transition-colors duration-200",
        className,
      )}
    >
      {/* Thumbnail — left */}
      {post.cover && (
        <div className="relative w-16 h-16 md:w-20 md:h-20 overflow-hidden shrink-0">
          <Image
            src={post.cover.url}
            alt={post.cover.alt ?? post.title}
            fill
            sizes="(max-width: 768px) 64px, 80px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      {/* Text */}
      <div className="flex flex-col gap-1.5 min-w-0 flex-1">
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-0.5">
            {post.tags.slice(0, 2).map(({ tag }) => (
              <span
                key={tag}
                className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground/70"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h3 className="font-sans text-base md:text-lg font-semibold tracking-tight leading-snug group-hover:text-primary transition-colors duration-200 line-clamp-2">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="hidden md:block text-sm text-muted-foreground line-clamp-1 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center gap-2 mt-1">
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

      {/* Arrow */}
      <span className="font-mono text-sm text-muted-foreground/50 group-hover:text-foreground group-hover:translate-x-1 transition-all duration-200 select-none shrink-0">
        →
      </span>
    </Link>
  )
}
