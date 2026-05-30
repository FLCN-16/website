// components/sections/projects-grid.tsx
import Link from "next/link"
import { type ProjectEntry } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { FadeRise } from "@/components/anim/fade-rise"
import { OutboundLink } from "@/components/site/tracked-link"
import { cn } from "@/lib/utils"

interface ProjectsGridProps {
  projects: ProjectEntry[]
  showSectionHeader?: boolean
  showViewAll?: boolean
}

function ProjectCard({ project }: { project: ProjectEntry }) {
  const hasLink = !!(project.liveUrl || project.repoUrl)

  return (
    <div
      className={cn(
        "group relative flex flex-col border border-border transition-all duration-300",
        "hover:border-foreground/25 hover:-translate-y-0.5 hover:shadow-lg dark:hover:shadow-black/40",
        project.featured && "border-primary/20 hover:border-primary/35"
      )}
    >
      {project.featured && (
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      )}

      <div className="flex flex-col flex-1 p-5 md:p-6">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2.5 min-w-0">
            {project.featured && (
              <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-primary/80 shrink-0">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
                Featured
              </span>
            )}
            {project.category && (
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground truncate">
                {project.category}
              </span>
            )}
          </div>
          {(project.startDate || project.endDate) && (
            <span className="font-mono text-[10px] text-muted-foreground/55 shrink-0">
              {project.startDate}
              {project.endDate ? `–${project.endDate}` : ""}
            </span>
          )}
        </div>

        <h3 className="text-base font-semibold leading-snug">{project.title}</h3>

        {project.subtitle && (
          <p className="text-sm text-muted-foreground/60 mt-0.5">{project.subtitle}</p>
        )}

        {project.description && (
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
            {project.description}
          </p>
        )}

        {project.highlights.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {project.highlights.slice(0, 3).map((point) => (
              <li key={point} className="text-sm text-muted-foreground leading-relaxed flex gap-2">
                <span className="text-muted-foreground/30 shrink-0 pt-px select-none">–</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex-1" />

        {(project.tags.length > 0 || hasLink) && (
          <div className="mt-5 pt-4 border-t border-border/60 flex items-center justify-between gap-3 flex-wrap">
            {project.tags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 min-w-0">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="font-mono text-[10px] py-0 h-5">
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : (
              <div />
            )}

            {hasLink && (
              <div className="flex gap-4 shrink-0">
                {project.liveUrl && (
                  <OutboundLink
                    url={project.liveUrl}
                    context="project_card"
                    className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Live <span className="text-[10px] opacity-70">↗</span>
                  </OutboundLink>
                )}
                {project.repoUrl && (
                  <OutboundLink
                    url={project.repoUrl}
                    context="project_card"
                    className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Code <span className="text-[10px] opacity-70">↗</span>
                  </OutboundLink>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export function ProjectsGrid({
  projects,
  showSectionHeader = true,
  showViewAll = false,
}: ProjectsGridProps) {
  return (
    <section className="py-16 md:py-24">
      <FadeRise>
        {showSectionHeader && (
          <div className="mb-10 md:mb-14">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Projects
            </p>
            <h2 className="text-3xl font-semibold tracking-tight">
              Things I&apos;ve shipped
            </h2>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-5">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {showViewAll && (
          <div className="mt-12 flex justify-start">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors group"
            >
              View All Projects
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
        )}
      </FadeRise>
    </section>
  )
}
