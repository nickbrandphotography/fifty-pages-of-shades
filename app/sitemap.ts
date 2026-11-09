import type { MetadataRoute } from "next";
import { artworks, collections } from "@/lib/catalog";
import { articles } from "@/lib/journal";
import { press, awards, testimonials } from "@/lib/authority";
import { site, LAST_MODIFIED } from "@/lib/site";

// URLs end in "/" to match next.config trailingSlash, so the sitemap never lists a URL that redirects.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(LAST_MODIFIED);
  // Placeholder pages are noindex until they hold real entries, so they stay out of the sitemap too.
  const fixed = [
    "", "/collections", "/artworks", "/large-scale-art", "/for-designers", "/for-designers/corporate-art", "/healthcare-art",
    "/commissions", "/collectors/collector-guide", "/collectors/investment-in-photographic-art", "/resources/faq",
    "/resources/glossary", "/journal", "/about", "/about/exhibitions", "/contact",
    ...(press.length ? ["/about/press"] : []),
    ...(awards.length ? ["/about/awards-and-recognition"] : []),
    ...(testimonials.length ? ["/testimonials"] : []),
  ];
  const priority = (p: string) => (p === "" ? 1 : ["/for-designers", "/for-designers/corporate-art", "/healthcare-art", "/artworks", "/about/exhibitions"].includes(p) ? 0.8 : 0.7);
  return [
    ...fixed.map((p) => ({ url: `${site.url}${p}/`, lastModified, changeFrequency: "monthly" as const, priority: priority(p) })),
    ...collections.map((c) => ({ url: `${site.url}/collections/${c.slug}/`, lastModified, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...artworks.map((a) => ({ url: `${site.url}/artworks/${a.slug}/`, lastModified, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...articles.map((a) => ({ url: `${site.url}/journal/${a.slug}/`, lastModified: new Date(a.date), changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}

export const dynamic = "force-static";
