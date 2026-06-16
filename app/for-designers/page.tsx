import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Trade Program — Fine Art for Interior Designers & Architects",
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

export default function ForDesignersPage() {
  return (
    <div className="mx-auto max-w-content px-5 py-16 md:px-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "For Designers" }]} />
      <div className="eyebrow mb-3">Trade Program</div>
      <h1 className="max-w-3xl font-serif text-5xl leading-tight">A trade program built for designers and architects</h1>
      <p className="mt-6 max-w-2xl text-ink/60">
        Bodyscapes works with interior designers, architects, developers and corporate clients to place distinctive,
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
    </div>
  );
}
