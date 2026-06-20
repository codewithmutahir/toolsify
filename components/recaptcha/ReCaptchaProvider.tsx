"use client";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { getRecaptchaSiteKey } from "@/lib/recaptcha-config";

export default function ReCaptchaProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteKey = getRecaptchaSiteKey();

  if (!siteKey) {
    return <>{children}</>;
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={siteKey}
      scriptProps={{ async: true, defer: true, appendTo: "head" }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}
