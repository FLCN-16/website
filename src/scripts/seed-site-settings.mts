/**
 * Populates the SiteSettings global with data previously held in static
 * content files (content/site.ts + content/philosophy.ts) that were removed
 * when identity/philosophy moved to the CMS.
 *
 * Safe to re-run — updateGlobal is idempotent (it overwrites the single global doc).
 * Run: pnpm tsx src/scripts/seed-site-settings.mts
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'

function loadEnv() {
  try {
    const content = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8')
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIdx = trimmed.indexOf('=')
      if (eqIdx === -1) continue
      const key = trimmed.slice(0, eqIdx).trim()
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '')
      if (key && !process.env[key]) process.env[key] = val
    }
  } catch { /* rely on shell env */ }
}

loadEnv()

const { getPayload } = await import('payload')
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { default: config } = await import('../payload.config') as any
const payload = await getPayload({ config })

await payload.updateGlobal({
  slug: 'site-settings',
  data: {
    identity: {
      name: 'Rishabh Kumar',
      handle: 'thefalcon',
      role: 'Technical Lead — Full Stack',
      location: 'Jalandhar, Punjab, India',
      timezone: 'UTC+5:30',
      email: 'me@thefalcon.dev',
      siteUrl: 'https://www.thefalcon.dev',
      description:
        'Full-Stack Technical Lead with 9+ years shipping production web, mobile, and AI systems. Next.js OSS contributor. Open to senior engineering roles.',
    },
    socials: [
      { platform: 'github',    url: 'https://github.com/FLCN-16',                      label: 'GitHub' },
      { platform: 'linkedin',  url: 'https://linkedin.com/in/rishabh-kumar-flcn16',    label: 'LinkedIn' },
      { platform: 'instagram', url: 'https://instagram.com/flcn16',                    label: '@flcn16' },
    ],
    availability: {
      available: false,
      label: 'OPEN TO ROLES',
    },
    eyebrow: 'Technical Lead — Full Stack · Jalandhar, India',
    headline: 'Leading teams across the stack,\nshipping production systems.',
    subheadline:
      'Full-Stack Technical Lead with 9+ years building and shipping production web, mobile, and browser-based applications. Open-source contributor to Next.js (vercel/next.js), builder of agentic AI systems with LangChain and Mastra AI, and author of apps live on the Chrome Web Store and Google Play.',
    stats: [
      { value: '9+',  label: 'Years Shipping' },
      { value: '1M+', label: 'Users Reached' },
      { value: 'OSS', label: 'Next.js Contributor' },
      { value: '2',   label: 'Apps on Play Store' },
    ],
    philosophy: [
      {
        title: 'Performance is a feature',
        body: 'Every millisecond of load time costs real users. I treat Core Web Vitals as hard constraints from day one — not an afterthought before release. A fast product is a respectful product, and the engineering choices that enable speed compound across the entire codebase.',
      },
      {
        title: 'Design and engineering are one discipline',
        body: 'The best interfaces emerge when the person writing the code understands why a design decision was made, not just what it looks like. I invest in design-token systems, shared language with designers, and close feedback loops that keep intent intact from Figma to production.',
      },
      {
        title: 'Systems thinking over clever solutions',
        body: 'Clever code impresses in a PR review; well-structured systems hold up through two years of team turnover and a product pivot. I optimise for clarity, composability, and constraints that make the wrong choice harder to make than the right one.',
      },
    ],
  },
  overrideAccess: true,
})

console.log('✅ SiteSettings global populated.')

// Verify
const result = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
console.log(`   identity.name   : ${result.identity?.name}`)
console.log(`   socials         : ${(result.socials ?? []).length}`)
console.log(`   philosophy      : ${(result.philosophy ?? []).length} pillars`)
console.log(`   headline        : ${String(result.headline ?? '').slice(0, 40)}…`)

process.exit(0)
