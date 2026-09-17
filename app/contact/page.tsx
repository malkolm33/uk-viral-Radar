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

export default function ContactPage() {
  return <ContactForm />;
}
