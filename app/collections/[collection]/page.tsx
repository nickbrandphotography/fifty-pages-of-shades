import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { collections, getCollection, artworksIn } from "@/lib/catalog";
import ArtworkCard from "@/components/ArtworkCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return collections.map((c) => ({ collection: c.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ collection: string }> }): Promise<Metadata> {
  const { collection } = await params;
  const c = getCollection(collection);
  if (!c) return {};
  return { title: `${c.title} — Nick Brand`, description: c.intro };
}

export default async function CollectionPage({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  const c = getCollection(collection);
  if (!c) notFound();
  const works = artworksIn(c.slug);
  const schema = {
    "@context": "https://schema.org", "@type": "CollectionPage", name: c.title, description: c.intro,
    url: `${site.url}/collections/${c.slug}`,
    mainEntity: { "@type": "ItemList", numberOfItems: works.length,
      itemListElement: works.map((w, i) => ({ "@type": "ListItem", position: i + 1, name: w.title, url: `${site.url}/artworks/${w.slug}` })) },
  };
  return (
    <div className="mx-auto max-w-content px-5 py-16 md:px-10">
      <JsonLd data={schema} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Collections", href: "/collections" }, { label: c.title }]} />
      <div className="eyebrow mb-3">Collection</div>
      <h1 className="font-serif text-5xl">{c.title}</h1>
      <p className="mt-5 max-w-3xl font-serif text-2xl leading-relaxed text-ink/80">{c.intro}</p>
      <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {works.map((a) => <ArtworkCard key={a.slug} a={a} />)}
      </div>
    </div>
  );
}
