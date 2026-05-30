import {
  getCachedWorkEntries,
  getCachedProjects,
  getCachedTimeline,
  getCachedEducation,
  getCachedCertifications,
  getCachedSiteSettings,
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
import { site } from '@/content/site'
import { philosophy } from '@/content/philosophy'
import { createMetadata } from '@/lib/metadata'
import type { WorkEntry, ProjectEntry, TimelineEntry, EducationEntry, CertificationEntry } from '@/lib/types'

export const revalidate = false

export const metadata = createMetadata({
  title: `${site.name} — ${site.role}`,
  description: site.description,
  path: '/',
  absolute: true,
})

export default async function Home() {
  let workEntries: WorkEntry[] = []
  let allProjects: ProjectEntry[] = []
  let timelineItems: TimelineEntry[] = []
  let educationItems: EducationEntry[] = []
  let certificationItems: CertificationEntry[] = []

  const [workResult, projectsResult, timelineResult, educationResult, certificationsResult, settingsResult] =
    await Promise.allSettled([
      getCachedWorkEntries(),
      getCachedProjects(),
      getCachedTimeline(),
      getCachedEducation(),
      getCachedCertifications(),
      getCachedSiteSettings(),
    ])

  if (workResult.status === 'fulfilled') workEntries = workResult.value
  if (projectsResult.status === 'fulfilled') allProjects = projectsResult.value
  if (timelineResult.status === 'fulfilled') timelineItems = timelineResult.value
  if (educationResult.status === 'fulfilled') educationItems = educationResult.value
  if (certificationsResult.status === 'fulfilled') certificationItems = certificationsResult.value

  const cmsSettings = settingsResult.status === 'fulfilled' ? settingsResult.value : null

  const featuredProjects = allProjects.filter((p) => p.featured).slice(0, 6)

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    url: site.url,
    email: site.email,
    jobTitle: site.role,
    description: site.description,
    sameAs: site.socials.map((s) => s.url),
  }

  return (
    <>
      <JsonLd data={personSchema} />
      <Hero
        eyebrow={cmsSettings?.eyebrow ?? site.eyebrow}
        headline={cmsSettings?.headline ?? site.headline}
        subheadline={cmsSettings?.subheadline ?? site.subheadline}
        status={cmsSettings?.availability
          ? { available: cmsSettings.availability.available ?? site.status.available, label: cmsSettings.availability.label ?? site.status.label }
          : site.status}
        stats={cmsSettings?.stats ?? site.stats}
        primaryCta={{ label: 'View My Work', href: '/work' }}
        secondaryCta={{ label: 'Get In Touch', href: '/contact' }}
      />
      <Journey items={timelineItems} />
      <Philosophy
        eyebrow={philosophy.eyebrow}
        heading={philosophy.heading}
        pillars={philosophy.pillars}
      />
      <SelectedWork projects={workEntries.slice(0, 3)} showViewAll />
      {featuredProjects.length > 0 && (
        <ProjectsGrid projects={featuredProjects} showViewAll />
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
