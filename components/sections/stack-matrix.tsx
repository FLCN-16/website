import { cn } from "@/lib/utils"

interface StackMatrixProps {
  disciplines: Array<{
    name: string
    tools: Array<{ name: string; maturity: "expert" | "proficient" | "learning" }>
  }>
}

const MATURITY_DOTS: Record<"expert" | "proficient" | "learning", [boolean, boolean, boolean]> = {
  expert: [true, true, true],
  proficient: [true, true, false],
  learning: [true, false, false],
}

function MaturityDots({ maturity }: { maturity: "expert" | "proficient" | "learning" }) {
  const dots = MATURITY_DOTS[maturity]
  return (
    <span className="font-mono text-xs tracking-widest" aria-label={maturity}>
      {dots.map((filled, i) => (
        <span
          key={i}
          className={cn(filled ? "text-primary" : "text-muted-foreground")}
        >
          {filled ? "●" : "○"}
        </span>
      ))}
    </span>
  )
}

export function StackMatrix({ disciplines }: StackMatrixProps) {
  return (
    <div className="py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {disciplines.map((discipline) => (
          <div
            key={discipline.name}
            className="bg-card border border-border rounded-lg p-4"
          >
            <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
              {discipline.name}
            </h3>
            <div>
              {discipline.tools.map((tool, toolIndex) => (
                <div
                  key={tool.name}
                  className={cn(
                    "flex items-center justify-between py-2",
                    toolIndex !== discipline.tools.length - 1 && "border-b border-border"
                  )}
                >
                  <span className="font-mono text-xs">{tool.name}</span>
                  <MaturityDots maturity={tool.maturity} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
