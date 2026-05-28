export interface Heading {
  id: string
  text: string
  level: 2 | 3
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function textContent(children: any[]): string {
  if (!Array.isArray(children)) return ""
  return children.map((c) => (typeof c?.text === "string" ? c.text : "")).join("")
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractHeadings(body: any): Heading[] {
  if (!body?.root?.children) return []
  const headings: Heading[] = []
  for (const node of body.root.children) {
    if (node?.type !== "heading") continue
    if (node.tag !== "h2" && node.tag !== "h3") continue
    const text = textContent(node.children)
    if (!text) continue
    headings.push({ id: slugify(text), text, level: node.tag === "h2" ? 2 : 3 })
  }
  return headings
}
