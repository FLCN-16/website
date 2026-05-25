import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { createMetadata } from "@/lib/metadata";
import { getExperienceLabel } from "@/lib/utils";

import HeroHeader from "./_components/hero-header";

const StatsSection = dynamic(() => import("./_components/stats-section"));
const PhilosophySection = dynamic(() => import("./_components/philosophy-section"));
const JourneySection = dynamic(() => import("./_components/journey-section"));
const SelectedWorkSection = dynamic(() => import("./_components/selected-work-section"));
const OssSection = dynamic(() => import("./_components/oss-section"));
const AwardsSection = dynamic(() => import("./_components/awards-section"));
const CertificationsSection = dynamic(() => import("./_components/certifications-section"));
const EducationSection = dynamic(() => import("./_components/education-section"));
const CtaSection = dynamic(() => import("./_components/cta-section"));
const HiringModal = dynamic(() => import("@/components/HiringModal"));

export const metadata: Metadata = createMetadata({
  path: "/",
  description: `Full-Stack Technical Lead with ${getExperienceLabel()} shipping production web, mobile, and browser apps end-to-end. Builder of agentic AI systems and merged Next.js contributor. Open to new roles.`,
});

function AboutPage() {
  return (
    <>
      <HeroHeader />
      <StatsSection />
      <PhilosophySection />
      <JourneySection />
      <SelectedWorkSection />
      <OssSection />
      <AwardsSection />
      <CertificationsSection />
      <EducationSection />
      <CtaSection />
      <HiringModal />
    </>
  );
}

export default AboutPage;
