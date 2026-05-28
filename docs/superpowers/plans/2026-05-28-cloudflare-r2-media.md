# Cloudflare R2 Media Storage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Payload CMS's local filesystem upload with Cloudflare R2 storage, served via `media.thefalcon.dev` with Cloudflare on-the-fly image transformations.

**Architecture:** Install `@payloadcms/storage-s3`, configure it to upload originals to R2 via the S3-compatible API. Disable Payload's server-side image resizing — Cloudflare handles transforms on-the-fly via `/cdn-cgi/image/` URL params. A custom Next.js image loader auto-generates Cloudflare transform URLs for every `<Image>` component.

**Tech Stack:** `@payloadcms/storage-s3`, Cloudflare R2 (S3-compatible), Cloudflare Image Transformations, Next.js custom `loaderFile`, Vitest

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `lib/cloudflare-image-loader.ts` | Next.js custom loader — builds `/cdn-cgi/image/` transform URLs |
| Create | `lib/__tests__/cloudflare-image-loader.test.ts` | Unit tests for the loader's URL builder |
| Create | `vitest.config.ts` | Vitest config with TypeScript path alias |
| Modify | `package.json` | Add `@payloadcms/storage-s3`, `vitest`; add `test` script |
| Modify | `payload.config.ts` | Add `s3Storage` plugin targeting `media` collection |
| Modify | `collections/Media.ts` | Set `upload: { disableLocalStorage: true }` |
| Modify | `next.config.ts` | Add `images.loaderFile` and `images.remotePatterns` |
| Modify | `.env` | Add R2 env var placeholders (values filled in by operator) |

---

## Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install runtime and dev dependencies**

```bash
cd /root/Work/flcn-website
pnpm add @payloadcms/storage-s3
pnpm add -D vitest
```

Expected: both packages appear in `package.json` under `dependencies` and `devDependencies` respectively.

- [ ] **Step 2: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add @payloadcms/storage-s3 and vitest"
```

---

## Task 2: Set Up Vitest

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json`

- [ ] **Step 1: Create vitest config**

Create `vitest.config.ts` at the project root:

```typescript
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'node',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
```

- [ ] **Step 2: Add test script to package.json**

In `package.json`, add to the `"scripts"` block:

```json
"test": "vitest run"
```

The scripts block should look like:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "vitest run"
}
```

- [ ] **Step 3: Verify Vitest runs**

```bash
pnpm test
```

Expected output: `No test files found` or similar — no errors, just nothing to run yet.

- [ ] **Step 4: Commit**

```bash
git add vitest.config.ts package.json
git commit -m "chore: configure vitest"
```

---

## Task 3: Implement Cloudflare Image Loader (TDD)

**Files:**
- Create: `lib/__tests__/cloudflare-image-loader.test.ts`
- Create: `lib/cloudflare-image-loader.ts`

The loader is a pure function used by Next.js Image. It receives `{ src, width, quality }` and returns a Cloudflare transform URL. `src` will be a full URL like `https://media.thefalcon.dev/photo.jpg` (from Payload's `generateFileURL`). The loader strips the domain and inserts `/cdn-cgi/image/<params>` before the path.

- [ ] **Step 1: Write failing tests**

Create `lib/__tests__/cloudflare-image-loader.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { buildCloudflareUrl } from '../cloudflare-image-loader'

const BASE = 'https://media.thefalcon.dev'

describe('buildCloudflareUrl', () => {
  it('builds transform URL from a full src URL', () => {
    const result = buildCloudflareUrl(`${BASE}/photo.jpg`, 800, 85, BASE)
    expect(result).toBe(`${BASE}/cdn-cgi/image/width=800,quality=85,format=auto/photo.jpg`)
  })

  it('builds transform URL from a relative src path', () => {
    const result = buildCloudflareUrl('/photo.jpg', 400, 75, BASE)
    expect(result).toBe(`${BASE}/cdn-cgi/image/width=400,quality=75,format=auto/photo.jpg`)
  })

  it('defaults quality to 85 when not provided', () => {
    const result = buildCloudflareUrl(`${BASE}/img.png`, 1200, undefined, BASE)
    expect(result).toBe(`${BASE}/cdn-cgi/image/width=1200,quality=85,format=auto/img.png`)
  })

  it('handles filenames with subdirectories', () => {
    const result = buildCloudflareUrl(`${BASE}/uploads/hero.jpg`, 800, 85, BASE)
    expect(result).toBe(`${BASE}/cdn-cgi/image/width=800,quality=85,format=auto/uploads/hero.jpg`)
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
pnpm test
```

Expected: 4 failing tests — `buildCloudflareUrl` is not defined.

- [ ] **Step 3: Implement the loader**

Create `lib/cloudflare-image-loader.ts`:

```typescript
import type { ImageLoaderProps } from 'next/image'

export function buildCloudflareUrl(
  src: string,
  width: number,
  quality: number | undefined,
  baseUrl: string,
): string {
  const q = quality ?? 85
  const params = `width=${width},quality=${q},format=auto`
  const path = src.startsWith('http') ? new URL(src).pathname : src
  return `${baseUrl}/cdn-cgi/image/${params}${path}`
}

export default function cloudflareLoader({ src, width, quality }: ImageLoaderProps): string {
  return buildCloudflareUrl(src, width, quality, process.env.NEXT_PUBLIC_MEDIA_URL ?? '')
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
pnpm test
```

Expected:

```
✓ lib/__tests__/cloudflare-image-loader.test.ts (4)
  ✓ builds transform URL from a full src URL
  ✓ builds transform URL from a relative src path
  ✓ defaults quality to 85 when not provided
  ✓ handles filenames with subdirectories

Test Files  1 passed (1)
Tests       4 passed (4)
```

- [ ] **Step 5: Commit**

```bash
git add lib/cloudflare-image-loader.ts lib/__tests__/cloudflare-image-loader.test.ts
git commit -m "feat: add Cloudflare image loader with URL builder"
```

---

## Task 4: Update Media Collection

**Files:**
- Modify: `collections/Media.ts`

- [ ] **Step 1: Replace `upload: true` with the object form**

Current `collections/Media.ts`:

```typescript
import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
  },
  upload: true,
  fields: [
    {
      name: "alt",
      type: "text",
    },
  ],
};
```

New `collections/Media.ts`:

```typescript
import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
  },
  upload: {
    disableLocalStorage: true,
  },
  fields: [
    {
      name: "alt",
      type: "text",
    },
  ],
};
```

- [ ] **Step 2: Commit**

```bash
git add collections/Media.ts
git commit -m "feat(media): disable local storage in preparation for R2"
```

---

## Task 5: Add s3Storage Plugin to Payload Config

**Files:**
- Modify: `payload.config.ts`

- [ ] **Step 1: Update payload.config.ts**

Current `payload.config.ts`:

```typescript
import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { Users } from "./collections/Users";
import { Posts } from "./collections/Posts";
import { Media } from "./collections/Media";
import { Submissions } from "./collections/Submissions";
import { Work } from "./collections/Work";
import { Projects } from "./collections/Projects";
import { Timeline } from "./collections/Timeline";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

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
});
```

New `payload.config.ts`:

```typescript
import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { Users } from "./collections/Users";
import { Posts } from "./collections/Posts";
import { Media } from "./collections/Media";
import { Submissions } from "./collections/Submissions";
import { Work } from "./collections/Work";
import { Projects } from "./collections/Projects";
import { Timeline } from "./collections/Timeline";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

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
  plugins: [
    s3Storage({
      collections: {
        media: {
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) => {
            const key = prefix ? `${prefix}/${filename}` : filename
            return `${process.env.R2_PUBLIC_URL}/${key}`
          },
        },
      },
      bucket: process.env.R2_BUCKET_NAME || "",
      config: {
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
        },
        region: "auto",
        endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        forcePathStyle: true,
      },
    }),
  ],
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  upload: {
    limits: {
      fileSize: 5_000_000,
    },
  },
});
```

- [ ] **Step 2: Confirm TypeScript compiles without errors**

```bash
pnpm build 2>&1 | head -40
```

Expected: build succeeds or shows only unrelated warnings. If TypeScript errors appear on `s3Storage` types, run `pnpm add @types/aws-sdk` or check that `@payloadcms/storage-s3` exports types (it ships its own).

- [ ] **Step 3: Commit**

```bash
git add payload.config.ts
git commit -m "feat(payload): wire up s3Storage plugin for Cloudflare R2"
```

---

## Task 6: Update Next.js Config

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Add loaderFile and remotePatterns**

New `next.config.ts`:

```typescript
import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["194.36.85.25"],
  images: {
    loaderFile: "./lib/cloudflare-image-loader.ts",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.thefalcon.dev",
      },
    ],
  },
};

export default withPayload(nextConfig);
```

- [ ] **Step 2: Confirm build still compiles**

```bash
pnpm build 2>&1 | head -40
```

Expected: no new TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add next.config.ts
git commit -m "feat(next): add Cloudflare image loader and R2 remote pattern"
```

---

## Task 7: Add Env Vars

**Files:**
- Modify: `.env`

- [ ] **Step 1: Add R2 placeholders to .env**

Append the following lines to `.env` (fill in real values from the Cloudflare dashboard — R2 → Manage API tokens):

```bash
# Cloudflare R2
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=your_r2_bucket_name
R2_PUBLIC_URL=https://media.thefalcon.dev

# Next.js public (used in browser-side image loader)
NEXT_PUBLIC_MEDIA_URL=https://media.thefalcon.dev
```

Where to find the values in Cloudflare dashboard:
- `R2_ACCOUNT_ID`: Right sidebar on any Cloudflare dashboard page under "Account ID"
- `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY`: R2 → Overview → Manage R2 API Tokens → Create API Token (Object Read & Write on the specific bucket)
- `R2_BUCKET_NAME`: The exact bucket name (not the custom domain)
- `R2_PUBLIC_URL` / `NEXT_PUBLIC_MEDIA_URL`: `https://media.thefalcon.dev` (the Cloudflare-proxied custom domain on the bucket)

> ⚠️ Also confirm in Cloudflare dashboard: **Speed → Optimization → Image Resizing** is toggled **On** for `thefalcon.dev`. Without this, `/cdn-cgi/image/` URLs return 404.

- [ ] **Step 2: Verify env vars are loaded**

Start the dev server and confirm no startup errors about missing R2 config:

```bash
pnpm dev 2>&1 | head -20
```

Expected: Next.js starts on port 3000 without R2-related errors. (Actual uploads won't work until Step 8.)

- [ ] **Step 3: Do NOT commit .env — only commit if adding a .env.example**

The `.env` file contains secrets. If a `.env.example` exists or is desired, create it with empty values:

```bash
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=
NEXT_PUBLIC_MEDIA_URL=
```

```bash
git add .env.example
git commit -m "chore: document R2 env vars in .env.example"
```

---

## Task 8: Smoke Test

No code changes — manual verification only.

- [ ] **Step 1: Start the dev server**

```bash
pnpm dev
```

- [ ] **Step 2: Upload an image via Payload Admin**

Open `http://localhost:3000/admin`, go to **Media → Create New**, upload any image (JPEG or PNG under 5MB).

Expected: upload completes without error. The media document is saved with a URL starting with `https://media.thefalcon.dev/`.

- [ ] **Step 3: Verify the file is in R2**

In the Cloudflare dashboard, open R2 → your bucket → browse objects. The uploaded filename should appear.

- [ ] **Step 4: Verify direct URL works**

Open the URL shown in the Payload media record in a browser tab. Expected: image loads directly from `media.thefalcon.dev`.

- [ ] **Step 5: Verify Cloudflare transform URL works**

Take the filename (e.g. `photo.jpg`) and open:
```
https://media.thefalcon.dev/cdn-cgi/image/width=400,quality=85,format=auto/photo.jpg
```

Expected: resized image loads. If you get a 404 or "Transformations not enabled" error, go to Cloudflare → Speed → Optimization → Image Resizing and enable it.

- [ ] **Step 6: Verify Next.js Image component generates Cloudflare URLs**

Add a temporary page or check the browser DevTools Network tab on any page that renders a Payload media image via `<Image>`. The `src` attribute on the rendered `<img>` should contain `/cdn-cgi/image/width=...` — confirming the custom loader is active.

- [ ] **Step 7: Run tests one final time**

```bash
pnpm test
```

Expected: 4 passing tests.

- [ ] **Step 8: Final commit**

```bash
git add .
git commit -m "feat: Cloudflare R2 media storage with on-the-fly image transformations"
```
