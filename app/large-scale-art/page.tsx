import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Lede, Section } from "@/components/Prose";
import Faq from "@/components/Faq";

export const metadata: Metadata = {
  title: "Large Scale Art — Statement Black-and-White Canvas",
  description: "Oversized black-and-white bodyscape art for feature walls, lobbies and large spaces. Printed on canvas in custom sizes, gallery-framed and ready to hang.",
};

const faqs = [
  { q: "How large can the works go?", a: "Because the work is printed on canvas, almost any size is possible. Share your wall dimensions and we will recommend a size and frame." },
  { q: "Is large-format art on canvas good quality?", a: "Yes. Canvas holds black-and-white tone and detail well at scale, stays light and matte, and avoids the glare and weight of large glazed frames." },
  { q: "Do you deliver and install large works?", a: "Works arrive framed, wired and ready to hang, delivered Australia-wide and worldwide on request." },
];

export default function LargeScale() {
  return (
    <div className="mx-auto max-w-content px-5 py-16 md:px-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Large Scale Art" }]} />
      <div className="eyebrow mb-3">Large Scale Art</div>
      <h1 className="max-w-3xl font-serif text-5xl leading-tight">Made for the wall it will command</h1>
      <Lede>
        Bodyscapes are conceived at scale. Printed on canvas, the work goes large without losing depth or detail — suited to
        feature walls, lobbies, voids, stairwells and double-height spaces. Custom sizes mean a piece can be made to command
        its wall exactly, gallery-framed and delivered ready to hang.
      </Lede>

      <Section title="Why canvas, why scale">
        <p>Canvas is what lets this work live large. Where glass and paper become heavy, fragile and reflective at size, framed
          canvas stays light, matte and readable from across a room — and almost any dimension is possible. In black and white,
          a large bodyscape reads as a single sculptural form: abstract enough to sit in any interior, strong enough to anchor it.</p>
      </Section>
      <Section title="Where large-scale works belong">
        <p>Residential feature walls and over-bed statements; luxury apartment and development interiors; display suites and
          property marketing; hotel lobbies, restaurants and hospitality; corporate receptions, boardrooms and offices — any
          space with a wall worth commanding.</p>
      </Section>
      <Section title="How sizing and pricing works">
        <p>Tell us the wall and the look you are after, and we will advise on the right dimensions and frame. Price is set by
          size and framing and confirmed up front — no surprises. As a rule, a feature work should fill around two-thirds of its
          wall; we will help you get the proportion right.</p>
      </Section>
      <Section title="Installation confidence">
        <p>Every large work arrives gallery-framed, wired and ready to hang, packed and protected for safe transit.
          Australia-wide delivery, worldwide on request.</p>
      </Section>

      <div className="mt-16 max-w-2xl">
        <h2 className="mb-6 font-serif text-3xl">Common questions</h2>
        <Faq items={faqs} />
      </div>
      <div className="mt-12 flex gap-3">
        <Link href="/artworks/" className="border border-ink bg-ink px-6 py-3 text-xs uppercase tracking-widest2 text-paper transition hover:bg-transparent hover:text-ink">View Available Works</Link>
        <Link href="/for-designers/" className="border border-line px-6 py-3 text-xs uppercase tracking-widest2 text-ink/70 transition hover:border-ink hover:text-ink">Designer Trade Program</Link>
      </div>
    </div>
  );
}
