import { NextResponse } from 'next/server'
import { getCachedWorkEntries, getCachedPosts, getCachedProjects } from '@/lib/data'
import { site } from '@/content/site'
import { stack } from '@/content/stack'

export async function GET() {
  const [workEntries, posts, projects] = await Promise.all([
    getCachedWorkEntries().catch(() => []),
    getCachedPosts().catch(() => []),
    getCachedProjects().catch(() => []),
  ])

  const lines: string[] = [
    `# ${site.name}`,
    `> ${site.role} based in ${site.location}. ${site.subheadline}`,
    '',
    `Contact: ${site.email}`,
    '',
    '## Pages',
    `- [About](${site.url}/): Introduction, career stats, work philosophy, and experience timeline.`,
    `- [Work](${site.url}/work): Selected project case studies covering problem, approach, impact, and stack.`,
    `- [Projects](${site.url}/projects): Side projects, Chrome extensions, mobile apps, and open-source contributions.`,
    `- [Stack](${site.url}/stack): Full tool and technology breakdown with proficiency levels.`,
    `- [Writing](${site.url}/writing): Articles on frontend engineering, architecture, and building at scale.`,
    `- [Contact](${site.url}/contact): Enquiry form and direct contact details.`,
    '',
    '## Selected Work',
    ...workEntries.map(
      (p) => `- [${p.title}](${site.url}/work/${p.slug}): ${p.description}`
    ),
    '',
    '## Writing',
    ...posts.map(
      (p) =>
        `- [${p.title}](${site.url}/writing/${p.slug})${p.excerpt ? `: ${p.excerpt}` : ''}`
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
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
