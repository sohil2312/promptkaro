"""Writes the examples showcase in index.html from tools/site/showcase.json.

Each business gets a tab (name + one-line description) and a panel: a scrolling preview of its
sample site (desktop and phone screenshots from tools/samples) and what's on the site.
Image sizes are read from assets/img so width/height attributes always match the files.
Run from the repo root: python3 tools/site/build_showcase.py
"""
import html
import json
import os
import urllib.parse

from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')
WA = 'https://wa.me/919429051036?text='


def size(path):
    with Image.open(os.path.join(ROOT, path.lstrip('/'))) as im:
        return im.size


def esc(s):
    return html.escape(s, quote=True)


def build(data):
    tabs, panels = [], []
    for i, p in enumerate(data):
        k = p['key']
        on = i == 0
        tabs.append(
            f'            <button role="tab" id="tab-{k}" aria-controls="panel-{k}" aria-selected="{"true" if on else "false"}"'
            f'{"" if on else " tabindex=\"-1\""}><span class="tab-name" data-gu="{esc(p["tab_gu"])}">{esc(p["tab_en"])}</span>'
            f'<span class="tab-desc" data-gu="{esc(p["desc_gu"])}">{esc(p["desc_en"])}</span></button>')
        dw, dh = size(f'assets/img/site-{k}.webp')
        mw, mh = size(f'assets/img/site-{k}-m.webp')
        ticks = '\n'.join(f'                <li data-gu="{esc(g)}">{esc(e)}</li>' for e, g in p['ticks'])
        panels.append(f'''          <div class="panel" role="tabpanel" id="panel-{k}" aria-labelledby="tab-{k}">
            <figure class="site-preview" data-ui>
              <div class="site-bar"><span class="site-url" translate="no">{esc(p["url"])}</span></div>
              <div class="site-view" tabindex="0" role="img" aria-label="{esc(p["label_en"])}" data-gu-label="{esc(p["label_gu"])}">
                <picture><source media="(max-width: 700px)" srcset="/assets/img/site-{k}-m.webp" width="{mw}" height="{mh}"><img src="/assets/img/site-{k}.webp" width="{dw}" height="{dh}" alt="" loading="lazy" decoding="async"></picture>
              </div>
            </figure>
            <div class="panel-copy">
              <h3 data-gu="આ સાઇટમાં શું છે">What's on this site</h3>
              <ul class="ticks-list">
{ticks}
              </ul>
              <a class="btn btn-ink js-wa" target="_blank" rel="noopener noreferrer"
                 href="{WA}{urllib.parse.quote(p["msg_en"])}"
                 data-msg-en="{esc(p["msg_en"])}" data-msg-gu="{esc(p["msg_gu"])}">
                <span data-gu="આવી સાઇટ માંગો">Ask for a site like this</span>
              </a>
            </div>
          </div>''')
    return ('        <div class="showcase" id="showcase">\n'
            '          <div class="tabs" role="tablist" aria-label="Type of business" data-gu-label="બિઝનેસનો પ્રકાર">\n'
            + '\n'.join(tabs) + '\n          </div>\n          <div class="panels">\n'
            + '\n'.join(panels) + '\n          </div>\n        </div>\n')


if __name__ == '__main__':
    path = os.path.join(ROOT, 'index.html')
    s = open(path, encoding='utf-8').read()
    data = json.load(open(os.path.join(ROOT, 'tools/site/showcase.json'), encoding='utf-8'))
    start = s.index('        <div class="showcase" id="showcase">')
    end = s.index('      </div>\n    </section>', start)
    s = s[:start] + build(data) + s[end:]
    open(path, 'w', encoding='utf-8').write(s)
    print('showcase:', ', '.join(p['key'] for p in data))
