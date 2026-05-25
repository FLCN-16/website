"use client";

import { useEffect, useRef } from "react";

import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { cn } from "@/lib/utils";

interface Contribution {
  id: string;
  title: string;
  repo: string;
  description: string;
  prUrl: string;
  prLabel: string;
  meta: string;
  featured?: boolean;
}

const contributions: Contribution[] = [
  {
    id: "OSS-01",
    title: "Merged Contributor — Next.js",
    repo: "vercel/next.js",
    description:
      "Authored and merged a fix to Next.js middleware error handling — invalid-URI requests previously returned HTTP 500 instead of 400. Resolved two open issues (#36964, #37025), passed 5 commits of review, merged into canary by maintainer @ijjk.",
    prUrl: "https://github.com/vercel/next.js/pull/36993",
    prLabel: "VIEW PR #36993",
    meta: "vercel/next.js · 139k+ stars · PR #36993",
    featured: true,
  },
];

function ContributionCard({
  id,
  title,
  description,
  prUrl,
  prLabel,
  meta,
  featured = false,
}: Contribution) {
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

      <div className="mt-auto flex items-end justify-between gap-4">
        <span
          className={cn(
            "font-mono text-label-sm tracking-label text-outline",
            featured && "text-surface-highest/60",
          )}
        >
          {meta}
        </span>
        <a
          href={prUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "duration-base inline-flex shrink-0 items-center gap-01 font-mono text-label-sm tracking-label transition-opacity hover:opacity-80",
            featured ? "text-on-primary" : "text-primary",
          )}
        >
          {prLabel}
          <ArrowUpRight size={12} />
        </a>
      </div>
    </div>
  );
}

export default function OssSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from("[data-oss-heading]", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
        y: 26,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from("[data-oss-card]", {
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
        <div data-oss-heading className="mb-12">
          <h2 className="font-headline text-display-md font-bold tracking-tight text-primary">
            Open Source
          </h2>
          <div className="mt-4 h-2 w-16 bg-primary" />
        </div>

        <div className="grid grid-cols-1 items-stretch sm:grid-cols-3 sm:items-center">
          {contributions.map((contribution) => (
            <div key={contribution.id} data-oss-card>
              <ContributionCard {...contribution} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
