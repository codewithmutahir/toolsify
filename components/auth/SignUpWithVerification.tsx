"use client";

import { SignUp } from "@clerk/nextjs";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import AuthBrandingPanelSignUp from "@/components/auth/AuthBrandingPanelSignUp";
import AuthMobileBranding from "@/components/auth/AuthMobileBranding";
import EmailVerificationModal from "@/components/auth/EmailVerificationModal";
import { clerkSignUpAppearance } from "@/lib/clerk-appearance";
import { cn } from "@/lib/utils";

function getClerkErrorMessage(err: unknown): string {
  if (
    err &&
    typeof err === "object" &&
    "errors" in err &&
    Array.isArray((err as { errors: { message?: string }[] }).errors)
  ) {
    const first = (err as { errors: { message?: string }[] }).errors[0];
    if (first?.message) return first.message;
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong. Please try again.";
}

export default function SignUpWithVerification() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [previewVerify, setPreviewVerify] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      setPreviewVerify(
        new URLSearchParams(window.location.search).get("preview") === "verify"
      );
    }
  }, []);

  const needsEmailVerification = useMemo(() => {
    if (previewVerify) return true;
    if (!isLoaded || !signUp) return false;
    return (
      signUp.status === "missing_requirements" &&
      signUp.unverifiedFields.includes("email_address")
    );
  }, [isLoaded, previewVerify, signUp]);

  const email = previewVerify
    ? "preview@example.com"
    : (signUp?.emailAddress ?? "");

  const handleVerify = useCallback(
    async (code: string) => {
      if (previewVerify) return;

      if (!signUp || !setActive) {
        throw new Error("Sign up session expired. Please try again.");
      }

      try {
        const result = await signUp.attemptEmailAddressVerification({ code });

        if (result.status === "complete") {
          await setActive({ session: result.createdSessionId });
          return;
        }

        throw new Error("Verification incomplete. Please check your code.");
      } catch (err) {
        throw new Error(getClerkErrorMessage(err));
      }
    },
    [previewVerify, setActive, signUp]
  );

  const handleResend = useCallback(async () => {
    if (previewVerify) return;

    if (!signUp) {
      throw new Error("Sign up session expired. Please try again.");
    }

    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
    } catch (err) {
      throw new Error(getClerkErrorMessage(err));
    }
  }, [previewVerify, signUp]);

  const handleGoBack = useCallback(() => {
    router.push("/sign-in");
  }, [router]);

  return (
    <main className="relative flex w-full min-h-screen bg-surface">
      <div
        className={cn(
          "flex w-full min-h-screen transition-all duration-300",
          needsEmailVerification &&
            "blur-md grayscale-[0.2] opacity-40 pointer-events-none"
        )}
      >
        <AuthBrandingPanelSignUp />

        <section className="w-full lg:w-[60%] bg-surface-container-lowest flex flex-col items-center justify-center p-lg md:p-2xl overflow-y-auto">
          <div className="w-full max-w-[480px] py-md">
            <AuthMobileBranding variant="sign-up" />

            {!needsEmailVerification && (
              <header className="mb-xl">
                <h2 className="font-h2 text-h2 text-on-surface mb-xs">
                  Create your account
                </h2>
                <p className="font-body text-on-surface-variant">
                  Start using 50+ free tools today
                </p>
              </header>
            )}

            <div
              className={cn(
                "clerk-auth-form w-full overflow-visible",
                needsEmailVerification &&
                  "sr-only absolute w-px h-px overflow-hidden opacity-0"
              )}
              aria-hidden={needsEmailVerification}
            >
              <SignUp
                appearance={clerkSignUpAppearance}
                routing="path"
                path="/sign-up"
                signInUrl="/sign-in"
              />
            </div>
          </div>
        </section>
      </div>

      {needsEmailVerification && (
        <EmailVerificationModal
          email={email || "your email address"}
          onVerify={handleVerify}
          onResend={handleResend}
          onGoBack={handleGoBack}
        />
      )}
    </main>
  );
}
