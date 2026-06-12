import {
  getCachedWorkEntries,
  getCachedProjects,
  getCachedTimeline,
  getCachedEducation,
  getCachedCertifications,
  getCachedSiteSettings,
  getCachedPosts,
} from '@/lib/data'
import { Hero } from '@/components/sections/hero'
import { Journey } from '@/components/sections/journey'
import { Philosophy } from '@/components/sections/philosophy'
import { SelectedWork } from '@/components/sections/selected-work'
import { ProjectsGrid } from '@/components/sections/projects-grid'
import { Education } from '@/components/sections/education'
import { Certifications } from '@/components/sections/certifications'
import { CtaBanner } from '@/components/sections/cta-banner'
import { JsonLd } from '@/components/structured-data/json-ld'
import { SectionTracker } from '@/components/site/section-tracker'
import { personSchema } from '@/lib/structured-data'
import { buildIdentity } from '@/lib/site-identity'
import { createMetadata } from '@/lib/metadata'
import type { WorkEntry, ProjectEntry, TimelineEntry, EducationEntry, CertificationEntry, Post } from '@/lib/types'

export const revalidate = false

export async function generateMetadata() {
  const settings = await getCachedSiteSettings()
  const identity = buildIdentity(settings)
  return createMetadata({
    title: `${identity.name} — ${identity.role}`,
    description: identity.description,
    path: '/',
    absolute: true,
    identity,
  })
}

export default async function Home() {
  let workEntries: WorkEntry[] = []
  let allProjects: ProjectEntry[] = []
  let timelineItems: TimelineEntry[] = []
  let educationItems: EducationEntry[] = []
  let certificationItems: CertificationEntry[] = []
  let recentPosts: Post[] = []

  const [workResult, projectsResult, timelineResult, educationResult, certificationsResult, settingsResult, postsResult] =
    await Promise.allSettled([
      getCachedWorkEntries(),
      getCachedProjects(),
      getCachedTimeline(),
      getCachedEducation(),
      getCachedCertifications(),
      getCachedSiteSettings(),
      getCachedPosts(),
    ])

  if (workResult.status === 'fulfilled') workEntries = workResult.value
  if (projectsResult.status === 'fulfilled') allProjects = projectsResult.value
  if (timelineResult.status === 'fulfilled') timelineItems = timelineResult.value
  if (educationResult.status === 'fulfilled') educationItems = educationResult.value
  if (certificationsResult.status === 'fulfilled') certificationItems = certificationsResult.value
  if (postsResult.status === 'fulfilled') recentPosts = postsResult.value.slice(0, 3)

  const cmsSettings = settingsResult.status === 'fulfilled' ? settingsResult.value : null
  const identity = buildIdentity(cmsSettings)

  const featuredProjects = allProjects.filter((p) => p.featured).slice(0, 6)

  return (
    <>
      <JsonLd data={personSchema(identity)} />
      <SectionTracker
        sections={['hero', 'journey', 'philosophy', 'selected-work', 'projects', 'latest-writing', 'education', 'certifications', 'cta-banner']}
        page="/"
      />
      <Hero
        eyebrow={cmsSettings?.eyebrow ?? ''}
        headline={cmsSettings?.headline ?? ''}
        subheadline={cmsSettings?.subheadline ?? ''}
        status={cmsSettings?.availability
          ? { available: cmsSettings.availability.available ?? false, label: cmsSettings.availability.label ?? '' }
          : { available: false, label: '' }}
        stats={cmsSettings?.stats ?? []}
        primaryCta={{ label: 'View My Work', href: '/work' }}
        secondaryCta={{ label: 'Get In Touch', href: '/contact' }}
      />
      <Journey items={timelineItems} />
      {cmsSettings?.philosophy && cmsSettings.philosophy.length > 0 && (
        <Philosophy
          eyebrow="Engineering Philosophy"
          heading="How I think about building software"
          pillars={cmsSettings.philosophy}
        />
      )}
      <SelectedWork projects={workEntries.slice(0, 3)} showViewAll />
      {featuredProjects.length > 0 && (
        <ProjectsGrid projects={featuredProjects} showViewAll />
      )}
      {recentPosts.length > 0 && (
        <section id="latest-writing" className="py-16 border-t border-border">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
                Latest Writing
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                From the blog.
              </h2>
            </div>
            <a
              href="/writing"
              className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              All articles →
            </a>
          </div>
          <ul className="divide-y divide-border">
            {recentPosts.map((post) => (
              <li key={post.id}>
                <a
                  href={`/writing/${post.slug}`}
                  className="flex items-start justify-between gap-4 py-4 group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                      {post.title}
                    </p>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                  {post.readingTime && (
                    <span className="font-mono text-xs text-muted-foreground shrink-0 pt-0.5">
                      {post.readingTime} min
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
      <Education items={educationItems} />
      <Certifications items={certificationItems} />
      <CtaBanner
        eyebrow="Let's work together"
        heading="Open to new opportunities"
        body="I'm selectively exploring senior full-stack and tech-lead roles at product companies. If you're building something ambitious and care about craft, let's talk."
        primaryCta={{ label: 'Get In Touch', href: '/contact' }}
        secondaryCta={{ label: 'View My Stack', href: '/stack' }}
      />
    </>
  )
}
