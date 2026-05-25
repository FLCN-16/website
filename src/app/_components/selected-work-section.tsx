"use client";

import Link from "next/link";

import { useEffect, useRef } from "react";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, BarChart2, CreditCard, LayoutGrid, ScanLine, ShieldCheck, Smartphone } from "lucide-react";

import { workProjects } from "@/app/work/_components/work-content";
import { cn } from "@/lib/utils";

const iconMap = {
  payment: CreditCard,
  infrastructure: ScanLine,
  ai: BarChart2,
  extension: LayoutGrid,
  mobile: Smartphone,
  security: ShieldCheck,
};

export default function SelectedWorkSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from("[data-work-heading]", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
        y: 26,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from("[data-work-card]", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
        y: 36,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const featured = workProjects.slice(0, 3);

  return (
    <section ref={sectionRef} className="w-full bg-surface">
      <div className="mx-auto max-w-screen-xl px-8 py-16">
        {/* Heading row */}
        <div
          data-work-heading
          className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <h2 className="font-headline text-display-md font-bold tracking-tight text-primary">
              Selected Work
            </h2>
            <div className="mt-4 h-2 w-16 bg-primary" />
          </div>
          <Link
            href="/work"
            className="duration-base inline-flex items-center gap-2 self-start font-mono text-label-sm tracking-label text-primary-container uppercase transition-colors hover:text-primary sm:self-auto"
          >
            View all projects
            <ArrowRight size={12} />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-px bg-outline-variant sm:grid-cols-3">
          {featured.map((project) => {
            const ProjectIcon = iconMap[project.icon];
            return (
              <Link
                key={project.id}
                href={`/work/${project.slug}`}
                data-work-card
                className={cn(
                  "group duration-base flex flex-col justify-between gap-8 bg-surface p-8 transition-colors",
                  "hover:bg-surface-container",
                )}
              >
                {/* Top */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-label-sm tracking-label text-outline uppercase">
                      {project.domain} / {project.id}
                    </span>
                    <ProjectIcon size={16} className="text-outline" />
                  </div>

                  {/* Thumbnail */}
                  <div className="work-hero-media overflow-hidden bg-surface-container">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.image}
                      alt=""
                      className="duration-slow size-full object-cover grayscale transition-transform group-hover:scale-[1.02]"
                    />
                  </div>

                  <h3 className="font-headline text-title-md font-bold text-primary">
                    {project.title}
                  </h3>

                  <div className="flex flex-wrap gap-1">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border border-outline-variant px-1 py-px font-mono text-[0.6rem] leading-tight tracking-wide text-primary-container"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom CTA */}
                <span className="duration-base inline-flex items-center gap-1 font-mono text-label-sm tracking-label text-outline uppercase opacity-60 transition-opacity group-hover:opacity-100">
                  View briefing
                  <ArrowRight size={10} />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
