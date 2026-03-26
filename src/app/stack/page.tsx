import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { createMetadata } from "@/lib/metadata";

import StackPageHeader from "./_components/stack-page-header";

const StackPhilosophySection = dynamic(() => import("./_components/stack-philosophy-section"));
const StackInfrastructureSection = dynamic(
  () => import("./_components/stack-infrastructure-section"),
);
const StackFrontendSection = dynamic(() => import("./_components/stack-frontend-section"));
const StackVisualizationSection = dynamic(
  () => import("./_components/stack-visualization-section"),
);
const StackMatrixSection = dynamic(() => import("./_components/stack-matrix-section"));
const StackCtaSection = dynamic(() => import("./_components/stack-cta-section"));

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
