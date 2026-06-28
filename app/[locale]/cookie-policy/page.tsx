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
    "/cookie-policy",
    "cookies"
  );
}

const LAST_UPDATED = "June 28, 2026";

export default function CookiePolicyPage({ params }: PageProps) {
  setRequestLocale(params.locale);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-gutter py-2xl">
        <h1 className="font-h1 text-h1 text-on-surface mb-md">Cookie Policy</h1>
        <p className="font-small text-small text-on-surface-variant mb-xl">
          Last updated: {LAST_UPDATED}
        </p>

        <div className="prose prose-neutral max-w-none space-y-lg font-body text-body text-on-surface-variant">
          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              Overview
            </h2>
            <p>
              This Cookie Policy explains how Toolsify (&quot;we&quot;,
              &quot;us&quot;) uses cookies and similar technologies when you
              visit toolsify.online. It should be read alongside our{" "}
              <Link
                href="/privacy-policy"
                className="text-primary-container hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </p>
            <p>
              Cookies are small text files stored on your device when you visit
              a website. They help the site remember your preferences, keep
              sessions secure, and understand how the site is used.
            </p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              How Toolsify uses cookies
            </h2>
            <p>
              We use cookies for three main purposes: to make the site work
              properly, to understand how visitors use our tools, and to
              display relevant advertisements that help keep Toolsify free.
            </p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              Types of cookies we use
            </h2>

            <h3 className="font-h3 text-h3 text-on-surface mb-xs mt-md">
              Essential cookies
            </h3>
            <p>
              These cookies are necessary for the website to function. They
              enable core features such as language preference and secure
              sign-in. Without them, parts of the site may not work correctly.
            </p>
            <ul className="list-disc pl-lg space-y-xs">
              <li>
                <strong>Language preference</strong> — remembers your selected
                locale (e.g. English, Urdu, Spanish) so you do not have to
                choose it on every visit
              </li>
              <li>
                <strong>Authentication</strong> — if you create an optional
                account, session cookies managed by Clerk keep you signed in
                securely
              </li>
            </ul>

            <h3 className="font-h3 text-h3 text-on-surface mb-xs mt-md">
              Analytics cookies
            </h3>
            <p>
              These cookies help us understand how visitors interact with
              Toolsify—which tools are popular, where users encounter issues,
              and how we can improve performance. Data is generally aggregated
              and does not identify you personally.
            </p>
            <ul className="list-disc pl-lg space-y-xs">
              <li>
                <strong>PostHog</strong> — product analytics (page views, tool
                usage events). See{" "}
                <a
                  href="https://posthog.com/privacy"
                  className="text-primary-container hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  PostHog&apos;s privacy policy
                </a>
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
              </li>
              <li>
                <strong>Vercel Analytics &amp; Speed Insights</strong> —
                anonymous performance and Core Web Vitals data
              </li>
            </ul>

            <h3 className="font-h3 text-h3 text-on-surface mb-xs mt-md">
              Advertising cookies
            </h3>
            <p>
              We use <strong>Google AdSense</strong> to display advertisements.
              Google and its advertising partners may set cookies to serve ads
              based on your visits to this site and other websites, measure ad
              performance, and prevent fraud.
            </p>
            <p>
              Learn more at{" "}
              <a
                href="https://policies.google.com/technologies/ads"
                className="text-primary-container hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google&apos;s advertising policy
              </a>{" "}
              and{" "}
              <a
                href="https://www.google.com/settings/ads"
                className="text-primary-container hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Ads Settings
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              Third-party cookies
            </h2>
            <p>
              Some cookies are placed by third-party services that appear on our
              pages. We do not control these cookies directly. Third parties
              include:
            </p>
            <ul className="list-disc pl-lg space-y-xs">
              <li>Google (Analytics, AdSense, reCAPTCHA where applicable)</li>
              <li>PostHog (analytics)</li>
              <li>Clerk (authentication, for optional accounts)</li>
              <li>Vercel (hosting analytics and performance monitoring)</li>
            </ul>
            <p>
              Each provider has its own privacy and cookie policies. We
              encourage you to review them if you want more detail on how your
              data is handled.
            </p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              Cookies and your tool data
            </h2>
            <p>
              Cookies used on Toolsify are separate from the data you enter into
              our digital tools. Most tools process your input locally in your
              browser. Analytics cookies may record which tool you used, but not
              the specific values or files you submitted.
            </p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              Managing your cookie preferences
            </h2>
            <p>You can control cookies in several ways:</p>
            <ul className="list-disc pl-lg space-y-xs">
              <li>
                <strong>Browser settings</strong> — most browsers let you block
                or delete cookies. Check your browser&apos;s help section for
                instructions
              </li>
              <li>
                <strong>Google Ads personalization</strong> — opt out of
                personalized advertising via{" "}
                <a
                  href="https://www.google.com/settings/ads"
                  className="text-primary-container hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Ads Settings
                </a>
              </li>
              <li>
                <strong>Industry opt-out tools</strong> — visit{" "}
                <a
                  href="https://optout.aboutads.info"
                  className="text-primary-container hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  aboutads.info
                </a>{" "}
                or{" "}
                <a
                  href="https://www.youronlinechoices.eu"
                  className="text-primary-container hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  youronlinechoices.eu
                </a>{" "}
                for additional options
              </li>
            </ul>
            <p>
              Blocking all cookies may affect site functionality, including
              language preferences and optional account features.
            </p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              Changes to this policy
            </h2>
            <p>
              We may update this Cookie Policy when we add new services or when
              legal requirements change. The &quot;Last updated&quot; date at
              the top of this page reflects the most recent revision.
              Continued use of Toolsify after changes constitutes acceptance of
              the updated policy.
            </p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">Contact</h2>
            <p>
              Questions about cookies or this policy? Email us at{" "}
              <a
                href="mailto:privacy@toolsify.online"
                className="text-primary-container hover:underline"
              >
                privacy@toolsify.online
              </a>{" "}
              or visit our{" "}
              <Link
                href="/contact"
                className="text-primary-container hover:underline"
              >
                contact page
              </Link>
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
