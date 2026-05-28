import { getPayload } from "payload";
import config from "@payload-config";
import { site } from "@/content/site";

export const dynamic = "force-dynamic";

async function getMessage(): Promise<string> {
  try {
    const payload = await getPayload({ config });
    const settings = await payload.findGlobal({ slug: "site-settings" });
    const mm = settings.maintenanceMode as { message?: string | null } | null | undefined;
    return mm?.message || "We're doing some work on the site. We'll be back shortly.";
  } catch {
    return "We're doing some work on the site. We'll be back shortly.";
  }
}

export default async function MaintenancePage() {
  const message = await getMessage();

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

        {/* Status pill — same style as rail.tsx */}
        <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border px-2.5 py-1">
          <span className="text-primary text-xs leading-none motion-safe:animate-pulse">●</span>
          <span className="font-mono text-xs text-muted-foreground">UNDER MAINTENANCE</span>
        </div>

        {/* Message */}
        <p className="font-sans text-sm text-muted-foreground leading-relaxed">
          {message}
        </p>

        {/* Footer note */}
        <span className="font-mono text-xs text-muted-foreground/60">
          Check back soon.
        </span>
      </div>
    </main>
  );
}
