"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import AppUserButton from "@/components/auth/AppUserButton";

export default function HeaderAuthSection() {
  return (
    <>
      <SignedOut>
        <Link
          href="/sign-in"
          className="hidden sm:block font-body text-body text-on-surface-variant hover:text-primary font-medium px-md py-sm"
        >
          Log In
        </Link>
        <Link
          href="/sign-up"
          className="bg-primary-container text-on-primary font-bold px-lg py-sm rounded-lg hover:brightness-110 active:scale-95 transition-all"
        >
          Sign Up
        </Link>
      </SignedOut>

      <SignedIn>
        <Link
          href="/dashboard"
          className="hidden lg:block font-body text-body text-on-surface-variant hover:text-primary font-medium px-sm py-sm"
        >
          Dashboard
        </Link>
        <AppUserButton />
      </SignedIn>
    </>
  );
}
