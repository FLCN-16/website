import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["194.36.85.25"],
  async rewrites() {
    return [
      { source: "/sitemap.xml", destination: "/sitemap-index.xml" },
    ]
  },
  images: {
    loaderFile: "./lib/cloudflare-image-loader.ts",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.thefalcon.dev",
      },
    ],
  },
};

export default withPayload(nextConfig);
