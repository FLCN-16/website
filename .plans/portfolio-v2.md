# Portfolio v2 — Rishabh Kumar (thefalcon.dev)

## Context

The owner is rebuilding their personal portfolio. v1 (currently live at thefalcon.dev) is a Next.js site with a strong "engineering document" aesthetic — uppercase mono everywhere, asymmetric grids, terminal flavor. Content is solid (9+ yr Frontend Technical Lead, 3 selected projects, journey, philosophy, stack) and will be reused; the look-and-feel will not.

The current repo (`website-v2` branch) has been wiped down to a fresh Next.js 16 + React 19 + Tailwind 4 + shadcn scaffold (style `radix-lyra`, baseColor `neutral`, iconLibrary `hugeicons`). All shadcn primitives are already installed under `components/ui/`. The default `app/page.tsx` and `app/layout.tsx` are placeholder. Nothing else exists.

v2 keeps the engineering personality where it earns its keep (rail, labels, code, stats) but rebuilds the shell as a minimal, modern, Inter-led site with a sticky left rail and tasteful GSAP. A Payload-backed Writing/Blog section is added — the v1 "View Technical Blog" CTA had nowhere to go.

## Locked decisions (from brainstorming)

| Topic | Decision |
|---|---|
| Sitemap | Home `/`, Work `/work` + `/work/[slug]`, Stack `/stack`, Writing `/writing` + `/writing/[slug]`, Contact `/contact`, Legal `/legal/privacy` + `/legal/terms` |
| Layout shape | Sticky left rail (180–220px) with numbered nav + identity; content scrolls on the right. On `< md` the rail becomes a top header with a sheet drawer. |
| Typography | JetBrains Mono for rail, eyebrows, labels, stats numbers, code, status pills. Inter for headlines and body prose. Loaded via `next/font/google` with `display: swap`. |
| Colors | shadcn defaults from `app/globals.css` — **no changes**. Primary stays the emerald `oklch(0.508 0.118 165.612)` in light / `oklch(0.432 0.095 166.913)` in dark. |
| Theme | `next-themes` with `system` default + manual toggle in the rail. Both light/dark tuned. |
| Animation | GSAP, tasteful: hero text reveals (line-mask), section fade+rise on `useInView`, stat count-up, hover micro-interactions. **No** ScrollTrigger pinning, parallax, magnetic cursors. |
| CMS | Payload CMS — **Writing/Blog only**. Static pages keep content in typed TS modules under `content/`. |
| DB | MongoDB Atlas via `@payloadcms/db-mongodb`. |
| Forms | `react-hook-form` + `zod` + server action → Resend (notify + sender confirmation) → `Submissions` collection in Payload as audit log. |
| Data fetching | `@tanstack/react-query` for the Writing index (search/tag filter, infinite scroll) and any future client-driven lists. Static page content stays RSC. |
| Hosting | Vercel. Payload runs in the same Next.js process. |

## Architecture overview

### Route structure (App Router)

```
app/
├── layout.tsx                 # Root: fonts, theme provider, query client, site frame
├── page.tsx                   # Home
├── globals.css                # shadcn vars (already in place — minimal additions)
├── work/
│   ├── page.tsx               # Index of selected work
│   └── [slug]/page.tsx        # Project briefing
├── stack/page.tsx
├── writing/
│   ├── page.tsx               # Blog index (Payload-backed)
│   └── [slug]/page.tsx        # Blog post (Payload-backed)
├── contact/page.tsx
├── legal/
│   ├── privacy/page.tsx
│   └── terms/page.tsx
├── opengraph-image.tsx        # OG image generator
├── robots.ts
├── sitemap.ts
├── not-found.tsx
└── (payload)/                 # Payload admin + API routes (Payload's own conventions)
    ├── admin/[[...segments]]/page.tsx
    ├── admin/[[...segments]]/not-found.tsx
    └── api/[...slug]/route.ts
```

### Global frame (`components/site/`)

- `site-frame.tsx` — server component, renders `<Rail/>` + `<main>` with the right scroll area. Mounted in `app/layout.tsx`.
- `rail.tsx` — client component. Identity block (name, role, location/UTC), numbered nav with active highlight, theme toggle, "OPEN TO ROLES" pill, résumé link, social icons (LinkedIn, GitHub, X). Numbered items use JetBrains Mono.
- `mobile-header.tsx` — visible `< md`. Logo + hamburger that opens a shadcn `Sheet` containing the same nav.
- `theme-toggle.tsx` — wraps `useTheme` from next-themes; uses a hugeicons sun/moon glyph.
- `footer.tsx` — minimal: copyright, location/UTC, legal links, social.

### Page section components (`components/sections/`)

Composable, each page picks the ones it needs. All take props (no hardcoded copy):

- `hero.tsx` — eyebrow, headline, body, status pill, CTA buttons, optional stats grid (4-up).
- `journey.tsx` — vertical timeline of role/company/dates/bullet/tags.
- `philosophy.tsx` — 3-up numbered pillars.
- `selected-work.tsx` — 3 large cards with category, ID, title, tech tags, link arrow.
- `cta-banner.tsx` — eyebrow + headline + body + two buttons.
- `stack-matrix.tsx` — table with discipline/tools/maturity dots.
- `stack-section.tsx` — section with eyebrow, heading, intro, optional big stat, item list with maturity tags.
- `project-briefing.tsx` — for `/work/[slug]`. ID label, title, architecture bullets, strategic-impact pull quote, infrastructure stack table.
- `contact-form-section.tsx` — form on the left, NODE_STATS panel on the right.
- `writing-list.tsx` — search input, tag filter, post cards (rendered via react-query).
- `writing-post.tsx` — title, meta, cover, rich-text body (from Payload), table of contents.

### Animation system (`components/anim/`)

Thin GSAP wrappers, all client components, all guarded with `useGSAP` from `@gsap/react`.

- `MaskReveal` — splits children by line (`SplitText` is paid, use a manual approach with `Inter`'s `font-feature-settings: "ss01"` if needed, or `gsap.utils.toArray` on inner spans). Used on hero headlines.
- `FadeRise` — fades + translates children when in viewport. Section-level wrapper.
- `CountUp` — animates a number from 0 to target. Used in stats.
- `Magnetic` *(deferred)* — only if we revisit "Expressive" later.

GSAP imports use the tree-shakable `gsap` core; `useGSAP` from `@gsap/react` cleans up on unmount and works with React 19. `prefers-reduced-motion` short-circuits all animations to instant.

### Content layer (`content/`)

Typed TS modules for static pages. Edits go through git, not the CMS.

- `content/site.ts` — name, role, headline, location, email(s), socials, resume URL, status flag.
- `content/journey.ts` — array of roles with `{ company, role, start, end, summary, tags }`.
- `content/philosophy.ts` — 3 pillars.
- `content/work.ts` — array of projects with `{ slug, category, ord, title, tags, briefing, impact, stack }`.
- `content/stack.ts` — disciplines, tools, maturity, philosophy copy.
- `content/legal.ts` — privacy + terms markdown strings.

All content drawn from the v1 extraction (already gathered) — use that report as the source of truth, verbatim where possible.

### Payload CMS (`payload.config.ts` + `collections/`)

Mounted within the same Next.js app via `@payloadcms/next` adapter. Admin UI lives at `/admin`.

Collections:

- `Posts` — `{ title, slug, excerpt, cover (Media), tags, status (draft|published), publishedAt, body (Lexical rich text with code blocks, callouts, images), readingTime (auto), seo (title/desc/og) }`. Public read for `published`, admin-only write.
- `Media` — Payload-managed uploads, S3 storage adapter (or local + Vercel Blob — confirm at impl time; defaults to local for dev).
- `Submissions` — `{ name, email, inquiry, message, submittedAt, ip, userAgent }`. Admin read/write only. No public access.
- Globals: `Site` — pull anything later if we expand the CMS scope.

Auth: single admin user (the owner), seeded via env vars. No public signup.

### Form pipeline (`actions/contact.ts`, `emails/`, `lib/`)

1. Client: `react-hook-form` + `zodResolver` validates `{ name, email, inquiry, message }`.
2. Submit calls a server action.
3. Server: re-validates with the same zod schema, calls `getPayload()` to insert a `Submissions` doc, then calls Resend twice — owner notification and sender confirmation (templates in `emails/` as React Email components).
4. Returns `{ ok, error? }`; client shows a `Sonner` toast.
5. Rate limit: lightweight in-memory or Upstash if available — not blocking for MVP, log it as a TODO.

### Data fetching

- Home, Work, Stack, Contact, Legal — pure RSC, content from TS modules. No client fetches.
- Writing index — RSC for initial render of the latest 10 posts; `@tanstack/react-query` (with `HydrationBoundary`) takes over for client-driven search/tag filter and "load more". `QueryClient` provider mounted in root layout.
- Writing post — RSC, fetched server-side from Payload's local API (`getPayload()` then `payload.find(...)`).

### Theme + tokens

`globals.css` already has full light/dark vars in OKLCH. The single addition is wiring the new fonts:

```css
@theme inline {
  --font-sans: var(--font-inter);
  --font-mono: var(--font-jetbrains-mono);
  --font-heading: var(--font-inter);
}
```

The current `globals.css` sets `html { @apply font-mono }` — **flip to `font-sans`** so Inter is the default, and let mono be opt-in via `font-mono` class. Everything else in `globals.css` stays.

`next/font` is loaded in `app/layout.tsx`:

```tsx
import { Inter, JetBrains_Mono } from "next/font/google";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jbm = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono", display: "swap" });
```

## Implementation phases

Each phase is a checkpoint — site stays runnable after every phase.

### Phase 1 — Shell

- Wire fonts (Inter + JetBrains Mono), theme provider, query client, site frame, rail, mobile header, footer.
- Update `app/layout.tsx` and `app/globals.css` (font swap only).
- Stub all routes from the sitemap with a placeholder section so navigation is clickable end-to-end.
- Add deps: `@tanstack/react-query`, `next-themes`, `gsap`, `@gsap/react`, `react-hook-form`, `@hookform/resolvers`, `zod`, `resend`, `react-email`, `@react-email/components`.

### Phase 2 — Home

- Build all section components listed under `components/sections/`.
- Populate from `content/*.ts` modules (typed).
- Add `MaskReveal`, `FadeRise`, `CountUp` and apply tastefully (hero text reveals once on load; stats count up when in view; sections fade-rise on scroll).
- Verify reduced-motion short-circuits.

### Phase 3 — Work

- `/work` lists projects from `content/work.ts`.
- `/work/[slug]` renders project briefing — `generateStaticParams` from the same array.
- `notFound()` for missing slugs.

### Phase 4 — Stack

- `/stack` renders sections + matrix from `content/stack.ts`.

### Phase 5 — Contact

- Form with `react-hook-form` + zod schema in `lib/schemas/contact.ts`.
- Server action in `actions/contact.ts` — inserts `Submissions` doc + Resend dual-send.
- Resend templates in `emails/contact-notification.tsx`, `emails/contact-confirmation.tsx`.
- Honeypot field for spam.

### Phase 6 — Payload + Writing/Blog

- `payload.config.ts` at project root with Mongo adapter, Lexical editor, S3 (or local) media adapter.
- Add collections: `Posts`, `Media`, `Submissions`.
- Mount admin + API under `app/(payload)/` per Payload's Next.js adapter docs.
- `/writing` index renders latest posts (RSC) with react-query hydration for client-side filter/search.
- `/writing/[slug]` renders a post (RSC) with serialized Lexical → React via Payload's renderer.
- Seed one sample post in dev so the page isn't empty.

### Phase 7 — SEO + polish

- `app/sitemap.ts` (static routes + posts from Payload).
- `app/robots.ts`.
- `app/opengraph-image.tsx` (auto OG using `next/og` with Inter for the headline).
- Per-page `generateMetadata` with description + canonical.
- `app/not-found.tsx`, `app/error.tsx`.
- 404 routes for `/work/[slug]` and `/writing/[slug]`.

### Phase 8 — Ship

- Env vars (`PAYLOAD_SECRET`, `MONGODB_URI`, `RESEND_API_KEY`, `RESEND_FROM`, `NEXT_PUBLIC_SITE_URL`).
- Configure Vercel project; add env vars in dashboard.
- First deploy + admin user creation via Payload's first-boot flow.
- Run Lighthouse, fix any CLS/LCP regressions from font loading or GSAP.

## Critical files

**Create:**

- `app/layout.tsx` (replace placeholder), `app/page.tsx` (replace placeholder).
- `app/work/page.tsx`, `app/work/[slug]/page.tsx`.
- `app/stack/page.tsx`.
- `app/writing/page.tsx`, `app/writing/[slug]/page.tsx`.
- `app/contact/page.tsx`.
- `app/legal/privacy/page.tsx`, `app/legal/terms/page.tsx`.
- `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx`, `app/not-found.tsx`, `app/error.tsx`.
- `app/(payload)/admin/[[...segments]]/page.tsx`, `app/(payload)/api/[...slug]/route.ts`.
- `payload.config.ts`, `collections/Posts.ts`, `collections/Media.ts`, `collections/Submissions.ts`.
- `components/site/{site-frame,rail,mobile-header,theme-toggle,footer}.tsx`.
- `components/sections/{hero,journey,philosophy,selected-work,cta-banner,stack-matrix,stack-section,project-briefing,contact-form-section,writing-list,writing-post}.tsx`.
- `components/anim/{mask-reveal,fade-rise,count-up}.tsx`.
- `components/providers/{theme-provider,query-provider}.tsx`.
- `content/{site,journey,philosophy,work,stack,legal}.ts`.
- `actions/contact.ts`.
- `emails/{contact-notification,contact-confirmation}.tsx`.
- `lib/{resend,payload,schemas/contact,reduced-motion}.ts`.
- `hooks/use-section-in-view.ts` (small wrapper over IntersectionObserver for GSAP triggers).

**Modify:**

- `app/globals.css` — add font variables to `@theme inline`, flip `html` from `font-mono` to `font-sans`. No color changes.
- `package.json` — add deps listed in Phase 1; add `payload` dev script.
- `next.config.ts` — add `withPayload` wrapper, `images.remotePatterns` for media.
- `tsconfig.json` — extend paths if Payload generates types in a non-default location.
- `eslint.config.mjs` — add ignores for Payload generated types.
- `.gitignore` — add `.superpowers/`, `payload-types.ts` if generated.

**Reuse (already present, no edits):**

- `components/ui/*` — every shadcn primitive (Button, Card, Sheet, Sonner, Input, Label, Select, Textarea, Separator, Badge, ScrollArea, Dialog, etc.) is already installed. Use them as-is.
- `lib/utils.ts` — `cn()` helper.
- `hooks/use-mobile.ts` — already present, useful for the mobile-header switch.

## Pattern: page composition

Every static page follows the same shape — keeps the section components reusable and the page files thin:

```tsx
// app/<route>/page.tsx
import { Hero } from "@/components/sections/hero";
import { Philosophy } from "@/components/sections/philosophy";
import { content } from "@/content/<source>";

export const metadata = { /* per-page */ };

export default function Page() {
  return (
    <>
      <Hero {...content.hero} />
      <Philosophy items={content.pillars} />
      {/* … */}
    </>
  );
}
```

The `<main>` and rail are already provided by `app/layout.tsx` via `<SiteFrame>` — pages return only section content.

## Pattern: animation usage

```tsx
<FadeRise>
  <section className="…">
    <MaskReveal as="h1" className="text-5xl font-semibold">
      Leading teams at scale, shipping with precision.
    </MaskReveal>
    {/* … */}
  </section>
</FadeRise>
```

All animations check `prefers-reduced-motion` via a shared `useReducedMotion()` hook and become no-ops when set.

## Verification

After Phase 1:
- `pnpm dev` boots, every route in the sitemap loads without errors.
- Tab through the rail — keyboard focus visible, theme toggle works, drawer opens on mobile.

After each content phase (2–5):
- Open the page in the gstack browser at the dev URL, verify all sections render with content from the v1 extraction.
- Toggle theme, verify both look right.
- Throttle to 4G in DevTools, verify CLS < 0.1 and LCP < 2.5s on Home.
- Verify reduced-motion (DevTools rendering tab) makes animations instant.

After Phase 5 (contact):
- Submit the form locally — verify Resend test mode receives both emails AND a `Submissions` doc appears in `/admin`.
- Submit with bad data, verify field-level errors.

After Phase 6 (Payload):
- `pnpm dev` → visit `/admin`, create the first user, create a sample post, save+publish.
- Visit `/writing` — sample post appears; click into it, body renders.
- Verify draft posts do not appear on the public index.

After Phase 7:
- `curl localhost:3000/sitemap.xml` returns every static route and published post.
- `curl localhost:3000/robots.txt`, `curl localhost:3000/opengraph-image` both return 200.

Before merging:
- `pnpm build` clean. `pnpm lint` clean.
- Lighthouse on Home, Work, Writing index ≥ 95 across the board.
- Manual a11y pass — `eslint-plugin-jsx-a11y` rules + tab-through.
