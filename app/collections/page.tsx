import type { Metadata } from "next";
import { collections } from "@/lib/catalog";
import CollectionTile from "@/components/CollectionTile";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Collections — Black-and-White Bodyscape & Abstract Art",
  description: "Explore Nick Brand's collections of black-and-white bodyscape and abstract photographic art. Limited editions on framed canvas, in custom sizes.",
};

export default function CollectionsPage() {
  return (
    <div className="mx-auto max-w-content px-5 py-16 md:px-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Collections" }]} />
      <div className="eyebrow mb-3">The Collections</div>
      <h1 className="max-w-2xl font-serif text-5xl leading-tight">Two bodies of work, one visual language</h1>
      <p className="mt-5 max-w-2xl text-ink/60">
        Each collection explores the human form as abstraction — skin, light and line rendered in black and white,
        then printed at scale on framed canvas.
      </p>
      <div className="mt-16 grid gap-10 md:grid-cols-2">
        {collections.map((c) => <CollectionTile key={c.slug} c={c} />)}
      </div>
    </div>
  );
}
