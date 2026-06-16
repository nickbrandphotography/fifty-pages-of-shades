"use client";
import { useMemo, useState } from "react";
import { Artwork } from "@/lib/catalog";
import ArtworkCard from "@/components/ArtworkCard";

export default function GalleryFilter({ artworks, collections }: {
  artworks: Artwork[]; collections: { slug: string; title: string }[];
}) {
  const [coll, setColl] = useState("all");
  const [orient, setOrient] = useState("all");
  const [sort, setSort] = useState("featured");

  const shown = useMemo(() => {
    let list = artworks.filter((a) =>
      (coll === "all" || a.collection === coll) && (orient === "all" || a.orientation === orient));
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "featured") list = [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
    return list;
  }, [artworks, coll, orient, sort]);

  const pill = (active: boolean) =>
    `border px-3 py-1.5 text-xs uppercase tracking-widest2 transition ${active ? "border-ink bg-ink text-paper" : "border-line text-ink/60 hover:border-ink"}`;

  return (
    <div>
      <div className="mb-10 flex flex-wrap items-center gap-2">
        <button className={pill(coll === "all")} onClick={() => setColl("all")}>All</button>
        {collections.map((c) => (
          <button key={c.slug} className={pill(coll === c.slug)} onClick={() => setColl(c.slug)}>{c.title}</button>
        ))}
        <span className="mx-2 h-4 w-px bg-line" />
        <button className={pill(orient === "all")} onClick={() => setOrient("all")}>Any shape</button>
        <button className={pill(orient === "landscape")} onClick={() => setOrient("landscape")}>Landscape</button>
        <button className={pill(orient === "square")} onClick={() => setOrient("square")}>Square</button>
        <span className="ml-auto" />
        <select value={sort} onChange={(e) => setSort(e.target.value)}
          className="border border-line bg-paper px-3 py-1.5 text-xs uppercase tracking-widest2 text-ink/70">
          <option value="featured">Featured</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </div>
      <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((a) => <ArtworkCard key={a.slug} a={a} />)}
      </div>
    </div>
  );
}
