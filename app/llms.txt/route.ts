// app/llms.txt/route.ts
import { NextResponse } from "next/server"
import { getPayloadClient } from "@/lib/payload"
import { site } from "@/content/site"
import { stack } from "@/content/stack"
import type { WorkEntry } from "@/lib/types"

export async function GET() {
  let workEntries: WorkEntry[] = []

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: "work",
      where: { status: { equals: "published" } },
      sort: "ord",
      limit: 50,
      depth: 0,
    })
    workEntries = result.docs.map((doc) => ({
      id: String(doc.id),
      slug: doc.slug,
      title: doc.title,
      category: doc.category ?? "",
      ord: doc.ord ?? "",
      tags: doc.tags?.map((t: { tag?: string }) => t.tag ?? "") ?? [],
      description: doc.description ?? "",
      briefing: {
        problem: (doc.briefing as { problem?: string } | null)?.problem ?? "",
        approach:
          ((doc.briefing as { approach?: { step?: string }[] } | null)?.approach ?? []).map(
            (a) => a.step ?? ""
          ),
        impact: (doc.briefing as { impact?: string } | null)?.impact ?? "",
        quote: (doc.briefing as { quote?: string } | null)?.quote ?? "",
      },
      stack: ((doc.stack as { name?: string; role?: string }[] | null) ?? []).map((s) => ({
        name: s.name ?? "",
        role: s.role ?? "",
      })),
    }))
  } catch {
    // Payload not available — omit work entries
  }

  const lines: string[] = [
    `# ${site.name}`,
    `> ${site.role} based in ${site.location}. ${site.subheadline}`,
    "",
    `Contact: ${site.email}`,
    "",
    "## Pages",
    `- [About](${site.url}/): Introduction, career stats, work philosophy, and experience timeline.`,
    `- [Work](${site.url}/work): Selected project case studies covering problem, approach, impact, and stack.`,
    `- [Projects](${site.url}/projects): Side projects, Chrome extensions, mobile apps, and open-source contributions.`,
    `- [Stack](${site.url}/stack): Full tool and technology breakdown with proficiency levels.`,
    `- [Writing](${site.url}/writing): Articles on frontend engineering, architecture, and building at scale.`,
    `- [Contact](${site.url}/contact): Enquiry form and direct contact details.`,
    "",
    "## Selected Work",
    ...workEntries.map(
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
