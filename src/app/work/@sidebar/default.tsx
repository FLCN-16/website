import WorkBriefingAside from "../_components/work-briefing-aside";
import { workProjects } from "../_components/work-content";

export default function SidebarDefault() {
  return <WorkBriefingAside project={workProjects[0]} />;
}
