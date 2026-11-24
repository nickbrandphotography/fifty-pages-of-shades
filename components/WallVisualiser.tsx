"use client";
// "View on your wall": photograph a wall (or pick a sample room), mark something rectangular of known size,
// then swipe through the works at true size and in true perspective, and try frames, mats and glass with a
// live price.
//
// The photograph is never cropped or stretched: it is drawn at its own proportions, at the area of the size
// chosen. Works open in the oak shadow frame (the house frame); buyers can choose another.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Dim } from "@/lib/pricing";
import {
  BUILD, GLASS, MATS, MOULDINGS, describe, outerSize, priceFor, sizesForFinish,
  type Config, type Finish,
} from "@/lib/framing";

export type VisArt = {
  slug: string; title: string; image: string; thumb: string;
  pixels: { w: number; h: number }; status: string; size: string;
};

type Pt = { x: number; y: number };
type M3 = number[]; // 3x3 matrix, row-major

// ---------------------------------------------------------------- perspective
// A wall is a flat plane, so one 3x3 projective matrix (a homography) maps centimetres on the wall to pixels
// in the photo, including the foreshortening of a wall photographed at an angle. It comes from four points:
// the corners of something rectangular on the wall whose size is known.
function solveH(src: Pt[], dst: Pt[]): M3 {
  const a: number[][] = [];
  for (let i = 0; i < 4; i++) {
    const { x, y } = src[i], { x: u, y: v } = dst[i];
    a.push([x, y, 1, 0, 0, 0, -u * x, -u * y, u]);
    a.push([0, 0, 0, x, y, 1, -v * x, -v * y, v]);
  }
  for (let c = 0; c < 8; c++) {
    let p = c;
    for (let r = c + 1; r < 8; r++) if (Math.abs(a[r][c]) > Math.abs(a[p][c])) p = r;
    [a[c], a[p]] = [a[p], a[c]];
    for (let r = 0; r < 8; r++) {
      if (r === c || a[c][c] === 0) continue;
      const f = a[r][c] / a[c][c];
      for (let k = c; k < 9; k++) a[r][k] -= f * a[c][k];
    }
  }
  return [...a.map((row, i) => row[8] / row[i]), 1];
}
const mul3 = (a: M3, b: M3): M3 => {
  const o: number[] = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) o.push(a[r * 3] * b[c] + a[r * 3 + 1] * b[3 + c] + a[r * 3 + 2] * b[6 + c]);
  return o;
};
function inv3(m: M3): M3 {
  const [a, b, c, d, e, f, g, h, i] = m;
  const A = e * i - f * h, B = -(d * i - f * g), C = d * h - e * g;
  const det = a * A + b * B + c * C;
  return [A, -(b * i - c * h), b * f - c * e, B, a * i - c * g, -(a * f - c * d), C, -(a * h - b * g), a * e - b * d].map((v) => v / det);
}
const applyH = (m: M3, p: Pt): Pt => {
  const w = m[6] * p.x + m[7] * p.y + m[8];
  return { x: (m[0] * p.x + m[1] * p.y + m[2]) / w, y: (m[3] * p.x + m[4] * p.y + m[5]) / w };
};
/** CSS matrix3d for a 2D homography (column-major 4x4). */
const cssMatrix = (m: M3) => `matrix3d(${m[0]},${m[3]},0,${m[6]},${m[1]},${m[4]},0,${m[7]},0,0,1,0,${m[2]},${m[5]},0,${m[8]})`;

// H maps wall cm to photo px. sample: where works hang in that room, in wall cm (y measured down).
// floorY: the floor's wall y, when the reference rectangle stood on it (a door).
type Room = {
  src: string; w: number; h: number; H: M3 | null; floorY?: number;
  sample?: { centreX: number; eyeY: number; furnitureTop: number; topY: number };
};

// Photographed sample rooms, measured for the art mock-up library. H maps the back wall in cm (origin at its
// top-left) to pixels of the 1600 px image, so the two angled rooms show a work in true perspective.
const SAMPLES = [
  { id: "calm-living-room", label: "Living room", src: "/rooms/calm-living-room.jpg", thumb: "/rooms/calm-living-room-thumb.jpg", w: 1600, h: 1073,
    H: [2.34396, 0, 227.848, 0, 2.34403, 137.975, 0, 0, 1], centreX: 243.0, eyeY: 130.0, furnitureTop: 208.4, topY: 25 },
  { id: "hotel-suite-bedroom", label: "Bedroom", src: "/rooms/hotel-suite-bedroom.jpg", thumb: "/rooms/hotel-suite-bedroom-thumb.jpg", w: 1600, h: 1073,
    H: [2.39622, 0, 212.025, 0, 2.39602, 107.595, 0, 0, 1], centreX: 245.7, eyeY: 130.0, furnitureTop: 176.5, topY: 25 },
  { id: "office-reception", label: "Office", src: "/rooms/office-reception.jpg", thumb: "/rooms/office-reception-thumb.jpg", w: 1600, h: 1073,
    H: [2.77086, 0, 0, 0, 2.77075, 68.3544, 0, 0, 1], centreX: 292.4, eyeY: 120.0, furnitureTop: 171.8, topY: 25 },
  { id: "limestone-hotel-lobby", label: "Hotel lobby", src: "/rooms/limestone-hotel-lobby.jpg", thumb: "/rooms/limestone-hotel-lobby-thumb.jpg", w: 1600, h: 1073,
    H: [1.8288, 0, 37.9747, 0, 1.82878, 107.595, 0, 0, 1], centreX: 417.0, eyeY: 230.0, furnitureTop: 308.0, topY: 25 },
  { id: "coastal-living-room", label: "Living room, angled wall", src: "/rooms/coastal-living-room.jpg", thumb: "/rooms/coastal-living-room-thumb.jpg", w: 1600, h: 1073,
    H: [3.47387, 0, 227.848, 0.634429, 2.89381, 91.2025, 0.00117977, 0, 1], centreX: 271.0, eyeY: 120.0, furnitureTop: 189.0, topY: 25 },
  { id: "architect-studio-entry", label: "Studio, angled wall", src: "/rooms/architect-studio-entry.jpg", thumb: "/rooms/architect-studio-entry-thumb.jpg", w: 1600, h: 1073,
    H: [3.52279, 0, 455.696, 0.646071, 2.7055, 31.2658, 0.00129147, 0, 1], centreX: 247.7, eyeY: 170.0, furnitureTop: 241.5, topY: 25 },
];

// Something rectangular on the wall, of known size. A door also tells us where the floor is.
const PRESETS: { label: string; w: number | null; h: number | null; floor?: boolean }[] = [
  { label: "A standard door (82 x 204 cm)", w: 82, h: 204, floor: true },
  { label: "An A4 sheet taped up (21 x 29.7 cm)", w: 21, h: 29.7 },
  { label: "A light switch plate (7.2 x 11.5 cm)", w: 7.2, h: 11.5 },
  { label: "Something else I've measured", w: null, h: null },
];
const KPX = 4; // pixels per cm at which a work is drawn before it is projected onto the wall

const aud = (n: number) =>
  new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(n);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** The photograph's own proportions at the area of the chosen size, so it is never cropped or stretched. */
function drawnSize(size: Dim, pixels: { w: number; h: number }) {
  const s = Math.sqrt((size.w * size.h) / (pixels.w * pixels.h));
  return { w: pixels.w * s, h: pixels.h * s };
}

function mouldingStyle(id: string): React.CSSProperties {
  if (id === "oak")
    return {
      background:
        "repeating-linear-gradient(100deg, rgba(110,75,40,0.16) 0 2px, transparent 2px 6px, rgba(255,240,210,0.10) 6px 7px, transparent 7px 11px)," +
        "linear-gradient(135deg, #d6b583 0%, #bb915d 45%, #c9a26d 70%, #b08452 100%)",
    };
  if (id === "white") return { background: "linear-gradient(135deg, #fdfcf8 0%, #ebe8e0 60%, #f5f3ee 100%)" };
  return { background: "linear-gradient(135deg, #2e2e2e 0%, #101010 45%, #1f1f1f 100%)" };
}

/** The framed work, drawn at k pixels per cm. */
function Piece({ art, cfg, k }: { art: VisArt; cfg: Config; k: number }) {
  const d = drawnSize(cfg.size, art.pixels);
  const px = (cm: number) => Math.max(1, cm * k);
  const wallShadow = `${px(0.6)}px ${px(1.8)}px ${px(3.5)}px rgba(0,0,0,0.38), 0 ${px(0.3)}px ${px(0.8)}px rgba(0,0,0,0.25)`;
  const img = (
    <img src={art.image} alt="" draggable={false}
      style={{ display: "block", width: d.w * k, height: d.h * k, objectFit: "contain", userSelect: "none" }} />
  );

  if (cfg.moulding === "oak-shadow") {
    // The brand frame image (the same one the NITA and Ritushka sites use): 56 px of oak and shadow gap
    // around its edge, stretched to 10 mm at this scale.
    const b = px(BUILD.shadowFace + BUILD.shadowGap);
    return (
      <div style={{ borderStyle: "solid", borderWidth: b, borderImage: "url(/brand/frame-oak.png) 56 stretch",
        boxShadow: wallShadow, boxSizing: "content-box", width: d.w * k, height: d.h * k }}>
        {img}
      </div>
    );
  }

  if (cfg.finish === "canvas") {
    if (cfg.moulding === "none") return <div style={{ boxShadow: wallShadow }}>{img}</div>;
    return (
      <div style={{ ...mouldingStyle(cfg.moulding), padding: px(BUILD.floatFace), boxShadow: `${wallShadow}, inset 0 0 0 1px rgba(0,0,0,0.25)` }}>
        <div style={{ background: "#0d0c0b", padding: px(BUILD.floatGap), boxShadow: `inset ${px(0.4)}px ${px(0.4)}px ${px(0.8)}px rgba(0,0,0,0.9)` }}>
          <div style={{ boxShadow: `${px(0.3)}px ${px(0.5)}px ${px(0.7)}px rgba(0,0,0,0.6)` }}>{img}</div>
        </div>
      </div>
    );
  }

  const mat = MATS.find((m) => m.id === cfg.mat) ?? MATS[0];
  const glass = GLASS.find((g) => g.id === cfg.glass) ?? GLASS[0];
  const inner = mat.width > 0 ? (
    <div style={{ background: mat.color ?? undefined, padding: px(mat.width), boxShadow: `inset ${px(0.25)}px ${px(0.25)}px ${px(0.6)}px rgba(0,0,0,0.35)` }}>
      <div style={{ outline: `${px(BUILD.bevel)}px solid #f7f5ef`, boxShadow: `0 0 0 ${px(BUILD.bevel) + 1}px rgba(0,0,0,0.12)` }}>{img}</div>
    </div>
  ) : img;

  return (
    <div style={{ position: "relative", ...mouldingStyle(cfg.moulding), padding: px(BUILD.paperFace), boxShadow: `${wallShadow}, inset 0 0 0 1px rgba(0,0,0,0.2)` }}>
      <div style={{ boxShadow: `inset 0 0 ${px(0.5)}px rgba(0,0,0,0.5)` }}>{inner}</div>
      <div aria-hidden style={{
        position: "absolute", inset: px(BUILD.paperFace), pointerEvents: "none",
        background: `linear-gradient(115deg, rgba(255,255,255,${glass.reflect * 1.4}) 0%, rgba(255,255,255,${glass.reflect * 0.5}) 22%, rgba(255,255,255,0) 38%, rgba(255,255,255,0) 62%, rgba(255,255,255,${glass.reflect * 0.6}) 78%, rgba(255,255,255,0) 92%)`,
      }} />
    </div>
  );
}

export default function WallVisualiser({ artworks }: { artworks: VisArt[] }) {
  const [step, setStep] = useState<"start" | "measure" | "place">("start");
  const [room, setRoom] = useState<Room | null>(null);
  // Corners of the reference rectangle in photo pixels: top-left, top-right, bottom-right, bottom-left.
  const [handles, setHandles] = useState<Pt[]>([{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }]);
  const [preset, setPreset] = useState(0);
  const [refW, setRefW] = useState<number>(82);
  const [refH, setRefH] = useState<number>(204);
  const [idx, setIdx] = useState(0);
  const [finish, setFinish] = useState<Finish>("canvas");
  const [moulding, setMoulding] = useState("oak-shadow");
  const [mat, setMat] = useState("none");
  const [glass, setGlass] = useState("non-reflective");
  const [sizeIdx, setSizeIdx] = useState<number | null>(null);
  const [pos, setPos] = useState<Pt | null>(null); // wall cm; null = automatic hanging position
  const [brightness, setBrightness] = useState(1);
  const [scale, setScale] = useState(0.3); // display px per photo px
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const drag = useRef<{ kind: "art" | "handle" | "swipe"; i?: number; start: Pt; origin: Pt; t: number } | null>(null);

  const art = artworks[idx];

  // Start on the work named in ?work=slug, if any.
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("work");
    const i = artworks.findIndex((a) => a.slug === slug);
    if (i >= 0) setIdx(i);
  }, [artworks]);

  useEffect(() => {
    if (!room || !wrapRef.current) return;
    const el = wrapRef.current;
    const fit = () => {
      const maxH = window.innerHeight * 0.75;
      setScale(Math.min(el.clientWidth, (maxH * room.w) / room.h) / room.w);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    window.addEventListener("resize", fit);
    return () => { ro.disconnect(); window.removeEventListener("resize", fit); };
  }, [room, step]);

  const sizes: Dim[] = useMemo(() => sizesForFinish(art.pixels, finish), [art, finish]);
  const defaultSizeIdx = useMemo(() => {
    const [rw, rh] = art.size.replace(/ cm/, "").split(" x ").map((n) => parseInt(n));
    let best = 0;
    sizes.forEach((d, i) => { if (Math.abs(d.w * d.h - rw * rh) < Math.abs(sizes[best].w * sizes[best].h - rw * rh)) best = i; });
    return best;
  }, [art, sizes]);
  const size = sizes[clamp(sizeIdx ?? defaultSizeIdx, 0, sizes.length - 1)];

  const cfg: Config = { finish, moulding, mat, glass, size };
  const price = priceFor(cfg);
  // Drawn at the photograph's proportions; the frame adds the same border as the listed size does.
  const listed = outerSize(cfg);
  const dz = drawnSize(size, art.pixels);
  const outer = { w: dz.w + (listed.w - size.w), h: dz.h + (listed.h - size.h) };

  // Positions are kept in wall centimetres, so moving a work along an angled wall keeps it on the wall.
  const H = room?.H ?? null;
  const Hinv = H ? inv3(H) : null;
  const autoPos = useCallback((): Pt => {
    if (!room || !H) return { x: 0, y: 0 };
    if (room.sample) {
      const s = room.sample;
      // Eye level, unless the work would come down onto the sofa or bed, in which case it clears it by 25 cm.
      const y = Math.min(s.eyeY, s.furnitureTop - 25 - outer.h / 2);
      return { x: s.centreX, y: Math.max(s.topY + outer.h / 2, y) };
    }
    const mid = applyH(inv3(H), { x: room.w / 2, y: room.h * 0.45 });
    return { x: mid.x, y: room.floorY != null ? room.floorY - 150 : mid.y };
  }, [room, H, outer.h]);
  const centre = pos ?? autoPos();

  function photoPt(e: React.PointerEvent): Pt {
    const r = stageRef.current?.getBoundingClientRect();
    return r ? { x: (e.clientX - r.left) / scale, y: (e.clientY - r.top) / scale } : { x: 0, y: 0 };
  }

  function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = src; });
  }

  // Match the artwork to the room's overall brightness, so it does not glow in a dim photo.
  async function measureBrightness(src: string) {
    try {
      const im = await loadImage(src);
      const c = document.createElement("canvas"); c.width = 32; c.height = 32;
      const ctx = c.getContext("2d"); if (!ctx) return;
      ctx.drawImage(im, 0, 0, 32, 32);
      const d = ctx.getImageData(0, 0, 32, 32).data;
      let sum = 0;
      for (let i = 0; i < d.length; i += 4) sum += 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
      setBrightness(clamp(0.6 + (sum / (d.length / 4) / 255) * 0.55, 0.72, 1.02));
    } catch { setBrightness(1); }
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const src = URL.createObjectURL(f);
    const im = await loadImage(src);
    const w = im.naturalWidth, h = im.naturalHeight;
    setRoom({ src, w, h, H: null });
    // Start with a door-shaped box the user drags onto the real thing.
    const x0 = w * 0.12, x1 = w * 0.26, y0 = h * 0.2, y1 = h * 0.88;
    setHandles([{ x: x0, y: y0 }, { x: x1, y: y0 }, { x: x1, y: y1 }, { x: x0, y: y1 }]);
    setPos(null);
    measureBrightness(src);
    setStep("measure");
    e.target.value = "";
  }

  function pickSample(s: (typeof SAMPLES)[number]) {
    setRoom({ src: s.src, w: s.w, h: s.h, H: s.H,
      sample: { centreX: s.centreX, eyeY: s.eyeY, furnitureTop: s.furnitureTop, topY: s.topY } });
    setPos(null); setBrightness(1); setStep("place");
  }

  // The four corners must make a real, non-folded shape before they can define the wall.
  const quadArea = handles.reduce((s, p, i) => {
    const q = handles[(i + 1) % 4];
    return s + p.x * q.y - q.x * p.y;
  }, 0) / 2;
  const measureOk = Math.abs(quadArea) > 400 && refW > 0 && refH > 0;
  function confirmMeasure() {
    if (!room || !measureOk) return;
    const Hm = solveH([{ x: 0, y: 0 }, { x: refW, y: 0 }, { x: refW, y: refH }, { x: 0, y: refH }], handles);
    setRoom({ ...room, H: Hm, floorY: PRESETS[preset].floor ? refH : undefined });
    setPos(null); setStep("place");
  }

  const go = useCallback((dir: 1 | -1) => {
    setIdx((i) => (i + dir + artworks.length) % artworks.length);
    setSizeIdx(null);
  }, [artworks.length]);

  // Keep the current work visible in the thumbnail strip.
  useEffect(() => {
    if (step !== "place") return;
    const strip = document.getElementById("vis-thumbs");
    const el = strip?.children[idx] as HTMLElement | undefined;
    if (strip && el) strip.scrollTo({ left: el.offsetLeft - strip.clientWidth / 2 + el.clientWidth / 2, behavior: "smooth" });
  }, [idx, step]);

  useEffect(() => {
    if (step !== "place") return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT") return;
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, go]);

  // Pointer handling: drag the artwork or a corner dot; a quick sideways swipe on the wall changes the work.
  function down(e: React.PointerEvent, kind: "art" | "handle" | "swipe", i?: number) {
    e.stopPropagation();
    try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch { /* pointer already gone */ }
    const origin = kind === "art" ? centre : kind === "handle" ? handles[i!] : { x: 0, y: 0 };
    // For the artwork, remember where on the wall the pointer started, in wall cm.
    const start = kind === "art" && Hinv ? applyH(Hinv, photoPt(e)) : { x: e.clientX, y: e.clientY };
    drag.current = { kind, i, start, origin, t: Date.now() };
  }
  function move(e: React.PointerEvent) {
    const d = drag.current;
    if (!d || !room) return;
    if (d.kind === "art" && Hinv) {
      const p = applyH(Hinv, photoPt(e));
      setPos({ x: d.origin.x + p.x - d.start.x, y: d.origin.y + p.y - d.start.y });
    } else if (d.kind === "handle") {
      const dx = (e.clientX - d.start.x) / scale, dy = (e.clientY - d.start.y) / scale;
      const p = { x: clamp(d.origin.x + dx, 0, room.w), y: clamp(d.origin.y + dy, 0, room.h) };
      setHandles((hs) => hs.map((h, j) => (j === d.i ? p : h)));
    }
  }
  function up(e: React.PointerEvent) {
    const d = drag.current;
    drag.current = null;
    if (!d || d.kind !== "swipe") return;
    const dx = e.clientX - d.start.x, dy = e.clientY - d.start.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5 && Date.now() - d.t < 700) go(dx < 0 ? 1 : -1);
  }

  function chooseFinish(f: Finish) {
    setFinish(f);
    setSizeIdx(null);
    if (f === "paper" && moulding === "none") setMoulding("oak-shadow");
  }

  const enquireHref =
    `/contact/?work=${encodeURIComponent(art.title)}&size=${encodeURIComponent(size.label)}` +
    `&frame=${encodeURIComponent(describe(cfg))}&price=${price}`;

  const btn = (on: boolean) =>
    `border px-3 py-2 text-sm transition ${on ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"}`;
  const cols = "grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]";

  // ---------- Step 1: choose a room ----------
  if (step === "start" || !room) {
    return (
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <div className="eyebrow mb-3">Step 1</div>
          <h2 className="font-serif text-3xl">Photograph your wall</h2>
          <p className="mt-4 max-w-md text-ink/60">
            Take a photo of the wall from where you would usually see it, straight on or at an angle. Include something
            rectangular you know the size of: a door, an A4 sheet taped to the wall, or a light switch plate. Your photo
            stays on your device and is never uploaded.
          </p>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onFile} />
          <button onClick={() => fileRef.current?.click()}
            className="mt-6 border border-ink bg-ink px-6 py-4 text-xs uppercase tracking-widest2 text-paper transition hover:bg-transparent hover:text-ink">
            Take or upload a photo
          </button>
        </div>
        <div>
          <div className="eyebrow mb-3">Or try a sample room</div>
          <div className="grid grid-cols-2 gap-4">
            {SAMPLES.map((s) => (
              <button key={s.id} onClick={() => pickSample(s)} className="group text-left">
                <img src={s.thumb} alt={`Sample ${s.label.toLowerCase()}`} loading="lazy" width={640} height={429}
                  className="w-full border border-line transition group-hover:border-ink" />
                <span className="mt-2 block text-sm text-ink/70">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const stageW = room.w * scale, stageH = room.h * scale;

  // ---------- Step 2: mark the reference rectangle ----------
  if (step === "measure") {
    const poly = handles.map((h) => `${h.x * scale},${h.y * scale}`).join(" ");
    const corner = ["Top left", "Top right", "Bottom right", "Bottom left"];
    return (
      <div className={cols}>
        <div ref={wrapRef} className="w-full min-w-0">
          <div className="relative mx-auto select-none" style={{ width: stageW, height: stageH, touchAction: "none" }}
            onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
            <img src={room.src} alt="Your wall" draggable={false} className="block h-full w-full" />
            <svg className="absolute inset-0" width={stageW} height={stageH}>
              <polygon points={poly} fill="rgba(255,255,255,0.12)" stroke="#fff" strokeWidth={4} strokeOpacity={0.9} />
              <polygon points={poly} fill="none" stroke="#0A0A0A" strokeWidth={2} strokeDasharray="8 6" />
            </svg>
            {handles.map((h, i) => (
              <div key={i} role="slider" aria-label={`${corner[i]} corner`} aria-valuenow={0}
                onPointerDown={(e) => down(e, "handle", i)}
                className="absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-grab items-center justify-center"
                style={{ left: h.x * scale, top: h.y * scale, touchAction: "none" }}>
                <span className="block h-5 w-5 rounded-full border-2 border-white bg-ink shadow" />
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="eyebrow mb-3">Step 2</div>
          <h2 className="font-serif text-3xl">Mark something on the wall</h2>
          <p className="mt-4 text-ink/60">
            Drag the four dots onto the four corners of something rectangular in the photo, such as a door frame. It tells
            us how big everything on the wall is and the angle you photographed it from, so the art is drawn in true
            perspective.
          </p>
          <label className="mt-6 block">
            <span className="mb-1 block text-sm text-ink/60">What are you marking?</span>
            <select value={preset} onChange={(e) => {
              const i = +e.target.value; setPreset(i);
              if (PRESETS[i].w && PRESETS[i].h) { setRefW(PRESETS[i].w!); setRefH(PRESETS[i].h!); }
            }} className="w-full border border-line bg-paper px-3 py-3 outline-none focus:border-ink">
              {PRESETS.map((p, i) => <option key={p.label} value={i}>{p.label}</option>)}
            </select>
          </label>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-sm text-ink/60">Width in cm</span>
              <input type="number" inputMode="decimal" min={1} step="0.1" value={refW || ""}
                onChange={(e) => { setRefW(parseFloat(e.target.value)); setPreset(PRESETS.length - 1); }}
                className="w-full border border-line bg-paper px-3 py-3 outline-none focus:border-ink" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm text-ink/60">Height in cm</span>
              <input type="number" inputMode="decimal" min={1} step="0.1" value={refH || ""}
                onChange={(e) => { setRefH(parseFloat(e.target.value)); setPreset(PRESETS.length - 1); }}
                className="w-full border border-line bg-paper px-3 py-3 outline-none focus:border-ink" />
            </label>
          </div>
          <div className="mt-6 flex gap-3">
            <button onClick={confirmMeasure} disabled={!measureOk}
              className="flex-1 border border-ink bg-ink px-6 py-4 text-xs uppercase tracking-widest2 text-paper transition hover:bg-transparent hover:text-ink disabled:opacity-40">
              Place artwork
            </button>
            <button onClick={() => setStep("start")} className="border border-line px-4 py-4 text-xs uppercase tracking-widest2 hover:border-ink">
              Back
            </button>
          </div>
          <p className="mt-4 text-xs text-ink/45">
            Tip: use something flat on the same wall you want to hang the art on. A door frame works best: it is large,
            and it also tells us where the floor is, so the art starts at eye level.
          </p>
        </div>
      </div>
    );
  }

  // ---------- Step 3: place, swipe and frame ----------
  // The work is drawn flat at KPX px per cm, then projected onto the wall: local pixel -> wall cm (T) -> photo
  // pixel (H) -> screen pixel (S). On an angled wall that foreshortens it exactly as the wall is.
  const X0 = centre.x - outer.w / 2, Y0 = centre.y - outer.h / 2;
  const T: M3 = [1 / KPX, 0, X0, 0, 1 / KPX, Y0, 0, 0, 1];
  const S: M3 = [scale, 0, 0, 0, scale, 0, 0, 0, 1];
  const project = H ? mul3(S, mul3(H, T)) : null;
  const glassInfo = GLASS.find((g) => g.id === glass) ?? GLASS[0];
  return (
    <div className={cols}>
      <div ref={wrapRef} className="w-full min-w-0">
        <div ref={stageRef} className="relative mx-auto select-none overflow-hidden" style={{ width: stageW, height: stageH, touchAction: "pan-y" }}
          onPointerDown={(e) => down(e, "swipe")} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
          <img src={room.src} alt="Your wall" draggable={false} className="block h-full w-full" />
          {project && (
            <div onPointerDown={(e) => down(e, "art")} className="absolute left-0 top-0 cursor-grab active:cursor-grabbing"
              style={{
                width: outer.w * KPX, height: outer.h * KPX, transformOrigin: "0 0", transform: cssMatrix(project),
                touchAction: "none", filter: brightness < 0.99 ? `brightness(${brightness})` : undefined,
              }}>
              <Piece art={art} cfg={cfg} k={KPX} />
            </div>
          )}
          <button aria-label="Previous artwork" onClick={() => go(-1)} onPointerDown={(e) => e.stopPropagation()}
            className="absolute left-2 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-paper/85 text-lg shadow hover:bg-paper">‹</button>
          <button aria-label="Next artwork" onClick={() => go(1)} onPointerDown={(e) => e.stopPropagation()}
            className="absolute right-2 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-paper/85 text-lg shadow hover:bg-paper">›</button>
        </div>
        <p className="mt-3 text-center text-xs text-ink/50">
          Drag the artwork to move it. Swipe across the wall, or use the arrows, to try another work.
        </p>

        <div id="vis-thumbs" className="relative mt-5 flex snap-x gap-3 overflow-x-auto pb-2">
          {artworks.map((a, i) => (
            <button key={a.slug} onClick={() => { setIdx(i); setSizeIdx(null); }} aria-label={a.title}
              className={`shrink-0 snap-start border-2 p-0.5 transition ${i === idx ? "border-ink" : "border-transparent opacity-70 hover:opacity-100"}`}>
              <img src={a.thumb} alt="" className="h-16 w-auto" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="eyebrow mb-2">{idx + 1} of {artworks.length}</div>
        <h2 className="font-serif text-3xl">{art.title}</h2>
        {art.status === "sold" && <div className="mt-1 text-xs uppercase tracking-widest2 text-stone">Edition closed</div>}

        <div className="mt-6">
          <div className="mb-2 text-sm text-ink/60">Finish</div>
          <div className="flex flex-wrap gap-2">
            <button className={btn(finish === "canvas")} onClick={() => chooseFinish("canvas")}>Canvas</button>
            <button className={btn(finish === "paper")} onClick={() => chooseFinish("paper")}>Paper &amp; glass</button>
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-2 text-sm text-ink/60">Size (artwork)</div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s, i) => (
              <button key={s.label} className={btn(s.label === size.label)} onClick={() => setSizeIdx(i)}>{s.label}</button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-2 text-sm text-ink/60">Frame</div>
          <div className="flex flex-wrap gap-2">
            {MOULDINGS.filter((m) => finish === "canvas" || m.id !== "none").map((m) => (
              <button key={m.id} className={btn(moulding === m.id)} onClick={() => setMoulding(m.id)}>{m.label}</button>
            ))}
          </div>
        </div>

        {finish === "paper" && (
          <>
            {moulding !== "oak-shadow" && (
              <div className="mt-5">
                <div className="mb-2 text-sm text-ink/60">Mat board</div>
                <div className="flex flex-wrap gap-2">
                  {MATS.map((m) => (
                    <button key={m.id} className={btn(mat === m.id)} onClick={() => setMat(m.id)}>{m.label}</button>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-5">
              <div className="mb-2 text-sm text-ink/60">Glass</div>
              <div className="flex flex-wrap gap-2">
                {GLASS.map((g) => (
                  <button key={g.id} className={btn(glass === g.id)} onClick={() => setGlass(g.id)}>{g.label}</button>
                ))}
              </div>
              <p className="mt-2 text-xs text-ink/55">{glassInfo.note}</p>
            </div>
          </>
        )}

        <div className="mt-8 border-t border-line pt-6">
          <div className="font-serif text-3xl">{aud(price)}</div>
          <div className="mt-1 text-xs text-ink/55">
            {describe(cfg)}. Artwork {size.label}; overall {Math.round(listed.w)} x {Math.round(listed.h)} cm.
          </div>
          {finish === "paper" && (
            <div className="mt-1 text-xs text-stone">Paper, mat and glass prices are indicative and confirmed when you enquire.</div>
          )}
          <a href={enquireHref}
            className="mt-6 inline-block w-full border border-ink bg-ink px-6 py-4 text-center text-xs uppercase tracking-widest2 text-paper transition hover:bg-transparent hover:text-ink">
            Enquire about this work
          </a>
          <div className="mt-4 flex gap-4 text-xs text-ink/60">
            {!room.sample && <button className="underline underline-offset-4 hover:text-ink" onClick={() => setStep("measure")}>Re-measure</button>}
            {pos && <button className="underline underline-offset-4 hover:text-ink" onClick={() => setPos(null)}>Re-centre</button>}
            <button className="underline underline-offset-4 hover:text-ink" onClick={() => setStep("start")}>Change room</button>
          </div>
        </div>
      </div>
    </div>
  );
}
