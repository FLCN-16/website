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

interface DataRequestNotificationProps {
  name: string
  email: string
  requestType: string
  details: string
}

export function DataRequestNotification({
  name,
  email,
  requestType,
  details,
}: DataRequestNotificationProps) {
  return (
    <Html>
      <Head />
      <Preview>
        New data subject request ({requestType}) from {name}
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
              THEFALCON.DEV: NEW DATA REQUEST
            </Heading>
          </Section>

          <Section style={{ padding: "28px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {[
                  ["FROM", name],
                  ["EMAIL", email],
                  ["REQUEST TYPE", requestType.toUpperCase()],
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
                        width: "120px",
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
              DETAILS
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
              {details}
            </Text>

            <Hr style={{ borderColor: "#e5e5e5", margin: "20px 0 16px" }} />

            <Text
              style={{
                fontFamily: "monospace",
                fontSize: "11px",
                color: "#aaaaaa",
                margin: 0,
              }}
            >
              The requester confirmed they are the data subject (or authorised to act on their behalf). Respond within 30 days per GDPR Art. 12.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
