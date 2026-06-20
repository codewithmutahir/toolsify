import type { Metadata } from "next";
import AuthBrandingPanelSignIn from "@/components/auth/AuthBrandingPanelSignIn";
import AuthMobileBranding from "@/components/auth/AuthMobileBranding";
import LocalizedSignIn from "@/components/auth/LocalizedSignIn";

export const metadata: Metadata = {
  title: "Sign In | Toolsify",
  description: "Sign in to your Toolsify account to save history and favorites.",
};

export default function SignInPage() {
  return (
    <main className="flex min-h-screen bg-surface">
      <AuthBrandingPanelSignIn />

      <section className="w-full lg:w-[60%] bg-surface-container-lowest flex items-center justify-center px-gutter py-xl overflow-y-auto">
        <div className="w-full max-w-[440px] flex flex-col py-md">
          <AuthMobileBranding variant="sign-in" />

          <header className="mb-xl">
            <h2 className="font-h2 text-h2 text-on-surface mb-xs">Welcome back</h2>
            <p className="font-body text-body text-on-surface-variant">
              Sign in to your account
            </p>
          </header>

          <div className="clerk-auth-form w-full overflow-visible">
            <LocalizedSignIn />
          </div>
        </div>
      </section>
    </main>
  );
}
