import { isRecaptchaEnabledClient } from "@/lib/recaptcha-config";

export default function RecaptchaNotice() {
  if (!isRecaptchaEnabledClient()) {
    return null;
  }

  return (
    <p className="font-small text-small text-on-surface-variant">
      This site is protected by reCAPTCHA and the Google{" "}
      <a
        href="https://policies.google.com/privacy"
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary-container hover:underline"
      >
        Privacy Policy
      </a>{" "}
      and{" "}
      <a
        href="https://policies.google.com/terms"
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary-container hover:underline"
      >
        Terms of Service
      </a>{" "}
      apply.
    </p>
  );
}
