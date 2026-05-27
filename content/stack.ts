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
    "I pick tools for longevity and leverage — things with strong primitives, a healthy ecosystem, and a clear upgrade path. I've worked across enough stacks to know the difference between a technology that solves a problem and one that becomes the problem. The list below reflects where I'm deepest, where I'm solid, and where I'm actively growing.",
  bigStat: {
    value: "9+",
    label: "Years in Frontend",
  },
  disciplines: [
    {
      name: "Languages",
      tools: [
        { name: "TypeScript", maturity: "expert" },
        { name: "JavaScript", maturity: "expert" },
        { name: "HTML/CSS", maturity: "expert" },
        { name: "Python", maturity: "proficient" },
      ],
    },
    {
      name: "Frameworks & Libraries",
      tools: [
        { name: "React", maturity: "expert" },
        { name: "Next.js", maturity: "expert" },
        { name: "Vue.js", maturity: "proficient" },
        { name: "Node.js", maturity: "proficient" },
      ],
    },
    {
      name: "Styling",
      tools: [
        { name: "Tailwind CSS", maturity: "expert" },
        { name: "CSS Modules", maturity: "expert" },
        { name: "Styled Components", maturity: "proficient" },
        { name: "Framer Motion", maturity: "proficient" },
      ],
    },
    {
      name: "Build & Tooling",
      tools: [
        { name: "Vite", maturity: "expert" },
        { name: "Webpack", maturity: "proficient" },
        { name: "Turbopack", maturity: "proficient" },
        { name: "pnpm", maturity: "expert" },
      ],
    },
    {
      name: "Testing",
      tools: [
        { name: "Vitest", maturity: "expert" },
        { name: "Playwright", maturity: "proficient" },
        { name: "Jest", maturity: "proficient" },
        { name: "Testing Library", maturity: "expert" },
      ],
    },
    {
      name: "Infrastructure",
      tools: [
        { name: "Vercel", maturity: "expert" },
        { name: "AWS", maturity: "proficient" },
        { name: "Docker", maturity: "proficient" },
        { name: "GitHub Actions", maturity: "expert" },
      ],
    },
  ],
};
