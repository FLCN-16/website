import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import { redirect, unstable_rethrow } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import "../globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { SiteFrame } from "@/components/site/site-frame";
import { Toaster } from "@/components/ui/sonner";
import { site } from "@/content/site";

export const dynamic = "force-dynamic";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.subheadline,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: site.name,
    title: `${site.name} — ${site.role}`,
    description: site.subheadline,
  },
  twitter: {
    card: "summary_large_image",
    creator: `@${site.handle}`,
    title: `${site.name} — ${site.role}`,
    description: site.subheadline,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  try {
    const payload = await getPayload({ config });
    const settings = await payload.findGlobal({ slug: "site-settings" });
    const mm = settings.maintenanceMode as { enabled?: boolean | null } | null | undefined;
    if (mm?.enabled) {
      redirect("/maintenance");
    }
  } catch (err) {
    unstable_rethrow(err);
    // If CMS is unreachable, proceed normally — don't block the site
  }

  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      {process.env.NEXT_PUBLIC_GTM_ID && (
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
      )}
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <SiteFrame>{children}</SiteFrame>
          </QueryProvider>
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
