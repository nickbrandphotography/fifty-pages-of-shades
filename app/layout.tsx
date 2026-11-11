import type { Metadata } from "next";
import "./globals.css";
import { Cormorant_Garamond, Inter } from "next/font/google";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { site } from "@/lib/site";

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500"], display: "swap", variable: "--font-serif" });
const sans = Inter({ subsets: ["latin"], weight: ["400", "500"], display: "swap", variable: "--font-sans" });

const ogImage = { url: "/artworks/hidden-seams.jpg", width: 1800, height: 1800, alt: "Hidden Seams, a black and white abstract photograph by Nick Brand" };

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Fifty Pages of Shades | Fine Art Photography, Sydney", template: "%s | Fifty Pages of Shades" },
  description: site.description,
  // "./" resolves to each page's own URL, so every page gets a self-referencing canonical.
  alternates: { canonical: "./" },
  openGraph: { title: "Fifty Pages of Shades", description: site.description, siteName: "Fifty Pages of Shades", type: "website", locale: "en_AU", images: [ogImage] },
  twitter: { card: "summary_large_image", title: "Fifty Pages of Shades", description: site.description, images: [ogImage.url] },
};

const personId = `${site.url}/#nick-brand`;
const orgId = `${site.url}/#organization`;

const orgSchema = {
  "@context": "https://schema.org", "@type": "Organization", "@id": orgId, name: "Fifty Pages of Shades", url: site.url,
  description: site.description,
  founder: { "@id": personId },
  email: site.email,
  sameAs: site.sameAs,
  areaServed: [{ "@type": "Country", name: "Australia" }, { "@type": "Place", name: "Worldwide" }],
  knowsAbout: ["Fine art photography", "Abstract photography", "Black-and-white photography", "Limited edition art", "Art for interiors", "Corporate art", "Healthcare art"],
  contactPoint: { "@type": "ContactPoint", contactType: "sales", email: site.email, areaServed: "AU", availableLanguage: "English" },
  location: {
    "@type": "ArtGallery", name: site.nita.name, url: site.nita.url,
    description: "Gallery in Surry Hills, Sydney, where Fifty Pages of Shades is showing.",
    telephone: site.nita.phoneIntl,
    address: { "@type": "PostalAddress", streetAddress: site.nita.street, addressLocality: site.nita.suburb, addressRegion: site.nita.region, postalCode: site.nita.postcode, addressCountry: "AU" },
  },
};
const personSchema = {
  "@context": "https://schema.org", "@type": "Person", "@id": personId, name: "Nick Brand", url: `${site.url}/about/`,
  jobTitle: "Fine Art Photographer", worksFor: { "@id": orgId }, sameAs: site.sameAs,
  address: { "@type": "PostalAddress", addressLocality: "Sydney", addressRegion: "NSW", addressCountry: "AU" },
};
const siteSchema = {
  "@context": "https://schema.org", "@type": "WebSite", name: "Fifty Pages of Shades", url: site.url,
  inLanguage: "en-AU", publisher: { "@id": orgId },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <JsonLd data={orgSchema} />
        <JsonLd data={personSchema} />
        <JsonLd data={siteSchema} />
        <AnnouncementBar />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
