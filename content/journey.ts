export interface JourneyItem {
  company: string;
  role: string;
  start: string;
  end: string | null;
  summary: string;
  tags: string[];
}

export const journey: JourneyItem[] = [
  {
    company: "Groww",
    role: "Frontend Technical Lead",
    start: "2021",
    end: null,
    summary:
      "Led a team of 8 engineers to rebuild the core trading and investments platform from a monolith to a micro-frontend architecture, reducing time-to-market for new features by 60%. Established the internal design system adopted across 5 product squads, and drove a 35% improvement in Lighthouse scores across all key pages.",
    tags: ["React", "TypeScript", "Micro-Frontends", "Module Federation", "Design Systems"],
  },
  {
    company: "Meesho",
    role: "Senior Frontend Engineer",
    start: "2018",
    end: "2021",
    summary:
      "Rebuilt the supplier onboarding and catalogue upload flows, cutting drop-off rates by 42% and supporting a 10× growth in supplier count. Championed the migration from Create React App to a custom Webpack 5 build pipeline, shaving 3 minutes off CI build times and cutting bundle size by 40%.",
    tags: ["React", "Redux", "Webpack", "Node.js", "GraphQL"],
  },
  {
    company: "Wingify",
    role: "Frontend Engineer",
    start: "2016",
    end: "2018",
    summary:
      "Developed and maintained the Visual Website Optimizer (VWO) editor — a complex DOM-manipulation tool used by 8,000+ customers. Introduced component-level unit testing, bringing coverage from near-zero to 70% and halving regression incidents in quarterly releases.",
    tags: ["JavaScript", "React", "Jest", "CSS-in-JS", "A/B Testing"],
  },
  {
    company: "Successive Digital",
    role: "Junior Frontend Developer",
    start: "2015",
    end: "2016",
    summary:
      "Built responsive UI components for client web applications across retail and logistics verticals. Delivered pixel-perfect implementations from Figma and Sketch designs and gained hands-on experience collaborating within cross-functional agile squads.",
    tags: ["HTML/CSS", "JavaScript", "jQuery", "Bootstrap"],
  },
];
