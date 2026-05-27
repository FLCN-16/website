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
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="font-mono text-xs uppercase tracking-widest text-muted-foreground py-3 px-4 text-left">
              Discipline
            </th>
            <th className="font-mono text-xs uppercase tracking-widest text-muted-foreground py-3 px-4 text-left">
              Tool
            </th>
            <th className="font-mono text-xs uppercase tracking-widest text-muted-foreground py-3 px-4 text-left">
              Maturity
            </th>
          </tr>
        </thead>
        <tbody>
          {disciplines.map((discipline) =>
            discipline.tools.map((tool, toolIndex) => (
              <tr
                key={`${discipline.name}-${tool.name}`}
                className="border-b border-border"
              >
                <td className="font-mono text-xs py-3 px-4 align-top">
                  {toolIndex === 0 ? (
                    <span className="text-foreground">{discipline.name}</span>
                  ) : (
                    <span className="text-muted-foreground/30 select-none" aria-hidden>
                      {discipline.name}
                    </span>
                  )}
                </td>
                <td className="font-mono text-xs py-3 px-4">{tool.name}</td>
                <td className="font-mono text-xs py-3 px-4">
                  <MaturityDots maturity={tool.maturity} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
