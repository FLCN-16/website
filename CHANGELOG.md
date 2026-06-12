# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.0.0] - 2026-06-11

### Added — CodeCanyon Productization

- **SiteIdentity system** — new `lib/site-identity.ts` module with `SiteIdentity` type and `buildIdentity()` helper that merges CMS data with safe fallback defaults
- **SiteIdentityProvider** — React context provider and `useSiteIdentity()` hook for distributing identity to all client components without prop drilling
- **SiteSettings: Identity fields** — name, handle, role, location, timezone, email, site URL, and meta description fields added to the Payload CMS `site-settings` global
- **SiteSettings: Social Links** — array field (up to 6 entries) with platform select, URL, and display label
- **SiteSettings: Engineering Philosophy** — array field (up to 5 pillars) with title and body; replaces the former static file
- **MCP access to site-settings global** — `@payloadcms/plugin-mcp` now exposes the `site-settings` global alongside all existing collections

### Changed — CodeCanyon Productization

- All personal identity data (name, role, email, socials, philosophy) is now sourced from the Payload admin panel — no source code changes required to personalize the site
- `lib/metadata.ts` — `buildOgUrl()` and `createMetadata()` now accept a `SiteIdentity` parameter
- `lib/structured-data.ts` — all exported functions accept `identity: SiteIdentity` as their first parameter; module-level URL constants removed
- All layout, page, route handler, server action, and email files fetch identity from CMS via `getCachedSiteSettings()` + `buildIdentity()`
- `content/site.ts` — now type-only (exports `Social`, `StatusBadge`, `Stat` interfaces only)
- `content/philosophy.ts` — deleted; data moved to SiteSettings global
- `content/journey.ts` and `content/work.ts` — deleted; data belongs in their respective Payload collections
- `resume.pdf` replaces the previous personal-name-prefixed filename
- Package renamed from `flcn-website` to `payload-portfolio`
- README rewritten as a buyer-focused quick-start guide

### Fixed

- Vitest jsdom environment annotation added to provider component tests

---

## [0.9.0] — Pre-release (Original Build)

This section documents all features present at the time of the 1.0.0 productization release.

### Portfolio Pages

- **Homepage** — hero with availability status badge, headline stats, featured work case studies, side projects, career timeline, education, certifications, engineering philosophy pillars, and contact CTA
- **Work listing** — grid of selected professional case studies with category and tag filters
- **Work detail** — individual case study page with problem statement, approach steps, business impact, client quote, and tech stack used
- **Projects listing** — gallery of side projects, Chrome extensions, mobile apps, and open-source contributions with live/repo links
- **Stack page** — tech stack breakdown by discipline (Backend, Frontend, Databases, DevOps, Mobile, AI, Architecture) with maturity levels; buyer-editable via `content/stack.ts`
- **Writing listing** — blog article index with masonry bento grid layout, tag chips, year filter, reading-time filter, and debounced full-text search
- **Writing detail** — individual blog post with rich-text body, code syntax highlighting, table of contents, reading progress bar, related posts carousel, and post share links
- **Contact page** — inquiry form supporting project, consulting, full-time role, and general inquiry types with honeypot bot protection
- **Legal pages** — Privacy Policy, Terms, Cookies Policy and other CMS-managed legal pages with last-updated timestamps
- **Custom pages** — basic and legal template pages created and managed entirely via the Payload admin

### CMS Collections (Payload CMS 3)

- **Posts** — blog articles with rich-text (Lexical), cover image, tags (multiselect chips), excerpt, featured flag, publish date, draft/published status, skip-newsletter flag, and auto-calculated reading time
- **Work** — professional projects with title, description, category, display order, tags, cover image, problem/approach/impact/quote briefing, and tech stack list
- **Projects** — side projects with subtitle, category, start/end dates, live URL, repo URL, tags, highlights, and featured flag
- **Timeline** — career history with company, role, start/end years, summary, tags, and display order
- **Education** — degrees with institution, degree name, location, years, GPA, and status (completed/ongoing/expected)
- **Certifications** — professional certifications with issuer, year, verification URL, and display order
- **Pages** — static pages using basic or legal templates with rich-text body and SEO metadata
- **Media** — image and document uploads stored in Cloudflare R2
- **Submissions** — contact form and inquiry submissions with read-only admin access

### CMS Globals

- **Site Settings** — availability status, maintenance mode toggle, hero headline/subheadline/eyebrow, stats array, resume PDF upload

### Email & Communication

- Contact form email — notification to owner and auto-reply to visitor on submission
- Talent inquiry dialog — appears after 15 seconds, collects email, pitch, and optional job description file; sends email notification with attachment
- Post broadcast — automatic newsletter email to Resend subscriber list when a new article is published; includes hero post and 3 recent articles
- Newsletter subscription — visitors can subscribe via CTA; unsubscribe link included in broadcasts

### SEO & Discovery

- Dynamic nested sitemap with sections for static pages, writing, work, and CMS pages
- RSS feed (`/feed.xml`) with post title, excerpt, author, and publish date
- `llms.txt` route (`/llms.txt`) — plain-text project summary for AI model context
- Open Graph image generation (`/og`) — dynamic PNG with title, kind label, and description in terminal-style design
- Web app manifest with PWA metadata
- `robots.txt` — allows major AI crawlers (Claude, Perplexity, GPT, Google Extended, Apple, Meta) while blocking admin/API
- JSON-LD structured data — Person, WebSite, CreativeWork, and BreadcrumbList schemas
- SEO plugin on Posts, Pages, Work, and Projects for per-document meta title, description, and OG image

### Analytics & Consent

- Google Tag Manager integration — tracks form submissions, file downloads (resume), CTA clicks, outbound links, dialog impressions, search queries, and filter interactions
- Cookie consent banner — Google Analytics opt-in/opt-out with persistent localStorage storage
- Consent Mode v2 — `gtag('consent', 'default', ...)` set before GTM loads; analytics_storage follows stored choice

### UI & Experience

- Dark / light theme toggle (next-themes) with system preference default
- Splash screen animation on first load
- Sidebar rail navigation with status badge, social links, and resume download
- Mobile hamburger menu with matching navigation and resume download
- Footer with social links, location, timezone, and copyright
- Top progress loader bar on page navigation
- Reading progress bar on blog posts
- Smooth scroll-triggered section animations
- Responsive layout — mobile-first Tailwind CSS 4

### Admin Panel

- Custom dashboard widgets — Content Overview, Recent Posts, Recent Submissions
- Live preview with breakpoints (mobile 375×667, tablet 768×1024, desktop 1440×900) for posts and pages
- Draft mode — preview unpublished content via secret preview route
- Resume upload field — PDF automatically renamed and stored at a fixed R2 key
- Form builder with enable/disable toggle for conditional submission storage
- Collections grouped by category in the sidebar (Portfolio, Writing, About, Site, System)

### Performance & Infrastructure

- Next.js 16 App Router with React Server Components throughout
- On-demand cache revalidation via Payload `afterChange`/`afterDelete` hooks and `revalidateTag`
- Centralized cached data fetchers (`getCachedPosts`, `getCachedWorkEntries`, etc.) using `unstable_cache`
- Cloudflare R2 (S3-compatible) media storage with custom Next.js image loader
- MongoDB via Mongoose adapter with connection pooling
- Payload Search plugin for full-text search across posts, work, and projects
- Resend email provider for all transactional and broadcast emails
- Zod validation on all form inputs
- React Email for HTML email templates
