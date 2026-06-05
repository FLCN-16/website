import type { Metadata } from "next";
import Link from "next/link";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ErrorState } from "@/components/site/error-state";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";
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

export const metadata: Metadata = {
  title: `Not Found — ${site.name}`,
  robots: { index: false, follow: false },
};

export default function NotFound() {
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
