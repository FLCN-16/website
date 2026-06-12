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

// ─── light-mode tokens (dark overrides live in the <style> block) ─────────────
const L = {
  bg:        "#ffffff",
  headerBar: "#111111",
  text:      "#0A0A0A",
  muted:     "#737373",
  subdued:   "#aaaaaa",
  border:    "#E5E5E5",
  chipBg:    "#F4F4F5",
  accent:    "#007A55",
  accentHov: "#00BC7D",
}
const SANS = "Inter, system-ui, -apple-system, sans-serif"
const MONO = "'JetBrains Mono', 'Fira Mono', monospace"

// ─── helpers ──────────────────────────────────────────────────────────────────
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
  const parts = [fmtDate(publishedAt), readingTime ? `${readingTime} min read` : null].filter(Boolean)
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
  title: string
  slug: string
  excerpt: string | null
  cover: { url: string; alt: string | null } | null
  tag: string | null
  publishedAt: string | null
  readingTime: number | null
  recent: RecentPostItem[]
  siteUrl: string
  postUrl: string
  writingIndexUrl: string
}

// ─── template ─────────────────────────────────────────────────────────────────
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
        <style>{`
          /* ── hover (degrades gracefully where unsupported) ── */
          .btn-cta:hover  { background: ${L.accentHov} !important; }
          .hero-card:hover { border-color: ${L.accent} !important; }
          .recent-row:hover .recent-title { color: ${L.accent} !important; }
          .more-link:hover { color: ${L.accentHov} !important; }

          /* ── dark mode ─────────────────────────────────────── */
          @media (prefers-color-scheme: dark) {
            .email-body     { background-color: #0A0A0A !important; }
            .email-wrap     { background-color: #0A0A0A !important; border-color: #262626 !important; }
            .card-body      { background-color: #111111 !important; }
            .hero-card      { border-color: #262626 !important; }
            .cover-img      { border-bottom-color: #262626 !important; }
            .tag-chip       { background-color: #1C1C1C !important; color: #00BC7D !important; }
            .card-title     { color: #FAFAFA !important; }
            .text-muted     { color: #A1A1A1 !important; }
            .hr-divider     { border-top: 1px solid #262626 !important; }
            .recent-title   { color: #FAFAFA !important; }
            .recent-row     { border-bottom-color: #262626 !important; }
            .footer-wrap    { border-top-color: #262626 !important; }
            .footer-domain  { color: #555555 !important; }
            .footer-link    { color: #555555 !important; }
          }
        `}</style>
      </Head>

      <Preview>{`New post: ${title}`}</Preview>

      {/* No padding/margin — flush to email client viewport */}
      <Body
        className="email-body"
        style={{ fontFamily: SANS, backgroundColor: L.bg, margin: 0, padding: 0 }}
      >
        <Container
          className="email-wrap"
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: L.bg,
            border: `1px solid ${L.border}`,
            overflow: "hidden",
          }}
        >
          {/* ── HEADER ──────────────────────────────────────────────────── */}
          <Section style={{ backgroundColor: L.headerBar, padding: "20px 28px" }}>
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

          {/* ── EYEBROW ─────────────────────────────────────────────────── */}
          <Section style={{ padding: "28px 28px 0" }}>
            <Text
              className="text-muted"
              style={{
                fontFamily: MONO,
                fontSize: "11px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: L.muted,
                margin: 0,
              }}
            >
              New writing
            </Text>
          </Section>

          {/* ── HERO CARD ───────────────────────────────────────────────── */}
          <Section style={{ padding: "16px 28px 8px" }}>
            <a
              href={postUrl}
              className="hero-card"
              style={{
                display: "block",
                textDecoration: "none",
                border: `1px solid ${L.border}`,
                overflow: "hidden",
              }}
            >
              {cover && (
                <Img
                  src={cover.url}
                  alt={cover.alt ?? title}
                  width="544"
                  className="cover-img"
                  style={{
                    width: "100%",
                    display: "block",
                    borderBottom: `1px solid ${L.border}`,
                  }}
                />
              )}

              <div
                className="card-body"
                style={{ padding: "20px", backgroundColor: L.bg }}
              >
                {tag && (
                  <div style={{ marginBottom: "12px" }}>
                    <span
                      className="tag-chip"
                      style={{
                        display: "inline-block",
                        fontFamily: MONO,
                        fontSize: "11px",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        color: L.accent,
                        backgroundColor: L.chipBg,
                        padding: "4px 10px",
                      }}
                    >
                      {tag}
                    </span>
                  </div>
                )}

                <Heading
                  className="card-title"
                  style={{
                    fontFamily: SANS,
                    fontSize: "22px",
                    fontWeight: "700",
                    lineHeight: "1.25",
                    color: L.text,
                    margin: "0 0 10px",
                  }}
                >
                  {title}
                </Heading>

                {excerpt && (
                  <Text
                    className="text-muted"
                    style={{
                      fontFamily: SANS,
                      fontSize: "15px",
                      lineHeight: "1.65",
                      color: L.muted,
                      margin: "0 0 14px",
                    }}
                  >
                    {excerpt}
                  </Text>
                )}

                {heroMeta && (
                  <Text
                    className="text-muted"
                    style={{
                      fontFamily: MONO,
                      fontSize: "12px",
                      color: L.muted,
                      margin: 0,
                    }}
                  >
                    {heroMeta}
                  </Text>
                )}
              </div>
            </a>
          </Section>

          {/* ── CTA BUTTON ──────────────────────────────────────────────── */}
          <Section style={{ padding: "12px 28px 28px" }}>
            <a
              href={postUrl}
              className="btn-cta"
              style={{
                display: "inline-block",
                backgroundColor: L.accent,
                color: "#ffffff",
                fontFamily: SANS,
                fontSize: "14px",
                fontWeight: "600",
                textDecoration: "none",
                padding: "11px 22px",
              }}
            >
              Read article →
            </a>
          </Section>

          {/* ── RECENT POSTS ────────────────────────────────────────────── */}
          {recent.length > 0 && (
            <>
              <Hr
                className="hr-divider"
                style={{ borderTop: `1px solid ${L.border}`, margin: "0 28px" }}
              />
              <Section style={{ padding: "24px 28px 4px" }}>
                <Text
                  className="text-muted"
                  style={{
                    fontFamily: MONO,
                    fontSize: "11px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: L.muted,
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
                        borderBottom: `1px solid ${L.border}`,
                      }}
                    >
                      <Text
                        className="recent-title"
                        style={{
                          fontFamily: SANS,
                          fontSize: "15px",
                          fontWeight: "600",
                          color: L.text,
                          margin: "0 0 3px",
                        }}
                      >
                        {p.title}
                      </Text>
                      {meta && (
                        <Text
                          className="text-muted"
                          style={{
                            fontFamily: MONO,
                            fontSize: "12px",
                            color: L.muted,
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

          {/* ── MORE WRITINGS ───────────────────────────────────────────── */}
          <Section style={{ padding: recent.length > 0 ? "20px 28px 28px" : "4px 28px 28px" }}>
            <a
              href={writingIndexUrl}
              className="more-link"
              style={{
                fontFamily: SANS,
                fontSize: "14px",
                fontWeight: "600",
                color: L.accent,
                textDecoration: "none",
              }}
            >
              More writings →
            </a>
          </Section>

          {/* ── FOOTER ──────────────────────────────────────────────────── */}
          <Section
            className="footer-wrap"
            style={{ borderTop: `1px solid ${L.border}`, padding: "16px 28px" }}
          >
            <Text
              className="footer-domain"
              style={{
                fontFamily: MONO,
                fontSize: "12px",
                color: L.subdued,
                margin: "0 0 6px",
              }}
            >
              thefalcon.dev · Jalandhar, India
            </Text>
            <Text
              className="text-muted"
              style={{
                fontFamily: SANS,
                fontSize: "12px",
                color: L.muted,
                margin: 0,
                lineHeight: "1.6",
              }}
            >
              You received this because you subscribed at{" "}
              <a
                href={siteUrl}
                className="footer-link"
                style={{ color: L.muted, textDecoration: "underline" }}
              >
                thefalcon.dev
              </a>
              .{" "}
              <a
                href="{{{RESEND_UNSUBSCRIBE_URL}}}"
                className="footer-link"
                style={{ color: L.muted, textDecoration: "underline" }}
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
