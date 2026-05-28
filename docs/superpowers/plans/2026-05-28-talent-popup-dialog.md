# Talent Popup Dialog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a one-time "Looking for Talent?" popup dialog that shows 15 seconds after any page visit, renders a CMS-managed form (email + pitch), accepts an optional JD file attached to a Resend notification email, and writes a `form-submissions` DB entry only when the form's `enabled` toggle is true.

**Architecture:** The form definition is fetched server-side in the site layout using the Payload local API and passed as a prop to a client component — no client-side fetch needed. The client component owns the 15-second timer and `localStorage` show-once logic. A server action handles submission: conditional `form-submissions` DB write (gated on `enabled`) + Resend email with optional JD file attachment. The JD file is transient — used only for the email attachment, never stored.

**Tech Stack:** Next.js 16 (App Router), Payload CMS 3 + form builder plugin, React 19, shadcn dialog, Resend, TypeScript

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `payload.config.ts` | Add `formOverrides` with `enabled` checkbox to form builder |
| Create | `actions/talent-inquiry.ts` | Server action: conditional DB write + Resend email with attachment |
| Create | `components/site/talent-inquiry-dialog.tsx` | Client component: 15s timer, localStorage, form renderer, file input |
| Modify | `app/(site)/layout.tsx` | Fetch form server-side, pass to dialog component |

---

## Task 1: Add `enabled` field to form builder plugin

**Files:**
- Modify: `payload.config.ts`

- [ ] **Step 1: Add `formOverrides` to the existing `formBuilderPlugin()` call**

Open `payload.config.ts`. The current call looks like:

```ts
formBuilderPlugin({
  fields: { ... },
  defaultToEmail: "hello@thefalcon.dev",
}),
```

Replace it with:

```ts
formBuilderPlugin({
  formOverrides: {
    fields: [
      {
        name: "enabled",
        type: "checkbox",
        defaultValue: true,
        label: "Enable Submissions (DB write)",
        admin: { position: "sidebar" },
      },
    ],
  },
  fields: {
    text: true,
    textarea: true,
    select: true,
    email: true,
    checkbox: true,
    number: true,
    message: true,
    date: false,
    payment: false,
  },
  defaultToEmail: "hello@thefalcon.dev",
}),
```

- [ ] **Step 2: Regenerate Payload types**

```bash
pnpm payload generate:types
```

Expected: `payload-types.ts` updates. Confirm the `Form` interface now includes `enabled?: boolean | null`.

- [ ] **Step 3: Verify dev server starts without error**

```bash
pnpm dev
```

Expected: server starts, no TypeScript or config errors. Stop with Ctrl+C.

- [ ] **Step 4: Commit**

```bash
git add payload.config.ts payload-types.ts
git commit -m "feat(forms): add enabled toggle to form builder via formOverrides"
```

---

## Task 2: Create the `submitTalentInquiry` server action

**Files:**
- Create: `actions/talent-inquiry.ts`

This action receives `FormData`, conditionally writes a `form-submissions` entry (based on `enabled`), and always sends a Resend notification email with the JD file attached if present.

- [ ] **Step 1: Create `actions/talent-inquiry.ts`**

```ts
"use server"

import { Resend } from "resend"
import { getPayload } from "payload"
import config from "@payload-config"
import { site } from "@/content/site"
import type { Form } from "@/payload-types"

export type TalentInquiryResult = { ok: boolean; error?: string }

export async function submitTalentInquiry(formData: FormData): Promise<TalentInquiryResult> {
  const formId = formData.get("formId")
  const email = formData.get("email")
  const pitch = formData.get("pitch")
  const jdFile = formData.get("jdFile")

  if (typeof formId !== "string" || typeof email !== "string" || !email) {
    return { ok: false, error: "Invalid submission data." }
  }

  const pitchText = typeof pitch === "string" ? pitch.trim() : ""
  const file = jdFile instanceof File && jdFile.size > 0 ? jdFile : null

  try {
    const payload = await getPayload({ config })

    // Fetch form to read enabled flag
    const form = await payload.findByID({
      collection: "forms",
      id: formId,
    }) as Form & { enabled?: boolean | null }

    // Conditionally write DB entry
    if (form.enabled !== false) {
      await payload.create({
        collection: "form-submissions",
        data: {
          form: formId,
          submissionData: [
            { field: "email", value: email },
            { field: "pitch", value: pitchText },
          ],
        },
      })
    }

    // Always send email
    if (!process.env.RESEND_API_KEY) {
      console.warn("[talent-inquiry] RESEND_API_KEY not set — skipping email")
      return { ok: true }
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const from = process.env.RESEND_FROM ?? `Rishabh Kumar <hello@thefalcon.dev>`
    const to = process.env.RESEND_TO ?? site.email

    let attachments: { filename: string; content: Buffer }[] | undefined
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer())
      attachments = [{ filename: file.name, content: buffer }]
    }

    await resend.emails.send({
      from,
      to,
      subject: "[thefalcon.dev] New talent inquiry",
      html: `
        <p><strong>Email:</strong> ${email}</p>
        ${pitchText ? `<p><strong>Pitch / JD:</strong></p><p style="white-space:pre-wrap">${pitchText}</p>` : ""}
        ${file ? `<p><em>JD file attached: ${file.name}</em></p>` : ""}
      `,
      attachments,
    })

    return { ok: true }
  } catch (err) {
    console.error("[talent-inquiry] Error:", err)
    return { ok: false, error: "Failed to send. Please email me directly." }
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add actions/talent-inquiry.ts
git commit -m "feat(talent): add submitTalentInquiry server action"
```

---

## Task 3: Create `TalentInquiryDialog` client component

**Files:**
- Create: `components/site/talent-inquiry-dialog.tsx`

The component receives the form definition as a prop (fetched server-side), manages the 15s timer, `localStorage` show-once logic, renders CMS-driven fields dynamically, and includes a hardcoded file input.

- [ ] **Step 1: Check if `Spinner` component exists**

```bash
cat components/ui/spinner.tsx
```

If the file exists and exports a `Spinner` component, use the import in Step 2 as written. If it does not exist, replace `<Spinner className="mr-2 h-3 w-3" />` in the component with nothing — the button text alone is sufficient.

- [ ] **Step 2: Create `components/site/talent-inquiry-dialog.tsx`**

```tsx
"use client"

import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { submitTalentInquiry } from "@/actions/talent-inquiry"
import type { Form } from "@/payload-types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"

const STORAGE_KEY = "talent_popup_seen"
const DELAY_MS = 15_000

interface Props {
  form: Form
}

export function TalentInquiryDialog({ form }: Props) {
  const [open, setOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return
    const timer = setTimeout(() => setOpen(true), DELAY_MS)
    return () => clearTimeout(timer)
  }, [])

  function handleOpenChange(next: boolean) {
    if (!next) {
      localStorage.setItem(STORAGE_KEY, "1")
    }
    setOpen(next)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsPending(true)

    const fd = new FormData(e.currentTarget)
    fd.set("formId", form.id)

    const result = await submitTalentInquiry(fd)

    if (result.ok) {
      localStorage.setItem(STORAGE_KEY, "1")
      setOpen(false)
      toast.success("Details sent.")
    } else {
      setError(result.error ?? "Something went wrong. Please try again.")
    }

    setIsPending(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Opportunity
          </p>
          <DialogTitle className="font-mono text-base uppercase tracking-widest">
            Looking for Talent?
          </DialogTitle>
          <DialogDescription>
            Hiring or have an opportunity?
          </DialogDescription>
        </DialogHeader>

        <p className="text-xs text-muted-foreground leading-relaxed">
          If you&apos;re building something that demands precision and are looking
          for a full-time Front-End Technical Lead, I&apos;d love to hear about it.
          <br />
          <span className="font-medium text-foreground">
            Please note: I am only open to full-time opportunities (no freelance or contract work).
          </span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* CMS-driven fields */}
          {form.fields?.map((field) => {
            if (field.blockType === "email") {
              return (
                <div key={field.id ?? field.name}>
                  <Label
                    htmlFor={`talent-${field.name}`}
                    className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-1.5 block"
                  >
                    {field.label ?? "Email Address"}
                    {field.required && " *"}
                  </Label>
                  <Input
                    id={`talent-${field.name}`}
                    type="email"
                    name={field.name}
                    required={field.required ?? false}
                    placeholder="you@company.com"
                    autoComplete="email"
                    className="h-10 px-3 text-sm"
                  />
                </div>
              )
            }

            if (field.blockType === "textarea") {
              return (
                <div key={field.id ?? field.name}>
                  <Label
                    htmlFor={`talent-${field.name}`}
                    className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-1.5 block"
                  >
                    {field.label ?? "Message"}
                  </Label>
                  <Textarea
                    id={`talent-${field.name}`}
                    name={field.name}
                    required={field.required ?? false}
                    rows={4}
                    className="px-3 py-2 text-sm resize-none"
                  />
                </div>
              )
            }

            return null
          })}

          {/* Static file input */}
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-1.5">
              Or Attach JD File
            </p>
            <div className="flex items-center gap-3">
              <input
                ref={fileRef}
                type="file"
                name="jdFile"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="font-mono text-xs uppercase tracking-widest"
                onClick={() => fileRef.current?.click()}
              >
                Browse Files
              </Button>
              {fileName && (
                <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                  {fileName}
                </span>
              )}
            </div>
          </div>

          {error && (
            <p className="text-xs text-destructive font-mono">{error}</p>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="w-full font-mono uppercase tracking-widest text-xs"
          >
            {isPending ? <Spinner className="mr-2 h-3 w-3" /> : null}
            {isPending ? "Sending…" : (form.submitButtonLabel ?? "Send Details")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/site/talent-inquiry-dialog.tsx
git commit -m "feat(talent): add TalentInquiryDialog client component"
```

---

## Task 4: Fetch form server-side and mount dialog in layout

**Files:**
- Modify: `app/(site)/layout.tsx`

The site layout is already a server component that calls `getPayload`. We add a form fetch alongside the existing maintenance mode check and mount the dialog.

- [ ] **Step 1: Add imports to `app/(site)/layout.tsx`**

Add these two imports alongside the existing imports at the top of the file:

```tsx
import { TalentInquiryDialog } from "@/components/site/talent-inquiry-dialog"
import type { Form } from "@/payload-types"
```

- [ ] **Step 2: Update `SiteLayout` to fetch the form and mount the dialog**

Replace the entire `SiteLayout` function body with:

```tsx
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  let talentForm: Form | null = null

  try {
    const payload = await getPayload({ config })

    const settings = await payload.findGlobal({ slug: "site-settings" })
    const mm = settings.maintenanceMode as { enabled?: boolean | null } | null | undefined
    if (mm?.enabled) {
      redirect("/maintenance")
    }

    const formsResult = await payload.find({
      collection: "forms",
      where: { slug: { equals: "talent-inquiry" } },
      limit: 1,
      depth: 0,
    })
    talentForm = (formsResult.docs[0] as Form) ?? null
  } catch (err) {
    unstable_rethrow(err)
    // CMS unreachable — proceed without dialog
  }

  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      {process.env.NEXT_PUBLIC_GTM_ID && (
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
      )}
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SplashScreen />
          {talentForm && <TalentInquiryDialog form={talentForm} />}
          <QueryProvider>
            <SiteFrame>{children}</SiteFrame>
          </QueryProvider>
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add "app/(site)/layout.tsx"
git commit -m "feat(talent): mount TalentInquiryDialog in site layout"
```

---

## Task 5: Create the form in Payload admin

This task has no code — it is a manual step to create the `talent-inquiry` form in the Payload CMS admin so the dialog has something to render.

- [ ] **Step 1: Open Payload admin**

Navigate to `/admin/collections/forms/create`.

- [ ] **Step 2: Fill in the form document**

| Field | Value |
|-------|-------|
| Title | `Talent Inquiry` |
| Slug | `talent-inquiry` |
| Submit Button Label | `SEND DETAILS` |
| Enable Submissions (DB write) | ✅ checked |

Add two fields using the field builder UI:

**Field 1:**
- Type: `Email`
- Label: `EMAIL ADDRESS`
- Name: `email`
- Required: ✅

**Field 2:**
- Type: `Textarea`
- Label: `JOB DESCRIPTION / PITCH`
- Name: `pitch`
- Required: ❌

- [ ] **Step 3: Save the form document**

Click Save. The dialog will now render on the live site after 15 seconds.

- [ ] **Step 4: Smoke-test in dev**

Start the dev server:

```bash
pnpm dev
```

Open `http://localhost:3000`. To test without waiting 15s, temporarily change `DELAY_MS` to `1000` in `components/site/talent-inquiry-dialog.tsx`, save, and reload.

Verify:
1. Dialog opens with title "Looking for Talent?", email field, textarea field, file browse button
2. File input accepts `.pdf/.doc/.docx` and shows filename
3. Submitting with a valid email shows "Details sent." toast and closes dialog
4. Refreshing and waiting does NOT re-show the dialog (localStorage key `talent_popup_seen` is set)
5. Run `localStorage.removeItem('talent_popup_seen')` in browser console → dialog reappears after delay
6. Revert `DELAY_MS` to `15_000` and commit nothing (dev-only change)

---

## Notes

- **`enabled` toggle:** Controls only whether a `form-submissions` DB entry is written. The popup still shows and the email still sends regardless of this toggle.
- **Suppressing the popup entirely:** Delete or unpublish the form document in Payload admin — the layout will get `null` for `talentForm` and skip rendering the component.
- **JD file storage:** The file is never written to S3/R2. It is read into a `Buffer` in the server action, attached to the Resend email, then garbage-collected.
- **Show-once:** Uses `localStorage` (persistent across sessions). Clearing site data in the browser will reset it.
