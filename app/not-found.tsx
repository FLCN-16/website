import Link from "next/link";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ErrorState } from "@/components/site/error-state";
import { Button } from "@/components/ui/button";
import { getCachedSiteSettings } from "@/lib/data";
import { buildIdentity } from "@/lib/site-identity";
import "./globals.css";

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

export async function generateMetadata() {
  const settings = await getCachedSiteSettings().catch(() => null);
  const identity = buildIdentity(settings);
  return {
    title: `Not Found — ${identity.name}`,
    robots: { index: false, follow: false },
  };
}

export default async function NotFound() {
  const settings = await getCachedSiteSettings().catch(() => null);
  const identity = buildIdentity(settings);

  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
            <ErrorState
              code="404"
              label="NOT FOUND"
              tone="muted"
              title="Page not found"
              message="The page you're looking for doesn't exist or has been moved."
              showIdentity
              showLinks
              siteName={identity.name}
              actions={
                <Button asChild>
                  <Link href="/">Back home</Link>
                </Button>
              }
            />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
