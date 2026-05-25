import rawProjects from "@/data/work-projects.json";

export interface WorkDetailMetric {
  label: string;
  value: string;
}

export interface WorkBriefing {
  badge: string;
  identifier: string;
  description: string[];
  impact: string;
  stack: WorkDetailMetric[];
}

export interface WorkProject {
  id: string;
  slug: string;
  domain: string;
  title: string;
  tags: string[];
  image: string;
  icon: "payment" | "infrastructure" | "ai" | "extension" | "mobile" | "security";
  externalUrl?: string;
  briefing: WorkBriefing;
}

export interface WorkMetaColumn {
  title: string;
  lines: string[];
  emphasis?: string;
}

export const workProjects = rawProjects as WorkProject[];

export const workMetaColumns: WorkMetaColumn[] = [
  {
    title: "CORE FOCUS",
    lines: [
      "High-Performance Web Architecture",
      "Payment Gateway Integration",
      "Cross-Functional Team Leadership",
    ],
  },
  {
    title: "ENGAGEMENT",
    lines: [
      "All listed projects include full architectural",
      "context, performance benchmarks, and",
      "technical documentation available",
      "upon request.",
    ],
  },
  {
    title: "CONTACT GATEWAY",
    lines: [],
    emphasis: "work@thefalcon.dev",
  },
];
