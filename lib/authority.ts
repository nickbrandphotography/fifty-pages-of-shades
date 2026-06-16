// Add real entries here as they happen. Empty arrays render an honest "growing" message.
// Never invent venues, press or testimonials — authenticity is the whole point.

export type Exhibition = { venue: string; suburb: string; dates: string; note?: string; url?: string };
export type Press = { publication: string; title: string; date: string; url?: string; note?: string };
export type Award = { award: string; body: string; year: string; result?: string };
export type Testimonial = { quote: string; name: string; role: string; segment?: "collector" | "designer" | "corporate" };

export const exhibitions: Exhibition[] = [
  // { venue: "Venue name", suburb: "Surry Hills, Sydney", dates: "On view 2026", note: "Three large-format works from the Bodyscapes series." },
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
