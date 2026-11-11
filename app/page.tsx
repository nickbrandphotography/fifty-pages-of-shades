import Link from "next/link";
import Image from "next/image";
import { altFor, featured, artworks } from "@/lib/catalog";
import ArtworkCard from "@/components/ArtworkCard";
import { articles } from "@/lib/journal";

export default function Home() {
  const hero = featured()[0] ?? artworks[0];
  const strip = artworks.slice(0, 3);
  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-content items-center gap-10 px-5 py-16 md:grid-cols-2 md:px-10 md:py-24">
        <div className="reveal">
          <div className="eyebrow mb-5">Fifty Pages of Shades · Nick Brand</div>
          <h1 className="font-serif text-5xl leading-[1.05] md:text-6xl">Form, abstracted.<br />The body as landscape.</h1>
          <p className="mt-6 max-w-md text-ink/60">
            Black-and-white abstract photographic art in limited editions by Sydney photographer Nick Brand — for collectors,
            interior designers, corporate and healthcare spaces. Now showing at NITA Gallery, Surry Hills.
          </p>
          <div className="mt-8 flex gap-3">
            <Link href="/collections" className="border border-ink bg-ink px-6 py-3 text-xs uppercase tracking-widest2 text-paper transition hover:bg-transparent hover:text-ink">View the Collections</Link>
            <Link href="/artworks" className="border border-line px-6 py-3 text-xs uppercase tracking-widest2 text-ink/70 transition hover:border-ink hover:text-ink">Available Works</Link>
          </div>
        </div>
        <div className="flex justify-center reveal">
          <Image src={hero.image} alt={altFor(hero)}
            width={hero.pixels.w} height={hero.pixels.h} priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="h-auto w-auto max-h-[70vh] shadow-[0_50px_90px_-40px_rgba(0,0,0,0.55)]" />
        </div>
      </section>

      {/* Intro statement */}
      <section className="border-y border-line bg-ink/[0.02]">
        <div className="mx-auto max-w-3xl px-5 py-20 text-center md:px-10">
          <div className="space-y-6 font-serif text-xl leading-relaxed text-ink/85 md:text-2xl">
            <p>
              The collection consists of contemporary black-and-white abstract photographic artworks, exploring form,
              texture, light and shadow through the abstract interpretation of the human form.
            </p>
            <p>
              The resulting images are entirely non-explicit and often surprisingly difficult to interpret. They sit somewhere
              between abstract photography and contemporary fine art, offering something quite different from conventional
              photographic prints.
            </p>
            <p>
              The collection is particularly suited to considered residential interiors, boutique hospitality, hotels and
              contemporary commercial environments.
            </p>
            <p>
              I operate my own gallery in Sydney, where the collection is exhibited, and can also accommodate bespoke sizing,
              framing and coordinated artwork selections for individual projects.
            </p>
          </div>
        </div>
      </section>

      {/* Now showing */}
      <section className="mx-auto max-w-content px-5 pt-20 md:px-10">
        <div className="grid items-center gap-6 border border-line p-8 md:grid-cols-[1.4fr_1fr] md:p-10">
          <div>
            <div className="eyebrow mb-2">Now showing in Sydney</div>
            <h2 className="font-serif text-3xl md:text-4xl">See Fifty Pages of Shades at NITA Gallery</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/65">
              Nick Brand's limited-edition photographs are showing at NITA Gallery, 68 Campbell Street, Surry Hills.
              See the scale, the tones and the framing in person, then arrange a private viewing for your project.
            </p>
          </div>
          <div className="md:text-right">
            <Link href="/about/exhibitions/" className="inline-block border border-ink bg-ink px-6 py-3 text-xs uppercase tracking-widest2 text-paper transition hover:bg-transparent hover:text-ink">Plan your visit</Link>
          </div>
        </div>
      </section>

      {/* Collection */}
      <section className="mx-auto max-w-content px-5 py-24 md:px-10">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <div className="eyebrow mb-2">The Collection</div>
            <h2 className="font-serif text-4xl">The Art of the Unseen Form</h2>
          </div>
          <Link href="/collections" className="hidden text-xs uppercase tracking-widest2 text-ink/60 hover:text-ink md:block">View the collection →</Link>
        </div>
        <p className="max-w-3xl text-ink/65">
          Some images reveal themselves immediately. Others invite you to look again. Fifty Pages of Shades is a distinctive
          collection of contemporary black-and-white fine-art photography, created for considered interiors and printed as
          limited editions of 50.
        </p>
        <div className="mt-8"><Link href="/collections" className="border border-ink px-6 py-3 text-xs uppercase tracking-widest2 transition hover:bg-ink hover:text-paper">View the Collection</Link></div>
      </section>

      {/* Trust pillars */}
      <section className="border-y border-line bg-ink/[0.02]">
        <div className="mx-auto grid max-w-content gap-10 px-5 py-20 md:grid-cols-3 md:px-10">
          {[
            ["Limited & Numbered", "Every work is released in a strictly limited edition of 50 and individually numbered. When an edition closes, it closes permanently."],
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

      {/* From the journal */}
      <section className="mx-auto max-w-content px-5 pb-24 md:px-10">
        <div className="eyebrow mb-2">From the Journal</div>
        <h2 className="mb-8 font-serif text-4xl">Guides for buyers and designers</h2>
        <ul className="grid gap-6 md:grid-cols-3">
          {articles.map((a) => (
            <li key={a.slug} className="border border-line p-6">
              <Link href={`/journal/${a.slug}/`} className="font-serif text-xl underline-offset-4 hover:underline">{a.title}</Link>
              <p className="mt-2 text-sm text-ink/60">{a.dek}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Two-path */}
      <section className="mx-auto grid max-w-content gap-6 px-5 pb-24 md:grid-cols-3 md:px-10">
        <div className="border border-line p-10">
          <h3 className="font-serif text-3xl">For Collectors</h3>
          <p className="mt-3 text-ink/60">New to collecting, or deepening a collection? Explore the limited editions and acquire with confidence.</p>
          <Link href="/collections" className="mt-6 inline-block text-xs uppercase tracking-widest2 text-ink/70 hover:text-ink">Explore the work →</Link>
        </div>
        <div className="border border-line p-10">
          <h3 className="font-serif text-3xl">For Designers &amp; Architects</h3>
          <p className="mt-3 text-ink/60">Trade pricing, large-scale capability, and turnkey framing and delivery for residential, hospitality and corporate projects.</p>
          <Link href="/for-designers" className="mt-6 inline-block text-xs uppercase tracking-widest2 text-ink/70 hover:text-ink">Explore the Trade Program →</Link>
        </div>
        <div className="border border-line p-10">
          <h3 className="font-serif text-3xl">For Corporate &amp; Healthcare</h3>
          <p className="mt-3 text-ink/60">Calm, abstract black-and-white art for offices, hospitals and clinics. Custom sizes, no glass, delivered ready to hang.</p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/for-designers/corporate-art" className="inline-block text-xs uppercase tracking-widest2 text-ink/70 hover:text-ink">Corporate art →</Link>
            <Link href="/healthcare-art" className="inline-block text-xs uppercase tracking-widest2 text-ink/70 hover:text-ink">Healthcare art →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
