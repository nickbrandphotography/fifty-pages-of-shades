import type { Metadata } from "next";
import Link from "next/link";
import { collections } from "@/lib/catalog";
import CollectionTile from "@/components/CollectionTile";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Bodyscape & Abstract Art Collections",
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
      <div className="mt-20 max-w-3xl space-y-4 text-sm leading-relaxed text-ink/65">
        <h2 className="font-serif text-3xl text-ink">About the collections</h2>
        <p>
          Fifty Pages of Shades is the fine-art photography of Nick Brand, a Sydney photographer with more than twenty years&apos;
          experience. <Link href="/collections/bodyscapes/" className="underline">Bodyscapes</Link> is the signature series, where the
          human form is photographed until it reads as landscape. <Link href="/collections/abstract-forms/" className="underline">Abstract
          Forms</Link> lets the figure go entirely, leaving light, line and texture.
        </p>
        <p>
          Every work is a limited edition of 15, printed in black and white on canvas, gallery-framed in custom sizes, and supplied with a
          signed Certificate of Authenticity. The work is abstract and tasteful, never nude or boudoir. It suits private collectors,{" "}
          <Link href="/for-designers/" className="underline">interior designers and architects</Link>,{" "}
          <Link href="/for-designers/corporate-art/" className="underline">corporate spaces</Link> and{" "}
          <Link href="/healthcare-art/" className="underline">hospitals and clinics</Link>.
        </p>
        <p>
          New to collecting? Read the <Link href="/collectors/collector-guide/" className="underline">collector&apos;s guide</Link> or browse
          all <Link href="/artworks/" className="underline">available works</Link>. To see the work in person, visit{" "}
          <Link href="/about/exhibitions/" className="underline">NITA Gallery in Surry Hills, Sydney</Link>.
        </p>
      </div>
    </div>
  );
}
