import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { exhibitions } from "@/lib/authority";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Exhibitions — Where to See Nick Brand's Bodyscapes",
  description: "Where Nick Brand's bodyscape art is currently exhibited across Sydney. Original black-and-white photographic art on framed canvas.",
};

export default function Exhibitions() {
  return (
    <div className="mx-auto max-w-content px-5 py-16 md:px-10">
      {exhibitions.map((e, i) => (
        <JsonLd key={i} data={{ "@context": "https://schema.org", "@type": "Event", name: `${e.venue}, ${e.suburb}`,
          location: { "@type": "Place", name: e.venue, address: e.suburb }, description: e.note }} />
      ))}
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Exhibitions" }]} />
      <div className="eyebrow mb-3">Exhibitions</div>
      <h1 className="font-serif text-5xl">Where to see the work</h1>
      {exhibitions.length === 0 ? (
        <p className="mt-6 max-w-2xl font-serif text-2xl leading-relaxed text-ink/80">
          Nick Brand's bodyscapes are shown in selected spaces across Sydney, where the work can be seen at scale and in
          setting. New showings are added throughout the year — to arrange a viewing or see available works in person,
          <Link href="/contact/" className="underline"> get in touch</Link>.
        </p>
      ) : (
        <ul className="mt-12 max-w-2xl divide-y divide-line border-t border-line">
          {exhibitions.map((e, i) => (
            <li key={i} className="py-6">
              <div className="font-serif text-2xl">{e.venue}</div>
              <div className="mt-1 text-sm text-ink/55">{e.suburb} · {e.dates}</div>
              {e.note && <p className="mt-2 text-sm text-ink/65">{e.note}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
