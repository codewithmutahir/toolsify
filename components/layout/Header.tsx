"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import AppUserButton from "@/components/auth/AppUserButton";
import ToolSearch from "@/components/search/ToolSearch";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/tools", label: "All Tools" },
  { href: "/tools/categories", label: "Categories" },
  { href: "/pricing", label: "Pricing" },
] as const;

function isNavLinkActive(pathname: string, label: string, href: string) {
  if (label === "All Tools") return pathname === "/tools";
  if (label === "Categories") return pathname.startsWith("/tools/");
  return pathname === href;
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-outline-variant shadow-sm">
      <div className="max-w-container-max mx-auto px-gutter py-sm flex items-center justify-between gap-md">
        {/* Logo + Search (left) */}
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
            <span className="font-h2 text-h2 font-bold text-primary">Toolsify</span>
          </Link>

          <ToolSearch
            variant="header"
            className="hidden md:block w-64 lg:w-96 shrink-0"
            enableShortcut
          />
        </div>

        {/* Desktop Nav (center) */}
        <nav className="hidden md:flex items-center gap-lg">
          {navLinks.map((link) => {
            const isActive = isNavLinkActive(pathname, link.label, link.href);
            return (
              <Link
                key={link.label}
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

        {/* Auth (right) */}
        <div className="flex items-center gap-md shrink-0">
          <SignedOut>
            <Link
              href="/sign-in"
              className="hidden sm:block font-body text-body text-on-surface-variant hover:text-primary font-medium px-md py-sm"
            >
              Log In
            </Link>
            <Link
              href="/sign-up"
              className="bg-primary-container text-on-primary font-bold px-lg py-sm rounded-lg hover:brightness-110 active:scale-95 transition-all"
            >
              Sign Up
            </Link>
          </SignedOut>

          <SignedIn>
            <Link
              href="/dashboard"
              className="hidden lg:block font-body text-body text-on-surface-variant hover:text-primary font-medium px-sm py-sm"
            >
              Dashboard
            </Link>
            <AppUserButton />
          </SignedIn>

          <button
            type="button"
            className="md:hidden p-sm text-on-surface"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span className="material-symbols-outlined">
              {mobileOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden border-t border-outline-variant bg-surface overflow-hidden transition-all",
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="flex flex-col px-gutter py-md gap-md">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-body text-body text-on-surface-variant hover:text-primary transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <ToolSearch
            variant="header"
            onNavigate={() => setMobileOpen(false)}
          />
          <SignedIn>
            <Link
              href="/dashboard"
              className="font-body text-body text-primary font-semibold hover:underline transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Dashboard
            </Link>
          </SignedIn>
          <SignedOut>
            <Link
              href="/sign-in"
              className="font-body text-body text-on-surface-variant hover:text-primary transition-colors sm:hidden"
              onClick={() => setMobileOpen(false)}
            >
              Log In
            </Link>
            <Link
              href="/sign-up"
              className="font-body text-body text-primary font-semibold hover:underline transition-colors sm:hidden"
              onClick={() => setMobileOpen(false)}
            >
              Sign Up
            </Link>
          </SignedOut>
        </nav>
      </div>
    </header>
  );
}
