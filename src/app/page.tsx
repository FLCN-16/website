import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { createMetadata } from "@/lib/metadata";
import { getExperienceLabel } from "@/lib/utils";

import HeroHeader from "./_components/hero-header";

const StatsSection = dynamic(() => import("./_components/stats-section"));
const PhilosophySection = dynamic(() => import("./_components/philosophy-section"));
const JourneySection = dynamic(() => import("./_components/journey-section"));
const SelectedWorkSection = dynamic(() => import("./_components/selected-work-section"));
const CtaSection = dynamic(() => import("./_components/cta-section"));
const HiringModal = dynamic(() => import("@/components/HiringModal"));

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
      <HiringModal />
    </>
  );
}

export default AboutPage;
