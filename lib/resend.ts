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
  return (
    process.env.RESEND_FROM_EMAIL ?? "Toolsify <onboarding@resend.dev>"
  );
}
