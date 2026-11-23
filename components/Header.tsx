import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-content items-center justify-between px-5 py-4 md:px-10">
        <Link href="/" className="flex items-center gap-3 font-serif text-xl tracking-tight md:text-2xl">
          <Image src="/logo.png" alt="" aria-hidden="true" width={640} height={143} priority className="h-5 w-auto md:h-7" />
          <span>Fifty Pages of Shades</span>
        </Link>
        <nav aria-label="Main" className="hidden gap-8 text-sm md:flex">
          {site.nav.map((n) => (
            <Link key={n.href} href={n.href} className="text-ink/70 transition hover:text-ink">{n.label}</Link>
          ))}
        </nav>
        {/* Mobile menu: no JavaScript needed */}
        <details className="group md:hidden">
          <summary className="cursor-pointer list-none text-xs uppercase tracking-widest2 text-ink/70 hover:text-ink">Menu</summary>
          <nav aria-label="Mobile" className="absolute left-0 right-0 top-full border-b border-line bg-paper px-5 py-4">
            <ul className="space-y-3 text-base">
              {site.nav.map((n) => (
                <li key={n.href}><Link href={n.href} className="block py-1 text-ink/80">{n.label}</Link></li>
              ))}
            </ul>
          </nav>
        </details>
      </div>
    </header>
  );
}
