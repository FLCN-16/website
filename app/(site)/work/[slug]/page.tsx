import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProjectBriefing } from "@/components/sections/project-briefing"
import { projects } from "@/content/work"

interface WorkDetailProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: WorkDetailProps): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) return {}
  return {
    title: project.title,
    description: project.description,
  }
}

export default async function WorkDetail({ params }: WorkDetailProps) {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) notFound()
  return <ProjectBriefing project={project} />
}
