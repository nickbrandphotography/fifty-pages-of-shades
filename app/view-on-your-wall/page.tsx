import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import WallVisualiser, { type VisArt } from "@/components/WallVisualiser";
import { artworks } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "View on Your Wall",
  description:
    "Photograph your wall and see any Fifty Pages of Shades work on it at true size. Shown in the oak shadow frame, or try canvas or paper in other frames, with live pricing.",
};

export default function ViewOnYourWallPage() {
  const list: VisArt[] = artworks.map((a) => ({
    slug: a.slug, title: a.title, image: a.image, thumb: a.thumb, pixels: a.pixels, status: a.status, size: a.size,
  }));
  return (
    <div className="mx-auto max-w-content px-5 py-12 md:px-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Available Works", href: "/artworks" }, { label: "View on your wall" }]} />
      <div className="mb-10 max-w-2xl">
        <div className="eyebrow mb-3">Try before you buy</div>
        <h1 className="font-serif text-4xl md:text-5xl">View on your wall</h1>
        <p className="mt-4 text-ink/60">
          See any work in your own room at its real size. Swipe through the collection and try different frames, mat
          boards and glass.
        </p>
      </div>
      <WallVisualiser artworks={list} />
    </div>
  );
}
