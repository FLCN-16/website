import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `Not Found — ${site.name}`,
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm flex flex-col gap-6">
        {/* Identity */}
        <div className="flex flex-col gap-1">
          <span className="font-sans font-semibold text-sm text-foreground">
            {site.name}
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            {site.role}
          </span>
        </div>

        {/* Status pill */}
        <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border px-2.5 py-1">
          <span className="text-destructive text-xs leading-none motion-safe:animate-pulse">●</span>
          <span className="font-mono text-xs text-muted-foreground">404 NOT FOUND</span>
        </div>

        {/* Message */}
        <p className="font-sans text-sm text-muted-foreground leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>

        {/* Back link */}
        <Link
          href="/"
          className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back home
        </Link>
      </div>
    </main>
  );
}
