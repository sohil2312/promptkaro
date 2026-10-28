---
name: PromptKaro website build
description: promptkaro.in, a website studio for local businesses in Gujarat. Rebranded 2026-10-27, quote-based since 2026-10-28
type: project
---

Rebranded on 2026-10-27 (anti-AI-slop pass). **DESIGN.md is the source of truth** for tokens, type,
motion and rules; the old master prompt / logo addendum describe the retired lime-on-black look.

**Owner's current wishes (2026-10-28):** no fixed prices (every site type asks for a quote), no
delivery-time promise (just "pay after the demo if you like it"), no displayed phone number, no
town names (Idar etc.), no calculators. Visuals must be realistic renders/screenshots, never SVG
vector illustrations. The owner wants their attached resource lists (uploads: Motion, GitHub
repos, Fonts, Galleries...) explored and used. Stock-photo hosts are blocked in the sandbox;
raw.githubusercontent.com and npm work.

**File structure:**
- index.html: hero stage (one device that follows the headline word: website, AI agent phone, dashboard, online store, catalogue; hero.js fires `pk:scene`, headline.js follows), examples (11 businesses, side list), how it works, products
  (search, catalog, AI shopping assistant, dashboard), agents (bot vs agent, console, detailed
  automated dashboard), site types (#types, quote-based), promise, about, FAQ, footer
- css/style.css: tokens + components; css/motion.css: all motion; css/legal.css: privacy/terms
- js/main.js language + header + dock; hero.js hero stage; showcase.js previews + tour; products.js;
  agents.js (compare, console, dashboard); turntable.js; tilt.js; types.js (motion video)
- tools/render: three.js PBR studio (products, phone/laptop/duo with screenshot screens);
  tools/render/blender: Cycles renders via bpy (pip install bpy into a venv; Python 3.13),
  specs/all.json -> render.py -> export.py; models from fetch-models.sh (Khronos, credits.html)
- tools/site: showcase.json + build_showcase.py (examples HTML), make_images.py, shoot_extra.js
- js/hero.js (GSAP hero stage), js/tabs.js (generic tabs), js/types.js (warped live screens)
- tools/samples: build.py (+ build_more.py, build_dash.py) sample sites and dashboards →
  shoot.js screenshots (out/ is gitignored)
- tests/website.spec.js: Playwright suite × 3 projects, includes anti-slop lint (section 8)

**How to apply:** WhatsApp is the ONLY conversion mechanism (no forms). Every new string needs a
data-gu translation. Never invent stats/testimonials. Keep terms.html in step with the site.
Preview: `npx serve . -p 3000` (no `-s`: it breaks /privacy and /terms). Test: `npx playwright test`.
CSP in _headers hashes the one inline script; if you change it, recompute the sha256. Classes
built in JS (e.g. `lvl-N` stock bars) don't appear in HTML; check before pruning CSS.
