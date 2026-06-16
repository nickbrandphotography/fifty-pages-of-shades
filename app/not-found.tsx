import Link from "next/link";
export default function NotFound() {
  return (
    <div className="mx-auto max-w-content px-5 py-32 text-center md:px-10">
      <div className="eyebrow mb-3">404</div>
      <h1 className="font-serif text-5xl">This page has slipped into shadow</h1>
      <p className="mt-4 text-ink/60">The page you are looking for cannot be found.</p>
      <Link href="/" className="mt-8 inline-block border border-ink px-6 py-3 text-xs uppercase tracking-widest2 transition hover:bg-ink hover:text-paper">Return home</Link>
    </div>
  );
}
