import { NodeFormat } from "@payloadcms/richtext-lexical"
import type { JSXConvertersFunction } from "@payloadcms/richtext-lexical/react"
import type React from "react"

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      <blockquote className="border-l-2 border-primary/30 pl-4 italic text-muted-foreground my-6">
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
  code: ({ node, nodesToJSX }: any) => {
    const lang: string = node.language ?? ""
    const children = nodesToJSX({ nodes: node.children })
    return (
      <pre
        className="my-6 overflow-x-auto rounded-lg bg-muted p-4 text-sm leading-relaxed"
        data-language={lang || undefined}
      >
        <code className={lang ? `language-${lang}` : undefined}>{children}</code>
      </pre>
    )
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  "code-highlight": ({ node }: any) => {
    const text: string = node.text ?? ""
    const type: string | null = node.highlightType ?? null
    if (!type) return <span>{text}</span>
    return <span className={`token ${type}`}>{text}</span>
  },

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
    if (!url) return null

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
        <a
          href={url}
          data-pswp-src={url}
          data-pswp-width={doc.width ?? 1200}
          data-pswp-height={doc.height ?? 800}
          aria-label={alt || "View image"}
          className="group relative block overflow-hidden rounded-lg cursor-zoom-in"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={alt}
            width={doc.width}
            height={doc.height}
            className="w-full h-auto rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/20 rounded-lg">
            <div className="bg-background/90 backdrop-blur-sm rounded-full p-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
                <line x1="11" y1="8" x2="11" y2="14"/>
                <line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
            </div>
          </div>
        </a>
        {alt && (
          <figcaption className="mt-2 text-center text-sm text-muted-foreground font-mono">
            {alt}
          </figcaption>
        )}
      </figure>
    )
  },
})
