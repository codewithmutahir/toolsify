import type { Metadata } from "next";
import SignUpWithVerification from "@/components/auth/SignUpWithVerification";

export const metadata: Metadata = {
  title: "Sign Up | Toolsify",
  description:
    "Create your free Toolsify account and start using 50+ online tools today.",
};

export default function SignUpPage() {
  return <SignUpWithVerification />;
}
