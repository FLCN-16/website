"use client";

import { useEffect, useRef } from "react";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { getCareerYears } from "@/lib/utils";

const stats = [
  { value: `${getCareerYears()}+`, label: "Years of experience" },
  { value: "40%", label: "Avg. performance gain" },
  { value: "35%", label: "Faster feature delivery" },
  { value: "20%", label: "Cost reduction achieved" },
];

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from("[data-stat-item]", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 82%" },
        y: 24,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-primary">
      <div className="mx-auto max-w-screen-xl px-8">
        <div className="grid grid-cols-2 divide-x divide-y divide-primary-container/20 lg:grid-cols-4 lg:divide-y-0">
          {stats.map((stat) => (
            <div key={stat.label} data-stat-item className="flex flex-col gap-2 px-8 py-10">
              <span className="font-headline text-stat-lg font-bold text-on-primary">
                {stat.value}
              </span>
              <span className="font-mono text-label-sm tracking-label text-outline uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
