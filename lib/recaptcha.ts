const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

import { shouldSkipRecaptcha } from "@/lib/recaptcha-config";

type RecaptchaVerifyResponse = {
  success: boolean;
  score?: number;
  action?: string;
  "error-codes"?: string[];
};

export function isRecaptchaEnabled() {
  return Boolean(process.env.RECAPTCHA_SECRET_KEY?.trim());
}

export async function verifyRecaptchaToken(
  token: string | null | undefined,
  expectedAction: string,
  hostname?: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (shouldSkipRecaptcha(hostname)) {
    return { ok: true };
  }

  const secret = process.env.RECAPTCHA_SECRET_KEY?.trim();

  if (!secret) {
    return { ok: true };
  }

  if (!token?.trim()) {
    return { ok: false, error: "Captcha verification required" };
  }

  const minScore = Number(process.env.RECAPTCHA_MIN_SCORE ?? "0.5");

  const response = await fetch(RECAPTCHA_VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret,
      response: token,
    }),
  });

  const data = (await response.json()) as RecaptchaVerifyResponse;

  if (!data.success) {
    return { ok: false, error: "Captcha verification failed" };
  }

  if (data.action !== expectedAction) {
    return { ok: false, error: "Captcha verification failed" };
  }

  const score = data.score ?? 0;
  if (score < minScore) {
    return { ok: false, error: "Captcha verification failed" };
  }

  return { ok: true };
}
