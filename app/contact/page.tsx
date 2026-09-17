import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us - UK Viral Radar",
  description:
    "Get in touch with the UK Viral Radar team with questions, feedback or feature requests.",
  openGraph: {
    title: "Contact Us - UK Viral Radar",
    description:
      "Get in touch with the UK Viral Radar team with questions, feedback or feature requests.",
    type: "website",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "UK Viral Radar",
  url: "https://ukviralradar.com",
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <ContactForm />
    </>
  );
}
