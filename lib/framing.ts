// Framing options and pricing for the "View on your wall" visualiser.
//
// Two finishes:
//  - Canvas: gallery-wrapped canvas, optionally in a floating frame (the canvas sits inside the frame with a shadow
//    gap). No mat, no glass, which is how canvas is normally framed. Prices come from lib/pricing.ts.
//  - Fine art paper: a print on paper, framed with an optional mat (mount) and glass. Limited to PAPER_MAX_LONG_EDGE
//    because large glazed frames get heavy and costly.
//
// PLACEHOLDER PRICES: the paper, mat and glass rates below are indicative only. Replace them with real framer quotes
// before launch. Everything is in AUD and rounded to the nearest $50.

import { frameUplift, ladderFor, unframedPrice, type Dim } from "@/lib/pricing";

export type Finish = "canvas" | "paper";

export type Moulding = { id: string; label: string; canvasName: string };
export const MOULDINGS: Moulding[] = [
  { id: "none", label: "No frame", canvasName: "No frame (gallery wrap)" },
  { id: "black", label: "Black", canvasName: "Black floating frame" },
  { id: "oak", label: "Natural oak", canvasName: "Natural oak floating frame" },
  { id: "white", label: "White", canvasName: "White floating frame" },
];

export type Mat = { id: string; label: string; width: number; color: string | null };
export const MATS: Mat[] = [
  { id: "none", label: "No mat", width: 0, color: null },
  { id: "white-5", label: "White 5 cm", width: 5, color: "#f3f1ea" },
  { id: "white-8", label: "White 8 cm", width: 8, color: "#f3f1ea" },
  { id: "white-12", label: "White 12 cm", width: 12, color: "#f3f1ea" },
  { id: "black-8", label: "Black 8 cm", width: 8, color: "#161616" },
];

export type Glass = { id: string; label: string; reflect: number; note: string; perM2: number };
export const GLASS: Glass[] = [
  { id: "clear", label: "Clear", reflect: 0.2, perM2: 120, note: "Standard picture glass. Clear, but you will see reflections." },
  { id: "non-reflective", label: "Non-reflective", reflect: 0.06, perM2: 220, note: "Etched to cut glare. Detail is very slightly softened." },
  { id: "uv", label: "UV protective", reflect: 0.16, perM2: 260, note: "Blocks about 99% of UV light, so the print will not fade." },
  { id: "museum", label: "Museum", reflect: 0.02, perM2: 650, note: "Anti-reflective and UV protective. Almost invisible." },
  { id: "acrylic", label: "Acrylic", reflect: 0.12, perM2: 300, note: "Lighter and shatter-resistant. Good for big works and busy spaces." },
];

export const PAPER_MAX_LONG_EDGE = 150; // cm
const MAT_PER_METRE = 60; // AUD per metre of outer perimeter. PLACEHOLDER
const PAPER_FACTOR = 0.85; // paper print price as a share of the canvas price. PLACEHOLDER

/** Physical build, in cm, used both for drawing and for pricing. */
export const BUILD = {
  floatFace: 1.6, // front face of a floating frame moulding
  floatGap: 1.0, // shadow gap between the canvas edge and the frame
  paperFace: 2.4, // front face of a standard frame moulding for paper
  bevel: 0.35, // visible white core of a mat's bevelled window
};

export type Config = { finish: Finish; moulding: string; mat: string; glass: string; size: Dim };

const round50 = (n: number) => Math.round(n / 50) * 50;

export function sizesForFinish(pixels: { w: number; h: number }, finish: Finish): Dim[] {
  const all = ladderFor(pixels);
  return finish === "canvas" ? all : all.filter((d) => d.w <= PAPER_MAX_LONG_EDGE);
}

/** Outside size of the finished piece in cm, frame included. */
export function outerSize(c: Config): { w: number; h: number } {
  const { w, h } = c.size;
  if (c.finish === "canvas") {
    if (c.moulding === "none") return { w, h };
    const add = 2 * (BUILD.floatFace + BUILD.floatGap);
    return { w: w + add, h: h + add };
  }
  const m = MATS.find((x) => x.id === c.mat)?.width ?? 0;
  const add = 2 * (m + BUILD.paperFace);
  return { w: w + add, h: h + add };
}

export function priceFor(c: Config): number {
  const { w, h } = c.size;
  const base = unframedPrice(w, h);
  if (c.finish === "canvas") return c.moulding === "none" ? base : base + frameUplift(w);

  const m = MATS.find((x) => x.id === c.mat)?.width ?? 0;
  const ow = w + 2 * m, oh = h + 2 * m;
  const glass = GLASS.find((g) => g.id === c.glass) ?? GLASS[0];
  const matCost = m > 0 ? ((2 * (ow + oh)) / 100) * MAT_PER_METRE : 0;
  const glassCost = ((ow * oh) / 10000) * glass.perM2;
  return round50(base * PAPER_FACTOR + frameUplift(ow) + matCost + glassCost);
}

/** Plain-English description used in the enquiry. */
export function describe(c: Config): string {
  const mould = MOULDINGS.find((x) => x.id === c.moulding) ?? MOULDINGS[0];
  if (c.finish === "canvas") return `Canvas, ${mould.canvasName.toLowerCase()}`;
  const mat = MATS.find((x) => x.id === c.mat) ?? MATS[0];
  const glass = GLASS.find((x) => x.id === c.glass) ?? GLASS[0];
  return `Fine art paper, ${mould.label.toLowerCase()} frame, ${mat.id === "none" ? "no mat" : mat.label.toLowerCase() + " mat"}, ${glass.label.toLowerCase()} glass`;
}
