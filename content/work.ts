export interface StackItem {
  name: string;
  role: string;
}

export interface Briefing {
  problem: string;
  approach: string[];
  impact: string;
  quote: string;
}

export interface Project {
  slug: string;
  category: string;
  ord: string;
  title: string;
  tags: string[];
  description: string;
  briefing: Briefing;
  stack: StackItem[];
}

export const projects: Project[] = [
  {
    slug: "design-system-foundation",
    category: "Design Systems",
    ord: "01",
    title: "Design System Foundation",
    tags: ["React", "TypeScript", "Storybook", "Tokens"],
    description:
      "A token-driven component library adopted across 5 product teams, replacing ad-hoc styling with a single source of truth for UI.",
    briefing: {
      problem:
        "The engineering org had grown to 40+ frontend engineers across 5 squads, each maintaining their own component primitives. The result was visual inconsistency, duplicated accessibility fixes, and a new-hire onboarding experience that required learning 3 different button components. Design handoffs were a recurring source of friction — Figma specs and code diverged within days of each release.",
      approach: [
        "Audited all existing UI across products and distilled a token vocabulary covering colour, spacing, typography, elevation, and motion.",
        "Built a core package of ~60 composable primitives with full TypeScript props, WAI-ARIA patterns, and dark-mode support baked in at the token level.",
        "Established a Storybook-driven development workflow with automated visual regression tests via Chromatic on every pull request.",
        "Ran weekly office hours with product designers to resolve token ambiguity and keep the Figma library in sync with published package versions.",
      ],
      impact:
        "Within six months of adoption, cross-squad UI consistency scores (measured by design QA) improved from 61% to 94%. New feature development time dropped by an estimated 25% for teams that fully migrated. The library now receives contributions from 12 engineers and has a documented governance model for breaking changes.",
      quote:
        "The design system turned UI quality from a per-squad lottery into a baseline guarantee.",
    },
    stack: [
      { name: "React", role: "Component framework" },
      { name: "TypeScript", role: "Type safety and API contracts" },
      { name: "Storybook", role: "Development environment and docs" },
      { name: "Chromatic", role: "Visual regression testing" },
      { name: "Style Dictionary", role: "Token transformation pipeline" },
    ],
  },
  {
    slug: "micro-frontend-platform",
    category: "Platform Engineering",
    ord: "02",
    title: "Micro-Frontend Platform",
    tags: ["Module Federation", "Webpack 5", "React", "CI/CD"],
    description:
      "Re-architected a monolithic React app into independently deployable micro-frontends, enabling 5 squads to ship without cross-team coordination.",
    briefing: {
      problem:
        "The main product application had grown to 180,000+ lines of React code managed by a single shared repository. Every release required a full regression cycle and sign-off from all five squads, which bottlenecked deployments to once a fortnight. A single breaking change in a shared utility could block unrelated teams for days, and the cold-start time for local development had reached 4 minutes.",
      approach: [
        "Mapped product domains against team ownership and defined module boundaries using Event Storming sessions with engineering leads.",
        "Implemented Webpack 5 Module Federation as the runtime integration layer, with a lightweight shell application managing routing and shared context.",
        "Built a custom CLI tool that scaffolds new micro-frontends with pre-configured CI/CD, linting, and a shared dependency contract to prevent version drift.",
        "Phased the migration over 8 months — strangler fig pattern — keeping the existing monolith live until each domain had full parity.",
      ],
      impact:
        "Deployment frequency went from bi-weekly to multiple times per day per squad. Local dev cold-start dropped from 4 minutes to 38 seconds. The shell and inter-app communication contract became the internal model for 2 additional product surfaces launched the following year.",
      quote:
        "Decoupling deployments was the single biggest multiplier on engineering velocity in the company's history.",
    },
    stack: [
      { name: "Webpack 5", role: "Module Federation host and remotes" },
      { name: "React", role: "UI framework across all micro-apps" },
      { name: "TypeScript", role: "Shared contract definitions" },
      { name: "GitHub Actions", role: "Independent CI/CD pipelines" },
      { name: "Nx", role: "Monorepo build orchestration" },
    ],
  },
  {
    slug: "analytics-dashboard",
    category: "Data Visualisation",
    ord: "03",
    title: "Real-Time Analytics Dashboard",
    tags: ["React", "D3.js", "WebSockets", "Performance"],
    description:
      "A high-density analytics interface rendering live metrics for 50,000+ data points with sub-100ms update latency across multiple chart types.",
    briefing: {
      problem:
        "The business intelligence team was using a third-party dashboard tool that couldn't handle the update frequency required for real-time inventory and pricing data. Charts would freeze under load, and the tool lacked the layout flexibility needed to display multi-dimension comparisons in a single viewport. The product team needed a custom solution that could sustain 30 WebSocket updates per second without dropping frames.",
    approach: [
        "Profiled rendering bottlenecks in a prototype and moved all heavy D3 computation off the main thread into Web Workers, freeing the UI thread for interaction.",
        "Implemented a double-buffer rendering strategy for time-series charts — computing the next frame while displaying the current one — achieving consistent 60fps under peak load.",
        "Designed a configurable layout system using CSS Grid and a JSON-based widget spec, allowing analysts to configure dashboard layouts without engineering support.",
        "Built a custom WebSocket connection manager with exponential back-off, reconnect logic, and a stale-data indicator to handle unreliable network conditions gracefully.",
      ],
      impact:
        "The dashboard sustained 30 updates/second at 60fps across 12 simultaneous chart instances on mid-range hardware. Analyst self-service for layout configuration reduced dashboard-change requests to the engineering team by 80%. The Web Worker architecture was subsequently extracted and open-sourced as a standalone library.",
      quote:
        "Treating rendering performance as a hard constraint from day one meant we never had to refactor our way out of a sluggish product.",
    },
    stack: [
      { name: "React", role: "Component and state layer" },
      { name: "D3.js", role: "Data transformation and SVG rendering" },
      { name: "Web Workers", role: "Off-thread computation" },
      { name: "WebSockets", role: "Real-time data transport" },
      { name: "Vitest", role: "Unit and integration testing" },
    ],
  },
];
