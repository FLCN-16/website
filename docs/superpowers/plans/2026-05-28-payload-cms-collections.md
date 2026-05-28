# Payload CMS Collections — Work, Projects, Timeline Migration

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate Work and Journey from static TypeScript files to Payload CMS, add a Projects collection for CV-style entries, and expose projects on the homepage and a new /projects page.

**Architecture:** Three new Payload collections (work, projects, timeline) replace static content/ files. A shared `lib/types.ts` defines mapped shapes used by components. Pages become async server components with try/catch fallbacks identical to the existing writing page. Components stop importing from content/ files.

**Tech Stack:** Payload CMS v3, MongoDB Atlas, Next.js 15 App Router, TypeScript (strict)

---

## File Map

**Create:**
- `lib/types.ts` — shared mapped types (WorkEntry, ProjectEntry, TimelineEntry)
- `collections/Work.ts` — Payload Work collection config
- `collections/Projects.ts` — Payload Projects collection config
- `collections/Timeline.ts` — Payload Timeline collection config
- `components/sections/projects-grid.tsx` — grid component for projects (homepage + /projects page)
- `app/(site)/projects/page.tsx` — new /projects listing page

**Modify:**
- `payload.config.ts` — register Work, Projects, Timeline collections
- `components/sections/journey.tsx` — swap JourneyItem import → TimelineEntry
- `components/sections/selected-work.tsx` — swap Project import → WorkEntry
- `components/sections/project-briefing.tsx` — remove static projects import, accept prevProject/nextProject props
- `app/(site)/work/page.tsx` — fetch from Payload work collection
- `app/(site)/work/[slug]/page.tsx` — fetch from Payload, compute prev/next, pass to ProjectBriefing
- `app/(site)/page.tsx` — async, fetch work + featured projects + timeline from Payload
- `app/llms.txt/route.ts` — fetch work entries from Payload

---

## Task 1: Create shared domain types

**Files:**
- Create: `lib/types.ts`

- [ ] **Step 1: Create the types file**

```typescript
// lib/types.ts
export interface WorkEntry {
  id: string
  slug: string
  title: string
  category: string
  ord: string
  tags: string[]
  description: string
  briefing: {
    problem: string
    approach: string[]
    impact: string
    quote: string
  }
  stack: { name: string; role: string }[]
}

export interface ProjectEntry {
  id: string
  title: string
  subtitle?: string
  description?: string
  category?: string
  tags: string[]
  liveUrl?: string
  repoUrl?: string
  startDate?: string
  endDate?: string
  highlights: string[]
  featured?: boolean
}

export interface TimelineEntry {
  id: string
  company: string
  role: string
  start: string
  end?: string | null
  summary?: string
  tags: string[]
  order?: number
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /root/Work/flcn-website && npx tsc --noEmit 2>&1 | head -20
```

Expected: no new errors (existing errors are unrelated to this file).

- [ ] **Step 3: Commit**

```bash
git add lib/types.ts
git commit -m "feat(types): add shared domain types for Work, Project, Timeline"
```

---

## Task 2: Create Work Payload collection

**Files:**
- Create: `collections/Work.ts`

- [ ] **Step 1: Create the collection**

```typescript
// collections/Work.ts
import type { CollectionConfig } from "payload"

export const Work: CollectionConfig = {
  slug: "work",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "ord", "status"],
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true
      return { status: { equals: "published" } }
    },
  },
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: { description: "URL-friendly identifier, e.g. design-system-foundation" },
    },
    { name: "category", type: "text", admin: { description: "e.g. Design Systems, Platform Engineering" } },
    { name: "ord", type: "text", admin: { description: "Display order label: 01, 02, 03" } },
    {
      name: "tags",
      type: "array",
      fields: [{ name: "tag", type: "text" }],
    },
    { name: "description", type: "textarea" },
    { name: "cover", type: "upload", relationTo: "media" },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "draft",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "briefing",
      type: "group",
      fields: [
        { name: "problem", type: "textarea" },
        {
          name: "approach",
          type: "array",
          fields: [{ name: "step", type: "textarea" }],
        },
        { name: "impact", type: "textarea" },
        { name: "quote", type: "text" },
      ],
    },
    {
      name: "stack",
      type: "array",
      fields: [
        { name: "name", type: "text" },
        { name: "role", type: "text" },
      ],
    },
  ],
}
```

- [ ] **Step 2: Commit**

```bash
git add collections/Work.ts
git commit -m "feat(cms): add Work collection"
```

---

## Task 3: Create Projects Payload collection

**Files:**
- Create: `collections/Projects.ts`

- [ ] **Step 1: Create the collection**

```typescript
// collections/Projects.ts
import type { CollectionConfig } from "payload"

export const Projects: CollectionConfig = {
  slug: "projects",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "featured", "status"],
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true
      return { status: { equals: "published" } }
    },
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "subtitle", type: "text", admin: { description: "Short tagline shown below title" } },
    { name: "description", type: "textarea" },
    { name: "category", type: "text", admin: { description: "e.g. Chrome Extension, Agentic AI, Mobile App" } },
    {
      name: "tags",
      type: "array",
      fields: [{ name: "tag", type: "text" }],
    },
    { name: "liveUrl", type: "text", admin: { description: "Chrome Web Store, Play Store, or live URL" } },
    { name: "repoUrl", type: "text", admin: { description: "GitHub repo or PR URL" } },
    { name: "startDate", type: "text", admin: { description: "e.g. February 2025" } },
    { name: "endDate", type: "text", admin: { description: "e.g. October 2025 — leave blank for ongoing" } },
    {
      name: "highlights",
      type: "array",
      fields: [{ name: "point", type: "textarea" }],
      admin: { description: "Bullet points from CV — 2–4 highlights" },
    },
    { name: "cover", type: "upload", relationTo: "media" },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "draft",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: { position: "sidebar", description: "Show on homepage featured section" },
    },
  ],
}
```

- [ ] **Step 2: Commit**

```bash
git add collections/Projects.ts
git commit -m "feat(cms): add Projects collection"
```

---

## Task 4: Create Timeline Payload collection

**Files:**
- Create: `collections/Timeline.ts`

- [ ] **Step 1: Create the collection**

```typescript
// collections/Timeline.ts
import type { CollectionConfig } from "payload"

export const Timeline: CollectionConfig = {
  slug: "timeline",
  admin: {
    useAsTitle: "company",
    defaultColumns: ["company", "role", "start", "end", "order"],
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: "company", type: "text", required: true },
    { name: "role", type: "text", required: true },
    { name: "start", type: "text", required: true, admin: { description: "Year as string: 2022" } },
    { name: "end", type: "text", admin: { description: "Year or leave blank for current role" } },
    { name: "summary", type: "textarea" },
    {
      name: "tags",
      type: "array",
      fields: [{ name: "tag", type: "text" }],
    },
    {
      name: "order",
      type: "number",
      admin: {
        position: "sidebar",
        description: "Lower = displayed first. Current role = 1.",
      },
    },
  ],
}
```

- [ ] **Step 2: Commit**

```bash
git add collections/Timeline.ts
git commit -m "feat(cms): add Timeline collection"
```

---

## Task 5: Register collections in payload.config.ts and regenerate types

**Files:**
- Modify: `payload.config.ts`

- [ ] **Step 1: Register the three new collections**

Replace the contents of `payload.config.ts` with:

```typescript
// payload.config.ts
import path from "path"
import { fileURLToPath } from "url"
import { buildConfig } from "payload"
import { mongooseAdapter } from "@payloadcms/db-mongodb"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import { Users } from "./collections/Users"
import { Posts } from "./collections/Posts"
import { Media } from "./collections/Media"
import { Submissions } from "./collections/Submissions"
import { Work } from "./collections/Work"
import { Projects } from "./collections/Projects"
import { Timeline } from "./collections/Timeline"

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Posts, Media, Submissions, Work, Projects, Timeline],
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || "",
  }),
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  upload: {
    limits: {
      fileSize: 5_000_000,
    },
  },
})
```

- [ ] **Step 2: Regenerate Payload types**

```bash
cd /root/Work/flcn-website && npx payload generate:types
```

Expected: `payload-types.ts` is updated with `Work`, `Project` (Payload uses the slug), and `Timeline` type definitions. If this command errors due to DB connectivity, skip and continue — TypeScript will infer `any` for Payload doc fields until the types are generated, which is acceptable.

- [ ] **Step 3: Verify TypeScript compiles (ignore pre-existing errors)**

```bash
npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 4: Commit**

```bash
git add payload.config.ts payload-types.ts
git commit -m "feat(cms): register Work, Projects, Timeline in payload config"
```

---

## Task 6: Update Journey and SelectedWork components to use shared types

**Files:**
- Modify: `components/sections/journey.tsx`
- Modify: `components/sections/selected-work.tsx`

- [ ] **Step 1: Update journey.tsx — swap type import**

In `components/sections/journey.tsx`, replace line 1:

```typescript
// OLD:
import { type JourneyItem } from "@/content/journey"

// NEW:
import { type TimelineEntry } from "@/lib/types"
```

Replace the `JourneyProps` interface and all `JourneyItem` references:

```typescript
// OLD:
interface JourneyProps {
  items: JourneyItem[]
}

// NEW:
interface JourneyProps {
  items: TimelineEntry[]
}
```

The `item.end ?? "Present"` expression already works for both `null` and `undefined`, so no other changes are needed.

- [ ] **Step 2: Update selected-work.tsx — swap type import**

In `components/sections/selected-work.tsx`, replace line 2:

```typescript
// OLD:
import { type Project } from "@/content/work"

// NEW:
import { type WorkEntry } from "@/lib/types"
```

Replace every occurrence of `Project` with `WorkEntry` in that file. There are four locations:
- `interface SelectedWorkProps { projects: Project[] }` → `projects: WorkEntry[]`
- `function GridLayout({ projects }: { projects: Project[] })` → `projects: WorkEntry[]`
- `function ListLayout({ projects }: { projects: Project[] })` → `projects: WorkEntry[]`
- Any other `Project` references

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -30
```

Expected: no new errors from these two files.

- [ ] **Step 4: Commit**

```bash
git add components/sections/journey.tsx components/sections/selected-work.tsx
git commit -m "refactor(components): swap content/ type imports for shared lib/types"
```

---

## Task 7: Refactor ProjectBriefing to accept prev/next as props

**Files:**
- Modify: `components/sections/project-briefing.tsx`

The component currently imports `projects` directly and uses `findIndex` for prev/next navigation. This is replaced by props passed from the detail page.

- [ ] **Step 1: Rewrite project-briefing.tsx**

Replace the entire file with:

```typescript
// components/sections/project-briefing.tsx
import Link from "next/link"
import { type WorkEntry } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { FadeRise } from "@/components/anim/fade-rise"
import { MaskReveal } from "@/components/anim/mask-reveal"

interface ProjectBriefingProps {
  project: WorkEntry
  prevProject?: Pick<WorkEntry, "slug" | "title"> | null
  nextProject?: Pick<WorkEntry, "slug" | "title"> | null
}

export function ProjectBriefing({ project, prevProject, nextProject }: ProjectBriefingProps) {
  return (
    <FadeRise>
      {/* Back nav */}
      <div className="pt-6 pb-8">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors group"
        >
          <span className="transition-transform group-hover:-translate-x-0.5">←</span>
          All Work
        </Link>
      </div>

      {/* Project header */}
      <div className="border-t border-border pt-8 pb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {project.category}
          </span>
          <span className="font-mono text-xs text-muted-foreground/40">/</span>
          <span className="font-mono text-xs text-muted-foreground/40">{project.ord}</span>
        </div>

        <MaskReveal
          as="h1"
          className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05]"
        >
          {project.title}
        </MaskReveal>

        <div className="flex flex-wrap gap-2 mt-5">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="font-mono text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Content body */}
      <div className="max-w-3xl space-y-12 py-10">
        {/* Problem */}
        <div>
          <SectionLabel>The Problem</SectionLabel>
          <p className="text-muted-foreground leading-relaxed mt-4">
            {project.briefing.problem}
          </p>
        </div>

        {/* Approach */}
        <div>
          <SectionLabel>Approach</SectionLabel>
          <ol className="mt-4 space-y-4">
            {project.briefing.approach.map((item, i) => (
              <li key={i} className="flex gap-4">
                <span className="font-mono text-xs text-muted-foreground/50 shrink-0 pt-1 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-muted-foreground leading-relaxed">{item}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Impact + pull quote */}
        <div>
          <SectionLabel>Impact</SectionLabel>
          <blockquote className="mt-6 border-l-2 border-primary pl-6">
            <p className="text-xl md:text-2xl font-semibold leading-snug text-foreground">
              &ldquo;{project.briefing.quote}&rdquo;
            </p>
          </blockquote>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            {project.briefing.impact}
          </p>
        </div>
      </div>

      {/* Stack table */}
      <div className="border-t border-border pt-10 pb-10 max-w-lg">
        <SectionLabel>Stack</SectionLabel>
        <table className="mt-6 w-full">
          <tbody className="divide-y divide-border">
            {project.stack.map((item) => (
              <tr key={item.name}>
                <td className="py-3 pr-6 font-mono text-sm font-medium text-foreground whitespace-nowrap">
                  {item.name}
                </td>
                <td className="py-3 font-mono text-sm text-muted-foreground">
                  {item.role}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Prev / next navigation */}
      {(prevProject || nextProject) && (
        <div className="border-t border-border pt-8 pb-12 flex justify-between gap-4">
          {prevProject ? (
            <Link
              href={`/work/${prevProject.slug}`}
              className="group flex flex-col gap-1 max-w-xs"
            >
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
                ← Previous
              </span>
              <span className="text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                {prevProject.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {nextProject && (
            <Link
              href={`/work/${nextProject.slug}`}
              className="group flex flex-col gap-1 max-w-xs text-right ml-auto"
            >
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
                Next →
              </span>
              <span className="text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                {nextProject.title}
              </span>
            </Link>
          )}
        </div>
      )}
    </FadeRise>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
      {children}
    </h2>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -30
```

Expected: no new errors from this file.

- [ ] **Step 3: Commit**

```bash
git add components/sections/project-briefing.tsx
git commit -m "refactor(project-briefing): remove static import, accept prev/next as props"
```

---

## Task 8: Create ProjectsGrid component

**Files:**
- Create: `components/sections/projects-grid.tsx`

- [ ] **Step 1: Create the component**

```typescript
// components/sections/projects-grid.tsx
import Link from "next/link"
import { ExternalLink, Github } from "lucide-react"
import { type ProjectEntry } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { FadeRise } from "@/components/anim/fade-rise"

interface ProjectsGridProps {
  projects: ProjectEntry[]
  showSectionHeader?: boolean
  showViewAll?: boolean
}

export function ProjectsGrid({
  projects,
  showSectionHeader = true,
  showViewAll = false,
}: ProjectsGridProps) {
  return (
    <section className="py-16 md:py-24">
      <FadeRise>
        {showSectionHeader && (
          <div className="mb-10 md:mb-14">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Projects
            </p>
            <h2 className="text-3xl font-semibold tracking-tight">
              Things I&apos;ve shipped
            </h2>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col border border-border rounded-lg p-6 hover:border-foreground/20 hover:bg-muted/40 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                {project.category && (
                  <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                    {project.category}
                  </span>
                )}
                {(project.startDate || project.endDate) && (
                  <span className="font-mono text-xs text-muted-foreground shrink-0">
                    {project.startDate}
                    {project.endDate ? ` – ${project.endDate}` : ""}
                  </span>
                )}
              </div>

              <h3 className="text-base font-semibold leading-snug">{project.title}</h3>

              {project.subtitle && (
                <p className="text-sm text-muted-foreground/70 mt-0.5">{project.subtitle}</p>
              )}

              {project.description && (
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                  {project.description}
                </p>
              )}

              {project.highlights.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {project.highlights.slice(0, 2).map((point, i) => (
                    <li key={i} className="text-sm text-muted-foreground leading-relaxed flex gap-2">
                      <span className="text-muted-foreground/40 shrink-0 pt-px">–</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              )}

              {project.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-border">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="font-mono text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {(project.liveUrl || project.repoUrl) && (
                <div className="flex gap-4 mt-4">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ExternalLink size={12} />
                      Live
                    </a>
                  )}
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Github size={12} />
                      Code
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {showViewAll && (
          <div className="mt-12 flex justify-start">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors group"
            >
              View All Projects
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
        )}
      </FadeRise>
    </section>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 3: Commit**

```bash
git add components/sections/projects-grid.tsx
git commit -m "feat(components): add ProjectsGrid section component"
```

---

## Task 9: Migrate work/page.tsx to Payload

**Files:**
- Modify: `app/(site)/work/page.tsx`

- [ ] **Step 1: Replace the file contents**

```typescript
// app/(site)/work/page.tsx
import { getPayloadClient } from "@/lib/payload"
import { SelectedWork } from "@/components/sections/selected-work"
import { createMetadata } from "@/lib/metadata"
import type { WorkEntry } from "@/lib/types"

export const metadata = createMetadata({
  title: "Work",
  description: "Selected projects from 9+ years of full-stack engineering.",
})

export const revalidate = 60

export default async function WorkIndex() {
  let projects: WorkEntry[] = []

  try {
    projects = await fetchWorkEntries()
  } catch {
    // Payload not available — show empty state
  }

  return (
    <>
      <div className="pt-6 pb-10 border-b border-border">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
          Selected Work
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
          Things I&apos;ve built.
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl leading-relaxed">
          Three in-depth case studies spanning platform architecture, design systems,
          and data visualisation — each one a lesson in trade-offs, leadership, and craft.
        </p>
      </div>

      <SelectedWork projects={projects} variant="list" showSectionHeader={false} />
    </>
  )
}

async function fetchWorkEntries(): Promise<WorkEntry[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: "work",
    where: { status: { equals: "published" } },
    sort: "ord",
    limit: 50,
    depth: 0,
  })
  return result.docs.map((doc) => ({
    id: String(doc.id),
    slug: doc.slug,
    title: doc.title,
    category: doc.category ?? "",
    ord: doc.ord ?? "",
    tags: doc.tags?.map((t: { tag?: string }) => t.tag ?? "") ?? [],
    description: doc.description ?? "",
    briefing: {
      problem: (doc.briefing as { problem?: string } | null)?.problem ?? "",
      approach:
        ((doc.briefing as { approach?: { step?: string }[] } | null)?.approach ?? []).map(
          (a) => a.step ?? ""
        ),
      impact: (doc.briefing as { impact?: string } | null)?.impact ?? "",
      quote: (doc.briefing as { quote?: string } | null)?.quote ?? "",
    },
    stack: ((doc.stack as { name?: string; role?: string }[] | null) ?? []).map((s) => ({
      name: s.name ?? "",
      role: s.role ?? "",
    })),
  }))
}
```

> **Note on inline casts:** Payload generates types in `payload-types.ts`. If `npx payload generate:types` ran successfully, replace the inline `as` casts with proper field access using the generated `Work` type. If types were not generated, the casts keep TypeScript happy.

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 3: Commit**

```bash
git add "app/(site)/work/page.tsx"
git commit -m "feat(work): fetch work entries from Payload CMS"
```

---

## Task 10: Migrate work/[slug]/page.tsx to Payload

**Files:**
- Modify: `app/(site)/work/[slug]/page.tsx`

- [ ] **Step 1: Replace the file contents**

```typescript
// app/(site)/work/[slug]/page.tsx
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPayloadClient } from "@/lib/payload"
import { ProjectBriefing } from "@/components/sections/project-briefing"
import { createMetadata } from "@/lib/metadata"
import type { WorkEntry } from "@/lib/types"

export const revalidate = 60

interface WorkDetailProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: WorkDetailProps): Promise<Metadata> {
  const { slug } = await params
  try {
    const entries = await fetchWorkEntries()
    const project = entries.find((p) => p.slug === slug)
    if (!project) return {}
    return createMetadata({ title: project.title, description: project.description })
  } catch {
    return {}
  }
}

export default async function WorkDetail({ params }: WorkDetailProps) {
  const { slug } = await params

  let project: WorkEntry | null = null
  let prevProject: Pick<WorkEntry, "slug" | "title"> | null = null
  let nextProject: Pick<WorkEntry, "slug" | "title"> | null = null

  try {
    const all = await fetchWorkEntries()
    const idx = all.findIndex((p) => p.slug === slug)
    if (idx === -1) notFound()
    project = all[idx]
    prevProject = idx > 0 ? { slug: all[idx - 1].slug, title: all[idx - 1].title } : null
    nextProject =
      idx < all.length - 1 ? { slug: all[idx + 1].slug, title: all[idx + 1].title } : null
  } catch {
    notFound()
  }

  if (!project) notFound()

  return (
    <ProjectBriefing project={project} prevProject={prevProject} nextProject={nextProject} />
  )
}

async function fetchWorkEntries(): Promise<WorkEntry[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: "work",
    where: { status: { equals: "published" } },
    sort: "ord",
    limit: 50,
    depth: 0,
  })
  return result.docs.map((doc) => ({
    id: String(doc.id),
    slug: doc.slug,
    title: doc.title,
    category: doc.category ?? "",
    ord: doc.ord ?? "",
    tags: doc.tags?.map((t: { tag?: string }) => t.tag ?? "") ?? [],
    description: doc.description ?? "",
    briefing: {
      problem: (doc.briefing as { problem?: string } | null)?.problem ?? "",
      approach:
        ((doc.briefing as { approach?: { step?: string }[] } | null)?.approach ?? []).map(
          (a) => a.step ?? ""
        ),
      impact: (doc.briefing as { impact?: string } | null)?.impact ?? "",
      quote: (doc.briefing as { quote?: string } | null)?.quote ?? "",
    },
    stack: ((doc.stack as { name?: string; role?: string }[] | null) ?? []).map((s) => ({
      name: s.name ?? "",
      role: s.role ?? "",
    })),
  }))
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 3: Commit**

```bash
git add "app/(site)/work/[slug]/page.tsx"
git commit -m "feat(work): fetch work detail + prev/next from Payload CMS"
```

---

## Task 11: Migrate homepage to Payload

**Files:**
- Modify: `app/(site)/page.tsx`

- [ ] **Step 1: Replace the file contents**

```typescript
// app/(site)/page.tsx
import { getPayloadClient } from "@/lib/payload"
import { Hero } from "@/components/sections/hero"
import { Journey } from "@/components/sections/journey"
import { Philosophy } from "@/components/sections/philosophy"
import { SelectedWork } from "@/components/sections/selected-work"
import { ProjectsGrid } from "@/components/sections/projects-grid"
import { CtaBanner } from "@/components/sections/cta-banner"
import { site } from "@/content/site"
import { philosophy } from "@/content/philosophy"
import { createMetadata } from "@/lib/metadata"
import type { WorkEntry, ProjectEntry, TimelineEntry } from "@/lib/types"

export const revalidate = 60

export const metadata = createMetadata({
  title: "About",
  description: site.subheadline,
})

export default async function Home() {
  let workEntries: WorkEntry[] = []
  let featuredProjects: ProjectEntry[] = []
  let timelineItems: TimelineEntry[] = []

  try {
    ;[workEntries, featuredProjects, timelineItems] = await Promise.all([
      fetchWork(),
      fetchFeaturedProjects(),
      fetchTimeline(),
    ])
  } catch {
    // Payload not available — show empty state
  }

  return (
    <>
      <Hero
        eyebrow={site.eyebrow}
        headline={site.headline}
        subheadline={site.subheadline}
        status={site.status}
        stats={site.stats}
        primaryCta={{ label: "View My Work", href: "/work" }}
        secondaryCta={{ label: "Get In Touch", href: "/contact" }}
      />
      <Journey items={timelineItems} />
      <Philosophy
        eyebrow={philosophy.eyebrow}
        heading={philosophy.heading}
        pillars={philosophy.pillars}
      />
      <SelectedWork projects={workEntries} showViewAll />
      {featuredProjects.length > 0 && (
        <ProjectsGrid projects={featuredProjects} showViewAll />
      )}
      <CtaBanner
        eyebrow="Let's work together"
        heading="Open to new opportunities"
        body="I'm selectively exploring senior frontend and tech-lead roles at product companies. If you're building something ambitious and care about craft, let's talk."
        primaryCta={{ label: "Get In Touch", href: "/contact" }}
        secondaryCta={{ label: "View My Stack", href: "/stack" }}
      />
    </>
  )
}

async function fetchWork(): Promise<WorkEntry[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: "work",
    where: { status: { equals: "published" } },
    sort: "ord",
    limit: 3,
    depth: 0,
  })
  return result.docs.map((doc) => ({
    id: String(doc.id),
    slug: doc.slug,
    title: doc.title,
    category: doc.category ?? "",
    ord: doc.ord ?? "",
    tags: doc.tags?.map((t: { tag?: string }) => t.tag ?? "") ?? [],
    description: doc.description ?? "",
    briefing: {
      problem: (doc.briefing as { problem?: string } | null)?.problem ?? "",
      approach:
        ((doc.briefing as { approach?: { step?: string }[] } | null)?.approach ?? []).map(
          (a) => a.step ?? ""
        ),
      impact: (doc.briefing as { impact?: string } | null)?.impact ?? "",
      quote: (doc.briefing as { quote?: string } | null)?.quote ?? "",
    },
    stack: ((doc.stack as { name?: string; role?: string }[] | null) ?? []).map((s) => ({
      name: s.name ?? "",
      role: s.role ?? "",
    })),
  }))
}

async function fetchFeaturedProjects(): Promise<ProjectEntry[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: "projects",
    where: {
      and: [{ status: { equals: "published" } }, { featured: { equals: true } }],
    },
    limit: 6,
    depth: 0,
  })
  return result.docs.map((doc) => ({
    id: String(doc.id),
    title: doc.title,
    subtitle: doc.subtitle ?? undefined,
    description: doc.description ?? undefined,
    category: doc.category ?? undefined,
    tags: doc.tags?.map((t: { tag?: string }) => t.tag ?? "") ?? [],
    liveUrl: doc.liveUrl ?? undefined,
    repoUrl: doc.repoUrl ?? undefined,
    startDate: doc.startDate ?? undefined,
    endDate: doc.endDate ?? undefined,
    highlights: doc.highlights?.map((h: { point?: string }) => h.point ?? "") ?? [],
    featured: doc.featured ?? false,
  }))
}

async function fetchTimeline(): Promise<TimelineEntry[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: "timeline",
    sort: "order",
    limit: 20,
    depth: 0,
  })
  return result.docs.map((doc) => ({
    id: String(doc.id),
    company: doc.company,
    role: doc.role,
    start: doc.start,
    end: doc.end ?? null,
    summary: doc.summary ?? undefined,
    tags: doc.tags?.map((t: { tag?: string }) => t.tag ?? "") ?? [],
    order: doc.order ?? undefined,
  }))
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 3: Commit**

```bash
git add "app/(site)/page.tsx"
git commit -m "feat(home): fetch work, projects, timeline from Payload CMS"
```

---

## Task 12: Migrate llms.txt route to Payload

**Files:**
- Modify: `app/llms.txt/route.ts`

- [ ] **Step 1: Replace the file contents**

```typescript
// app/llms.txt/route.ts
import { NextResponse } from "next/server"
import { getPayloadClient } from "@/lib/payload"
import { site } from "@/content/site"
import { stack } from "@/content/stack"
import type { WorkEntry } from "@/lib/types"

export async function GET() {
  let workEntries: WorkEntry[] = []

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: "work",
      where: { status: { equals: "published" } },
      sort: "ord",
      limit: 50,
      depth: 0,
    })
    workEntries = result.docs.map((doc) => ({
      id: String(doc.id),
      slug: doc.slug,
      title: doc.title,
      category: doc.category ?? "",
      ord: doc.ord ?? "",
      tags: doc.tags?.map((t: { tag?: string }) => t.tag ?? "") ?? [],
      description: doc.description ?? "",
      briefing: {
        problem: (doc.briefing as { problem?: string } | null)?.problem ?? "",
        approach:
          ((doc.briefing as { approach?: { step?: string }[] } | null)?.approach ?? []).map(
            (a) => a.step ?? ""
          ),
        impact: (doc.briefing as { impact?: string } | null)?.impact ?? "",
        quote: (doc.briefing as { quote?: string } | null)?.quote ?? "",
      },
      stack: ((doc.stack as { name?: string; role?: string }[] | null) ?? []).map((s) => ({
        name: s.name ?? "",
        role: s.role ?? "",
      })),
    }))
  } catch {
    // Payload not available — omit work entries
  }

  const lines: string[] = [
    `# ${site.name}`,
    `> ${site.role} based in ${site.location}. ${site.subheadline}`,
    "",
    `Contact: ${site.email}`,
    "",
    "## Pages",
    `- [About](${site.url}/): Introduction, career stats, work philosophy, and experience timeline.`,
    `- [Work](${site.url}/work): Selected project case studies covering problem, approach, impact, and stack.`,
    `- [Projects](${site.url}/projects): Side projects, Chrome extensions, mobile apps, and open-source contributions.`,
    `- [Stack](${site.url}/stack): Full tool and technology breakdown with proficiency levels.`,
    `- [Writing](${site.url}/writing): Articles on frontend engineering, architecture, and building at scale.`,
    `- [Contact](${site.url}/contact): Enquiry form and direct contact details.`,
    "",
    "## Selected Work",
    ...workEntries.map(
      (p) => `- [${p.title}](${site.url}/work/${p.slug}): ${p.description}`
    ),
    "",
    "## Stack Highlights",
    ...stack.disciplines.map(
      (d) =>
        `- ${d.name}: ${d.tools
          .filter((t) => t.maturity === "expert" || t.maturity === "proficient")
          .map((t) => t.name)
          .join(", ")}`
    ),
  ]

  return new NextResponse(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 3: Commit**

```bash
git add app/llms.txt/route.ts
git commit -m "feat(llms.txt): fetch work entries from Payload CMS"
```

---

## Task 13: Create /projects page

**Files:**
- Create: `app/(site)/projects/page.tsx`

- [ ] **Step 1: Create the page**

```typescript
// app/(site)/projects/page.tsx
import { getPayloadClient } from "@/lib/payload"
import { ProjectsGrid } from "@/components/sections/projects-grid"
import { createMetadata } from "@/lib/metadata"
import type { ProjectEntry } from "@/lib/types"

export const metadata = createMetadata({
  title: "Projects",
  description: "Side projects, Chrome extensions, mobile apps, and open-source contributions.",
})

export const revalidate = 60

export default async function ProjectsIndex() {
  let projects: ProjectEntry[] = []

  try {
    projects = await fetchProjects()
  } catch {
    // Payload not available — show empty state
  }

  return (
    <>
      <div className="pt-6 pb-10 border-b border-border">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
          Projects
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
          Things I&apos;ve shipped.
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl leading-relaxed">
          Side projects, client work, Chrome extensions, mobile apps, and open-source contributions.
        </p>
      </div>
      <ProjectsGrid projects={projects} showSectionHeader={false} />
    </>
  )
}

async function fetchProjects(): Promise<ProjectEntry[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: "projects",
    where: { status: { equals: "published" } },
    limit: 50,
    depth: 0,
  })
  return result.docs.map((doc) => ({
    id: String(doc.id),
    title: doc.title,
    subtitle: doc.subtitle ?? undefined,
    description: doc.description ?? undefined,
    category: doc.category ?? undefined,
    tags: doc.tags?.map((t: { tag?: string }) => t.tag ?? "") ?? [],
    liveUrl: doc.liveUrl ?? undefined,
    repoUrl: doc.repoUrl ?? undefined,
    startDate: doc.startDate ?? undefined,
    endDate: doc.endDate ?? undefined,
    highlights: doc.highlights?.map((h: { point?: string }) => h.point ?? "") ?? [],
    featured: doc.featured ?? false,
  }))
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 3: Run build to confirm no build errors**

```bash
cd /root/Work/flcn-website && npm run build 2>&1 | tail -30
```

Expected: build completes without TypeScript errors. Payload connection errors during build are acceptable if `MONGODB_URI` is not set in the build environment.

- [ ] **Step 4: Commit**

```bash
git add "app/(site)/projects/page.tsx"
git commit -m "feat(projects): add /projects listing page with Payload CMS"
```

---

## Post-Implementation: Populate data in Payload admin

After all code is in place:

1. Start dev server: `npm run dev`
2. Visit `http://localhost:3000/admin`
3. Create first admin user (first-time setup screen)
4. Add **Work** entries — use the 3 case studies from `content/work.ts` as source data
5. Add **Timeline** entries — use the 4 job entries from `content/journey.ts`; set `order` to 1 (Groww), 2 (Meesho), 3 (Wingify), 4 (Successive)
6. Add **Projects** entries — use the CV "Selected Projects" section; mark Study.IQ, Kanban Tab, and GitHub PR Reviewer as `featured: true`
7. Set all entries to `status: published`
8. Verify `/work`, `/projects`, and homepage all display data correctly
