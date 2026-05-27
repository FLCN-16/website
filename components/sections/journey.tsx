import { type JourneyItem } from "@/content/journey"
import { Badge } from "@/components/ui/badge"
import { FadeRise } from "@/components/anim/fade-rise"
import { cn } from "@/lib/utils"

interface JourneyProps {
  items: JourneyItem[]
}

export function Journey({ items }: JourneyProps) {
  return (
    <section className="py-16 md:py-24">
      <FadeRise>
        {/* Section header */}
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
          Experience
        </p>
        <h2 className="text-3xl font-semibold tracking-tight mb-12">
          Where I&apos;ve worked
        </h2>

        {/* Timeline */}
        <div className="relative">
          {items.map((item, i) => (
            <div
              key={`${item.company}-${item.start}`}
              className={cn(
                "grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 md:gap-8",
                i < items.length - 1
                  ? "border-b border-border pb-8 mb-8"
                  : undefined
              )}
            >
              {/* Left column: company, role, dates */}
              <div>
                <p className="font-semibold text-foreground">{item.company}</p>
                <p className="text-sm text-foreground/80 mt-0.5">{item.role}</p>
                <p className="font-mono text-xs text-muted-foreground mt-2">
                  {item.start} – {item.end ?? "Present"}
                </p>
              </div>

              {/* Right column: summary + tags */}
              <div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.summary}
                </p>
                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
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
