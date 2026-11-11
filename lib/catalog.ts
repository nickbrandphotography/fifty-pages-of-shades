import data from "@/data/catalog.json";
import { FRAMES, closestSize, rowsFor, type PriceRow } from "@/lib/pricing";

export type { PriceRow };
export type Artwork = {
  slug: string; title: string; image: string; thumb: string;
  collection: string; editionSize: number; editionsSold: number;
  status: string; size: string; orientation: "landscape" | "square";
  price: number; medium: string; description: string; featured: boolean;
  pixels: { w: number; h: number };
  alt: string;
};
export type Collection = { slug: string; title: string; tagline: string; intro: string; count: number };

const catalog = data as unknown as {
  artworks: Artwork[];
  collections: Collection[];
};

// Orientation, default size and "from" price come from each work's real proportions and the scaled price ladder.
const enrich = (a: Artwork): Artwork => {
  const rows = rowsFor(a.pixels);
  return {
    ...a,
    orientation: a.pixels.w / a.pixels.h < 1.05 ? "square" : "landscape",
    size: closestSize(a.pixels, a.size).label,
    price: Math.min(...rows.map((r) => r.price)),
  };
};

export const artworks = catalog.artworks.map(enrich);
export const collections = catalog.collections;
export const frames = FRAMES;

export const getArtwork = (slug: string) => artworks.find((a) => a.slug === slug);
export const getCollection = (slug: string) => collections.find((c) => c.slug === slug);
export const artworksIn = (slug: string) => artworks.filter((a) => a.collection === slug);
export const featured = () => artworks.filter((a) => a.featured);
export const related = (a: Artwork, n = 3) =>
  artworks.filter((x) => x.slug !== a.slug && x.collection === a.collection).slice(0, n);

export const pricingFor = (a: Artwork): PriceRow[] => rowsFor(a.pixels);
export const sizesFor = (a: Artwork): string[] => Array.from(new Set(pricingFor(a).map((p) => p.size)));
export const fromPrice = (a: Artwork): number => a.price;

/** Descriptive alt text: what the image shows, plus medium and artist. */
export const altFor = (a: Artwork) => `${a.title}, black-and-white abstract photograph by Nick Brand. ${a.alt}`;

export const formatAUD = (n: number) =>
  new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(n);

export const editionLabel = (a: Artwork) =>
  a.status === "sold" ? "Edition closed"
  : a.editionsSold > 0 ? `${a.editionSize - a.editionsSold} of ${a.editionSize} remaining`
  : `Edition of ${a.editionSize}`;
