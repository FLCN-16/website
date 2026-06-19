import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["194.36.85.25"],
  async redirects() {
    return [
      {
        source: "/writing/chatgpt-dreaming-v3-agent-memory",
        destination: "/writing/chatgpt-dreaming-v3-agent-memory-lessons",
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      { source: "/sitemap.xml", destination: "/sitemap-index.xml" },
    ]
  },
  async headers() {
    return [
      {
        source: '/fonts/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },
  images: {
    loaderFile: "./src/lib/cloudflare-image-loader.ts",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.thefalcon.dev",
      },
    ],
  },
};

export default withPayload(nextConfig);
