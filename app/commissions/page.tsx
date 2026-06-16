import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Lede, Section } from "@/components/Prose";
import Faq from "@/components/Faq";

export const metadata: Metadata = {
  title: "Commission a Bodyscape — Bespoke Fine Art Photography",
  description: "Commission an original black-and-white bodyscape for a home or project. Bespoke concept, custom size and framing, by Sydney artist Nick Brand.",
};

const faqs = [
  { q: "Can I commission a bespoke bodyscape?", a: "Yes. Nick Brand accepts a limited number of commissions each year, created to your space within the abstract black-and-white language of the work." },
  { q: "How much does a commission cost?", a: "Quoted individually by scale, framing and complexity. We confirm the price before any work begins." },
  { q: "How long does a commission take?", a: "Typically a few weeks from confirmed brief to delivery, depending on size and framing." },
];

export default function Commissions() {
  return (
    <div className="mx-auto max-w-content px-5 py-16 md:px-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Commissions" }]} />
      <div className="eyebrow mb-3">Commissioned Works</div>
      <h1 className="max-w-3xl font-serif text-5xl leading-tight">A work made for your wall</h1>
      <Lede>
        Some walls call for a work made specifically for them. Nick Brand accepts a limited number of commissions each year —
        bespoke black-and-white bodyscape and abstract pieces created for a particular space, collection or project.
      </Lede>

      <Section title="Who commissions, and why">
        <p>Private collectors wanting a one-of-a-kind piece; interior designers and architects sourcing a signature work for a
          scheme; developers and corporate clients commissioning art that belongs to a specific building or brand. A commission
          lets you shape the concept, the scale and the finish from the start.</p>
      </Section>
      <Section title="What is possible">
        <p>Commissions stay within the language of the work — abstract, tasteful studies of the human form in black and white.
          This keeps the result coherent with the collection and brand-safe for any setting. We will talk through scale, mood,
          orientation and framing; the artistic approach remains Nick's.</p>
      </Section>

      <section className="mt-12 max-w-2xl">
        <h2 className="font-serif text-2xl">How a commission works</h2>
        <ol className="mt-4 grid gap-6 sm:grid-cols-2">
          {[["Brief", "We discuss the space, the feeling you want, scale and any constraints."],
            ["Concept and quote", "Nick proposes a direction and confirms size, framing, timeline and price."],
            ["Creation", "The work is photographed and produced in black and white, on framed canvas, to spec."],
            ["Delivery", "Gallery-framed, wired and delivered ready to hang, with certificate of authenticity."]].map(([t, d], i) => (
            <li key={t}><div className="font-serif text-3xl text-stone">{i + 1}</div><div className="mt-1 font-serif text-lg">{t}</div><p className="mt-1 text-sm text-ink/60">{d}</p></li>
          ))}
        </ol>
      </section>

      <div className="mt-16 max-w-2xl">
        <h2 className="mb-6 font-serif text-3xl">Common questions</h2>
        <Faq items={faqs} />
      </div>
      <div className="mt-12">
        <Link href="/contact/" className="border border-ink bg-ink px-6 py-3 text-xs uppercase tracking-widest2 text-paper transition hover:bg-transparent hover:text-ink">Request a commission</Link>
      </div>
    </div>
  );
}
