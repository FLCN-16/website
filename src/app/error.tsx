"use client";

import { useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/* ── Icons ── */

function RetryIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 7 a5 5 0 1 0 1.5-3.5" />
      <path d="M2 3.5 L2 7 L5.5 7" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="6" width="8" height="6" rx="0" />
      <path d="M5 6 V4 a2 2 0 0 1 4 0 V6" />
    </svg>
  );
}

function DiagIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <rect x="1" y="1" width="4" height="4" />
      <rect x="7" y="1" width="4" height="4" />
      <rect x="1" y="7" width="4" height="4" />
      <rect x="7" y="7" width="4" height="4" />
    </svg>
  );
}

/* ── Props ── */

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/* ── Page ── */

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("[MONOLITH_OS] Internal fault:", error);
  }, [error]);

  const timestamp = new Date().toISOString();

  return (
    <div className="mx-auto max-w-screen-xl grid grid-cols-[1fr_24rem] gap-16 items-start py-24">
      {/* ── Left ── */}
      <div className="flex flex-col gap-06">
        {/* Status label */}
        <p className="font-mono text-label-sm tracking-label text-outline-variant">STATUS_CODE_STABLE: FALSE</p>

        {/* 500 */}
        <h1 className={cn("font-headline font-black tracking-tighter leading-none text-primary", "text-9xl")}>500</h1>

        {/* Underline */}
        <div className="w-16 h-02 bg-primary" />

        {/* Error title */}
        <div className="flex flex-col gap-01">
          <h2 className="font-mono text-title-md font-bold tracking-label text-red-800 uppercase">
            INTERNAL_SERVER_ERROR
          </h2>
          <p className="font-mono text-label-sm tracking-label text-outline-variant">CRITICAL_FAILURE_DETECTED</p>
        </div>

        {/* Body — blockquote */}
        <div className="border-l-2 border-dark-blue pl-06 mt-02">
          <p className="font-body text-body-md text-primary-container">
            System diagnostic report indicates that the structural integrity of the request could not be maintained. The
            execution thread has been terminated to prevent data corruption.
          </p>
        </div>
      </div>

      {/* ── Right ── */}
      <div className="flex flex-col gap-04 font-mono">
        {/* Recovery options panel */}
        <div className="bg-surface-container p-06 flex flex-col gap-04">
          <p className="font-mono text-label-sm tracking-label text-nav-link mb-02">SYSTEM RECOVERY OPTIONS</p>

          <button
            onClick={reset}
            className={cn(
              "w-full flex items-center justify-center gap-2 px-6 py-4",
              "bg-dark-blue text-on-primary transition-colors duration-base",
              "cursor-pointer hover:bg-dark-blue-container",
            )}
          >
            RETRY_OPERATION
            <RetryIcon />
          </button>

          <Link
            href="/contact"
            className={cn(
              "w-full flex items-center justify-center gap-02 px-06 py-04",
              "bg-surface border border-outline-variant text-primary text-label-sm tracking-label",
              "transition-colors duration-base hover:bg-surface-highest",
            )}
          >
            CONTACT_SYSTEM_ADMIN
            <LockIcon />
          </Link>
        </div>

        {/* Diagnostic meta panel */}
        <div className="bg-surface-container p-06 flex flex-col gap-04">
          <div className="flex items-center gap-02 text-nav-link mb-02">
            <DiagIcon />
            <p className="font-mono text-label-sm tracking-label">DIAGNOSTIC META</p>
          </div>

          <div className="grid grid-cols-2 gap-04">
            <div className="flex flex-col gap-01">
              <span className="font-mono text-label-sm tracking-label text-outline-variant">ENVIRONMENT</span>
              <span className="font-mono text-body-md text-primary">PRODUCTION_ENV</span>
            </div>
            <div className="flex flex-col gap-01">
              <span className="font-mono text-label-sm tracking-label text-outline-variant">NODE_ID</span>
              <span className="font-mono text-body-md text-primary">{error.digest ?? "X99-ALPHA-04"}</span>
            </div>
          </div>

          <div className="flex flex-col gap-01 pt-02 border-t border-outline-variant">
            <span className="font-mono text-label-sm tracking-label text-outline-variant">TIMESTAMP</span>
            <span className="font-mono text-body-md text-primary">{timestamp}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
