import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import Faq from "@/components/Faq";

export const metadata: Metadata = {
  title: "Frequently Asked Questions — Buying Bodyscape Art",
  description: "Answers on bodyscape art, limited editions, sizing, framing, pricing, delivery, trade and commissions — by Sydney artist Nick Brand.",
};

const groups: { title: string; items: { q: string; a: string }[] }[] = [
  { title: "About the work", items: [
    { q: "What is a bodyscape?", a: "A bodyscape is a photograph of the human form abstracted until it reads as landscape — skin, light and line composed so the body becomes terrain rather than portrait. Nick Brand's bodyscapes are made in black and white." },
    { q: "Are bodyscapes nude photography?", a: "No. They are abstract fine-art studies of form. The body is the material, not the subject; the work is tasteful and abstract, not nude, boudoir or glamour photography." },
    { q: "What is abstract photographic art?", a: "Photography made for its formal qualities — light, line, tone and texture — rather than to depict a recognisable subject." },
    { q: "Why black and white?", a: "Monochrome removes the distraction of colour, leaving light, shadow, line and texture — which lets the body read as pure form." },
  ]},
  { title: "Editions and authenticity", items: [
    { q: "What is a limited edition?", a: "A fixed number of prints of a work — for Bodyscapes, an edition of 15. Once all are sold, the edition closes permanently and is never reprinted, which makes each work scarce." },
    { q: "Why does edition size matter?", a: "The smaller the edition, the rarer each work — a key driver of collectible value over time." },
    { q: "Do works come with a certificate of authenticity?", a: "Yes. Every work includes a signed Certificate of Authenticity and a provenance record stating the title, edition number and details." },
  ]},
  { title: "Sizes, framing and materials", items: [
    { q: "What are the works printed on?", a: "Premium canvas, printed in black and white, gallery-framed and wired ready to hang." },
    { q: "Can I get a custom size?", a: "Yes. Because the work is on canvas, almost any dimension is possible. Share your wall size and we will advise." },
    { q: "What frames are available?", a: "A choice of frames — no frame (gallery wrap), black, natural oak or white floating frame — to suit your interior. Every work arrives framed and ready to hang." },
    { q: "How do I choose the right size for my wall?", a: "As a guide, a feature work should fill about two-thirds of the wall or furniture below it, hung with its centre near eye level (about 145 to 150 cm). Send your dimensions and we will recommend a size." },
  ]},
  { title: "Buying, pricing and delivery", items: [
    { q: "How much do the works cost?", a: "Prices are shown on each work and start from $1,700, with the final price set by the size and frame you choose." },
    { q: "How do I buy or enquire?", a: "Send an enquiry from any work. The studio replies personally, usually within one business day, to confirm price, reserve a piece, or answer questions." },
    { q: "Do you ship internationally?", a: "Yes. Delivery is Australia-wide and worldwide on request, packed and protected for safe transit." },
  ]},
  { title: "Trade and commissions", items: [
    { q: "Do you offer trade pricing for designers?", a: "Yes, for approved interior designers, architects, developers and art consultants. Apply for a trade account." },
    { q: "Can I commission a bespoke work?", a: "Yes. Nick accepts a limited number of commissions each year, created within the abstract black-and-white language of the work." },
  ]},
];

export default function FAQPage() {
  const all = groups.flatMap((g) => g.items);
  return (
    <div className="mx-auto max-w-content px-5 py-16 md:px-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Resources" }, { label: "FAQ" }]} />
      <div className="eyebrow mb-3">Resources</div>
      <h1 className="font-serif text-5xl">Frequently Asked Questions</h1>
      {/* One FAQPage schema for the whole page */}
      <div className="mt-12 max-w-2xl space-y-12">
        {groups.map((g, i) => (
          <div key={g.title}>
            <h2 className="mb-5 font-serif text-2xl">{g.title}</h2>
            <Faq items={g.items} schema={false} />
          </div>
        ))}
      </div>
      <div className="hidden"><Faq items={all} /></div>
    </div>
  );
}
