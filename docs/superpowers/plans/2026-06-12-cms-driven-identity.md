# CMS-Driven Identity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all hardcoded personal data in `structured-data.ts` with values sourced from Payload CMS and existing collections, so every buyer of this CodeCanyon theme gets a fully generic starting point.

**Architecture:** Four fields added to the `identity` group in SiteSettings drive `alternateName` and address in schema.org output. `worksFor` derives from `timelineItems[0]` and `alumniOf` from `educationItems[0]` — both already fetched on the homepage — passed as a second `collections` argument to `personSchema()`. All changes are additive; missing values are gracefully omitted from the schema output.

**Tech Stack:** Payload CMS (GlobalConfig field definitions), TypeScript, Vitest, Next.js App Router

---

## File Map

| File | Change |
|---|---|
| `src/globals/SiteSettings.ts` | Add 4 fields to `identity` group |
| `src/lib/data.ts` | Extend `RawSiteSettings.identity` interface |
| `src/lib/site-identity.ts` | Extend `SiteIdentity` interface + `buildIdentity()` |
| `src/lib/structured-data.ts` | Update `personSchema()` signature and body; update `websiteSchema()` |
| `src/app/(site)/page.tsx` | Thread `timelineItems[0]` + `educationItems[0]` into `personSchema()` |
| `src/lib/__tests__/site-identity.test.ts` | Add tests for 4 new identity fields |
| `src/lib/__tests__/structured-data.test.ts` | New file — tests for `personSchema()` and `websiteSchema()` |

---

## Task 1: Extend the data layer with tests

**Files:**
- Modify: `src/lib/data.ts`
- Modify: `src/lib/site-identity.ts`
- Modify: `src/lib/__tests__/site-identity.test.ts`

- [ ] **Step 1: Add failing tests for the new identity fields**

Append these two `it` blocks inside the existing `describe('buildIdentity', ...)` in `src/lib/__tests__/site-identity.test.ts`:

```ts
it('maps new identity fields when present', () => {
  const settings: RawSiteSettings = {
    identity: {
      name: 'Jane Smith',
      alternateName: 'JD',
      addressCity: 'Austin',
      addressRegion: 'TX',
      addressCountry: 'US',
    },
  }
  const identity = buildIdentity(settings)
  expect(identity.alternateName).toBe('JD')
  expect(identity.addressCity).toBe('Austin')
  expect(identity.addressRegion).toBe('TX')
  expect(identity.addressCountry).toBe('US')
})

it('returns empty strings for new identity fields when not set', () => {
  const identity = buildIdentity(null)
  expect(identity.alternateName).toBe('')
  expect(identity.addressCity).toBe('')
  expect(identity.addressRegion).toBe('')
  expect(identity.addressCountry).toBe('')
})
```

- [ ] **Step 2: Run tests — confirm they fail**

```bash
pnpm test -- --reporter=verbose src/lib/__tests__/site-identity.test.ts
```

Expected: TypeScript error or two failing assertions about unknown properties.

- [ ] **Step 3: Extend `RawSiteSettings.identity` in `src/lib/data.ts`**

Find the `identity?:` block (around line 498) and add four fields before the closing `} | null`:

```ts
identity?: {
  name?: string | null
  handle?: string | null
  role?: string | null
  location?: string | null
  timezone?: string | null
  email?: string | null
  siteUrl?: string | null
  description?: string | null
  alternateName?: string | null
  addressCity?: string | null
  addressRegion?: string | null
  addressCountry?: string | null
} | null
```

- [ ] **Step 4: Extend `SiteIdentity` and `buildIdentity` in `src/lib/site-identity.ts`**

Replace the entire file with:

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
  alternateName: string
  addressCity: string
  addressRegion: string
  addressCountry: string
  socials: Array<{ platform: string; url: string; label: string }>
  resumeUrl: string | null
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
    alternateName: settings?.identity?.alternateName ?? '',
    addressCity: settings?.identity?.addressCity ?? '',
    addressRegion: settings?.identity?.addressRegion ?? '',
    addressCountry: settings?.identity?.addressCountry ?? '',
    socials:
      settings?.socials?.map((s) => ({
        platform: s.platform,
        url: s.url,
        label: s.label ?? s.platform,
      })) ?? [],
    resumeUrl: settings?.resume?.url ?? null,
    status: {
      available: settings?.availability?.available ?? false,
      label: settings?.availability?.label ?? 'OPEN TO ROLES',
    },
  }
}
```

- [ ] **Step 5: Run tests — confirm they pass**

```bash
pnpm test -- --reporter=verbose src/lib/__tests__/site-identity.test.ts
```

Expected: all tests pass including the two new ones.

- [ ] **Step 6: Commit**

```bash
git add src/lib/data.ts src/lib/site-identity.ts src/lib/__tests__/site-identity.test.ts
git commit -m "feat: extend SiteIdentity with alternateName and structured address fields"
```

---

## Task 2: Update schema functions with tests

**Files:**
- Modify: `src/lib/structured-data.ts`
- Create: `src/lib/__tests__/structured-data.test.ts`

- [ ] **Step 1: Create the test file with failing tests**

Create `src/lib/__tests__/structured-data.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { personSchema, websiteSchema } from '../structured-data'
import type { SiteIdentity } from '../site-identity'

const base: SiteIdentity = {
  name: 'Jane Smith',
  handle: 'janesmith',
  role: 'Developer',
  location: 'Austin, TX',
  timezone: 'UTC-6',
  email: 'jane@example.com',
  url: 'https://janesmith.dev',
  description: 'A developer.',
  alternateName: '',
  addressCity: '',
  addressRegion: '',
  addressCountry: '',
  socials: [],
  resumeUrl: null,
  status: { available: false, label: 'OPEN TO ROLES' },
}

describe('personSchema', () => {
  it('omits alternateName when blank', () => {
    const schema = personSchema(base)
    expect(schema).not.toHaveProperty('alternateName')
  })

  it('includes alternateName when set', () => {
    const schema = personSchema({ ...base, alternateName: 'JD' })
    expect((schema as Record<string, unknown>).alternateName).toBe('JD')
  })

  it('omits address when all address fields are blank', () => {
    const schema = personSchema(base)
    expect(schema).not.toHaveProperty('address')
  })

  it('includes address when at least one address field is non-empty', () => {
    const schema = personSchema({
      ...base,
      addressCity: 'Austin',
      addressRegion: 'TX',
      addressCountry: 'US',
    })
    expect((schema as Record<string, unknown>).address).toEqual({
      '@type': 'PostalAddress',
      addressLocality: 'Austin',
      addressRegion: 'TX',
      addressCountry: 'US',
    })
  })

  it('omits worksFor when no currentJob provided', () => {
    const schema = personSchema(base)
    expect(schema).not.toHaveProperty('worksFor')
  })

  it('includes worksFor when currentJob is provided', () => {
    const schema = personSchema(base, { currentJob: { company: 'Acme Corp' } })
    expect((schema as Record<string, unknown>).worksFor).toEqual({
      '@type': 'Organization',
      name: 'Acme Corp',
    })
  })

  it('omits alumniOf when no latestEducation provided', () => {
    const schema = personSchema(base)
    expect(schema).not.toHaveProperty('alumniOf')
  })

  it('includes alumniOf when latestEducation is provided', () => {
    const schema = personSchema(base, { latestEducation: { institution: 'MIT' } })
    expect((schema as Record<string, unknown>).alumniOf).toEqual({
      '@type': 'EducationalOrganization',
      name: 'MIT',
    })
  })
})

describe('websiteSchema', () => {
  it('omits alternateName when blank', () => {
    const schema = websiteSchema(base)
    expect(schema).not.toHaveProperty('alternateName')
  })

  it('includes alternateName when set', () => {
    const schema = websiteSchema({ ...base, alternateName: 'JD Site' })
    expect((schema as Record<string, unknown>).alternateName).toBe('JD Site')
  })
})
```

- [ ] **Step 2: Run tests — confirm they fail**

```bash
pnpm test -- --reporter=verbose src/lib/__tests__/structured-data.test.ts
```

Expected: failures because `personSchema` still has hardcoded values and wrong signature.

- [ ] **Step 3: Replace `src/lib/structured-data.ts` with the updated implementation**

```ts
import type { SiteIdentity } from '@/lib/site-identity'
import { stack } from '@/content/stack'

/** Compact Person reference for author/publisher fields on other schemas */
export function personRef(identity: SiteIdentity) {
  const personId = `${identity.url}/#person`
  return {
    '@type': 'Person',
    '@id': personId,
    name: identity.name,
    url: identity.url,
  }
}

export function personSchema(
  identity: SiteIdentity,
  collections?: {
    currentJob?: { company: string } | null
    latestEducation?: { institution: string } | null
  }
) {
  const personId = `${identity.url}/#person`
  const knowsAbout = [
    ...new Set(
      stack.disciplines.flatMap((d) =>
        d.tools
          .filter((t) => t.maturity === 'expert' || t.maturity === 'proficient')
          .map((t) => t.name)
      )
    ),
  ]

  const hasAddress = identity.addressCity || identity.addressRegion || identity.addressCountry

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': personId,
    name: identity.name,
    ...(identity.alternateName ? { alternateName: identity.alternateName } : {}),
    url: identity.url,
    email: identity.email,
    jobTitle: identity.role,
    description: identity.description,
    sameAs: identity.socials.map((s) => s.url),
    ...(hasAddress
      ? {
          address: {
            '@type': 'PostalAddress',
            addressLocality: identity.addressCity,
            addressRegion: identity.addressRegion,
            addressCountry: identity.addressCountry,
          },
        }
      : {}),
    ...(collections?.currentJob
      ? { worksFor: { '@type': 'Organization', name: collections.currentJob.company } }
      : {}),
    ...(collections?.latestEducation
      ? { alumniOf: { '@type': 'EducationalOrganization', name: collections.latestEducation.institution } }
      : {}),
    knowsAbout,
  }
}

export function websiteSchema(identity: SiteIdentity) {
  const websiteId = `${identity.url}/#website`
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': websiteId,
    name: identity.name,
    ...(identity.alternateName ? { alternateName: identity.alternateName } : {}),
    url: identity.url,
    description: identity.description,
    inLanguage: 'en',
    publisher: personRef(identity),
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${identity.url}/writing?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function breadcrumbSchema(identity: SiteIdentity, items: { name: string; path?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.path ? { item: `${identity.url}${item.path}` } : {}),
    })),
  }
}
```

- [ ] **Step 4: Run tests — confirm they pass**

```bash
pnpm test -- --reporter=verbose src/lib/__tests__/structured-data.test.ts
```

Expected: all 10 tests pass.

- [ ] **Step 5: Run full test suite — confirm no regressions**

```bash
pnpm test
```

Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/lib/structured-data.ts src/lib/__tests__/structured-data.test.ts
git commit -m "feat: make personSchema and websiteSchema fully CMS-driven"
```

---

## Task 3: Add CMS fields to SiteSettings

**Files:**
- Modify: `src/globals/SiteSettings.ts`

- [ ] **Step 1: Add 4 fields to the `identity` group after the `description` field**

In `src/globals/SiteSettings.ts`, find the closing of the `description` field object (around line 167 — ends with `},`). Insert these four field definitions immediately after it, before the closing `],` of the `identity` group's `fields` array:

```ts
{
  name: 'alternateName',
  type: 'text',
  label: 'Brand / Alias',
  admin: { description: 'e.g. The Falcon — used in schema.org as alternateName. Leave blank to omit.' },
},
{
  name: 'addressCity',
  type: 'text',
  label: 'City',
  admin: { description: 'e.g. San Francisco — used in schema.org structured data' },
},
{
  name: 'addressRegion',
  type: 'text',
  label: 'State / Region',
  admin: { description: 'e.g. CA or Punjab — used in schema.org structured data' },
},
{
  name: 'addressCountry',
  type: 'text',
  label: 'Country Code',
  admin: { description: 'ISO 2-letter code, e.g. US or IN — used in schema.org structured data' },
},
```

- [ ] **Step 2: Run the full test suite — confirm no regressions**

```bash
pnpm test
```

Expected: all tests pass (Payload config changes don't affect unit tests).

- [ ] **Step 3: Commit**

```bash
git add src/globals/SiteSettings.ts
git commit -m "feat: add alternateName and address fields to SiteSettings identity group"
```

---

## Task 4: Update homepage call site

**Files:**
- Modify: `src/app/(site)/page.tsx`

- [ ] **Step 1: Thread collection data into `personSchema()`**

In `src/app/(site)/page.tsx`, find the line:

```tsx
<JsonLd data={personSchema(identity)} />
```

Replace it with:

```tsx
<JsonLd data={personSchema(identity, {
  currentJob: timelineItems[0] ?? null,
  latestEducation: educationItems[0] ?? null,
})} />
```

`timelineItems` and `educationItems` are already declared in scope above (populated via `Promise.allSettled`). `timelineItems[0]` is the entry with `order: 1` (the current role). `educationItems[0]` is the primary education record. Both are `undefined` if the array is empty — the `?? null` coerces to `null` so the schema functions treat them as absent.

- [ ] **Step 2: Run the full test suite**

```bash
pnpm test
```

Expected: all tests pass.

- [ ] **Step 3: Confirm TypeScript compiles cleanly**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/(site)/page.tsx
git commit -m "feat: thread timeline and education into personSchema on homepage"
```

---

## Done

All hardcoded personal data is now CMS-driven. A new buyer fills in Site Settings → Identity (brand alias, city, region, country) and populates their Timeline + Education collections; the Person schema self-assembles from those values with no code edits required.
