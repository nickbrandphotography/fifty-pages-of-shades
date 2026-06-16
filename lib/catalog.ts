import data from "@/data/catalog.json";

export type Artwork = {
  slug: string; title: string; image: string; thumb: string;
  collection: string; editionSize: number; editionsSold: number;
  status: string; size: string; orientation: "landscape" | "square";
  price: number; medium: string; description: string; featured: boolean;
  pixels: { w: number; h: number };
};
export type PriceRow = { size: string; frame: string; price: number; status: string };
export type Collection = { slug: string; title: string; tagline: string; intro: string; count: number };

const catalog = data as unknown as {
  artworks: Artwork[];
  collections: Collection[];
  pricing: Record<string, PriceRow[]>;
  frames: string[];
};

export const artworks = catalog.artworks;
export const collections = catalog.collections;
export const frames = catalog.frames;

export const getArtwork = (slug: string) => artworks.find((a) => a.slug === slug);
export const getCollection = (slug: string) => collections.find((c) => c.slug === slug);
export const artworksIn = (slug: string) => artworks.filter((a) => a.collection === slug);
export const featured = () => artworks.filter((a) => a.featured);
export const related = (a: Artwork, n = 3) =>
  artworks.filter((x) => x.slug !== a.slug && x.collection === a.collection).slice(0, n);

export const pricingFor = (orientation: string): PriceRow[] => catalog.pricing[orientation] ?? [];
export const sizesFor = (orientation: string): string[] =>
  Array.from(new Set(pricingFor(orientation).map((p) => p.size)));
export const priceFor = (orientation: string, size: string, frame: string): PriceRow | undefined =>
  pricingFor(orientation).find((p) => p.size === size && p.frame === frame);
export const fromPrice = (orientation: string): number =>
  Math.min(...pricingFor(orientation).map((p) => p.price));

export const formatAUD = (n: number) =>
  new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(n);

export const editionLabel = (a: Artwork) =>
  a.status === "sold" ? "Edition closed"
  : a.editionsSold > 0 ? `${a.editionSize - a.editionsSold} of ${a.editionSize} remaining`
  : `Edition of ${a.editionSize}`;
