"use client";

import Image from "next/image";

import { useEffect, useMemo, useRef } from "react";

import { gsap } from "gsap";

import { getExperienceLabel } from "@/lib/utils";

function HeroHeader() {
  const sectionRef = useRef<HTMLElement>(null);
  const portraitFrameRef = useRef<HTMLDivElement>(null);
  const portraitImageRef = useRef<HTMLImageElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const pixelMaskRef = useRef<HTMLDivElement>(null);
  const pixelCells = useMemo(() => Array.from({ length: 72 }), []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const pixelBlocks = gsap.utils.toArray<HTMLElement>("[data-hero-pixel]");
      gsap.set("[data-hero-label]", { y: 18, opacity: 0 });
      gsap.set("[data-hero-body]", { y: 24, opacity: 0 });
      gsap.set("[data-hero-status]", { x: -20, y: 16, opacity: 0 });
      gsap.set("[data-hero-headline-line]", { opacity: 0, yPercent: 110 });
      gsap.set("[data-hero-portrait]", {
        x: 32,
        y: 20,
        opacity: 0,
        scale: 0.96,
        rotateY: -8,
      });
      gsap.set(pixelBlocks, { opacity: 1, scale: 1 });

      const playHeroIntro = () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.to("[data-hero-label]", { y: 0, opacity: 1, duration: 0.6 })
          .to(
            "[data-hero-headline-line]",
            { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.08 },
            "-=0.25",
          )
          .to("[data-hero-body]", { y: 0, opacity: 1, duration: 0.7 }, "-=0.45")
          .to(
            "[data-hero-portrait]",
            { x: 0, y: 0, opacity: 1, scale: 1, rotateY: 0, duration: 1 },
            "-=0.6",
          )
          .to(
            pixelBlocks,
            {
              opacity: 0,
              scale: 0,
              duration: 0.55,
              stagger: {
                each: 0.014,
                from: "random",
                grid: "auto",
              },
            },
            "-=0.72",
          )
          .set(pixelMaskRef.current, { display: "none" })
          .to("[data-hero-status]", { x: 0, y: 0, opacity: 1, duration: 0.7 }, "-=0.55");
      };

      if (document.documentElement.dataset.preloader === "complete") {
        playHeroIntro();
      } else {
        window.addEventListener("falcon:preloader-complete", playHeroIntro, {
          once: true,
        });
      }

      return () => {
        window.removeEventListener("falcon:preloader-complete", playHeroIntro);
      };
    }, sectionRef);

    const frame = portraitFrameRef.current;
    const image = portraitImageRef.current;
    const badge = badgeRef.current;
    if (!frame || !image || !badge) return () => ctx.revert();

    const rotateXTo = gsap.quickTo(frame, "rotationX", {
      duration: 0.5,
      ease: "power3.out",
    });
    const rotateYTo = gsap.quickTo(frame, "rotationY", {
      duration: 0.5,
      ease: "power3.out",
    });
    const imageXTo = gsap.quickTo(image, "x", {
      duration: 0.6,
      ease: "power3.out",
    });
    const imageYTo = gsap.quickTo(image, "y", {
      duration: 0.6,
      ease: "power3.out",
    });
    const badgeXTo = gsap.quickTo(badge, "x", {
      duration: 0.6,
      ease: "power3.out",
    });
    const badgeYTo = gsap.quickTo(badge, "y", {
      duration: 0.6,
      ease: "power3.out",
    });

    const handleMove = (event: PointerEvent) => {
      const bounds = frame.getBoundingClientRect();
      const px = (event.clientX - bounds.left) / bounds.width;
      const py = (event.clientY - bounds.top) / bounds.height;
      rotateYTo((px - 0.5) * 10);
      rotateXTo((0.5 - py) * 8);
      imageXTo((px - 0.5) * 16);
      imageYTo((py - 0.5) * 18);
      badgeXTo((px - 0.5) * -10);
      badgeYTo((py - 0.5) * -8);
    };

    const resetDepth = () => {
      rotateXTo(0);
      rotateYTo(0);
      imageXTo(0);
      imageYTo(0);
      badgeXTo(0);
      badgeYTo(0);
    };

    frame.addEventListener("pointermove", handleMove);
    frame.addEventListener("pointerleave", resetDepth);

    return () => {
      frame.removeEventListener("pointermove", handleMove);
      frame.removeEventListener("pointerleave", resetDepth);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="pointer-events-none mx-auto w-full max-w-screen-xl">
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr]">
        {/* ── Left — Text ── */}
        <div className="flex flex-col justify-between space-y-4 px-6 pt-10 pb-8 lg:px-8 lg:pt-12 lg:pb-16">
          {/* Top label */}
          <p
            data-hero-label
            className="font-mono text-label-sm tracking-label text-primary-container"
          >
            FRONTEND TECHNICAL LEAD // PRODUCT, PLATFORM, DELIVERY
          </p>

          {/* Headline */}
          <h1
            className="font-headline font-bold tracking-tight text-primary"
            style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)", lineHeight: 1.0 }}
          >
            <span data-hero-headline-line className="block overflow-hidden">
              <span className="block">Leading teams</span>
            </span>
            <span data-hero-headline-line className="block overflow-hidden">
              <span className="block">at scale,</span>
            </span>
            <span data-hero-headline-line className="block overflow-hidden">
              <span className="block">shipping with</span>
            </span>
            <span data-hero-headline-line className="block overflow-hidden">
              <span className="block">precision.</span>
            </span>
          </h1>

          {/* Body */}
          <p
            data-hero-body
            className="my-4 max-w-lg font-body text-body-md text-primary-container lg:my-6"
          >
            Front-End Technical Lead with {getExperienceLabel()} orchestrating cross-functional
            teams to deliver high-performance applications, optimize operations, and improve user
            engagement through transformative solutions. Open to new roles and open source
            collaboration.
          </p>
        </div>

        {/* ── Right — Portrait ── */}
        <div className="flex items-stretch justify-center px-6 pb-10 lg:px-0 lg:py-8 lg:pb-8">
          <div
            ref={portraitFrameRef}
            data-hero-portrait
            className="portrait-frame pointer-events-auto relative w-full max-w-xs bg-surface-highest lg:w-full lg:max-w-none"
            style={{ perspective: "1400px" }}
          >
            <Image
              src="/portrait.jpg"
              alt="The Falcon - Rishabh Kumar"
              ref={portraitImageRef}
              className="h-full w-full object-cover object-top grayscale will-change-transform"
              width={478.67}
              height={598.31}
              priority
            />
            <div
              ref={pixelMaskRef}
              className="pointer-events-none absolute inset-0 grid grid-cols-8 grid-rows-9 overflow-hidden"
              aria-hidden="true"
            >
              {pixelCells.map((_, index) => (
                <span key={index} data-hero-pixel className="pixel-cell bg-surface-highest" />
              ))}
            </div>

            {/* Status badge */}
            <div
              ref={badgeRef}
              data-hero-status
              className="absolute -bottom-2 -left-2 inline-flex flex-col items-start bg-primary px-05 py-04 will-change-transform"
            >
              <p className="mb-01 font-mono text-label-sm tracking-label text-outline">STATUS</p>
              <p className="font-body text-body-md leading-none font-medium whitespace-nowrap text-on-primary">
                OPEN TO NEW OPPORTUNITIES
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroHeader;
