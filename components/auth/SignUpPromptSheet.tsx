"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type SignUpPromptSheetProps = {
  open: boolean;
  onDismiss: () => void;
};

const benefitKeys = [
  { key: "earlyAccess", icon: "rocket_launch" },
  { key: "requestTools", icon: "lightbulb" },
  { key: "favorites", icon: "bookmark" },
] as const;

export default function SignUpPromptSheet({
  open,
  onDismiss,
}: SignUpPromptSheetProps) {
  const t = useTranslations("signUpPrompt");
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const FOCUSABLE_SELECTOR =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const panel = panelRef.current;
    const focusableElements = panel?.querySelectorAll<HTMLElement>(
      FOCUSABLE_SELECTOR
    );
    focusableElements?.[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onDismiss();
        return;
      }

      if (event.key !== "Tab" || !panel) return;

      const focusable = panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [open, onDismiss]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-on-background/40 backdrop-blur-sm p-0 md:p-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="signup-prompt-title"
      onClick={onDismiss}
    >
      <div
        ref={panelRef}
        className={cn(
          "relative bg-surface-container-lowest w-full md:max-w-[520px]",
          "rounded-t-2xl md:rounded-2xl shadow-xl",
          "p-lg sm:p-xl flex flex-col",
          "animate-signup-sheet md:animate-fade-in",
          "max-h-[90vh] overflow-y-auto"
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="md:hidden w-10 h-1 rounded-full bg-outline-variant/60 mx-auto mb-lg shrink-0" />

        <button
          type="button"
          onClick={onDismiss}
          className="absolute top-md right-md md:top-lg md:right-lg w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
          aria-label={t("dismiss")}
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="flex items-start gap-md mb-lg pr-8">
          <div className="w-14 h-14 rounded-2xl bg-primary-fixed flex items-center justify-center shrink-0">
            <span
              className="material-symbols-outlined text-[32px] text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
              aria-hidden="true"
            >
              construction
            </span>
          </div>
          <div>
            <h2
              id="signup-prompt-title"
              className="font-h2 text-h2 text-on-surface mb-xs"
            >
              {t("title")}
            </h2>
            <p className="font-body text-body text-on-surface-variant">
              {t("subtitle")}
            </p>
          </div>
        </div>

        <ul className="flex flex-col gap-sm mb-xl">
          {benefitKeys.map((benefit) => {
            const badge = t.has(`benefits.${benefit.key}.badge`)
              ? t(`benefits.${benefit.key}.badge`)
              : null;

            return (
              <li
                key={benefit.key}
                className="flex items-start gap-md rounded-xl bg-surface-container-low p-md border border-outline-variant/40"
              >
                <span
                  className="material-symbols-outlined text-primary-container text-[22px] mt-0.5 shrink-0"
                  aria-hidden="true"
                >
                  {benefit.icon}
                </span>
                <div className="min-w-0 text-start">
                  <div className="flex items-center gap-sm flex-wrap mb-0.5">
                    <p className="font-body text-body font-semibold text-on-surface">
                      {t(`benefits.${benefit.key}.title`)}
                    </p>
                    {badge && (
                      <span className="font-label text-[10px] font-bold uppercase tracking-wider px-sm py-0.5 rounded-full bg-primary-fixed text-primary">
                        {badge}
                      </span>
                    )}
                  </div>
                  <p className="font-small text-small text-on-surface-variant">
                    {t(`benefits.${benefit.key}.description`)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="flex flex-col gap-sm">
          <Link
            href="/sign-up"
            className={cn(
              "w-full min-h-12 flex items-center justify-center",
              "bg-primary-container text-on-primary font-display font-bold text-body",
              "rounded-lg transition-all hover:brightness-110 active:scale-[0.98]"
            )}
          >
            {t("createAccount")}
          </Link>
          <Link
            href="/sign-in"
            className={cn(
              "w-full min-h-12 flex items-center justify-center",
              "border border-outline-variant text-on-surface font-semibold text-body",
              "rounded-lg transition-all hover:bg-surface-container-low active:scale-[0.98]"
            )}
          >
            {t("signIn")}
          </Link>
          <button
            type="button"
            onClick={onDismiss}
            className="w-full min-h-10 font-small text-small text-on-surface-variant hover:text-primary transition-colors"
          >
            {t("notNow")}
          </button>
        </div>
      </div>
    </div>
  );
}
