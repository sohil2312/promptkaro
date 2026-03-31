---
name: PromptKaro website build
description: Full production website built for promptkaro.in — vibecoding agency, Idar Gujarat
type: project
---

Full production site built on 2026-03-31 from promptkaro_master_prompt.md + promptkaro_logo_addendum.md.

**File structure:**
- index.html — full semantic HTML, 8 sections
- css/style.css — layout, components, custom properties
- css/animations.css — all @keyframes
- css/responsive.css — mobile-first (375 / 768 / 1440)
- js/terminal-effect.js — hero terminal typing + word rotation
- js/animations.js — scroll reveal (IntersectionObserver) + count-up stats
- js/main.js — sticky nav, smooth scroll
- tests/website.spec.js — 37 tests × 3 viewports = 111 total
- playwright.config.js — Desktop Chrome, Mobile Chrome, Tablet (all Chromium)

**Why:** This IS the portfolio/showcase. Must feel production-ready.

**How to apply:** When updating, keep WhatsApp as the ONLY conversion mechanism (no forms). Run `npx playwright test` to verify. Use `npx serve . -p 3000 -s` to preview locally.
