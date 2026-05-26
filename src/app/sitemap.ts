import type { MetadataRoute } from "next";

import workProjectsRaw from "@/data/work-projects.json";

export const dynamic = "force-static";

const BASE_URL = "https://thefalcon.dev";
const OG_IMAGE = `${BASE_URL}/opengraph-image.png`;

type WorkProject = { slug: string; image?: string };
const workProjects = workProjectsRaw as WorkProject[];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      images: [OG_IMAGE],
    },
    {
      url: `${BASE_URL}/work`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
      images: [OG_IMAGE],
    },
    {
      url: `${BASE_URL}/stack`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.7,
      images: [OG_IMAGE],
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
      images: [OG_IMAGE],
    },
    ...workProjects.map((project) => ({
      url: `${BASE_URL}/work/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      images: [
        ...(project.image ? [`${BASE_URL}${project.image}`] : []),
        OG_IMAGE,
      ],
    })),
  ];
}
