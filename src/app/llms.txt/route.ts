import { NextResponse } from 'next/server'
import { getCachedWorkEntries, getCachedPosts, getCachedProjects, getCachedSiteSettings } from '@/lib/data'
import { buildIdentity } from '@/lib/site-identity'
import { stack } from '@/content/stack'

export async function GET() {
  const [settings, workEntries, posts, projects] = await Promise.all([
    getCachedSiteSettings().catch(() => null),
    getCachedWorkEntries().catch(() => []),
    getCachedPosts().catch(() => []),
    getCachedProjects().catch(() => []),
  ])
  const identity = buildIdentity(settings)

  const lines: string[] = [
    `# ${identity.name}`,
    `> ${identity.role} based in ${identity.location}. ${identity.description}`,
    '',
    `Contact: ${identity.email}`,
    '',
    '## Pages',
    `- [About](${identity.url}/): Introduction, career stats, work philosophy, and experience timeline.`,
    `- [Work](${identity.url}/work): Selected project case studies covering problem, approach, impact, and stack.`,
    `- [Projects](${identity.url}/projects): Side projects, Chrome extensions, mobile apps, and open-source contributions.`,
    `- [Stack](${identity.url}/stack): Full tool and technology breakdown with proficiency levels.`,
    `- [Writing](${identity.url}/writing): Articles on frontend engineering, architecture, and building at scale.`,
    `- [Contact](${identity.url}/contact): Enquiry form and direct contact details.`,
    '',
    '## Selected Work',
    ...workEntries.map(
      (p) => `- [${p.title}](${identity.url}/work/${p.slug}): ${p.description}`
    ),
    '',
    '## Writing',
    ...posts.map(
      (p) =>
        `- [${p.title}](${identity.url}/writing/${p.slug})${p.excerpt ? `: ${p.excerpt}` : ''}`
    ),
    '',
    '## Projects',
    ...projects.map((p) => {
      const url = p.liveUrl ?? p.repoUrl
      const name = url ? `[${p.title}](${url})` : p.title
      return `- ${name}${p.description ? `: ${p.description}` : ''}`
    }),
    '',
    '## Stack Highlights',
    ...stack.disciplines.map(
      (d) =>
        `- ${d.name}: ${d.tools
          .flatMap((t) =>
            t.maturity === 'expert' || t.maturity === 'proficient' ? [t.name] : []
          )
          .join(', ')}`
    ),
  ]

  return new NextResponse(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=3600',
    },
  })
}
