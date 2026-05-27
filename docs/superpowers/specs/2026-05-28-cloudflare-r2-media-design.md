# Cloudflare R2 Media Storage — Design Spec

**Date:** 2026-05-28  
**Status:** Approved

## Overview

Replace Payload CMS's default local filesystem storage with Cloudflare R2. Images are served via a Cloudflare-proxied custom domain (`media.thefalcon.dev`) and transformed on the fly using Cloudflare's Image Transformations (5,000 free unique transforms/month on the free plan). No server-side image resizing — originals are uploaded to R2, and Cloudflare resizes/converts at the edge.

## Architecture

```
Payload Admin upload
        │
        ▼
@payloadcms/storage-s3 plugin
        │
        ▼
Cloudflare R2 bucket  ──────────────────────────────────────────────┐
        │                                                           │
        ▼                                                           │
media.thefalcon.dev (Cloudflare-proxied, orange cloud)             │
        │                                                           │
        ├── Direct URL: https://media.thefalcon.dev/photo.jpg      │
        │                                                           │
        └── Transform URL:                                          │
            https://media.thefalcon.dev/cdn-cgi/image/             │
            width=800,quality=85,format=auto/photo.jpg ◄───────────┘
                    │
                    ▼
            Next.js <Image> (via custom loader)
```

## Data Flow

1. User uploads a file in Payload Admin
2. `@payloadcms/storage-s3` intercepts storage, uploads the original directly to R2
3. `disableLocalStorage: true` on the Media collection — nothing touches the VPS filesystem
4. Payload saves the media document to MongoDB; `generateFileURL` returns `https://media.thefalcon.dev/<filename>`
5. Front-end renders images via Next.js `<Image>`, which calls the custom Cloudflare loader
6. Loader generates `/cdn-cgi/image/width,quality,format=auto/` URLs
7. Cloudflare transforms and caches the variant at the edge on first request; subsequent requests are served from cache (no transform counted)

## Files Changed

### 1. `package.json` (dependency)
Add: `@payloadcms/storage-s3`

### 2. `payload.config.ts`
Add `s3Storage` plugin:
- **endpoint:** `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
- **region:** `auto`
- **bucket:** `process.env.R2_BUCKET_NAME`
- **credentials:** `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY`
- **collections:** `{ media: true }`
- **generateFileURL:** `({ filename }) => \`${process.env.R2_PUBLIC_URL}/${filename}\``

### 3. `collections/Media.ts`
Add `disableLocalStorage: true` to the upload config. No `imageSizes` — Cloudflare handles transforms on the fly.

### 4. `next.config.ts`
- Add `images.loaderFile: './lib/cloudflare-image-loader.ts'`
- Add `media.thefalcon.dev` to `images.remotePatterns`

### 5. `lib/cloudflare-image-loader.ts` (new file)
Custom Next.js image loader that builds Cloudflare transformation URLs:
```
https://media.thefalcon.dev/cdn-cgi/image/width={w},quality={q},format=auto/{src}
```
Accepts `src`, `width`, `quality` — standard Next.js loader interface.

## Environment Variables

| Variable | Description |
|---|---|
| `R2_ACCOUNT_ID` | Cloudflare account ID |
| `R2_ACCESS_KEY_ID` | R2 API token key ID |
| `R2_SECRET_ACCESS_KEY` | R2 API token secret |
| `R2_BUCKET_NAME` | R2 bucket name |
| `R2_PUBLIC_URL` | `https://media.thefalcon.dev` |

## Cloudflare Requirements

- `media.thefalcon.dev` must be **Cloudflare-proxied** (orange cloud in DNS) — confirmed ✓
- Image Transformations must be **enabled** for the zone in Cloudflare dashboard (Speed → Optimization → Image Resizing)
- The R2 bucket's custom domain must be `media.thefalcon.dev`

## Constraints & Notes

- **5,000 free unique transforms/month** — each unique (image + params) combo counts once, then cached forever. Ample for a portfolio site.
- **format=auto** is preferred over `format=webp` — lets Cloudflare serve AVIF to browsers that support it.
- **No imageSizes in Payload** — removing server-side resize keeps uploads fast and R2 storage minimal (one original per upload).
- **Existing local media** — any files previously uploaded locally will need to be manually migrated to R2 if needed. New uploads go to R2 automatically after this change.
- **File size limit** — current 5MB limit in `payload.config.ts` is retained.
