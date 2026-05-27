export interface Social {
  platform: "github" | "linkedin" | "x";
  url: string;
  label: string;
}

export interface StatusBadge {
  available: boolean;
  label: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Site {
  name: string;
  url: string;
  handle: string;
  role: string;
  location: string;
  timezone: string;
  email: string;
  status: StatusBadge;
  socials: Social[];
  resumeUrl: string;
  headline: string;
  subheadline: string;
  stats: Stat[];
  eyebrow: string;
}

export const site: Site = {
  name: "Rishabh Kumar",
  url: "https://thefalcon.dev",
  handle: "thefalcon",
  role: "Frontend Technical Lead",
  location: "Jalandhar, India",
  timezone: "UTC+5:30",
  email: "hello@thefalcon.dev",
  status: {
    available: true,
    label: "OPEN TO ROLES",
  },
  socials: [
    {
      platform: "github",
      url: "https://github.com/riskybusiness",
      label: "GitHub",
    },
    {
      platform: "linkedin",
      url: "https://linkedin.com/in/rishabh-kumar",
      label: "LinkedIn",
    },
    {
      platform: "x",
      url: "https://x.com/thefalcon",
      label: "X / Twitter",
    },
  ],
  resumeUrl: "/files/rishabh-kumar-resume.pdf",
  headline: "Leading teams at scale,\nshipping with precision.",
  subheadline:
    "I architect and build high-performance web applications — from design systems to micro-frontends, from zero-to-one products to platforms serving millions.",
  stats: [
    { value: "9+", label: "Years in Frontend" },
    { value: "4", label: "Eng Teams Led" },
    { value: "12+", label: "Products Shipped" },
    { value: "3", label: "Open Source Libs" },
  ],
  eyebrow: "Frontend Technical Lead · Jalandhar, India",
};
