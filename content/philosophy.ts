export interface Pillar {
  num: "01" | "02" | "03";
  title: string;
  body: string;
}

export interface Philosophy {
  eyebrow: string;
  heading: string;
  pillars: Pillar[];
}

export const philosophy: Philosophy = {
  eyebrow: "Engineering Philosophy",
  heading: "How I think about building software",
  pillars: [
    {
      num: "01",
      title: "Performance is a feature",
      body: "Every millisecond of load time costs real users. I treat Core Web Vitals as hard constraints from day one — not an afterthought before release. A fast product is a respectful product, and the engineering choices that enable speed compound across the entire codebase.",
    },
    {
      num: "02",
      title: "Design and engineering are one discipline",
      body: "The best interfaces emerge when the person writing the code understands why a design decision was made, not just what it looks like. I invest in design-token systems, shared language with designers, and close feedback loops that keep intent intact from Figma to production.",
    },
    {
      num: "03",
      title: "Systems thinking over clever solutions",
      body: "Clever code impresses in a PR review; well-structured systems hold up through two years of team turnover and a product pivot. I optimise for clarity, composability, and constraints that make the wrong choice harder to make than the right one.",
    },
  ],
};
