import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Glossary of Fine Art Photography & Collecting Terms",
  description: "Plain-English definitions of bodyscape, edition, provenance, giclée, archival, certificate of authenticity and more — for collectors and designers.",
};

const terms: [string, string][] = [
  ["Bodyscape", "A photograph of the human form abstracted until it reads as landscape; skin, light and line composed so the body becomes terrain. A genre of fine-art photography, distinct from nude or portrait work."],
  ["Abstract photographic art", "Photography valued for its formal qualities — light, line, tone, texture — rather than for depicting a recognisable subject."],
  ["Limited edition", "A work released in a fixed, stated number of prints, after which the edition is closed and never reprinted."],
  ["Open edition", "A work reproduced without a fixed limit; not scarce, and generally not collectible in the investment sense."],
  ["Edition number", "The unique number of an individual print within its edition, written as, for example, 3/15 (the third of fifteen)."],
  ["Artist's proof (AP)", "A small number of prints made alongside the numbered edition for the artist's use, marked AP and sitting outside the edition count."],
  ["Certificate of authenticity (COA)", "A signed document recording a work's title, edition number and details, confirming it is a genuine, authorised print."],
  ["Provenance", "The documented ownership history of an artwork, supporting its authenticity and value."],
  ["Giclée", "A high-quality inkjet printing process using archival pigment inks, used for fine-art reproduction."],
  ["Archival", "Materials and processes designed to resist fading and deterioration, so a work lasts for decades or longer."],
  ["Canvas print", "An image printed onto artist's canvas, then stretched or framed; light and matte, well-suited to large-scale work."],
  ["Gallery framing", "Professional framing finished to exhibition standard, delivered ready to hang."],
  ["Floating frame", "A frame in which the canvas sits with a small visible gap, so the work appears to float within the frame."],
  ["Diptych / triptych", "A single artwork composed across two (diptych) or three (triptych) panels."],
  ["In situ", "A view of an artwork shown installed in a real interior, to convey scale and placement."],
  ["Commission", "An original work created to a client's brief for a specific space, collection or project."],
  ["Trade program", "A scheme offering interior designers, architects and other professionals preferred pricing and project support."],
];

export default function Glossary() {
  const schema = {
    "@context": "https://schema.org", "@type": "DefinedTermSet", name: "Bodyscapes Glossary",
    url: `${site.url}/resources/glossary`,
    hasDefinedTerm: terms.map(([t, d]) => ({ "@type": "DefinedTerm", name: t, description: d })),
  };
  return (
    <div className="mx-auto max-w-content px-5 py-16 md:px-10">
      <JsonLd data={schema} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Resources" }, { label: "Glossary" }]} />
      <div className="eyebrow mb-3">Resources</div>
      <h1 className="font-serif text-5xl">Glossary</h1>
      <p className="mt-4 max-w-2xl text-ink/60">Plain-English definitions of the terms used in collecting fine art photography.</p>
      <dl className="mt-12 max-w-3xl divide-y divide-line border-t border-line">
        {terms.map(([t, d]) => (
          <div key={t} className="grid gap-1 py-5 md:grid-cols-[200px_1fr] md:gap-8">
            <dt className="font-serif text-xl">{t}</dt>
            <dd className="text-sm leading-relaxed text-ink/65">{d}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
