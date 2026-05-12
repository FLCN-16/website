import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { createMetadata } from "@/lib/metadata";

import WorkPageHeader from "./_components/work-page-header";

const WorkProjectGrid = dynamic(() => import("./_components/work-project-grid"));
const WorkMetaSection = dynamic(() => import("./_components/work-meta-section"));

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
