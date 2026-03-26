import type { Metadata } from "next";

import { createMetadata } from "@/lib/metadata";

import StackCtaSection from "./_components/stack-cta-section";
import StackFrontendSection from "./_components/stack-frontend-section";
import StackInfrastructureSection from "./_components/stack-infrastructure-section";
import StackMatrixSection from "./_components/stack-matrix-section";
import StackPageHeader from "./_components/stack-page-header";
import StackPhilosophySection from "./_components/stack-philosophy-section";
import StackVisualizationSection from "./_components/stack-visualization-section";

export const metadata: Metadata = createMetadata({
  title: "Stack",
  path: "/stack",
  description:
    "Technical foundations, infrastructure choices, and engineering tooling behind The Falcon.",
});

function StackPage() {
  return (
    <section className="w-full bg-surface">
      <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-16 px-06 py-16 sm:px-08 lg:gap-32 lg:px-24 lg:py-32">
        <StackPageHeader />
        <div className="flex flex-col gap-16 lg:gap-32">
          <StackPhilosophySection />
          <StackInfrastructureSection />
          <StackFrontendSection />
          <StackVisualizationSection />
        </div>
        <StackMatrixSection />
        <StackCtaSection />
      </div>
    </section>
  );
}

export default StackPage;
