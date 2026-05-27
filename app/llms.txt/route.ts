import { NextResponse } from "next/server"
import { site } from "@/content/site"
import { projects } from "@/content/work"
import { stack } from "@/content/stack"

export function GET() {
  const lines: string[] = [
    `# ${site.name}`,
    `> ${site.role} based in ${site.location}. ${site.subheadline}`,
    "",
    `Contact: ${site.email}`,
    "",
    "## Pages",
    `- [About](${site.url}/): Introduction, career stats, work philosophy, and experience timeline.`,
    `- [Work](${site.url}/work): Selected project case studies covering problem, approach, impact, and stack.`,
    `- [Stack](${site.url}/stack): Full tool and technology breakdown with proficiency levels.`,
    `- [Writing](${site.url}/writing): Articles on frontend engineering, architecture, and building at scale.`,
    `- [Contact](${site.url}/contact): Enquiry form and direct contact details.`,
    "",
    "## Selected Projects",
    ...projects.map(
      (p) => `- [${p.title}](${site.url}/work/${p.slug}): ${p.description}`
    ),
    "",
    "## Stack Highlights",
    ...stack.disciplines.map(
      (d) =>
        `- ${d.name}: ${d.tools
          .filter((t) => t.maturity === "expert" || t.maturity === "proficient")
          .map((t) => t.name)
          .join(", ")}`
    ),
  ]

  return new NextResponse(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
