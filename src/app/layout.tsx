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
  description: `Front-End Technical Lead with ${getExperienceLabel()} building high-performance applications. Open to new roles and open source collaboration.`,
  metadataBase: new URL("https://thefalcon.dev"),
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
      <body className="flex min-h-full flex-col bg-surface font-body text-on-surface select-none">
        <Preloader />
        <Header />
        <main className="flex min-h-screen flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
