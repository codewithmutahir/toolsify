"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center px-gutter">
      <div className="text-center max-w-md">
        <span className="material-symbols-outlined text-error text-[80px] mb-lg block">
          error
        </span>
        <h2 className="font-h1 text-h1 text-on-surface mb-md">
          Something went wrong
        </h2>
        <p className="font-body text-body text-on-surface-variant mb-xl">
          An unexpected error occurred. Please try again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="bg-primary-container text-on-primary px-xl py-md rounded-lg font-label font-bold hover:opacity-90 active:scale-95 transition-all"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}
