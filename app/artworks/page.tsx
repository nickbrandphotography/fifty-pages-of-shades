import type { Metadata } from "next";
import { artworks, collections } from "@/lib/catalog";
import GalleryFilter from "@/components/GalleryFilter";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Available Works — Buy Black-and-White Fine Art Photography",
  description: "Browse available black-and-white bodyscape and abstract artworks by Nick Brand. Limited editions on framed canvas, custom sizes, priced from.",
};

export default function ArtworksPage() {
  return (
    <div className="mx-auto max-w-content px-5 py-16 md:px-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Available Works" }]} />
      <div className="eyebrow mb-3">Available Works</div>
      <h1 className="mb-12 font-serif text-5xl">The gallery</h1>
      <GalleryFilter artworks={artworks} collections={collections.map((c) => ({ slug: c.slug, title: c.title }))} />
    </div>
  );
}
