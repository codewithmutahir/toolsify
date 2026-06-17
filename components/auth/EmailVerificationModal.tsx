"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OtpInput from "@/components/auth/OtpInput";
import { cn } from "@/lib/utils";

const RESEND_COOLDOWN_SECONDS = 45;

type EmailVerificationModalProps = {
  email: string;
  onVerify: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
  onGoBack: () => void;
};

function formatCountdown(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function EmailVerificationModal({
  email,
  onVerify,
  onResend,
  onGoBack,
}: EmailVerificationModalProps) {
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(
    Array.from({ length: 6 }, () => "")
  );
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN_SECONDS);

  const code = digits.join("");
  const canVerify = code.length === 6 && !isVerifying;
  const canResend = countdown === 0 && !isResending;

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = window.setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [countdown]);

  const handleVerify = useCallback(async () => {
    if (!canVerify) return;

    setIsVerifying(true);
    setError(null);

    try {
      await onVerify(code);
      router.push("/");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Invalid verification code. Please try again.";
      setError(message);
      setDigits(Array.from({ length: 6 }, () => ""));
    } finally {
      setIsVerifying(false);
    }
  }, [canVerify, code, onVerify, router]);

  const handleResend = useCallback(async () => {
    if (!canResend) return;

    setIsResending(true);
    setError(null);

    try {
      await onResend();
      setCountdown(RESEND_COOLDOWN_SECONDS);
      setDigits(Array.from({ length: 6 }, () => ""));
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Could not resend code. Please try again.";
      setError(message);
    } finally {
      setIsResending(false);
    }
  }, [canResend, onResend]);

  return (
    <div
      className="verification-modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-on-background/40 backdrop-blur-sm p-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="verify-email-title"
    >
      <div className="verification-modal-card bg-surface-container-lowest w-full max-w-[480px] rounded-xl shadow-xl p-lg sm:p-xl flex flex-col items-center text-center animate-fade-in my-auto overflow-visible">
        <div className="w-20 h-20 rounded-full bg-primary-fixed flex items-center justify-center mb-lg shrink-0">
          <span
            className="material-symbols-outlined text-[48px] text-primary leading-none"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            mark_email_unread
          </span>
        </div>

        <h1
          id="verify-email-title"
          className="font-h2 text-h2 text-on-surface mb-sm"
        >
          Check your email
        </h1>
        <p className="font-body text-body text-on-surface-variant mb-md px-sm">
          We sent a 6-digit verification code to{" "}
          <span className="font-bold text-on-surface break-all">{email}</span>
        </p>
        <p className="font-small text-small text-on-surface-variant mb-xl">
          Enter the code below to verify your account
        </p>

        <div className="w-full mb-md overflow-visible">
          <OtpInput
            value={digits}
            onChange={setDigits}
            disabled={isVerifying}
            error={!!error}
          />
        </div>

        {error && (
          <p className="font-small text-small text-error mb-lg w-full text-center">
            {error}
          </p>
        )}

        <button
          type="button"
          disabled={!canVerify || isVerifying}
          onClick={handleVerify}
          className={cn(
            "verification-modal-button w-full min-h-12 box-border",
            "bg-primary-container text-on-primary font-display font-bold text-body",
            "py-3 px-md rounded-lg mb-lg transition-all",
            "hover:brightness-110 active:scale-[0.98]",
            "disabled:cursor-not-allowed disabled:hover:brightness-100 disabled:active:scale-100",
            !canVerify || isVerifying
              ? "opacity-80"
              : "hover:opacity-95"
          )}
        >
          {isVerifying ? "Verifying..." : "Verify Email"}
        </button>

        <div className="flex flex-col items-center gap-xs mb-xl w-full">
          <p className="font-small text-small text-on-surface-variant">
            Didn&apos;t receive the code?
          </p>
          <div className="flex items-center gap-sm flex-wrap justify-center">
            <button
              type="button"
              disabled={!canResend}
              onClick={handleResend}
              className={cn(
                "text-primary font-semibold hover:underline min-h-6",
                !canResend && "opacity-50 cursor-not-allowed hover:no-underline"
              )}
            >
              {isResending ? "Sending..." : "Resend code"}
            </button>
            {countdown > 0 && (
              <>
                <span className="text-on-surface-variant/40">|</span>
                <span className="font-label text-label text-on-surface-variant bg-surface-container px-sm py-1 rounded-full whitespace-nowrap">
                  Resend in {formatCountdown(countdown)}
                </span>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onGoBack}
          className="font-small text-small text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center gap-xs min-h-6"
        >
          <span className="material-symbols-outlined text-[18px] leading-none">
            arrow_back
          </span>
          Wrong email? Go back
        </button>
      </div>
    </div>
  );
}
