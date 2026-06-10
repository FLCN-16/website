import { Button } from "@/components/ui/button"
import { TrackedLink } from "@/components/site/tracked-link"
import { FadeRise } from "@/components/anim/fade-rise"

interface CtaBannerProps {
  eyebrow: string
  heading: string
  body: string
  primaryCta: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
}

export function CtaBanner({
  eyebrow,
  heading,
  body,
  primaryCta,
  secondaryCta,
}: CtaBannerProps) {
  return (
    <section className="py-20 md:py-24 lg:py-28 border-t border-border">
      <FadeRise>
        <div className="max-w-2xl mx-auto text-center">
          {/* Eyebrow */}
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {eyebrow}
          </p>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mt-3">
            {heading}
          </h2>

          {/* Body */}
          <p className="text-muted-foreground mt-4">{body}</p>

          {/* Buttons */}
          <div className="mt-8 flex gap-3 justify-center flex-wrap">
            <Button asChild variant="default" size="lg">
              <TrackedLink
                href={primaryCta.href}
                event={{ event: 'cta_click', cta_label: primaryCta.label, cta_location: 'cta_banner', destination: primaryCta.href }}
              >
                {primaryCta.label}
              </TrackedLink>
            </Button>
            {secondaryCta && (
              <Button asChild variant="outline" size="lg">
                <TrackedLink
                  href={secondaryCta.href}
                  event={{ event: 'cta_click', cta_label: secondaryCta.label, cta_location: 'cta_banner', destination: secondaryCta.href }}
                >
                  {secondaryCta.label}
                </TrackedLink>
              </Button>
            )}
          </div>
        </div>
      </FadeRise>
    </section>
  )
}
