import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface HiringEmailProps {
  email: string;
  jd: string;
  hasAttachment?: boolean;
  attachmentName?: string;
}

export const previewProps: HiringEmailProps = {
  email: "talent@acme.com",
  jd: "We're looking for a Front-End Technical Lead to join our platform team. The role involves leading a team of 6 engineers, owning the component library, and driving architecture decisions. Remote-friendly. Equity + competitive package.",
  hasAttachment: true,
  attachmentName: "ACME_FrontEnd_Lead_JD.pdf",
};

const tailwindConfig = {
  theme: {
    extend: {
      colors: {
        primary: "#1e293b",
        "primary-muted": "#64748b",
        "primary-accent": "#2b4c7e",
        surface: "#f4f7f9",
        "surface-low": "#f8fafc",
        "on-surface": "#1e293b",
        outline: "#94a3b8",
        "outline-variant": "#d1d9e0",
        amber: "#d97706",
        "amber-bg": "#fffbeb",
        "amber-border": "#fde68a",
      },
      fontFamily: {
        headline: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        "label-sm": ["0.625rem", { lineHeight: "1.5", letterSpacing: "0.15em" }],
        "label-md": ["0.875rem", { lineHeight: "1.5", letterSpacing: "-0.02em" }],
        "body-md": ["0.875rem", { lineHeight: "1.6" }],
        "body-lg": ["0.9375rem", { lineHeight: "1.7" }],
        "title-sm": ["1.375rem", { lineHeight: "1.1", letterSpacing: "-0.025em" }],
      },
      borderRadius: {
        structural: "2px",
      },
    },
  },
};

function HiringEmail({ email, jd, hasAttachment, attachmentName }: HiringEmailProps) {
  return (
    <Html lang="en">
      <Head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400&display=swap');
          .email-bg { background-color: #f4f7f9; }
          @media (prefers-color-scheme: dark) {
            .email-bg { background-color: #0f172a !important; }
          }
        `}</style>
      </Head>
      <Preview>🔴 HIGH PRIORITY — Hiring opportunity from {email}</Preview>
      <Tailwind config={tailwindConfig}>
        <Body className="m-0 p-0 font-body">
          <div className="email-bg" style={{ backgroundColor: "#f4f7f9" }}>
            <Container className="mx-auto max-w-140 px-4 py-10">
              {/* Header — high priority indicator */}
              <div className="rounded-t-structural bg-primary px-8 py-4.5">
                <Text className="m-0 inline font-headline text-label-sm font-bold tracking-label text-outline uppercase">
                  thefalcon.dev
                </Text>
                {"  "}
                <Text className="text-amber m-0 inline font-headline text-label-sm tracking-label uppercase">
                  / HIRING_OPPORTUNITY [HIGH_PRIORITY]
                </Text>
              </div>

              {/* Card */}
              <div
                className="rounded-b-structural border border-t-0 border-outline-variant bg-white px-8 py-8"
                style={{ backgroundColor: "#ffffff" }}
              >
                {/* Priority badge */}
                <div
                  className="rounded-structural border-amber-border mb-5 border px-4 py-3"
                  style={{ backgroundColor: "#fffbeb", borderColor: "#fde68a" }}
                >
                  <Text className="text-amber m-0 font-mono text-label-sm tracking-label uppercase">
                    ⚠ Priority: High — Someone is hiring
                  </Text>
                </div>

                <Heading className="text-title-sm m-0 mb-1.5 font-headline font-bold text-on-surface">
                  New hiring opportunity
                </Heading>
                <Text className="m-0 mb-6 font-body text-body-md text-primary-muted">
                  A visitor submitted a job opportunity through thefalcon.dev.
                </Text>

                <Hr className="my-0 mb-5 border-outline-variant" />

                {/* Sender */}
                <Section className="mb-5">
                  <Row>
                    <Column className="w-24">
                      <Text className="m-0 font-mono text-label-sm tracking-label text-outline uppercase">
                        From
                      </Text>
                    </Column>
                    <Column>
                      <Text className="m-0 font-headline text-label-md font-medium text-primary-accent">
                        {email}
                      </Text>
                    </Column>
                  </Row>
                  {hasAttachment && (
                    <Row className="mt-2">
                      <Column className="w-24">
                        <Text className="m-0 font-mono text-label-sm tracking-label text-outline uppercase">
                          JD File
                        </Text>
                      </Column>
                      <Column>
                        <Text className="m-0 font-headline text-label-md font-medium text-on-surface">
                          {attachmentName} (attached)
                        </Text>
                      </Column>
                    </Row>
                  )}
                </Section>

                <Hr className="my-0 mb-5 border-outline-variant" />

                <Text className="m-0 mb-2.5 font-mono text-label-sm tracking-label text-outline uppercase">
                  Job Description
                </Text>

                {/* JD block */}
                <div
                  className="rounded-structural border border-outline-variant bg-surface-low px-5.5 py-4.5"
                  style={{ backgroundColor: "#f8fafc", borderLeft: "3px solid #2b4c7e" }}
                >
                  <Text
                    className="m-0 font-body text-body-md text-on-surface"
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    {jd || "(No description provided — see attached JD file)"}
                  </Text>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-5 text-center">
                <Text className="m-0 text-center font-mono text-label-sm tracking-label text-outline uppercase">
                  Sent via thefalcon.dev · Reply directly to this email
                </Text>
              </div>
            </Container>
          </div>
        </Body>
      </Tailwind>
    </Html>
  );
}

HiringEmail.defaultProps = previewProps;

export default HiringEmail;
