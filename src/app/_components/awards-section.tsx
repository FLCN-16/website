"use client";

import { useEffect, useRef } from "react";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { cn } from "@/lib/utils";

interface Award {
  id: string;
  title: string;
  issuer: string;
  year: string;
  description: string;
  featured?: boolean;
}

const awards: Award[] = [
  {
    id: "AWD-01",
    title: "Production Quality Assurance",
    issuer: "DigiMantra Labs",
    year: "2022",
    description:
      "Significantly reduced production deployment issues by implementing comprehensive testing protocols and quality assurance frameworks, ensuring stable and reliable software releases.",
  },
  {
    id: "AWD-02",
    title: "Technical Leadership Excellence",
    issuer: "DigiMantra Labs",
    year: "2022",
    description:
      "Led cross-functional technical teams to deliver substantial performance improvements across multiple high-impact projects, driving operational efficiency and system optimization.",
    featured: true,
  },
  {
    id: "AWD-03",
    title: "High-Performance Architecture Design",
    issuer: "DigiMantra Labs",
    year: "2022",
    description:
      "Architected and implemented scalable solutions capable of supporting high-traffic applications with thousands of concurrent users, maintaining optimal performance under heavy load.",
  },
];

function AwardCard({ id, title, issuer, year, description, featured = false }: Award) {
  return (
    <div
      className={cn(
        "flex flex-col gap-8 bg-surface p-8",
        featured && "bg-primary text-on-primary sm:-my-6",
      )}
    >
      <span
        className={cn(
          "font-mono text-label-sm tracking-label text-outline",
          featured && "text-surface-highest/60",
        )}
      >
        {id}
      </span>

      <div className="flex flex-col gap-4">
        <h3
          className={cn(
            "font-headline text-title-md font-bold text-primary",
            featured && "text-on-primary",
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "font-body text-body-md text-primary-container",
            featured && "text-surface-highest",
          )}
        >
          {description}
        </p>
      </div>

      <div
        className={cn(
          "mt-auto font-mono text-label-sm tracking-label text-outline",
          featured && "text-surface-highest/60",
        )}
      >
        {issuer} · {year}
      </div>
    </div>
  );
}

export default function AwardsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from("[data-awards-heading]", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
        y: 26,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from("[data-award-card]", {
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

  return (
    <section ref={sectionRef} className="w-full bg-surface-container">
      <div className="mx-auto max-w-screen-xl px-8 py-16">
        <div data-awards-heading className="mb-12">
          <h2 className="font-headline text-display-md font-bold tracking-tight text-primary">
            Awards &amp; Honors
          </h2>
          <div className="mt-4 h-2 w-16 bg-primary" />
        </div>

        <div className="grid grid-cols-1 items-stretch sm:grid-cols-3 sm:items-center">
          {awards.map((award) => (
            <div key={award.id} data-award-card>
              <AwardCard {...award} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
