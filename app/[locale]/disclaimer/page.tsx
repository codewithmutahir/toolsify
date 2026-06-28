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
    "/disclaimer",
    "disclaimer"
  );
}

const LAST_UPDATED = "June 28, 2026";

export default function DisclaimerPage({ params }: PageProps) {
  setRequestLocale(params.locale);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-gutter py-2xl">
        <h1 className="font-h1 text-h1 text-on-surface mb-md">Disclaimer</h1>
        <p className="font-small text-small text-on-surface-variant mb-xl">
          Last updated: {LAST_UPDATED}
        </p>

        <div className="prose prose-neutral max-w-none space-y-lg font-body text-body text-on-surface-variant">
          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              General information only
            </h2>
            <p>
              The information, outputs, and results provided by Toolsify at
              toolsify.online are for general informational and educational
              purposes only. By using any tool on this website, you acknowledge
              and agree to the terms outlined on this page.
            </p>
            <p>
              Nothing on Toolsify constitutes professional, medical, legal,
              financial, tax, engineering, or safety advice. Always consult a
              qualified professional before making decisions that could affect
              your health, finances, legal rights, or safety.
            </p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              No guarantee of accuracy
            </h2>
            <p>
              We work hard to keep our digital tools accurate and up to date.
              Tools are built on established standards and tested against known
              reference values. However, errors, omissions, rounding
              differences, and outdated information can occur.
            </p>
            <p>
              Results may vary based on the data you enter, browser
              limitations, or changes in standards and regulations. Do not
              rely solely on Toolsify outputs for critical, high-stakes, or
              compliance-related decisions without independent verification.
            </p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              Use at your own risk
            </h2>
            <p>
              You use Toolsify and its tools entirely at your own risk. We are
              not responsible for any loss, damage, or consequence arising from
              your use of the site or reliance on any result, including but not
              limited to:
            </p>
            <ul className="list-disc pl-lg space-y-xs">
              <li>Financial losses or miscalculated budgets</li>
              <li>Health or wellness decisions based on tool outputs</li>
              <li>Legal or contractual outcomes</li>
              <li>Data loss from file processing tools</li>
              <li>Business, academic, or professional decisions</li>
            </ul>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              No professional relationship
            </h2>
            <p>
              Using Toolsify does not create any professional, advisory, or
              fiduciary relationship between you and Toolsify or its operator.
              Our tools are self-service utilities, not personalized
              consultations or certified assessments.
            </p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              Health and wellness tools
            </h2>
            <p>
              Health and wellness tools on Toolsify provide general estimates
              only. They do not diagnose conditions, prescribe treatment, or
              replace advice from a doctor, dietitian, or other healthcare
              provider. Individual circumstances vary—always seek professional
              guidance for health-related decisions.
            </p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              Financial and legal tools
            </h2>
            <p>
              Financial and legal tools produce approximations based on the
              inputs and assumptions you provide. They do not account for every
              fee, regulation, or market condition. For financial planning, tax
              filing, or legal matters, consult a licensed accountant, financial
              advisor, or attorney in your jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              File and data processing tools
            </h2>
            <p>
              Document, media, and data processing tools operate according to
              their design. While many operations run locally in your browser,
              we cannot guarantee that processed files will meet your specific
              requirements or that no data loss will occur. Always keep backups
              of important files before processing them.
            </p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              External links
            </h2>
            <p>
              Toolsify may contain links to third-party websites or services.
              We do not control and are not responsible for the content,
              accuracy, or privacy practices of those external sites. Following
              a link is at your own discretion and risk.
            </p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              No warranty
            </h2>
            <p>
              Toolsify and all tools are provided &quot;as is&quot; and
              &quot;as available&quot; without warranties of any kind, whether
              express or implied, including but not limited to warranties of
              merchantability, fitness for a particular purpose, accuracy, or
              non-infringement.
            </p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              Limitation of liability
            </h2>
            <p>
              To the fullest extent permitted by applicable law, Toolsify and
              its operator shall not be liable for any direct, indirect,
              incidental, special, consequential, or punitive damages arising
              from your access to or use of the site, even if we have been
              advised of the possibility of such damages.
            </p>
            <p>
              For additional legal terms, see our{" "}
              <Link
                href="/terms"
                className="text-primary-container hover:underline"
              >
                Terms of Service
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              Reporting issues
            </h2>
            <p>
              If you find an error in a tool or believe a result is incorrect,
              please let us know. User reports help us fix bugs and improve
              accuracy for everyone.{" "}
              <Link
                href="/contact"
                className="text-primary-container hover:underline"
              >
                Contact us
              </Link>{" "}
              with a description of the issue, your inputs, and the unexpected
              result.
            </p>
          </section>

          <section>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              Changes to this disclaimer
            </h2>
            <p>
              We may update this disclaimer from time to time. The &quot;Last
              updated&quot; date at the top reflects the most recent revision.
              Continued use of Toolsify after changes constitutes acceptance of
              the updated disclaimer.
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
