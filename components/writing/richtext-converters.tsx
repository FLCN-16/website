import { NodeFormat } from "@payloadcms/richtext-lexical"
import type { JSXConvertersFunction } from "@payloadcms/richtext-lexical/react"

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function headingText(node: any): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (node.children as any[])
    .map((c: any) => (typeof c?.text === "string" ? c.text : ""))
    .join("")
}

const HEADING_CLASSES: Record<string, string> = {
  h1: "text-3xl font-semibold tracking-tight mt-12 mb-5 scroll-mt-24",
  h2: "text-2xl font-semibold tracking-tight mt-10 mb-4 scroll-mt-24",
  h3: "text-xl font-semibold tracking-tight mt-8 mb-3 scroll-mt-24",
  h4: "text-lg font-semibold tracking-tight mt-6 mb-2 scroll-mt-24",
  h5: "text-base font-semibold tracking-tight mt-4 mb-2 scroll-mt-24",
  h6: "text-sm font-semibold tracking-tight mt-4 mb-2 scroll-mt-24",
}

export const richTextConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  heading: ({ node, nodesToJSX }: any) => {
    const tag = node.tag as "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
    const children = nodesToJSX({ nodes: node.children })
    const id =
      tag === "h2" || tag === "h3"
        ? slugify(headingText(node)) || undefined
        : undefined
    const Tag = tag
    return (
      <Tag id={id} className={HEADING_CLASSES[tag]}>
        {children}
      </Tag>
    )
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paragraph: ({ node, nodesToJSX }: any) => {
    const children = nodesToJSX({ nodes: node.children })
    if (!children?.length) return <p><br /></p>
    return <p className="text-base leading-relaxed mb-5">{children}</p>
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  list: ({ node, nodesToJSX }: any) => {
    const children = nodesToJSX({ nodes: node.children })
    if (node.tag === "ol") {
      return <ol className="list-decimal ml-6 mb-5 space-y-1.5">{children}</ol>
    }
    return <ul className="list-disc ml-6 mb-5 space-y-1.5">{children}</ul>
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listitem: ({ node, nodesToJSX }: any) => {
    const children = nodesToJSX({ nodes: node.children })
    return <li className="leading-relaxed">{children}</li>
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  quote: ({ node, nodesToJSX }: any) => {
    const children = nodesToJSX({ nodes: node.children })
    return (
      <blockquote className="border-l-4 border-primary/40 pl-4 italic text-muted-foreground my-6">
        {children}
      </blockquote>
    )
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  link: ({ node, nodesToJSX }: any) => {
    const children = nodesToJSX({ nodes: node.children })
    const rel = node.fields.newTab ? "noopener noreferrer" : undefined
    const target = node.fields.newTab ? "_blank" : undefined
    let href: string = node.fields.url ?? "#"
    if (node.fields.linkType === "internal") {
      const slug = node.fields.doc?.value?.slug
      href = slug ? `/${slug}` : "#"
    }
    return (
      <a
        href={href}
        rel={rel}
        target={target}
        className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
      >
        {children}
      </a>
    )
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  autolink: ({ node, nodesToJSX }: any) => {
    const children = nodesToJSX({ nodes: node.children })
    const rel = node.fields.newTab ? "noopener noreferrer" : undefined
    const target = node.fields.newTab ? "_blank" : undefined
    return (
      <a
        href={node.fields.url as string}
        rel={rel}
        target={target}
        className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
      >
        {children}
      </a>
    )
  },

  horizontalrule: <hr className="border-t border-border my-8" />,

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  text: ({ node }: any) => {
    let text: React.ReactNode = node.text as string
    if (node.format & NodeFormat.IS_BOLD) text = <strong>{text}</strong>
    if (node.format & NodeFormat.IS_ITALIC) text = <em>{text}</em>
    if (node.format & NodeFormat.IS_STRIKETHROUGH)
      text = <span style={{ textDecoration: "line-through" }}>{text}</span>
    if (node.format & NodeFormat.IS_UNDERLINE)
      text = <span style={{ textDecoration: "underline" }}>{text}</span>
    if (node.format & NodeFormat.IS_CODE)
      text = (
        <code className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded text-foreground">
          {text}
        </code>
      )
    if (node.format & NodeFormat.IS_SUBSCRIPT) text = <sub>{text}</sub>
    if (node.format & NodeFormat.IS_SUPERSCRIPT) text = <sup>{text}</sup>
    return text
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  upload: ({ node }: any) => {
    if (typeof node.value !== "object") return null
    const doc = node.value as {
      url: string
      filename: string
      mimeType: string
      width?: number
      height?: number
      alt?: string
    }
    const alt: string = node.fields?.alt || doc?.alt || ""
    const { url } = doc

    if (!doc.mimeType?.startsWith("image")) {
      return (
        <a
          href={url}
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
        >
          {doc.filename}
        </a>
      )
    }

    return (
      <figure className="my-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={alt}
          width={doc.width}
          height={doc.height}
          className="rounded-lg w-full h-auto"
        />
        {alt && (
          <figcaption className="mt-2 text-center text-sm text-muted-foreground font-mono">
            {alt}
          </figcaption>
        )}
      </figure>
    )
  },
})
