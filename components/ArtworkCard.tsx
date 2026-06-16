import Link from "next/link";
import Image from "next/image";
import { Artwork, fromPrice, formatAUD, editionLabel } from "@/lib/catalog";

export default function ArtworkCard({ a }: { a: Artwork }) {
  return (
    <Link href={`/artworks/${a.slug}/`} className="group block">
      <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-paper">
        <Image
          src={a.thumb} alt={`${a.title} — black and white photographic artwork by Nick Brand`}
          width={a.pixels.w} height={a.pixels.h}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="h-auto w-auto max-h-full max-w-full shadow-[0_24px_50px_-28px_rgba(0,0,0,0.55)] transition duration-700 group-hover:scale-[1.02]"
        />
      </div>
      <div className="mt-4">
        <div className="font-serif text-lg leading-snug">{a.title}</div>
        {a.description && (
          <p className="mt-1 max-w-prose text-sm italic leading-relaxed text-ink/55">{a.description}</p>
        )}
        <div className="mt-2 text-xs text-ink/50">{a.size} · {editionLabel(a)}</div>
        <div className="mt-1 text-sm text-ink/70">From {formatAUD(fromPrice(a.orientation))}</div>
      </div>
    </Link>
  );
}
