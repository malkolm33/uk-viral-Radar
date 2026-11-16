import type { Metadata } from "next";
import ContactForm from "./ContactForm";
import { organizationSchema, jsonLd } from "../lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/contact" },
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


export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(organizationSchema) }}
      />
      <ContactForm />
    </>
  );
}
