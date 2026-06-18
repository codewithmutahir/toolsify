import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-gutter">
      <div className="text-center max-w-md">
        <span
          className="material-symbols-outlined text-primary-container text-[80px] mb-lg block"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          search_off
        </span>
        <h1 className="font-h1 text-h1 text-on-surface mb-md">Page Not Found</h1>
        <p className="font-body text-body text-on-surface-variant mb-xl">
          The tool or page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/tools"
          className="inline-flex items-center gap-sm bg-primary-container text-on-primary px-xl py-md rounded-lg font-label font-bold hover:opacity-90 active:scale-95 transition-all"
        >
          Browse All Tools
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
      </div>
    </main>
  );
}
