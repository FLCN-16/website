import Link from "next/link";
import { type WorkEntry } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { FadeRise } from "@/components/anim/fade-rise";
import { cn } from "@/lib/utils";

interface SelectedWorkProps {
  projects: WorkEntry[];
  showViewAll?: boolean;
  variant?: "grid" | "list";
  showSectionHeader?: boolean;
}

export function SelectedWork({
  projects,
  showViewAll,
  variant = "grid",
  showSectionHeader = true,
}: SelectedWorkProps) {
  return (
    <section
      className={cn("py-16 md:py-24", variant === "list" && "py-0 md:py-0")}
    >
      <FadeRise>
        {showSectionHeader && (
          <div className="mb-10 md:mb-14">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Selected Work
            </p>
            <h2 className="text-3xl font-semibold tracking-tight">
              Things I&apos;ve built
            </h2>
          </div>
        )}

        {variant === "grid" ? (
          <GridLayout projects={projects} />
        ) : (
          <ListLayout projects={projects} />
        )}

        {showViewAll && (
          <div className="mt-12 flex justify-start">
            <Link
              href="/work"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors group"
            >
              View All Work
              <span className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>
        )}
      </FadeRise>
    </section>
  );
}

function GridLayout({ projects }: { projects: WorkEntry[] }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {projects.map((project) => (
        <Link
          key={project.slug}
          href={`/work/${project.slug}`}
          className="group relative flex flex-col border border-border p-5 md:p-6 hover:border-foreground/25 hover:-translate-y-0.5 hover:shadow-lg dark:hover:shadow-black/40 transition-all duration-300"
        >
          <div className="flex items-center justify-between gap-2 mb-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {project.category}
            </span>
            <span className="font-mono text-xs text-muted-foreground/0 group-hover:text-muted-foreground transition-colors duration-200">
              →
            </span>
          </div>

          <h3 className="text-base font-semibold leading-snug">
            {project.title}
          </h3>

          <p className="text-sm text-muted-foreground mt-3 leading-relaxed flex-1">
            {project.description}
          </p>

          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-5 pt-4 border-t border-border/60">
              {project.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="font-mono text-[10px] py-0 h-5"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}

function ListLayout({ projects }: { projects: WorkEntry[] }) {
  return (
    <div className="divide-y divide-border">
      {projects.map((project) => (
        <Link
          key={project.slug}
          href={`/work/${project.slug}`}
          className="group flex items-start gap-6 md:gap-10 py-8 md:py-10 -mx-6 px-6 md:-mx-12 md:px-12 hover:bg-muted/25 transition-colors duration-200"
        >
          <span className="font-mono text-4xl md:text-5xl font-bold text-muted-foreground/20 leading-none shrink-0 pt-1 select-none group-hover:text-muted-foreground/35 transition-colors">
            {project.ord}
          </span>

          <div className="flex-1 min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
              {project.category}
            </p>
            <h2 className="text-xl md:text-2xl font-semibold tracking-tight leading-snug">
              {project.title}
            </h2>
            <p className="text-muted-foreground mt-3 leading-relaxed max-w-2xl text-sm">
              {project.description}
            </p>
            {project.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {project.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="font-mono text-[10px] py-0 h-5"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <span className="font-mono text-muted-foreground/40 group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0 self-center text-lg">
            →
          </span>
        </Link>
      ))}
    </div>
  );
}
