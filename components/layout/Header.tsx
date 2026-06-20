"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useState } from "react";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import AuthLinksFallback from "@/components/layout/AuthLinksFallback";
import ToolSearch from "@/components/search/ToolSearch";
import { cn } from "@/lib/utils";

const HeaderAuthSection = dynamic(
  () => import("@/components/layout/HeaderAuthSection"),
  { ssr: false, loading: () => <AuthLinksFallback /> }
);

export default function Header() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: t("home"), key: "home" },
    { href: "/tools", label: t("allTools"), key: "allTools" },
    { href: "/tools/categories", label: t("categories"), key: "categories" },
  ] as const;

  function isNavLinkActive(key: string, href: string) {
    if (key === "allTools") return pathname === "/tools";
    if (key === "categories") return pathname.startsWith("/tools/");
    return pathname === href;
  }

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-outline-variant shadow-sm">
      <div className="max-w-container-max mx-auto px-gutter py-sm flex items-center justify-between gap-md">
        <div className="flex items-center gap-xl min-w-0">
          <Link
            href="/"
            className="flex items-center gap-xs shrink-0 transition-transform active:scale-95"
          >
            <span
              className="material-symbols-outlined text-primary-container text-display"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              construction
            </span>
            <span className="font-h2 text-h2 font-bold text-primary">
              Toolsify
            </span>
          </Link>

          <ToolSearch
            variant="header"
            className="hidden md:block w-64 lg:w-96 shrink-0"
            enableShortcut
          />
        </div>

        <nav className="hidden md:flex items-center gap-lg">
          {navLinks.map((link) => {
            const isActive = isNavLinkActive(link.key, link.href);
            return (
              <Link
                key={link.key}
                href={link.href}
                className={cn(
                  "font-body text-body transition-colors duration-200",
                  isActive
                    ? "text-primary font-bold border-b-2 border-primary pb-1"
                    : "text-on-surface-variant hover:text-primary"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-md shrink-0">
          <LanguageSwitcher variant="compact" className="hidden lg:flex" />
          <HeaderAuthSection />

          <button
            type="button"
            className="md:hidden p-sm text-on-surface"
            aria-label={
              mobileOpen ? tCommon("closeMenu") : tCommon("openMenu")
            }
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span className="material-symbols-outlined">
              {mobileOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      <div
        className={cn(
          "md:hidden border-t border-outline-variant bg-surface overflow-hidden transition-all",
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="flex flex-col px-gutter py-md gap-md">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className="font-body text-body text-on-surface-variant hover:text-primary transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <LanguageSwitcher />
          <ToolSearch
            variant="header"
            onNavigate={() => setMobileOpen(false)}
          />
        </nav>
      </div>
    </header>
  );
}
