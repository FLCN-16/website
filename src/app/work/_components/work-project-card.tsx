"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ArrowRight, BarChart2, CreditCard, ScanLine } from "lucide-react";

import { cn } from "@/lib/utils";

import type { WorkProject } from "./work-content";

const iconMap = {
  payment: CreditCard,
  infrastructure: ScanLine,
  ai: BarChart2,
};

export default function WorkProjectCard({ project }: Readonly<{ project: WorkProject }>) {
  const pathname = usePathname();
  const isActive = pathname === `/work/${project.slug}`;
  const ProjectIcon = iconMap[project.icon];

  return (
    <Link
      href={`/work/${project.slug}`}
      className={cn(
        "min-h-work-card duration-base flex cursor-pointer gap-05 border bg-white p-05 shadow-sm transition-colors",
        isActive
          ? "border-primary bg-surface-low"
          : "border-outline-variant hover:border-outline hover:bg-surface-low",
      )}
    >
      <div className="work-thumb-square overflow-hidden bg-surface-container">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={project.image} alt="" className="size-full object-cover grayscale" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex flex-col gap-02">
          <div className="flex items-start justify-between gap-04">
            <p className="font-mono text-label-sm text-outline">
              {project.domain} / {project.id}
            </p>
            <ProjectIcon size={14} className="shrink-0 text-outline" />
          </div>

          <div className="flex flex-col gap-01">
            <h2 className="font-headline text-title-md text-primary">{project.title}</h2>
            <div className="flex flex-wrap gap-01">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-outline-variant px-01 py-px font-mono text-[0.6rem] leading-tight tracking-wide text-primary-container"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <span
          className={cn(
            "duration-base inline-flex items-center gap-01 font-mono text-[0.6rem] leading-tight tracking-wide transition-opacity",
            isActive ? "text-primary opacity-100" : "text-outline opacity-60 hover:opacity-100",
          )}
        >
          VIEW DETAILS
          <ArrowRight size={10} />
        </span>
      </div>
    </Link>
  );
}
