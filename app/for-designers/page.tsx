import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import Faq from "@/components/Faq";
import NitaNote from "@/components/NitaNote";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Trade Program for Interior Designers & Architects",
  description: "Trade pricing on Nick Brand's black-and-white bodyscape art for interior designers, architects and developers. Custom sizes, framed canvas, turnkey delivery.",
};

const benefits: [string, string][] = [
  ["Trade pricing", "Preferred pricing for approved design and architecture professionals, across repeat projects."],
  ["Built for scale", "Printed on canvas, the work goes large without compromise — feature walls, lobbies and voids."],
  ["Custom sizes, your spec", "Almost any dimension, with a choice of frames, so the work fits the wall and the scheme exactly."],
  ["Turnkey and ready to hang", "Gallery-framed and wired, delivered ready to install. No loose prints, no framing to arrange."],
  ["One point of contact", "Work directly with Nick Brand's studio — briefs, sizing, samples and timelines, handled personally."],
  ["Tasteful and brand-safe", "Abstract, monochrome form that suits considered interiors and corporate spaces."],
];

const faqs = [
  { q: "Do you offer trade pricing for interior designers and architects?", a: "Yes. Preferred pricing is available to approved interior designers, architects, developers and art consultants. Apply for a trade account and the studio will confirm." },
  { q: "Can the art be made to a specific size, frame or palette?", a: "Yes. Because the work is printed on canvas, almost any dimension is possible, with no frame (gallery wrap) or a black, natural oak or white floating frame. The work is black and white, so it sits with any palette." },
  { q: "Do you supply for hospitality, corporate and healthcare projects?", a: "Yes. See the pages for corporate art and healthcare art. Multi-site and cohesive schemes are possible, including the same image scaled across spaces." },
  { q: "Is the work delivered ready to hang?", a: "Yes. Every work arrives gallery-framed and wired, delivered across Australia, and worldwide on request." },
  { q: "Can I see the work in person before specifying it?", a: "Yes. Fifty Pages of Shades is showing at NITA Gallery, 68 Campbell Street, Surry Hills, Sydney. Private viewings for designers and their clients can be arranged." },
];

export default function ForDesignersPage() {
  return (
    <div className="mx-auto max-w-content px-5 py-16 md:px-10">
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "Service", name: "Trade program for interior designers and architects",
        serviceType: "Art supply for interior design projects",
        description: "Trade pricing, custom sizes, gallery framing and delivery of limited-edition black-and-white photographic art for interior designers, architects and developers.",
        url: `${site.url}/for-designers/`, provider: { "@type": "Organization", name: site.name, url: site.url },
        areaServed: { "@type": "Country", name: "Australia" },
      }} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "For Designers" }]} />
      <div className="eyebrow mb-3">Trade Program</div>
      <h1 className="max-w-3xl font-serif text-5xl leading-tight">A trade program built for designers and architects</h1>
      <p className="mt-6 max-w-2xl text-ink/60">
        Fifty Pages of Shades works with interior designers, architects, developers and corporate clients to place distinctive,
        large-scale black-and-white art into residential, hospitality and commercial spaces. Trade pricing, custom
        sizing, and turnkey framing and delivery — handled directly with the studio.
      </p>
      <div className="mt-8">
        <Link href="/contact" className="border border-ink bg-ink px-6 py-3 text-xs uppercase tracking-widest2 text-paper transition hover:bg-transparent hover:text-ink">Apply for a trade account</Link>
      </div>
      <div className="mt-20 grid gap-10 md:grid-cols-3">
        {benefits.map(([t, d]) => (
          <div key={t}>
            <h3 className="font-serif text-2xl">{t}</h3>
            <p className="mt-2 text-sm text-ink/60">{d}</p>
          </div>
        ))}
      </div>
      <div className="mt-20 border-t border-line pt-12">
        <h2 className="font-serif text-3xl">How it works</h2>
        <ol className="mt-6 grid gap-8 md:grid-cols-3">
          {[["Apply", "Tell us about your practice and your projects."],
            ["Specify", "Choose works, sizes and frames — or commission something bespoke. We quote and confirm."],
            ["Install", "We frame, wire and deliver ready to hang, across Australia (worldwide on request)."]].map(([t, d], i) => (
            <li key={t}><div className="font-serif text-4xl text-stone">{i + 1}</div><div className="mt-2 font-serif text-xl">{t}</div><p className="mt-1 text-sm text-ink/60">{d}</p></li>
          ))}
        </ol>
      </div>
      <div className="mt-20 max-w-2xl">
        <h2 className="mb-6 font-serif text-3xl">Common questions</h2>
        <Faq items={faqs} />
      </div>
      <p className="mt-10 text-sm text-ink/60">
        Also see <Link href="/for-designers/corporate-art/" className="underline">corporate art</Link>,{" "}
        <Link href="/healthcare-art/" className="underline">healthcare art</Link> and{" "}
        <Link href="/large-scale-art/" className="underline">large scale art</Link>.
      </p>
      <NitaNote audience="Designers are welcome to bring clients to see the work at scale." />
    </div>
  );
}
