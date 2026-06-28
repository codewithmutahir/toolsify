import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { generatePageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/config";
import { routing, type Locale } from "@/i18n/routing";

type PageProps = { params: { locale: string } };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps) {
  return generatePageMetadata(params.locale as Locale, "/author", "author");
}

const LAST_UPDATED = "June 28, 2026";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mutahir Hussain",
  jobTitle: "Full Stack Developer",
  description:
    "Full Stack Developer specializing in Laravel, MERN, WordPress, Shopify, React Native, AI-powered web applications, and modern web technologies. Creator and maintainer of Toolsify.",
  url: `${SITE_URL}/author`,
  worksFor: {
    "@type": "Organization",
    name: "Toolsify",
    url: SITE_URL,
  },
  knowsAbout: [
    "Laravel",
    "MERN Stack",
    "WordPress",
    "Shopify",
    "React Native",
    "AI Applications",
    "Web Performance",
    "SEO",
    "API Development",
    "Digital Tools",
  ],
};

export default function AuthorPage({ params }: PageProps) {
  setRequestLocale(params.locale);

  return (
    <div className="min-h-screen flex flex-col">
      <JsonLd data={personSchema} />
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-gutter py-2xl">
        <h1 className="font-h1 text-h1 text-on-surface mb-md">
          About the Author
        </h1>
        <p className="font-small text-small text-on-surface-variant mb-xl">
          Last updated: {LAST_UPDATED}
        </p>

        <div className="prose prose-neutral max-w-none space-y-lg font-body text-body text-on-surface-variant">
          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              Mutahir Hussain
            </h2>
            <p>
              Mutahir Hussain is a Full Stack Developer specializing in Laravel,
              Next.js, WordPress, AI-powered web applications, automation, and
              modern web technologies.
            </p>
            <p>
              He develops and maintains Toolsify with the goal of creating
              fast, accurate, privacy-first digital tools that help people
              work smarter and solve everyday problems efficiently.
            </p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              Why Toolsify exists
            </h2>
            <p>
              Too many useful utilities are buried behind sign-up walls,
              bloated downloads, or cluttered interfaces. Toolsify was built
              to offer a better alternative: AI-powered digital tools that load
              quickly, respect your privacy, and work on any device—no account
              required for most features.
            </p>
            <p>
              Every tool on the platform reflects a practical focus on accuracy,
              performance, and clarity. New capabilities are added regularly
              based on real user needs and feedback.
            </p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              Areas of expertise
            </h2>
            <ul className="list-disc pl-lg space-y-xs">
              <li>Laravel</li>
              <li>MERN</li>
              <li>WordPress</li>
              <li>Shopify</li>
              <li>React Native</li>
              <li>AI Applications</li>
              <li>Web Performance</li>
              <li>SEO</li>
              <li>API Development</li>
              <li>Digital Tools</li>
            </ul>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              A note on experience and trust
            </h2>
            <p>
              Toolsify is independently developed and maintained by a solo Full
              Stack Developer focused on building fast, reliable, and
              user-friendly web applications. There is no large team or
              corporate backing behind the platform—just a commitment to
              shipping tools that work well and treating user privacy seriously.
            </p>
            <p>
              If you have questions, suggestions, or feedback,{" "}
              <Link
                href="/contact"
                className="text-primary-container hover:underline"
              >
                get in touch
              </Link>
              . Your input directly influences what gets built next.
            </p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              Learn more about Toolsify
            </h2>
            <p>
              For details about the platform&apos;s mission, values, and
              approach to privacy and accuracy, visit our{" "}
              <Link
                href="/about"
                className="text-primary-container hover:underline"
              >
                About Us
              </Link>{" "}
              page.
            </p>
          </section>
        </div>

        <p className="mt-xl font-small text-small text-on-surface-variant">
          <Link href="/" className="text-primary-container hover:underline">
            ← Back to Toolsify
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}
