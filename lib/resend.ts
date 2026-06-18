import { Resend } from "resend";

export function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export function getContactEmail() {
  return process.env.CONTACT_EMAIL ?? null;
}

export function getResendFromAddress() {
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (process.env.NODE_ENV === "production" && !fromEmail) {
    throw new Error(
      "RESEND_FROM_EMAIL must be set in production. The onboarding@resend.dev domain is only available in non-production environments."
    );
  }

  return fromEmail ?? "Toolsify <onboarding@resend.dev>";
}
