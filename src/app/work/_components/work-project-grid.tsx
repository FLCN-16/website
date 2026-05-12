"use client";

import { Plus } from "lucide-react";

import { workProjects } from "./work-content";
import WorkProjectCard from "./work-project-card";

export default function WorkProjectGrid() {
  return (
    <section className="work-cards-grid gap-04">
      {workProjects.map((project) => (
        <WorkProjectCard key={project.title} project={project} />
      ))}

      <div className="min-h-work-card flex flex-col items-center justify-center gap-03 border border-dashed border-outline-variant bg-surface-low px-06 py-12 text-center opacity-70">
        <Plus size={24} className="text-outline" />
        <p className="font-mono text-label-sm text-outline">ADD STRATEGIC ASSET</p>
      </div>
    </section>
  );
}
