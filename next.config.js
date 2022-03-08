/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["tsx", "ts"],
  compiler: {
    // ssr and displayName are configured by default
    styledComponents: true,
  },
  i18n: {
    locales: ["en-US", "ru", "fr"],
    defaultLocale: "en-US",
  },
  trailingSlash: true,
};

module.exports = nextConfig;
