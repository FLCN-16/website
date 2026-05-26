import { cn } from "@/lib/utils";

/* ── Block ── */

function EngagementBlock({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-06 border border-outline-variant bg-surface-container p-6 sm:p-8 lg:px-08 lg:py-10">
      <div className="flex items-center gap-02">
        <span className="text-label-sm text-primary">■</span>
        <h3
          id={id}
          className="font-mono text-label-sm font-bold tracking-label text-nav-link"
        >
          {title}
        </h3>
      </div>
      <ul
        aria-labelledby={id}
        className="flex flex-col gap-04 pl-06"
      >
        {children}
      </ul>
    </div>
  );
}

function Item({ children }: { children: React.ReactNode }) {
  return (
    <li className={cn("flex items-start gap-02 font-mono text-body-md text-primary-container")}>
      <span className="mt-1 shrink-0 text-primary opacity-60">—</span>
      {children}
    </li>
  );
}

/* ── Section ── */

export default function ContactEngagementSection() {
  return (
    <section
      id="engagement"
      aria-label="Engagement protocols"
      className="w-full px-0 pb-12"
    >
      <div className="mx-auto max-w-screen-xl">
        {/* Section header */}
        <div className="flex items-center gap-04 border border-b-0 border-outline-variant bg-surface px-6 py-04 sm:px-8 lg:px-08">
          <span className="font-mono text-label-sm tracking-label text-nav-link opacity-60">
            {"//"}
          </span>
          <h2 className="font-mono text-label-sm font-bold tracking-label text-primary">
            ENGAGEMENT_PROTOCOLS
          </h2>
        </div>

        {/* Three-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3">
          <EngagementBlock id="eb-help" title="WHAT_I_HELP_WITH">
            <Item>Front-end architecture &amp; system design</Item>
            <Item>Technical leadership and team scaling</Item>
            <Item>Next.js / React performance and SSR rescue</Item>
            <Item>Agentic AI integration and LLM tooling</Item>
            <Item>Cross-platform mobile via Flutter</Item>
          </EngagementBlock>

          <EngagementBlock id="eb-formats" title="ROLE_PREFERENCES">
            <Item>Full-time senior / staff engineering roles</Item>
            <Item>Technical lead or principal engineer</Item>
            <Item>Hands-on architect with delivery ownership</Item>
            <Item>Founding engineer at product-first teams</Item>
          </EngagementBlock>

          <EngagementBlock id="eb-response" title="RESPONSE_&amp;_AVAILABILITY">
            <Item>Replies within 24h (UTC+5:30 business hours)</Item>
            <Item>Async-friendly — email preferred first contact</Item>
            <Item>Open to intro calls once context is shared</Item>
          </EngagementBlock>
        </div>
      </div>
    </section>
  );
}
