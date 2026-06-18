import Link from "next/link";
import RequestToolCta from "@/components/tools/RequestToolCta";
import { categories } from "@/constants/categories";
import { getFeaturedTools, getImplementedTools } from "@/constants/tools";

const toolLinks = getFeaturedTools().map((tool) => ({
  href: `/${tool.slug}`,
  label: tool.title,
}));

const categoryLinks = categories
  .filter((category) =>
    getImplementedTools().some((tool) => tool.category === category.slug)
  )
  .map((category) => ({
    href: `/tools/${category.slug}`,
    label: category.title,
  }));

const companyLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/contact", label: "Contact Us" },
];

const socialLinks = [
  { href: "https://twitter.com", label: "Twitter", icon: "share" },
  { href: "https://github.com", label: "GitHub", icon: "code" },
  { href: "https://linkedin.com", label: "LinkedIn", icon: "work" },
];

export default function Footer() {
  return (
    <footer className="bg-on-background text-on-secondary">
      <div className="max-w-container-max mx-auto px-gutter py-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-xl">
          {/* Logo + desc + socials */}
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
              Free online calculators, converters, and utility tools. Fast,
              accurate, and no signup required.
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

          {/* Tools + category links */}
          <div>
            <h3 className="font-h3 text-h3 text-on-secondary mb-md">Tools</h3>
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
                  Categories
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

          {/* Company links */}
          <div>
            <h3 className="font-h3 text-h3 text-on-secondary mb-md">Company</h3>
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
            description="Suggest tools we should add to Toolsify."
          />
        </div>

        {/* Bottom bar */}
        <div className="mt-2xl pt-lg border-t border-outline-variant/30 flex flex-col sm:flex-row justify-between items-center gap-md">
          <p className="font-small text-small text-surface-variant">
            © {new Date().getFullYear()} Toolsify. All rights reserved.
          </p>
          <p className="font-small text-small text-surface-variant">
            Built for speed, clarity, and professional reliability.
          </p>
        </div>
      </div>
    </footer>
  );
}
