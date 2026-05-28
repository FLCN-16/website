import type { CertificationEntry } from "@/lib/types"
import { FadeRise } from "@/components/anim/fade-rise"
import { HugeiconsIcon } from "@hugeicons/react"
import { LinkSquare01Icon } from "@hugeicons/core-free-icons"

interface CertificationsProps {
  items: CertificationEntry[]
}

export function Certifications({ items }: CertificationsProps) {
  if (!items.length) return null

  return (
    <section className="py-16 md:py-24">
      <FadeRise>
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
          Certifications
        </p>
        <h2 className="text-3xl font-semibold tracking-tight mb-12">
          Credentials
        </h2>

        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 border-b border-border pb-4 last:border-0 last:pb-0"
            >
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-medium text-foreground">{item.name}</p>
                <p className="font-mono text-xs text-muted-foreground">
                  {item.issuer} · {item.year}
                </p>
              </div>
              {item.credentialUrl && (
                <a
                  href={item.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Verify ${item.name}`}
                  className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                >
                  <HugeiconsIcon icon={LinkSquare01Icon} size={14} strokeWidth={1.5} />
                </a>
              )}
            </div>
          ))}
        </div>
      </FadeRise>
    </section>
  )
}
