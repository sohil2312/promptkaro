# PromptKaro design system

This file is the source of truth for how promptkaro.in looks and moves. It supersedes the visual
direction in `promptkaro_master_prompt.md` and `promptkaro_logo_addendum.md` (the lime-on-black
terminal look). Change this file first, then the CSS.

## The idea

**The WhatsApp chat where every PromptKaro job starts becomes the hero.** Shop owners in
Sabarkantha already live in WhatsApp, so the page shows the service the way they will actually
experience it: a message, a demo link two days later, "make it live". Everything else is plain,
fast and honest: real prices, real terms, no invented proof.

- Audience: shop owners, clinics, coaching classes, property dealers, restaurants. Mostly on
  phones, often on Jio. Not developers.
- One job: send a WhatsApp message asking for the free demo.
- One live thing: the business picker in "What your site could look like". It changes the sample
  site and pre-fills the WhatsApp message with that business type.

## Tokens (all in `css/style.css` `:root`)

| Role | Value | Notes |
| --- | --- | --- |
| Ground | `#FFFFFF` / `#F4F4EF` | Sections alternate by a tone step, never a line |
| Ink | `#13201A` | Green-black. All running text |
| Ink 2 / 3 | `#3E4943` / `#5B6660` | Secondary / tertiary text, both pass AA |
| Action | `#008069` | WhatsApp's own green. White text 4.9:1. Every CTA |
| Marigold | `#FFB224` | Brand mark: cursor, ₹0, "our pick", focus ring, selection. Never on body text |

**Product cards are the one place the palette widens:** rani pink `#C2185B`, marigold, peacock
`#0F5F66` and neem `#CFE7B8`, cycling so no colour repeats side by side. Each card is a saturated
fill (28px radius, no shadow) holding a white fragment of real UI. The pattern (saturated cards
with live product UI inside) follows the analysis of clay.com in VoltAgent/awesome-design-md; the
colours, fragments, motion and copy are PromptKaro's own, and none of Clay's illustrations or
brand assets are used.

Type: **Anek Gujarati** (Ek Type, Mumbai, OFL), self-hosted, one family for English and
Gujarati. Five sizes: 15 / 18 / 20–24 / 32–52 / 44–108px. Display weight 640, tracking −0.025 to
−0.035em. Gujarati gets more line-height and a smaller hero (`html[lang="gu"]` rules). The
Gujarati font file (159 KB) only downloads when Gujarati text is on screen.

Space: 4px base (`--s-1`…`--s-10`). Radius by nesting: pill for buttons/tabs, 18px cards, 28px
for the chat device. Shadows only on things that float (chat, sample sites, dock).

## Motion (`css/motion.css`)

Based on Emil Kowalski's design-engineering rules.

- Curves: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`, `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)`,
  `--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1)`. Never `ease-in`, never `transition: all`.
- **One orchestrated moment:** the hero chat plays once when it's on screen (typing indicator,
  messages push up with FLIP, 300ms ease-out), then offers "Play again". Finishes instantly if the
  tab is hidden.
- Page load: hero lines rise 16px with 60–70ms stagger, once.
- Feedback: every pressable scales to 0.97 on `:active` (140ms). Hover effects only under
  `(hover: hover) and (pointer: fine)`.
- **Sample cards build themselves** (the product-card moment): a chip reads "Building from your
  price list…", the header wipes in with `clip-path`, rows resolve from shimmering skeletons one
  after another (150ms apart), the note and WhatsApp button arrive last, and the chip flips to
  "Demo ready". About 1.4s, on first view and on each tab switch. Transitions, not keyframes, so
  switching mid-build retargets cleanly. Skipped under reduced motion.
- **Product cards fill themselves in**, once, when 45% visible: the Website card types a search
  then resolves the shop's result and its chips; the Catalog tiles shimmer then fill one by one
  before the share button lands; the EMI slider glides 3 → 12 months while the amount rolls (and
  stays a real, keyboard-usable control); the Dashboard bars grow left to right as the total
  counts to 38. Grabbing the slider mid-demo stops the demo. Titles and copy are never hidden.
- **Cards feel physical:** on mouse, a sample card tilts up to 5° (product cards 3°) toward the pointer through a
  damped spring (it lags and settles, never snaps) with a soft sheen; on press, mouse or touch,
  it squishes to 0.98.
- Scroll: the "how it works" line fills as you read it (goal gradient), plans settle in. CSS
  scroll-driven only, content never fully hidden.
- Wordmark cursor blinks 3 times on load then holds; hover wakes it. No infinite loops anywhere.
- Reduced motion: no travel, fades only; the chat is shown complete and doesn't play.
- Without JavaScript: every message, every sample site and every section is visible.

## Principles, and where they are applied

**Laws of UX**

| Law | Where |
| --- | --- |
| Jakob's law | The chat is styled like real WhatsApp; WhatsApp-green buttons with the real WhatsApp glyph |
| Fitts's law | 48–56px targets; on phones a full-width WhatsApp dock sits in the thumb zone |
| Hick's law | 3 nav links, 3 plans + 1 add-on, 5 business types, one action everywhere |
| Von Restorff | Green is used only for "message us"; Business plan is the one inverted card |
| Serial position | The free-demo action opens and closes the page |
| Peak–end | The chat ends on "Make it live 👍"; the page ends on one big CTA and the name |
| Goal gradient | Today → In 48 hours → Within a week, with a line that fills |
| Doherty threshold | ~41 KB font, no frameworks, no third-party requests; interactions answer in under 300ms |
| Tesler's law | "We handle the domain and hosting"; WhatsApp messages are pre-filled |
| Postel's law | Talk in Gujarati, Hindi or English; the whole site switches EN ⇄ ગુ |
| Cognitive load / chunking | Roughly 80 words per screen; FAQ collapsed; plan features in short lists |
| Proximity / common region | Price, who-it's-for and features grouped per plan; label + value in contact blocks |

**Refactoring UI**

- Hierarchy through weight and colour first, size second: labels small and grey, values large and ink.
- De-emphasise to emphasise: secondary text is `--ink-2`, never a second accent colour.
- A constrained system: 4px spacing scale, 5 type sizes, 3 radii, one shadow.
- Separate with tone and space, not borders.
- Accessible contrast on every pair (checked), no grey text on coloured backgrounds.
- Supercharged defaults: custom tick bullets, tabular numbers on prices, real empty-state-free content.

## Anti-slop audit of the previous site

The previous build came from a prompt that asked for most of the patterns current anti-slop
guides flag. What was there, what replaced it, and why:

| Before | After | Why |
| --- | --- | --- |
| Near-black `#0a0a0c` with a single acid-lime accent | White/stone ground, green-black ink, WhatsApp green for action | Black + one neon accent is the second most common generated look; this audience trusts plain, bright, WhatsApp-like UI |
| Clash Display + Satoshi + JetBrains Mono + Rubik, from 3 CDNs | One self-hosted family (Anek Gujarati) | Fontshare default pair reads as template; 4 families on 3 hosts is slow on Jio; Anek covers Gujarati natively |
| Fake macOS terminal with red/yellow/green dots and pixel "build" loop | WhatsApp conversation that shows the real process | Sells to developers, not shop owners; drawn OS windows are a listed tell |
| Rotating word in the headline + one word coloured lime | One sentence, one colour | Styled accent word and word rotators are top generated-headline tells |
| `⚡ AI Vibecoding Studio · 48hr Delivery` pill with pulsing dot | Removed | Eyebrow pill, middle-dot meta string, decorative status dot, jargon |
| Tracked ALL-CAPS tags above every heading | Plain headings that say the thing | Eyebrow labels are template chrome |
| Centred section headers, identical everywhere | Left-aligned, each section a different composition | Everything-centred + same block repeated is the SaaS kit |
| Bento grid of "Coming soon" demos with dead `#` links and grey-bar mockups | Business picker with full-fidelity sample sites and a working CTA | Placeholder dashboards and dead links erode trust |
| `01 > idea_batao` command cards with icon tiles | Time-based steps: Today / In 48 hours / Within a week | Numbering and icon-topped cards are defaults; time is the real sequence |
| Emoji as icons (🟢🔵🟣🟡 🛡️ 🙏 🚀) | One SVG glyph set; one 👍 inside the chat where it's content | Emoji-as-icon is a listed tell |
| Count-up stats: "100% Satisfaction", "5+ Projects", "48hr" | Removed | Invented or unverifiable metrics hurt trust more than they help |
| "Real reviews coming soon…" placeholder | Removed; contact details shown plainly | An empty testimonial slot advertises that there are none |
| `→` glued to every button | Removed | Arrow-suffix is template chrome |
| Film grain, drifting dot grid, pulsing glow blobs, bouncing scroll hint | Removed | Endless decorative loops, no purpose |
| Fade-up on every card via JS, content hidden until JS fires | Content visible by default; one orchestrated moment | Fade-up everywhere reads as generated and hid content in screenshots and slow loads |
| `POPULAR` badge + scaled card | "Our pick for most shops" on the one inverted card | Honest recommendation instead of an implied statistic |
| Filler copy ("One Perfect Solution", "Anything You Can Imagine", "AI-First Vibecoding Studio") | Plain, specific copy from the customer's side | Filler verbs and slogans with no content |
| Pulsing floating WhatsApp button + mobile bar + nav button | Nav button + a mobile dock that appears only between the big CTAs | Three competing CTAs at once; pulsing loop |
| `transition` defaults, `ease`, no `:active` states | Custom curves, exact properties, press feedback everywhere | Emil Kowalski's rules |
| Inline styles + `'unsafe-inline'` CSP, third-party font hosts | `style-src 'self'`, hashed inline script, `font-src 'self'` | Tighter security, fewer hosts |

## Rules for future changes

1. Every colour and font goes through a token. No new families.
2. No eyebrows, no tracked caps, no middle-dot strings, no arrows on link text, no emoji icons.
3. Never invent a number, testimonial or client logo. Add real ones when they exist.
4. Transform and opacity only; under 300ms for UI; `prefers-reduced-motion` for everything.
5. Content must be visible with JavaScript off.
6. Every new text needs a `data-gu` translation.
7. Run `npx playwright test`; section 8 of the suite lints these rules.

## Resources reviewed

From the lists the owner shared:

- **Used:** Emil Kowalski's `emil-design-eng` skill (motion rules, review format), Nutlope/hallmark
  (the Floor rules), Leonxlnx/taste-skill (house rules, "one live thing"), Vercel web interface
  guidelines (accessibility, focus, typography details), pbakaus/impeccable (anti-pattern list),
  Anthropic frontend-design skill, the Laith0003 anti-slop ban list.
- **Good for later, by hand:** 60fps.design, designspells.com, minimal.gallery, land-book,
  navbar.gallery, checklist.design, rebrand.gallery, ogpedia (OG images). Inspiration galleries
  couldn't be opened from the build sandbox.
- **Avoid for this site:** reactbits, Aceternity, fancycomponents, cursify (over-animated "AI
  default" look, as the owner's own note says); GSAP / Three.js / Lottie / Rive (too heavy for a
  one-page site on mobile data; CSS + Web Animations API cover everything here).
- **Fonts:** Fontshare, uncut.wtf and freefaces are good free sources, but almost none of them
  cover Gujarati. Anek (Ek Type) does, which is why it was chosen.
