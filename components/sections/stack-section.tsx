import { Badge } from "@/components/ui/badge"
import { FadeRise } from "@/components/anim/fade-rise"
import { cn } from "@/lib/utils"

interface StackSectionProps {
  eyebrow: string
  heading: string
  intro: string
  bigStat?: { value: string; label: string }
  disciplines: Array<{
    name: string
    tools: Array<{ name: string; maturity: "expert" | "proficient" | "learning" }>
  }>
}

export function StackSection({
  eyebrow,
  heading,
  intro,
  bigStat,
  disciplines,
}: StackSectionProps) {
  return (
    <FadeRise>
      <section className="py-16 md:py-24">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {eyebrow}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight mt-2">{heading}</h1>

        <div className="mt-4 flex flex-wrap items-start gap-8">
          <p className="text-muted-foreground max-w-2xl leading-relaxed">{intro}</p>
          {bigStat && (
            <div className="flex flex-col gap-1 shrink-0">
              <span className="font-mono text-5xl font-bold text-foreground">
                {bigStat.value}
              </span>
              <span className="font-mono text-xs uppercase text-muted-foreground">
                {bigStat.label}
              </span>
            </div>
          )}
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-10">
          {disciplines.map((discipline) => (
            <div key={discipline.name}>
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
                {discipline.name}
              </p>
              <div className="flex flex-wrap gap-2">
                {discipline.tools.map((tool) => (
                  <Badge
                    key={tool.name}
                    variant="outline"
                    className={cn(
                      tool.maturity === "expert" && "border-primary/50 text-primary",
                      tool.maturity === "learning" && "opacity-60"
                    )}
                  >
                    {tool.name}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </FadeRise>
  )
}
