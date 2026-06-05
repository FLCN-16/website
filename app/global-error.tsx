"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ErrorState } from "@/components/site/error-state";
import { Button } from "@/components/ui/button";
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

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[GlobalError]", error.digest ?? error.message);
  }, [error]);

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
              code="500"
              label="SERVER ERROR"
              tone="destructive"
              title="Something went wrong"
              message="An unexpected error occurred. You can try again or return home."
              showIdentity
              actions={
                <>
                  <Button onClick={reset}>Try again</Button>
                  <Button asChild variant="outline">
                    <Link href="/">Back home</Link>
                  </Button>
                </>
              }
            />
            {error.digest && (
              <span className="mt-6 font-mono text-xs text-muted-foreground">
                REF: {error.digest}
              </span>
            )}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
