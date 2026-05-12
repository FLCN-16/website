"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Activity, BarChart2, Compass } from "lucide-react";

import { cn } from "@/lib/utils";

/* ── Types ── */

interface PhilosophyCardProps {
  icon: ReactNode;
  title: string;
  body: string;
  featured?: boolean;
  mobileIndex?: number;
}

/* ── Card ── */

function PhilosophyCard({ icon, title, body, featured = false }: PhilosophyCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-8 bg-surface p-8 text-primary",
        featured && "bg-primary text-on-primary sm:-my-6",
      )}
    >
      <span className={cn("text-primary", featured && "text-on-primary")}>{icon}</span>

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
          {body}
        </p>
      </div>
    </div>
  );
}

/* ── Data ── */

const cards: PhilosophyCardProps[] = [
  {
    icon: <Compass size={24} />,
    title: "Structural Integrity",
    body: "I prioritize clean, modular codebases that facilitate long-term maintenance over short-term feature speed.",
  },
  {
    icon: <Activity size={24} />,
    title: "Systems Thinking",
    body: "Software doesn't exist in a vacuum. I build ecosystems where frontend, backend, and infrastructure operate as a single machine.",
    featured: true,
  },
  {
    icon: <BarChart2 size={24} />,
    title: "Observability First",
    body: "You cannot manage what you cannot measure. Comprehensive telemetry is baked into every layer of my architecture.",
  },
];

/* ── Section ── */

function PhilosophySection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from("[data-philosophy-heading]", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
        },
        y: 26,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from("[data-philosophy-card]", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
        },
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
    <section ref={sectionRef} className="w-full bg-surface-container py-16">
      <div className="mx-auto max-w-screen-xl px-8">
        {/* Heading */}
        <div data-philosophy-heading className="mb-12">
          <h2 className="font-headline text-display-md font-bold tracking-tight text-primary">
            Engineering Philosophy
          </h2>
          <div className="mt-4 h-2 w-16 bg-primary" />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 items-stretch sm:grid-cols-3 sm:items-center">
          {cards.map((card, i) => (
            <div key={card.title} data-philosophy-card>
              <PhilosophyCard {...card} featured={card.featured} mobileIndex={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PhilosophySection;
