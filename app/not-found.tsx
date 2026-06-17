import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-gutter py-2xl text-center">
        <span className="text-7xl mb-lg" role="img" aria-label="Confused face">
          🔍
        </span>
        <h1 className="font-display text-h1-mobile md:text-h1 text-on-surface mb-md">
          Oops! Page not found
        </h1>
        <p className="font-body text-body text-on-surface-variant max-w-md mb-xl">
          The page you are looking for does not exist or may have been moved.
          Browse our full library of free online tools instead.
        </p>
        <Link
          href="/tools"
          className="bg-primary-container text-on-primary px-xl py-md rounded-lg font-label font-bold hover:opacity-90 active:scale-95 transition-all"
        >
          Browse all tools
        </Link>
      </main>
      <Footer />
    </div>
  );
}
