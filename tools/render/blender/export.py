"""Turns Cycles renders (out/blender/*.png) into web images.

  scenes (rooms, backdrops)  -> tools/samples/img/<name>.webp, 1600 wide
  cutouts (transparent)      -> tools/samples/img/<name>.webp, trimmed to the object and its shadow
  site assets                -> assets/img/<name>-thumb.webp (square) and <name>-card.webp (3:2)
Run from the repo root after blender/render.py.
"""
import json
import os
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..')
OUT = os.path.join(ROOT, 'tools/render/out/blender')
SAMPLES = os.path.join(ROOT, 'tools/samples/img')
ASSETS = os.path.join(ROOT, 'assets/img')
SPECS = json.load(open(os.path.join(ROOT, 'tools/render/blender/specs/all.json')))


def trim(im, pad=0.16):
    """Square crop around the object (alpha > 50), extended into the render so the soft shadow
    comes along, with the alpha faded towards the edges: no hard line where a shadow is cut."""
    from PIL import ImageDraw, ImageFilter
    a = im.split()[3].point(lambda v: 255 if v > 50 else 0)
    box = a.getbbox()
    w, h = box[2] - box[0], box[3] - box[1]
    s = int(max(w, h) * (1 + pad * 2))
    cx, cy = (box[0] + box[2]) // 2, (box[1] + box[3]) // 2
    # The render frame can clip a long shadow too: fade the render's own borders first.
    e = int(min(im.size) * 0.08)
    fm = Image.new('L', im.size, 0)
    ImageDraw.Draw(fm).rectangle((e, e, im.width - e, im.height - e), fill=255)
    fm = fm.filter(ImageFilter.GaussianBlur(e / 2))
    r0, g0, b0, a0 = im.split()
    im = Image.merge('RGBA', (r0, g0, b0, Image.composite(a0, Image.new('L', im.size, 0), fm)))
    big = Image.new('RGBA', (im.width + 2 * s, im.height + 2 * s), (0, 0, 0, 0))
    big.paste(im, (s, s))
    canvas = big.crop((cx + s - s // 2, cy + s - s // 2, cx + s - s // 2 + s, cy + s - s // 2 + s))
    f = int(s * 0.12)
    mask = Image.new('L', (s, s), 0)
    ImageDraw.Draw(mask).rectangle((f, f, s - f, s - f), fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(f / 2))
    r, g, b, al = canvas.split()
    al = Image.composite(al, Image.new('L', (s, s), 0), mask)
    return Image.merge('RGBA', (r, g, b, al))


def cover(im, w, h):
    r = max(w / im.width, h / im.height)
    im = im.resize((round(im.width * r), round(im.height * r)), Image.LANCZOS)
    x, y = (im.width - w) // 2, (im.height - h) // 2
    return im.crop((x, y, x + w, y + h))


def on(bg, im):
    base = Image.new('RGBA', im.size, bg)
    base.alpha_composite(im)
    return base.convert('RGB')


if __name__ == '__main__':
    for name, spec in SPECS.items():
        src = os.path.join(OUT, name + '.png')
        if not os.path.exists(src):
            print('missing', name)
            continue
        im = Image.open(src).convert('RGBA')
        if spec.get('mode') == 'cutout':
            t = trim(im)
            t.resize((700, 700), Image.LANCZOS).save(os.path.join(SAMPLES, name + '.webp'), quality=88, method=6)
        else:
            w = 1600
            im.convert('RGB').resize((w, round(im.height * w / im.width)), Image.LANCZOS).save(os.path.join(SAMPLES, name + '.webp'), quality=84, method=6)
    # Small assets for the hero, the agent chats and the dashboards on the PromptKaro site itself.
    thumbs = {'fur-velvet': None, 'bou-corset': None, 'mfg-fridge': None, 'int-reading': 'photo', 'wed-table': 'photo', 'craft-hero': 'photo', 'int-living': 'photo'}
    for n, kind in thumbs.items():
        im = Image.open(os.path.join(OUT, n + '.png')).convert('RGBA')
        if kind == 'photo':
            cover(im.convert('RGB'), 300, 300).save(os.path.join(ASSETS, n + '-thumb.webp'), quality=82)
            cover(im.convert('RGB'), 480, 320).save(os.path.join(ASSETS, n + '-card.webp'), quality=82)
        else:
            t = trim(im, 0.08)
            t.resize((300, 300), Image.LANCZOS).save(os.path.join(ASSETS, n + '-thumb.webp'), quality=86)
            card = Image.new('RGBA', (480, 320), (0, 0, 0, 0))
            tt = t.resize((300, 300), Image.LANCZOS)
            card.alpha_composite(tt, (90, 10))
            on((239, 232, 222, 255) if n.startswith('fur') else (246, 228, 223, 255) if n.startswith('bou') else (232, 236, 238, 255), card).save(os.path.join(ASSETS, n + '-card.webp'), quality=84)
    print('exported')
