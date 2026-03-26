import { cn } from "@/lib/utils";

import SectionEyebrow from "./section-eyebrow";
import { frontendItems } from "./stack-content";

function FrontendRow({
  label,
  level,
  active = false,
  badgeClassName,
}: Readonly<{
  label: string;
  level: string;
  active?: boolean;
  badgeClassName: string;
}>) {
  return (
    <div className="flex items-center justify-between gap-04 border-b border-outline-variant pb-06">
      <div className="flex items-center gap-03">
        <span className={cn("size-2 rounded-full bg-surface-highest", active && "bg-primary")} />
        <p
          className={cn(
            "font-headline text-title-md font-medium",
            active ? "text-primary" : "text-primary-container",
          )}
        >
          {label}
        </p>
      </div>
      <span
        className={cn(
          "badge-pill inline-flex justify-center font-mono text-label-sm uppercase",
          badgeClassName,
        )}
      >
        {level}
      </span>
    </div>
  );
}

export default function StackFrontendSection() {
  return (
    <section className="lg:grid-stack-split grid gap-12 border-t border-outline-variant pt-12 lg:gap-12">
      <div className="flex flex-col gap-04">
        <SectionEyebrow>Section 03</SectionEyebrow>
        <h2 className="font-headline text-title-lg font-bold text-primary">
          Frontend
          <br />
          Engineering
        </h2>
      </div>
      <div className="flex flex-col gap-04">
        {frontendItems.map((item) => (
          <FrontendRow key={item.label} {...item} />
        ))}
      </div>
    </section>
  );
}
