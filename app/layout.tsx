import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "50 Pages of Shades — Fine Art Photography of the Human Form", template: "%s | 50 Pages of Shades" },
  description: site.description,
  openGraph: { title: "50 Pages of Shades", description: site.description, url: site.url, siteName: "50 Pages of Shades", type: "website" },
  twitter: { card: "summary_large_image", title: "50 Pages of Shades", description: site.description },
};

const orgSchema = {
  "@context": "https://schema.org", "@type": "Organization", name: "50 Pages of Shades", url: site.url,
  description: site.description,
  founder: { "@type": "Person", name: "Nick Brand" },
};
const siteSchema = {
  "@context": "https://schema.org", "@type": "WebSite", name: "50 Pages of Shades", url: site.url,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=Inter:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body>
        <JsonLd data={orgSchema} />
        <JsonLd data={siteSchema} />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
