import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact — Enquiries, Trade & Commissions",
  description: "Enquire about a work, apply for a trade account, or request a commission. Nick Brand's studio replies personally, usually within one business day.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-content px-5 py-16 md:px-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <div className="grid gap-14 md:grid-cols-2">
        <div>
          <div className="eyebrow mb-3">Start a conversation</div>
          <h1 className="font-serif text-5xl leading-tight">Enquire</h1>
          <p className="mt-6 max-w-md text-ink/60">
            Whether you are acquiring your first piece, sourcing for a project, or commissioning something bespoke,
            the studio replies personally — usually within one business day. There is no pressure and no sales script.
          </p>
          <div className="mt-8 text-sm text-ink/70">
            <div className="eyebrow mb-2">Studio</div>
            Nick Brand · Fifty Pages of Shades<br />Sydney, Australia<br />hello@bodyscapes.com.au
          </div>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
