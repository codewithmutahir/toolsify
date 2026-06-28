import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { generatePageMetadata } from "@/lib/seo";
import { routing, type Locale } from "@/i18n/routing";

type PageProps = { params: { locale: string } };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps) {
  return generatePageMetadata(params.locale as Locale, "/about", "about");
}

const LAST_UPDATED = "June 28, 2026";

export default function AboutPage({ params }: PageProps) {
  setRequestLocale(params.locale);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-gutter py-2xl">
        <h1 className="font-h1 text-h1 text-on-surface mb-md">About Us</h1>
        <p className="font-small text-small text-on-surface-variant mb-xl">
          Last updated: {LAST_UPDATED}
        </p>

        <div className="prose prose-neutral max-w-none space-y-lg font-body text-body text-on-surface-variant">
          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              What is Toolsify?
            </h2>
            <p>
              Toolsify is a modern platform offering AI-powered digital tools
              designed to simplify everyday work. From productivity utilities
              and data processing to workflow automation, we bring
              professional-grade solutions together in one fast, privacy-first
              place.
            </p>
            <p>
              Our mission is straightforward: help you get accurate results in
              seconds, without downloads, complicated setup, or unnecessary
              friction.
            </p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              What you can use today
            </h2>
            <ul className="list-disc pl-lg space-y-xs">
              <li>Productivity &amp; Workflow Tools</li>
              <li>Data Processing Utilities</li>
              <li>Document &amp; Media Tools</li>
              <li>Developer Utilities</li>
              <li>Text &amp; Content Tools</li>
              <li>Business &amp; Analytics Tools</li>
              <li>AI-Powered Tools (expanding)</li>
            </ul>
            <p className="mt-sm">
              Browse the full collection on our{" "}
              <Link
                href="/tools"
                className="text-primary-container hover:underline"
              >
                tools page
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              What we care about
            </h2>
            <ul className="list-disc pl-lg space-y-xs">
              <li>
                <strong>Accuracy</strong> — every tool is built with care and
                reviewed regularly
              </li>
              <li>
                <strong>Speed</strong> — lightweight tools that load fast and
                respond instantly
              </li>
              <li>
                <strong>Privacy</strong> — most tools process your input
                directly in your browser
              </li>
              <li>
                <strong>Simplicity</strong> — clean interfaces that work on
                any device
              </li>
              <li>
                <strong>Modern UI</strong> — a thoughtful, mobile-first
                experience
              </li>
              <li>
                <strong>No unnecessary downloads</strong> — use tools right in
                your browser whenever possible
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              Who builds Toolsify?
            </h2>
            <p>
              Toolsify is independently developed and maintained by a solo Full
              Stack Developer focused on building fast, reliable, and
              user-friendly web applications. Every tool, design decision, and
              performance improvement comes from a single vision: make useful
              software that respects your time and your data.
            </p>
            <p>
              Learn more about the developer behind the platform on our{" "}
              <Link
                href="/author"
                className="text-primary-container hover:underline"
              >
                author page
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              How we keep results accurate
            </h2>
            <p>
              Each tool is built on established formulas, standards, and
              well-documented algorithms. We test outputs against known values,
              compare results with trusted reference sources, and refine tools
              when users report edge cases or inconsistencies.
            </p>
            <p>
              That said, no automated tool is perfect. For important decisions,
              always verify critical results independently. See our{" "}
              <Link
                href="/disclaimer"
                className="text-primary-container hover:underline"
              >
                disclaimer
              </Link>{" "}
              for more detail.
            </p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              Your privacy matters
            </h2>
            <p>
              Most Toolsify tools run entirely in your browser. That means your
              input—whether it is data you enter, text you process, or a file
              you upload—often never leaves your device. We do not sell
              personal data, and we are transparent about the limited analytics
              and advertising services we use to keep the platform free.
            </p>
            <p>
              Read our full{" "}
              <Link
                href="/privacy-policy"
                className="text-primary-container hover:underline"
              >
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link
                href="/cookie-policy"
                className="text-primary-container hover:underline"
              >
                Cookie Policy
              </Link>{" "}
              for complete details.
            </p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              Help us improve
            </h2>
            <p>
              User feedback shapes Toolsify. If a tool behaves unexpectedly, if
              you have an idea for a new feature, or if something is hard to
              use, we want to hear from you. Suggestions help us fix bugs
              faster, prioritize new capabilities, and build a platform that
              genuinely solves real problems.
            </p>
            <p>
              <Link
                href="/contact"
                className="text-primary-container hover:underline"
              >
                Contact us
              </Link>{" "}
              or use the request-a-tool option in the footer to share your
              ideas.
            </p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              Always growing
            </h2>
            <p>
              Toolsify is continuously expanding. New digital tools and
              utilities are added regularly based on user demand and emerging
              needs. Check back often—or explore what is new on the{" "}
              <Link
                href="/tools"
                className="text-primary-container hover:underline"
              >
                tools page
              </Link>
              .
            </p>
          </section>

          <blockquote className="border-l-4 border-primary-container pl-md py-sm text-on-surface-variant italic">
            Digital tools should be fast, accurate, and respectful of your
            privacy. That is the standard we hold ourselves to every day.
          </blockquote>
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
