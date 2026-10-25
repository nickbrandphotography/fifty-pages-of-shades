import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { testimonials } from "@/lib/authority";

export const metadata: Metadata = {
  title: "Testimonials — Collectors & Designers on Fifty Pages of Shades",
  description: "What collectors, interior designers and clients say about Nick Brand's bodyscape art and working with the studio.",
};

export default function Testimonials() {
  return (
    <div className="mx-auto max-w-content px-5 py-16 md:px-10">
      {testimonials.map((t, i) => (
        <JsonLd key={i} data={{ "@context": "https://schema.org", "@type": "Review",
          reviewBody: t.quote, author: { "@type": "Person", name: t.name },
          itemReviewed: { "@type": "Organization", name: "Fifty Pages of Shades" } }} />
      ))}
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Testimonials" }]} />
      <div className="eyebrow mb-3">Testimonials</div>
      <h1 className="font-serif text-5xl">In their words</h1>
      {testimonials.length === 0 ? (
        <p className="mt-6 max-w-2xl font-serif text-2xl leading-relaxed text-ink/80">
          Collectors and designers are acquiring the work and sharing their spaces. Words from clients will appear here as
          pieces find their homes. To start a conversation, <Link href="/contact/" className="underline">enquire with the studio</Link>.
        </p>
      ) : (
        <div className="mt-12 grid max-w-4xl gap-8 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <figure key={i} className="border border-line p-8">
              <blockquote className="font-serif text-xl leading-relaxed text-ink/85">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-4 text-sm text-ink/55">— {t.name}, {t.role}</figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
