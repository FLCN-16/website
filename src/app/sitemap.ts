import type { MetadataRoute } from "next";

import workProjectsRaw from "@/data/work-projects.json";

const BASE_URL = "https://thefalcon.dev";

const staticRoutes = ["/", "/work", "/stack", "/contact"];

const workSlugs = (workProjectsRaw as Array<{ slug: string }>).map((p) => p.slug);

export default function sitemap(): MetadataRoute.Sitemap {
  const statics = staticRoutes.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.8,
  }));

  const workPages = workSlugs.map((slug) => ({
    url: `${BASE_URL}/work/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...statics, ...workPages];
}
