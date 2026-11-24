"""Room mock-ups for Fifty Pages of Shades.

Each work is composited into three photographed interiors, each a different kind of room,
at its default size (the one shown on its artwork page) and in the oak shadow frame.
The photograph is never cropped or stretched: it keeps its own proportions at that size's
area, and angled walls are drawn in true perspective.

The room library, its calibration and the renderer are shared with the Ritushka site, so
both sites use the same rooms and the same engine:

    ../Ritushka-artist-site/mockups/scenes.json, mockups/scenes/*.jpg
    ../Ritushka-artist-site/scripts/mockup_engine.py

Run (Python 3.14 with numpy and Pillow):

    py -3.14 scripts/build-mockups.py            # render what changed
    py -3.14 scripts/build-mockups.py --force    # render everything

Writes public/mockups/*.jpg and data/mockups.json.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LIBRARY = os.environ.get('MOCKUP_LIBRARY',
                         os.path.join(ROOT, '..', 'Ritushka-artist-site'))
sys.path.insert(0, os.path.join(LIBRARY, 'scripts'))
from mockup_engine import (ENGINE_VERSION, PX_PER_CM, WallCamera, WallPlane,  # noqa: E402
                           box_corners, choose_placement, displayed_size_cm, hang_centre,
                           multiply_shadow, relight, render_panel, render_sides,
                           wall_contact_shadow, wall_shadow, warp_into)

os.chdir(ROOT)
SCENES_JSON = os.path.join(LIBRARY, 'mockups', 'scenes.json')
SCENE_DIR = os.path.join(LIBRARY, 'mockups', 'scenes')
OUT_DIR = 'public/mockups'
DATA = 'data/mockups.json'
MANIFEST = 'scripts/mockups-manifest.json'
OUT_WIDTH = 1800
OUT_QUALITY = 84
PER_ARTWORK = 3
DEPTH_CM = 4.0            # gallery-wrapped canvas
FRAMED = True             # house style: the 10 mm oak shadow frame

# Mirrors lib/pricing.ts (ladderFor, closestSize): the default size shown on each artwork page.
LADDER_SQUARE = [60, 80, 100, 120, 150, 180, 200]
LADDER_LANDSCAPE = [90, 120, 150, 180, 210, 240, 300]


def ladder_for(px):
    ratio = px['w'] / px['h']
    square = ratio < 1.05
    out = []
    for long in (LADDER_SQUARE if square else LADDER_LANDSCAPE):
        # JS Math.round rounds halves up
        short = long if square else int((long / ratio / 5) + 0.5) * 5
        out.append((long, short))
    return out


def default_size(a):
    rw, rh = [int(n) for n in a['size'].replace(' cm', '').split(' x ')]
    ref = rw * rh
    best = None
    for d in ladder_for(a['pixels']):
        if best is None or abs(d[0] * d[1] - ref) < abs(best[0] * best[1] - ref):
            best = d
    return best            # (width, height) in cm


def file_hash(path):
    h = hashlib.sha1()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(1 << 20), b''):
            h.update(chunk)
    return h.hexdigest()[:16]


def pick_rooms(artworks, scenes):
    """Three rooms per work, each a different kind, spread across the library."""
    used, picks = {}, {}
    order = sorted(artworks, key=lambda a: (-default_size(a)[0] * default_size(a)[1], a['slug']))
    for a in order:
        w, h = default_size(a)
        ranked = []
        for sc in scenes:
            place = choose_placement(sc, w + 3, h + 3)
            if place is None:
                continue
            sweet = min(place.get('maxWidthCm', 200) * 0.62, 180.0)
            s = 2.0 * max(0.0, 1.0 - abs(w - sweet) / sweet)
            if w < place.get('minWidthCm', 0):
                s -= 2.5
            s -= 1.4 * used.get(sc['id'], 0)
            ranked.append((s, sc['id'], sc))
        ranked.sort(key=lambda t: (-t[0], t[1]))
        chosen, kinds = [], set()
        for _, _, sc in ranked:
            kind = sc.get('room', sc['name'])
            if kind in kinds:
                continue
            chosen.append(sc)
            kinds.add(kind)
            if len(chosen) == PER_ARTWORK:
                break
        picks[a['slug']] = chosen
        for sc in chosen:
            used[sc['id']] = used.get(sc['id'], 0) + 1
    return picks


def composite(a, w_cm, h_cm, scene, scene_img):
    plane = WallPlane(scene['wall']['quad'], scene['wall']['widthCm'], scene['wall']['heightCm'])
    art = Image.open('public/artworks/%s.jpg' % a['slug']).convert('RGB')
    draw_w, draw_h, _ = displayed_size_cm(art, w_cm, h_cm)
    seed = int(hashlib.md5(a['slug'].encode()).hexdigest()[:8], 16)
    panel = render_panel(art, draw_w, draw_h, FRAMED, seed=seed)
    pw, ph = panel.width / PX_PER_CM, panel.height / PX_PER_CM

    place = choose_placement(scene, pw, ph)
    if place is None:
        raise ValueError(f"{a['slug']} ({w_cm}x{h_cm} cm) does not fit {scene['id']}")
    cx, cy = hang_centre(place, ph)
    quad = plane.quad_for(cx, cy, pw, ph)
    local_scale = plane.px_per_cm_at(cx, cy)

    out = scene_img.convert('RGB')
    light = scene.get('light', {})
    side = light.get('from', 'left')
    cam_cfg = scene.get('camera', {})
    cam = WallCamera(plane, out.size, cam_cfg.get('focalPx'), cam_cfg.get('principalY'))

    cast = wall_shadow(out.size, cam, cx, cy, pw, ph, DEPTH_CM, side,
                       float(light.get('strength', 0.34)), float(light.get('softness', 3.0)), local_scale)
    out = multiply_shadow(out, cast)
    out = multiply_shadow(out, wall_contact_shadow(out.size, cam, cx, cy, pw, ph, DEPTH_CM, local_scale))
    sides = render_sides(panel, cam, cx, cy, pw, ph, DEPTH_CM, out.size, side, FRAMED, seed)
    layer = Image.alpha_composite(sides, warp_into(panel, quad, out.size))
    _, back = box_corners(cam, cx, cy, pw, ph, DEPTH_CM)
    layer = relight(layer, out, list(quad) + list(back),
                    strength=float(light.get('relight', 0.55)), exposure=float(light.get('exposure', 1.0)))
    out = Image.alpha_composite(out.convert('RGBA'), layer).convert('RGB')
    if out.width > OUT_WIDTH:
        out = out.resize((OUT_WIDTH, round(out.height * OUT_WIDTH / out.width)), Image.LANCZOS)
    return out


ROOM_WORDS = {
    'Living Room': 'a living room', 'Hotel Lobby': 'a hotel lobby', 'Boardroom': 'a boardroom',
    'Office Reception': 'an office reception', 'Bedroom': 'a bedroom', 'Penthouse': 'a penthouse',
    'Gallery': 'a gallery', 'Study': 'a study', 'Restaurant': 'a restaurant', 'Hallway': 'a hallway',
    'Apartment': 'an apartment',
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--force', action='store_true')
    args = ap.parse_args()

    scenes = [s for s in json.load(open(SCENES_JSON, encoding='utf-8'))['scenes'] if s.get('active', True)]
    artworks = json.load(open('data/catalog.json', encoding='utf-8'))['artworks']
    manifest = json.load(open(MANIFEST, encoding='utf-8')) if os.path.exists(MANIFEST) else {}
    picks = pick_rooms(artworks, scenes)
    os.makedirs(OUT_DIR, exist_ok=True)

    records, rendered, skipped, failed = [], 0, 0, 0
    cache = {}
    for a in sorted(artworks, key=lambda x: x['slug']):
        w_cm, h_cm = default_size(a)
        for sc in picks.get(a['slug'], []):
            slug = f"{a['slug']}-in-{sc['id']}"
            scene_path = os.path.join(SCENE_DIR, sc['file'])
            sig = hashlib.sha1(json.dumps({
                'engine': ENGINE_VERSION, 'art': file_hash('public/artworks/%s.jpg' % a['slug']),
                'scene': file_hash(scene_path), 'size': [w_cm, h_cm], 'framed': FRAMED,
                'geometry': [sc['wall'], sc.get('placements'), sc['light'], sc.get('camera')],
                'out': [OUT_WIDTH, OUT_QUALITY, '444'],
            }, sort_keys=True).encode()).hexdigest()[:16]
            out_path = os.path.join(OUT_DIR, slug + '.jpg')
            if args.force or manifest.get(slug) != sig or not os.path.exists(out_path):
                if sc['id'] not in cache:
                    cache[sc['id']] = Image.open(scene_path)
                try:
                    img = composite(a, w_cm, h_cm, sc, cache[sc['id']])
                except Exception as e:                       # noqa: BLE001
                    print('  FAILED', slug, '-', e)
                    failed += 1
                    continue
                img.save(out_path, quality=OUT_QUALITY, optimize=True, progressive=True, subsampling=0)
                manifest[slug] = sig
                rendered += 1
                print('  rendered', slug)
            else:
                skipped += 1
            with Image.open(out_path) as im:
                ow, oh = im.size
            where = ROOM_WORDS.get(sc.get('room'), 'a room')
            records.append({
                'slug': slug, 'artworkSlug': a['slug'], 'sceneId': sc['id'], 'room': sc.get('room'),
                'image': f'/mockups/{slug}.jpg', 'width': ow, 'height': oh,
                'sizeLabel': f'{w_cm} x {h_cm} cm',
                'alt': f"{a['title']} by Nick Brand in an oak shadow frame, hanging in {where}, "
                       f"shown at {w_cm} x {h_cm} cm",
            })

    json.dump(manifest, open(MANIFEST, 'w', encoding='utf-8'), indent=1, sort_keys=True)
    json.dump(records, open(DATA, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    print(f"rendered {rendered}, unchanged {skipped}, failed {failed}; {len(records)} mock-ups")


if __name__ == '__main__':
    main()
