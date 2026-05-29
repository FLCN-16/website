export interface Social {
  platform: "github" | "linkedin" | "instagram";
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
  role: "Technical Lead — Full Stack",
  location: "Jalandhar, Punjab, India",
  timezone: "UTC+5:30",
  email: "me@thefalcon.dev",
  status: {
    available: true,
    label: "OPEN TO ROLES",
  },
  socials: [
    {
      platform: "github",
      url: "https://github.com/FLCN-16",
      label: "GitHub",
    },
    {
      platform: "linkedin",
      url: "https://linkedin.com/in/rishabh-kumar-flcn16",
      label: "LinkedIn",
    },
    {
      platform: "instagram",
      url: "https://instagram.com/thefalcon.dev",
      label: "Instagram",
    },
  ],
  resumeUrl: "https://media.thefalcon.dev/rishabh-kumar-resume.pdf",
  headline: "Leading teams across the stack,\nshipping production systems.",
  subheadline:
    "Full-Stack Technical Lead with 9+ years building and shipping production web, mobile, and browser-based applications. Open-source contributor to Next.js (vercel/next.js), builder of agentic AI systems with LangChain and Mastra AI, and author of apps live on the Chrome Web Store and Google Play.",
  stats: [
    { value: "9+", label: "Years Shipping" },
    { value: "1M+", label: "Users Reached" },
    { value: "OSS", label: "Next.js Contributor" },
    { value: "2", label: "Apps on Play Store" },
  ],
  eyebrow: "Technical Lead — Full Stack · Jalandhar, India",
};
