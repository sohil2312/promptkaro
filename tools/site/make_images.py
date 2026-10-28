"""Turns sample-site screenshots (tools/samples/out) into the images the PromptKaro site uses.

  site-<key>.webp / site-<key>-m.webp   full-page previews, desktop and phone
  dash-<key>.webp                       business dashboards (HD, 1800 wide)
  hero-dashboard.webp                   the mobile shop dashboard in the hero
  mp-<page>.webp                        four pages of the furniture site (multi-page type)
Run from the repo root after tools/samples/shoot.js (and the extra shots in tools/site/shoot_extra.js).
"""
import os
from PIL import Image

O, A = 'tools/samples/out/', 'assets/img/'
SITES = ['mobile', 'clinic', 'coaching', 'food', 'property', 'interior', 'boutique', 'wedding', 'handicrafts', 'furniture', 'manufacturer']


def wide(src, dst, w, q):
    im = Image.open(src).convert('RGB')
    im.resize((w, round(im.height * w / im.width)), Image.LANCZOS).save(dst, quality=q, method=6)


if __name__ == '__main__':
    for k in SITES:
        wide(O + f'{k}-full.png', A + f'site-{k}.webp', 1100, 80)
        wide(O + f'{k}-mobfull.png', A + f'site-{k}-m.webp', 640, 78)
    for k in ['furniture', 'manufacturer', 'wedding', 'interior']:
        wide(O + f'dash-{k}.png', A + f'dash-{k}.webp', 1800, 80)
    wide(O + 'dashboard-desk.png', A + 'hero-dashboard.webp', 1100, 82)
    for src, dst in [('furniture', 'home'), ('furniture-sofas', 'sofas'), ('furniture-custom', 'custom'), ('furniture-visit', 'visit')]:
        wide(O + f'{src}-first.png', A + f'mp-{dst}.webp', 1280, 80)
    print('images written')
