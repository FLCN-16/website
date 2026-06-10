import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components"

// ─── colour / type tokens ────────────────────────────────────────────────────
const C = {
  outerBg:   "#f5f5f5",
  paper:     "#ffffff",
  headerBar: "#111111",
  text:      "#0A0A0A",
  muted:     "#737373",
  border:    "#E5E5E5",
  chipBg:    "#F4F4F5",
  accent:    "#007A55",
  accentHov: "#00BC7D",
}
const SANS = "Inter, system-ui, -apple-system, sans-serif"
const MONO = "'JetBrains Mono', 'Fira Mono', monospace"

// ─── helpers ─────────────────────────────────────────────────────────────────
function fmtDate(d?: string | null): string | null {
  if (!d) return null
  try {
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  } catch {
    return null
  }
}

function postMeta(publishedAt?: string | null, readingTime?: number | null): string | null {
  const parts = [fmtDate(publishedAt), readingTime ? `${readingTime} min read` : null].filter(
    Boolean,
  )
  return parts.length ? parts.join("  ·  ") : null
}

// ─── types ────────────────────────────────────────────────────────────────────
export interface RecentPostItem {
  title: string
  slug: string
  publishedAt: string | null
  readingTime: number | null
}

export interface PostBroadcastProps {
  /** The just-published post (hero) */
  title: string
  slug: string
  excerpt: string | null
  cover: { url: string; alt: string | null } | null
  tag: string | null
  publishedAt: string | null
  readingTime: number | null
  /** Up to 3 other recent posts (compact list) */
  recent: RecentPostItem[]
  /** Canonical site root, e.g. https://www.thefalcon.dev */
  siteUrl: string
  /** Full post URL */
  postUrl: string
  /** Writing index URL */
  writingIndexUrl: string
}

// ─── email template ───────────────────────────────────────────────────────────
export function PostBroadcast({
  title,
  excerpt,
  cover,
  tag,
  publishedAt,
  readingTime,
  recent,
  siteUrl,
  postUrl,
  writingIndexUrl,
}: PostBroadcastProps) {
  const heroMeta = postMeta(publishedAt, readingTime)

  return (
    <Html>
      <Head>
        {/* hover affordances — stripped by some clients but degrade gracefully */}
        <style>{`
          .btn-cta:hover { background: ${C.accentHov} !important; }
          .hero-card:hover { border-color: ${C.accent} !important; }
          .recent-row:hover .recent-title { color: ${C.accent} !important; }
          .more-link:hover { color: ${C.accentHov} !important; }
        `}</style>
      </Head>

      <Preview>{`New post: ${title}`}</Preview>

      <Body
        style={{
          fontFamily: SANS,
          backgroundColor: C.outerBg,
          margin: 0,
          padding: "24px 0",
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: C.paper,
            borderRadius: "8px",
            border: `1px solid ${C.border}`,
            overflow: "hidden",
          }}
        >
          {/* ── HEADER ─────────────────────────────────────────────────── */}
          <Section style={{ backgroundColor: C.headerBar, padding: "20px 28px" }}>
            <Heading
              style={{
                color: "#ffffff",
                fontFamily: MONO,
                fontSize: "13px",
                fontWeight: "600",
                margin: 0,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              THEFALCON.DEV
            </Heading>
          </Section>

          {/* ── EYEBROW ────────────────────────────────────────────────── */}
          <Section style={{ padding: "28px 28px 0" }}>
            <Text
              style={{
                fontFamily: MONO,
                fontSize: "11px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: C.muted,
                margin: 0,
              }}
            >
              New writing
            </Text>
          </Section>

          {/* ── HERO CARD ──────────────────────────────────────────────── */}
          <Section style={{ padding: "16px 28px 8px" }}>
            {/* Outer anchor wraps the whole card */}
            <a
              href={postUrl}
              className="hero-card"
              style={{
                display: "block",
                textDecoration: "none",
                border: `1px solid ${C.border}`,
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              {/* Cover image */}
              {cover && (
                <Img
                  src={cover.url}
                  alt={cover.alt ?? title}
                  width="544"
                  style={{
                    width: "100%",
                    display: "block",
                    borderBottom: `1px solid ${C.border}`,
                  }}
                />
              )}

              {/* Card body */}
              <div style={{ padding: "20px" }}>
                {/* Tag chip */}
                {tag && (
                  <div style={{ marginBottom: "12px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        fontFamily: MONO,
                        fontSize: "11px",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        color: C.accent,
                        backgroundColor: C.chipBg,
                        padding: "4px 10px",
                        borderRadius: "999px",
                      }}
                    >
                      {tag}
                    </span>
                  </div>
                )}

                {/* Title */}
                <Heading
                  style={{
                    fontFamily: SANS,
                    fontSize: "22px",
                    fontWeight: "700",
                    lineHeight: "1.25",
                    color: C.text,
                    margin: "0 0 10px",
                  }}
                >
                  {title}
                </Heading>

                {/* Excerpt */}
                {excerpt && (
                  <Text
                    style={{
                      fontFamily: SANS,
                      fontSize: "15px",
                      lineHeight: "1.65",
                      color: C.muted,
                      margin: "0 0 14px",
                    }}
                  >
                    {excerpt}
                  </Text>
                )}

                {/* Date · reading time */}
                {heroMeta && (
                  <Text
                    style={{
                      fontFamily: MONO,
                      fontSize: "12px",
                      color: C.muted,
                      margin: 0,
                    }}
                  >
                    {heroMeta}
                  </Text>
                )}
              </div>
            </a>
          </Section>

          {/* ── CTA BUTTON ─────────────────────────────────────────────── */}
          <Section style={{ padding: "12px 28px 28px" }}>
            <a
              href={postUrl}
              className="btn-cta"
              style={{
                display: "inline-block",
                backgroundColor: C.accent,
                color: "#ffffff",
                fontFamily: SANS,
                fontSize: "14px",
                fontWeight: "600",
                textDecoration: "none",
                padding: "11px 22px",
                borderRadius: "7px",
              }}
            >
              Read article →
            </a>
          </Section>

          {/* ── RECENT POSTS ───────────────────────────────────────────── */}
          {recent.length > 0 && (
            <>
              <Hr style={{ borderColor: C.border, margin: "0 28px" }} />
              <Section style={{ padding: "24px 28px 4px" }}>
                <Text
                  style={{
                    fontFamily: MONO,
                    fontSize: "11px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: C.muted,
                    margin: "0 0 4px",
                  }}
                >
                  Recent posts
                </Text>
              </Section>

              {recent.map((p) => {
                const meta = postMeta(p.publishedAt, p.readingTime)
                return (
                  <Section key={p.slug} style={{ padding: "0 28px" }}>
                    <a
                      href={`${siteUrl}/writing/${p.slug}`}
                      className="recent-row"
                      style={{
                        display: "block",
                        textDecoration: "none",
                        padding: "13px 0",
                        borderBottom: `1px solid ${C.border}`,
                      }}
                    >
                      <Text
                        className="recent-title"
                        style={{
                          fontFamily: SANS,
                          fontSize: "15px",
                          fontWeight: "600",
                          color: C.text,
                          margin: "0 0 3px",
                        }}
                      >
                        {p.title}
                      </Text>
                      {meta && (
                        <Text
                          style={{
                            fontFamily: MONO,
                            fontSize: "12px",
                            color: C.muted,
                            margin: 0,
                          }}
                        >
                          {meta}
                        </Text>
                      )}
                    </a>
                  </Section>
                )
              })}
            </>
          )}

          {/* ── MORE WRITINGS ──────────────────────────────────────────── */}
          <Section style={{ padding: recent.length > 0 ? "20px 28px 28px" : "4px 28px 28px" }}>
            <a
              href={writingIndexUrl}
              className="more-link"
              style={{
                fontFamily: SANS,
                fontSize: "14px",
                fontWeight: "600",
                color: C.accent,
                textDecoration: "none",
              }}
            >
              More writings →
            </a>
          </Section>

          {/* ── FOOTER ─────────────────────────────────────────────────── */}
          <Section
            style={{
              borderTop: `1px solid ${C.border}`,
              padding: "16px 28px",
            }}
          >
            <Text
              style={{
                fontFamily: MONO,
                fontSize: "12px",
                color: "#aaaaaa",
                margin: "0 0 6px",
              }}
            >
              thefalcon.dev · Jalandhar, India
            </Text>
            <Text
              style={{
                fontFamily: SANS,
                fontSize: "12px",
                color: C.muted,
                margin: 0,
                lineHeight: "1.6",
              }}
            >
              You received this because you subscribed at{" "}
              <a href={siteUrl} style={{ color: C.muted, textDecoration: "underline" }}>
                thefalcon.dev
              </a>
              .{" "}
              <a
                href="{{{RESEND_UNSUBSCRIBE_URL}}}"
                style={{ color: C.muted, textDecoration: "underline" }}
              >
                Unsubscribe
              </a>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default PostBroadcast
