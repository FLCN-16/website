import SectionEyebrow from "./section-eyebrow";

export default function StackPageHeader() {
  return (
    <header className="flex flex-col gap-04">
      <SectionEyebrow>Technical Foundations</SectionEyebrow>
      <div className="border-b border-outline-variant pb-04">
        <h1 className="font-headline text-display-md font-bold tracking-tighter text-primary lg:text-display-lg">
          The Tech Stack
        </h1>
      </div>
      <p className="max-w-stack-intro pt-04 font-body text-body-lg text-primary-container">
        A curated selection of core technologies leveraged to build high-scale, resilient system
        architectures. Engineering focused on performance, security, and developer velocity.
      </p>
    </header>
  );
}
