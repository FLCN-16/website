export default function WritingPostLoading() {
  return (
    <article className="pt-8 pb-16 md:pt-10 md:pb-24 max-w-6xl">
      {/* Breadcrumb skeleton */}
      <div className="mb-8 h-4 w-48 bg-muted rounded animate-pulse" />

      {/* Hero cover image skeleton */}
      <div className="mb-6 h-64 md:h-96 w-full bg-muted rounded-xl animate-pulse" />

      {/* Title skeleton */}
      <div className="mb-3 h-10 md:h-12 w-4/5 bg-muted rounded animate-pulse" />

      {/* Meta row skeleton (date + reading time) */}
      <div className="mb-6 flex items-center gap-4 flex-wrap">
        <div className="h-3 w-24 bg-muted rounded animate-pulse" />
        <div className="h-3 w-20 bg-muted rounded animate-pulse" />
      </div>

      {/* Body text skeleton - 6-8 lines with varying widths */}
      <div className="space-y-3">
        <div className="h-4 w-full bg-muted rounded animate-pulse" />
        <div className="h-4 w-full bg-muted rounded animate-pulse" />
        <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
        <div className="h-4 w-full bg-muted rounded animate-pulse" />
        <div className="h-4 w-4/5 bg-muted rounded animate-pulse" />
        <div className="h-4 w-full bg-muted rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
        <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
      </div>
    </article>
  )
}
