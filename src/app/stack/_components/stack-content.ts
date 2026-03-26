export const PHILOSOPHY_ICON =
  "https://www.figma.com/api/mcp/asset/78c865c2-5443-48b9-bfd9-e5f3c4c043fe";
export const GO_ICON = "https://www.figma.com/api/mcp/asset/93e83df4-47b8-4e23-936e-3470b4af38f2";
export const KUBERNETES_ICON =
  "https://www.figma.com/api/mcp/asset/57071037-2d61-48da-bdc3-db5eba403a75";
export const AWS_ICON = "https://www.figma.com/api/mcp/asset/2af90c96-0978-4a4e-b853-f809be4a1f3a";
export const POSTGRES_ICON =
  "https://www.figma.com/api/mcp/asset/24c27afa-8839-41b1-ba9f-cd8bddeefa99";
export const SYSTEM_DIAGRAM_IMAGE =
  "https://www.figma.com/api/mcp/asset/0d5e536f-556d-47a1-9bc1-159bc94857e1";

export const infrastructureItems = [
  {
    icon: GO_ICON,
    title: "Node.js / Express",
    description:
      "API development, backend services, and production-ready integrations supporting responsive web products.",
    level: 92,
  },
  {
    icon: KUBERNETES_ICON,
    title: "AWS / GCP / Linux",
    description:
      "Cloud deployment environments, systems administration, and delivery support across modern web stacks.",
    level: 88,
  },
  {
    icon: AWS_ICON,
    title: "Docker / CI-CD",
    description:
      "Delivery automation, deployment acceleration, and collaboration with DevOps pipelines using Jenkins and Docker.",
    level: 86,
  },
  {
    icon: POSTGRES_ICON,
    title: "Python / PHP",
    description:
      "Platform and service development across Django, Laravel, and related full-stack implementations.",
    level: 84,
  },
] as const;

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
