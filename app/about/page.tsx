import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Nick Brand — Fine Art Bodyscape Photographer, Sydney",
  description: "Nick Brand is a Sydney fine-art photographer with 20+ years' experience, creating black-and-white bodyscapes — abstract studies of the human form, in limited editions.",
};

const personSchema = {
  "@context": "https://schema.org", "@type": "Person", name: "Nick Brand",
  jobTitle: "Fine Art Photographer", address: { "@type": "PostalAddress", addressLocality: "Sydney", addressCountry: "AU" },
  description: "Sydney fine-art photographer creating black-and-white abstract bodyscapes of the human form, in strictly limited editions.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-content px-5 py-16 md:px-10">
      <JsonLd data={personSchema} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
      <div className="grid items-start gap-14 md:grid-cols-[1fr_1.2fr]">
        <Image src="/about/nick-brand.jpg" alt="Nick Brand, fine art photographer, Sydney"
          width={1200} height={1200} sizes="(max-width: 768px) 100vw, 40vw"
          className="h-auto w-full shadow-[0_40px_70px_-40px_rgba(0,0,0,0.5)]" />
        <div>
          <div className="eyebrow mb-3">The artist behind Fifty Pages of Shades</div>
          <h1 className="font-serif text-5xl leading-tight">Nick Brand</h1>
          <p className="mt-6 font-serif text-2xl leading-relaxed text-ink/85">
            Nick Brand is a Sydney fine-art photographer with more than twenty years behind the camera. Bodyscapes
            is the body of work he returns to again and again: the human form as abstraction, photographed in black
            and white and treated the way a landscape photographer treats a coastline or a dune field.
          </p>
          <div className="mt-8 space-y-5 text-ink/65">
            <p>Every bodyscape begins with a refusal of the obvious. Nick photographs the body not to depict a person,
              but to find the landscape hidden in it — the ridge of a shoulder reading as a horizon, the fall of light
              across skin reading as weather.</p>
            <p>Working entirely in black and white, Nick strips each image to its essentials. Monochrome removes the
              distraction of colour and leaves only what matters — light, shadow, line and texture. What remains is a
              study in form: quiet, deliberate, and timeless.</p>
            <p>Each work is printed as a limited edition of 15 on premium canvas, gallery-framed and wired ready to
              hang, in custom sizes with a choice of frames. Every piece is accompanied by a signed Certificate of
              Authenticity and a provenance record.</p>
            <p className="text-ink/80">The work is abstract and tasteful — celebrating the human form as a source of
              line, light and texture, not as nudity, and not as boudoir or glamour photography. The body is the
              material; form is the subject.</p>
          </div>
          <div className="mt-10 flex gap-3">
            <Link href="/artworks" className="border border-ink bg-ink px-6 py-3 text-xs uppercase tracking-widest2 text-paper transition hover:bg-transparent hover:text-ink">View the Works</Link>
            <Link href="/contact" className="border border-line px-6 py-3 text-xs uppercase tracking-widest2 text-ink/70 transition hover:border-ink hover:text-ink">Enquire</Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-widest2 text-ink/50">
            <Link href="/about/exhibitions/" className="hover:text-ink">Exhibitions</Link>
            <Link href="/about/press/" className="hover:text-ink">Press</Link>
            <Link href="/about/awards-and-recognition/" className="hover:text-ink">Awards &amp; Recognition</Link>
            <Link href="/testimonials/" className="hover:text-ink">Testimonials</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
