import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface ConfirmationEmailProps {
  name: string;
  message: string;
}

export const previewProps: ConfirmationEmailProps = {
  name: "Alex Rivera",
  message:
    "Hey, I came across your portfolio and I'm really impressed with the work you've done on the Falcon platform. I'm building something similar and would love to chat about potential collaboration. Are you available for a quick call next week?",
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
      },
      fontFamily: {
        headline: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        "label-sm": ["0.625rem", { lineHeight: "1.5", letterSpacing: "0.15em" }],
        "label-md": ["0.9375rem", { lineHeight: "1.5", letterSpacing: "-0.02em" }],
        "body-lg": ["0.9375rem", { lineHeight: "1.7" }],
        "title-sm": ["1.375rem", { lineHeight: "1.1", letterSpacing: "-0.025em" }],
      },
      borderRadius: {
        structural: "2px",
      },
    },
  },
};

function ConfirmationEmail({ name, message }: ConfirmationEmailProps) {
  return (
    <Html lang="en">
      <Head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400&display=swap');

          /* Light mode default */
          .email-bg { background-color: #f4f7f9; }

          /* Dark mode — only outer background adapts, card stays light */
          @media (prefers-color-scheme: dark) {
            .email-bg { background-color: #0f172a !important; }
          }
        `}</style>
      </Head>
      <Preview>Got your message — I'll be in touch soon.</Preview>
      <Tailwind config={tailwindConfig}>
        <Body className="m-0 p-0 font-body">
          <div className="email-bg" style={{ backgroundColor: "#f4f7f9" }}>
            <Container className="mx-auto max-w-140 px-4 py-10">
              {/* Header — always dark */}
              <div className="rounded-t-structural bg-primary px-8 py-4.5">
                <Text className="m-0 font-headline text-label-sm font-bold tracking-label text-outline uppercase">
                  thefalcon.dev
                </Text>
              </div>

              {/* Card — always light */}
              <div
                className="rounded-b-structural border border-t-0 border-outline-variant bg-white px-8 py-8"
                style={{ backgroundColor: "#ffffff" }}
              >
                <Heading className="text-title-sm m-0 mb-1.5 font-headline font-bold text-on-surface">
                  Thanks, {name}.
                </Heading>
                <Text className="m-0 mb-6 font-body text-body-lg text-primary-muted">
                  Your message came through. I read every one personally and will get back to you as
                  soon as I can — usually within a day or two.
                </Text>

                <Hr className="my-0 mb-5 border-outline-variant" />

                <Text className="m-0 mb-2.5 font-mono text-label-sm tracking-label text-outline uppercase">
                  Your message
                </Text>

                {/* Quoted message block */}
                <div
                  className="rounded-r-structural border border-outline-variant bg-surface-low px-5.5 py-4.5"
                  style={{
                    backgroundColor: "#f8fafc",
                    borderLeft: "3px solid #2b4c7e",
                  }}
                >
                  <Text
                    className="m-0 font-body text-[0.875rem] leading-[1.7] text-primary-container"
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    {message}
                  </Text>
                </div>

                <Hr className="mt-6 mb-5 border-outline-variant" />

                {/* Sign-off */}
                <Section>
                  <Text className="m-0 mb-0.5 font-body text-body-lg text-on-surface">
                    Talk soon,
                  </Text>
                  <Text className="m-0 font-headline text-label-md font-bold text-primary-accent">
                    The Falcon
                  </Text>
                </Section>
              </div>

              {/* Footer */}
              <div className="mt-5 text-center">
                <Text className="m-0 text-center font-mono text-label-sm tracking-label text-outline uppercase">
                  thefalcon.dev · This is an automated confirmation
                </Text>
              </div>
            </Container>
          </div>
        </Body>
      </Tailwind>
    </Html>
  );
}

ConfirmationEmail.defaultProps = previewProps;

export default ConfirmationEmail;
