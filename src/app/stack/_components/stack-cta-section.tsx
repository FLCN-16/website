import Link from "next/link";

export default function StackCtaSection() {
  return (
    <section className="rounded-sm bg-primary px-06 py-10 text-on-primary sm:px-10 sm:py-12 lg:flex lg:items-center lg:justify-between lg:px-24 lg:py-16">
      <div className="max-w-stack-cta">
        <h2 className="font-headline text-display-md font-bold tracking-tighter text-surface-highest lg:text-title-lg">
          Want to dive deeper into
          <br />
          my architecture patterns?
        </h2>
        <p className="max-w-stack-cta-copy mt-06 font-body text-body-lg text-surface-highest/80">
          Explore my open-source infrastructure templates and technical whitepapers on system
          scalability.
        </p>
      </div>
      <Link
        href="/contact"
        className="duration-base mt-08 inline-flex bg-surface-highest px-08 py-04 font-mono text-label-sm text-primary uppercase transition-colors hover:bg-white lg:mt-0"
      >
        View Technical Blog
      </Link>
    </section>
  );
}
