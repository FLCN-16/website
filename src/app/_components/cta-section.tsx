"use client";

import Link from "next/link";

import { useEffect, useRef } from "react";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Download } from "lucide-react";

export default function CtaSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from("[data-cta-content]", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        y: 32,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-surface-container">
      <div className="mx-auto max-w-screen-xl px-8 py-20">
        <div
          data-cta-content
          className="flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between"
        >
          {/* Copy */}
          <div className="max-w-stack-cta-copy flex flex-col gap-4">
            <p className="font-mono text-label-sm tracking-label text-primary-container uppercase">
              Open to opportunities
            </p>
            <h2 className="font-headline text-display-md font-bold tracking-tight text-primary">
              Looking for the next challenge.
            </h2>
            <p className="font-body text-body-lg text-primary-container">
              I'm open to new full-time roles and love contributing to open source. If you're
              building something that demands precision, let's talk.
            </p>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 flex-col gap-3">
            <Link
              href="/contact"
              className="duration-base inline-flex items-center gap-3 bg-primary px-8 py-4 font-headline text-label-md font-bold tracking-tight text-on-primary transition-opacity hover:opacity-80"
            >
              Get in touch
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/work"
              className="duration-base inline-flex items-center gap-3 border border-primary px-8 py-4 font-headline text-label-md font-bold tracking-tight text-primary transition-colors hover:bg-surface-highest"
            >
              View my work
              <ArrowRight size={16} />
            </Link>
            <a
              href="/files/Rishabh Kumar's Resume.pdf"
              download="Rishabh_Kumar_Resume.pdf"
              className="duration-base inline-flex items-center gap-3 border border-outline px-8 py-4 font-headline text-label-md font-bold tracking-tight text-primary-container transition-colors hover:bg-surface-highest"
            >
              Download Résumé
              <Download size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
