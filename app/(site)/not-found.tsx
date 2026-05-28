import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Not Found",
  robots: { index: false, follow: false },
};

export default function SiteNotFound() {
  return (
    <div className="flex flex-col gap-8 max-w-lg">
      {/* Code */}
      <span className="font-mono text-xs text-muted-foreground">404</span>

      {/* Heading */}
      <div className="flex flex-col gap-2">
        <h1 className="font-sans font-semibold text-lg text-foreground">
          Page not found
        </h1>
        <p className="font-sans text-sm text-muted-foreground leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>

      {/* Back link */}
      <Link
        href="/"
        className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        ← Back home
      </Link>
    </div>
  );
}
