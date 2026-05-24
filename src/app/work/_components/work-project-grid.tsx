"use client";

import { workProjects } from "./work-content";
import WorkProjectCard from "./work-project-card";

export default function WorkProjectGrid() {
  return (
    <section className="work-cards-grid gap-04">
      {workProjects.map((project) => (
        <WorkProjectCard key={project.title} project={project} />
      ))}
    </section>
  );
}
