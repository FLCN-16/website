import Image from "next/image";

function HeroHeader() {
  return (
    <section className="grid grid-cols-[3fr_2fr] max-w-screen-xl mx-auto pointer-events-none">
      {/* ── Left — Text ── */}
      <div className="flex flex-col justify-between px-8 pt-12 pb-16 space-y-4">
        {/* Top label */}
        <p className="font-mono text-label-sm tracking-label text-outline-variant">
          Technical Lead &amp; SYSTEMS ARCHITECT
        </p>

        {/* Headline */}
        <h1
          className="font-headline font-bold text-primary tracking-tight"
          style={{ fontSize: "clamp(2rem, 6rem, 6rem)", lineHeight: 1.0 }}
        >
          Building for
          <br />
          Scale,
          <br />
          Engineered for
          <br />
          Precision.
        </h1>

        {/* Body */}
        <p className="font-body text-body-md text-outline/50 max-w-md my-6">
          I specialize in translating complex business objectives into resilient technical architectures that endure
          rapid growth and market shifts.
        </p>
      </div>

      {/* ── Right — Portrait ── */}
      <div className="flex items-center justify-center">
        <div className="relative h-120 bg-surface-highest aspect-[478.67/598.31]">
          <Image
            src="/portrait.jpg"
            alt="The Falcon - Rishabh Kumar"
            className="object-cover object-top grayscale"
            width={478.67}
            height={598.31}
            priority
          />

          {/* Status badge */}
          <div className="absolute -bottom-2 -left-2 bg-primary px-06 py-04">
            <p className="font-mono text-label-sm tracking-label text-outline-variant mb-01">STATUS</p>
            <p className="font-body text-body-md font-medium text-on-primary">Available for Strategic Advisory</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroHeader;
