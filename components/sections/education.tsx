import type { EducationEntry } from "@/lib/types"
import { FadeRise } from "@/components/anim/fade-rise"
import { cn } from "@/lib/utils"

interface EducationProps {
  items: EducationEntry[]
}

const STATUS_CONFIG: Record<
  string,
  { label: string; pulse: boolean; color: string }
> = {
  completed: { label: "Completed", pulse: false, color: "text-muted-foreground/60" },
  ongoing: { label: "Ongoing", pulse: true, color: "text-primary/80" },
  expected: { label: "Expected", pulse: false, color: "text-muted-foreground/60" },
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, pulse: false, color: "text-muted-foreground/60" }
  return (
    <span className={cn("inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em]", cfg.color)}>
      {cfg.pulse ? (
        <span className="relative flex size-1.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
        </span>
      ) : (
        <span className="inline-flex size-1.5 rounded-full bg-current opacity-50 shrink-0" />
      )}
      {cfg.label}
    </span>
  )
}

function dateRange(item: EducationEntry) {
  if (item.start && item.end) return `${item.start} – ${item.end}`
  if (item.start) return `${item.start} – Present`
  return item.end ?? ""
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

        <div>
          {items.map((item, i) => (
            <div
              key={item.id}
              className={cn(
                "grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 md:gap-8",
                i < items.length - 1 && "border-b border-border pb-8 mb-8"
              )}
            >
              {/* Left: institution meta */}
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-foreground leading-snug">
                  {item.institution}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {[item.location, dateRange(item)].filter(Boolean).join(" · ")}
                </p>
                {item.status && (
                  <div className="mt-1.5">
                    <StatusBadge status={item.status} />
                  </div>
                )}
              </div>

              {/* Right: degree + gpa */}
              <div>
                <p className="text-base font-semibold leading-snug text-foreground">
                  {item.degree}
                </p>
                {item.gpa && (
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-2">
                    GPA · {item.gpa}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </FadeRise>
    </section>
  )
}
