import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import { CookieConsent } from "@/components/site/cookie-consent";
import { CONSENT_KEY } from "@/lib/consent";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import "../globals.css";
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { SiteFrame } from "@/components/site/site-frame";
import { Toaster } from "@/components/ui/sonner";
import { getCachedSiteSettings } from '@/lib/data'
import { buildIdentity } from '@/lib/site-identity'
import { SiteIdentityProvider } from '@/components/providers/site-identity-provider'
import type { Form } from "@payloadcms/plugin-form-builder/types";
import { ClientOverlays } from "@/components/site/client-overlays";
import { JsonLd } from "@/components/structured-data/json-ld";
import { websiteSchema } from "@/lib/structured-data";

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

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedSiteSettings()
  const id = buildIdentity(settings)
  return {
    metadataBase: new URL(id.url),
    title: {
      default: `${id.name} — ${id.role}`,
      template: `%s — ${id.name}`,
    },
    description: id.description,
    authors: [{ name: id.name, url: id.url }],
    creator: id.name,
    alternates: {
      types: {
        'application/rss+xml': `${id.url}/feed.xml`,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: id.name,
      title: `${id.name} — ${id.role}`,
      description: id.description,
    },
    twitter: {
      card: 'summary_large_image',
      creator: `@${id.handle}`,
      title: `${id.name} — ${id.role}`,
      description: id.description,
    },
    robots: { index: true, follow: true },
  }
}

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
  const settings = await getCachedSiteSettings().catch(() => null)
  const identity = buildIdentity(settings)

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
        {/* Consent Mode v2 defaults must be set before GTM loads. A plain inline
            script as the first child of <body> runs during HTML parse — long before
            GTM, which @next/third-parties injects after hydration. (next/script
            beforeInteractive renders an invalid <script> child of <html> here.)
            Ad signals stay denied permanently (analytics-only site); only
            analytics_storage follows the stored choice. */}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <script
            id="gtag-consent-default"
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
(function () {
  var analytics = 'denied';
  try {
    var stored = JSON.parse(localStorage.getItem(${JSON.stringify(CONSENT_KEY)}));
    if (stored && stored.analytics === true) analytics = 'granted';
  } catch (e) {}
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: analytics
  });
})();`,
            }}
          />
        )}
        <JsonLd data={websiteSchema()} />
        <NextTopLoader color="var(--primary)" height={3} showSpinner={false} />
        <SiteIdentityProvider identity={identity}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ClientOverlays form={talentForm} />
            <QueryProvider>
              <SiteFrame>{children}</SiteFrame>
            </QueryProvider>
            <Toaster position="bottom-right" />
            <CookieConsent />
          </ThemeProvider>
        </SiteIdentityProvider>
      </body>
    </html>
  )
}
