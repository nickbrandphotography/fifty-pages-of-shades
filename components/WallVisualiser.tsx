"use client";
// "View on your wall": photograph a wall (or pick a sample room), set the scale from one known measurement,
// then swipe through the works at true size and try frames, mats and glass with a live price.
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
type Room = {
  src: string; w: number; h: number;
  ppc: number | null; // natural image pixels per cm, once known
  sample?: { eyeY: number; furnitureTop: number };
};

// Sample rooms are drawn at 3.2 px per cm (wall about 5 m wide, 2.6 m high) with the floor at y=840, so the scale is known.
const SAMPLES = [
  { id: "living", label: "Living room", src: "/rooms/living.svg", w: 1600, h: 1000, ppc: 3.2, eyeY: 840 - 145 * 3.2, furnitureTop: 512 },
  { id: "office", label: "Office", src: "/rooms/office.svg", w: 1600, h: 1000, ppc: 3.2, eyeY: 840 - 145 * 3.2, furnitureTop: 540 },
];

const PRESETS: { label: string; cm: number | null }[] = [
  { label: "Door height (standard 204 cm)", cm: 204 },
  { label: "A4 sheet, long side (29.7 cm)", cm: 29.7 },
  { label: "Light switch plate, height (11.5 cm)", cm: 11.5 },
  { label: "Something else I've measured", cm: null },
];

const aud = (n: number) =>
  new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(n);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

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

/** The framed work, drawn at k display pixels per cm. */
function Piece({ art, cfg, k }: { art: VisArt; cfg: Config; k: number }) {
  const { w, h } = cfg.size;
  const px = (cm: number) => Math.max(1, cm * k);
  const wallShadow = `${px(0.6)}px ${px(1.8)}px ${px(3.5)}px rgba(0,0,0,0.38), 0 ${px(0.3)}px ${px(0.8)}px rgba(0,0,0,0.25)`;
  const img = (
    <img src={art.image} alt="" draggable={false}
      style={{ display: "block", width: w * k, height: h * k, objectFit: "cover", userSelect: "none" }} />
  );

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
      {/* Glass: a soft diagonal reflection whose strength depends on the glass type */}
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
  const [handles, setHandles] = useState<[Pt, Pt]>([{ x: 0, y: 0 }, { x: 0, y: 0 }]);
  const [preset, setPreset] = useState(0);
  const [refCm, setRefCm] = useState<number>(204);
  const [idx, setIdx] = useState(0);
  const [finish, setFinish] = useState<Finish>("canvas");
  const [moulding, setMoulding] = useState("oak");
  const [mat, setMat] = useState("white-8");
  const [glass, setGlass] = useState("non-reflective");
  const [sizeIdx, setSizeIdx] = useState<number | null>(null);
  const [pos, setPos] = useState<Pt | null>(null); // null = automatic hanging position
  const [brightness, setBrightness] = useState(1);
  const [scale, setScale] = useState(0.3); // display px per natural image px
  const wrapRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const drag = useRef<{ kind: "art" | "handle" | "swipe"; i?: number; start: Pt; origin: Pt; t: number } | null>(null);

  const art = artworks[idx];

  // Start on the work named in ?work=slug, if any.
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("work");
    const i = artworks.findIndex((a) => a.slug === slug);
    if (i >= 0) setIdx(i);
  }, [artworks]);

  // Fit the room image to the available width, and to 75% of the screen height.
  useEffect(() => {
    if (!room || !wrapRef.current) return;
    const el = wrapRef.current;
    const fit = () => {
      const maxH = window.innerHeight * 0.75;
      const dw = Math.min(el.clientWidth, (maxH * room.w) / room.h);
      setScale(dw / room.w);
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
  const outer = outerSize(cfg);
  const price = priceFor(cfg);

  const ppc = room?.ppc ?? 4;
  const artNat = { w: outer.w * ppc, h: outer.h * ppc };

  const autoPos = useCallback((): Pt => {
    if (!room) return { x: 0, y: 0 };
    if (room.sample) {
      const y = Math.min(room.sample.eyeY, room.sample.furnitureTop - 25 * ppc - artNat.h / 2);
      return { x: room.w / 2, y: Math.max(artNat.h / 2 + 10, y) };
    }
    return { x: room.w / 2, y: room.h * 0.42 };
  }, [room, ppc, artNat.h]);
  const centre = pos ?? autoPos();

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
      const lum = sum / (d.length / 4) / 255;
      setBrightness(clamp(0.6 + lum * 0.55, 0.72, 1.02));
    } catch { setBrightness(1); }
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const src = URL.createObjectURL(f);
    const im = await loadImage(src);
    const w = im.naturalWidth, h = im.naturalHeight;
    setRoom({ src, w, h, ppc: null });
    setHandles([{ x: w * 0.15, y: h * 0.22 }, { x: w * 0.15, y: h * 0.86 }]);
    setPos(null);
    measureBrightness(src);
    setStep("measure");
    e.target.value = "";
  }

  function pickSample(s: (typeof SAMPLES)[number]) {
    setRoom({ src: s.src, w: s.w, h: s.h, ppc: s.ppc, sample: { eyeY: s.eyeY, furnitureTop: s.furnitureTop } });
    setPos(null);
    setBrightness(1);
    setStep("place");
  }

  const handleDist = Math.hypot(handles[1].x - handles[0].x, handles[1].y - handles[0].y);
  function confirmMeasure() {
    if (!room || handleDist < 10 || !(refCm > 0)) return;
    setRoom({ ...room, ppc: handleDist / refCm });
    setPos(null);
    setStep("place");
  }

  const go = useCallback((dir: 1 | -1) => setIdx((i) => (i + dir + artworks.length) % artworks.length), [artworks.length]);

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

  // Pointer handling: drag the artwork or a measuring dot; a quick sideways swipe on the wall changes the work.
  function down(e: React.PointerEvent, kind: "art" | "handle" | "swipe", i?: number) {
    e.stopPropagation();
    try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch { /* pointer already gone */ }
    const origin = kind === "art" ? centre : kind === "handle" ? handles[i!] : { x: 0, y: 0 };
    drag.current = { kind, i, start: { x: e.clientX, y: e.clientY }, origin, t: Date.now() };
  }
  function move(e: React.PointerEvent) {
    const d = drag.current;
    if (!d || !room) return;
    const dx = (e.clientX - d.start.x) / scale, dy = (e.clientY - d.start.y) / scale;
    if (d.kind === "art") {
      setPos({ x: clamp(d.origin.x + dx, 0, room.w), y: clamp(d.origin.y + dy, 0, room.h) });
    } else if (d.kind === "handle") {
      const p = { x: clamp(d.origin.x + dx, 0, room.w), y: clamp(d.origin.y + dy, 0, room.h) };
      setHandles((hs) => (d.i === 0 ? [p, hs[1]] : [hs[0], p]));
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
    if (f === "paper" && moulding === "none") setMoulding("oak");
  }

  const enquireHref =
    `/contact/?work=${encodeURIComponent(art.title)}&size=${encodeURIComponent(size.label)}` +
    `&frame=${encodeURIComponent(describe(cfg))}&price=${price}`;

  const btn = (on: boolean) =>
    `border px-3 py-2 text-sm transition ${on ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"}`;

  // ---------- Step 1: choose a room ----------
  if (step === "start" || !room) {
    return (
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <div className="eyebrow mb-3">Step 1</div>
          <h2 className="font-serif text-3xl">Photograph your wall</h2>
          <p className="mt-4 max-w-md text-ink/60">
            Stand square to the wall, a few steps back, and take a photo that shows something you know the size of:
            a door, an A4 sheet taped to the wall, or a light switch. Your photo stays on your device and is never uploaded.
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
                <img src={s.src} alt={`Sample ${s.label.toLowerCase()}`} className="w-full border border-line transition group-hover:border-ink" />
                <span className="mt-2 block text-sm text-ink/70">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const stageW = room.w * scale, stageH = room.h * scale;

  // ---------- Step 2: set the scale ----------
  if (step === "measure") {
    const mid = { x: ((handles[0].x + handles[1].x) / 2) * scale, y: ((handles[0].y + handles[1].y) / 2) * scale };
    return (
      <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div ref={wrapRef} className="w-full min-w-0">
          <div className="relative mx-auto select-none" style={{ width: stageW, height: stageH, touchAction: "none" }}
            onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
            <img src={room.src} alt="Your wall" draggable={false} className="block h-full w-full" />
            <svg className="absolute inset-0" width={stageW} height={stageH}>
              <line x1={handles[0].x * scale} y1={handles[0].y * scale} x2={handles[1].x * scale} y2={handles[1].y * scale}
                stroke="#fff" strokeWidth={4} strokeOpacity={0.9} />
              <line x1={handles[0].x * scale} y1={handles[0].y * scale} x2={handles[1].x * scale} y2={handles[1].y * scale}
                stroke="#0A0A0A" strokeWidth={2} strokeDasharray="8 6" />
            </svg>
            {handles.map((h, i) => (
              <div key={i} role="slider" aria-label={i === 0 ? "Start of measurement" : "End of measurement"} aria-valuenow={0}
                onPointerDown={(e) => down(e, "handle", i)}
                className="absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-grab items-center justify-center"
                style={{ left: h.x * scale, top: h.y * scale, touchAction: "none" }}>
                <span className="block h-5 w-5 rounded-full border-2 border-white bg-ink shadow" />
              </div>
            ))}
            <div className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 bg-ink px-2 py-1 text-xs text-paper"
              style={{ left: mid.x + 40, top: mid.y }}>
              {refCm > 0 ? `${refCm} cm` : "?"}
            </div>
          </div>
        </div>
        <div>
          <div className="eyebrow mb-3">Step 2</div>
          <h2 className="font-serif text-3xl">Set the scale</h2>
          <p className="mt-4 text-ink/60">
            Drag the two dots to each end of something in the photo you know the size of. This tells us how big
            everything on your wall really is.
          </p>
          <label className="mt-6 block">
            <span className="mb-1 block text-sm text-ink/60">What are you measuring?</span>
            <select value={preset} onChange={(e) => { const i = +e.target.value; setPreset(i); if (PRESETS[i].cm) setRefCm(PRESETS[i].cm!); }}
              className="w-full border border-line bg-paper px-3 py-3 outline-none focus:border-ink">
              {PRESETS.map((p, i) => <option key={p.label} value={i}>{p.label}</option>)}
            </select>
          </label>
          <label className="mt-4 block">
            <span className="mb-1 block text-sm text-ink/60">Its real length in cm</span>
            <input type="number" inputMode="decimal" min={1} step="0.1" value={refCm || ""}
              onChange={(e) => { setRefCm(parseFloat(e.target.value)); setPreset(PRESETS.length - 1); }}
              className="w-full border border-line bg-paper px-3 py-3 outline-none focus:border-ink" />
          </label>
          <div className="mt-6 flex gap-3">
            <button onClick={confirmMeasure} disabled={handleDist < 10 || !(refCm > 0)}
              className="flex-1 border border-ink bg-ink px-6 py-4 text-xs uppercase tracking-widest2 text-paper transition hover:bg-transparent hover:text-ink disabled:opacity-40">
              Place artwork
            </button>
            <button onClick={() => setStep("start")} className="border border-line px-4 py-4 text-xs uppercase tracking-widest2 hover:border-ink">
              Back
            </button>
          </div>
          <p className="mt-4 text-xs text-ink/45">
            Tip: measure something flat against the wall, at about the height you will hang the art, for the most accurate result.
          </p>
        </div>
      </div>
    );
  }

  // ---------- Step 3: place, swipe and frame ----------
  const k = ppc * scale; // display px per cm
  const glassInfo = GLASS.find((g) => g.id === glass) ?? GLASS[0];
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <div ref={wrapRef} className="w-full min-w-0">
        <div className="relative mx-auto select-none overflow-hidden" style={{ width: stageW, height: stageH, touchAction: "pan-y" }}
          onPointerDown={(e) => down(e, "swipe")} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
          <img src={room.src} alt="Your wall" draggable={false} className="block h-full w-full" />
          <div onPointerDown={(e) => down(e, "art")}
            className="absolute cursor-grab active:cursor-grabbing"
            style={{
              left: centre.x * scale - (artNat.w * scale) / 2, top: centre.y * scale - (artNat.h * scale) / 2,
              touchAction: "none", filter: brightness < 0.99 ? `brightness(${brightness})` : undefined,
            }}>
            <Piece art={art} cfg={cfg} k={k} />
          </div>
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
            <button key={a.slug} onClick={() => setIdx(i)} aria-label={a.title}
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
            <button className={btn(finish === "paper")} onClick={() => chooseFinish("paper")}>Paper, mat &amp; glass</button>
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-2 text-sm text-ink/60">Size (artwork)</div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s, i) => (
              <button key={s.label} className={btn(s.label === size.label)} onClick={() => { setSizeIdx(i); }}>{s.label}</button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-2 text-sm text-ink/60">{finish === "canvas" ? "Floating frame" : "Frame"}</div>
          <div className="flex flex-wrap gap-2">
            {MOULDINGS.filter((m) => finish === "canvas" || m.id !== "none").map((m) => (
              <button key={m.id} className={btn(moulding === m.id)} onClick={() => setMoulding(m.id)}>{m.label}</button>
            ))}
          </div>
        </div>

        {finish === "paper" && (
          <>
            <div className="mt-5">
              <div className="mb-2 text-sm text-ink/60">Mat board</div>
              <div className="flex flex-wrap gap-2">
                {MATS.map((m) => (
                  <button key={m.id} className={btn(mat === m.id)} onClick={() => setMat(m.id)}>{m.label}</button>
                ))}
              </div>
            </div>
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
            {describe(cfg)}. Artwork {size.label}; overall {Math.round(outer.w)} x {Math.round(outer.h)} cm.
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
