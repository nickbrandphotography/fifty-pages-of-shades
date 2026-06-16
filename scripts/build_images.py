# Regenerate web images from the master files. Requires: pip install pillow
# Usage: python3 scripts/build_images.py  (run from the site/ folder)
import csv, os
from PIL import Image
Image.MAX_IMAGE_PIXELS = None
ART = os.environ.get("ART_DIR", "../artworks")
OUT = "public/artworks"
os.makedirs(OUT, exist_ok=True); os.makedirs("public/about", exist_ok=True)
def save(src, dst, longedge, q):
    im = Image.open(src)
    if im.mode != "RGB": im = im.convert("RGB")
    w, h = im.size; s = longedge / max(w, h)
    if s < 1: im = im.resize((round(w*s), round(h*s)), Image.LANCZOS)
    im.save(dst, "JPEG", quality=q, optimize=True, progressive=True)
for r in csv.DictReader(open(f"{ART}/artworks.csv", newline="")):
    src = f"{ART}/images/{r['image_file']}"
    save(src, f"{OUT}/{r['slug']}.jpg", 1800, 80)
    save(src, f"{OUT}/{r['slug']}-thumb.jpg", 1000, 78)
    print("ok", r["slug"])
p = f"{ART}/images/Nick Brand Photographer.jpg"
if os.path.exists(p): save(p, "public/about/nick-brand.jpg", 1200, 82)
print("done")
