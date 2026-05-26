"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";

import { Send } from "lucide-react";

import { sendContactEmail } from "@/actions/contact";
import { cn } from "@/lib/utils";

/* ── Floating Label Field Wrapper ── */

function FieldWrapper({
  label,
  htmlFor,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative border border-outline-variant bg-surface-glass", className)}>
      <label
        htmlFor={htmlFor}
        className="absolute -top-02 left-04 bg-surface px-02 font-mono text-label-sm tracking-label text-nav-link"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

/* ── Inquiry Options ── */

const inquiryOptions = [
  "Front-End Technical Leadership",
  "System Architecture Design",
  "Technical Leadership",
  "Product Delivery Optimization",
  "Engineering Team Scaling",
  "Other",
];

/* ── Form ── */

export default function ContactForm() {
  const [state, action, pending] = useActionState(sendContactEmail, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => {
      action(formData);
    });
  };

  return (
    <form ref={formRef} className="flex flex-col gap-08" onSubmit={handleSubmit}>
      {/* Honeypot — bots fill this, humans don't */}
      <input
        name="company"
        type="text"
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
        autoComplete="off"
      />

      {/* Row — Name + Email */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FieldWrapper label="INPUT.NAME" htmlFor="contact-name">
          <input
            id="contact-name"
            type="text"
            name="name"
            placeholder="e.g. ALAN TURING"
            autoComplete="name"
            className={cn(
              "w-full bg-transparent px-4 py-4",
              "font-mono text-body-md text-primary",
              "placeholder:text-outline",
              "focus:outline-none",
            )}
            required
          />
        </FieldWrapper>

        <FieldWrapper label="INPUT.EMAIL" htmlFor="contact-email">
          <input
            id="contact-email"
            type="email"
            name="email"
            placeholder="turing@enigma.com"
            autoComplete="email"
            className={cn(
              "w-full bg-transparent px-4 py-4",
              "font-mono text-body-md text-primary",
              "placeholder:text-outline",
              "focus:outline-none",
            )}
            required
          />
        </FieldWrapper>
      </div>

      {/* Select — Inquiry Type */}
      <FieldWrapper label="SELECT.INQUIRY_TYPE" htmlFor="contact-inquiry">
        <select
          id="contact-inquiry"
          name="inquiry"
          defaultValue="System Architecture Design"
          autoComplete="off"
          className={cn(
            "w-full cursor-pointer appearance-none bg-transparent px-4 py-4",
            "font-mono text-body-md text-primary",
            "focus:outline-none",
          )}
        >
          {inquiryOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </FieldWrapper>

      {/* Textarea — Project Brief */}
      <FieldWrapper label="TEXT.PROJECT_BRIEF" htmlFor="contact-message">
        <textarea
          id="contact-message"
          name="message"
          rows={7}
          placeholder="Detailed structural challenges..."
          autoComplete="off"
          className={cn(
            "w-full resize-none bg-transparent px-4 py-4",
            "font-mono text-body-md text-primary",
            "placeholder:text-outline",
            "focus:outline-none",
          )}
          required
        />
      </FieldWrapper>

      {/* Submit row */}
      <div className="flex flex-col items-center gap-06 md:flex-row">
        <button
          type="submit"
          className={cn(
            "flex items-center gap-4 bg-dark-blue px-8 py-4 text-on-primary",
            "cursor-pointer font-mono tracking-label disabled:cursor-not-allowed disabled:opacity-50",
            "duration-base transition-colors hover:bg-on-primary hover:text-dark-blue",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
          disabled={pending}
        >
          {pending ? "EXECUTING..." : "EXECUTE_SUBMISSION"}
          <Send size={16} style={{ transform: "rotate(-18deg)" }} />
        </button>

        <output aria-live="polite" aria-atomic="true" className="contents">
          {state?.error ? (
            <span className="font-mono text-label-sm tracking-label text-[#ef4444]">
              ERR // {state.error.toUpperCase()}
            </span>
          ) : state?.success ? (
            <span className="font-mono text-label-sm tracking-label text-[#10b981]">
              SYS // TRANSMISSION_SUCCESSFUL
            </span>
          ) : (
            /* eslint-disable-next-line react/jsx-no-comment-textnodes */
            <span className="font-mono text-label-sm tracking-label text-nav-link">
              // VERIFY_DATA_INTEGRITY
            </span>
          )}
        </output>
      </div>
    </form>
  );
}
