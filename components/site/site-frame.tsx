import { getPayload } from "payload";
import config from "@payload-config";
import { Rail } from "@/components/site/rail";
import { MobileHeader } from "@/components/site/mobile-header";
import { Footer } from "@/components/site/footer";
import { site } from "@/content/site";

export async function SiteFrame({ children }: { children: React.ReactNode }) {
  let resumeUrl = site.resumeUrl;

  try {
    const payload = await getPayload({ config });
    const settings = await payload.findGlobal({ slug: "site-settings", depth: 1 });
    const resume = settings.resume as { url?: string | null } | null | undefined;
    if (resume?.url) resumeUrl = resume.url;
  } catch {
    // fall back to static resumeUrl if CMS is unreachable
  }

  return (
    <div className="flex min-h-screen">
      <Rail resumeUrl={resumeUrl} />
      <div className="flex flex-col flex-1 md:ml-[240px]">
        <MobileHeader resumeUrl={resumeUrl} />
        <main className="flex-1 px-6 py-12 md:px-12 md:py-16">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
