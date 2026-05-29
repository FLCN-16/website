import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import { site } from "@/content/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Under Maintenance",
  description: `${site.name}'s site is temporarily under maintenance. Check back soon.`,
  robots: { index: false, follow: false },
};

export default async function MaintenancePage() {
  let enabled = true
  let message = "We're doing some work on the site. We'll be back shortly."

  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({ slug: "site-settings" })
    const mm = settings.maintenanceMode as { enabled?: boolean | null; message?: string | null } | null | undefined
    enabled = mm?.enabled ?? true
    message = mm?.message || message
  } catch {
    // CMS unreachable — assume maintenance is active
  }

  if (!enabled) redirect("/")

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
  )
}
