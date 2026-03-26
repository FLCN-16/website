import WorkMetaSection from "./_components/work-meta-section";
import WorkPageHeader from "./_components/work-page-header";
import WorkProjectGrid from "./_components/work-project-grid";

// Fallback for the implicit `children` slot on hard navigation to /work/[slug].
// Without this, Next.js 404s because it can't recover the children slot state.
export default function WorkDefault() {
  return (
    <div className="flex flex-col gap-08 px-06 py-08 lg:px-08 lg:py-20">
      <WorkPageHeader />
      <WorkProjectGrid />
      <WorkMetaSection />
    </div>
  );
}
