import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Hr,
  Tailwind,
} from "@react-email/components";

interface ContactEmailProps {
  name: string;
  email: string;
  message: string;
}

function ContactEmail({ name, email, message }: ContactEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New message from {name}</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans py-10">
          <Container className="bg-white max-w-xl mx-auto rounded-xl p-8 shadow-sm">
            <Heading className="text-2xl font-bold text-gray-800 mb-4">
              📬 New Contact Message
            </Heading>
            <Hr className="border-gray-200 mb-4" />
            <Text className="text-sm text-gray-500 mb-1">
              <strong className="text-gray-700">From:</strong> {name}
            </Text>
            <Text className="text-sm text-gray-500 mb-4">
              <strong className="text-gray-700">Email:</strong> {email}
            </Text>
            <Hr className="border-gray-200 mb-4" />
            <Text className="text-base text-gray-700 leading-relaxed">
              {message}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default ContactEmail;
