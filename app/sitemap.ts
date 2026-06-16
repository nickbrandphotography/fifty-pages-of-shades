import type { MetadataRoute } from "next";
import { artworks, collections } from "@/lib/catalog";
import { articles } from "@/lib/journal";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const fixed = ["", "/collections", "/artworks", "/large-scale-art", "/for-designers", "/for-designers/corporate-art", "/commissions", "/collectors/collector-guide", "/collectors/investment-in-photographic-art", "/resources/faq", "/resources/glossary", "/journal", "/about", "/about/exhibitions", "/about/press", "/about/awards-and-recognition", "/testimonials", "/contact"];
  return [
    ...fixed.map((p) => ({ url: `${site.url}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.7 })),
    ...collections.map((c) => ({ url: `${site.url}/collections/${c.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...artworks.map((a) => ({ url: `${site.url}/artworks/${a.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...articles.map((a) => ({ url: `${site.url}/journal/${a.slug}`, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}

export const dynamic = "force-static";
