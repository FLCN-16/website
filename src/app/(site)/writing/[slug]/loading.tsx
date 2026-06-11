export default function PostLoading() {
  return (
    <div className="py-16 md:py-24 max-w-6xl animate-pulse">
      {/* Back link */}
      <div className="h-3 w-16 bg-muted rounded mb-10" />

      {/* Cover hero */}
      <div className="mb-10 h-64 md:h-96 rounded-xl bg-muted" />

      {/* Meta: date + reading time */}
      <div className="flex gap-4 mb-3">
        <div className="h-3 w-24 bg-muted rounded" />
        <div className="h-3 w-16 bg-muted rounded" />
      </div>

      {/* Title */}
      <div className="space-y-3 mb-4">
        <div className="h-8 md:h-10 w-3/4 bg-muted rounded" />
        <div className="h-8 md:h-10 w-1/2 bg-muted rounded" />
      </div>

      {/* Tags */}
      <div className="flex gap-2 mb-10">
        <div className="h-5 w-14 bg-muted rounded-full" />
        <div className="h-5 w-20 bg-muted rounded-full" />
      </div>

      {/* Body + TOC */}
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-12">
        {/* Body lines */}
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`h-4 bg-muted rounded ${i % 5 === 4 ? "w-2/3" : "w-full"}`} />
          ))}
          <div className="h-4 bg-muted rounded w-full mt-6" />
          <div className="h-4 bg-muted rounded w-5/6" />
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-4/5" />

          {/* H2 break */}
          <div className="h-6 w-48 bg-muted rounded mt-8 mb-2" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={`b-${i}`} className={`h-4 bg-muted rounded ${i % 4 === 3 ? "w-3/5" : "w-full"}`} />
          ))}
        </div>

        {/* TOC stub — desktop only */}
        <aside className="hidden lg:block">
          <div className="space-y-3 pt-1">
            <div className="h-3 w-20 bg-muted rounded" />
            <div className="h-3 w-32 bg-muted rounded" />
            <div className="h-3 w-28 bg-muted rounded" />
            <div className="h-3 w-24 bg-muted rounded" />
          </div>
        </aside>
      </div>
    </div>
  )
}
