import type { Metadata } from "next";
import Link from "next/link";
import { artworks, collections } from "@/lib/catalog";
import ArtworkCard from "@/components/ArtworkCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Abstract Black & White Photography",
  description: "Contemporary abstract black-and-white photographic art by Nick Brand. Limited editions of 15 on framed canvas, custom sizes, showing at NITA Gallery, Sydney.",
};

const paths: { head: string; body: string; href: string; cta: string }[] = [
  { head: "Private Collectors", body: "Discover available works, editions and collecting information.", href: "/artworks/", cta: "Explore available artworks" },
  { head: "Interior Designers & Architects", body: "Trade pricing, custom dimensions and project-specific selections.", href: "/for-designers/", cta: "Explore the designer programme" },
  { head: "Corporate, Hospitality & Healthcare", body: "Coordinated selections, large-scale works and commercial commissions.", href: "/for-designers/corporate-art/", cta: "Explore commercial artwork" },
];

export default function CollectionsPage() {
  const sorted = [...artworks].sort((a, b) => Number(b.featured) - Number(a.featured));
  const n = site.nita;
  const schema = {
    "@context": "https://schema.org", "@type": "CollectionPage", name: "Fifty Pages of Shades: abstract black-and-white photographic art",
    description: collections[0]?.intro, url: `${site.url}/collections/`,
    isPartOf: { "@id": `${site.url}/#organization` },
    mainEntity: { "@type": "ItemList", numberOfItems: sorted.length,
      itemListElement: sorted.map((w, i) => ({ "@type": "ListItem", position: i + 1, name: w.title, url: `${site.url}/artworks/${w.slug}/` })) },
  };
  const crumbs = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
      { "@type": "ListItem", position: 2, name: "Collection", item: `${site.url}/collections/` },
    ],
  };
  return (
    <div className="mx-auto max-w-content px-5 py-16 md:px-10">
      <JsonLd data={schema} /><JsonLd data={crumbs} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Collection" }]} />

      <div className="eyebrow mb-3">Fifty Pages of Shades</div>
      <h1 className="max-w-3xl font-serif text-5xl leading-tight">Abstract Black &amp; White Photographic Art</h1>
      <p className="mt-3 font-serif text-2xl italic text-ink/60">The Art of the Unseen Form</p>

      <div className="mt-8 max-w-3xl space-y-5 font-serif text-xl leading-relaxed text-ink/85">
        <p>Some images reveal themselves immediately. Others invite you to look again.</p>
        <p>
          Fifty Pages of Shades is a distinctive collection of contemporary black-and-white fine-art photography by Sydney
          photographer Nick Brand. Through an exploration of form, light, shadow and texture, familiar shapes are transformed
          into abstract photographic compositions. The original subject becomes secondary to the image itself, leaving room
          for interpretation, imagination and individual discovery.
        </p>
        <p>
          Created to be experienced rather than simply observed, each work brings a distinctive sense of depth, contrast and
          visual intrigue to the spaces in which it is displayed.
        </p>
      </div>

      <section className="mt-20" aria-labelledby="works-h">
        <div className="eyebrow mb-2">The Collection</div>
        <h2 id="works-h" className="mb-10 font-serif text-4xl">{sorted.length} limited-edition works</h2>
        <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((a) => <ArtworkCard key={a.slug} a={a} />)}
        </div>
        <div className="mt-12">
          <Link href="/artworks/" className="border border-ink px-6 py-3 text-xs uppercase tracking-widest2 transition hover:bg-ink hover:text-paper">Browse and filter all works</Link>
        </div>
      </section>

      <section className="mt-24 max-w-3xl">
        <h2 className="font-serif text-4xl">A collection made for considered interiors</h2>
        <div className="mt-5 space-y-4 text-ink/65">
          <p>
            The work is created for spaces where art plays an important role in the overall environment. From private residences
            and architectural interiors to boutique hotels, corporate environments and hospitality spaces, the collection offers a
            distinctive alternative to conventional decorative artwork.
          </p>
          <p>
            Each work is produced as a limited edition of 15, printed on canvas in a range of formats and bespoke dimensions,
            professionally framed and accompanied by a signed Certificate of Authenticity.
          </p>
        </div>
      </section>

      <section className="mt-20" aria-labelledby="paths-h">
        <h2 id="paths-h" className="font-serif text-4xl">Who the collection is for</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {paths.map((p) => (
            <div key={p.head} className="border border-line p-8">
              <h3 className="font-serif text-2xl">{p.head}</h3>
              <p className="mt-3 text-sm text-ink/60">{p.body}</p>
              <Link href={p.href} className="mt-5 inline-block text-xs uppercase tracking-widest2 text-ink/70 hover:text-ink">{p.cta} →</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20 max-w-3xl">
        <h2 className="font-serif text-4xl">Artwork for designers, architects and commercial projects</h2>
        <p className="mt-5 text-ink/65">
          The studio works directly with interior designers, architects, art consultants, developers and commercial clients,
          including <Link href="/healthcare-art/" className="underline">hospitals and healthcare facilities</Link>.
        </p>
        <ul className="mt-5 list-disc space-y-1 pl-5 text-ink/65">
          <li>Preferred trade pricing</li>
          <li>Bespoke artwork dimensions</li>
          <li>Custom framing options</li>
          <li>Coordinated artwork selections</li>
          <li>Large-scale photographic works</li>
          <li>Australia-wide and international delivery</li>
        </ul>
        <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-widest2 text-ink/70">
          <Link href="/for-designers/" className="hover:text-ink">Explore the designer programme →</Link>
          <Link href="/for-designers/corporate-art/" className="hover:text-ink">Explore corporate art →</Link>
          <Link href="/large-scale-art/" className="hover:text-ink">Large scale art →</Link>
        </p>
      </section>

      <section className="mt-20 max-w-3xl border border-line p-8 md:p-10" aria-labelledby="experience-h">
        <div className="eyebrow mb-2">Now showing in Sydney</div>
        <h2 id="experience-h" className="font-serif text-4xl">Experience the collection in person</h2>
        <p className="mt-4 text-ink/65">
          Fifty Pages of Shades is currently exhibiting at <a href={n.url} className="underline">{n.name}</a> in Surry Hills, Sydney.
          Private collectors, interior designers, architects and commercial clients are welcome to see the photographs in person,
          and private viewings can be arranged for designers and their clients.
        </p>
        <p className="mt-4 text-sm text-ink/65">
          {n.name}, {n.street}, {n.suburb} {n.region} {n.postcode}<br />Open {n.hours}.
        </p>
        <p className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-widest2 text-ink/70">
          <Link href="/about/exhibitions/" className="hover:text-ink">Arrange a private viewing →</Link>
          <a href={n.mapUrl} className="hover:text-ink">Directions →</a>
        </p>
      </section>
    </div>
  );
}
