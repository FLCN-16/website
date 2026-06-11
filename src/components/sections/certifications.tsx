import type { CertificationEntry } from "@/lib/types"
import { FadeRise } from "@/components/anim/fade-rise"
import { cn } from "@/lib/utils"

interface CertificationsProps {
  items: CertificationEntry[]
}

function CertRow({ item }: { item: CertificationEntry }) {
  const inner = (
    <div className={cn(
      "group flex items-center justify-between gap-4 py-4 border-b border-border/60 last:border-0",
      item.credentialUrl && "hover:bg-muted/25 -mx-6 px-6 md:-mx-12 md:px-12 transition-colors duration-150 cursor-pointer"
    )}>
      <div className="flex flex-col gap-0.5 min-w-0">
        <p className={cn(
          "text-sm font-medium text-foreground leading-snug transition-colors",
          item.credentialUrl && "group-hover:text-foreground"
        )}>
          {item.name}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {item.issuer}
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="font-mono text-[10px] text-muted-foreground/60 tabular-nums">
          {item.year}
        </span>
        {item.credentialUrl && (
          <span className="font-mono text-xs text-muted-foreground/40 group-hover:text-foreground transition-all duration-200 group-hover:translate-x-0.5">
            →
          </span>
        )}
      </div>
    </div>
  )

  if (item.credentialUrl) {
    return (
      <a href={item.credentialUrl} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    )
  }

  return inner
}

export function Certifications({ items }: CertificationsProps) {
  if (!items.length) return null

  return (
    <section className="py-16 md:py-20 lg:py-24">
      <FadeRise>
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
          Certifications
        </p>
        <h2 className="text-3xl font-semibold tracking-tight mb-12">
          Credentials
        </h2>

        <div className="border-t border-border">
          {items.map((item) => (
            <CertRow key={item.id} item={item} />
          ))}
        </div>
      </FadeRise>
    </section>
  )
}
