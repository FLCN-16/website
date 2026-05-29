import { Rail } from "@/components/site/rail";
import { MobileHeader } from "@/components/site/mobile-header";
import { Footer } from "@/components/site/footer";
import { site } from "@/content/site";

export function SiteFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Rail resumeUrl={site.resumeUrl} />
      <div className="flex flex-col flex-1 md:ml-[240px]">
        <MobileHeader resumeUrl={site.resumeUrl} />
        <main className="flex-1 px-6 py-12 md:px-12 md:py-16">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
