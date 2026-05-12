import Link from "next/link";

import type { ReactNode } from "react";

export interface LegalSectionDef {
  id: string;
  slug: string;
  title: string;
}

interface LegalPageProps {
  filename: string;
  title: string;
  docType: string;
  scope: string;
  revision: string;
  sections: LegalSectionDef[];
  relatedLabel: string;
  relatedHref: string;
  children: ReactNode;
}

export function LegalPage({
  filename,
  title,
  docType,
  scope,
  revision,
  sections,
  relatedLabel,
  relatedHref,
  children,
}: LegalPageProps) {
  return (
    <div className="mx-auto max-w-screen-xl">
      {/* ── File header — light theme ── */}
      <div className="relative overflow-hidden border-b border-outline-variant bg-surface-container">
        {/* Tech grid texture */}
        <div className="bg-tech-grid pointer-events-none absolute inset-0 opacity-40" />

        <div className="relative px-8 pt-8 pb-6">
          {/* Breadcrumb path */}
          <div className="mb-6 flex items-center gap-2 font-mono text-label-sm tracking-label">
            <span className="text-primary-muted uppercase">thefalcon.dev</span>
            <span className="text-outline">/</span>
            <span className="text-primary-muted uppercase">legal</span>
            <span className="text-outline">/</span>
            <span className="text-primary uppercase">{filename}</span>
            <span className="ml-auto hidden text-primary-muted uppercase sm:block">
              rev. {revision}
            </span>
          </div>

          {/* Doc title */}
          <h1 className="mb-1 font-headline text-display-md font-bold tracking-tight text-primary">
            {title}
          </h1>
          <p className="mb-6 font-mono text-label-sm tracking-label text-primary-muted">
            // Effective {revision} — thefalcon.dev
          </p>

          {/* Meta strip */}
          <div className="border-t border-outline-variant pt-4">
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 font-mono text-label-sm tracking-label sm:grid-cols-4">
              <MetaField label="type" value={docType} />
              <MetaField label="scope" value={scope} />
              <MetaField label="status" value="ACTIVE" highlight />
              <MetaField label="sections" value={`${sections.length}`} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col lg:flex-row">
        {/* Main content */}
        <div className="min-w-0 flex-1 border-r border-outline-variant">
          <div className="max-w-2xl px-8 py-12 lg:py-16">{children}</div>
        </div>

        {/* Sidebar */}
        <aside className="w-full shrink-0 border-t border-outline-variant lg:w-72 lg:border-t-0">
          <div className="px-6 py-10 lg:sticky lg:top-20">
            {/* Index */}
            <p className="mb-3 font-mono text-[0.6rem] tracking-label text-outline uppercase">
              // Document Index
            </p>
            <nav className="mb-8 flex flex-col">
              {sections.map((s, i) => (
                <a
                  key={s.id}
                  href={`#${s.slug}`}
                  className="group duration-base flex items-center gap-3 border-l-2 border-outline-variant py-2.5 pr-2 pl-4 transition-all hover:border-primary hover:bg-surface-container"
                >
                  <span className="w-6 shrink-0 font-mono text-[0.55rem] tracking-label text-outline/60 group-hover:text-outline">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-[0.65rem] leading-tight tracking-label text-primary-container uppercase group-hover:text-primary">
                    {s.title}
                  </span>
                </a>
              ))}
            </nav>

            {/* Related doc */}
            <div className="border border-outline-variant">
              <div className="border-b border-outline-variant bg-surface-container px-4 py-2">
                <p className="font-mono text-[0.55rem] tracking-label text-outline uppercase">
                  Related Document
                </p>
              </div>
              <div className="px-4 py-3">
                <Link
                  href={relatedHref}
                  className="duration-base flex items-center gap-2 font-mono text-[0.65rem] tracking-label text-primary-container uppercase transition-colors hover:text-primary"
                >
                  <span className="text-outline">→</span>
                  {relatedLabel}
                </Link>
              </div>
            </div>

            {/* Doc status badge */}
            <div className="mt-6 flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary-accent" />
              <span className="font-mono text-[0.55rem] tracking-label text-outline uppercase">
                Document active · No pending revisions
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export function LegalSection({
  id,
  slug,
  title,
  children,
}: {
  id: string;
  slug: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={slug}
      className="group relative scroll-mt-20 border-b border-outline-variant py-10 first:pt-0"
    >
      {/* Section identifier */}
      <div className="mb-5 flex items-start gap-4">
        <div className="flex shrink-0 flex-col items-center gap-1 pt-1">
          <span className="font-mono text-[0.55rem] tracking-label text-outline/60 uppercase">
            {id}
          </span>
          <div
            className="duration-base w-px flex-1 bg-outline-variant transition-colors group-hover:bg-primary-muted"
            style={{ minHeight: "1rem" }}
          />
        </div>
        <h2 className="duration-base font-headline text-title-md font-bold text-primary transition-colors group-hover:text-primary">
          {title}
        </h2>
      </div>

      {/* Content */}
      <div className="[&_a]:duration-base space-y-3 pl-10 font-body text-body-md leading-relaxed text-primary-container [&_a]:text-primary-accent [&_a]:underline [&_a]:underline-offset-2 [&_a]:transition-opacity [&_a]:hover:opacity-70 [&_code]:rounded-none [&_code]:border [&_code]:border-outline-variant [&_code]:bg-surface-container [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.65rem] [&_code]:tracking-label [&_code]:text-primary [&_li]:flex [&_li]:items-start [&_li]:gap-3 [&_li]:before:mt-1.5 [&_li]:before:shrink-0 [&_li]:before:font-mono [&_li]:before:text-[0.5rem] [&_li]:before:text-primary-accent [&_li]:before:content-['▸'] [&_p]:leading-relaxed [&_strong]:font-medium [&_strong]:text-primary [&_ul]:mt-1 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2.5">
        {children}
      </div>
    </section>
  );
}

function MetaField({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-outline">{label}:</span>
      <span className={highlight ? "font-medium text-primary-accent" : "text-primary-container"}>
        {value}
      </span>
    </div>
  );
}
