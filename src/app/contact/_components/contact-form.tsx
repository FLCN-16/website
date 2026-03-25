"use client";

import { cn } from "@/lib/utils";

/* ── Floating Label Field Wrapper ── */

function FieldWrapper({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative border border-[#D1D9E0] bg-surface", className)}>
      <span className="absolute -top-02 left-04 bg-surface px-02 font-mono text-label-sm tracking-label text-nav-link">
        {label}
      </span>
      {children}
    </div>
  );
}

/* ── Inquiry Options ── */

const inquiryOptions = [
  "System Architecture Design",
  "Technical Leadership Advisory",
  "Infrastructure Audit",
  "Engineering Team Scaling",
  "Other",
];

/* ── Form ── */

export default function ContactForm() {
  return (
    <form className="flex flex-col gap-08" action="#" method="POST">
      {/* Row — Name + Email */}
      <div className="grid grid-cols-2 gap-6">
        <FieldWrapper label="INPUT.NAME">
          <input
            type="text"
            name="name"
            placeholder="e.g. ALAN TURING"
            className={cn(
              "w-full bg-transparent px-4 py-4",
              "font-mono text-body-md text-primary",
              "placeholder:text-outline-variant",
              "focus:outline-none",
            )}
          />
        </FieldWrapper>

        <FieldWrapper label="INPUT.EMAIL">
          <input
            type="email"
            name="email"
            placeholder="turing@enigma.com"
            className={cn(
              "w-full bg-transparent px-4 py-4",
              "font-mono text-body-md text-primary",
              "placeholder:text-outline-variant",
              "focus:outline-none",
            )}
          />
        </FieldWrapper>
      </div>

      {/* Select — Inquiry Type */}
      <FieldWrapper label="SELECT.INQUIRY_TYPE">
        <select
          name="inquiry"
          defaultValue="System Architecture Design"
          className={cn(
            "w-full bg-transparent px-4 py-4 appearance-none cursor-pointer",
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
      <FieldWrapper label="TEXT.PROJECT_BRIEF">
        <textarea
          name="brief"
          rows={7}
          placeholder="Detailed structural challenges..."
          className={cn(
            "w-full bg-transparent px-4 py-4 resize-none",
            "font-mono text-body-md text-primary",
            "placeholder:text-outline-variant",
            "focus:outline-none",
          )}
        />
      </FieldWrapper>

      {/* Submit row */}
      <div className="flex items-center gap-06">
        <button
          type="submit"
          className={cn(
            "flex items-center gap-4 px-8 py-4 bg-dark-blue text-on-primary",
            "font-mono tracking-label cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-colors duration-base hover:bg-on-primary hover:text-dark-blue",
          )}
        >
          EXECUTE_SUBMISSION
          <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1.21154 10.5C0.866347 10.5 0.578126 10.3844 0.346876 10.1531C0.115625 9.92188 0 9.63366 0 9.28847V1.21154C0 0.866347 0.115625 0.578126 0.346876 0.346875C0.578126 0.115625 0.866347 0 1.21154 0H12.2885C12.6337 0 12.9219 0.115625 13.1531 0.346875C13.3844 0.578126 13.5 0.866347 13.5 1.21154V9.28847C13.5 9.63366 13.3844 9.92188 13.1531 10.1531C12.9219 10.3844 12.6337 10.5 12.2885 10.5H1.21154ZM1.21154 9.75H12.2885C12.4039 9.75 12.5096 9.70193 12.6058 9.60577C12.7019 9.50962 12.75 9.40385 12.75 9.28847V2.25H0.750005V9.28847C0.750005 9.40385 0.798081 9.50962 0.894234 9.60577C0.990388 9.70193 1.09616 9.75 1.21154 9.75ZM3.375 8.46635L2.85866 7.95L4.78991 6L2.83991 4.05L3.375 3.53366L5.84135 6L3.375 8.46635ZM7.125 8.62501V7.875H10.875V8.62501H7.125Z"
              fill="currentColor"
            />
          </svg>
        </button>

        {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
        <span className="font-mono text-label-sm tracking-label text-outline-variant">// VERIFY_DATA_INTEGRITY</span>
      </div>
    </form>
  );
}
