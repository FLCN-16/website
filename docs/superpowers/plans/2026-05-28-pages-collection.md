# Pages Collection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `Pages` Payload CMS collection with `legal` and `basic` templates, migrate existing static legal content into it, and wire up dynamic Next.js routes for `/legal/[slug]` and `/page/[slug]`.

**Architecture:** A single `Pages` collection uses a `template` select field to drive conditional fields (`lastUpdated` only for `legal`). Two Next.js dynamic routes — `app/(site)/legal/[slug]/page.tsx` and `app/(site)/page/[slug]/page.tsx` — each query Payload filtered by template. Existing static `/legal/privacy` and `/legal/terms` pages are deleted and replaced by the dynamic route. Legal content from `content/legal.ts` is seeded into the collection and the static file deleted.

**Tech Stack:** Payload CMS 3.x, Next.js 15 App Router, `@payloadcms/richtext-lexical`, TypeScript, vitest

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `collections/Pages.ts` | Payload collection definition |
| Modify | `payload.config.ts` | Register Pages collection |
| Create | `app/(site)/legal/[slug]/page.tsx` | Dynamic legal page route |
| Delete | `app/(site)/legal/privacy/page.tsx` | Replaced by dynamic route |
| Delete | `app/(site)/legal/terms/page.tsx` | Replaced by dynamic route |
| Create | `app/(site)/page/[slug]/page.tsx` | Dynamic basic page route |
| Modify | `scripts/seed-content.ts` | Add legal page seeding + textToLexical helper |
| Delete | `content/legal.ts` | Static content replaced by CMS |

---

## Task 1: Create the Pages collection

**Files:**
- Create: `collections/Pages.ts`

- [ ] **Step 1: Create the collection file**

```typescript
import type { CollectionConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";

export const Pages: CollectionConfig = {
  slug: "pages",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "template", "slug"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "URL-friendly identifier, e.g. privacy, terms, about",
      },
    },
    {
      name: "template",
      type: "select",
      required: true,
      options: [
        { label: "Legal", value: "legal" },
        { label: "Basic", value: "basic" },
      ],
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "lastUpdated",
      type: "date",
      admin: {
        position: "sidebar",
        condition: (data) => data.template === "legal",
        date: {
          pickerAppearance: "dayOnly",
        },
      },
    },
    {
      name: "body",
      type: "richText",
      required: true,
      editor: lexicalEditor(),
    },
  ],
};
```

- [ ] **Step 2: Commit**

```bash
git add collections/Pages.ts
git commit -m "feat(cms): add Pages collection with legal and basic templates"
```

---

## Task 2: Register Pages in payload.config.ts

**Files:**
- Modify: `payload.config.ts`

- [ ] **Step 1: Add import at the top of the imports block**

Add after the existing collection imports (line ~21):
```typescript
import { Pages } from "./collections/Pages";
```

- [ ] **Step 2: Add Pages to the collections array**

Change line 34:
```typescript
collections: [Users, Posts, Media, Submissions, Work, Projects, Timeline, Education, Certifications, Pages],
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd /root/Work/flcn-website && pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add payload.config.ts
git commit -m "feat(cms): register Pages collection in payload config"
```

---

## Task 3: Create the dynamic legal page route

The existing static pages at `app/(site)/legal/privacy/page.tsx` and `app/(site)/legal/terms/page.tsx` both show "Coming soon". They are replaced by a single dynamic route.

**Files:**
- Create: `app/(site)/legal/[slug]/page.tsx`
- Delete: `app/(site)/legal/privacy/page.tsx`
- Delete: `app/(site)/legal/terms/page.tsx`

- [ ] **Step 1: Delete the static pages**

```bash
rm /root/Work/flcn-website/app/\(site\)/legal/privacy/page.tsx
rm /root/Work/flcn-website/app/\(site\)/legal/terms/page.tsx
rmdir /root/Work/flcn-website/app/\(site\)/legal/privacy
rmdir /root/Work/flcn-website/app/\(site\)/legal/terms
```

- [ ] **Step 2: Create the dynamic route**

Create `app/(site)/legal/[slug]/page.tsx`:

```typescript
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { getPayloadClient } from "@/lib/payload";
import { createMetadata } from "@/lib/metadata";

interface LegalPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: LegalPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await fetchLegalPage(slug);
  if (!page) return { title: "Not Found" };
  return createMetadata({ title: page.title });
}

export default async function LegalPage({ params }: LegalPageProps) {
  const { slug } = await params;
  const page = await fetchLegalPage(slug);
  if (!page) notFound();

  const lastUpdated = page.lastUpdated
    ? new Date(page.lastUpdated).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="max-w-3xl">
      <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-4">
        Legal
      </p>
      <h1 className="font-sans text-4xl font-semibold tracking-tight mb-2">
        {page.title}
      </h1>
      {lastUpdated && (
        <p className="text-sm text-muted-foreground mb-8">
          Last updated {lastUpdated}
        </p>
      )}
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <RichText data={page.body} />
      </div>
    </div>
  );
}

async function fetchLegalPage(slug: string) {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "pages",
    where: {
      and: [
        { slug: { equals: slug } },
        { template: { equals: "legal" } },
      ],
    },
    limit: 1,
  });
  return result.docs[0] ?? null;
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd /root/Work/flcn-website && pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add app/\(site\)/legal/
git commit -m "feat(pages): add dynamic legal page route, remove static privacy/terms pages"
```

---

## Task 4: Create the dynamic basic page route

**Files:**
- Create: `app/(site)/page/[slug]/page.tsx`

- [ ] **Step 1: Create the directory and route file**

Create `app/(site)/page/[slug]/page.tsx`:

```typescript
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { getPayloadClient } from "@/lib/payload";
import { createMetadata } from "@/lib/metadata";

interface BasicPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BasicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await fetchBasicPage(slug);
  if (!page) return { title: "Not Found" };
  return createMetadata({ title: page.title });
}

export default async function BasicPage({ params }: BasicPageProps) {
  const { slug } = await params;
  const page = await fetchBasicPage(slug);
  if (!page) notFound();

  return (
    <div className="max-w-3xl">
      <h1 className="font-sans text-4xl font-semibold tracking-tight mb-8">
        {page.title}
      </h1>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <RichText data={page.body} />
      </div>
    </div>
  );
}

async function fetchBasicPage(slug: string) {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "pages",
    where: {
      and: [
        { slug: { equals: slug } },
        { template: { equals: "basic" } },
      ],
    },
    limit: 1,
  });
  return result.docs[0] ?? null;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /root/Work/flcn-website && pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add "app/(site)/page/"
git commit -m "feat(pages): add dynamic basic page route at /page/[slug]"
```

---

## Task 5: Update seed script with legal page data

The seed script converts the static content from `content/legal.ts` into Lexical JSON and seeds it into the `pages` collection.

**Files:**
- Modify: `scripts/seed-content.ts`
- Delete: `content/legal.ts`

- [ ] **Step 1: Add the `textToLexical` and `parseInline` helpers to seed-content.ts**

Add these two functions above the `// ─── Data` section:

```typescript
// ─── Lexical helpers ──────────────────────────────────────────────────────────

type LexicalTextNode = {
  detail: number; format: number; mode: string; style: string; text: string; type: "text"; version: number;
}

type LexicalNode =
  | { type: "heading"; tag: string; children: LexicalTextNode[]; direction: string; format: string; indent: number; version: number }
  | { type: "paragraph"; children: LexicalTextNode[]; direction: string; format: string; indent: number; version: number; textFormat: number }

function parseInline(text: string): LexicalTextNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.filter(Boolean).map((part) => {
    const isBold = part.startsWith("**") && part.endsWith("**")
    return {
      detail: 0,
      format: isBold ? 1 : 0,
      mode: "normal",
      style: "",
      text: isBold ? part.slice(2, -2) : part,
      type: "text" as const,
      version: 1,
    }
  })
}

function textToLexical(text: string) {
  const blocks = text.split("\n\n").filter(Boolean)
  const children: LexicalNode[] = blocks.map((block) => {
    const trimmed = block.trim()
    const headingMatch = trimmed.match(/^\*\*(.+)\*\*$/)
    if (headingMatch) {
      return {
        children: [{ detail: 0, format: 0, mode: "normal", style: "", text: headingMatch[1], type: "text" as const, version: 1 }],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "heading" as const,
        tag: "h2",
        version: 1,
      }
    }
    return {
      children: parseInline(trimmed),
      direction: "ltr",
      format: "",
      indent: 0,
      type: "paragraph" as const,
      version: 1,
      textFormat: 0,
    }
  })
  return {
    root: {
      children,
      direction: "ltr" as const,
      format: "" as const,
      indent: 0,
      type: "root" as const,
      version: 1,
    },
  }
}
```

- [ ] **Step 2: Add the `LEGAL_PAGES` data constant**

Add this constant in the `// ─── Data` section, after the existing constants:

```typescript
const LEGAL_PAGES = [
  {
    title: "Privacy Policy",
    slug: "privacy",
    template: "legal" as const,
    lastUpdated: "2025-01-01T00:00:00.000Z",
    bodyText: `This Privacy Policy describes how thefalcon.dev ("this website", "I") handles information when you visit or use this personal portfolio site.

**What data is collected**

The only personal data collected on this site is information you voluntarily submit through the contact form: your name, email address, and the message you choose to send. This data is used solely to respond to your enquiry and is not stored in a database beyond what is necessary to reply. No data is sold, shared with third parties, or used for marketing purposes.

**Cookies and local storage**

This site does not use tracking cookies or analytics of any kind. A single entry is written to your browser's localStorage to remember your preferred colour theme (light or dark). This value never leaves your device and contains no personally identifiable information.

**Third-party services**

This site is hosted on Vercel. Vercel may collect standard server access logs (IP address, request path, timestamp) as part of normal hosting operations. Please refer to Vercel's privacy policy at vercel.com/legal/privacy-policy for details on their data handling.

**Your rights**

If you have submitted a contact form and wish to have that correspondence deleted, please email hello@thefalcon.dev and I will remove it promptly.

**Changes to this policy**

This policy may be updated occasionally. The "last updated" date at the top of this page will reflect any changes. Continued use of the site after changes constitutes acceptance of the revised policy.

**Contact**

For any privacy-related questions, reach out at hello@thefalcon.dev.`,
  },
  {
    title: "Terms of Use",
    slug: "terms",
    template: "legal" as const,
    lastUpdated: "2025-01-01T00:00:00.000Z",
    bodyText: `These Terms of Use govern your access to and use of thefalcon.dev (the "Site"). By using the Site, you agree to these terms.

**Content and intellectual property**

All written content, code samples, and design on this Site are the personal work of Rishabh Kumar unless otherwise noted. You may share links to any page on this Site freely. You may quote brief excerpts with clear attribution. You may not reproduce substantial portions of the content, pass off any of the work as your own, or use the content for commercial purposes without prior written permission.

**Accuracy**

The information on this Site — including employment history, project descriptions, and technical content — is provided in good faith and to the best of my knowledge. I make no warranties about the completeness or accuracy of any information and accept no liability for errors or omissions.

**External links**

The Site may contain links to third-party websites. These links are provided for convenience only. I have no control over the content of those sites and accept no responsibility for them or for any loss or damage arising from your use of them.

**Limitation of liability**

To the fullest extent permitted by applicable law, I am not liable for any indirect, incidental, or consequential damages arising out of your use of this Site or your inability to use it.

**Governing law**

These terms are governed by the laws of India. Any disputes arising in connection with these terms shall be subject to the jurisdiction of courts in Punjab, India.

**Changes to these terms**

These terms may be updated from time to time. The "last updated" date above will reflect any revisions. Continued use of the Site after changes constitutes acceptance of the updated terms.

**Contact**

For any questions about these terms, contact hello@thefalcon.dev.`,
  },
]
```

- [ ] **Step 3: Add `seedLegalPages` function**

Add this function in the `// ─── Seed helpers` section, after the existing seed functions:

```typescript
async function seedLegalPages(payload: Payload) {
  for (const page of LEGAL_PAGES) {
    const { bodyText, ...rest } = page
    await payload.create({
      collection: "pages",
      data: { ...rest, body: textToLexical(bodyText) },
    })
    console.log(`  created: ${page.title}`)
  }
}
```

- [ ] **Step 4: Add "pages" to the collections cleaned in `cleanDatabase`**

Find the `cleanDatabase` function. It iterates over an array of collection slugs. Add `"pages"` to that array. The array looks like:

```typescript
for (const slug of ["posts", "work", "projects", "timeline", "education", "certifications", "submissions", "search"]) {
```

Change it to:

```typescript
for (const slug of ["posts", "work", "projects", "timeline", "education", "certifications", "submissions", "search", "pages"]) {
```

- [ ] **Step 5: Call `seedLegalPages` in `main()`**

In the `main()` function, add after the last seed call (before `console.log("\nDone.")`):

```typescript
  console.log("\nSeeding Legal Pages…")
  await seedLegalPages(payload)
```

- [ ] **Step 6: Delete `content/legal.ts`**

```bash
rm /root/Work/flcn-website/content/legal.ts
```

- [ ] **Step 7: Verify TypeScript compiles**

```bash
cd /root/Work/flcn-website && pnpm tsc --noEmit
```

Expected: no errors. If there are import errors for `content/legal` in other files, remove those imports too (run `grep -r "content/legal" /root/Work/flcn-website/app /root/Work/flcn-website/components /root/Work/flcn-website/lib` first to check).

- [ ] **Step 8: Commit**

```bash
git add scripts/seed-content.ts
git rm content/legal.ts
git commit -m "feat(seed): add legal pages seeding, remove static legal content file"
```

---

## Task 6: Final type check and build verification

- [ ] **Step 1: Run full TypeScript check**

```bash
cd /root/Work/flcn-website && pnpm tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 2: Run tests**

```bash
cd /root/Work/flcn-website && pnpm test
```

Expected: all existing tests pass (no tests were deleted or broken).

- [ ] **Step 3: Commit if any fixes were needed**

```bash
git add -p
git commit -m "fix(pages): resolve type errors from final build check"
```
