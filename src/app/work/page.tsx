import type { Metadata } from "next";

import { createMetadata } from "@/lib/metadata";

import WorkMetaSection from "./_components/work-meta-section";
import WorkPageHeader from "./_components/work-page-header";
import WorkProjectGrid from "./_components/work-project-grid";

export const metadata: Metadata = createMetadata({
  title: "Work",
  path: "/work",
  description:
    "Selected systems portfolio, technical briefs, and strategic architecture snapshots.",
});

export default function WorkPage() {
  return (
    <div className="flex flex-col gap-08 px-06 py-08 lg:px-08 lg:py-20">
      <WorkPageHeader />
      <WorkProjectGrid />
      <WorkMetaSection />
    </div>
  );
}
