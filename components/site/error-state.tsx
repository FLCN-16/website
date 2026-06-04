import Link from "next/link";
import { RECOVERY_LINKS } from "@/lib/navigation";
import { site } from "@/content/site";

interface ErrorStateProps {
  /** Large mono status code, e.g. "404" / "500". */
  code: string;
  /** Status-pill text, e.g. "NOT FOUND" / "SERVER ERROR". */
  label: string;
  /** Pill dot color. 404 → muted, 500 → destructive red. */
  tone?: "muted" | "destructive";
  title: string;
  message: string;
  /** Button(s) for recovery actions. */
  actions?: React.ReactNode;
  /** Render the "jump to" nav row (404s). */
  showLinks?: boolean;
  /** Render name + role header (standalone pages without the rail). */
  showIdentity?: boolean;
}

export function ErrorState({
  code,
  label,
  tone = "muted",
  title,
  message,
  actions,
  showLinks = false,
  showIdentity = false,
}: ErrorStateProps) {
  const dotClass = tone === "destructive" ? "text-destructive" : "text-muted-foreground";

  return (
    <div className="w-full max-w-lg flex flex-col gap-6 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:duration-500">
      {showIdentity && (
        <div className="flex flex-col gap-1">
          <span className="font-mono text-sm font-medium text-foreground">{site.name}</span>
          <span className="font-mono text-xs text-muted-foreground">{site.role}</span>
        </div>
      )}

      {/* Status pill — mirrors the rail's pill pattern */}
      <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border px-2.5 py-1">
        <span className={`${dotClass} text-xs leading-none motion-safe:animate-pulse`} aria-hidden="true">
          ●
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          {code} {label}
        </span>
      </div>

      {/* Large status code — the focal point */}
      <span className="font-mono font-semibold tabular-nums tracking-tight leading-none text-foreground text-7xl md:text-8xl">
        {code}
      </span>

      {/* Heading + message */}
      <div className="flex flex-col gap-2">
        <h1 className="font-sans font-semibold text-lg text-foreground">{title}</h1>
        <p className="font-sans text-sm text-muted-foreground leading-relaxed">{message}</p>
      </div>

      {/* Recovery actions */}
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}

      {/* "Jump to" nav row — reuses the rail's num + label styling */}
      {showLinks && (
        <div className="flex flex-col gap-3 pt-2">
          <span className="font-mono text-xs text-muted-foreground">Jump to</span>
          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            {RECOVERY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center gap-2 rounded-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <span className="font-mono text-xs text-muted-foreground">{link.num}</span>
                <span className="font-mono text-xs text-muted-foreground transition-colors group-hover:text-foreground">
                  <span className="inline-block motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5">
                    {link.label}
                  </span>
                </span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
