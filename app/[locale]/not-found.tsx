import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("common");
  const tNav = await getTranslations("nav");

  return (
    <main className="min-h-screen flex items-center justify-center px-gutter">
      <div className="text-center max-w-md">
        <span
          className="material-symbols-outlined text-primary-container text-[80px] mb-lg block"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          search_off
        </span>
        <h1 className="font-h1 text-h1 text-on-surface mb-md">
          {t("notFoundTitle")}
        </h1>
        <p className="font-body text-body text-on-surface-variant mb-xl">
          {t("notFoundDescription")}
        </p>
        <Link
          href="/tools"
          className="inline-flex items-center gap-sm bg-primary-container text-on-primary px-xl py-md rounded-lg font-label font-bold hover:opacity-90 active:scale-95 transition-all"
        >
          {tNav("allTools")}
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
      </div>
    </main>
  );
}
