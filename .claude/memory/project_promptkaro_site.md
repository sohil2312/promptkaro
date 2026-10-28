---
name: PromptKaro website build
description: promptkaro.in, a website studio in Idar, Gujarat, for local businesses. Rebranded 2026-10-27
type: project
---

Rebranded on 2026-10-27 (anti-AI-slop pass). **DESIGN.md is the source of truth** for tokens, type,
motion and rules; the old master prompt / logo addendum describe the retired lime-on-black look.

**File structure:**
- index.html: hero (WhatsApp chat), examples (business picker), how it works, prices, ₹0 promise, about, FAQ, footer
- css/style.css: tokens + components (mobile-first); css/motion.css: all motion; css/legal.css: privacy/terms
- js/main.js: EN ⇄ ગુ language (data-gu attrs, English read from HTML), header, mobile dock
- js/chat.js: hero chat sequence (WAAPI, FLIP); js/showcase.js: accessible tabs
- assets/fonts: Anek Gujarati (self-hosted, OFL); assets/og.png; assets/favicon.svg
- tests/website.spec.js: 36 tests × 3 projects, includes anti-slop lint (section 8)

**How to apply:** WhatsApp is the ONLY conversion mechanism (no forms). Every new string needs a
data-gu translation. Never invent stats/testimonials. Keep prices in sync with terms.html.
Preview: `npx serve . -p 3000` (no `-s`: it breaks /privacy and /terms). Test: `npx playwright test`.
CSP in _headers hashes the one inline script; if you change it, recompute the sha256.
