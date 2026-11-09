import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContactForm from "@/components/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact, Trade & Commissions",
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
            Nick Brand · Fifty Pages of Shades<br />Sydney, Australia<br />
            <a href={`mailto:${site.email}`} className="underline">{site.email}</a><br />
            Phone: <a href={`tel:${site.nita.phoneIntl}`} className="underline">{site.nita.phone}</a>
          </div>
          <div className="mt-8 text-sm text-ink/70">
            <div className="eyebrow mb-2">See the work in person</div>
            Now showing at <a href={site.nita.url} className="underline">{site.nita.name}</a><br />
            {site.nita.street}, {site.nita.suburb} {site.nita.region} {site.nita.postcode}<br />
            Open {site.nita.hours}.<br />
            <a href={site.nita.mapUrl} className="underline">Directions</a> · <Link href="/about/exhibitions/" className="underline">Visit details</Link>
          </div>
          <p className="mt-8 max-w-md text-sm text-ink/60">
            Looking for something specific? See the <Link href="/for-designers/" className="underline">interior designer trade program</Link>,{" "}
            <Link href="/for-designers/corporate-art/" className="underline">corporate art</Link>,{" "}
            <Link href="/healthcare-art/" className="underline">art for hospitals and healthcare</Link> or{" "}
            <Link href="/commissions/" className="underline">commissions</Link>, or read the <Link href="/resources/faq/" className="underline">FAQ</Link>.
          </p>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
