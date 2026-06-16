// Regenerate data/catalog.json from the CSVs in ../Body Scapes/artworks/
// Usage: node scripts/build-data.mjs  (run from the site/ folder)
import fs from "node:fs";
import path from "node:path";

const ART = process.env.ART_DIR || "../artworks"; // adjust to your artworks folder
function parseCSV(text) {
  const rows = []; let row = [], field = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"' && text[i + 1] === '"') { field += '"'; i++; } else if (c === '"') q = false; else field += c; }
    else if (c === '"') q = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c !== "\r") field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  const head = rows.shift();
  return rows.filter(r => r.length > 1).map(r => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ""])));
}

const A = parseCSV(fs.readFileSync(path.join(ART, "artworks.csv"), "utf8"));
const P = parseCSV(fs.readFileSync(path.join(ART, "pricing.csv"), "utf8"));

const artworks = A.map(r => ({
  slug: r.slug, title: r.title, image: `/artworks/${r.slug}.jpg`, thumb: `/artworks/${r.slug}-thumb.jpg`,
  collection: r.collection, editionSize: +r.edition_size, editionsSold: +r.editions_sold, status: r.status,
  size: r.size_cm, orientation: r.orientation, price: +r.price_aud, medium: r.medium,
  description: r.description, featured: r.featured.trim().toLowerCase() === "yes",
}));
const pricing = { landscape: [], square: [] };
for (const p of P) pricing[p.aspect]?.push({ size: p.size_label, frame: p.frame, price: +p.price_aud, status: p.price_status });
const frames = [...new Set(pricing.landscape.map(p => p.frame))];
const meta = {
  bodyscapes: { title: "Bodyscapes", tagline: "The body as terrain. The signature series.",
    intro: "Bodyscapes is the series that gives this work its name: the human form photographed until it reads as landscape. A shoulder becomes a horizon, a curve becomes a dune, and light moves across skin the way it moves across sand." },
  "abstract-forms": { title: "Abstract Forms", tagline: "Where the figure dissolves into pure light and line.",
    intro: "Where Bodyscapes keeps a trace of the figure, Abstract Forms lets it go entirely. These works push past the recognisable into pure photographic abstraction — light, line and texture, composed for their own sake." },
};
const collections = Object.entries(meta).map(([slug, m]) => ({ slug, ...m, count: artworks.filter(a => a.collection === slug).length }));
fs.writeFileSync("data/catalog.json", JSON.stringify({ artworks, collections, pricing, frames }, null, 2));
console.log(`catalog.json written — ${artworks.length} works, ${collections.length} collections`);
