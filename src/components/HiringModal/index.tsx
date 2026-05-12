"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";

import { gsap } from "gsap";
import { Loader2, Paperclip, X } from "lucide-react";

import { type HiringState, sendHiringEmail } from "@/actions/hiring";

const MODAL_DELAY_MS = 15000;
const STORAGE_KEY = "@falcon/hiring-modal-seen";

function SuccessMessage() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(
        ref.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.2)" },
      );
    }
  }, []);

  return (
    <div ref={ref} className="flex flex-col items-center justify-center py-8 text-center opacity-0">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="font-headline text-title-md font-bold text-primary">
        Received loud and clear
      </h2>
      <p className="mt-2 font-body text-body-md text-primary-muted">
        I'll review the details and get back to you shortly.
      </p>
    </div>
  );
}

export default function HiringModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasSeen, setHasSeen] = useState(true); // Default true to prevent hydration mismatch, effect sets false
  const [fileName, setFileName] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [state, formAction, isPending] = useActionState<HiringState, FormData>(sendHiringEmail, {});

  // Trigger modal after delay if not seen before
  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (seen) return;

    setHasSeen(false);

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, MODAL_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  // Entrance Animation
  useEffect(() => {
    if (isOpen && !isClosing && backdropRef.current && contentRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          backdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: "power2.out" },
        );
        gsap.fromTo(
          contentRef.current,
          { opacity: 0, scale: 0.95, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.2)", delay: 0.1 },
        );
      });
      return () => ctx.revert();
    }
  }, [isOpen, isClosing]);

  // Close on success
  useEffect(() => {
    if (state?.success) {
      setTimeout(() => handleClose(), 2500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.success]);

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);

    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        opacity: 0,
        scale: 0.95,
        y: 20,
        duration: 0.3,
        ease: "power2.in",
      });
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        delay: 0.1,
        onComplete: () => {
          setIsOpen(false);
          setIsClosing(false);
        },
      });
    });

    // We don't revert here because we want the exit animation to finish before unmount
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName(null);
    }
  };

  if (hasSeen || (!isOpen && !isClosing)) return null;

  return (
    <div
      ref={modalContainerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-6"
    >
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={handleClose}
        className="fixed inset-0 bg-surface/80 opacity-0 backdrop-blur-sm"
      />

      {/* Modal Container */}
      <div
        ref={contentRef}
        className="relative w-full max-w-lg origin-bottom overflow-hidden border border-outline bg-white p-6 opacity-0 shadow-2xl sm:p-8"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          disabled={isPending}
          className="absolute top-4 right-4 p-2 text-primary-muted transition-colors hover:bg-surface-low hover:text-primary disabled:opacity-50"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Content */}
        {state?.success ? (
          <SuccessMessage />
        ) : (
          <>
            <div className="mb-6 pr-8">
              <span className="mb-2 inline-block font-mono text-label-sm tracking-label text-primary-accent uppercase">
                Looking for talent?
              </span>
              <h2 className="font-headline text-title-md font-bold text-primary sm:text-[1.75rem]">
                Hiring or have an opportunity?
              </h2>
              <p className="mt-2 font-body text-body-md text-primary-muted">
                If you're building something that demands precision and are looking for a full-time
                Front-End Technical Lead, I'd love to hear about it.
                <span className="mt-2 block text-sm text-primary-muted/80">
                  <span className="font-semibold">Please note:</span> I am only open to considering
                  full-time opportunities (no freelance or contract work).
                </span>
              </p>
            </div>

            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                startTransition(() => {
                  formAction(formData);
                });
              }}
            >
              {/* Error State */}
              {state?.error && (
                <div className="border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  {state.error}
                </div>
              )}

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="hiring-email" className="font-mono text-label-sm uppercase">
                  Email address <span className="text-red-500">*</span>
                </label>
                <input
                  id="hiring-email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@company.com"
                  disabled={isPending}
                  className="border border-outline bg-surface px-4 py-3 font-body text-body-md text-primary transition-colors outline-none focus:border-primary disabled:opacity-50"
                />
              </div>

              {/* Job Description (Text) */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="hiring-jd" className="font-mono text-label-sm uppercase">
                  Job Description / Pitch
                </label>
                <textarea
                  id="hiring-jd"
                  name="jd"
                  rows={3}
                  placeholder="Brief overview of the role..."
                  disabled={isPending}
                  className="resize-y border border-outline bg-surface px-4 py-3 font-body text-body-md text-primary transition-colors outline-none focus:border-primary disabled:opacity-50"
                />
              </div>

              {/* File Upload */}
              <div className="flex flex-col gap-1.5">
                <span className="font-mono text-label-sm uppercase">Or Attach JD File</span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isPending}
                  className="flex w-full items-center justify-center gap-2 border border-dashed border-outline bg-surface-low px-4 py-4 text-primary transition-colors hover:border-primary hover:bg-surface disabled:opacity-50"
                >
                  <Paperclip size={18} className="text-primary-muted" />
                  <span className="font-mono text-label-sm">
                    {fileName ? fileName : "BROWSE_FILES"}
                  </span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  name="jdFile"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt"
                  disabled={isPending}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending}
                className="mt-2 flex w-full items-center justify-center gap-2 bg-primary px-6 py-4 font-headline text-label-md font-bold text-on-primary transition-opacity hover:opacity-90 disabled:opacity-75"
              >
                {isPending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    SENDING...
                  </>
                ) : (
                  "SEND DETAILS"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
