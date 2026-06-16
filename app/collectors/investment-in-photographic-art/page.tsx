import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Lede, Section } from "@/components/Prose";
import Faq from "@/components/Faq";

export const metadata: Metadata = {
  title: "Is Fine Art Photography a Good Investment?",
  description: "How limited-edition photography holds and builds value — scarcity, provenance and the artist's trajectory. An educational guide by Sydney artist Nick Brand.",
};

const disclaimer =
  "This page is educational and general in nature. It is not financial, investment or tax advice. Art carries no guaranteed financial return, values can fall as well as rise, and past performance is not indicative of future results. Buy art first for the pleasure of owning it, and seek independent professional advice before treating any artwork as an investment.";

const faqs = [
  { q: "Is fine art photography a good investment?", a: "It can hold and grow in value through scarcity, provenance and rising demand, but there is no guarantee. Buy first for enjoyment; treat value as a secondary benefit. This is not financial advice." },
  { q: "Do limited-edition prints increase in value?", a: "They can, when demand for the artist or image grows against a fixed supply. Open editions, with unlimited supply, generally do not." },
  { q: "What protects an artwork's value?", a: "Scarcity (small editions), provenance (certificate and ownership history), the artist's growing record, and good physical care." },
];

export default function Investment() {
  return (
    <div className="mx-auto max-w-content px-5 py-16 md:px-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Collectors" }, { label: "Investment in Photographic Art" }]} />
      <div className="eyebrow mb-3">Investment in Photographic Art</div>
      <h1 className="max-w-3xl font-serif text-5xl leading-tight">Is fine art photography a good investment?</h1>

      <p className="mt-6 max-w-2xl border border-line bg-ink/[0.03] p-4 text-xs italic leading-relaxed text-ink/55">{disclaimer}</p>

      <Lede>
        It can be — but it should never be only that. Historically, limited-edition photography by artists with a consistent
        body of work and a rising profile has held and grown in value, driven by scarcity, provenance and demand. The surest
        approach is to buy a work you genuinely want to live with; if it appreciates, that is a second reward.
      </Lede>

      <Section title="The three levers of value">
        <p><strong>Scarcity.</strong> A smaller edition means each work is rarer. Limited, numbered editions that close
          permanently are the foundation of collectible value.</p>
        <p><strong>Provenance.</strong> A clear ownership history and a signed certificate of authenticity protect and support
          value over time. Undocumented work is harder to sell and to value.</p>
        <p><strong>The artist's trajectory.</strong> As an artist's exhibition record, recognition and demand grow, earlier
          works can become more sought-after. Backing an artist early is where collectors have historically found value.</p>
      </Section>
      <Section title="Why limited editions appreciate (when they do)">
        <p>The mechanism is simple supply and demand. Once an edition of 15 is sold, no more exist. If demand for the artist or
          the image grows, buyers compete for a finite number of works, and the secondary-market price can rise above the
          original. Open editions, with unlimited supply, do not behave this way.</p>
      </Section>
      <Section title="Where Bodyscapes sits">
        <p>Nick Brand is a Sydney photographer with more than twenty years' experience, building a focused body of
          black-and-white bodyscape work released in strictly limited editions of 15. The recognition is early-stage and
          growing — the work is currently shown across a number of Sydney businesses and held in private collections. For
          collectors, that combination — a committed artist, a distinctive body of work, and an early point in the trajectory —
          is precisely the stage at which acquiring is most interesting.</p>
      </Section>
      <Section title="A realistic word on risk">
        <p>Art is an illiquid, subjective asset. There is no guarantee a work will rise in value, the resale market for any
          individual artist can be thin, and selling can take time. Treat any appreciation as a bonus, never a plan. The first
          and best reason to buy remains simple: buy what you love.</p>
      </Section>

      <div className="mt-16 max-w-2xl">
        <h2 className="mb-6 font-serif text-3xl">Common questions</h2>
        <Faq items={faqs} />
      </div>
      <p className="mt-10 max-w-2xl text-xs italic leading-relaxed text-ink/45">{disclaimer}</p>
      <div className="mt-10 flex gap-3">
        <Link href="/collectors/collector-guide/" className="border border-line px-6 py-3 text-xs uppercase tracking-widest2 text-ink/70 transition hover:border-ink hover:text-ink">Read the Collector Guide</Link>
        <Link href="/artworks/" className="border border-ink px-6 py-3 text-xs uppercase tracking-widest2 transition hover:bg-ink hover:text-paper">View Available Works</Link>
      </div>
    </div>
  );
}
