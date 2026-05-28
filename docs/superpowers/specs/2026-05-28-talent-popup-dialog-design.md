# Talent Popup Dialog — Design Spec

**Date:** 2026-05-28
**Status:** Approved

---

## Overview

A one-time popup dialog shown to site visitors 15 seconds after they land on the website. It surfaces a "Looking for Talent?" form aimed at recruiters or hiring managers who want to pitch a full-time Front-End Technical Lead opportunity. Submissions are stored in a dedicated Payload CMS collection and trigger an email notification to the site owner.

---

## Goals

- Surface talent opportunity leads passively (no navigation required)
- Collect email + pitch text and/or a JD file attachment
- Show exactly once per browser (never again after dismissal or submission)
- Integrate cleanly with existing Payload CMS, Resend email, and react-hook-form patterns

---

## Data Layer

### New Payload Collection: `TalentInquiries`

**File:** `collections/TalentInquiries.ts`

| Field | Type | Required | Notes |
|---|---|---|---|
| `email` | email | Yes | Indexed |
| `pitch` | textarea | No | Written pitch or JD copy-paste |
| `jdFile` | relationship → Media | No | Uploaded PDF/DOC via Payload Media |
| `submittedAt` | date | Auto | Set via `beforeChange` hook |
| `ip` | text | Auto | Set via `afterOperation` hook; hidden in admin |

**Validation rule (collection-level):** At least one of `pitch` or `jdFile` must be present (enforced in Zod on the client; server action also validates before writing).

**Access:**
- `create`: public
- `read / update / delete`: authenticated only

**Hook:** `afterChange` — send Resend email to site owner with submission summary (email, pitch excerpt, JD file link if present).

---

## Server Action

**File:** `actions/talent.ts`

**Zod schema** (`lib/schemas/talent.ts`):
```
email: z.string().email()
pitch: z.string().optional()
jdFileId: z.string().optional()   // Media document ID, resolved before validation
```

Constraint: `pitch` or `jdFileId` must be present (`.refine()`).

**Steps:**
1. Validate FormData with Zod schema.
2. If file present: `POST /api/media` (multipart) to upload to Payload → Cloudflare R2. Extract returned document `id`.
3. Create `TalentInquiries` document via Payload local API (`getPayload().create()`).
4. Send owner notification email via Resend (inline, same pattern as `actions/contact.ts`).
5. Return `{ success: true }` or `{ success: false, error: string }`.

---

## Component

**File:** `components/site/talent-dialog.tsx`

**Type:** Client component (`"use client"`)

### Show-once Logic

```
const STORAGE_KEY = "talent_popup_seen"

On mount (useEffect):
  if localStorage.getItem(STORAGE_KEY) → return early, never set timer
  timer = setTimeout(() => setOpen(true), 15_000)
  return () => clearTimeout(timer)

On dismiss (onOpenChange false) or successful submit:
  localStorage.setItem(STORAGE_KEY, "1")
```

### Form

- Library: `react-hook-form` with Zod resolver
- Fields:
  - `email` — `<Input type="email" />` (required, labeled "EMAIL ADDRESS *")
  - `pitch` — `<Textarea />` (optional, labeled "JOB DESCRIPTION / PITCH", auto-resize)
  - `jdFile` — hidden `<input type="file" accept=".pdf,.doc,.docx" />` triggered by a styled "BROWSE FILES" button; shows selected filename inline
- "OR" visual separator between textarea and file input areas
- Submit button: "SEND DETAILS" — shows loading spinner during submission (`useTransition` or `isPending` from `useFormStatus`)

### States

| State | Behaviour |
|---|---|
| Idle (timer running) | Dialog closed, no render cost |
| Open | Dialog visible, form empty |
| Submitting | Button disabled + spinner |
| Success | Dialog auto-closes; localStorage flag set; Sonner toast "Details sent!" |
| Error | Inline error message below submit button; dialog stays open |

### Styling Notes

- Uses existing `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription` from `components/ui/dialog.tsx`
- Dialog max-width: `sm` (already the default)
- Title: uppercase, tracking-widest — matches site typography style
- File browse area: dashed border, subtle background, matches existing UI patterns
- Close button (X) shown via the default `DialogContent` behaviour — `onOpenChange(false)` fires on X click, overlay click, or Escape; all paths set the localStorage flag

---

## Mount Point

`app/(site)/layout.tsx` — `<TalentDialog />` added alongside `<SplashScreen />` and `<Toaster />`. No props. Fully self-contained.

---

## Files to Create / Modify

| Action | Path |
|---|---|
| Create | `collections/TalentInquiries.ts` |
| Create | `lib/schemas/talent.ts` |
| Create | `actions/talent.ts` |
| Create | `components/site/talent-dialog.tsx` |
| Modify | `payload.config.ts` — add `TalentInquiries` to `collections` array |
| Modify | `app/(site)/layout.tsx` — mount `<TalentDialog />` |

---

## Out of Scope

- Admin UI customisation for TalentInquiries beyond default Payload admin
- Showing the dialog on specific pages only (fires site-wide)
- Rate limiting (Payload access control is sufficient for this use case)
- Analytics event tracking on dialog open/submit
