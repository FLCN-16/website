import { Hero } from "@/components/sections/hero"
import { Journey } from "@/components/sections/journey"
import { Philosophy } from "@/components/sections/philosophy"
import { SelectedWork } from "@/components/sections/selected-work"
import { CtaBanner } from "@/components/sections/cta-banner"
import { site } from "@/content/site"
import { journey } from "@/content/journey"
import { philosophy } from "@/content/philosophy"
import { projects } from "@/content/work"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About",
  description: site.subheadline,
}

export default function Home() {
  return (
    <>
      <Hero
        eyebrow={site.eyebrow}
        headline={site.headline}
        subheadline={site.subheadline}
        status={site.status}
        stats={site.stats}
        primaryCta={{ label: "View My Work", href: "/work" }}
        secondaryCta={{ label: "Get In Touch", href: "/contact" }}
      />
      <Journey items={journey} />
      <Philosophy
        eyebrow={philosophy.eyebrow}
        heading={philosophy.heading}
        pillars={philosophy.pillars}
      />
      <SelectedWork projects={projects} showViewAll />
      <CtaBanner
        eyebrow="Let's work together"
        heading="Open to new opportunities"
        body="I'm selectively exploring senior frontend and tech-lead roles at product companies. If you're building something ambitious and care about craft, let's talk."
        primaryCta={{ label: "Get In Touch", href: "/contact" }}
        secondaryCta={{ label: "View My Stack", href: "/stack" }}
      />
    </>
  )
}
