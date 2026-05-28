# Talent Popup Dialog — Design Spec

**Date:** 2026-05-28  
**Status:** Approved (revised)

---

## Overview

A one-time popup dialog shown to site visitors 15 seconds after landing on the website. It surfaces a "Looking for Talent?" form aimed at recruiters or hiring managers pitching a full-time Front-End Technical Lead opportunity. The form is managed entirely via Payload CMS Form Builder — fields, labels, and copy are editable in the admin without touching code.

---

## Goals

- Surface talent opportunity leads passively (no navigation required)
- Collect email + pitch text and/or a JD file attached to the notification email
- Show exactly once per browser (localStorage, persists across sessions)
- CMS-driven form definition — editable from Payload admin
- Toggle in Payload admin to disable DB writes without hiding the popup

---

## Data Layer

### Payload Form Builder — No custom collection

Uses the form builder plugin's built-in `forms` and `form-submissions` collections. No new collection is created.

**Form slug:** `talent-inquiry`

**Fields defined in Payload admin:**
| Field type | Label | Required |
|---|---|---|
| `email` | EMAIL ADDRESS | Yes |
| `textarea` | JOB DESCRIPTION / PITCH | No |

**Custom field added via `formOverrides`:**
| Field | Type | Default | Position | Purpose |
|---|---|---|---|---|
| `enabled` | checkbox | `true` | sidebar | Controls whether DB entries are created on submit |

**Behaviour of `enabled` flag:**
- `enabled = true`: submission creates a `form-submissions` DB entry AND sends notification email
- `enabled = false`: popup still shows and submits, email still sent, but NO `form-submissions` DB entry is created

### Payload config change (`payload.config.ts`)

Add `formOverrides` to the existing `formBuilderPlugin()` call:

```ts
formBuilderPlugin({
  formOverrides: {
    fields: [
      {
        name: 'enabled',
        type: 'checkbox',
        defaultValue: true,
        label: 'Enable Submissions (DB write)',
        admin: { position: 'sidebar' },
      },
    ],
  },
  fields: { /* existing */ },
  defaultToEmail: 'hello@thefalcon.dev',
})
```

---

## Server Action

**File:** `actions/talent-inquiry.ts`

**Input:** `FormData` containing `formId`, `email`, `pitch` (optional), `jdFile` (optional `File`)

**Steps:**
1. Fetch the form document by ID to read the `enabled` flag.
2. If `enabled === true`: create a `form-submissions` entry via `payload.create({ collection: 'form-submissions', data: { form: formId, submissionData: [...] } })`.
3. If `enabled === false`: skip DB write.
4. Always: send Resend notification email to owner. If `jdFile` is present, attach it as a binary attachment. Email includes email address + pitch text.
5. Return `{ ok: true }` or `{ ok: false, error: string }`.

**File handling:** The JD file is never stored — it is read into a `Buffer` server-side, attached to the Resend email, and discarded. No upload to S3/R2.

---

## Frontend Component

**File:** `components/site/talent-inquiry-dialog.tsx`  
**Type:** `"use client"`

### Data Fetching

On mount: fetch the form by slug `talent-inquiry` from the Payload REST API:
```
GET /api/forms?where[slug][equals]=talent-inquiry&depth=0&limit=1
```
Fetch happens immediately on mount (not waiting for the 15s timer) so the form is ready when the dialog opens.

### Show-once Logic

```
const STORAGE_KEY = "talent_popup_seen"

On mount (after form fetch):
  if localStorage.getItem(STORAGE_KEY) → return, skip timer
  timer = setTimeout(() => setOpen(true), 15_000)
  cleanup: clearTimeout(timer)

On dialog close (any path — X button, overlay click, Escape, successful submit):
  localStorage.setItem(STORAGE_KEY, "1")
```

### Form Rendering

Fields are rendered dynamically from the fetched form definition:
- `email` field type → `<Input type="email" />`
- `textarea` field type → `<Textarea />`
- Unknown field types → skip

Hardcoded static elements (not CMS-driven):
- "OR ATTACH JD FILE" separator
- Hidden `<input type="file" accept=".pdf,.doc,.docx" />` triggered by styled "BROWSE FILES" button
- Selected filename shown inline after selection

### States

| State | Behaviour |
|---|---|
| Loading form | Dialog stays closed; timer starts only after form loads successfully |
| Timer running | Dialog closed, no render cost |
| Open | Dialog visible, form ready |
| Submitting | Submit button disabled + spinner |
| Success | Toast "Details sent." → dialog closes → localStorage flag set |
| Error | Inline error below submit; dialog stays open |
| Form not found | Timer never fires; silent fail (no dialog shown) |

### Styling

- Uses existing `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription` from `components/ui/dialog.tsx`
- Title: "LOOKING FOR TALENT?" — `font-mono uppercase tracking-widest`
- Subtitle: "Hiring or have an opportunity?" — `text-muted-foreground`
- Description copy — static, hardcoded in component
- File browse area: dashed border, muted background
- Submit button label comes from form definition (`submitButtonLabel` field)

---

## Mount Point

`app/(site)/layout.tsx` — `<TalentInquiryDialog />` added alongside `<SplashScreen />`. No props. Fully self-contained.

---

## Files to Create / Modify

| Action | Path | Notes |
|---|---|---|
| Modify | `payload.config.ts` | Add `formOverrides` with `enabled` field to `formBuilderPlugin` |
| Create | `actions/talent-inquiry.ts` | Server action: conditional DB write + Resend email with attachment |
| Create | `components/site/talent-inquiry-dialog.tsx` | Client component: fetch form, 15s timer, dialog + form renderer |
| Modify | `app/(site)/layout.tsx` | Mount `<TalentInquiryDialog />` |

---

## Out of Scope

- Showing the dialog on specific pages only (fires site-wide)
- Rate limiting
- Analytics tracking on dialog open/submit
- Admin UI customisation beyond default form builder
