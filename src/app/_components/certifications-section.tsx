"use client";

import { useEffect, useRef } from "react";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

interface Certification {
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

const certifications: Certification[] = [
  {
    title: "Mastering the System Design Interview",
    issuer: "Educative",
    date: "May 2025",
  },
  {
    title: "MongoDB Associate Developer",
    issuer: "MongoDB",
    date: "2025",
  },
  {
    title: "Legacy JavaScript Algorithms and Data Structures",
    issuer: "freeCodeCamp",
    date: "Jul 2023",
  },
];

export default function CertificationsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from("[data-cert-heading]", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
        y: 26,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from("[data-cert-row]", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
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
    <section ref={sectionRef} className="w-full bg-surface">
      <div className="mx-auto max-w-screen-xl px-8 py-16">
        <div data-cert-heading className="mb-12">
          <h2 className="font-headline text-display-md font-bold tracking-tight text-primary">
            Certifications
          </h2>
          <div className="mt-4 h-2 w-16 bg-primary" />
        </div>

        <div className="border-t border-outline-variant">
          {/* Header row */}
          <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 border-b border-outline-variant py-3 sm:grid-cols-[1fr_160px_100px_60px]">
            <span className="font-mono text-label-sm tracking-label text-outline uppercase">
              Credential
            </span>
            <span className="hidden font-mono text-label-sm tracking-label text-outline uppercase sm:block">
              Issuer
            </span>
            <span className="font-mono text-label-sm tracking-label text-outline uppercase">
              Date
            </span>
            <span className="font-mono text-label-sm tracking-label text-outline uppercase">
              Ref
            </span>
          </div>

          {certifications.map((cert) => (
            <div
              key={cert.title}
              data-cert-row
              className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 border-b border-outline-variant py-6 sm:grid-cols-[1fr_160px_100px_60px]"
            >
              <p className="font-headline text-title-sm font-bold text-primary">{cert.title}</p>
              <p className="hidden font-mono text-label-sm tracking-label text-primary-container sm:block">
                {cert.issuer}
              </p>
              <p className="font-mono text-label-sm tracking-label text-primary-container">
                {cert.date}
              </p>
              <div>
                {cert.credentialUrl ? (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="duration-base inline-flex items-center gap-1 font-mono text-label-sm tracking-label text-primary transition-opacity hover:opacity-70"
                    aria-label={`Verify ${cert.title} credential`}
                  >
                    <ArrowUpRight size={14} />
                  </a>
                ) : (
                  <span className="font-mono text-label-sm tracking-label text-outline">—</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
