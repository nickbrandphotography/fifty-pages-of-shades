import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Lede, Section } from "@/components/Prose";
import Faq from "@/components/Faq";

export const metadata: Metadata = {
  title: "Corporate Art — Statement Photography for Workspaces",
  description: "Curated black-and-white bodyscape art for offices, lobbies, hotels and developments. Custom sizes on framed canvas, trade terms, project-managed by Nick Brand's studio.",
};

const faqs = [
  { q: "Do you supply art for offices and commercial spaces?", a: "Yes. 50 Pages of Shades provides original black-and-white art for corporate, hospitality and commercial interiors, at scale, project-managed end to end." },
  { q: "Can you handle multi-site or large orders?", a: "Yes, including cohesive schemes across floors, buildings or sites, and the same image scaled across spaces." },
  { q: "Is the work appropriate for a professional setting?", a: "Yes. It is abstract, tasteful monochrome form — distinctive and universally appropriate, never nude or boudoir." },
];

export default function CorporateArt() {
  return (
    <div className="mx-auto max-w-content px-5 py-16 md:px-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "For Designers", href: "/for-designers" }, { label: "Corporate Art" }]} />
      <div className="eyebrow mb-3">Corporate Art</div>
      <h1 className="max-w-3xl font-serif text-5xl leading-tight">Gallery-quality art for workspaces</h1>
      <Lede>
        50 Pages of Shades supplies original black-and-white photographic art for corporate and commercial spaces — offices,
        receptions, boardrooms, hotels, restaurants and developments. Abstract, tasteful and made at scale on framed canvas.
      </Lede>

      <Section title="Why companies choose 50 Pages of Shades">
        <p><strong>Brand-safe and universal.</strong> Abstract monochrome form suits any corporate environment — distinctive
          without being divisive. Never nude or boudoir; always appropriate for a public, professional setting.</p>
        <p><strong>Built for scale.</strong> Printed on canvas, the work commands large reception walls and lobbies while
          staying light and easy to install.</p>
        <p><strong>Project-managed.</strong> One point of contact from selection to install: sizing, framing, delivery and
          invoicing handled directly with the studio.</p>
        <p><strong>Volume and multi-site.</strong> Cohesive schemes across floors, buildings or multiple sites, including the
          same image scaled across spaces.</p>
      </Section>
      <Section title="Where it works">
        <p>Corporate receptions and lobbies; boardrooms and meeting rooms; executive offices; hotels and hospitality;
          restaurants and bars; co-working and wellness spaces; property developments and display suites.</p>
      </Section>

      <div className="mt-16 max-w-2xl">
        <h2 className="mb-6 font-serif text-3xl">Common questions</h2>
        <Faq items={faqs} />
      </div>
      <div className="mt-12 flex gap-3">
        <Link href="/contact/" className="border border-ink bg-ink px-6 py-3 text-xs uppercase tracking-widest2 text-paper transition hover:bg-transparent hover:text-ink">Request a proposal</Link>
        <Link href="/large-scale-art/" className="border border-line px-6 py-3 text-xs uppercase tracking-widest2 text-ink/70 transition hover:border-ink hover:text-ink">Large Scale Art</Link>
      </div>
    </div>
  );
}
