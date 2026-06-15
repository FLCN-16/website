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

interface DataRequestConfirmationProps {
  name: string
  requestType: string
}

export function DataRequestConfirmation({ name, requestType }: DataRequestConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>Your data request has been received — thefalcon.dev</Preview>
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
              {name}, your request has been received.
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
              I&apos;ve received your <strong>{requestType}</strong> data subject
              request and will respond within <strong>30 days</strong> as required
              by GDPR Art. 12.
            </Text>
            <Text
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontSize: "14px",
                color: "#555555",
                lineHeight: "1.7",
                margin: "0 0 16px",
              }}
            >
              In some cases I may need to verify your identity before fulfilling the
              request — if so, I&apos;ll be in touch to confirm a few details.
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
              If you have any questions in the meantime, you can reach me directly
              at{" "}
              <a
                href="mailto:hello@thefalcon.dev"
                style={{ color: "#111111", fontWeight: "600" }}
              >
                hello@thefalcon.dev
              </a>
              . You also have the right to lodge a complaint with your local data
              protection supervisory authority at any time.
            </Text>
            <Text
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontSize: "14px",
                color: "#111111",
                margin: 0,
              }}
            >
              Rishabh
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
                fontSize: "12px",
                color: "#aaaaaa",
                margin: 0,
              }}
            >
              thefalcon.dev · Jalandhar, India · Data Subject Request Reference
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
