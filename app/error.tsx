'use client';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="font-mono text-sm text-muted">Something went wrong</p>
      <h1 className="max-w-md font-display text-xl font-semibold text-ink">
        We couldn't load this page. This is usually a temporary connection issue.
      </h1>
      <button
        onClick={reset}
        className="mt-2 rounded-full bg-sakura px-5 py-2 text-sm font-medium text-void transition-transform hover:scale-105"
      >
        Retry
      </button>
    </main>
  );
}
