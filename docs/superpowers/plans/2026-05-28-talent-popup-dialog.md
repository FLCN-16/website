# Talent Popup Dialog — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a "Looking for Talent?" dialog that shows once per browser (15-second delay) with a form that saves submissions to a new Payload CMS `TalentInquiries` collection and emails the site owner.

**Architecture:** New `TalentInquiries` Payload collection stores email + pitch + optional JD file (via Media upload). A Next.js server action handles validation, file upload, document creation, and Resend notification. A client-side `TalentDialog` component controls show-once behaviour via `localStorage` with a 15-second `setTimeout`, mounted in the site layout.

**Tech Stack:** Payload CMS v3 (MongoDB + Cloudflare R2 via S3 plugin), react-hook-form v7 + Zod v4, Resend + React Email, shadcn/ui Dialog, Next.js 16 App Router server actions, Vitest.

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `collections/TalentInquiries.ts` | Payload collection: fields, access, admin config |
| Modify | `payload.config.ts` | Register `TalentInquiries` collection |
| Create | `lib/schemas/talent.ts` | Zod schema for email + pitch fields |
| Create | `lib/__tests__/talent.test.ts` | Vitest unit tests for the Zod schema |
| Create | `emails/talent-notification.tsx` | React Email template for owner notification |
| Create | `actions/talent.ts` | Server action: validate → upload → create doc → send email |
| Create | `components/site/talent-dialog.tsx` | Client component: Dialog, form, show-once logic |
| Modify | `app/(site)/layout.tsx` | Mount `<TalentDialog />` inside `<ThemeProvider>` |

---

## Task 1: Payload Collection — `TalentInquiries`

**Files:**
- Create: `collections/TalentInquiries.ts`
- Modify: `payload.config.ts`

- [ ] **Step 1: Create the collection file**

Create `collections/TalentInquiries.ts` with this exact content:

```ts
import type { CollectionConfig } from "payload";

export const TalentInquiries: CollectionConfig = {
  slug: "talent-inquiries",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "submittedAt"],
  },
  access: {
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: "email", type: "email", required: true },
    { name: "pitch", type: "textarea" },
    {
      name: "jdFile",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "submittedAt",
      type: "date",
      admin: { position: "sidebar" },
    },
    {
      name: "ip",
      type: "text",
      admin: { position: "sidebar", readOnly: true },
    },
  ],
};
```

- [ ] **Step 2: Register the collection in `payload.config.ts`**

In `payload.config.ts`, add the import after the `Pages` import:

```ts
import { TalentInquiries } from "./collections/TalentInquiries";
```

Then add `TalentInquiries` to the `collections` array on line 35:

```ts
collections: [Users, Posts, Media, Submissions, Work, Projects, Timeline, Education, Certifications, Pages, TalentInquiries],
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd /root/Work/flcn-website && pnpm tsc --noEmit 2>&1 | head -20
```

Expected: no errors related to `TalentInquiries`.

- [ ] **Step 4: Commit**

```bash
git add collections/TalentInquiries.ts payload.config.ts
git commit -m "feat(cms): add TalentInquiries collection"
```

---

## Task 2: Zod Schema + Tests (TDD)

**Files:**
- Create: `lib/__tests__/talent.test.ts`
- Create: `lib/schemas/talent.ts`

- [ ] **Step 1: Write the failing test**

Create `lib/__tests__/talent.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { talentSchema } from '../schemas/talent'

describe('talentSchema', () => {
  it('accepts a valid email with pitch', () => {
    const result = talentSchema.safeParse({
      email: 'recruiter@example.com',
      pitch: 'We are hiring a Front-End Lead',
    })
    expect(result.success).toBe(true)
  })

  it('accepts a valid email without pitch', () => {
    const result = talentSchema.safeParse({ email: 'recruiter@example.com' })
    expect(result.success).toBe(true)
  })

  it('accepts empty string pitch as undefined (stripped)', () => {
    const result = talentSchema.safeParse({ email: 'recruiter@example.com', pitch: '' })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.pitch).toBeUndefined()
  })

  it('rejects an invalid email', () => {
    const result = talentSchema.safeParse({ email: 'not-an-email', pitch: 'Pitch text' })
    expect(result.success).toBe(false)
  })

  it('rejects a missing email', () => {
    const result = talentSchema.safeParse({ pitch: 'Some pitch' })
    expect(result.success).toBe(false)
  })

  it('rejects an empty email string', () => {
    const result = talentSchema.safeParse({ email: '' })
    expect(result.success).toBe(false)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /root/Work/flcn-website && pnpm test lib/__tests__/talent.test.ts 2>&1 | tail -15
```

Expected: FAIL with `Cannot find module '../schemas/talent'`

- [ ] **Step 3: Create the schema**

Create `lib/schemas/talent.ts`:

```ts
import { z } from "zod"

export const talentSchema = z.object({
  email: z.string().email("Invalid email address"),
  pitch: z.string().transform((v) => (v.trim() === "" ? undefined : v)).optional(),
})

export type TalentFormData = z.infer<typeof talentSchema>
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd /root/Work/flcn-website && pnpm test lib/__tests__/talent.test.ts 2>&1 | tail -15
```

Expected: 6 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/schemas/talent.ts lib/__tests__/talent.test.ts
git commit -m "feat(schema): add talentSchema with tests"
```

---

## Task 3: Email Notification Template

**Files:**
- Create: `emails/talent-notification.tsx`

- [ ] **Step 1: Create the template**

Create `emails/talent-notification.tsx` (mirrors the structure of `emails/contact-notification.tsx`):

```tsx
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface TalentNotificationProps {
  email: string
  pitch?: string
  jdFileUrl?: string
}

export function TalentNotification({ email, pitch, jdFileUrl }: TalentNotificationProps) {
  return (
    <Html>
      <Head />
      <Preview>New talent inquiry from {email}</Preview>
      <Body
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          backgroundColor: "#f5f5f5",
          margin: 0,
          padding: "24px 0",
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            borderRadius: "4px",
            border: "1px solid #e5e5e5",
            overflow: "hidden",
          }}
        >
          <Section style={{ backgroundColor: "#111111", padding: "20px 28px" }}>
            <Heading
              style={{
                color: "#ffffff",
                fontFamily: "monospace",
                fontSize: "13px",
                fontWeight: "600",
                margin: 0,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              THEFALCON.DEV: TALENT INQUIRY
            </Heading>
          </Section>

          <Section style={{ padding: "28px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td
                    style={{
                      fontFamily: "monospace",
                      fontSize: "12px",
                      color: "#888888",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      paddingBottom: "12px",
                      width: "80px",
                      verticalAlign: "top",
                    }}
                  >
                    FROM
                  </td>
                  <td
                    style={{
                      fontFamily: "monospace",
                      fontSize: "13px",
                      color: "#111111",
                      paddingBottom: "12px",
                      verticalAlign: "top",
                    }}
                  >
                    {email}
                  </td>
                </tr>
              </tbody>
            </table>

            {pitch && (
              <>
                <Hr style={{ borderColor: "#e5e5e5", margin: "4px 0 20px" }} />
                <Text
                  style={{
                    fontFamily: "monospace",
                    fontSize: "12px",
                    color: "#888888",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    margin: "0 0 8px",
                  }}
                >
                  PITCH
                </Text>
                <Text
                  style={{
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    fontSize: "14px",
                    color: "#333333",
                    lineHeight: "1.6",
                    margin: 0,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {pitch}
                </Text>
              </>
            )}

            {jdFileUrl && (
              <>
                <Hr style={{ borderColor: "#e5e5e5", margin: "20px 0" }} />
                <Text
                  style={{
                    fontFamily: "monospace",
                    fontSize: "12px",
                    color: "#888888",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    margin: "0 0 8px",
                  }}
                >
                  ATTACHED JD
                </Text>
                <Link
                  href={jdFileUrl}
                  style={{ fontFamily: "monospace", fontSize: "13px", color: "#0070f3" }}
                >
                  View File →
                </Link>
              </>
            )}
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /root/Work/flcn-website && pnpm tsc --noEmit 2>&1 | grep "talent-notification" | head -5
```

Expected: no output (no errors).

- [ ] **Step 3: Commit**

```bash
git add emails/talent-notification.tsx
git commit -m "feat(email): add TalentNotification email template"
```

---

## Task 4: Server Action

**Files:**
- Create: `actions/talent.ts`

- [ ] **Step 1: Create the server action**

Create `actions/talent.ts`:

```ts
"use server"

import { Resend } from "resend"
import { getPayload } from "payload"
import config from "@payload-config"
import { talentSchema } from "@/lib/schemas/talent"
import { TalentNotification } from "@/emails/talent-notification"
import { site } from "@/content/site"

export type TalentResult = { ok: boolean; error?: string }

export async function submitTalentInquiry(formData: FormData): Promise<TalentResult> {
  const email = formData.get("email")
  const pitch = formData.get("pitch")
  const jdFile = formData.get("jdFile")

  const parsed = talentSchema.safeParse({
    email: typeof email === "string" ? email : "",
    pitch: typeof pitch === "string" ? pitch : undefined,
  })

  if (!parsed.success) {
    return { ok: false, error: "Invalid form data. Please check your inputs." }
  }

  const hasContent = parsed.data.pitch || (jdFile instanceof File && jdFile.size > 0)
  if (!hasContent) {
    return { ok: false, error: "Please provide a pitch or attach a JD file." }
  }

  const payload = await getPayload({ config })
  let jdFileId: string | undefined
  let jdFileUrl: string | undefined

  if (jdFile instanceof File && jdFile.size > 0) {
    try {
      const buffer = Buffer.from(await jdFile.arrayBuffer())
      const mediaDoc = await payload.create({
        collection: "media",
        data: { alt: jdFile.name },
        file: {
          data: buffer,
          mimetype: jdFile.type,
          name: jdFile.name,
          size: jdFile.size,
        },
      })
      jdFileId = String(mediaDoc.id)
      jdFileUrl = (mediaDoc as { url?: string | null }).url ?? undefined
    } catch (err) {
      console.error("[talent] Failed to upload JD file:", err)
      return { ok: false, error: "Failed to upload the JD file. Please try again." }
    }
  }

  try {
    await payload.create({
      collection: "talent-inquiries",
      data: {
        email: parsed.data.email,
        pitch: parsed.data.pitch,
        jdFile: jdFileId,
        submittedAt: new Date().toISOString(),
      },
    })
  } catch (err) {
    console.error("[talent] Failed to save to Payload:", err)
  }

  if (!process.env.RESEND_API_KEY) {
    console.warn("[talent] RESEND_API_KEY not configured — skipping email send")
    return { ok: true }
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const from = process.env.RESEND_FROM ?? `Rishabh Kumar <hello@thefalcon.dev>`
  const ownerEmail = process.env.RESEND_TO ?? site.email

  try {
    await resend.emails.send({
      from,
      to: ownerEmail,
      subject: `[thefalcon.dev] New talent inquiry from ${parsed.data.email}`,
      react: TalentNotification({
        email: parsed.data.email,
        pitch: parsed.data.pitch,
        jdFileUrl,
      }),
    })
    return { ok: true }
  } catch (err) {
    console.error("[talent] Resend error:", err)
    return { ok: false, error: "Failed to send. Please try again or email me directly." }
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /root/Work/flcn-website && pnpm tsc --noEmit 2>&1 | grep "talent" | head -10
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add actions/talent.ts
git commit -m "feat(action): add submitTalentInquiry server action"
```

---

## Task 5: Dialog Component

**Files:**
- Create: `components/site/talent-dialog.tsx`

- [ ] **Step 1: Create the component**

Create `components/site/talent-dialog.tsx`:

```tsx
"use client"

import { useRef, useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { talentSchema, type TalentFormData } from "@/lib/schemas/talent"
import { submitTalentInquiry } from "@/actions/talent"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const STORAGE_KEY = "talent_popup_seen"

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 font-mono text-[10px] text-destructive">{message}</p>
}

export function TalentDialog() {
  const [open, setOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TalentFormData>({
    resolver: zodResolver(talentSchema),
  })

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return
    const timer = setTimeout(() => setOpen(true), 15_000)
    return () => clearTimeout(timer)
  }, [])

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) localStorage.setItem(STORAGE_KEY, "1")
    setOpen(isOpen)
  }

  async function onSubmit(data: TalentFormData) {
    if (!data.pitch && !selectedFile) {
      setFormError("Please provide a pitch or attach a JD file.")
      return
    }
    setFormError(null)
    setIsPending(true)

    const formData = new FormData()
    formData.append("email", data.email)
    if (data.pitch) formData.append("pitch", data.pitch)
    if (selectedFile) formData.append("jdFile", selectedFile)

    try {
      const result = await submitTalentInquiry(formData)
      if (result.ok) {
        toast.success("Details sent! I'll review your opportunity soon.")
        handleOpenChange(false)
        reset()
        setSelectedFile(null)
      } else {
        setFormError(result.error ?? "Something went wrong. Please try again.")
      }
    } catch {
      setFormError("Network error. Please check your connection and try again.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Looking for Talent?
          </p>
          <DialogTitle className="text-sm font-semibold tracking-tight">
            Hiring or have an opportunity?
          </DialogTitle>
          <DialogDescription className="text-xs/relaxed">
            If you&apos;re building something that demands precision and are looking for a
            full-time Front-End Technical Lead, I&apos;d love to hear about it.
          </DialogDescription>
          <p className="font-mono text-[10px] text-muted-foreground/70">
            Please note: I am only open to considering full-time opportunities (no freelance or
            contract work).
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          {/* Email */}
          <div>
            <Label
              htmlFor="talent-email"
              className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5 block"
            >
              Email Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="talent-email"
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            <FieldError message={errors.email?.message} />
          </div>

          {/* Pitch */}
          <div>
            <Label
              htmlFor="talent-pitch"
              className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5 block"
            >
              Job Description / Pitch
            </Label>
            <Textarea
              id="talent-pitch"
              placeholder="Tell me about the role and what you're building…"
              rows={4}
              {...register("pitch")}
            />
          </div>

          {/* OR divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-border" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Or
            </span>
            <div className="flex-1 border-t border-border" />
          </div>

          {/* File upload */}
          <div>
            <Label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5 block">
              Attach JD File
            </Label>
            <div className="border border-dashed border-border p-3 flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="sr-only"
                onChange={(e) => {
                  setSelectedFile(e.target.files?.[0] ?? null)
                  setFormError(null)
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0 font-mono text-[10px] uppercase tracking-widest"
                onClick={() => fileInputRef.current?.click()}
              >
                Browse Files
              </Button>
              <span className="font-mono text-[10px] text-muted-foreground truncate">
                {selectedFile ? selectedFile.name : "PDF, DOC, or DOCX"}
              </span>
            </div>
          </div>

          {formError && (
            <p className="font-mono text-[10px] text-destructive">{formError}</p>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="w-full font-mono text-[10px] uppercase tracking-widest"
          >
            {isPending ? "Sending…" : "Send Details"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /root/Work/flcn-website && pnpm tsc --noEmit 2>&1 | grep "talent-dialog" | head -5
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add components/site/talent-dialog.tsx
git commit -m "feat(ui): add TalentDialog component"
```

---

## Task 6: Mount in Layout

**Files:**
- Modify: `app/(site)/layout.tsx`

- [ ] **Step 1: Add import**

In `app/(site)/layout.tsx`, add the import after the `SplashScreen` import on line 12:

```ts
import { TalentDialog } from "@/components/site/talent-dialog";
```

- [ ] **Step 2: Mount the component**

In `app/(site)/layout.tsx`, add `<TalentDialog />` immediately after `<SplashScreen />` on line 86:

```tsx
<SplashScreen />
<TalentDialog />
```

The full `<body>` block should look like:

```tsx
<body className="min-h-full flex flex-col bg-background text-foreground">
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
    <SplashScreen />
    <TalentDialog />
    <QueryProvider>
      <SiteFrame>{children}</SiteFrame>
    </QueryProvider>
    <Toaster position="bottom-right" />
  </ThemeProvider>
</body>
```

- [ ] **Step 3: Run full test suite**

```bash
cd /root/Work/flcn-website && pnpm test 2>&1 | tail -20
```

Expected: all tests PASS (including the 6 new talent schema tests).

- [ ] **Step 4: TypeScript final check**

```bash
cd /root/Work/flcn-website && pnpm tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add 'app/(site)/layout.tsx'
git commit -m "feat: mount TalentDialog in site layout"
```
