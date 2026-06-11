import { type TimelineEntry } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { FadeRise } from "@/components/anim/fade-rise"
import { cn } from "@/lib/utils"

interface JourneyProps {
  items: TimelineEntry[]
}

function isCurrent(item: TimelineEntry) {
  return !item.end || item.end === null
}

export function Journey({ items }: JourneyProps) {
  return (
    <section className="py-16 md:py-20 lg:py-24">
      <FadeRise>
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
          Experience
        </p>
        <h2 className="text-3xl font-semibold tracking-tight mb-12">
          Where I&apos;ve worked
        </h2>

        <div>
          {items.map((item, i) => (
            <div
              key={`${item.company}-${item.start}`}
              className={cn(
                "grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 md:gap-8",
                i < items.length - 1 && "border-b border-border pb-8 mb-8"
              )}
            >
              {/* Left: company + dates */}
              <div className="flex flex-col gap-1">
                <p className="text-xl font-semibold text-foreground leading-snug">
                  {item.company}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {item.start} – {item.end ?? "Present"}
                </p>
                {isCurrent(item) && (
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-primary/80 mt-1">
                    <span className="relative flex size-1.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
                    </span>
                    Current
                  </span>
                )}
              </div>

              {/* Right: role + summary + tags */}
              <div>
                <p className="text-base font-semibold text-foreground leading-snug">
                  {item.role}
                </p>
                {item.summary && (
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                    {item.summary}
                  </p>
                )}
                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="font-mono text-[10px] py-0 h-5">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </FadeRise>
    </section>
  )
}
