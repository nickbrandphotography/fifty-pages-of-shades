import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { artworks, getArtwork, getCollection, related, pricingFor, sizesFor, frames, editionLabel, formatAUD, fromPrice } from "@/lib/catalog";
import ArtworkExperience from "@/components/ArtworkExperience";
import ArtworkCard from "@/components/ArtworkCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import NitaNote from "@/components/NitaNote";
import JournalLinks from "@/components/JournalLinks";
import JsonLd from "@/components/JsonLd";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return artworks.map((a) => ({ slug: a.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = getArtwork(slug);
  if (!a) return {};
  // Keep titles within ~60 characters: use the longest form that fits.
  const brand = "Fifty Pages of Shades";
  const title = [`${a.title} — Limited Edition Photograph | ${brand}`, `${a.title} | ${brand}`, a.title].find((t) => t.length <= 60) ?? a.title;
  const price = formatAUD(fromPrice(a.orientation));
  const description = [
    `${a.description} ${a.size}, ${a.medium}, edition of ${a.editionSize}. From ${price}.`,
    `${a.description} ${a.size}, edition of ${a.editionSize}. From ${price}.`,
    `${a.size} limited edition by Nick Brand, edition of ${a.editionSize}. From ${price}.`,
  ].find((d) => d.length <= 155) ?? a.description;
  return {
    title: { absolute: title },
    description,
    openGraph: { title: a.title, description, images: [a.image] },
  };
}

export default async function ArtworkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArtwork(slug);
  if (!a) notFound();
  const coll = getCollection(a.collection);
  const [w, h] = a.size.replace(/ cm/, "").split(" x ").map((n) => parseInt(n));
  const prices = pricingFor(a.orientation).map((p) => p.price);
  const schema = {
    "@context": "https://schema.org", "@type": ["VisualArtwork", "Product"], name: a.title,
    url: `${site.url}/artworks/${a.slug}/`, sku: a.slug,
    creator: { "@id": `${site.url}/#nick-brand` },
    brand: { "@id": `${site.url}/#organization` },
    copyrightHolder: { "@id": `${site.url}/#nick-brand` },
    category: "Fine art photography",
    material: "Canvas",
    offers: {
      "@type": "AggregateOffer", priceCurrency: "AUD", lowPrice: Math.min(...prices), highPrice: Math.max(...prices), offerCount: prices.length,
      availability: a.status === "sold" ? "https://schema.org/SoldOut" : "https://schema.org/LimitedAvailability",
      url: `${site.url}/artworks/${a.slug}/`, seller: { "@id": `${site.url}/#organization` },
      areaServed: { "@type": "Country", name: "Australia" },
    },
    artform: "Photography", artMedium: a.medium, artworkSurface: "Canvas",
    image: `${site.url}${a.image}`, description: a.description, inLanguage: "en-AU",
    width: { "@type": "QuantitativeValue", value: w, unitCode: "CMT" },
    height: { "@type": "QuantitativeValue", value: h, unitCode: "CMT" },
    isAccessibleForFree: false,
    audience: { "@type": "Audience", audienceType: "Art collectors, interior designers, architects, corporate and healthcare buyers" },
  };
  const crumbs = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
      { "@type": "ListItem", position: 2, name: "Available Works", item: `${site.url}/artworks/` },
      { "@type": "ListItem", position: 3, name: a.title, item: `${site.url}/artworks/${a.slug}/` },
    ],
  };
  return (
    <div className="mx-auto max-w-content px-5 py-12 md:px-10">
      <JsonLd data={schema} /><JsonLd data={crumbs} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Available Works", href: "/artworks" }, { label: a.title }]} />

      <div className="mb-3 flex flex-wrap items-baseline gap-x-4">
        <h1 className="font-serif text-4xl md:text-5xl">{a.title}</h1>
        <span className="text-xs uppercase tracking-widest2 text-stone">{editionLabel(a)}</span>
      </div>
      {coll && <Link href="/collections/" className="text-sm text-ink/50 hover:text-ink">{coll.title} collection</Link>}

      <div className="mt-10">
        <ArtworkExperience artwork={a} pricing={pricingFor(a.orientation)} frames={frames} sizes={sizesFor(a.orientation)} />
      </div>

      {/* Story + specs */}
      <div className="mt-20 grid gap-12 border-t border-line pt-12 md:grid-cols-2">
        <div>
          <div className="eyebrow mb-3">The work</div>
          <p className="font-serif text-2xl leading-relaxed text-ink/85">{a.description}</p>
          <p className="mt-6 text-sm text-ink/60">
            Photographed in black and white and printed at scale on premium canvas, gallery-framed and wired ready
            to hang. A study in form, light and texture.
          </p>
        </div>
        <div>
          <div className="eyebrow mb-3">Details</div>
          <dl className="divide-y divide-line text-sm">
            {[
              ["Medium", a.medium],
              ["Edition", `${a.editionSize} (numbered, certified)`],
              ["Dimensions", `${a.size} (custom sizes available)`],
              ["Framing", "No frame / Black / Oak / White floating frame"],
              ["From", formatAUD(fromPrice(a.orientation))],
              ["Authenticity", "Signed Certificate of Authenticity + provenance record"],
              ["Suited to", "Residences, boutique hotels, corporate reception and workspaces, healthcare lobbies and corridors"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-6 py-3">
                <dt className="text-ink/50">{k}</dt><dd className="text-right text-ink/80">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <NitaNote audience={`See ${a.title} and the rest of the series in person.`} />

      <JournalLinks heading="Guides for buyers" />

      <nav aria-label="All works" className="mt-12 max-w-3xl border-t border-line pt-8">
        <div className="eyebrow mb-3">More works by Nick Brand</div>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {artworks.filter((x) => x.slug !== a.slug).map((x) => (
            <li key={x.slug}><Link href={`/artworks/${x.slug}/`} className="underline underline-offset-4 hover:text-ink/70">{x.title}</Link></li>
          ))}
        </ul>
      </nav>

      {/* Related */}
      {related(a).length > 0 && (
        <div className="mt-24">
          <h2 className="mb-10 font-serif text-3xl">Related works</h2>
          <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-3">
            {related(a).map((r) => <ArtworkCard key={r.slug} a={r} />)}
          </div>
        </div>
      )}
    </div>
  );
}
