import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Lede, Section } from "@/components/Prose";
import Faq from "@/components/Faq";

export const metadata: Metadata = {
  title: "The Collector's Guide to Buying Fine Art Photography",
  description: "How to buy fine art photography with confidence — editions, provenance, sizing, framing and value, explained plainly by Sydney artist Nick Brand.",
};

const faqs = [
  { q: "What is a limited edition?", a: "A work released in a fixed number of prints — for example, an edition of 15. Once all are sold, the edition closes permanently and is never reprinted, which is what makes the work scarce and collectible." },
  { q: "Why does edition size matter to value?", a: "The smaller the edition, the rarer each individual work — a key driver of long-term value in collectible photography." },
  { q: "How much does fine art photography cost?", a: "Prices vary with the artist, edition size, and — for work on canvas — the size and framing. Bodyscapes works are priced from $1,700, with the final price set by the size and frame you choose." },
  { q: "Do the works come with a certificate?", a: "Yes. Every piece includes a signed Certificate of Authenticity and a provenance record stating the title, edition number and details." },
];

export default function CollectorGuide() {
  return (
    <div className="mx-auto max-w-content px-5 py-16 md:px-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Collectors" }, { label: "Collector Guide" }]} />
      <div className="eyebrow mb-3">Collector Guide</div>
      <h1 className="max-w-3xl font-serif text-5xl leading-tight">The Collector's Guide to Buying Fine Art Photography</h1>
      <Lede>
        Buying fine art photography should be straightforward and free of jargon. This guide explains how it works —
        editions, provenance, sizing, framing and value — for first-time buyers and seasoned collectors alike.
      </Lede>

      <Section title="What makes a photograph collectible?">
        <p>A collectible photograph is defined by scarcity, quality and provenance. It is released in a limited, numbered
          edition; printed to a lasting standard; and documented so its authenticity and ownership history are clear. A
          decorative print has none of these — which is why a genuine limited edition holds value in a way a poster never will.</p>
      </Section>
      <Section title="Limited edition vs open edition">
        <p>A limited edition is released in a fixed number of prints — for 50 Pages of Shades, an edition of 15 — after which the
          edition closes permanently and is never reprinted. An open edition has no limit and can be reproduced indefinitely.
          Scarcity is the difference, and scarcity is what underpins long-term value.</p>
      </Section>
      <Section title="Why edition size matters to value">
        <p>The smaller the edition, the rarer each individual work. A piece in an edition of 15 is scarcer — and typically
          more valuable over time — than the same image in an edition of 200. Edition size is one of the clearest signals of
          how collectible a photograph really is, which is why it is stated openly on every work.</p>
      </Section>
      <Section title="Certificates of authenticity and provenance">
        <p>Every acquisition includes a signed Certificate of Authenticity recording the title, edition number and
          details of the work, plus a provenance record of its ownership. Keep these documents safe — together they are the
          proof of what you own, and the foundation of value if you ever choose to sell, insure or pass the work on.</p>
      </Section>
      <Section title="How much does fine art photography cost?">
        <p>Prices vary with the artist, the edition size, and — for work on canvas — the size and framing of the piece.
          Works from 50 Pages of Shades are priced from $1,700, with the final price set by the size and frame you choose. Prices are shown
          openly on each work and update as you select size and frame.</p>
      </Section>
      <Section title="Choosing the right size for your wall">
        <p>As a guide, a feature artwork should fill roughly two-thirds of the wall or furniture it sits above, and hang with
          its centre near eye level (about 145 to 150 cm from the floor). Because the work is printed on canvas in custom sizes,
          a piece can be made to suit your wall exactly — send the dimensions and we will advise.</p>
      </Section>
      <Section title="Is fine art photography a good investment?">
        <p>Limited-edition photography by established artists has, historically, held and grown in value — driven by scarcity,
          the artist's trajectory, and provenance. That said, art carries no guaranteed financial return and should be bought
          first for the pleasure of owning it; value is a second reward, not a promise. This guide is educational and not
          financial advice. <Link href="/collectors/investment-in-photographic-art/" className="underline">Read more on investment.</Link></p>
      </Section>

      <div className="mt-16 max-w-2xl">
        <h2 className="mb-6 font-serif text-3xl">Common questions</h2>
        <Faq items={faqs} />
      </div>

      <div className="mt-12 flex gap-3">
        <Link href="/artworks/" className="border border-ink bg-ink px-6 py-3 text-xs uppercase tracking-widest2 text-paper transition hover:bg-transparent hover:text-ink">View Available Works</Link>
        <Link href="/contact/" className="border border-line px-6 py-3 text-xs uppercase tracking-widest2 text-ink/70 transition hover:border-ink hover:text-ink">Enquire</Link>
      </div>
    </div>
  );
}
