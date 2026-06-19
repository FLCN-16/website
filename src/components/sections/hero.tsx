import { Button } from "@/components/ui/button"
import { TrackedLink } from "@/components/site/tracked-link"
import { FadeRise } from "@/components/anim/fade-rise"
import { MaskReveal } from "@/components/anim/mask-reveal"
import { CountUp } from "@/components/anim/count-up"
import { cn } from "@/lib/utils"

export function parseAccentLine(text: string): Array<{ text: string; accent: boolean }> {
  const parts: Array<{ text: string; accent: boolean }> = []
  const regex = /\*\*(.+?)\*\*/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, match.index), accent: false })
    }
    parts.push({ text: match[1], accent: true })
    lastIndex = regex.lastIndex
  }
  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), accent: false })
  }
  return parts
}

interface StatCellProps {
  stat: { value: string; label: string }
  index: number
}

// Each of the 4 stats has distinct border needs across 2-col (base/md) and 4-col (lg+)
function StatCell({ stat, index: i }: StatCellProps) {
  return (
    <div
      className={cn(
        "py-5 px-5",
        // First item in each column has no left padding
        i === 0 && "pl-0",
        i === 2 && "pl-0 lg:pl-5",
        // Left borders
        i === 1 && "border-l border-border",
        i === 2 && "lg:border-l lg:border-border",
        i === 3 && "border-l border-border",
        // Second row top border on 2-col (base + md); removed at 4-col (lg)
        i >= 2 && "border-t border-border lg:border-t-0",
      )}
    >
      <div className="text-3xl md:text-4xl font-mono font-bold text-foreground tabular-nums">
        <CountUp value={stat.value} />
      </div>
      <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mt-1.5">
        {stat.label}
      </p>
    </div>
  )
}

interface HeroProps {
  eyebrow: string
  headline: string
  subheadline: string
  status: { available: boolean; label: string }
  stats: Array<{ value: string; label: string }>
  primaryCta: { label: string; href: string }
  secondaryCta: { label: string; href: string }
}

export function Hero({
  eyebrow,
  headline,
  subheadline,
  status,
  stats,
  primaryCta,
  secondaryCta,
}: HeroProps) {
  return (
    <section id="hero" className="pt-6 pb-16 md:pt-8 md:pb-20 lg:pb-24">
      <FadeRise>
        {/* Top bar — eyebrow + status */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-border">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {eyebrow}
          </p>
          {status.available && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/8 px-3 py-1 font-mono text-xs text-emerald-600 dark:text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {status.label}
            </span>
          )}
        </div>

        {/* Headline — each \n becomes its own animated line */}
        <div className="mt-8 md:mt-10">
          <MaskReveal
            as="h1"
            className="text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-tight leading-[1.1] text-balance"
          >
            {headline.split("\n").map((line) => (
              <span key={line} className="block overflow-hidden">
                <span className="mask-line block">{line}</span>
              </span>
            ))}
          </MaskReveal>
        </div>

        {/* Subheadline + CTAs row */}
        <div className="mt-8 md:mt-10 flex flex-col lg:flex-row lg:items-end gap-6 lg:gap-16">
          <p className="text-lg text-muted-foreground leading-relaxed lg:max-w-xl">
            {subheadline}
          </p>
          <div className="flex flex-wrap gap-3 lg:ml-auto lg:shrink-0">
            <Button asChild variant="default" size="lg">
              <TrackedLink
                href={primaryCta.href}
                event={{ event: 'cta_click', cta_label: primaryCta.label, cta_location: 'hero', destination: primaryCta.href }}
              >
                {primaryCta.label}
              </TrackedLink>
            </Button>
            <Button asChild variant="outline" size="lg">
              <TrackedLink
                href={secondaryCta.href}
                event={{ event: 'cta_click', cta_label: secondaryCta.label, cta_location: 'hero', destination: secondaryCta.href }}
              >
                {secondaryCta.label}
              </TrackedLink>
            </Button>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-12 md:mt-14 lg:mt-16 grid grid-cols-2 lg:grid-cols-4 border-t border-b border-border">
          {stats.map((stat, i) => (
            <StatCell key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </FadeRise>
    </section>
  )
}
