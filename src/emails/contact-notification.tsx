import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface ContactNotificationProps {
  name: string
  email: string
  inquiry: string
  message: string
}

export function ContactNotification({
  name,
  email,
  inquiry,
  message,
}: ContactNotificationProps) {
  return (
    <Html>
      <Head />
      <Preview>
        New {inquiry} inquiry from {name}
      </Preview>
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
              THEFALCON.DEV: NEW INQUIRY
            </Heading>
          </Section>

          <Section style={{ padding: "28px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {[
                  ["FROM", name],
                  ["EMAIL", email],
                  ["TYPE", inquiry.toUpperCase()],
                ].map(([label, value]) => (
                  <tr key={label}>
                    <td
                      style={{
                        fontFamily: "monospace",
                        fontSize: "12px",
                        color: "#888888",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        paddingBottom: "12px",
                        width: "80px",
                        verticalAlign: "top",
                      }}
                    >
                      {label}
                    </td>
                    <td
                      style={{
                        fontFamily: "monospace",
                        fontSize: "13px",
                        color: "#111111",
                        paddingBottom: "12px",
                        verticalAlign: "top",
                      }}
                    >
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Hr style={{ borderColor: "#e5e5e5", margin: "4px 0 20px" }} />

            <Text
              style={{
                fontFamily: "monospace",
                fontSize: "12px",
                color: "#888888",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                margin: "0 0 8px",
              }}
            >
              MESSAGE
            </Text>
            <Text
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontSize: "14px",
                color: "#333333",
                lineHeight: "1.6",
                margin: 0,
                whiteSpace: "pre-wrap",
              }}
            >
              {message}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
