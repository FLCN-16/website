/* eslint-disable @next/next/no-img-element */
import SectionEyebrow from "./section-eyebrow";
import { infrastructureItems } from "./stack-content";

function InfrastructureCard({
  icon,
  title,
  description,
  level,
}: Readonly<{
  icon: string;
  title: string;
  description: string;
  level: number;
}>) {
  return (
    <article className="flex flex-col gap-04">
      <div className="flex items-center gap-03">
        <img src={icon} alt="" aria-hidden="true" className="size-4.5 shrink-0 object-contain" />
        <h3 className="font-headline text-title-md font-semibold text-primary">{title}</h3>
      </div>
      <p className="max-w-stack-card font-body text-body-md text-primary-container">
        {description}
      </p>
      <div className="h-1 w-full rounded-full bg-surface-low">
        <div className="h-full rounded-full bg-primary" style={{ width: `${level}%` }} />
      </div>
    </article>
  );
}

export default function StackInfrastructureSection() {
  return (
    <section className="flex flex-col gap-12 border-t border-outline-variant pt-12">
      <div className="flex flex-col gap-04">
        <SectionEyebrow>Section 02</SectionEyebrow>
        <h2 className="font-headline text-title-lg font-bold text-primary">Core Infrastructure</h2>
      </div>
      <div className="grid gap-x-16 gap-y-12 lg:grid-cols-2">
        {infrastructureItems.map((item) => (
          <InfrastructureCard key={item.title} {...item} />
        ))}
      </div>
    </section>
  );
}
