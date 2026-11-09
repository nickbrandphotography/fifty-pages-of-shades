import Link from "next/link";
import { site } from "@/lib/site";

/** "See it in person" panel. Used wherever a buyer might want to view the work before deciding. */
export default function NitaNote({ audience }: { audience?: string }) {
  const n = site.nita;
  return (
    <aside className="mt-16 max-w-3xl border border-line p-8" aria-labelledby="nita-note-h">
      <div className="eyebrow mb-2">Now showing in Sydney</div>
      <h2 id="nita-note-h" className="font-serif text-3xl">See Fifty Pages of Shades at {n.name}</h2>
      <p className="mt-3 text-sm leading-relaxed text-ink/65">
        The work is showing at <a href={n.url} className="underline">{n.name}</a>, {n.street}, {n.suburb} {n.region} {n.postcode}.
        {audience ? ` ${audience}` : " See the scale, the black-and-white tones and the framing for yourself."}{" "}
        Open {n.hours}.
      </p>
      <p className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-widest2 text-ink/70">
        <Link href="/about/exhibitions/" className="hover:text-ink">Visit details →</Link>
        <a href={n.mapUrl} className="hover:text-ink">Directions →</a>
        <a href={`tel:${n.phoneIntl}`} className="hover:text-ink">Call {n.phone} →</a>
      </p>
    </aside>
  );
}
