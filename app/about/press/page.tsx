import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { press } from "@/lib/authority";

export const metadata: Metadata = {
  title: "Press — Nick Brand · 50 Pages of Shades",
  description: "Press, features and media on Nick Brand's bodyscape photography. Media enquiries and press kit available on request.",
};

export default function Press() {
  return (
    <div className="mx-auto max-w-content px-5 py-16 md:px-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Press" }]} />
      <div className="eyebrow mb-3">Press</div>
      <h1 className="font-serif text-5xl">Press &amp; media</h1>
      {press.length === 0 ? (
        <p className="mt-6 max-w-2xl font-serif text-2xl leading-relaxed text-ink/80">
          For media enquiries, interviews or image requests, the studio is happy to help. A press kit with artist
          biography, high-resolution images and the 50 Pages of Shades story is available on request —
          <Link href="/contact/" className="underline"> contact the studio</Link>.
        </p>
      ) : (
        <ul className="mt-12 max-w-2xl divide-y divide-line border-t border-line">
          {press.map((p, i) => (
            <li key={i} className="py-6">
              <div className="font-serif text-xl">{p.publication}</div>
              <div className="mt-1 text-sm text-ink/65">{p.title} · {p.date}</div>
              {p.url && <a href={p.url} className="mt-1 inline-block text-xs uppercase tracking-widest2 text-ink/60 hover:text-ink">Read →</a>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
