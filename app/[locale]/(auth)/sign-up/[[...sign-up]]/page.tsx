import type { Metadata } from "next";
import SignUpWithVerification from "@/components/auth/SignUpWithVerification";
import { NOINDEX_METADATA } from "@/lib/seo/noindex";

export const metadata: Metadata = {
  ...NOINDEX_METADATA,
  title: "Sign Up | Toolsify",
  description:
    "Create your free Toolsify account and start using 50+ online tools today.",
};

export default function SignUpPage() {
  return <SignUpWithVerification />;
}
