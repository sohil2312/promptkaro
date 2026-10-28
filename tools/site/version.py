"""Stamps every local CSS/JS reference in the HTML pages with a content hash (?v=abc123).

Browsers can then keep CSS and JS for a year (see _headers) yet always get the new file
after a deploy, because the URL changes whenever the file does. HTML itself is revalidated
on every visit. Run from the repo root after any CSS/JS change: python3 tools/site/version.py
"""
import glob
import hashlib
import re

def h(path):
    return hashlib.sha256(open(path.lstrip('/'), 'rb').read()).hexdigest()[:10]

for page in glob.glob('*.html'):
    s = open(page, encoding='utf-8').read()
    s2 = re.sub(r'((?:href|src)=")(/(?:css|js)/[^"?]+\.(?:css|js))(?:\?v=[0-9a-f]+)?(")',
                lambda m: m.group(1) + m.group(2) + '?v=' + h(m.group(2)) + m.group(3), s)
    if s2 != s:
        open(page, 'w', encoding='utf-8').write(s2)
        print('stamped', page)
