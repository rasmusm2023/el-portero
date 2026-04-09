import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[var(--container-max)] px-4 py-24 text-center sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-medium text-ink">404</h1>
      <p className="mt-4 text-ink-muted">This page could not be found.</p>
      <Link
        href="/"
        className="mt-8 inline-block text-sm font-medium tracking-wide text-ink uppercase underline-offset-4 hover:underline"
      >
        Home
      </Link>
    </div>
  );
}
