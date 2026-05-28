"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function SiteError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[SiteError]", error.digest ?? error.message);
  }, [error]);

  return (
    <div className="flex flex-col gap-8 max-w-lg">
      {/* Code */}
      <span className="font-mono text-xs text-muted-foreground">500</span>

      {/* Heading */}
      <div className="flex flex-col gap-2">
        <h1 className="font-sans font-semibold text-lg text-foreground">
          Something went wrong
        </h1>
        <p className="font-sans text-sm text-muted-foreground leading-relaxed">
          An unexpected error occurred. You can try again or return home.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={reset}
          className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Try again <span aria-hidden="true">↺</span>
        </button>
        <span className="text-border text-xs">·</span>
        <Link
          href="/"
          className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back home
        </Link>
      </div>
    </div>
  );
}
