export default function WritingLoading() {
  return (
    <section className="pt-10 pb-20 md:pt-14 md:pb-28 animate-pulse">
      {/* Header */}
      <div className="pb-12 border-b border-border">
        <div className="h-3 w-14 bg-muted rounded mb-4" />
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="space-y-3">
            <div className="h-10 md:h-12 w-64 bg-muted rounded" />
          </div>
          <div className="space-y-2 md:items-end">
            <div className="h-3 w-56 bg-muted rounded" />
            <div className="h-3 w-44 bg-muted rounded" />
          </div>
        </div>
      </div>

      {/* Chip filters row */}
      <div className="flex gap-2 mt-8 flex-wrap">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 w-20 bg-muted rounded-full" />
        ))}
        <div className="ml-auto h-8 w-24 bg-muted rounded-full" />
      </div>

      {/* Featured swiper placeholder */}
      <div className="mt-10 aspect-[4/3] md:aspect-[21/9] bg-muted rounded-sm" />

      {/* All articles label */}
      <div className="flex items-center gap-4 mt-12 mb-8">
        <div className="h-3 w-20 bg-muted rounded" />
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Year group */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-3 w-10 bg-muted rounded" />
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Post rows */}
        <div className="divide-y divide-border">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-6 py-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-muted shrink-0" />
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                <div className="h-2.5 w-12 bg-muted rounded" />
                <div className="h-4 w-3/4 bg-muted rounded" />
                <div className="h-4 w-1/2 bg-muted rounded" />
                <div className="h-2.5 w-24 bg-muted rounded mt-1" />
              </div>
              <div className="h-3 w-3 bg-muted rounded shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Second year group */}
      <div>
        <div className="flex items-center gap-4 mb-4">
          <div className="h-3 w-10 bg-muted rounded" />
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="divide-y divide-border">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-6 py-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-muted shrink-0" />
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                <div className="h-2.5 w-16 bg-muted rounded" />
                <div className="h-4 w-2/3 bg-muted rounded" />
                <div className="h-2.5 w-20 bg-muted rounded mt-1" />
              </div>
              <div className="h-3 w-3 bg-muted rounded shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
