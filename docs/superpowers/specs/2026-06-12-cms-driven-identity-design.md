# CMS-Driven Identity & Schema.org Design

**Date:** 2026-06-12
**Status:** Approved
**Scope:** Make all hardcoded personal data in `structured-data.ts` dynamic and CMS-driven via Payload, in preparation for CodeCanyon sale.

---

## Problem

Several values in `src/lib/structured-data.ts` are hardcoded to the original author's details:

| Value | Location |
|---|---|
| `alternateName: 'The Falcon'` | `personSchema` + `websiteSchema` |
| `addressLocality: 'Jalandhar'` | `personSchema` |
| `addressRegion: 'Punjab'` | `personSchema` |
| `addressCountry: 'IN'` | `personSchema` |
| `worksFor.name: 'DigiMantra Labs Pvt. Ltd.'` | `personSchema` |
| `alumniOf.name: 'Amity University Online'` | `personSchema` |

A buyer purchasing this theme on CodeCanyon would ship the original author's schema data unless they edit source code. All of these must come from the CMS.

---

## Approach: Option A — Thread collections into `personSchema()`

`worksFor` derives from the first (lowest-`order`) Timeline entry. `alumniOf` derives from the first (lowest-`order`) Education entry. The homepage already fetches both collections for display — no extra queries. `personSchema()` gains a second optional `collections` parameter; all other call sites are unaffected.

---

## Section 1: CMS Fields

**File:** `src/globals/SiteSettings.ts`

Four new fields added inside the existing `identity` group, after `description`:

| Field name | Payload type | Admin label | Hint |
|---|---|---|---|
| `alternateName` | `text` | Brand / Alias | e.g. The Falcon |
| `addressCity` | `text` | City | e.g. San Francisco |
| `addressRegion` | `text` | State / Region | e.g. CA or Punjab |
| `addressCountry` | `text` | Country Code | ISO 2-letter code, e.g. US or IN |

All fields are optional. Blank values are treated as absent — no partial schema blocks emitted.

---

## Section 2: Data Layer

### `src/lib/data.ts` — `RawSiteSettings.identity`

Add four optional nullable fields:

```ts
alternateName?: string | null
addressCity?: string | null
addressRegion?: string | null
addressCountry?: string | null
```

### `src/lib/site-identity.ts` — `SiteIdentity` interface

Add four non-nullable fields (consumers never null-check):

```ts
alternateName: string
addressCity: string
addressRegion: string
addressCountry: string
```

### `buildIdentity()` mappings

```ts
alternateName:  settings?.identity?.alternateName  ?? '',
addressCity:    settings?.identity?.addressCity    ?? '',
addressRegion:  settings?.identity?.addressRegion  ?? '',
addressCountry: settings?.identity?.addressCountry ?? '',
```

`getCachedSiteSettings()` requires no changes — it fetches the full global already.

---

## Section 3: Schema Functions

**File:** `src/lib/structured-data.ts`

### `personSchema()` signature

```ts
export function personSchema(
  identity: SiteIdentity,
  collections?: {
    currentJob?: { company: string } | null
    latestEducation?: { institution: string } | null
  }
)
```

### Replacement rules

| Was | Becomes |
|---|---|
| `alternateName: 'The Falcon'` | `...(identity.alternateName ? { alternateName: identity.alternateName } : {})` |
| `address: { addressLocality: 'Jalandhar', ... }` | Emitted only when at least one of `addressCity/Region/Country` is non-empty; uses identity fields |
| `worksFor: { name: 'DigiMantra…' }` | Emitted only when `collections?.currentJob` is provided |
| `alumniOf: { name: 'Amity…' }` | Emitted only when `collections?.latestEducation` is provided |

`worksFor` uses `{ '@type': 'Organization', name: currentJob.company }`. No URL — Timeline has no company URL field.

### `websiteSchema()` change

```ts
// before
alternateName: 'The Falcon',

// after
...(identity.alternateName ? { alternateName: identity.alternateName } : {}),
```

---

## Section 4: Homepage Call Site

**File:** `src/app/(site)/page.tsx`

`timelineItems` and `educationItems` are already fetched in the same `Promise.allSettled` block. Thread `[0]` of each into `personSchema()`:

```tsx
<JsonLd data={personSchema(identity, {
  currentJob: timelineItems[0] ?? null,
  latestEducation: educationItems[0] ?? null,
})} />
```

`timelineItems` is sorted by `order` ascending (1 = current role). `educationItems[0]` is the primary/most recent education record by the same sort. No extra fetches.

---

## Out of Scope

- Adding a `url` field to the Timeline collection for `worksFor.url` — can be done as a follow-up if needed.
- Making `knowsAbout` dynamic (currently derived from `src/content/stack.ts`) — separate task.
- Email sender name (`RESEND_FROM_NAME` env var) — env-driven, acceptable for a product.
