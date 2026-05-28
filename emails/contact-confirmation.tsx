import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface ContactConfirmationProps {
  name: string
}

export function ContactConfirmation({ name }: ContactConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>Got your message — Rishabh Kumar</Preview>
      <Body
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          backgroundColor: "#f5f5f5",
          margin: 0,
          padding: "24px 0",
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            borderRadius: "4px",
            border: "1px solid #e5e5e5",
            overflow: "hidden",
          }}
        >
          <Section
            style={{
              backgroundColor: "#111111",
              padding: "20px 28px",
            }}
          >
            <Heading
              style={{
                color: "#ffffff",
                fontFamily: "monospace",
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

          <Section style={{ padding: "28px" }}>
            <Heading
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontSize: "20px",
                fontWeight: "600",
                color: "#111111",
                margin: "0 0 16px",
              }}
            >
              Hey {name}, got your message.
            </Heading>
            <Text
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontSize: "14px",
                color: "#555555",
                lineHeight: "1.7",
                margin: "0 0 16px",
              }}
            >
              Thanks for reaching out. I read every message and will get back to
              you within a day or two — usually sooner.
            </Text>
            <Text
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontSize: "14px",
                color: "#555555",
                lineHeight: "1.7",
                margin: "0 0 24px",
              }}
            >
              If it&apos;s urgent you can reach me directly at{" "}
              <a
                href="mailto:hello@thefalcon.dev"
                style={{ color: "#111111", fontWeight: "600" }}
              >
                hello@thefalcon.dev
              </a>
              .
            </Text>
            <Text
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontSize: "14px",
                color: "#111111",
                margin: 0,
              }}
            >
              — Rishabh
            </Text>
          </Section>

          <Section
            style={{
              borderTop: "1px solid #e5e5e5",
              padding: "16px 28px",
            }}
          >
            <Text
              style={{
                fontFamily: "monospace",
                fontSize: "11px",
                color: "#aaaaaa",
                margin: 0,
              }}
            >
              thefalcon.dev · Jalandhar, India
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
