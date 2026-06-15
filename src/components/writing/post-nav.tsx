import Link from "next/link"

interface PostNavProps {
  prev: { slug: string; title: string } | null // older post
  next: { slug: string; title: string } | null // newer post
}

export function PostNav({ prev, next }: PostNavProps) {
  if (!prev && !next) return null

  return (
    <nav
      aria-label="Post navigation"
      className="mt-12 pt-8 border-t border-border grid grid-cols-2 gap-4"
    >
      {/* Prev — older post, left-aligned */}
      {prev ? (
        <Link
          href={`/writing/${prev.slug}`}
          className="group flex flex-col gap-1.5 text-left rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-foreground">
            ← Older
          </span>
          <span className="font-sans text-sm text-foreground line-clamp-2 transition-colors group-hover:text-foreground/80">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div aria-hidden />
      )}

      {/* Next — newer post, right-aligned */}
      {next ? (
        <Link
          href={`/writing/${next.slug}`}
          className="group flex flex-col gap-1.5 text-right rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-foreground">
            Newer →
          </span>
          <span className="font-sans text-sm text-foreground line-clamp-2 transition-colors group-hover:text-foreground/80">
            {next.title}
          </span>
        </Link>
      ) : (
        <div aria-hidden />
      )}
    </nav>
  )
}
