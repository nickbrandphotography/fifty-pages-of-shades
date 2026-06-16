import Link from "next/link";
import { site } from "@/lib/site";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur">
      <div className="mx-auto flex max-w-content items-center justify-between px-5 py-4 md:px-10">
        <Link href="/" className="font-serif text-2xl tracking-tight">Bodyscapes</Link>
        <nav className="hidden gap-8 text-sm md:flex">
          {site.nav.map((n) => (
            <Link key={n.href} href={n.href} className="text-ink/70 transition hover:text-ink">{n.label}</Link>
          ))}
        </nav>
        <Link href="/contact" className="text-xs uppercase tracking-widest2 text-ink/70 hover:text-ink md:hidden">Menu</Link>
      </div>
    </header>
  );
}
