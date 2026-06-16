import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { awards } from "@/lib/authority";

export const metadata: Metadata = {
  title: "Awards & Recognition — Nick Brand",
  description: "Awards, recognition and collections featuring Nick Brand's bodyscape photography.",
};

export default function Awards() {
  return (
    <div className="mx-auto max-w-content px-5 py-16 md:px-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Awards & Recognition" }]} />
      <div className="eyebrow mb-3">Awards &amp; Recognition</div>
      <h1 className="font-serif text-5xl">Recognition</h1>
      {awards.length === 0 ? (
        <p className="mt-6 max-w-2xl font-serif text-2xl leading-relaxed text-ink/80">
          Recognition for the Bodyscapes series is growing. Nick Brand's editions are held in private collections and shown
          across a number of Sydney businesses and spaces. Awards, selections and notable placements will be recorded here as
          they are earned.
        </p>
      ) : (
        <ul className="mt-12 max-w-2xl divide-y divide-line border-t border-line">
          {awards.map((a, i) => (
            <li key={i} className="py-6">
              <div className="font-serif text-xl">{a.award}</div>
              <div className="mt-1 text-sm text-ink/65">{a.body} · {a.year}{a.result ? ` · ${a.result}` : ""}</div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-10"><Link href="/about/" className="text-xs uppercase tracking-widest2 text-ink/60 hover:text-ink">← About the artist</Link></div>
    </div>
  );
}
