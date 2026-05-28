export type Maturity = "expert" | "proficient" | "learning";

export interface Tool {
  name: string;
  maturity: Maturity;
}

export interface Discipline {
  name: string;
  tools: Tool[];
}

export interface BigStat {
  value: string;
  label: string;
}

export interface Stack {
  eyebrow: string;
  heading: string;
  intro: string;
  bigStat: BigStat;
  disciplines: Discipline[];
}

export const stack: Stack = {
  eyebrow: "Technical Arsenal",
  heading: "The Stack",
  intro:
    "I pick tools for longevity and leverage — things with strong primitives, a healthy ecosystem, and a clear upgrade path. After 9+ years across frontend, backend, mobile, and DevOps, I know the difference between a technology that solves a problem and one that becomes the problem. The list below reflects where I'm deepest, where I'm solid, and where I'm actively growing.",
  bigStat: {
    value: "9+",
    label: "Years Shipping",
  },
  disciplines: [
    {
      name: "Backend",
      tools: [
        { name: "Node.js", maturity: "expert" },
        { name: "Express.js", maturity: "expert" },
        { name: "REST APIs", maturity: "expert" },
        { name: "Nest.js", maturity: "proficient" },
        { name: "Python", maturity: "proficient" },
        { name: "Django", maturity: "proficient" },
        { name: "Flask", maturity: "proficient" },
        { name: "PHP", maturity: "proficient" },
        { name: "Laravel", maturity: "proficient" },
        { name: "Lumen", maturity: "proficient" },
      ],
    },
    {
      name: "Frontend",
      tools: [
        { name: "React.js", maturity: "expert" },
        { name: "Next.js", maturity: "expert" },
        { name: "TypeScript", maturity: "expert" },
        { name: "JavaScript (ES6+)", maturity: "expert" },
        { name: "Tailwind CSS", maturity: "expert" },
        { name: "HTML5", maturity: "expert" },
        { name: "CSS3", maturity: "expert" },
        { name: "Vue.js", maturity: "proficient" },
        { name: "Astro.js", maturity: "learning" },
        { name: "Solid.js", maturity: "learning" },
      ],
    },
    {
      name: "Databases",
      tools: [
        { name: "MongoDB", maturity: "expert" },
        { name: "PostgreSQL", maturity: "proficient" },
        { name: "MySQL", maturity: "proficient" },
        { name: "SQL", maturity: "proficient" },
      ],
    },
    {
      name: "DevOps & Cloud",
      tools: [
        { name: "CI/CD", maturity: "expert" },
        { name: "Git/GitHub", maturity: "expert" },
        { name: "Docker", maturity: "proficient" },
        { name: "Jenkins", maturity: "proficient" },
        { name: "AWS", maturity: "proficient" },
        { name: "GCP", maturity: "proficient" },
        { name: "Linux", maturity: "proficient" },
      ],
    },
    {
      name: "Mobile",
      tools: [
        { name: "Flutter", maturity: "proficient" },
        { name: "Dart", maturity: "proficient" },
        { name: "Cross-Platform (iOS & Android)", maturity: "proficient" },
      ],
    },
    {
      name: "AI & Agents",
      tools: [
        { name: "LangChain", maturity: "proficient" },
        { name: "Mastra AI", maturity: "proficient" },
        { name: "LLM Integration", maturity: "proficient" },
        { name: "Prompt Engineering", maturity: "proficient" },
        { name: "Tool-Calling Pipelines", maturity: "proficient" },
      ],
    },
    {
      name: "Architecture & Practice",
      tools: [
        { name: "System Design", maturity: "expert" },
        { name: "API Design", maturity: "expert" },
        { name: "Agile/Scrum", maturity: "expert" },
        { name: "Code Review", maturity: "expert" },
        { name: "Mentoring", maturity: "expert" },
        { name: "Stakeholder Management", maturity: "proficient" },
      ],
    },
  ],
};
