export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="font-mono text-sm text-muted">404</p>
      <h1 className="font-display text-2xl font-semibold text-ink">This page doesn't exist.</h1>
      <a href="/" className="mt-2 text-sm text-sakura hover:underline">
        Back to Anime Gallery
      </a>
    </main>
  );
}
