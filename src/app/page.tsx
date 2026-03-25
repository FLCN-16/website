import type { Metadata } from "next";

import HeroHeader from "./_components/hero-header";
import PhilosophySection from "./_components/philosophy-section";
import JourneySection from "./_components/journey-section";

export const metadata: Metadata = {
  title: "About | The Falcon",
  description: "",
};

function AboutPage() {
  return (
    <>
      <HeroHeader />
      <PhilosophySection />
      <JourneySection />
    </>
  );
}

export default AboutPage;
