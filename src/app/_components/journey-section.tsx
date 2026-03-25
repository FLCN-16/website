import { cn } from "@/lib/utils";

/* ── Types ── */

interface Tag {
  label: string;
  featured?: boolean;
}

interface JourneyItem {
  role: string;
  company: string;
  period: string;
  description: string;
  tags: Tag[];
}

/* ── Data ── */

const journeyItems: JourneyItem[] = [
  {
    role: "Associate Technical Lead",
    company: "DigiMantra Labs",
    period: "Feb 2022 — Present",
    description:
      "Orchestrated the transformation of a legacy infrastructure into a cloud-native microservices environment, reducing operational costs by 40% while doubling engineering velocity. Lead a global team of 45+ developers.",
    tags: [
      { label: "SCALE", featured: true },
      { label: "STRATEGY", featured: false },
      { label: "INFRASTRUCTURE", featured: false },
    ],
  },
  {
    role: "Senior Full Stack Web Developer",
    company: "Erosteps Pvt. Ltd.",
    period: "March 2017 — 2022",
    description:
      "Scaled the engineering department from 5 to 60 hires in 24 months. Established CI/CD pipelines and automated QA protocols that reduced production regressions by 85%.",
    tags: [
      { label: "TEAM GROWTH", featured: true },
      { label: "AGILE", featured: false },
      { label: "AUTOMATION", featured: false },
    ],
  },
];

/* ── Tag Block ── */

function TagBlock({ label, featured = false }: Tag) {
  return (
    <div className="flex flex-col gap-02">
      <span className="font-mono text-label-sm tracking-label text-primary">{label}</span>
      <div className={cn("w-20 h-16", featured ? "bg-primary" : "bg-surface-highest")} />
    </div>
  );
}

/* ── Journey Entry ── */

function JourneyEntry({ role, company, period, description, tags }: JourneyItem) {
  return (
    <div className="flex flex-col gap-06 py-10">
      {/* Title row */}
      <div className="flex items-baseline justify-between gap-08">
        <h3 className="font-headline text-2xl font-bold text-primary">
          {role}&nbsp;—&nbsp;{company}
        </h3>
        <span className="font-mono text-label-sm tracking-label text-primary-container shrink-0">{period}</span>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-outline-variant" />

      {/* Body + Tags row */}
      <div className="flex items-start justify-between gap-08">
        <p className="font-body text-body-md text-primary-container max-w-lg">{description}</p>
        <div className="flex items-start gap-02 shrink-0">
          {tags.map((tag) => (
            <TagBlock key={tag.label} {...tag} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Section ── */

export default function JourneySection() {
  return (
    <section className="w-full bg-surface">
      <div className="mx-auto max-w-screen-xl px-08 py-16">
        <div className="flex flex-col gap-08">
          {/* Left — sticky heading */}
          <div className="pt-10">
            <h2 className="font-headline text-display-md font-bold text-primary tracking-tight">
              Professional Journey
            </h2>
            <div className="w-16 h-2 bg-primary mt-4" />
          </div>

          {/* Right — timeline */}
          <div className="flex flex-col divide-y divide-outline-variant">
            {journeyItems.map((item) => (
              <JourneyEntry key={item.company} {...item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
