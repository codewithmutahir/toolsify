"use client";

import { SignIn } from "@clerk/nextjs";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import { clerkAuthAppearance } from "@/lib/clerk-appearance";

export default function LocalizedSignIn() {
  const signInPath = useLocalizedPath("/sign-in");
  const signUpPath = useLocalizedPath("/sign-up");

  return (
    <SignIn
      appearance={clerkAuthAppearance}
      routing="path"
      path={signInPath}
      signUpUrl={signUpPath}
    />
  );
}
