import { Rail } from "@/components/site/rail";
import { MobileHeader } from "@/components/site/mobile-header";
import { Footer } from "@/components/site/footer";
import { site } from "@/content/site";
import { getCachedSiteSettings } from "@/lib/data";

export async function SiteFrame({ children }: { children: React.ReactNode }) {
  let cmsStatus: { available: boolean; label: string } | undefined

  try {
    const settings = await getCachedSiteSettings()
    if (settings?.availability) {
      cmsStatus = {
        available: settings.availability.available ?? site.status.available,
        label: settings.availability.label ?? site.status.label,
      }
    }
  } catch {
    // CMS unreachable — fall back to site.ts
  }

  const status = cmsStatus ?? site.status

  return (
    <div className="flex min-h-screen">
      <Rail resumeUrl={site.resumeUrl} status={status} />
      <div className="flex flex-col flex-1 min-w-0 md:ml-[240px]">
        <MobileHeader resumeUrl={site.resumeUrl} status={status} />
        <main className="flex-1 px-6 py-12 md:px-12 md:py-16">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
