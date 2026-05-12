import { cn } from "@/lib/utils";

import SectionEyebrow from "./section-eyebrow";
import { matrixRows } from "./stack-content";

function MaturityDots({ filledDots }: Readonly<{ filledDots: number }>) {
  return (
    <div className="gap-dot flex items-center justify-end">
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={index}
          className={cn(
            "size-dot rounded-full bg-surface-highest",
            index < filledDots && "bg-primary",
          )}
          aria-hidden="true"
        />
      ))}
      <span className="sr-only">{filledDots} out of 5 maturity</span>
    </div>
  );
}

export default function StackMatrixSection() {
  return (
    <section className="flex flex-col gap-12">
      <div className="flex items-center gap-04">
        <h2 className="shrink-0 font-headline text-title-lg font-bold text-primary">
          Technical Matrix
        </h2>
        <div className="h-px flex-1 bg-outline-variant" />
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-stack-table">
          <div className="grid-stack-matrix grid border-b-2 border-primary pb-06">
            <div className="px-px">
              <SectionEyebrow>Discipline</SectionEyebrow>
            </div>
            <div className="px-px">
              <SectionEyebrow>Standardized Tooling</SectionEyebrow>
            </div>
            <div className="px-px text-right">
              <SectionEyebrow>Maturity</SectionEyebrow>
            </div>
          </div>

          {matrixRows.map((row, index) => (
            <div
              key={row.discipline}
              className={cn(
                "grid-stack-matrix grid items-center gap-06 py-10",
                index !== 0 && "border-t border-surface-container",
              )}
            >
              <h3 className="font-headline text-title-md font-semibold text-primary">
                {row.discipline}
              </h3>
              <p className="font-body text-body-lg text-primary-container">{row.tooling}</p>
              <MaturityDots filledDots={row.filledDots} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
