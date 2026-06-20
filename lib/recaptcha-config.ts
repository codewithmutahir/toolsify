export function getRecaptchaSiteKey() {
  return process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim() || null;
}

/** Google reCAPTCHA does not support localhost as a registered domain. */
export function isLocalRecaptchaHost(hostname?: string) {
  const host =
    hostname ??
    (typeof window !== "undefined" ? window.location.hostname : "");
  return host === "localhost" || host === "127.0.0.1";
}

export function shouldSkipRecaptcha(hostname?: string) {
  if (process.env.NODE_ENV !== "development") {
    return false;
  }

  if (hostname) {
    return isLocalRecaptchaHost(hostname);
  }

  if (typeof window !== "undefined") {
    return isLocalRecaptchaHost();
  }

  return false;
}

export function isRecaptchaEnabledClient() {
  if (shouldSkipRecaptcha()) {
    return false;
  }

  return Boolean(getRecaptchaSiteKey());
}
