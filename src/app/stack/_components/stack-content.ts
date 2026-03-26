import { Box, Cloud, FileCode2, type LucideIcon, Server } from "lucide-react";

export const SYSTEM_DIAGRAM_IMAGE =
  "https://www.figma.com/api/mcp/asset/0d5e536f-556d-47a1-9bc1-159bc94857e1";

type InfrastructureItem = {
  icon: LucideIcon;
  title: string;
  description: string;
  level: number;
};

export const infrastructureItems: InfrastructureItem[] = [
  {
    icon: Server,
    title: "Node.js / Express",
    description:
      "API development, backend services, and production-ready integrations supporting responsive web products.",
    level: 92,
  },
  {
    icon: Cloud,
    title: "AWS / GCP / Linux",
    description:
      "Cloud deployment environments, systems administration, and delivery support across modern web stacks.",
    level: 88,
  },
  {
    icon: Box,
    title: "Docker / CI-CD",
    description:
      "Delivery automation, deployment acceleration, and collaboration with DevOps pipelines using Jenkins and Docker.",
    level: 86,
  },
  {
    icon: FileCode2,
    title: "Python / PHP",
    description:
      "Platform and service development across Django, Laravel, and related full-stack implementations.",
    level: 84,
  },
];

export const frontendItems = [
  {
    label: "React.js / Next.js",
    level: "EXPERT",
    active: true,
    badgeClassName: "bg-primary text-surface-highest",
  },
  {
    label: "TypeScript / JavaScript",
    level: "CORE",
    badgeClassName: "bg-primary-container text-on-primary",
  },
  {
    label: "Astro.js / Solid.js",
    level: "MODERN",
    badgeClassName: "bg-surface-highest text-primary",
  },
] as const;

export const matrixRows = [
  {
    discipline: "Frontend",
    tooling: "React.js, Next.js, Astro.js, Solid.js, TypeScript, JavaScript",
    filledDots: 5,
  },
  {
    discipline: "Backend",
    tooling: "Node.js, Express.js, Nest.js, Django, Laravel, PHP, Python",
    filledDots: 4,
  },
  {
    discipline: "Delivery",
    tooling: "Linux, AWS, GCP, Docker, CI/CD, Jira, Confluence, Trello",
    filledDots: 4,
  },
] as const;
