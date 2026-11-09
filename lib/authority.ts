// Add real entries here as they happen. Empty arrays render an honest "growing" message.
// Never invent venues, press or testimonials — authenticity is the whole point.

export type Exhibition = {
  venue: string; suburb: string; dates: string; note?: string; url?: string;
  /** ISO date. Only add when real: it switches on Event structured data. */
  start?: string; end?: string;
  address?: { street: string; locality: string; region: string; postcode: string };
};
export type Press = { publication: string; title: string; date: string; url?: string; note?: string };
export type Award = { award: string; body: string; year: string; result?: string };
export type Testimonial = { quote: string; name: string; role: string; segment?: "collector" | "designer" | "corporate" };

export const exhibitions: Exhibition[] = [
  {
    venue: "NITA Gallery",
    suburb: "Surry Hills, Sydney",
    dates: "Now showing",
    note: "Fifty Pages of Shades by Nick Brand is showing at NITA Gallery, 68 Campbell Street, Surry Hills. Limited-edition black-and-white bodyscapes on framed canvas, which you can see at scale and in person.",
    url: "https://www.nitagallery.com.au/nick-brand",
    address: { street: "68 Campbell Street", locality: "Surry Hills", region: "NSW", postcode: "2010" },
  },
];

export const press: Press[] = [
  // { publication: "Publication", title: "Article title", date: "2026", url: "https://…" },
];

export const awards: Award[] = [
  // { award: "Prize name", body: "Awarding body", year: "2026", result: "Finalist" },
];

export const testimonials: Testimonial[] = [
  // { quote: "…", name: "First name", role: "Private collector", segment: "collector" },
];
