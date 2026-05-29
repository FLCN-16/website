import { Button } from "@/components/ui/button"
import { TrackedLink } from "@/components/site/tracked-link"
import { FadeRise } from "@/components/anim/fade-rise"
import { MaskReveal } from "@/components/anim/mask-reveal"
import { CountUp } from "@/components/anim/count-up"
import { cn } from "@/lib/utils"

interface StatCellProps {
  stat: { value: string; label: string }
  index: number
}

// Each of the 4 stats has distinct border needs across mobile (2-col) and desktop (4-col)
function StatCell({ stat, index: i }: StatCellProps) {
  return (
    <div
      className={cn(
        "py-5 px-5",
        // First item in each column on mobile has no left padding
        i === 0 && "pl-0",
        i === 2 && "pl-0 md:pl-5",
        // Left borders
        i === 1 && "border-l border-border",
        i === 2 && "md:border-l md:border-border",
        i === 3 && "border-l border-border",
        // Second row top border on mobile only
        i >= 2 && "border-t border-border md:border-t-0",
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
    <section className="pt-6 pb-16 md:pt-8 md:pb-24">
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
            className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.1]"
          >
            {headline.split("\n").map((line) => (
              <span key={line} className="block overflow-hidden">
                <span className="mask-line block">{line}</span>
              </span>
            ))}
          </MaskReveal>
        </div>

        {/* Subheadline + CTAs row */}
        <div className="mt-8 md:mt-10 flex flex-col md:flex-row md:items-end gap-6 md:gap-16">
          <p className="text-lg text-muted-foreground leading-relaxed md:max-w-xl">
            {subheadline}
          </p>
          <div className="flex flex-wrap gap-3 md:ml-auto md:shrink-0">
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
        <div className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 border-t border-b border-border">
          {stats.map((stat, i) => (
            <StatCell key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </FadeRise>
    </section>
  )
}
