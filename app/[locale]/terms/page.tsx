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
    "/terms",
    "terms"
  );
}

const LAST_UPDATED = "June 18, 2026";

export default function TermsPage({ params }: PageProps) {
  setRequestLocale(params.locale);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-gutter py-2xl">
        <h1 className="font-h1 text-h1 text-on-surface mb-md">
          Terms of Service
        </h1>
        <p className="font-small text-small text-on-surface-variant mb-xl">
          Last updated: {LAST_UPDATED}
        </p>

        <div className="space-y-lg font-body text-body text-on-surface-variant">
          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              Acceptance
            </h2>
            <p>
              By using Toolsify at toolsify.online, you agree to these terms.
              If you do not agree, please do not use the site.
            </p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              Use of tools
            </h2>
            <p>
              Toolsify provides free online calculators, converters, and
              utilities for personal and professional use. You may use the site
              for lawful purposes and in accordance with fair use. Do not
              attempt to disrupt the service, scrape at scale, or misuse our
              infrastructure.
            </p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              Accuracy disclaimer
            </h2>
            <p>
              We strive for accurate results, but tools are provided for
              informational purposes only. Results may contain errors or
              rounding differences. Do not rely on Toolsify for medical, legal,
              financial, or safety-critical decisions without independent
              verification from a qualified professional.
            </p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              No warranty
            </h2>
            <p>
              The site and all tools are provided &quot;as is&quot; without
              warranties of any kind, express or implied, including but not
              limited to merchantability, fitness for a particular purpose, or
              non-infringement.
            </p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              Limitation of liability
            </h2>
            <p>
              To the fullest extent permitted by law, Toolsify and its operators
              shall not be liable for any indirect, incidental, special, or
              consequential damages arising from your use of the site or reliance
              on tool outputs.
            </p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              Changes
            </h2>
            <p>
              We may update these terms from time to time. Continued use after
              changes constitutes acceptance of the revised terms.
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
