import Link from "next/link";
import Image from "next/image";
import { Collection, artworksIn } from "@/lib/catalog";

export default function CollectionTile({ c }: { c: Collection }) {
  const cover = artworksIn(c.slug)[0];
  return (
    <Link href={`/collections/${c.slug}/`} className="group block">
      <div className="flex aspect-[3/4] items-center justify-center overflow-hidden bg-ink/[0.03]">
        {cover && (
          <Image src={cover.thumb} alt={c.title} width={cover.pixels.w} height={cover.pixels.h}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="h-auto max-h-[90%] w-auto max-w-[90%] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] transition duration-700 group-hover:scale-[1.03]" />
        )}
      </div>
      <div className="mt-5">
        <h3 className="font-serif text-2xl">{c.title}</h3>
        <p className="mt-1 text-sm text-ink/55">{c.tagline}</p>
        <span className="mt-3 inline-block text-xs uppercase tracking-widest2 text-ink/60 group-hover:text-ink">
          View {c.count} works →
        </span>
      </div>
    </Link>
  );
}
