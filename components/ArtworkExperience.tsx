"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import { Artwork, PriceRow, formatAUD } from "@/lib/catalog";

function frameStyle(frame: string): { bg: string; gap: string } | null {
  if (frame.startsWith("No frame")) return null;
  if (frame.startsWith("Black")) return { bg: "#141414", gap: "#0b0a09" };
  if (frame.startsWith("Natural oak")) return { bg: "#b9986a", gap: "#0b0a09" };
  if (frame.startsWith("White")) return { bg: "#efeee9", gap: "#0b0a09" };
  return { bg: "#141414", gap: "#0b0a09" };
}

export default function ArtworkExperience({
  artwork, pricing, frames, sizes,
}: { artwork: Artwork; pricing: PriceRow[]; frames: string[]; sizes: string[] }) {
  const defaultSize = sizes.includes(artwork.size) ? artwork.size : sizes[Math.floor(sizes.length / 2)];
  const [size, setSize] = useState(defaultSize);
  const [frame, setFrame] = useState(frames.find((f) => f.startsWith("Black")) ?? frames[0]);
  const [view, setView] = useState<"floating" | "framed">("floating");

  const row = useMemo(
    () => pricing.find((p) => p.size === size && p.frame === frame),
    [pricing, size, frame]
  );
  const fs = frameStyle(frame);
  const enquireHref =
    `/contact/?work=${encodeURIComponent(artwork.title)}&size=${encodeURIComponent(size)}` +
    `&frame=${encodeURIComponent(frame)}&price=${row ? row.price : ""}`;

  const Img = (
    <Image src={artwork.image} alt={`${artwork.title} — black and white photographic artwork by Nick Brand`}
      width={artwork.pixels.w} height={artwork.pixels.h} priority
      sizes="(max-width: 1024px) 100vw, 60vw"
      className="block h-auto w-auto max-h-[70vh] max-w-full" />
  );

  return (
    <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
      {/* Preview */}
      <div>
        <div className="flex min-h-[420px] items-center justify-center bg-paper p-2 md:p-6">
          {view === "floating" || !fs ? (
            <div style={{ boxShadow: "0 40px 70px -35px rgba(0,0,0,0.5)" }}>{Img}</div>
          ) : (
            <div style={{ background: fs.bg, padding: "2.4%", boxShadow: "0 40px 70px -30px rgba(0,0,0,0.6)" }}>
              <div style={{ background: fs.gap, padding: "1.4%" }}>{Img}</div>
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-center gap-2 text-xs uppercase tracking-widest2">
          {(["floating", "framed"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)}
              className={`border px-4 py-2 transition ${view === v ? "border-ink bg-ink text-paper" : "border-line text-ink/60 hover:border-ink"}`}>
              {v === "floating" ? "Floating" : "In frame"}
            </button>
          ))}
        </div>
      </div>

      {/* Configurator */}
      <div className="lg:pt-6">
        <div className="eyebrow mb-3">Choose your size &amp; frame</div>

        <div className="mb-6">
          <div className="mb-2 text-sm text-ink/60">Size</div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button key={s} onClick={() => setSize(s)}
                className={`border px-3 py-2 text-sm transition ${size === s ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <div className="mb-2 text-sm text-ink/60">Frame</div>
          <div className="flex flex-wrap gap-2">
            {frames.map((f) => (
              <button key={f} onClick={() => { setFrame(f); setView("framed"); }}
                className={`border px-3 py-2 text-sm transition ${frame === f ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"}`}>
                {f.replace(" floating frame", "").replace(" (gallery wrap)", "")}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-line pt-6">
          <div className="font-serif text-3xl">{row ? formatAUD(row.price) : "Price on request"}</div>
          <div className="mt-1 text-xs text-ink/45">
            {size}, {frame.toLowerCase()}. Price includes framing and ready-to-hang wiring.
          </div>
          {row && row.status !== "CONFIRMED" && (
            <div className="mt-1 text-xs text-stone">Indicative price — confirmed on enquiry.</div>
          )}
          <a href={enquireHref}
            className="mt-6 inline-block w-full border border-ink bg-ink px-6 py-4 text-center text-xs uppercase tracking-widest2 text-paper transition hover:bg-transparent hover:text-ink">
            Enquire to purchase
          </a>
          <p className="mt-3 text-center text-xs text-ink/45">
            Considered replies, usually within one business day. No pressure, no sales scripts.
          </p>
        </div>
      </div>
    </div>
  );
}
