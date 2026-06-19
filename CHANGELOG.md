# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.3.0] - 2026-06-19

### Fixed

- **Featured card line-clamp** — `line-clamp-2` (title) and `line-clamp-3` (excerpt) now render correctly on the no-cover featured card variant; both elements were direct flex children, causing browser blockification to override the `-webkit-box` display required by line-clamp. Wrapped each in a `<div>` to absorb the flex-item role.
- **Featured card excerpt on cover overlay** — `line-clamp-3` on the cover-image overlay excerpt was broken at `md+` because `hidden md:block` and `line-clamp-3` shared the same element; `display: block` overwrote `display: -webkit-box`. Split into a wrapper `<div className="hidden md:block">` and an inner `<p className="line-clamp-3">`.
- **React code-quality diagnostics** (6 issues resolved via React Doctor scan):
  - `parseAccentLine` helper extracted from `hero.tsx` into `src/lib/parse-accent-line.ts` to satisfy `only-export-components` and preserve Fast Refresh
  - `SiteIdentityProvider` upgraded from `useContext` to React 19 `use()` hook
  - Array index key collision in hero accent segments replaced with stable `${segIdx}-${seg.text}` key
  - `section-tracker.tsx` empty `useEffect` deps array documented with `oxlint-disable-next-line` and justification (intentionally mount-only; re-subscribing would double-count `section_view` analytics events)
  - `notFound()` in `writing/[slug]/page.tsx` `generateMetadata` moved outside the `try/catch` block so it is not swallowed (fixes `nextjs-no-redirect-in-try-catch`)
  - `<a href="/writing">` on the homepage replaced with `<Link>` (fixes `nextjs-no-a-element`)

### Performance

- **Parallelized data fetches** — eight routes that awaited Payload queries sequentially now use `Promise.all`; page render time drops from the sum of all queries to the slowest single query on cold cache:
  - `/work`, `/projects` — work entries + site settings
  - `/work/[slug]` — all work entries + site settings
  - `/page/[slug]` — page content + site settings
  - `/legal/[slug]` — legal page content + site settings
  - `feed.xml` — site settings + posts
  - `sitemap-index.xml` — site settings inside existing `Promise.all`
  - `llms.txt` — site settings inside existing `Promise.all`
- **HTTP CDN caching headers** added to three high-traffic public routes:
  - `feed.xml`, `sitemap-index.xml`, `llms.txt` — `Cache-Control: public, s-maxage=900, stale-while-revalidate=3600`
  - `/fonts/:path*` — `Cache-Control: public, max-age=31536000, immutable` (via `next.config.ts` `headers()`)
- **Media CDN preconnect** — `<link rel="preconnect">` and `<link rel="dns-prefetch">` for the Cloudflare R2 media host injected in the site layout, shaving one round-trip from every above-fold image request

---

## [1.2.0] - 2026-06-16

### Added

- **Granular cookie consent with geo-gating** — rebuilt consent system:
  - Four-category schema: Necessary (always on), Functional, Analytics, Marketing — stored in `flcn-consent-v2` (localStorage)
  - Inline "Customize" panel expands the banner to reveal per-category `Switch` toggles; actions are **Accept All / Reject All / Save Choices**
  - Banner auto-shows only in consent-required regions (EU/EEA, UK, Switzerland — 31 countries); opt-out model (Analytics + Functional on by default) everywhere else
  - Geo-gate implemented via `flcn-consent-required` middleware cookie set in `proxy.ts` — avoids opt-ing the entire `(site)` route tree into dynamic rendering
  - Google Consent Mode v2 hybrid: region-scoped `gtag('consent','default', { region: [...] })` for tag defaults (resolved server-side by Google, no cache impact) + client-side cookie read for banner visibility
  - All 7 Consent Mode v2 signals wired: `ad_storage` / `ad_user_data` / `ad_personalization` (Marketing), `analytics_storage` (Analytics), `functionality_storage` / `personalization_storage` (Functional), `security_storage` (always granted)
  - v1→v2 migration shim in `readConsent()` and the inline layout script — returning users keep their analytics choice without re-seeing the banner
  - Anonymous/Tor traffic (`XX`, `T1`, `A1`, `ZZ` geo codes) treated as consent-required (fail-safe)
  - `src/lib/consent-regions.ts` — single source of truth for the country list, imported by both Edge middleware and the server layout
- **Blog post page enhancements:**
  - PostNav (previous / next post links) at the bottom of each post
  - Related posts swiper populated from matching tags
  - Breadcrumb navigation on post detail pages
  - Loading skeleton for the post route
  - Tag chips on post cards and post detail link to the filtered `/writing` listing
  - Tag chips added to the writing listing filter bar
- `getCachedRelatedPosts` and `getCachedAdjacentPosts` data fetchers with proper cache keys

### Changed

- Cookie Policy (CMS + `src/scripts/legal-content.ts`) updated to reflect new consent schema: four categories described, `flcn-consent-required` cookie disclosed, "How consent works" rewritten to explain the Customize flow, false "Advertising-related signals are never enabled" claim removed
- Related posts fetched client-side to exclude the heavy `body` field from listing queries
- `WritingListClient` uses a lazy `useState` initializer for URL-seeded search state (avoids re-running URL parse on every render)

### Fixed

- `isConsentRequiredCountry()` now correctly treats anonymous geo codes (`XX` etc.) as consent-required — previously returned `false` for these codes
- Keyboard navigation on post cards (regression from writing UI refactor)
- Systemic soft-404 on `/writing` listing; redirect added for renamed post slug
- Lazy-load applied to in-body images in richtext converter (was eager-loading all post body images)
- `_getCachedRelatedPosts` cache key now includes `postSlug` and `tags` to prevent cross-post cache collisions
- Toggle state consolidated into a single `useState<Record<CategoryId, boolean>>` record (fixes fragile per-field dispatch pattern)

---

## [1.1.0] - 2026-06-12

### Added

- **Advanced GA4 analytics** — code-driven event tracking via Google Tag Manager:
  - `section_view` — fires once per homepage section (hero, journey, philosophy, selected-work, projects, education, certifications, cta-banner) as it enters the viewport, using IntersectionObserver with a 0.3 threshold
  - `post_read_milestone` — fires at 25 / 50 / 75 / 100 % scroll depth on every blog post, keyed by post slug; emitted from `ReadingProgress` component
  - `SectionTracker` client component (`components/site/section-tracker.tsx`) — mounts on the homepage, fires `section_view` once per section per page load
  - `scroll_depth` and `nav_click` event types defined then removed — handled via GTM to avoid double-counting; deploy code before publishing GTM tags
- **Sitelinks Searchbox** — `SearchAction` JSON-LD added to the WebSite schema; writing page reads `?q=` from the URL on load so Google's deep-link resolves to filtered results
- **Posts tags → admin sidebar** — tags field moved from the Content tab to the admin sidebar for faster access while editing

### Changed

- `ReadingProgress` component now accepts an optional `slug` prop; passes it through to `post_read_milestone` events
- `WritingListClient` initialises search state from the `?q=` URL parameter on mount (wrapped in `<Suspense>` as required by Next.js for `useSearchParams`)
- All homepage section components have a stable `id` attribute added to their root `<section>` element

### Fixed

- SiteSettings global was empty after static content files were deleted — populated via seed script with all identity, socials, philosophy pillars, headline, subheadline, eyebrow, stats, and availability data

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
