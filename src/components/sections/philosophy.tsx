import { FadeRise } from "@/components/anim/fade-rise"

interface PhilosophyProps {
  eyebrow: string
  heading: string
  pillars: Array<{ title: string; body: string }>
}

export function Philosophy({ eyebrow, heading, pillars }: PhilosophyProps) {
  return (
    <section id="philosophy" className="py-16 md:py-20 lg:py-24">
      <FadeRise>
        {/* Section header */}
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
          {eyebrow}
        </p>
        <h2 className="text-3xl font-semibold tracking-tight">{heading}</h2>

        {/* Pillars grid */}
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {pillars.map((pillar, i) => (
            <div key={i}>
              <p className="font-mono text-4xl text-primary font-bold">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="text-lg font-semibold mt-3">{pillar.title}</h3>
              <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                {pillar.body}
              </p>
            </div>
          ))}
        </div>
      </FadeRise>
    </section>
  )
}
