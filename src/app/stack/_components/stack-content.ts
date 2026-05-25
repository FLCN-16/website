import { Bot, Box, Cloud, FileCode2, type LucideIcon, Server, Smartphone } from "lucide-react";

export const SYSTEM_DIAGRAM_IMAGE = "/stack/system-diagram.svg";

type InfrastructureItem = {
  icon: LucideIcon;
  title: string;
  description: string;
  level: number;
};

export const infrastructureItems: InfrastructureItem[] = [
  {
    icon: Server,
    title: "Node.js / Nest.js",
    description:
      "API development, backend services, and production-ready integrations — Express for flexibility, Nest.js for structured enterprise services.",
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
      "Delivery automation and deployment acceleration using Jenkins and Docker pipelines for continuous integration and deployment.",
    level: 86,
  },
  {
    icon: FileCode2,
    title: "Python / PHP",
    description:
      "Platform and service development across Flask, Django, Laravel, Lumen, and related full-stack implementations.",
    level: 84,
  },
  {
    icon: Bot,
    title: "LangChain / Mastra AI",
    description:
      "Agentic systems, tool-calling pipelines, and LLM integration — building AI-powered workflows and internal tooling.",
    level: 82,
  },
  {
    icon: Smartphone,
    title: "Flutter / Dart",
    description:
      "Cross-platform mobile apps shipped to the Google Play Store — finance, commerce, and productivity applications.",
    level: 78,
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
  {
    label: "Vue.js",
    level: "PROFICIENT",
    badgeClassName: "bg-surface-container text-primary-container",
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
    tooling: "Linux, AWS, GCP, Docker, Jenkins, CI/CD, Jira, Confluence",
    filledDots: 4,
  },
  {
    discipline: "Databases",
    tooling: "MongoDB, PostgreSQL, MySQL",
    filledDots: 4,
  },
  {
    discipline: "Mobile",
    tooling: "Flutter, Dart",
    filledDots: 4,
  },
  {
    discipline: "AI & Agents",
    tooling: "LangChain, Mastra AI, LLM Integration",
    filledDots: 4,
  },
] as const;
