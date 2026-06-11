# CodeCanyon Sale — Productization Design

**Date:** 2026-06-11
**Tier:** $19–$29 lean listing
**Demo:** Existing live site (thefalcon.dev)
**Goal:** Strip personal identity from the codebase and route all personal content through the Payload admin panel so any buyer can make the site their own without touching source code (except `content/stack.ts`).

---

## 1. Data Architecture

All personal content moves out of static TypeScript files and into Payload CMS. No new collections or schema changes are required — the existing architecture already has the right shape.

| Content | Current location | New location |
|---|---|---|
| Name, handle, role, location, email, socials, headline, stats | `content/site.ts` | `SiteSettings` global (new identity + socials fields) |
| Philosophy pillars | `content/philosophy.ts` | `SiteSettings` global (new philosophy array field) |
| Career journey entries | `content/journey.ts` | `Timeline` collection (schema already matches) |
| Work case studies | `content/work.ts` | `Work` collection (schema already matches) |
| Tech stack | `content/stack.ts` | Stays in file — buyer edits directly |

**Files deleted:** `content/philosophy.ts`, `content/journey.ts`, `content/work.ts`

**Files kept as type-only:** `content/site.ts` — interfaces remain, all data removed, comment added pointing buyers to the admin panel.

**No new collections required.** The only schema change is adding fields to the existing `SiteSettings` global (see Section 2). The `Timeline` and `Work` collections already have matching schemas — they just need their data populated.

---

## 2. SiteSettings Field Additions

Two new field groups are added to `globals/SiteSettings.ts`. All existing fields (availability, maintenanceMode, headline, subheadline, eyebrow, stats, resume) remain untouched.

### Identity group

Fields: `name` (text, required), `handle` (text), `role` (text), `location` (text), `timezone` (text), `email` (email), `siteUrl` (text), `description` (textarea, ≤160 chars for meta).

### Socials array

Each entry: `platform` (select: github / linkedin / instagram / twitter / youtube), `url` (text), `label` (text).

### Philosophy array

Each entry: `title` (text, required), `body` (textarea, required). The display number (01, 02, 03) is derived from array index at render time — not stored.

### Resume filename fix

`RESUME_FILENAME` constant in `SiteSettings.ts` changes from `"rishabh-kumar-resume.pdf"` to `"resume.pdf"`. Admin field description is also sanitized to remove the personal name reference.

---

## 3. Data Fetching & Component Changes

### Pattern

All files currently importing from `content/site.ts`, `content/philosophy.ts`, `content/journey.ts`, or `content/work.ts` switch to reading from the appropriate Payload data fetcher:

- `content/site.ts` → `getCachedSiteSettings()` (already exists in `lib/data`)
- `content/philosophy.ts` → same `getCachedSiteSettings()` call (philosophy fields added above)
- `content/journey.ts` → existing Timeline data fetcher
- `content/work.ts` → existing Work collection data fetcher

### Scope

Approximately 25 files import from `content/site.ts`. The change is mechanical and uniform across all of them — replace the static import with an async `getCachedSiteSettings()` call and destructure the needed fields.

### getCachedSiteSettings return type

Extended to include all new identity, socials, and philosophy fields. All consumers automatically get the new fields without further changes.

### Caching

No performance regression. `getCachedSiteSettings()` is already wrapped in `unstable_cache` — it hits MongoDB once per cache lifetime, identical in practice to reading a static TypeScript file.

---

## 4. CodeCanyon Prep

### Package rename

`package.json` `name` field: `"flcn-website"` → `"payload-portfolio"`.

### README rewrite

Replace the current developer-focused README with a buyer-focused quick-start:

1. Install dependencies (`pnpm install`)
2. Copy and fill in `.env.local` from `.env.example`
3. Run `pnpm dev` — admin panel available at `/admin`
4. Create your first admin user
5. Open **Site Settings** in the admin panel and fill in your identity, socials, headline, and philosophy
6. Add your career history via the **Timeline** collection
7. Add your work case studies via the **Work** collection
8. Edit `content/stack.ts` to list your own tech stack
9. Deploy to Vercel (or any Node.js host)

### Env var documentation

`.env.example` is already clean (blank keys, no personal values). Add inline comments explaining what each variable does and where to get it (MongoDB Atlas, Cloudflare R2 dashboard, Resend API keys).

### No seed data

Buyers populate their own content via the admin panel. No seed scripts required for the lean tier.

---

## 5. What Stays Personal / Out of Scope

- `content/stack.ts` — intentionally kept as a code file. Every buyer of this template is a developer; editing a TypeScript file to list their own skills is appropriate. A comment block at the top will instruct them.
- `content/work.ts` — deleted (data moves to Work collection per Section 1).
- All application logic, animations, email templates, consent banner, RSS feed, OG image generation, MCP plugin — untouched.

---

## 6. Success Criteria

- A fresh buyer can clone the repo, fill in `.env.local`, run `pnpm dev`, and have a fully personalized portfolio running by filling in the Payload admin panel — without touching any source file except `content/stack.ts`.
- No personal data from the original author (name, employer history, social URLs, philosophy copy, case studies) remains hardcoded in the codebase.
- The live site at `thefalcon.dev` continues to work identically throughout and after the migration (it is the CodeCanyon demo).
