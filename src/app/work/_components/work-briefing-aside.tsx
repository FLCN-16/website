"use client";

import { useEffect, useRef } from "react";

import { gsap } from "gsap";

import type { WorkProject } from "./work-content";

function BriefingSection({
  title,
  children,
}: Readonly<{ title: string; children: React.ReactNode }>) {
  return (
    <section className="flex flex-col gap-03">
      <div className="flex items-center gap-02">
        <span className="h-px w-02 bg-primary" />
        <h3 className="font-mono text-label-sm text-outline">{title}</h3>
      </div>
      {children}
    </section>
  );
}

export default function WorkBriefingAside({ project }: Readonly<{ project: WorkProject }>) {
  const { briefing } = project;
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    const sections = contentRef.current.querySelectorAll<HTMLElement>("[data-animate]");
    gsap.fromTo(
      sections,
      { opacity: 0, y: 16 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
        stagger: 0.08,
        clearProps: "transform",
      },
    );
  }, [project.slug]);

  return (
    <aside className="flex flex-col gap-08 border-t border-outline-variant bg-surface-container px-06 py-08 [scrollbar-width:none] lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-t-0 lg:border-l [&::-webkit-scrollbar]:hidden">
      <div ref={contentRef} className="flex flex-col gap-08">
        <div data-animate className="flex items-center justify-between gap-04">
          <span className="bg-surface-highest px-03 py-02 font-mono text-label-sm text-primary">
            {briefing.badge}
          </span>
          <span className="font-mono text-label-sm text-outline">{briefing.identifier}</span>
        </div>

        <div data-animate className="flex flex-col gap-04">
          <h2 className="font-headline text-title-lg text-primary">{project.title}</h2>
          <div className="work-hero-media overflow-hidden bg-surface-highest">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={project.image} alt="" className="size-full object-cover grayscale" />
          </div>
        </div>

        <div className="flex flex-col gap-08">
          <div data-animate>
            <BriefingSection title="ARCHITECTURE DESCRIPTION">
              <div className="flex flex-col gap-01 font-body text-body-lg text-primary-container">
                {briefing.description.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </BriefingSection>
          </div>

          <div data-animate>
            <BriefingSection title="STRATEGIC IMPACT">
              <blockquote className="border-l-2 border-primary bg-surface-low px-05 py-04 font-body text-body-md font-medium text-primary">
                &quot;{briefing.impact}&quot;
              </blockquote>
            </BriefingSection>
          </div>

          <div data-animate>
            <BriefingSection title="INFRASTRUCTURE STACK">
              <div className="work-stack-grid gap-04">
                {briefing.stack.map((item) => (
                  <div key={item.label} className="border-t border-outline-variant pt-03">
                    <p className="font-mono text-label-sm text-outline">{item.label}</p>
                    <p className="pt-01 font-body text-body-md font-bold text-primary">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </BriefingSection>
          </div>
        </div>
      </div>
    </aside>
  );
}
