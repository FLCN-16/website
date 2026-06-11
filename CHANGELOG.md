# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.0.0] - 2026-06-11

### Added

- **SiteIdentity system** — new `lib/site-identity.ts` module with `SiteIdentity` type and `buildIdentity()` helper that merges CMS data with safe fallback defaults
- **SiteIdentityProvider** — React context provider (`components/providers/site-identity-provider.tsx`) and `useSiteIdentity()` hook for distributing identity to all client components
- **SiteSettings: Identity fields** — name, handle, role, location, timezone, email, siteUrl, description fields added to the Payload CMS `site-settings` global
- **SiteSettings: Social Links** — array field (up to 6 entries) with platform select, URL, and display label
- **SiteSettings: Engineering Philosophy** — array field (up to 5 pillars) with title and body; replaces the former static `content/philosophy.ts`
- **MCP access to site-settings global** — `@payloadcms/plugin-mcp` now exposes the `site-settings` global alongside all existing collections

### Changed

- All personal identity data (name, role, email, socials, philosophy) is now sourced from the Payload admin panel — no source code changes required to personalize the site
- `app/(site)/layout.tsx` uses `generateMetadata()` (async) instead of a static `metadata` export; identity is fetched from CMS
- `lib/metadata.ts` — `buildOgUrl()` and `createMetadata()` now accept a `SiteIdentity` parameter instead of importing from a static file
- `lib/structured-data.ts` — all exported functions (`personRef`, `personSchema`, `websiteSchema`, `breadcrumbSchema`) now accept `identity: SiteIdentity` as their first parameter; module-level `PERSON_ID`/`WEBSITE_ID` constants removed
- `components/site/site-frame.tsx` — simplified to a synchronous server component; identity flows via context instead of props
- `components/site/rail.tsx`, `mobile-header.tsx`, `footer.tsx`, `splash-screen.tsx` — use `useSiteIdentity()` hook; removed prop-based identity passing
- `components/writing/social-cta.tsx`, `post-share.tsx`, `components/sections/contact-form-section.tsx` — use `useSiteIdentity()` hook
- All page-level `generateMetadata()` functions, route handlers, server actions, and email utilities fetch identity from CMS via `getCachedSiteSettings()`
- `content/site.ts` — now type-only (exports `Social`, `StatusBadge`, `Stat` interfaces); all runtime data removed
- `content/philosophy.ts` — deleted; data moved to SiteSettings global
- `content/journey.ts` — deleted; data belongs in the Timeline collection
- `content/work.ts` — deleted; data belongs in the Work collection
- `resume.pdf` replaces `rishabh-kumar-resume.pdf` as the stored filename
- Package renamed from `flcn-website` to `payload-portfolio`
- README rewritten as a buyer-focused quick-start guide

### Fixed

- Vitest jsdom environment annotation added to provider component tests so they run correctly with `pnpm vitest run`
