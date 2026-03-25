import type { Metadata } from "next";
import ContactPageHeader from "./_components/contact-page-header";
import ContactSection from "./_components/contact-section";

export const metadata: Metadata = {
  title: "Contact",
  description: "",
};

function ContactPage() {
  return (
    <>
      <ContactPageHeader />
      <ContactSection />
    </>
  );
}

export default ContactPage;
