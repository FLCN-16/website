import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";

import { GoogleTagManager } from "@next/third-parties/google";

import { getExperienceLabel } from "@/lib/utils";

import Footer from "../components/Footer";
import Header from "../components/Header";
import Preloader from "../components/Preloader";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "The Falcon",
    template: "%s | The Falcon",
  },
  description: `Full-Stack Technical Lead with ${getExperienceLabel()} shipping production web, mobile, and browser apps end-to-end. Builder of agentic AI systems and merged Next.js contributor. Open to new roles.`,
  metadataBase: new URL("https://thefalcon.dev"),
  authors: [{ name: "Rishabh Kumar", url: "https://thefalcon.dev" }],
  creator: "Rishabh Kumar",
  applicationName: "The Falcon — Rishabh Kumar",
  keywords: [
    "Rishabh Kumar",
    "The Falcon",
    "Full-Stack Technical Lead",
    "React developer",
    "Next.js developer",
    "Node.js developer",
    "TypeScript developer",
    "Flutter developer",
    "LangChain",
    "Agentic AI developer",
    "Chrome extension developer",
    "Next.js open source contributor",
    "technical lead India",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      {process.env.NEXT_PUBLIC_GTM_ID && (
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "Person",
              "@id": "https://thefalcon.dev/#person",
              name: "Rishabh Kumar",
              alternateName: "The Falcon",
              url: "https://thefalcon.dev",
              email: "me@thefalcon.dev",
              jobTitle: "Full-Stack Technical Lead",
              description:
                "Full-Stack Technical Lead with 9+ years building production web, mobile, and browser-based applications. React, Next.js, Node.js, TypeScript, Flutter, Python, and Agentic AI developer. Merged contributor to vercel/next.js.",
              sameAs: [
                "https://github.com/FLCN-16",
                "https://linkedin.com/in/rishabh-kumar-flcn16",
              ],
              address: {
                "@type": "PostalAddress",
                addressLocality: "Jalandhar",
                addressRegion: "Punjab",
                addressCountry: "IN",
              },
              contactPoint: {
                "@type": "ContactPoint",
                email: "me@thefalcon.dev",
                contactType: "Hiring",
                availableLanguage: ["English", "Hindi"],
              },
              knowsAbout: [
                "React",
                "Next.js",
                "Node.js",
                "TypeScript",
                "Nest.js",
                "Python",
                "Flutter",
                "Docker",
                "LangChain",
                "Agentic AI",
                "Chrome Extensions",
                "System Design",
                "API Design",
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "The Falcon",
              url: "https://thefalcon.dev",
              author: {
                "@type": "Person",
                name: "Rishabh Kumar",
              },
              description:
                "Personal portfolio and engineering log of Rishabh Kumar — Full-Stack Technical Lead, Next.js contributor, and Agentic AI developer.",
            },
          ]),
        }}
      />
      <body className="flex min-h-full flex-col bg-surface font-body text-on-surface">
        <Preloader />
        <Header />
        <main className="flex min-h-screen flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
