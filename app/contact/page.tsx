import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/contact/ContactForm";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Contact Us | Toolsify",
  description:
    "Get in touch with the Toolsify team. Questions, feedback, or partnership inquiries welcome.",
  robots: { index: true, follow: true },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-gutter py-2xl w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-xs font-small text-small text-on-surface-variant hover:text-primary-container mb-lg transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Toolsify
        </Link>

        <h1 className="font-h1 text-h1 text-on-surface mb-sm">Contact Us</h1>
        <p className="font-body text-body text-on-surface-variant mb-xl">
          Have a question, found a bug, or want to say hello? Send us a message
          and we&apos;ll respond as soon as we can.
        </p>

        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
