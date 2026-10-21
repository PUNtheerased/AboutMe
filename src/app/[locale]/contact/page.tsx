import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Say hello — code, photos, or just a note.",
};

export default function ContactPage() {
  return <ContactForm />;
}
