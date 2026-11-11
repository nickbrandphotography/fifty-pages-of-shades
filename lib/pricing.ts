// Size ladder and pricing, scaled by print area. Edit the numbers here to change prices site-wide.
//
// Each work gets its own sizes from its real proportions (square, 3:2 and so on). The unframed (gallery wrap)
// price follows the print area through ANCHORS, rounded to the nearest $50. A framing uplift is added on top.

export type PriceRow = { size: string; frame: string; price: number; status: string };

/** [print area in cm², unframed price in AUD]. Between points the price is interpolated; above the last, it scales. */
const ANCHORS: [number, number][] = [
  [3600, 750],    // 60 x 60
  [6400, 1200],   // 80 x 80
  [10000, 1700],  // 100 x 100
  [14400, 2500],  // 120 x 120
  [22500, 3400],  // 150 x 150
  [32400, 4500],  // 180 x 180
  [40000, 5400],  // 200 x 200
];
const BEYOND_EXPONENT = 0.8; // price growth above the largest anchor

/** Long-edge sizes offered, in cm. Squares stop at 200 cm; wider formats continue to 300 cm. */
const LADDER_SQUARE = [60, 80, 100, 120, 150, 180, 200];
const LADDER_LANDSCAPE = [90, 120, 150, 180, 210, 240, 300];

export const FRAMES = ["No frame (gallery wrap)", "Black floating frame", "Natural oak floating frame", "White floating frame"];

const round50 = (n: number) => Math.round(n / 50) * 50;

export function unframedPrice(w: number, h: number): number {
  const area = w * h;
  const last = ANCHORS[ANCHORS.length - 1];
  if (area >= last[0]) return round50(last[1] * Math.pow(area / last[0], BEYOND_EXPONENT));
  if (area <= ANCHORS[0][0]) return round50(ANCHORS[0][1] * (area / ANCHORS[0][0]));
  for (let i = 0; i < ANCHORS.length - 1; i++) {
    const [a1, p1] = ANCHORS[i], [a2, p2] = ANCHORS[i + 1];
    if (area >= a1 && area <= a2) {
      const t = (Math.log(area) - Math.log(a1)) / (Math.log(a2) - Math.log(a1));
      return round50(p1 * Math.pow(p2 / p1, t));
    }
  }
  return round50(last[1]);
}

/** Added to the unframed price for any floating frame. Larger frames cost more. */
export const frameUplift = (longEdge: number) => (longEdge <= 90 ? 150 : longEdge <= 150 ? 200 : 300);

export type Dim = { w: number; h: number; label: string };

/** Sizes for a work, from its pixel proportions. Width is the long edge. */
export function ladderFor(pixels: { w: number; h: number }): Dim[] {
  const ratio = pixels.w / pixels.h;
  const square = ratio < 1.05;
  return (square ? LADDER_SQUARE : LADDER_LANDSCAPE).map((long) => {
    const short = square ? long : Math.round(long / ratio / 5) * 5;
    return { w: long, h: short, label: `${long} x ${short} cm` };
  });
}

export function rowsFor(pixels: { w: number; h: number }): PriceRow[] {
  const rows: PriceRow[] = [];
  for (const d of ladderFor(pixels)) {
    const base = unframedPrice(d.w, d.h);
    for (const frame of FRAMES) {
      rows.push({ size: d.label, frame, price: frame.startsWith("No frame") ? base : base + frameUplift(d.w), status: "CONFIRMED" });
    }
  }
  return rows;
}

/** The size closest in area to a reference "W x H cm" label; used to choose each work's default size. */
export function closestSize(pixels: { w: number; h: number }, refLabel: string): Dim {
  const [rw, rh] = refLabel.replace(/ cm/, "").split(" x ").map((n) => parseInt(n));
  const refArea = rw * rh;
  return ladderFor(pixels).reduce((best, d) => (Math.abs(d.w * d.h - refArea) < Math.abs(best.w * best.h - refArea) ? d : best));
}
