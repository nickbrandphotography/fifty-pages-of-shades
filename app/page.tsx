import Link from "next/link";
import Image from "next/image";
import { collections, featured, artworks } from "@/lib/catalog";
import CollectionTile from "@/components/CollectionTile";
import ArtworkCard from "@/components/ArtworkCard";

export default function Home() {
  const hero = featured()[0] ?? artworks[0];
  const strip = artworks.slice(0, 3);
  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-content items-center gap-10 px-5 py-16 md:grid-cols-2 md:px-10 md:py-24">
        <div className="reveal">
          <div className="eyebrow mb-5">50 Pages of Shades · Nick Brand</div>
          <h1 className="font-serif text-5xl leading-[1.05] md:text-6xl">Form, abstracted.<br />The body as landscape.</h1>
          <p className="mt-6 max-w-md text-ink/60">
            Black-and-white bodyscape art in limited editions — for collectors, designers and architects.
          </p>
          <div className="mt-8 flex gap-3">
            <Link href="/collections" className="border border-ink bg-ink px-6 py-3 text-xs uppercase tracking-widest2 text-paper transition hover:bg-transparent hover:text-ink">View the Collections</Link>
            <Link href="/artworks" className="border border-line px-6 py-3 text-xs uppercase tracking-widest2 text-ink/70 transition hover:border-ink hover:text-ink">Available Works</Link>
          </div>
        </div>
        <div className="flex justify-center reveal">
          <Image src={hero.image} alt={`${hero.title} — black and white bodyscape by Nick Brand`}
            width={hero.pixels.w} height={hero.pixels.h} priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="h-auto w-auto max-h-[70vh] shadow-[0_50px_90px_-40px_rgba(0,0,0,0.55)]" />
        </div>
      </section>

      {/* Intro statement */}
      <section className="border-y border-line bg-ink/[0.02]">
        <div className="mx-auto max-w-3xl px-5 py-20 text-center md:px-10">
          <p className="font-serif text-2xl leading-relaxed md:text-3xl">
            A bodyscape is the human form seen as landscape — skin, shadow and line abstracted until the body
            becomes terrain, light and pure shape. Tasteful and abstract, never explicit: the body as a study in
            form, not a subject of exposure.
          </p>
        </div>
      </section>

      {/* Collections */}
      <section className="mx-auto max-w-content px-5 py-24 md:px-10">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <div className="eyebrow mb-2">The Collections</div>
            <h2 className="font-serif text-4xl">Two bodies of work, one language</h2>
          </div>
          <Link href="/collections" className="hidden text-xs uppercase tracking-widest2 text-ink/60 hover:text-ink md:block">All collections →</Link>
        </div>
        <div className="grid gap-10 md:grid-cols-2">
          {collections.map((c) => <CollectionTile key={c.slug} c={c} />)}
        </div>
      </section>

      {/* Trust pillars */}
      <section className="border-y border-line bg-ink/[0.02]">
        <div className="mx-auto grid max-w-content gap-10 px-5 py-20 md:grid-cols-3 md:px-10">
          {[
            ["Limited & Numbered", "Every work is released in a strictly limited edition of 15 and individually numbered. When an edition closes, it closes permanently."],
            ["Made at Scale, Built to Last", "Printed in black and white on premium canvas and gallery-framed. Custom sizes and a choice of frames finish each work for its space."],
            ["Provenance & Authenticity", "Each piece ships with a signed Certificate of Authenticity and a documented provenance record."],
          ].map(([t, d]) => (
            <div key={t}>
              <h3 className="font-serif text-2xl">{t}</h3>
              <p className="mt-3 text-sm text-ink/60">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recently released */}
      <section className="mx-auto max-w-content px-5 py-24 md:px-10">
        <div className="eyebrow mb-2">Recently Released</div>
        <h2 className="mb-12 font-serif text-4xl">New and available works</h2>
        <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {strip.map((a) => <ArtworkCard key={a.slug} a={a} />)}
        </div>
        <div className="mt-12"><Link href="/artworks" className="border border-ink px-6 py-3 text-xs uppercase tracking-widest2 transition hover:bg-ink hover:text-paper">View All Available Works</Link></div>
      </section>

      {/* Two-path */}
      <section className="mx-auto grid max-w-content gap-6 px-5 pb-24 md:grid-cols-2 md:px-10">
        <div className="border border-line p-10">
          <h3 className="font-serif text-3xl">For Collectors</h3>
          <p className="mt-3 text-ink/60">New to collecting, or deepening a collection? Explore the limited editions and acquire with confidence.</p>
          <Link href="/collections/abstract-forms" className="mt-6 inline-block text-xs uppercase tracking-widest2 text-ink/70 hover:text-ink">Explore the work →</Link>
        </div>
        <div className="border border-line p-10">
          <h3 className="font-serif text-3xl">For Designers &amp; Architects</h3>
          <p className="mt-3 text-ink/60">Trade pricing, large-scale capability, and turnkey framing and delivery for residential, hospitality and corporate projects.</p>
          <Link href="/for-designers" className="mt-6 inline-block text-xs uppercase tracking-widest2 text-ink/70 hover:text-ink">Explore the Trade Program →</Link>
        </div>
      </section>
    </>
  );
}
