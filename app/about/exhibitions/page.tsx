import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import Faq from "@/components/Faq";
import { exhibitions } from "@/lib/authority";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Now Showing at NITA Gallery, Sydney",
  description: "See Nick Brand's Fifty Pages of Shades at NITA Gallery, 68 Campbell Street, Surry Hills, Sydney. Opening hours, directions and private viewings.",
};

const n = site.nita;

const faqs = [
  { q: "Where can I see Fifty Pages of Shades in Sydney?", a: `Fifty Pages of Shades by Nick Brand is showing at ${n.name}, ${n.street}, ${n.suburb} ${n.region} ${n.postcode}.` },
  { q: "What are the opening hours?", a: `${n.name} is open ${n.hours}.` },
  { q: "Can I arrange a private viewing for a project?", a: `Yes. Interior designers, architects, corporate and healthcare buyers and collectors can arrange a time, including outside the usual hours. Call Nick on ${n.phone} or write to ${site.email}.` },
  { q: "Is parking available near the gallery?", a: "Parking is difficult nearby. Central and Museum stations are close, and there is a car park across the road." },
];

export default function Exhibitions() {
  const gallery = {
    "@context": "https://schema.org", "@type": "ArtGallery", "@id": `${n.url}/#gallery`, name: n.name, url: n.url,
    telephone: n.phoneIntl, hasMap: n.mapUrl,
    address: { "@type": "PostalAddress", streetAddress: n.street, addressLocality: n.suburb, addressRegion: n.region, postalCode: n.postcode, addressCountry: "AU" },
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Tuesday", "Wednesday", "Friday"], opens: "10:00", closes: "18:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Thursday", opens: "10:00", closes: "20:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "10:00", closes: "15:00" },
    ],
  };
  return (
    <div className="mx-auto max-w-content px-5 py-16 md:px-10">
      <JsonLd data={gallery} />
      {/* Event markup needs a real start date. It switches on only when one is added in lib/authority.ts. */}
      {exhibitions.filter((e) => e.start).map((e, i) => (
        <JsonLd key={i} data={{
          "@context": "https://schema.org", "@type": "ExhibitionEvent", name: `Fifty Pages of Shades at ${e.venue}`,
          startDate: e.start, ...(e.end ? { endDate: e.end } : {}), description: e.note,
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          eventStatus: "https://schema.org/EventScheduled",
          location: { "@id": `${n.url}/#gallery` },
          performer: { "@type": "Person", name: "Nick Brand" },
          organizer: { "@type": "Organization", name: site.name, url: site.url },
          isAccessibleForFree: true,
        }} />
      ))}
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Exhibitions" }]} />
      <div className="eyebrow mb-3">Exhibitions</div>
      <h1 className="font-serif text-5xl">Now showing at NITA Gallery, Sydney</h1>
      {exhibitions.length === 0 ? (
        <p className="mt-6 max-w-2xl font-serif text-2xl leading-relaxed text-ink/80">
          Nick Brand's bodyscapes are shown in selected spaces across Sydney. To arrange a viewing,
          <Link href="/contact/" className="underline"> get in touch</Link>.
        </p>
      ) : (
        <ul className="mt-12 max-w-2xl divide-y divide-line border-t border-line">
          {exhibitions.map((e, i) => (
            <li key={i} className="py-6">
              <div className="font-serif text-2xl">{e.url ? <a href={e.url} className="underline decoration-line underline-offset-4">{e.venue}</a> : e.venue}</div>
              <div className="mt-1 text-sm text-ink/55">{e.suburb} · {e.dates}</div>
              {e.address && <div className="mt-1 text-sm text-ink/55">{e.address.street}, {e.address.locality} {e.address.region} {e.address.postcode}</div>}
              {e.note && <p className="mt-2 text-sm text-ink/65">{e.note}</p>}
            </li>
          ))}
        </ul>
      )}

      <section className="mt-16 grid max-w-3xl gap-10 md:grid-cols-2">
        <div>
          <h2 className="font-serif text-3xl">Visit</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink/65">
            {n.name}<br />{n.street}<br />{n.suburb} {n.region} {n.postcode}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink/65">Open {n.hours}.</p>
          <p className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-widest2 text-ink/70">
            <a href={n.mapUrl} className="hover:text-ink">Directions →</a>
            <a href={n.pageUrl} className="hover:text-ink">On the NITA Gallery site →</a>
          </p>
        </div>
        <div>
          <h2 className="font-serif text-3xl">Private viewings</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink/65">
            Specifying for a client, a workplace or a healthcare space? See the work at full scale and talk it through with
            Nick. Call <a href={`tel:${n.phoneIntl}`} className="underline">{n.phone}</a> or write to{" "}
            <a href={`mailto:${site.email}`} className="underline">{site.email}</a>.
          </p>
          <p className="mt-3 text-sm text-ink/65">
            <Link href="/for-designers/" className="underline">Trade program</Link> ·{" "}
            <Link href="/for-designers/corporate-art/" className="underline">Corporate art</Link> ·{" "}
            <Link href="/healthcare-art/" className="underline">Healthcare art</Link>
          </p>
        </div>
      </section>

      <div className="mt-16 max-w-2xl">
        <h2 className="mb-6 font-serif text-3xl">Common questions</h2>
        <Faq items={faqs} />
      </div>
    </div>
  );
}
