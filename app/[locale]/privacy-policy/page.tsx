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
  return generatePageMetadata(
    params.locale as Locale,
    "/privacy-policy",
    "privacy"
  );
}

const LAST_UPDATED = "June 18, 2026";
const CONTACT_EMAIL = "privacy@toolsify.online";

export default function PrivacyPolicyPage({ params }: PageProps) {
  setRequestLocale(params.locale);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-gutter py-2xl">
        <h1 className="font-h1 text-h1 text-on-surface mb-md">Privacy Policy</h1>
        <p className="font-small text-small text-on-surface-variant mb-xl">
          Last updated: {LAST_UPDATED}
        </p>

        <div className="prose prose-neutral max-w-none space-y-lg font-body text-body text-on-surface-variant">
          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              Overview
            </h2>
            <p>
              Toolsify (&quot;we&quot;, &quot;us&quot;) provides free online
              calculators and utility tools at toolsify.online. This policy
              explains what information we collect and how we use it.
            </p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              Tools run in your browser
            </h2>
            <p>
              Our tools process your input locally in your browser whenever
              possible. We do not store the data you enter into calculators,
              converters, or text tools on our servers. No account is required
              to use the tools.
            </p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              Analytics
            </h2>
            <p className="mb-sm">
              We use analytics services to understand how visitors use the
              site and to improve our tools:
            </p>
            <ul className="list-disc pl-lg space-y-xs">
              <li>
                <strong>PostHog</strong> — product analytics (page views, tool
                usage events, search queries). See{" "}
                <a
                  href="https://posthog.com/privacy"
                  className="text-primary-container hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  PostHog&apos;s privacy policy
                </a>
                .
              </li>
              <li>
                <strong>Google Analytics 4</strong> — aggregated traffic and
                usage statistics. See{" "}
                <a
                  href="https://policies.google.com/privacy"
                  className="text-primary-container hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google&apos;s privacy policy
                </a>
                .
              </li>
              <li>
                <strong>Vercel Analytics &amp; Speed Insights</strong> —
                anonymous performance and Web Vitals data.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              Advertising
            </h2>
            <p>
              We use <strong>Google AdSense</strong> to display advertisements.
              Google and its partners may use cookies and similar technologies
              to serve ads based on your visits to this and other websites. You
              can learn more at{" "}
              <a
                href="https://policies.google.com/technologies/ads"
                className="text-primary-container hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google&apos;s advertising policy
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              Accounts (optional)
            </h2>
            <p>
              If you create an account, authentication is handled by Clerk. We
              store favorites and usage history linked to your account to
              personalize your dashboard. See{" "}
              <a
                href="https://clerk.com/privacy"
                className="text-primary-container hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Clerk&apos;s privacy policy
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              Contact &amp; data requests
            </h2>
            <p>
              For privacy questions or to request deletion of data we hold about
              you, email{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-primary-container hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
              .
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
