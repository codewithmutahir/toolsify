import Link from "next/link";

export default function AuthLinksFallback() {
  return (
    <>
      <Link
        href="/sign-in"
        className="font-body text-body text-on-surface-variant hover:text-primary font-medium px-md py-sm"
      >
        Log In
      </Link>
      <Link
        href="/sign-up"
        className="bg-primary-container text-on-primary font-bold px-lg py-sm rounded-lg hover:brightness-110 active:scale-95 transition-all"
      >
        Sign Up
      </Link>
    </>
  );
}
