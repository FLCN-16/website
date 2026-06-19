import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Post } from "@/lib/types"

function formatDate(iso?: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

interface FeaturedCardProps {
  post: Post
  wide?: boolean
  className?: string
}

export function FeaturedCard({ post, wide = false, className }: FeaturedCardProps) {
  return (
    <Link
      href={`/writing/${post.slug}`}
      className={cn(
        "group relative block overflow-hidden border border-border transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 dark:hover:shadow-none",
        className,
      )}
    >
      {post.cover ? (
        <>
          {/* Full-width hero image */}
          <div className={cn("relative overflow-hidden bg-muted", wide ? "aspect-[4/3] md:aspect-[21/9]" : "aspect-[4/3] md:aspect-[16/9]")}>
            <Image
              src={post.cover.url}
              alt={post.cover.alt ?? post.title}
              fill
              sizes="100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              priority
            />
            {/* Gradient overlay — md and up only */}
            <div className="absolute inset-0 hidden md:block bg-gradient-to-t from-black/90 via-black/45 to-transparent" />

            {/* Content overlay — md and up only */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-10 hidden md:block">
              {/* Featured chip */}
              <div className="inline-flex items-center gap-2 mb-3 bg-black/40 backdrop-blur-sm border border-white/15 rounded-full px-3 py-1">
                <span className="relative flex size-1.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
                </span>
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/80">
                  Featured
                </p>
              </div>

              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="font-sans text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-tight text-white mb-2 line-clamp-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <div className="hidden md:block">
                      <p className="text-sm text-white/65 leading-relaxed line-clamp-3 max-w-2xl">
                        {post.excerpt}
                      </p>
                    </div>
                  )}
                </div>

                {/* Meta — right-aligned on desktop */}
                <div className="flex md:flex-col md:items-end gap-3 shrink-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-mono text-xs text-white/55">
                      {formatDate(post.publishedAt)}
                    </span>
                    {post.readingTime && (
                      <>
                        <span className="text-white/35 text-xs">·</span>
                        <span className="font-mono text-xs text-white/55">
                          {post.readingTime} min read
                        </span>
                      </>
                    )}
                  </div>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 2).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="font-mono text-xs bg-white/10 text-white/75 border border-white/15 hover:bg-white/20 md:hidden"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={`md-${tag}`}
                          variant="secondary"
                          className="hidden md:inline-flex font-mono text-xs bg-white/10 text-white/75 border border-white/15 hover:bg-white/20"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stacked caption below the image — mobile only */}
          <div className="md:hidden bg-card p-5">
            {/* Featured chip */}
            <div className="inline-flex items-center gap-2 mb-2.5">
              <span className="relative flex size-1.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
              </span>
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                Featured
              </p>
            </div>

            <h2 className="font-sans text-xl font-bold tracking-tight leading-tight text-foreground mb-2 line-clamp-2">
              {post.title}
            </h2>

            <div className="flex flex-wrap items-center gap-1.5 mb-3">
              <span className="font-mono text-xs text-muted-foreground">
                {formatDate(post.publishedAt)}
              </span>
              {post.readingTime && (
                <>
                  <span className="text-muted-foreground/40 text-xs">·</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {post.readingTime} min read
                  </span>
                </>
              )}
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {post.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="font-mono text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        /* Fallback — no cover image */
        <div className="flex flex-col gap-5 p-6 md:p-8 bg-card">
          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-primary shrink-0" />
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              Featured
            </p>
          </div>
          <h2 className="font-sans text-2xl md:text-3xl font-bold tracking-tight leading-tight group-hover:text-primary transition-colors duration-200 line-clamp-2">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center gap-1.5 pt-4 border-t border-border/60">
            <span className="font-mono text-xs text-muted-foreground">
              {formatDate(post.publishedAt)}
            </span>
            {post.readingTime && (
              <>
                <span className="text-muted-foreground/40 text-xs">·</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {post.readingTime} min read
                </span>
              </>
            )}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="font-mono text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <span className="font-mono text-xs text-primary mt-1">
            Read article →
          </span>
        </div>
      )}
    </Link>
  )
}
