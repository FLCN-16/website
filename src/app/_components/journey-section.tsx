"use client";

import { useEffect, useRef } from "react";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { cn } from "@/lib/utils";

/* ── Types ── */

interface Tag {
  label: string;
  featured?: boolean;
}

interface JourneyItem {
  role: string;
  company: string;
  period: string;
  description: string;
  tags: Tag[];
}

/* ── Data ── */

const journeyItems: JourneyItem[] = [
  {
    role: "Associate Technical Lead",
    company: "DigiMantra Innovations Pvt. Ltd.",
    period: "Feb 2022 — Present",
    description:
      "Lead full-stack architecture and delivery across 2–3 concurrent client engagements spanning React/Next.js, Node/Nest, and Python services with containerized deployments. Technically lead a team of 6 engineers, review 6–8 PRs weekly, and have ramped up 4–6 hires while mentoring 10+ junior and mid-level engineers across frontend, backend, and DevOps. Introduced LangChain-based internal tooling to accelerate code review and documentation.",
    tags: [
      { label: "LEADERSHIP", featured: true },
      { label: "MENTORING", featured: false },
      { label: "AI TOOLING", featured: false },
    ],
  },
  {
    role: "Senior Full Stack Web Developer",
    company: "Erosteps Pvt. Ltd.",
    period: "March 2017 — Feb 2022",
    description:
      "Shipped 8–10 production full-stack apps on Vue.js with Lumen and Node.js APIs — designed RESTful services, schemas, and server-side business logic. Integrated Stripe, PayPal, Razorpay, and WooCommerce for payments and commerce. Built Jenkins + Docker pipelines for auto-deploys, and shipped 2 cross-platform Flutter apps to the Google Play Store.",
    tags: [
      { label: "FULL STACK", featured: true },
      { label: "PAYMENTS", featured: false },
      { label: "MOBILE", featured: false },
    ],
  },
];

/* ── Tag Block ── */

function TagBlock({ label, featured = false }: Tag) {
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

/* ── Journey Entry ── */

function JourneyEntry({ role, company, period, description, tags }: JourneyItem) {
  return (
    <div className="flex flex-col gap-06 py-10">
      {/* Title row */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-08">
        <h3 className="font-headline text-xl font-bold text-primary lg:text-2xl">
          {role}&nbsp;—&nbsp;{company}
        </h3>
        <span className="font-mono text-label-sm tracking-label text-primary-container sm:shrink-0">
          {period}
        </span>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-outline-variant" />

      {/* Body + Tags row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-08">
        <p className="font-body text-body-md text-primary-container sm:max-w-lg">{description}</p>
        <div className="flex flex-wrap items-start gap-02 sm:max-w-sm sm:shrink-0 sm:justify-end">
          {tags.map((tag) => (
            <TagBlock key={tag.label} {...tag} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Section ── */

export default function JourneySection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from("[data-journey-heading]", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        y: 26,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from("[data-journey-entry]", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
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
    <section ref={sectionRef} className="w-full bg-surface">
      <div className="mx-auto max-w-screen-xl px-08 py-16">
        <div className="flex flex-col gap-08">
          {/* Left — sticky heading */}
          <div data-journey-heading className="pt-10">
            <h2 className="font-headline text-display-md font-bold tracking-tight text-primary">
              Professional Journey
            </h2>
            <div className="mt-4 h-2 w-16 bg-primary" />
          </div>

          {/* Right — timeline */}
          <div className="flex flex-col">
            {journeyItems.map((item) => (
              <div key={item.company} data-journey-entry>
                <JourneyEntry {...item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
