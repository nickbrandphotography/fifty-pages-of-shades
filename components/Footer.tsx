import Link from "next/link";
import { site } from "@/lib/site";

const cols: { head: string; links: [string, string][] }[] = [
  { head: "Explore", links: [["Collections", "/collections"], ["Available Works", "/artworks"], ["Large Scale Art", "/large-scale-art"], ["Journal", "/journal"]] },
  { head: "Trade", links: [["Designer Program", "/for-designers"], ["Corporate Art", "/for-designers/corporate-art"], ["Commissions", "/commissions"]] },
  { head: "Collectors", links: [["Collector Guide", "/collectors/collector-guide"], ["Investment", "/collectors/investment-in-photographic-art"], ["FAQ", "/resources/faq"], ["Glossary", "/resources/glossary"]] },
  { head: "Studio", links: [["About", "/about"], ["Exhibitions", "/about/exhibitions"], ["Press", "/about/press"], ["Testimonials", "/testimonials"], ["Contact", "/contact"]] },
];

export default function Footer() {
  return (
    <footer className="mt-28 border-t border-line bg-paper">
      <div className="mx-auto grid max-w-content gap-10 px-5 py-16 md:grid-cols-6 md:px-10">
        <div className="md:col-span-2">
          <div className="font-serif text-2xl">50 Pages of Shades</div>
          <p className="mt-3 max-w-sm text-sm text-ink/60">
            Black-and-white fine art photography of the human form by Nick Brand. Limited editions on framed canvas,
            custom sizes, Australia-wide and worldwide delivery.
          </p>
          <Link href="/contact/" className="mt-4 inline-block text-xs uppercase tracking-widest2 text-ink/70 hover:text-ink">Enquire →</Link>
        </div>
        {cols.map((c) => (
          <div key={c.head} className="text-sm">
            <div className="eyebrow mb-3">{c.head}</div>
            <ul className="space-y-2 text-ink/70">
              {c.links.map(([label, href]) => (<li key={href}><Link href={href}>{label}</Link></li>))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto max-w-content px-5 pb-10 text-xs text-ink/40 md:px-10">
        © {new Date().getFullYear()} 50 Pages of Shades. All works © Nick Brand. Reproduction prohibited. · {site.city}
      </div>
    </footer>
  );
}
