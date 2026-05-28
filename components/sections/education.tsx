import type { EducationEntry } from "@/lib/types"
import { FadeRise } from "@/components/anim/fade-rise"
import { cn } from "@/lib/utils"

interface EducationProps {
  items: EducationEntry[]
}

const STATUS_LABEL: Record<string, string> = {
  completed: "Completed",
  ongoing: "Ongoing",
  expected: "Expected",
}

export function Education({ items }: EducationProps) {
  if (!items.length) return null

  return (
    <section className="py-16 md:py-24">
      <FadeRise>
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
          Education
        </p>
        <h2 className="text-3xl font-semibold tracking-tight mb-12">
          Academic background
        </h2>

        <div className="relative">
          {items.map((item, i) => (
            <div
              key={item.id}
              className={cn(
                "grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 md:gap-8",
                i < items.length - 1
                  ? "border-b border-border pb-8 mb-8"
                  : undefined
              )}
            >
              <div>
                <p className="font-semibold text-foreground">{item.institution}</p>
                {item.location && (
                  <p className="text-sm text-foreground/80 mt-0.5">{item.location}</p>
                )}
                <p className="font-mono text-xs text-muted-foreground mt-2">
                  {item.start && item.end
                    ? `${item.start} – ${item.end}`
                    : item.start
                      ? `${item.start} – Present`
                      : item.end ?? ""}
                </p>
                {item.status && (
                  <p className="font-mono text-xs text-muted-foreground mt-1">
                    {STATUS_LABEL[item.status] ?? item.status}
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm text-foreground leading-relaxed">{item.degree}</p>
                {item.gpa && (
                  <p className="font-mono text-xs text-muted-foreground mt-2">{item.gpa}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </FadeRise>
    </section>
  )
}
