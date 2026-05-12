/* eslint-disable @next/next/no-img-element */
import SectionEyebrow from "./section-eyebrow";
import { SYSTEM_DIAGRAM_IMAGE } from "./stack-content";

export default function StackVisualizationSection() {
  return (
    <section className="flex flex-col gap-08 border-t border-outline-variant pt-12">
      <div className="flex flex-col gap-03 lg:flex-row lg:items-end lg:justify-between">
        <h2 className="font-headline text-title-lg font-bold text-primary">
          System Design Visualization
        </h2>
        <SectionEyebrow>Case Study 01</SectionEyebrow>
      </div>
      <div className="stack-visual-ratio overflow-hidden bg-surface-container">
        <img
          src={SYSTEM_DIAGRAM_IMAGE}
          alt="Abstract architectural form representing system design visualization"
          className="h-full w-full object-cover opacity-60 grayscale"
        />
      </div>
    </section>
  );
}
