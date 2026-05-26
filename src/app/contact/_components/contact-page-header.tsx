import { cn, getCareerYears, getExperienceLabel } from "@/lib/utils";

function ContactPageHeader() {
  return (
    <section className="relative mx-auto flex w-full max-w-screen-xl flex-col justify-between overflow-hidden bg-surface px-6 py-10 sm:px-8 sm:py-12">
      {/* ── Semantic H1 for crawlers + screen readers ── */}
      <h1 className="sr-only">Contact Rishabh Kumar — Full-Stack Technical Lead</h1>

      {/* ── Headline ── */}
      <div>
        <p
          aria-hidden="true"
          className={cn(
            "font-headline leading-none font-black tracking-tighter uppercase",
            "text-primary",
          )}
          style={{ fontSize: "clamp(3rem, 10vw, 8rem)" }}
        >
          TECHNICAL
          <br />
          <span className="text-stroke-primary text-transparent">BLUEPRINT</span>.
        </p>
      </div>

      {/* ── Body ── */}
      <p className="mt-8 max-w-xl font-body text-body-lg text-primary-container sm:mt-12">
        Front-End Technical Lead with {getExperienceLabel()} delivering high-performance
        applications, guiding cross-functional teams, and turning complex product requirements into
        reliable, scalable execution.
      </p>

      {/* ── Metadata stamp ── */}
      <div className="mt-8 flex items-end justify-between gap-x-6 sm:mt-0 lg:absolute lg:right-08 lg:bottom-08 lg:text-right">
        <p className="font-mono text-label-sm tracking-label text-nav-link">
          BASE: Jalandhar, Punjab, India
        </p>
        <p className="font-mono text-label-sm tracking-label text-nav-link">
          EXP: {getCareerYears()}+ YEARS
        </p>
      </div>
    </section>
  );
}

export default ContactPageHeader;
