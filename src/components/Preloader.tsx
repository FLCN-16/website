"use client";

import { useEffect, useRef } from "react";

import { gsap } from "gsap";

import Logo from "./Logo";

export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const progressTrackRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const logoWrap = logoWrapRef.current;
    const progressTrack = progressTrackRef.current;
    const progressFill = progressFillRef.current;
    const caption = captionRef.current;
    if (!root || !logoWrap || !progressTrack || !progressFill || !caption) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const paths = Array.from(root.querySelectorAll<SVGPathElement>(".falcon-logo-path"));
    const markComplete = () => {
      document.documentElement.dataset.preloader = "complete";
      sessionStorage.setItem("falcon-preloader-seen", "true");
      window.dispatchEvent(new CustomEvent("falcon:preloader-complete"));
    };
    const hasSeenPreloader = sessionStorage.getItem("falcon-preloader-seen") === "true";

    if (reduceMotion || hasSeenPreloader) {
      gsap.set(paths, { opacity: 1, strokeDasharray: "none", strokeDashoffset: 0, fillOpacity: 1 });
      gsap.set(root, { autoAlpha: 0, pointerEvents: "none", display: "none" });
      markComplete();
      return;
    }

    const onReady = () => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      tl.set(root, { pointerEvents: "auto" })
        .set(paths, {
          strokeDasharray: (_index, target) => target.getTotalLength(),
          strokeDashoffset: (_index, target) => target.getTotalLength(),
          fillOpacity: 0,
        })
        .set(progressFill, { scaleX: 0, transformOrigin: "left center" })
        .fromTo(
          logoWrap,
          { y: 24, opacity: 0, scale: 0.94 },
          { y: 0, opacity: 1, scale: 1, duration: 0.75 },
        )
        .fromTo(caption, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, "-=0.42")
        .fromTo(
          progressTrack,
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45 },
          "-=0.32",
        )
        .to(paths, {
          strokeDashoffset: 0,
          duration: 1.15,
          stagger: 0.12,
        })
        .to(
          progressFill,
          {
            scaleX: 1,
            duration: 1.05,
            ease: "power2.out",
          },
          "-=1.0",
        )
        .to(
          paths,
          {
            fillOpacity: 1,
            duration: 0.45,
            stagger: 0.08,
          },
          "-=0.45",
        )
        .to(
          logoWrap,
          {
            y: -24,
            opacity: 0,
            scale: 1.5,
            duration: 0.6,
            ease: "power2.in",
          },
          "+=0.2",
        )
        .to(
          [caption, progressTrack],
          {
            y: -10,
            opacity: 0,
            duration: 0.35,
          },
          "<",
        )
        .to(
          root,
          {
            yPercent: -100,
            duration: 0.85,
            ease: "power4.inOut",
          },
          "-=0.15",
        )
        .set(root, { autoAlpha: 0, pointerEvents: "none", display: "none" })
        .call(markComplete);
    };

    if (document.readyState === "complete") {
      onReady();
      return;
    }

    window.addEventListener("load", onReady, { once: true });
    return () => window.removeEventListener("load", onReady);
  }, []);

  return (
    <div
      ref={rootRef}
      className="z-preloader pointer-events-none fixed inset-0 flex select-none items-center justify-center overflow-hidden bg-surface text-primary"
    >
      <div className="bg-preloader-glow absolute inset-0" />
      <div className="bg-tech-grid absolute inset-0 opacity-40" />
      <div className="absolute inset-x-0 top-0 h-px bg-outline-variant/80" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-outline-variant/80" />

      <div
        ref={logoWrapRef}
        className="max-w-preloader-logo relative flex w-full flex-col items-center gap-06 px-06 opacity-0"
      >
        <Logo className="text-primary" pathClassName="fill-current" />
        <div className="flex flex-col items-center gap-03">
          <p className="font-headline text-title-md font-bold tracking-tight text-primary uppercase sm:text-title-lg">
            The Falcon
          </p>
          <p
            ref={captionRef}
            className="font-mono text-label-sm tracking-label text-nav-link opacity-0"
          >
            Preparing interface
          </p>
          <div
            ref={progressTrackRef}
            className="w-preloader-progress mt-02 flex items-center gap-03 opacity-0"
          >
            <div className="relative h-px flex-1 overflow-hidden bg-outline-variant">
              <div
                ref={progressFillRef}
                className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-primary-accent"
              />
            </div>
            <span className="font-mono text-label-sm tracking-label text-outline">Boot</span>
          </div>
        </div>
      </div>
    </div>
  );
}
