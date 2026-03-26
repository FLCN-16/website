import { Activity, ExternalLink, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";

import ContactForm from "./contact-form";

/* ── Stat Row ── */

function StatRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-02">
      <div className="flex items-center gap-02 text-primary">
        {icon}
        <span className="font-mono text-label-sm font-bold tracking-label text-primary">
          {label}
        </span>
      </div>
      <p className="pl-06 font-mono text-body-md text-primary-container">{value}</p>
    </div>
  );
}

/* ── Social Link ── */

function SocialLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center justify-between px-04 py-04",
        "font-mono text-label-sm tracking-label text-dark-blue",
        "border border-outline-variant bg-surface-glass",
        "duration-base transition-colors hover:bg-dark-blue hover:text-surface",
      )}
    >
      {label}
      <ExternalLink size={16} />
    </a>
  );
}

/* ── Section ── */

export default function ContactSection() {
  return (
    <section className="w-full py-12">
      <div className="grid-sidebar-layout mx-auto grid max-w-screen-xl border border-outline-variant bg-surface-container">
        {/* ── Left — Form ── */}
        <div className="px-6 py-10 sm:px-8 sm:py-12 lg:px-08 lg:py-16">
          <ContactForm />
        </div>

        {/* ── Right — Sidebar ── */}
        <aside className="flex flex-col gap-10 border-t border-outline-variant bg-surface-highest px-6 py-10 sm:px-8 sm:py-12 lg:border-t-0 lg:border-l lg:px-08 lg:py-16">
          {/* NODE_STATS header */}
          <div className="flex items-center gap-02">
            <span className="text-label-sm text-primary">■</span>
            <span className="font-mono text-label-sm tracking-label text-nav-link">NODE_STATS</span>
          </div>

          {/* Stats */}
          <div className="flex flex-col gap-08">
            <StatRow
              icon={<Activity size={16} />}
              label="AVAILABILITY"
              value="Available for technical leadership, frontend architecture, and delivery-focused roles."
            />
            <StatRow
              icon={<MapPin size={16} />}
              label="DEPLOYMENT_BASE"
              value="Punjab, India / Remote [UTC+5.5]"
            />
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-outline-variant" />

          {/* Comm link */}
          <div className="flex flex-col gap-02">
            <span className="font-mono text-label-sm tracking-label text-nav-link">COMM_LINK</span>
            <a
              href="mailto:me@thefalcon.dev"
              className="duration-base font-headline text-title-md font-bold break-all text-light-blue transition-opacity hover:opacity-70"
            >
              me@thefalcon.dev
            </a>
          </div>

          {/* Social index */}
          <div className="flex flex-col gap-04">
            <span className="font-mono text-label-sm tracking-label text-nav-link">
              SOCIAL_INDEX
            </span>
            <SocialLink
              label="LINKEDIN_PROTOCOLS"
              href="https://linkedin.com/in/rishabh-kumar-flcn16"
            />
            <SocialLink label="PORTFOLIO_SITE" href="https://thefalcon.dev" />
          </div>

          {/* Metadata footer */}
          <div className="mt-auto flex items-center justify-between border-t border-outline-variant pt-08 opacity-60">
            <span className="font-mono text-label-sm tracking-label text-nav-link">
              CHK_SUM: 8F2A9C
            </span>
            <span className="font-mono text-label-sm tracking-label text-nav-link">
              PAGE_OFFSET: 0X004
            </span>
          </div>
        </aside>
      </div>
    </section>
  );
}
