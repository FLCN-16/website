"use client";

import { useEffect, useRef } from "react";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { cn } from "@/lib/utils";

interface Tag {
  label: string;
  featured?: boolean;
}

interface EducationEntry {
  qualification: string;
  institution: string;
  location: string;
  period: string;
  result?: string;
  tags: Tag[];
}

const educationEntries: EducationEntry[] = [
  {
    qualification: "Bachelor of Computer Application",
    institution: "Amity University Online",
    location: "Noida",
    period: "2024 — 2027",
    result: "GPA 8.31",
    tags: [
      { label: "IN PROGRESS", featured: true },
      { label: "ONLINE" },
      { label: "GPA 8.31" },
    ],
  },
  {
    qualification: "Web Designing and Development",
    institution: "GTB Computer Education",
    location: "Jalandhar, Punjab",
    period: "2016 — 2017",
    tags: [{ label: "CERTIFIED", featured: true }, { label: "FOUNDATION" }],
  },
  {
    qualification: "Senior Secondary",
    institution: "Punjab School Education Board",
    location: "Punjab",
    period: "2015 — 2016",
    tags: [{ label: "COMPLETED" }],
  },
];

function TagBadge({ label, featured = false }: Tag) {
  return (
    <span
      className={cn(
        "duration-base inline-flex items-center rounded-full border px-04 py-02 font-mono text-label-sm tracking-label transition-colors",
        featured
          ? "border-primary bg-primary text-on-primary"
          : "border-outline-variant bg-surface-container text-primary-container",
      )}
    >
      {label}
    </span>
  );
}

function EducationEntry({ qualification, institution, location, period, tags }: EducationEntry) {
  return (
    <div className="flex flex-col gap-06 py-10">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-08">
        <h3 className="font-headline text-xl font-bold text-primary lg:text-2xl">
          {qualification}&nbsp;—&nbsp;{institution}
        </h3>
        <span className="font-mono text-label-sm tracking-label text-primary-container sm:shrink-0">
          {period}
        </span>
      </div>

      <div className="h-px w-full bg-outline-variant" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-08">
        <p className="font-body text-body-md text-primary-container sm:max-w-lg">{location}</p>
        <div className="flex flex-wrap items-start gap-02 sm:max-w-sm sm:shrink-0 sm:justify-end">
          {tags.map((tag) => (
            <TagBadge key={tag.label} {...tag} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function EducationSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from("[data-edu-heading]", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        y: 26,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from("[data-edu-entry]", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        y: 40,
        opacity: 0,
        duration: 0.85,
        stagger: 0.14,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-surface-container">
      <div className="mx-auto max-w-screen-xl px-8 py-16">
        <div data-edu-heading className="pt-10">
          <h2 className="font-headline text-display-md font-bold tracking-tight text-primary">
            Education
          </h2>
          <div className="mt-4 h-2 w-16 bg-primary" />
        </div>

        <div className="flex flex-col">
          {educationEntries.map((entry) => (
            <div key={entry.institution} data-edu-entry>
              <EducationEntry {...entry} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
