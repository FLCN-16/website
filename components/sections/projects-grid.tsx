// components/sections/projects-grid.tsx
import Link from "next/link"
import { type ProjectEntry } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { FadeRise } from "@/components/anim/fade-rise"

interface ProjectsGridProps {
  projects: ProjectEntry[]
  showSectionHeader?: boolean
  showViewAll?: boolean
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

        <div className="grid sm:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col border border-border rounded-lg p-6 hover:border-foreground/20 hover:bg-muted/40 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                {project.category && (
                  <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                    {project.category}
                  </span>
                )}
                {(project.startDate || project.endDate) && (
                  <span className="font-mono text-xs text-muted-foreground shrink-0">
                    {project.startDate}
                    {project.endDate ? ` – ${project.endDate}` : ""}
                  </span>
                )}
              </div>

              <h3 className="text-base font-semibold leading-snug">{project.title}</h3>

              {project.subtitle && (
                <p className="text-sm text-muted-foreground/70 mt-0.5">{project.subtitle}</p>
              )}

              {project.description && (
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                  {project.description}
                </p>
              )}

              {project.highlights.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {project.highlights.slice(0, 2).map((point, i) => (
                    <li key={i} className="text-sm text-muted-foreground leading-relaxed flex gap-2">
                      <span className="text-muted-foreground/40 shrink-0 pt-px">–</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              )}

              {project.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-border">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="font-mono text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {(project.liveUrl || project.repoUrl) && (
                <div className="flex gap-4 mt-4">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Live ↗
                    </a>
                  )}
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Code ↗
                    </a>
                  )}
                </div>
              )}
            </div>
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
