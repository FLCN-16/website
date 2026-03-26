import type { Metadata } from "next";

import { createMetadata } from "@/lib/metadata";
import { getExperienceLabel } from "@/lib/utils";

import CtaSection from "./_components/cta-section";
import HeroHeader from "./_components/hero-header";
import JourneySection from "./_components/journey-section";
import PhilosophySection from "./_components/philosophy-section";
import SelectedWorkSection from "./_components/selected-work-section";
import StatsSection from "./_components/stats-section";

export const metadata: Metadata = createMetadata({
  path: "/",
  description: `Front-End Technical Lead with ${getExperienceLabel()} building high-performance applications. Open to new roles and open source collaboration.`,
});

function AboutPage() {
  return (
    <>
      <HeroHeader />
      <StatsSection />
      <PhilosophySection />
      <JourneySection />
      <SelectedWorkSection />
      <CtaSection />
    </>
  );
}

export default AboutPage;
