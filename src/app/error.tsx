"use client";

import Link from "next/link";

import { useEffect } from "react";

import { LayoutGrid, Lock, RefreshCw, ShieldX } from "lucide-react";

import { cn } from "@/lib/utils";

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
    <div className="grid-error-layout mx-auto grid max-w-screen-xl items-start gap-16 py-24">
      {/* ── Left ── */}
      <div className="flex flex-col gap-06">
        {/* Status label */}
        <p className="font-mono text-label-sm tracking-label text-outline">
          STATUS_CODE_STABLE: FALSE
        </p>

        {/* 500 */}
        <h1
          className={cn(
            "font-headline leading-none font-black tracking-tighter text-primary",
            "text-9xl",
          )}
        >
          500
        </h1>

        {/* Underline */}
        <div className="h-02 w-16 bg-primary" />

        {/* Error title */}
        <div className="flex flex-col gap-01">
          <h2 className="font-mono text-title-md font-bold tracking-label text-red-800 uppercase">
            INTERNAL_SERVER_ERROR
          </h2>
          <p className="font-mono text-label-sm tracking-label text-outline">
            CRITICAL_FAILURE_DETECTED
          </p>
        </div>

        {/* Body — blockquote */}
        <div className="mt-02 border-l-2 border-dark-blue pl-06">
          <p className="font-body text-body-md text-primary-container">
            System diagnostic report indicates that the structural integrity of the request could
            not be maintained. The execution thread has been terminated to prevent data corruption.
          </p>
        </div>
      </div>

      {/* ── Right ── */}
      <div className="flex flex-col gap-04 font-mono">
        {/* Recovery options panel */}
        <div className="flex flex-col gap-04 bg-surface-container p-06">
          <p className="mb-02 font-mono text-label-sm tracking-label text-nav-link">
            SYSTEM RECOVERY OPTIONS
          </p>

          <button
            onClick={reset}
            className={cn(
              "flex w-full items-center justify-center gap-2 px-6 py-4",
              "duration-base bg-dark-blue text-on-primary transition-colors",
              "cursor-pointer hover:bg-dark-blue-container",
            )}
          >
            RETRY_OPERATION
            <RefreshCw size={16} />
          </button>

          <Link
            href="/contact"
            className={cn(
              "flex w-full items-center justify-center gap-02 px-06 py-04",
              "border border-outline-variant bg-surface text-label-sm tracking-label text-primary",
              "duration-base transition-colors hover:bg-surface-highest",
            )}
          >
            CONTACT_SYSTEM_ADMIN
            <Lock size={16} />
          </Link>
        </div>

        {/* Diagnostic meta panel */}
        <div className="flex flex-col gap-04 bg-surface-container p-06">
          <div className="mb-02 flex items-center gap-02 text-nav-link">
            <LayoutGrid size={14} />
            <p className="font-mono text-label-sm tracking-label">DIAGNOSTIC META</p>
          </div>

          <div className="grid grid-cols-2 gap-04">
            <div className="flex flex-col gap-01">
              <span className="font-mono text-label-sm tracking-label text-outline">
                ENVIRONMENT
              </span>
              <span className="inline-flex items-center gap-02 font-mono text-body-md text-primary">
                <ShieldX size={14} />
                PRODUCTION_ENV
              </span>
            </div>
            <div className="flex flex-col gap-01">
              <span className="font-mono text-label-sm tracking-label text-outline">NODE_ID</span>
              <span className="font-mono text-body-md text-primary">
                {error.digest ?? "X99-ALPHA-04"}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-01 border-t border-outline-variant pt-02">
            <span className="font-mono text-label-sm tracking-label text-outline">TIMESTAMP</span>
            <span className="font-mono text-body-md text-primary">{timestamp}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
