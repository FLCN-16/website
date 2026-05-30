import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import "../globals.css";
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { SiteFrame } from "@/components/site/site-frame";
import { Toaster } from "@/components/ui/sonner";
import { SplashScreen } from "@/components/site/splash-screen";
import { TalentInquiryDialog } from "@/components/site/talent-inquiry-dialog";
import { site } from "@/content/site";
import type { Form } from "@payloadcms/plugin-form-builder/types";

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
  description: site.description,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: site.name,
    title: `${site.name} — ${site.role}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    creator: `@${site.handle}`,
    title: `${site.name} — ${site.role}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const getCachedTalentForm = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'forms',
      where: { slug: { equals: 'talent-inquiry' } },
      limit: 1,
      depth: 0,
    })
    return (result.docs[0] as unknown as Form) ?? null
  },
  ['talent-form'],
  { tags: ['talent-form'], revalidate: false }
)

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  let talentForm: Form | null = null

  try {
    talentForm = await getCachedTalentForm()
  } catch {
    // CMS unreachable — proceed without dialog
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
        <NextTopLoader color="var(--primary)" height={3} showSpinner={false} />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SplashScreen />
          {talentForm && <TalentInquiryDialog form={talentForm} />}
          <QueryProvider>
            <SiteFrame>{children}</SiteFrame>
          </QueryProvider>
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
