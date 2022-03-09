/** @type {import('next').NextConfig} */

const is_producation =
  (process.env.VERCEL == '1'
    ? process.env.VERCEL_ENV
    : process.env.NODE_ENV) === 'production';

async function redirects() {
  const redirects = [];

  if (is_producation) {
    redirects.push({
      source: '/',
      destination: 'https://linkedin.com/in/flcn-16',
      permanent: false,
      basePath: false,
    });
  }

  return redirects;
}

const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['tsx', 'ts'],
  compiler: {
    // ssr and displayName are configured by default
    styledComponents: true,
  },
  i18n: {
    locales: ['en-US', 'ru', 'fr'],
    defaultLocale: 'en-US',
  },
  trailingSlash: true,
  redirects,
};

module.exports = nextConfig;
