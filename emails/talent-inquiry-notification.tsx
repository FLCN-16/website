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

interface TalentInquiryNotificationProps {
  email: string
  pitchText: string
  fileName: string | null
}

export function TalentInquiryNotification({
  email,
  pitchText,
  fileName,
}: TalentInquiryNotificationProps) {
  return (
    <Html>
      <Head />
      <Preview>New talent inquiry from {email}</Preview>
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
              THEFALCON.DEV: NEW TALENT INQUIRY
            </Heading>
          </Section>

          <Section style={{ padding: "28px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
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
                    EMAIL
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
                    {email}
                  </td>
                </tr>
              </tbody>
            </table>

            {pitchText ? (
              <>
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
                  PITCH / JD
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
                  {pitchText}
                </Text>
              </>
            ) : null}

            {fileName ? (
              <>
                <Hr style={{ borderColor: "#e5e5e5", margin: "20px 0 12px" }} />
                <Text
                  style={{
                    fontFamily: "monospace",
                    fontSize: "12px",
                    color: "#888888",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    margin: 0,
                  }}
                >
                  JD file attached: {fileName}
                </Text>
              </>
            ) : null}
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
