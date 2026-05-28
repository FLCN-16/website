# Pages Collection with Templates

**Date:** 2026-05-28  
**Status:** Approved

## Overview

Add a `Pages` Payload CMS collection that manages flat content pages with a template system. Two templates ship initially: `legal` (for privacy policy and terms of use) and `basic` (for general-purpose flat pages). Legal page content migrates from the static `content/legal.ts` file into the CMS.

## Collection: Pages

**Slug:** `pages`

### Fields

| Field | Type | Notes |
|---|---|---|
| `title` | text | Required. Used as admin display title. |
| `slug` | text | Required, unique. URL identifier (e.g. `privacy`, `terms`, `about`). |
| `template` | select | Required. Options: `legal`, `basic`. Shown in sidebar. |
| `lastUpdated` | date | Conditional — only shown when `template = legal`. |
| `body` | Lexical rich text | Required. Main page content. |

### Access

Publicly readable with no authentication gate. Admins have full CRUD.

### Admin

- `useAsTitle: "title"`
- Default columns: `title`, `template`, `slug`

## Routing

| Template | URL | Next.js route file |
|---|---|---|
| `legal` | `/legal/[slug]` | `app/(site)/legal/[slug]/page.tsx` |
| `basic` | `/page/[slug]` | `app/(site)/page/[slug]/page.tsx` |

The existing static `/legal/privacy` and `/legal/terms` routes become dynamic. Each route queries Payload for a Page document matching `{ slug, template }` and calls `notFound()` if absent.

## Frontend Pages

### Legal (`app/(site)/legal/[slug]/page.tsx`)

- Replaces current static "Coming soon" pages
- Fetches from Payload: `Pages.find({ where: { slug: { equals: slug }, template: { equals: 'legal' } } })`
- Renders: eyebrow label "Legal", `<h1>` title, "Last updated" date line, Lexical rich text body
- Generates metadata via `createMetadata({ title: page.title })`
- Calls `notFound()` for missing slugs

### Basic (`app/(site)/page/[slug]/page.tsx`)

- New route
- Fetches from Payload: same pattern with `template: 'basic'`
- Renders: `<h1>` title, Lexical rich text body
- No `lastUpdated` display

## Migration

1. Add `Pages` collection to `payload.config.ts`
2. Update `scripts/seed-content.ts` to seed the two legal documents from `content/legal.ts` into the `Pages` collection
3. Delete `content/legal.ts`
4. Replace `app/(site)/legal/privacy/page.tsx` and `app/(site)/legal/terms/page.tsx` with the single dynamic `app/(site)/legal/[slug]/page.tsx`

## Out of Scope

- Block-based page builder
- SEO plugin for Pages (can be added later)
- Search plugin for Pages
