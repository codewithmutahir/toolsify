import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import RequestToolCta from "@/components/tools/RequestToolCta";
import { categories } from "@/constants/categories";
import { getFeaturedTools, getImplementedTools } from "@/constants/tools";
import { getLocalizedTools } from "@/lib/i18n/server";
import { localizeCategories } from "@/lib/i18n/localize";
import { getMessages } from "next-intl/server";

export default async function Footer() {
  const t = await getTranslations("footer");
  const tCommon = await getTranslations("common");

  const featuredTools = await getLocalizedTools(getFeaturedTools());
  const toolLinks = featuredTools.map((tool) => ({
    href: `/${tool.slug}`,
    label: tool.title,
  }));

  const messages = await getMessages();
  const localizedCategories = localizeCategories(categories, messages);

  const categoryLinks = localizedCategories
    .filter((category) =>
      getImplementedTools().some((tool) => tool.category === category.slug)
    )
    .map((category) => ({
      href: `/tools/${category.slug}`,
      label: category.title,
    }));

  const companyLinks = [
    { href: "/about", label: t("aboutUs") },
    { href: "/author", label: t("author") },
    { href: "/contact", label: t("contactUs") },
    { href: "/privacy-policy", label: t("privacyPolicy") },
    { href: "/cookie-policy", label: t("cookiePolicy") },
    { href: "/terms", label: t("termsOfService") },
    { href: "/disclaimer", label: t("disclaimer") },
  ];

  const socialLinks = [
    { href: "https://twitter.com", label: "Twitter", icon: "share" },
    { href: "https://github.com", label: "GitHub", icon: "code" },
    { href: "https://linkedin.com", label: "LinkedIn", icon: "work" },
  ];

  return (
    <footer className="bg-on-background text-on-secondary">
      <div className="max-w-container-max mx-auto px-gutter py-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-xl">
          <div>
            <Link href="/" className="flex items-center gap-sm">
              <span
                className="material-symbols-outlined text-primary-fixed-dim text-2xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                construction
              </span>
              <span className="font-h2 text-h2 font-bold text-primary-fixed-dim">
                Toolsify
              </span>
            </Link>
            <p className="mt-md font-small text-small text-surface-variant">
              {t("description")}
            </p>
            <div className="mt-md flex gap-md">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-surface-variant hover:text-primary-container transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-h3 text-h3 text-on-secondary mb-md">
              {t("tools")}
            </h3>
            <ul className="space-y-sm">
              {toolLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-small text-small text-surface-variant hover:text-primary-container transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            {categoryLinks.length > 0 && (
              <>
                <h3 className="font-h3 text-h3 text-on-secondary mb-md mt-lg">
                  {t("categories")}
                </h3>
                <ul className="space-y-sm">
                  {categoryLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="font-small text-small text-surface-variant hover:text-primary-container transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <div>
            <h3 className="font-h3 text-h3 text-on-secondary mb-md">
              {t("company")}
            </h3>
            <ul className="space-y-sm">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-small text-small text-surface-variant hover:text-primary-container transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <RequestToolCta
            variant="compact"
            description={t("requestToolDescription")}
          />
        </div>

        <div className="mt-2xl pt-lg border-t border-outline-variant/30 flex flex-col sm:flex-row justify-between items-center gap-md">
          <p className="font-small text-small text-surface-variant">
            © {new Date().getFullYear()} Toolsify. {tCommon("allRightsReserved")}
          </p>
          <p className="font-small text-small text-surface-variant">
            {tCommon("builtFor")}
          </p>
        </div>
      </div>
    </footer>
  );
}
