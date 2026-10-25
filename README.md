# Fifty Pages of Shades — Website (Next.js 15, Vercel)

Collector-acquisition site for **Fifty Pages of Shades** by Nick Brand. Black-and-white bodyscape & abstract photographic
art, limited editions on framed canvas. Built with Next.js 15 (App Router), TypeScript, Tailwind. Runs natively
on **Vercel** with automatic image optimisation.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
```

## Deploy to Vercel

1. Push this `site/` folder to a Git repo (GitHub/GitLab/Bitbucket).
2. In Vercel: **New Project → import the repo**. Framework preset auto-detects **Next.js** — no config needed.
3. Set the custom domain `fiftypagesofshades.com` in Vercel → Project → Domains.

Or from the CLI: `npm i -g vercel` then `vercel` (preview) / `vercel --prod` (production), run inside `site/`.

Image optimisation (AVIF/WebP, responsive srcset) is handled automatically by Vercel — no extra setup.

## What's built

- **Home** — hero, entity intro, collections, trust pillars, recent works, designer/collector paths
- **Collections** hub + **Bodyscapes** / **Abstract Forms** pages
- **Available Works** gallery with live filter (collection / shape / price)
- **Journal** with article template + 3 starter posts (BlogPosting schema)
- **Collector Guide, Investment, Large Scale Art, Commissions, Corporate Art, FAQ, Glossary** (FAQ + DefinedTerm schema)
- **Artwork detail** (×17) — floating ⇄ in-frame preview, live **size + frame** configurator with pricing,
  story, specs, related works, VisualArtwork + Breadcrumb schema
- **About Nick Brand**, **Trade Program**, **Contact** (enquiry prefilled from the configurator)
- `sitemap.xml`, `robots.txt`, Organization / WebSite / Person / VisualArtwork / CollectionPage schema

## Your content

1. **`../artworks/`** (the `Body Scapes/artworks` folder in the project) — `artworks.csv`, `pricing.csv`, `images/`.
2. **`data/catalog.json`** — the generated catalogue the site reads.

### To update artworks or prices
```bash
node scripts/build-data.mjs      # rebuilds data/catalog.json from the CSVs (set ART_DIR if needed)
python3 scripts/build_images.py  # rebuilds web images from masters (pip install pillow)
```
(Step 2 is only needed when you add or replace artwork files.)

## Still to wire up before launch
- Real frame prices in `pricing.csv` (non-$2,700 cells are indicative placeholders).
- **Contact form** posts to a real handler at `app/api/enquiry/route.ts` (emails the studio via Resend). To turn
  it on, set `RESEND_API_KEY`, `ENQUIRY_TO` and `ENQUIRY_FROM` in Vercel → Project → Settings → Environment
  Variables (see `.env.example`, and verify your sending domain at resend.com). Until those are set, the form
  automatically falls back to opening the visitor's email client — so it works either way.
- Self-host the fonts (currently loaded from Google Fonts) for best performance.
- Add more Journal articles from the 200 ideas in `../02_Content_Engine_200_Ideas.md` (edit `lib/journal.ts`).
- Authority pages (Exhibitions / Press / Testimonials) as the record grows.

Brand voice, SEO, schema strategy and the full build spec are in `../01`–`../06` markdown docs.
