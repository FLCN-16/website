import type { Metadata } from "next";
import Link from "next/link";
import { ErrorState } from "@/components/site/error-state";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Not Found",
  robots: { index: false, follow: false },
};

export default function SiteNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col justify-center">
      <ErrorState
        code="404"
        label="NOT FOUND"
        tone="muted"
        title="Page not found"
        message="The page you're looking for doesn't exist or has been moved."
        showLinks
        actions={
          <Button asChild>
            <Link href="/">Back home</Link>
          </Button>
        }
      />
    </div>
  );
}
