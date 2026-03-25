import { cn } from "@/lib/utils";

function ContactPageHeader() {
  return (
    <section className="relative w-full bg-surface flex flex-col justify-between mx-auto max-w-screen-xl px-8 py-12 overflow-hidden">
      {/* ── Headline ── */}
      <div>
        <h1
          className={cn(
            "font-headline font-black uppercase tracking-tighter leading-none",
            "text-dark-blue text-7xl md:text-8xl lg:text-9xl",
          )}
        >
          TECHNICAL
          <br />
          <span className="text-transparent [-webkit-text-stroke:2px_#1E293B]">BLUEPRINT</span>.
        </h1>
      </div>

      {/* ── Body ── */}
      <p className="font-body text-body-md text-primary-container max-w-sm mt-12">
        Engineering rigorous software architectures and technical leadership strategies. Every line of code, every
        architectural decision, documented and executed with precision.
      </p>

      {/* ── Metadata stamp (bottom-right) ── */}
      <div className="absolute bottom-08 right-08 text-right">
        <p className="font-mono text-label-sm tracking-label text-outline-variant">COORD: 52.5200° N, 13.4050° E</p>
        <p className="font-mono text-label-sm tracking-label text-outline-variant">SHEET NO: A-101</p>
      </div>
    </section>
  );
}

export default ContactPageHeader;
