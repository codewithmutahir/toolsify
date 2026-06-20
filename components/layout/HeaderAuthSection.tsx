"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import AppUserButton from "@/components/auth/AppUserButton";

export default function HeaderAuthSection() {
  const t = useTranslations("nav");

  return (
    <>
      <SignedOut>
        <Link
          href="/sign-in"
          className="font-body text-body text-on-surface-variant hover:text-primary font-medium px-md py-sm"
        >
          {t("logIn")}
        </Link>
        <Link
          href="/sign-up"
          className="bg-primary-container text-on-primary font-bold px-lg py-sm rounded-lg hover:brightness-110 active:scale-95 transition-all"
        >
          {t("signUp")}
        </Link>
      </SignedOut>

      <SignedIn>
        <Link
          href="/dashboard"
          className="hidden lg:block font-body text-body text-on-surface-variant hover:text-primary font-medium px-sm py-sm"
        >
          {t("dashboard")}
        </Link>
        <AppUserButton />
      </SignedIn>
    </>
  );
}
