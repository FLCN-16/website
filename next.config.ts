import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["194.36.85.25"],
  env: {
    NEXT_PUBLIC_MEDIA_URL: process.env.R2_PUBLIC_URL,
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
