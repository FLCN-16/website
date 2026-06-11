# CodeCanyon Productization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Strip all personal identity from the codebase and route it through Payload CMS admin, so any buyer can personalize this portfolio without editing source code (except `content/stack.ts`).

**Architecture:** All personal data (name, socials, role, philosophy) moves into the existing `SiteSettings` Payload global. A new `SiteIdentity` type is built from those settings at request time and distributed to client components via React context. The orphaned `content/journey.ts` and `content/work.ts` files are deleted; `content/philosophy.ts` is migrated to SiteSettings; `content/site.ts` becomes type-only.

**Tech Stack:** Next.js 16 App Router, Payload CMS 3, React context, Vitest

---

## File Map

| Action | File |
|---|---|
| Modify | `globals/SiteSettings.ts` |
| Modify | `lib/data.ts` |
| **Create** | `lib/site-identity.ts` |
| **Create** | `components/providers/site-identity-provider.tsx` |
| Modify | `app/(site)/layout.tsx` |
| Modify | `components/site/site-frame.tsx` |
| Modify | `components/site/rail.tsx` |
| Modify | `components/site/mobile-header.tsx` |
| Modify | `components/site/footer.tsx` |
| Modify | `components/site/splash-screen.tsx` |
| Modify | `components/site/error-state.tsx` |
| Modify | `components/writing/social-cta.tsx` |
| Modify | `components/writing/post-share.tsx` |
| Modify | `components/sections/contact-form-section.tsx` |
| Modify | `lib/metadata.ts` |
| Modify | `lib/__tests__/og-url.test.ts` |
| Modify | `lib/structured-data.ts` |
| Modify | `app/(site)/page.tsx` |
| Modify | `app/(site)/work/[slug]/page.tsx` |
| Modify | `app/(site)/writing/[slug]/page.tsx` |
| Modify | `app/robots.ts` |
| Modify | `app/manifest.ts` |
| Modify | `app/sitemap.ts` |
| Modify | `app/sitemap-index.xml/route.ts` |
| Modify | `app/feed.xml/route.ts` |
| Modify | `app/llms.txt/route.ts` |
| Modify | `app/og/route.tsx` |
| Modify | `app/not-found.tsx` |
| Modify | `app/maintenance/layout.tsx` |
| Modify | `app/maintenance/page.tsx` |
| Modify | `actions/contact.ts` |
| Modify | `actions/talent-inquiry.ts` |
| Modify | `lib/email/post-broadcast.ts` |
| **Delete** | `content/philosophy.ts` |
| **Delete** | `content/journey.ts` |
| **Delete** | `content/work.ts` |
| Modify (type-only) | `content/site.ts` |
| Modify | `package.json` |
| Modify | `README.md` |

---

## Task 1: Extend SiteSettings global with identity, socials, and philosophy fields

**Files:**
- Modify: `globals/SiteSettings.ts`

- [ ] **Step 1: Fix RESUME_FILENAME and sanitize admin description**

In `globals/SiteSettings.ts`, find and replace:

```ts
const RESUME_FILENAME = "rishabh-kumar-resume.pdf";
```
→
```ts
const RESUME_FILENAME = "resume.pdf";
```

Also find the resume field's admin description and replace:
```ts
description:
          "Upload the PDF to Media, then select it here. It will automatically be renamed to rishabh-kumar-resume.pdf in R2.",
```
→
```ts
description:
          "Upload your résumé PDF here. It will be stored as resume.pdf in your R2 bucket.",
```

- [ ] **Step 2: Add identity, socials, and philosophy fields**

In `globals/SiteSettings.ts`, add the following three field groups to the `fields` array, immediately before the first existing `// ── Résumé` comment:

```ts
    // ── Identity ──────────────────────────────────────────────────────────────
    {
      name: 'identity',
      type: 'group',
      label: 'Identity',
      admin: {
        description: 'Your personal details — shown in the nav, footer, metadata, and SEO.',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Full Name',
          admin: { description: 'e.g. Jane Smith' },
        },
        {
          name: 'handle',
          type: 'text',
          label: 'Handle / Username',
          admin: { description: 'e.g. janesmith — used in Twitter/X meta tags' },
        },
        {
          name: 'role',
          type: 'text',
          label: 'Role / Title',
          admin: { description: 'e.g. Senior Frontend Developer' },
        },
        {
          name: 'location',
          type: 'text',
          label: 'Location',
          admin: { description: 'e.g. San Francisco, CA' },
        },
        {
          name: 'timezone',
          type: 'text',
          label: 'Timezone',
          admin: { description: 'e.g. UTC-8 — shown in footer and contact page' },
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email Address',
          admin: { description: 'Contact email shown on the site and in RSS feed' },
        },
        {
          name: 'siteUrl',
          type: 'text',
          label: 'Site URL',
          admin: { description: 'Full URL including https, e.g. https://janedoe.dev' },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Meta Description',
          admin: {
            description: '≤160 chars — shown in Google search snippets',
            rows: 3,
          },
        },
      ],
    },

    // ── Socials ───────────────────────────────────────────────────────────────
    {
      name: 'socials',
      type: 'array',
      label: 'Social Links',
      maxRows: 6,
      admin: {
        description: 'Social profiles shown in the footer and writing CTA.',
      },
      fields: [
        {
          name: 'platform',
          type: 'select',
          label: 'Platform',
          required: true,
          options: [
            { label: 'GitHub', value: 'github' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'Twitter / X', value: 'twitter' },
            { label: 'YouTube', value: 'youtube' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          label: 'Profile URL',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          label: 'Display Label',
          admin: { description: 'e.g. GitHub, LinkedIn' },
        },
      ],
    },

    // ── Philosophy ────────────────────────────────────────────────────────────
    {
      name: 'philosophy',
      type: 'array',
      label: 'Engineering Philosophy',
      maxRows: 5,
      admin: {
        description:
          'The philosophy pillars shown on the homepage. Order is top-to-bottom display order.',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Pillar Title',
          required: true,
          admin: { description: 'e.g. Performance is a feature' },
        },
        {
          name: 'body',
          type: 'textarea',
          label: 'Pillar Body',
          required: true,
          admin: { rows: 4 },
        },
      ],
    },
```

- [ ] **Step 3: Run the dev server and verify the new fields appear in the admin**

```bash
pnpm dev
```

Open `http://localhost:3000/admin` → Site Settings. Confirm the Identity group, Social Links array, and Engineering Philosophy array all appear with correct labels and descriptions.

- [ ] **Step 4: Commit**

```bash
git add globals/SiteSettings.ts
git commit -m "feat: add identity, socials, philosophy fields to SiteSettings global"
```

---

## Task 2: Extend RawSiteSettings type and create SiteIdentity helper

**Files:**
- Modify: `lib/data.ts`
- Create: `lib/site-identity.ts`

- [ ] **Step 1: Extend RawSiteSettings interface in lib/data.ts**

Find the existing `RawSiteSettings` interface (around line 379) and replace it:

```ts
export interface RawSiteSettings {
  availability?: { available?: boolean | null; label?: string | null } | null
  headline?: string | null
  subheadline?: string | null
  eyebrow?: string | null
  stats?: Array<{ value: string; label: string }> | null
  identity?: {
    name?: string | null
    handle?: string | null
    role?: string | null
    location?: string | null
    timezone?: string | null
    email?: string | null
    siteUrl?: string | null
    description?: string | null
  } | null
  socials?: Array<{ platform: string; url: string; label?: string | null }> | null
  philosophy?: Array<{ title: string; body: string }> | null
}
```

- [ ] **Step 2: Write the failing test for buildIdentity**

Create `lib/__tests__/site-identity.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { buildIdentity } from '../site-identity'
import type { RawSiteSettings } from '../data'

describe('buildIdentity', () => {
  it('returns placeholder defaults when settings is null', () => {
    const identity = buildIdentity(null)
    expect(identity.name).toBe('Your Name')
    expect(identity.url).toBeTruthy()
    expect(identity.socials).toEqual([])
    expect(identity.status.available).toBe(false)
  })

  it('uses CMS values when present', () => {
    const settings: RawSiteSettings = {
      identity: {
        name: 'Jane Smith',
        handle: 'janesmith',
        role: 'Senior Dev',
        location: 'Austin, TX',
        timezone: 'UTC-6',
        email: 'jane@example.com',
        siteUrl: 'https://janesmith.dev',
        description: 'A developer.',
      },
      socials: [{ platform: 'github', url: 'https://github.com/janesmith', label: 'GitHub' }],
      availability: { available: true, label: 'OPEN TO ROLES' },
    }
    const identity = buildIdentity(settings)
    expect(identity.name).toBe('Jane Smith')
    expect(identity.url).toBe('https://janesmith.dev')
    expect(identity.socials).toHaveLength(1)
    expect(identity.socials[0].platform).toBe('github')
    expect(identity.status.available).toBe(true)
    expect(identity.status.label).toBe('OPEN TO ROLES')
  })

  it('derives resumeUrl from NEXT_PUBLIC_MEDIA_URL env var', () => {
    process.env.NEXT_PUBLIC_MEDIA_URL = 'https://media.example.dev'
    const identity = buildIdentity(null)
    expect(identity.resumeUrl).toBe('https://media.example.dev/resume.pdf')
  })

  it('falls back gracefully when socials label is missing', () => {
    const settings: RawSiteSettings = {
      socials: [{ platform: 'linkedin', url: 'https://linkedin.com/in/jane' }],
    }
    const identity = buildIdentity(settings)
    expect(identity.socials[0].label).toBe('linkedin')
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

```bash
pnpm vitest run lib/__tests__/site-identity.test.ts
```

Expected: FAIL — `Cannot find module '../site-identity'`

- [ ] **Step 4: Create lib/site-identity.ts**

```ts
import type { RawSiteSettings } from './data'

export interface SiteIdentity {
  name: string
  handle: string
  role: string
  location: string
  timezone: string
  email: string
  url: string
  description: string
  socials: Array<{ platform: string; url: string; label: string }>
  resumeUrl: string
  status: { available: boolean; label: string }
}

const FALLBACK_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com'

export function buildIdentity(settings: RawSiteSettings | null): SiteIdentity {
  return {
    name: settings?.identity?.name ?? 'Your Name',
    handle: settings?.identity?.handle ?? 'username',
    role: settings?.identity?.role ?? 'Developer',
    location: settings?.identity?.location ?? 'Worldwide',
    timezone: settings?.identity?.timezone ?? 'UTC',
    email: settings?.identity?.email ?? 'hello@example.com',
    url: settings?.identity?.siteUrl ?? FALLBACK_URL,
    description: settings?.identity?.description ?? 'A personal portfolio and blog.',
    socials:
      settings?.socials?.map((s) => ({
        platform: s.platform,
        url: s.url,
        label: s.label ?? s.platform,
      })) ?? [],
    resumeUrl: `${process.env.NEXT_PUBLIC_MEDIA_URL ?? ''}/resume.pdf`,
    status: {
      available: settings?.availability?.available ?? false,
      label: settings?.availability?.label ?? 'OPEN TO ROLES',
    },
  }
}
```

- [ ] **Step 5: Run test to verify it passes**

```bash
pnpm vitest run lib/__tests__/site-identity.test.ts
```

Expected: PASS (4 tests)

- [ ] **Step 6: Commit**

```bash
git add lib/data.ts lib/site-identity.ts lib/__tests__/site-identity.test.ts
git commit -m "feat: SiteIdentity type and buildIdentity helper"
```

---

## Task 3: Create SiteIdentityProvider

**Files:**
- Create: `components/providers/site-identity-provider.tsx`

- [ ] **Step 1: Create the provider**

```tsx
'use client'

import { createContext, useContext } from 'react'
import type { SiteIdentity } from '@/lib/site-identity'

const SiteIdentityContext = createContext<SiteIdentity | null>(null)

export function SiteIdentityProvider({
  identity,
  children,
}: {
  identity: SiteIdentity
  children: React.ReactNode
}) {
  return (
    <SiteIdentityContext.Provider value={identity}>
      {children}
    </SiteIdentityContext.Provider>
  )
}

export function useSiteIdentity(): SiteIdentity {
  const ctx = useContext(SiteIdentityContext)
  if (!ctx) throw new Error('useSiteIdentity must be used within SiteIdentityProvider')
  return ctx
}
```

- [ ] **Step 2: Commit**

```bash
git add components/providers/site-identity-provider.tsx
git commit -m "feat: SiteIdentityProvider context and useSiteIdentity hook"
```

---

## Task 4: Wire SiteIdentityProvider into (site) layout and fix generateMetadata

**Files:**
- Modify: `app/(site)/layout.tsx`

The layout currently has `export const metadata: Metadata = { ... }` using static `site.*` values. Replace it with `export async function generateMetadata()` and wrap the layout body with `SiteIdentityProvider`.

- [ ] **Step 1: Replace static metadata export with async generateMetadata()**

Remove the `import { site } from "@/content/site"` import.
Add these imports:

```ts
import { getCachedSiteSettings } from '@/lib/data'
import { buildIdentity } from '@/lib/site-identity'
import { SiteIdentityProvider } from '@/components/providers/site-identity-provider'
```

Replace:
```ts
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: {
    types: {
      "application/rss+xml": `${site.url}/feed.xml`,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: site.name,
    title: `${site.name} — ${site.role}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    creator: `@${site.handle}`,
    title: `${site.name} — ${site.role}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};
```
→
```ts
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedSiteSettings()
  const id = buildIdentity(settings)
  return {
    metadataBase: new URL(id.url),
    title: {
      default: `${id.name} — ${id.role}`,
      template: `%s — ${id.name}`,
    },
    description: id.description,
    authors: [{ name: id.name, url: id.url }],
    creator: id.name,
    alternates: {
      types: {
        'application/rss+xml': `${id.url}/feed.xml`,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: id.name,
      title: `${id.name} — ${id.role}`,
      description: id.description,
    },
    twitter: {
      card: 'summary_large_image',
      creator: `@${id.handle}`,
      title: `${id.name} — ${id.role}`,
      description: id.description,
    },
    robots: { index: true, follow: true },
  }
}
```

- [ ] **Step 2: Add SiteIdentityProvider to the layout body**

In `SiteLayout`, add a `getCachedSiteSettings()` call at the top and wrap children with the provider:

```ts
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getCachedSiteSettings().catch(() => null)
  const identity = buildIdentity(settings)

  let talentForm: Form | null = null
  // ... existing talent form fetch (unchanged) ...

  return (
    <html ...>
      ...
      <body ...>
        ...
        <SiteIdentityProvider identity={identity}>
          <ThemeProvider ...>
            <ClientOverlays form={talentForm} />
            <QueryProvider>
              <SiteFrame>{children}</SiteFrame>
            </QueryProvider>
            <Toaster position="bottom-right" />
            <CookieConsent />
          </ThemeProvider>
        </SiteIdentityProvider>
      </body>
    </html>
  )
}
```

Note: `getCachedSiteSettings()` is now called twice per request (once for generateMetadata, once for the layout body). Both calls hit the same `unstable_cache` entry — only one DB round-trip occurs.

- [ ] **Step 3: Start dev server and verify no TypeScript errors**

```bash
pnpm dev
```

Expected: server starts, no compile errors. Homepage loads.

- [ ] **Step 4: Commit**

```bash
git add app/\(site\)/layout.tsx
git commit -m "feat: SiteIdentityProvider in site layout, generateMetadata uses CMS identity"
```

---

## Task 5: Update SiteFrame — remove site.ts dependency

**Files:**
- Modify: `components/site/site-frame.tsx`

SiteFrame currently calls `getCachedSiteSettings()` itself and passes `resumeUrl` and `status` as props to Rail/MobileHeader. After this task, those values come from the context (set in the layout). SiteFrame becomes a simple sync server component.

- [ ] **Step 1: Replace SiteFrame contents**

Replace the entire file:

```tsx
import { Rail } from "@/components/site/rail";
import { MobileHeader } from "@/components/site/mobile-header";
import { Footer } from "@/components/site/footer";

export function SiteFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Rail />
      <div className="flex flex-col flex-1 min-w-0 lg:ml-[240px]">
        <MobileHeader />
        <main className="flex-1 px-6 py-12 md:px-12 md:py-16">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify homepage still renders**

With `pnpm dev` running, open `http://localhost:3000`. Rail, header, and footer should render (even if with fallback values until identity fields are filled in admin).

- [ ] **Step 3: Commit**

```bash
git add components/site/site-frame.tsx
git commit -m "refactor: SiteFrame removes site.ts import, uses context via client children"
```

---

## Task 6: Update Rail, MobileHeader, Footer, SplashScreen to use useSiteIdentity()

**Files:**
- Modify: `components/site/rail.tsx`
- Modify: `components/site/mobile-header.tsx`
- Modify: `components/site/footer.tsx`
- Modify: `components/site/splash-screen.tsx`

In each file: remove `import { site } from "@/content/site"`, add `import { useSiteIdentity } from "@/components/providers/site-identity-provider"`, call `const identity = useSiteIdentity()` inside the component function, replace all `site.*` references with `identity.*`.

- [ ] **Step 1: Update components/site/rail.tsx**

Remove:
```ts
import { site } from "@/content/site"
const locationLine = `${site.location.split(",")[0].toUpperCase()} · ${site.timezone}`
const copyrightDomain = site.url.replace("https://", "").toUpperCase()
```

Change the component signature from:
```ts
export function Rail({ resumeUrl, status }: { resumeUrl: string; status: { available: boolean; label: string } }) {
```
to:
```ts
export function Rail() {
```

Add at the top of the function body:
```ts
const identity = useSiteIdentity()
const locationLine = `${identity.location.split(',')[0].toUpperCase()} · ${identity.timezone}`
const copyrightDomain = identity.url.replace('https://', '').toUpperCase()
const { resumeUrl, status } = identity
```

Replace all remaining `site.*` references with `identity.*`.

- [ ] **Step 2: Update components/site/mobile-header.tsx**

Remove `import { site } from "@/content/site"`.

Change signature from:
```ts
export function MobileHeader({ resumeUrl, status }: { resumeUrl: string; status: { available: boolean; label: string } }) {
```
to:
```ts
export function MobileHeader() {
```

Add at the top of function body:
```ts
const identity = useSiteIdentity()
const { resumeUrl, status } = identity
```

Replace all `site.name`, `site.role` with `identity.name`, `identity.role`.

- [ ] **Step 3: Update components/site/footer.tsx**

Remove `import { site } from "@/content/site"`.

Remove module-level constants:
```ts
const locationLine = `${site.location.split(",")[0].toUpperCase()} · ${site.timezone}`
const copyrightDomain = site.url.replace("https://", "").toUpperCase()
```

Add inside the `Footer` function (before the return):
```ts
const identity = useSiteIdentity()
const locationLine = `${identity.location.split(',')[0].toUpperCase()} · ${identity.timezone}`
const copyrightDomain = identity.url.replace('https://', '').toUpperCase()
```

Replace all `site.socials` with `identity.socials`.

- [ ] **Step 4: Update components/site/splash-screen.tsx**

Remove `import { site } from "@/content/site"` and:
```ts
const DOMAIN = site.url.replace("https://", "")
```

Add inside the `SplashScreen` function:
```ts
const identity = useSiteIdentity()
const DOMAIN = identity.url.replace('https://', '')
```

- [ ] **Step 5: Verify in browser**

With `pnpm dev` running, confirm Rail, mobile menu, Footer, and SplashScreen (on first load of `/`) render without console errors.

- [ ] **Step 6: Commit**

```bash
git add components/site/rail.tsx components/site/mobile-header.tsx components/site/footer.tsx components/site/splash-screen.tsx
git commit -m "refactor: Rail, MobileHeader, Footer, SplashScreen use useSiteIdentity()"
```

---

## Task 7: Update WritingSocialCTA, PostShare, ContactFormSection

**Files:**
- Modify: `components/writing/social-cta.tsx`
- Modify: `components/writing/post-share.tsx`
- Modify: `components/sections/contact-form-section.tsx`

Same pattern: remove `import { site }`, add `useSiteIdentity()` call, replace `site.*`.

- [ ] **Step 1: Update components/writing/social-cta.tsx**

Remove `import { site } from "@/content/site"`.

`WritingSocialCTA` is a non-hook server-like component currently. It uses `site.socials` directly. Add `"use client"` if not already present, then:

```ts
const identity = useSiteIdentity()
```

Replace `site.socials` with `identity.socials`.

- [ ] **Step 2: Update components/writing/post-share.tsx**

Remove `import { site } from "@/content/site"`.

`PostShare` is a client component. Inside the component function add:
```ts
const identity = useSiteIdentity()
```

Replace the line `const links = (base: string, encodedTitle: string) => [...]` — wherever `site.url` is used to build share URLs, replace with `identity.url`.

- [ ] **Step 3: Update components/sections/contact-form-section.tsx**

Remove `import { site } from "@/content/site"`.

Remove:
```ts
const NODE_STATS = [
  { label: "LOCATION", value: site.location },
  { label: "TIMEZONE", value: site.timezone },
```

Inside the component function, add:
```ts
const identity = useSiteIdentity()
const NODE_STATS = [
  { label: 'LOCATION', value: identity.location },
  { label: 'TIMEZONE', value: identity.timezone },
```

Replace any other `site.*` references (e.g. `site.email`).

- [ ] **Step 4: Verify in browser**

Open `/writing` (any post's writing CTA), `/contact` (contact form stats). No console errors.

- [ ] **Step 5: Commit**

```bash
git add components/writing/social-cta.tsx components/writing/post-share.tsx components/sections/contact-form-section.tsx
git commit -m "refactor: writing and contact components use useSiteIdentity()"
```

---

## Task 8: Update lib/metadata.ts to accept identity parameter

**Files:**
- Modify: `lib/metadata.ts`
- Modify: `lib/__tests__/og-url.test.ts`

`buildOgUrl` and `createMetadata` currently pull `site.url`, `site.name`, `site.handle` from the static import. After this task they receive a `SiteIdentity` parameter.

- [ ] **Step 1: Update og-url.test.ts first (TDD)**

In `lib/__tests__/og-url.test.ts`, the tests currently call `buildOgUrl('Hello World')` with no identity. Update them to pass a minimal identity:

```ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { buildOgUrl, createMetadata, resolveMetaImage } from '../metadata'
import type { SiteIdentity } from '../site-identity'

const TEST_IDENTITY: SiteIdentity = {
  name: 'Test User',
  handle: 'testuser',
  role: 'Developer',
  location: 'Worldwide',
  timezone: 'UTC',
  email: 'test@example.com',
  url: 'https://test.example.com',
  description: 'Test site.',
  socials: [],
  resumeUrl: 'https://media.example.com/resume.pdf',
  status: { available: false, label: 'NOT AVAILABLE' },
}

describe('buildOgUrl', () => {
  it('returns a URL pointing to /og with a title param', () => {
    const url = buildOgUrl('Hello World', TEST_IDENTITY)
    expect(url).toMatch(/\/og\?/)
    expect(new URL(url).searchParams.get('title')).toBe('Hello World')
  })

  it('includes kind when provided', () => {
    const url = buildOgUrl('My Post', TEST_IDENTITY, 'WRITING')
    expect(new URL(url).searchParams.get('kind')).toBe('WRITING')
  })

  it('omits kind when not provided', () => {
    const url = buildOgUrl('My Post', TEST_IDENTITY)
    expect(url).not.toContain('kind=')
  })

  it('truncates desc to 160 characters', () => {
    const long = 'A'.repeat(200)
    const url = buildOgUrl('Title', TEST_IDENTITY, undefined, long)
    const desc = new URL(url).searchParams.get('desc')!
    expect(desc).toBe('A'.repeat(160))
  })

  it('omits desc when not provided', () => {
    const url = buildOgUrl('Title', TEST_IDENTITY)
    expect(url).not.toContain('desc=')
  })
})

describe('createMetadata — image fallback', () => {
  it('sets og:image to a /og URL when no image is passed', () => {
    const meta = createMetadata({ title: 'Stack', identity: TEST_IDENTITY })
    const images = (meta.openGraph as Record<string, unknown>)?.images as { url: string }[]
    expect(Array.isArray(images)).toBe(true)
    expect(images[0].url).toContain('/og?')
    expect(new URL(images[0].url).searchParams.get('title')).toBe('Stack')
  })

  it('uses the provided image when passed, ignoring /og fallback', () => {
    const meta = createMetadata({ title: 'Post', image: 'https://cdn.example.com/cover.jpg', identity: TEST_IDENTITY })
    const images = (meta.openGraph as Record<string, unknown>)?.images as { url: string }[]
    expect(images[0].url).toBe('https://cdn.example.com/cover.jpg')
  })

  it('passes MetaImage dimensions and alt through to og:image', () => {
    const meta = createMetadata({
      title: 'Post',
      image: { url: 'https://cdn.example.com/cover.jpg', width: 1200, height: 630, alt: 'Cover art' },
      identity: TEST_IDENTITY,
    })
    const images = (meta.openGraph as Record<string, unknown>)?.images as Record<string, unknown>[]
    expect(images[0]).toEqual({ url: 'https://cdn.example.com/cover.jpg', width: 1200, height: 630, alt: 'Cover art' })
  })
})
```

Keep the existing `describe('resolveMetaImage', ...)` block unchanged — it doesn't use site or identity.

- [ ] **Step 2: Run tests to verify they fail**

```bash
pnpm vitest run lib/__tests__/og-url.test.ts
```

Expected: FAIL — argument count mismatch on `buildOgUrl` and `createMetadata`.

- [ ] **Step 3: Update lib/metadata.ts**

Remove `import { site } from "@/content/site"`.
Add `import type { SiteIdentity } from '@/lib/site-identity'`.

Change `buildOgUrl` signature:

```ts
export function buildOgUrl(title: string, identity: SiteIdentity, kind?: string, desc?: string): string {
  const params = new URLSearchParams({ title })
  if (kind) params.set('kind', kind)
  if (desc) params.set('desc', desc.slice(0, 160))
  params.set('v', OG_VERSION)
  return `${identity.url}/og?${params.toString()}`
}
```

Change `createMetadata` to accept `identity` in its options object:

```ts
export function createMetadata({
  title,
  description,
  image,
  path,
  absolute = false,
  kind,
  article,
  identity,
}: {
  title: string
  description?: string
  image?: string | MetaImage
  path?: string
  absolute?: boolean
  kind?: string
  article?: {
    publishedTime?: string
    modifiedTime?: string
    tags?: string[]
  }
  identity: SiteIdentity
}): Metadata {
  const fullTitle = `${title} — ${identity.name}`
  const resolvedTitle = absolute ? ({ absolute: title } as Metadata["title"]) : title
  const metaImage = typeof image === 'string' ? { url: image } : image
  const ogImage = metaImage?.url ?? buildOgUrl(title, identity, kind, description)
  const ogImageDescriptor = metaImage
    ? { url: ogImage, width: metaImage.width, height: metaImage.height, alt: metaImage.alt ?? title }
    : { url: ogImage, width: 1200, height: 630, alt: title }

  return {
    metadataBase: new URL(identity.url),
    title: resolvedTitle,
    description,
    authors: [{ name: identity.name, url: identity.url }],
    creator: identity.name,
    ...(article?.tags?.length ? { keywords: article.tags } : {}),
    alternates: {
      ...(path ? { canonical: `${identity.url}${path}` } : {}),
      types: { 'application/rss+xml': `${identity.url}/feed.xml` },
    },
    openGraph: {
      ...(article
        ? {
            type: 'article',
            publishedTime: article.publishedTime,
            modifiedTime: article.modifiedTime,
            authors: [identity.url],
            tags: article.tags,
          }
        : { type: 'website' }),
      locale: 'en_US',
      siteName: identity.name,
      ...(path ? { url: `${identity.url}${path}` } : {}),
      title: fullTitle,
      description,
      images: [ogImageDescriptor],
    },
    twitter: {
      card: 'summary_large_image',
      site: `@${identity.handle}`,
      creator: `@${identity.handle}`,
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pnpm vitest run lib/__tests__/og-url.test.ts
```

Expected: PASS (all tests)

- [ ] **Step 5: Commit**

```bash
git add lib/metadata.ts lib/__tests__/og-url.test.ts
git commit -m "refactor: metadata helpers accept SiteIdentity parameter instead of static site import"
```

---

## Task 9: Update lib/structured-data.ts

**Files:**
- Modify: `lib/structured-data.ts`

Remove the `site` import; make all functions accept `identity: SiteIdentity`.

- [ ] **Step 1: Update lib/structured-data.ts**

Read the current file first. It exports `personRef`, `personSchema`, `websiteSchema`, and any breadcrumb helpers. It has module-level constants `PERSON_ID` and `WEBSITE_ID` that concatenate `site.url` — these must become local variables inside each function.

Remove:
```ts
import { site } from '@/content/site'
export const PERSON_ID = `${site.url}/#person`
export const WEBSITE_ID = `${site.url}/#website`
```

Add at the top:
```ts
import type { SiteIdentity } from '@/lib/site-identity'
```

Apply these mechanical substitutions across the entire file:
- `site.url` → `identity.url`
- `site.name` → `identity.name`
- `site.email` → `identity.email`
- `site.role` → `identity.role`
- `site.description` → `identity.description`
- `site.socials` → `identity.socials`
- `PERSON_ID` (module-level) → compute inline: `` const personId = `${identity.url}/#person` ``
- `WEBSITE_ID` (module-level) → compute inline: `` const websiteId = `${identity.url}/#website` ``

Add `identity: SiteIdentity` as the first parameter to every exported function. No other logic changes.

- [ ] **Step 2: Commit**

```bash
git add lib/structured-data.ts
git commit -m "refactor: structured-data helpers accept SiteIdentity parameter"
```

---

## Task 10: Update page-level metadata and structured data callers

**Files:**
- Modify: `app/(site)/page.tsx`
- Modify: `app/(site)/work/[slug]/page.tsx`
- Modify: `app/(site)/writing/[slug]/page.tsx`

Each page has either a static `export const metadata` or an `export async function generateMetadata`. All must fetch identity and pass it to `createMetadata` / schema functions.

- [ ] **Step 1: Update app/(site)/page.tsx**

Remove `import { site } from '@/content/site'`.
Add:
```ts
import { buildIdentity } from '@/lib/site-identity'
```

The homepage already calls `getCachedSiteSettings()` in the component body. Convert the static metadata export:

Replace:
```ts
export const metadata = createMetadata({
  title: `${site.name} — ${site.role}`,
  description: site.description,
  path: '/',
  absolute: true,
})
```
→
```ts
export async function generateMetadata() {
  const settings = await getCachedSiteSettings()
  const identity = buildIdentity(settings)
  return createMetadata({
    title: `${identity.name} — ${identity.role}`,
    description: identity.description,
    path: '/',
    absolute: true,
    identity,
  })
}
```

In the `Home()` component body, pass identity to `personSchema`:
```ts
const identity = buildIdentity(cmsSettings)
// ...
<JsonLd data={personSchema(identity)} />
```

- [ ] **Step 2: Update app/(site)/work/[slug]/page.tsx**

Remove `import { site } from '@/content/site'`.
Add `import { buildIdentity } from '@/lib/site-identity'`.

Convert static metadata to `generateMetadata`. Inside the function, call `getCachedSiteSettings()` and `buildIdentity()`. Pass `identity` to `createMetadata(...)` and wherever `site.url` was used to build schema URLs.

- [ ] **Step 3: Update app/(site)/writing/[slug]/page.tsx**

Same pattern as step 2 — remove `site` import, add `getCachedSiteSettings()` + `buildIdentity()` in `generateMetadata`, pass `identity` to `createMetadata` and the inline `articleSchema`.

- [ ] **Step 4: Run dev server and check pages load without errors**

```bash
pnpm dev
```

Open `/`, `/work/design-system-foundation`, and a writing post. Confirm pages render and no TypeScript errors appear in the terminal.

- [ ] **Step 5: Commit**

```bash
git add "app/(site)/page.tsx" "app/(site)/work/[slug]/page.tsx" "app/(site)/writing/[slug]/page.tsx"
git commit -m "refactor: page metadata and structured data use getCachedSiteSettings identity"
```

---

## Task 11: Update route handlers (robots, manifest, sitemap, feed, llms, og)

**Files:**
- Modify: `app/robots.ts`
- Modify: `app/manifest.ts`
- Modify: `app/sitemap.ts`
- Modify: `app/sitemap-index.xml/route.ts`
- Modify: `app/feed.xml/route.ts`
- Modify: `app/llms.txt/route.ts`
- Modify: `app/og/route.tsx`

In each file: remove `import { site }`, add `getCachedSiteSettings` + `buildIdentity` imports, call them at the top of the function, replace `site.*`.

- [ ] **Step 1: Update app/robots.ts**

```ts
import type { MetadataRoute } from 'next'
import { getCachedSiteSettings } from '@/lib/data'
import { buildIdentity } from '@/lib/site-identity'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getCachedSiteSettings().catch(() => null)
  const identity = buildIdentity(settings)
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin/', '/api/'] },
      {
        userAgent: [
          'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-Web',
          'anthropic-ai', 'PerplexityBot', 'Perplexity-User', 'Google-Extended',
          'Applebot-Extended', 'CCBot', 'meta-externalagent',
        ],
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${identity.url}/sitemap-index.xml`,
  }
}
```

- [ ] **Step 2: Update app/manifest.ts**

```ts
import type { MetadataRoute } from 'next'
import { getCachedSiteSettings } from '@/lib/data'
import { buildIdentity } from '@/lib/site-identity'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getCachedSiteSettings().catch(() => null)
  const identity = buildIdentity(settings)
  return {
    name: identity.name,
    short_name: identity.handle || identity.name,
    description: identity.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    icons: [{ src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' }],
  }
}
```

- [ ] **Step 3: Update app/sitemap.ts**

Remove `import { site }`. Add:
```ts
import { getCachedSiteSettings } from '@/lib/data'
import { buildIdentity } from '@/lib/site-identity'
```

Make the `sitemap` default export async. At the top, add:
```ts
const settings = await getCachedSiteSettings().catch(() => null)
const identity = buildIdentity(settings)
```

Replace all `site.url` with `identity.url`.

- [ ] **Step 4: Update app/sitemap-index.xml/route.ts**

Remove `import { site }`. Add same getCachedSiteSettings + buildIdentity imports. In the `GET` function body, add the settings fetch at the top. Replace `site.url` with `identity.url`.

- [ ] **Step 5: Update app/feed.xml/route.ts**

Remove `import { site }`. Add getCachedSiteSettings + buildIdentity. At top of `GET`:
```ts
const settings = await getCachedSiteSettings().catch(() => null)
const identity = buildIdentity(settings)
```

Replace `site.url` → `identity.url`, `site.name` → `identity.name`, `site.email` → `identity.email`.

- [ ] **Step 6: Update app/llms.txt/route.ts**

Same pattern. Replace `site.name`, `site.role`, `site.location`, `site.email`, `site.url`, `site.subheadline` with `identity.*`.

- [ ] **Step 7: Update app/og/route.tsx**

Remove `import { site }`. If the OG handler uses `site.name` or `site.url` to render the image (e.g. as a domain label), fetch settings at the top of the `GET` function and use `identity.*`.

- [ ] **Step 8: Run dev server and spot-check routes**

```bash
curl http://localhost:3000/robots.txt
curl http://localhost:3000/manifest.webmanifest
curl http://localhost:3000/feed.xml | head -20
curl "http://localhost:3000/og?title=Test"   # should return a PNG
```

Confirm each returns valid content without errors.

- [ ] **Step 9: Commit**

```bash
git add app/robots.ts app/manifest.ts app/sitemap.ts "app/sitemap-index.xml/route.ts" "app/feed.xml/route.ts" "app/llms.txt/route.ts" "app/og/route.tsx"
git commit -m "refactor: route handlers use getCachedSiteSettings identity"
```

---

## Task 12: Update server actions and email utility

**Files:**
- Modify: `actions/contact.ts`
- Modify: `actions/talent-inquiry.ts`
- Modify: `lib/email/post-broadcast.ts`

- [ ] **Step 1: Update actions/contact.ts**

Remove `import { site }`. Add:
```ts
import { getCachedSiteSettings } from '@/lib/data'
import { buildIdentity } from '@/lib/site-identity'
```

At the top of `submitContact` (after validation passes), add:
```ts
const settings = await getCachedSiteSettings().catch(() => null)
const identity = buildIdentity(settings)
```

Replace `site.name`, `site.email`, `site.url` with `identity.*` throughout the function.

- [ ] **Step 2: Update actions/talent-inquiry.ts**

Same pattern. Replace `site.*` with `identity.*`.

- [ ] **Step 3: Update lib/email/post-broadcast.ts**

Remove `import { site }`. Add getCachedSiteSettings + buildIdentity imports. At the top of `sendPostBroadcast`, add:
```ts
const settings = await getCachedSiteSettings().catch(() => null)
const identity = buildIdentity(settings)
```

Replace `site.name`, `site.url`, `site.email` with `identity.*`.

- [ ] **Step 4: Commit**

```bash
git add actions/contact.ts actions/talent-inquiry.ts lib/email/post-broadcast.ts
git commit -m "refactor: server actions and email use getCachedSiteSettings identity"
```

---

## Task 13: Update out-of-tree error and maintenance pages

**Files:**
- Modify: `app/not-found.tsx`
- Modify: `app/maintenance/layout.tsx`
- Modify: `app/maintenance/page.tsx`
- Modify: `components/site/error-state.tsx`

These pages are outside the `(site)` route group and don't have access to `SiteIdentityProvider`. They call `getCachedSiteSettings()` directly or use `process.env.NEXT_PUBLIC_SITE_URL`.

- [ ] **Step 1: Update app/not-found.tsx**

This is a server component. Remove `import { site }`. Add getCachedSiteSettings + buildIdentity. Make the page `async`, fetch identity at the top, and use `identity.*`.

- [ ] **Step 2: Update app/maintenance/layout.tsx**

Replace static `export const metadata` with:

```ts
import { getCachedSiteSettings } from '@/lib/data'
import { buildIdentity } from '@/lib/site-identity'

export async function generateMetadata() {
  const settings = await getCachedSiteSettings().catch(() => null)
  const identity = buildIdentity(settings)
  return {
    title: `Maintenance — ${identity.name}`,
    robots: { index: false, follow: false },
  }
}
```

- [ ] **Step 3: Update app/maintenance/page.tsx**

Remove `import { site }`. Convert static metadata export to `generateMetadata` using the same getCachedSiteSettings + buildIdentity pattern. Replace `site.name` with `identity.name`.

- [ ] **Step 4: Update components/site/error-state.tsx**

Remove `import { site }`. The error state is used in `app/not-found.tsx` (server component) and `app/global-error.tsx` (client component). Make it accept an optional `siteName` prop with a fallback:

```tsx
export function ErrorState({
  code,
  title,
  body,
  siteName = 'Portfolio',
}: {
  code?: string
  title: string
  body?: string
  siteName?: string
}) {
  // replace any `site.name` usage inside with `siteName`
}
```

Update callers to pass `siteName={identity.name}` where identity is available, or leave it to use the default.

- [ ] **Step 5: Commit**

```bash
git add app/not-found.tsx "app/maintenance/layout.tsx" "app/maintenance/page.tsx" components/site/error-state.tsx
git commit -m "refactor: error and maintenance pages use getCachedSiteSettings identity"
```

---

## Task 14: Migrate philosophy to SiteSettings, delete content/philosophy.ts

**Files:**
- Modify: `app/(site)/page.tsx`
- Modify: `components/sections/philosophy.tsx`
- Delete: `content/philosophy.ts`

- [ ] **Step 1: Update Philosophy component to drop num prop**

The `Philosophy` component currently expects `pillars: Array<{ num: string; title: string; body: string }>`. After migration the `num` is derived from array index. Update the component:

```ts
// components/sections/philosophy.tsx
interface PhilosophyProps {
  eyebrow: string
  heading: string
  pillars: Array<{ title: string; body: string }>
}

export function Philosophy({ eyebrow, heading, pillars }: PhilosophyProps) {
  return (
    // ... existing JSX, replacing pillar.num with String(i + 1).padStart(2, '0') in the map
    pillars.map((pillar, i) => (
      <div key={i}>
        <span>{String(i + 1).padStart(2, '0')}</span>
        <h3>{pillar.title}</h3>
        <p>{pillar.body}</p>
      </div>
    ))
  )
}
```

- [ ] **Step 2: Update app/(site)/page.tsx**

Remove `import { philosophy } from '@/content/philosophy'`.

In the `Home` component, the `cmsSettings` object (from `getCachedSiteSettings()`) now includes `philosophy` after Task 1. Replace:

```ts
<Philosophy
  eyebrow={philosophy.eyebrow}
  heading={philosophy.heading}
  pillars={philosophy.pillars}
/>
```
→
```ts
{cmsSettings?.philosophy && cmsSettings.philosophy.length > 0 && (
  <Philosophy
    eyebrow="Engineering Philosophy"
    heading="How I think about building software"
    pillars={cmsSettings.philosophy}
  />
)}
```

(The eyebrow and heading strings are now hardcoded in the component call — buyers who want to change them can do so in code, or you can add them as SiteSettings fields in a future update.)

- [ ] **Step 3: Delete content/philosophy.ts**

```bash
rm content/philosophy.ts
```

- [ ] **Step 4: Verify no TypeScript errors**

```bash
pnpm tsc --noEmit
```

Expected: no errors related to philosophy imports.

- [ ] **Step 5: Commit**

```bash
git add "app/(site)/page.tsx" components/sections/philosophy.tsx
git rm content/philosophy.ts
git commit -m "feat: philosophy pillars sourced from SiteSettings, remove content/philosophy.ts"
```

---

## Task 15: Delete orphaned content files and make content/site.ts type-only

**Files:**
- Delete: `content/journey.ts`
- Delete: `content/work.ts`
- Modify: `content/site.ts`

`content/journey.ts` and `content/work.ts` have no importers — verified by grep. They are deleted.

`content/site.ts` keeps its TypeScript interfaces (used nowhere as runtime values anymore) but all data is removed. A comment points buyers to the admin panel.

- [ ] **Step 1: Verify no remaining importers of content/site.ts**

```bash
grep -r "content/site" --include="*.ts" --include="*.tsx" . | grep -v node_modules | grep -v ".next"
```

Expected: no results. If any files still import from `content/site`, return to the relevant earlier task.

- [ ] **Step 2: Delete orphaned files**

```bash
rm content/journey.ts content/work.ts
```

- [ ] **Step 3: Rewrite content/site.ts as type-only**

Replace the entire file contents with:

```ts
// ─── Site Identity Types ───────────────────────────────────────────────────────
//
// These types describe the shape of site identity data.
// Runtime values come from the Payload admin panel under Site Settings → Identity.
//
// To update your name, socials, headline, stats, and philosophy:
//   1. Open /admin in your browser
//   2. Go to Globals → Site Settings
//   3. Fill in the Identity, Social Links, and Engineering Philosophy sections

export interface Social {
  platform: 'github' | 'linkedin' | 'instagram' | 'twitter' | 'youtube'
  url: string
  label: string
}

export interface StatusBadge {
  available: boolean
  label: string
}

export interface Stat {
  value: string
  label: string
}
```

- [ ] **Step 4: Run full type check**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Run all tests**

```bash
pnpm vitest run
```

Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git rm content/journey.ts content/work.ts
git add content/site.ts
git commit -m "chore: delete orphaned content files; content/site.ts is now type-only"
```

---

## Task 16: CodeCanyon prep — rename package and rewrite README

**Files:**
- Modify: `package.json`
- Modify: `README.md`

- [ ] **Step 1: Rename package in package.json**

In `package.json`, change:
```json
"name": "flcn-website",
```
→
```json
"name": "payload-portfolio",
```

- [ ] **Step 2: Rewrite README.md**

Replace the existing README with a buyer-focused quick-start. The README should cover:

1. **What this is** — 2–3 sentence description of the template
2. **Tech Stack** — table (Next.js 16, Payload CMS 3, MongoDB, Cloudflare R2, Resend, Tailwind CSS 4)
3. **Prerequisites** — Node.js 20+, pnpm, MongoDB instance, Cloudflare R2 bucket, Resend account (optional)
4. **Quick Start** — numbered steps:
   - `pnpm install`
   - `cp .env.example .env.local` and fill in values
   - `pnpm dev`
   - Open `http://localhost:3000/admin`, create your first user
   - Go to **Globals → Site Settings** — fill in Identity, Social Links, and Philosophy
   - Go to **Timeline** — add your career history
   - Go to **Work** — add your case studies
   - Edit `content/stack.ts` to list your tech stack
   - Deploy to Vercel (or any Node.js host with MongoDB and R2 configured)
5. **Environment Variables** — table of all vars in `.env.example` with descriptions
6. **Deployment** — brief Vercel deploy steps, link to Payload docs for self-hosting
7. **License** — CodeCanyon regular license terms note

```bash
# After writing, verify markdown renders correctly with:
cat README.md | head -50
```

- [ ] **Step 3: Commit**

```bash
git add package.json README.md
git commit -m "chore: rename package to payload-portfolio, rewrite README for buyers"
```

---

## Task 17: Final verification

- [ ] **Step 1: Run full test suite**

```bash
pnpm vitest run
```

Expected: all tests pass.

- [ ] **Step 2: Run TypeScript check**

```bash
pnpm tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 3: Confirm no remaining content/site.ts data imports**

```bash
grep -rn "from '@/content/site'\|from \"@/content/site\"\|from '@/content/philosophy'\|from \"@/content/philosophy\"\|from '@/content/journey'\|from \"@/content/journey\"\|from '@/content/work'\|from \"@/content/work\"" --include="*.ts" --include="*.tsx" . | grep -v node_modules | grep -v ".next" | grep -v "content/site.ts"
```

Expected: no results.

- [ ] **Step 4: Load the homepage in the browser and verify**

With `pnpm dev` running, open `http://localhost:3000`. Confirm:
- Nav renders (with fallback name "Your Name" if admin not yet populated)
- No console errors
- Footer renders with empty socials (no crash)
- Philosophy section hidden (no CMS entries yet — that's correct)

- [ ] **Step 5: Populate admin and verify live update**

In the admin panel, fill in Site Settings → Identity and Social Links. Hard-refresh `http://localhost:3000`. Confirm the nav name, footer socials, and footer location/timezone update.

- [ ] **Step 6: Final commit if any stray changes**

```bash
git status
# if any tracked changes remain:
git add -p
git commit -m "chore: final cleanup for CodeCanyon release"
```
