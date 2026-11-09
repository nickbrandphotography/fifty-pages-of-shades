import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { Lede, Section } from "@/components/Prose";
import Faq from "@/components/Faq";
import NitaNote from "@/components/NitaNote";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Art for Hospitals & Healthcare",
  description: "Calm, abstract black-and-white art for hospitals, clinics and healthcare interiors. Glass-free framed canvas, custom sizes, delivered across Australia.",
};

// Only claims that follow from how the work is made. Facility-specific requirements are quoted per project.
const faqs = [
  { q: "Can you supply art for hospitals, clinics and other healthcare facilities?", a: "Yes. Fifty Pages of Shades supplies original black-and-white art for hospitals, day surgeries, specialist clinics, wellness centres and aged-care interiors, with custom sizes and project-managed delivery." },
  { q: "Is the imagery suitable for a patient and family setting?", a: "The work is abstract, tasteful monochrome form, never explicit, nude, boudoir or glamour photography. Because tastes and sensitivities differ by ward and by client, we work with you to select images that suit each space, and you can view the work before you decide." },
  { q: "Is the art glazed?", a: "No. The work is printed on canvas and finished in a floating frame without a glass front, so there is no glare from overhead lighting and no glass to break." },
  { q: "Can you meet our facility's cleaning, mounting and security requirements?", a: "Send us your specification. Requirements for cleaning, tamper-resistant fixings or wall loading differ between facilities, so we confirm what is possible in writing before any order is placed." },
  { q: "Can the same image be used across several wards, floors or sites?", a: "Yes. We can scale one image to suit different spaces, or build a cohesive scheme across floors, buildings or sites, with one point of contact." },
  { q: "Do you work with healthcare architects, designers and art consultants?", a: "Yes. Approved professionals can apply for trade pricing. See the trade program for how it works." },
  { q: "Where can I see the work before specifying it?", a: "Fifty Pages of Shades is showing at NITA Gallery, 68 Campbell Street, Surry Hills, Sydney. Private viewings can be arranged, including outside opening hours." },
];

export default function HealthcareArt() {
  const service = {
    "@context": "https://schema.org", "@type": "Service",
    name: "Art for hospitals and healthcare spaces",
    serviceType: "Art supply for healthcare interiors",
    description: "Original black-and-white abstract photographic art on framed canvas for hospitals, clinics and healthcare interiors, in custom sizes, supplied and delivered by the studio.",
    url: `${site.url}/healthcare-art/`,
    provider: { "@type": "Organization", name: site.name, url: site.url },
    areaServed: [{ "@type": "Country", name: "Australia" }],
    audience: { "@type": "Audience", audienceType: "Hospitals, healthcare facilities, healthcare architects and interior designers" },
  };
  const crumbs = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
      { "@type": "ListItem", position: 2, name: "Healthcare Art", item: `${site.url}/healthcare-art/` },
    ],
  };
  return (
    <div className="mx-auto max-w-content px-5 py-16 md:px-10">
      <JsonLd data={service} /><JsonLd data={crumbs} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "For Designers", href: "/for-designers" }, { label: "Healthcare Art" }]} />
      <div className="eyebrow mb-3">Healthcare Art</div>
      <h1 className="max-w-3xl font-serif text-5xl leading-tight">Calm art for hospitals and healthcare spaces</h1>
      <Lede>
        Waiting rooms, corridors, consulting suites and recovery spaces benefit from images that settle the eye. Fifty Pages of
        Shades supplies abstract black-and-white photographic art on framed canvas, in custom sizes, to hospitals, clinics,
        wellness centres and the architects and designers who fit them out.
      </Lede>

      <Section title="Why this work suits healthcare interiors">
        <p><strong>Quiet and abstract.</strong> Skin, light and line abstracted into landscape. There is no loud colour, no
          narrative and no explicit content, so the work sits calmly in spaces where people may be anxious or waiting.</p>
        <p><strong>No glass.</strong> Printed on canvas and set in a floating frame without glazing, the work has no glare under
          overhead lighting and no glass to break.</p>
        <p><strong>Made to fit.</strong> Almost any dimension, with a choice of black, natural oak or white frames, or no frame
          (gallery wrap), so the work suits the wall and the palette of the fit-out.</p>
        <p><strong>Authentic and documented.</strong> Each work is a limited edition of 15, with a signed Certificate of
          Authenticity and a provenance record, which supports asset registers and art policies.</p>
      </Section>

      <Section title="Where it works">
        <p>Hospital entrances and atriums; waiting rooms and day-surgery lounges; corridors and lift lobbies; specialist and
          consulting suites; oncology, maternity and wellness centres; allied-health clinics; private hospitals; aged-care and
          rehabilitation facilities; staff rooms and board rooms.</p>
      </Section>

      <Section title="How a healthcare project runs">
        <ol className="mt-2 grid gap-6 sm:grid-cols-2">
          {[["Brief", "Tell us about the space, the audience, and any facility requirements for cleaning, fixings or approvals."],
            ["Select", "Choose images, sizes and frames. We can supply a shortlist and arrange a private viewing in Sydney."],
            ["Confirm", "Price, specification and timeline are confirmed in writing before any order is placed."],
            ["Deliver", "Gallery-framed, wired and delivered across Australia, with certificate of authenticity."]].map(([t, d], i) => (
            <li key={t}><div className="font-serif text-3xl text-stone">{i + 1}</div><div className="mt-1 font-serif text-lg">{t}</div><p className="mt-1 text-sm text-ink/60">{d}</p></li>
          ))}
        </ol>
      </Section>

      <div className="mt-16 max-w-2xl">
        <h2 className="mb-6 font-serif text-3xl">Common questions</h2>
        <Faq items={faqs} />
      </div>

      <NitaNote audience="Healthcare buyers and their architects and designers are welcome to view the work at scale." />

      <div className="mt-12 flex flex-wrap gap-3">
        <Link href="/contact/" className="border border-ink bg-ink px-6 py-3 text-xs uppercase tracking-widest2 text-paper transition hover:bg-transparent hover:text-ink">Request a healthcare proposal</Link>
        <Link href="/for-designers/" className="border border-line px-6 py-3 text-xs uppercase tracking-widest2 text-ink/70 transition hover:border-ink hover:text-ink">Trade program</Link>
        <Link href="/large-scale-art/" className="border border-line px-6 py-3 text-xs uppercase tracking-widest2 text-ink/70 transition hover:border-ink hover:text-ink">Large Scale Art</Link>
      </div>
    </div>
  );
}
