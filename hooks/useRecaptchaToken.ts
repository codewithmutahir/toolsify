"use client";

import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { isRecaptchaEnabledClient } from "@/lib/recaptcha-config";

export function useRecaptchaToken() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const isEnabled = isRecaptchaEnabledClient();

  async function getToken(action: string): Promise<string | null> {
    if (!isEnabled) {
      return null;
    }

    if (!executeRecaptcha) {
      throw new Error("reCAPTCHA not ready");
    }

    return executeRecaptcha(action);
  }

  return { getToken, isEnabled };
}
