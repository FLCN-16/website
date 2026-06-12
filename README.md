# payload-portfolio

A production-ready personal portfolio and blog template built with Next.js 16 (App Router) and Payload CMS 3. Ships with a full content management admin panel, Cloudflare R2 media storage, Resend email integration, and one-click deployment to Vercel.

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 16 | App Router, React Server Components, image optimization, draft mode |
| Payload CMS 3 | Headless CMS, admin panel, REST API, live preview |
| MongoDB Atlas | Database for CMS content |
| Cloudflare R2 | Media and image storage (S3-compatible) |
| Resend | Transactional email — contact form notifications and post broadcasts |
| Tailwind CSS 4 | Utility-first styling |
| TypeScript | Type safety throughout |

## Prerequisites

- **Node.js** 20+ (LTS recommended)
- **pnpm** — install with `npm i -g pnpm`
- **MongoDB instance** — MongoDB Atlas free tier works
- **Cloudflare R2 bucket** — for media and image uploads
- **Resend account** — optional, required for the contact form and post newsletter broadcasts

## Quick Start

1. Install dependencies

   ```bash
   pnpm install
   ```

2. Copy the example env file and fill in the values

   ```bash
   cp .env.example .env.local
   ```

3. Start the development server

   ```bash
   pnpm dev
   ```

4. Open `http://localhost:3000/admin`, then create your first admin user when prompted by Payload

5. Go to **Globals > Site Settings** and fill in your Identity, Social Links, and Engineering Philosophy

6. Go to the **Timeline** collection and add your career history

7. Go to the **Work** collection and add your case studies

8. Edit `content/stack.ts` to list your own tech stack

9. Deploy to Vercel (see Deployment section below)

## Environment Variables

| Variable | Description |
|---|---|
| `PAYLOAD_SECRET` | Secret used by Payload to sign auth tokens — use any long random string |
| `MONGODB_URI` | MongoDB connection string — get this from MongoDB Atlas under Database > Connect |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL of your site (e.g. `https://yourdomain.com`; use `http://localhost:3000` in dev) |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager container ID — optional, leave blank to disable analytics |
| `R2_ACCOUNT_ID` | Cloudflare account ID — found in the Cloudflare dashboard right sidebar |
| `R2_ACCESS_KEY_ID` | R2 API token Access Key ID — create a token under R2 > Manage API Tokens |
| `R2_SECRET_ACCESS_KEY` | R2 API token Secret Access Key — shown once when you create the token |
| `R2_BUCKET_NAME` | Name of your R2 bucket |
| `R2_PUBLIC_URL` | Public CDN base URL for the bucket — used server-side by Payload and SiteSettings |
| `NEXT_PUBLIC_MEDIA_URL` | Same value as `R2_PUBLIC_URL` — used client-side by the Next.js image loader |
| `RESEND_API_KEY` | API key from your Resend dashboard under API Keys |
| `RESEND_FROM_ADDRESS` | Sender address for outgoing emails (e.g. `noreply@yourdomain.com`) |
| `RESEND_FROM_NAME` | Display name for outgoing emails (e.g. `Your Name`) |
| `RESEND_TO` | Recipient address for contact form notification emails |
| `RESEND_SEGMENT_ID` | Resend Audience Segment ID used by the subscribe action and post broadcast feature |
| `PREVIEW_SECRET` | Random secret string that protects the `/next/preview` draft-mode route |

## Deployment (Vercel)

1. Push the repository to GitHub (or GitLab / Bitbucket)
2. Import the project in the [Vercel dashboard](https://vercel.com/new)
3. Add all environment variables from your `.env.local` under the project's Environment Variables settings
4. Click Deploy — Vercel auto-detects Next.js and applies the correct build settings

The included `vercel.json` raises the serverless function `maxDuration` to 60 seconds to accommodate Payload's admin API routes.

## License

CodeCanyon Regular License. This item may be used in one end product by you or one client.
