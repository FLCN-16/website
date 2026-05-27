import { SelectedWork } from "@/components/sections/selected-work"
import { projects } from "@/content/work"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Work",
  description: "Selected projects from 9+ years of frontend engineering.",
})

export default function WorkIndex() {
  return (
    <>
      {/* Page header */}
      <div className="pt-6 pb-10 border-b border-border">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
          Selected Work
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
          Things I&apos;ve built.
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl leading-relaxed">
          Three in-depth case studies spanning platform architecture, design systems,
          and data visualisation — each one a lesson in trade-offs, leadership, and craft.
        </p>
      </div>

      {/* Project list */}
      <SelectedWork projects={projects} variant="list" showSectionHeader={false} />
    </>
  )
}
