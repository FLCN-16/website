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

interface ContactEmailProps {
  name: string;
  email: string;
  inquiry?: string;
  message: string;
}

export const previewProps: ContactEmailProps = {
  name: "Alex Rivera",
  email: "alex.rivera@example.com",
  inquiry: "System Architecture Design",
  message:
    "Hey, I came across your portfolio and I'm really impressed with the work you've done on the Falcon platform. I'm building something similar and would love to chat about potential collaboration. Are you available for a quick call next week?",
};

const tailwindConfig = {
  theme: {
    extend: {
      colors: {
        // design system tokens
        primary: "#1e293b",
        "primary-muted": "#64748b",
        "primary-accent": "#2b4c7e",
        surface: "#f4f7f9",
        "surface-low": "#f8fafc",
        "on-surface": "#1e293b",
        outline: "#94a3b8",
        "outline-variant": "#d1d9e0",
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

function ContactEmail({ name, email, inquiry, message }: ContactEmailProps) {
  return (
    <Html lang="en">
      <Head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400&display=swap');

          /* Light mode defaults */
          .email-bg { background-color: #f4f7f9; }

          /* Dark mode — only outer background adapts, card stays light */
          @media (prefers-color-scheme: dark) {
            .email-bg { background-color: #0f172a !important; }
          }
        `}</style>
      </Head>
      <Preview>New message from {name} via thefalcon.dev</Preview>
      <Tailwind config={tailwindConfig}>
        <Body className="m-0 p-0 font-body">
          <div className="email-bg" style={{ backgroundColor: "#f4f7f9" }}>
            <Container className="mx-auto max-w-140 px-4 py-10">
              {/* Header — always dark */}
              <div className="rounded-t-structural bg-primary px-8 py-4.5">
                <Text className="m-0 inline font-headline text-label-sm font-bold tracking-label text-outline uppercase">
                  thefalcon.dev
                </Text>
                {"  "}
                <Text className="m-0 inline font-headline text-label-sm tracking-label text-primary-container uppercase">
                  / contact
                </Text>
              </div>

              {/* Card — always light */}
              <div
                className="rounded-b-structural border border-t-0 border-outline-variant bg-white px-8 py-8"
                style={{ backgroundColor: "#ffffff" }}
              >
                <Heading className="text-title-sm m-0 mb-1.5 font-headline font-bold text-on-surface">
                  New message
                </Heading>
                <Text className="m-0 mb-6 font-body text-body-md text-primary-muted">
                  Someone reached out through the contact form.
                </Text>

                <Hr className="my-0 mb-5 border-outline-variant" />

                {/* Sender meta */}
                <Section className="mb-5">
                  <Row className="mb-2.5">
                    <Column className="w-18">
                      <Text className="m-0 font-mono text-label-sm tracking-label text-outline uppercase">
                        Name
                      </Text>
                    </Column>
                    <Column>
                      <Text className="m-0 font-headline text-label-md font-medium text-on-surface">
                        {name}
                      </Text>
                    </Column>
                  </Row>
                  <Row className="mb-2.5">
                    <Column className="w-18">
                      <Text className="m-0 font-mono text-label-sm tracking-label text-outline uppercase">
                        Email
                      </Text>
                    </Column>
                    <Column>
                      <Text className="m-0 font-headline text-label-md font-medium text-primary-accent">
                        {email}
                      </Text>
                    </Column>
                  </Row>
                  <Row>
                    <Column className="w-18">
                      <Text className="m-0 font-mono text-label-sm tracking-label text-outline uppercase">
                        Inquiry
                      </Text>
                    </Column>
                    <Column>
                      <Text className="m-0 font-headline text-label-md font-medium text-on-surface">
                        {inquiry || "Not specified"}
                      </Text>
                    </Column>
                  </Row>
                </Section>

                <Hr className="my-0 mb-5 border-outline-variant" />

                <Text className="m-0 mb-2.5 font-mono text-label-sm tracking-label text-outline uppercase">
                  Message
                </Text>

                {/* Message block */}
                <div
                  className="rounded-structural border border-outline-variant bg-surface-low px-5.5 py-4.5"
                  style={{ backgroundColor: "#f8fafc" }}
                >
                  <Text
                    className="m-0 font-body text-body-md text-on-surface"
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    {message}
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

ContactEmail.defaultProps = previewProps;

export default ContactEmail;
