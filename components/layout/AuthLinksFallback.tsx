"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function AuthLinksFallback() {
  const t = useTranslations("nav");

  return (
    <>
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
    </>
  );
}
