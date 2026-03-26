import { notFound } from "next/navigation";

import WorkBriefingAside from "../../_components/work-briefing-aside";
import { workProjects } from "../../_components/work-content";

export default async function SidebarSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = workProjects.find((p) => p.slug === slug);

  if (!project) notFound();

  return <WorkBriefingAside project={project} />;
}
