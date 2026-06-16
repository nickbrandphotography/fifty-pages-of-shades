import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { articles, formatDate } from "@/lib/journal";

export const metadata: Metadata = {
  title: "Journal — Notes on Bodyscape & Abstract Photographic Art",
  description: "Essays and guides on bodyscape art, collecting fine art photography, and styling art in interiors, by Sydney artist Nick Brand.",
};

export default function JournalIndex() {
  const sorted = [...articles].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  return (
    <div className="mx-auto max-w-content px-5 py-16 md:px-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Journal" }]} />
      <div className="eyebrow mb-3">Journal</div>
      <h1 className="font-serif text-5xl">Notes from the studio</h1>
      <p className="mt-4 max-w-2xl text-ink/60">Essays and guides on the work, collecting fine art photography, and living with art.</p>
      <div className="mt-14 max-w-3xl divide-y divide-line border-t border-line">
        {sorted.map((a) => (
          <Link key={a.slug} href={`/journal/${a.slug}/`} className="group block py-8">
            <div className="text-xs uppercase tracking-widest2 text-stone">{a.silo} · {formatDate(a.date)}</div>
            <h2 className="mt-2 font-serif text-2xl transition group-hover:text-ink/70">{a.title}</h2>
            <p className="mt-2 text-sm text-ink/60">{a.dek}</p>
            <span className="mt-3 inline-block text-xs uppercase tracking-widest2 text-ink/60 group-hover:text-ink">Read →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
