"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ErrorState } from "@/components/site/error-state";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function SiteError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[SiteError]", error.digest ?? error.message);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <ErrorState
        code="500"
        label="SERVER ERROR"
        tone="destructive"
        title="Something went wrong"
        message="An unexpected error occurred. You can try again or return home."
        actions={
          <>
            <Button onClick={reset}>Try again</Button>
            <Button asChild variant="outline">
              <Link href="/">Back home</Link>
            </Button>
          </>
        }
      />
      {error.digest && (
        <span className="mt-6 font-mono text-xs text-muted-foreground">
          REF: {error.digest}
        </span>
      )}
    </div>
  );
}
