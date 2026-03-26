/* eslint-disable @next/next/no-img-element */
import SectionEyebrow from "./section-eyebrow";
import { PHILOSOPHY_ICON } from "./stack-content";

export default function StackPhilosophySection() {
  return (
    <section className="lg:grid-stack-split grid gap-12 border-t border-outline-variant pt-12 lg:gap-12">
      <div className="flex flex-col gap-04">
        <SectionEyebrow>Perspective 01</SectionEyebrow>
        <h2 className="font-headline text-title-lg font-bold text-primary">Philosophy</h2>
        <div className="pt-06">
          <SectionEyebrow>Systems Managed</SectionEyebrow>
          <p className="pt-02 font-headline text-stat-lg font-bold text-primary">140+</p>
        </div>
      </div>
      <div className="flex flex-col gap-08">
        <img
          src={PHILOSOPHY_ICON}
          alt=""
          aria-hidden="true"
          className="icon-philosophy object-contain"
        />
        <p className="max-w-stack-prose font-body text-body-lg font-light text-primary lg:text-title-md">
          Architecture should be boring. Use proven technologies that scale predictably and maintain
          technical integrity through rigid type safety and automated testing.
        </p>
      </div>
    </section>
  );
}
