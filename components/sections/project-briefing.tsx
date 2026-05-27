import Link from "next/link"
import { type Project, projects } from "@/content/work"
import { Badge } from "@/components/ui/badge"
import { FadeRise } from "@/components/anim/fade-rise"
import { MaskReveal } from "@/components/anim/mask-reveal"

interface ProjectBriefingProps {
  project: Project
}

export function ProjectBriefing({ project }: ProjectBriefingProps) {
  const currentIndex = projects.findIndex((p) => p.slug === project.slug)
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null

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
