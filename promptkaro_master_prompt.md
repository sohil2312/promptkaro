# PromptKaro Website — Master Build Prompt
# Paste everything below the --- line into Claude Code terminal

---

I need you to build, test, and iterate on a production-grade website for PromptKaro.in — a vibecoding agency from Idar, Gujarat serving Indian SMBs. This is NOT a generic agency template. The website itself must be the best thing we've ever built — it IS our portfolio.

## PHASE 1: SETUP & DEPENDENCIES

First, set up the project:

```
# Initialize project
cd promptkaro
npm init -y

# Install dev dependencies for testing & icon pack
npm install -D playwright @playwright/test
npx playwright install chromium

# Install Lucide icons (lightweight, modern icon pack — 1000+ icons)
# We'll use their CDN instead: https://unpkg.com/lucide@latest

# Install a local dev server
npm install -D live-server
```

Create this file structure:
```
promptkaro/
├── index.html
├── css/
│   ├── style.css
│   ├── animations.css
│   └── responsive.css
├── js/
│   ├── main.js
│   ├── animations.js
│   └── terminal-effect.js
├── tests/
│   └── website.spec.js
├── package.json
└── playwright.config.js
```

## PHASE 2: DESIGN DIRECTION

### Aesthetic: "Retro-Terminal meets Desi Bold"
NOT another dark glassmorphism site. NOT another gradient card layout. Instead:

- **Kinetic typography** — hero headline animates letter by letter, words rotate/swap
- **Bento grid layout** — asymmetric cards of different sizes, NOT uniform grids
- **Micro-interactions everywhere** — every hover, every scroll triggers a subtle response
- **Terminal aesthetic** — monospace elements, blinking cursors, command-line feel mixed with warm desi energy
- **Noise/grain texture overlay** — subtle film grain on dark backgrounds for depth (CSS only, no images)
- **Scroll-triggered reveals** — sections build themselves as user scrolls, not just fade-in

### Color Palette (from our finalized logo):
```css
:root {
  /* Core */
  --bg-primary: #0a0a0c;
  --bg-secondary: #111114;
  --bg-tertiary: #1a1a1f;
  --border: #1e1e24;
  --border-hover: #2a2a32;

  /* Brand */
  --lime: #c8ff00;
  --lime-dim: rgba(200, 255, 0, 0.15);
  --orange: #ff6b35;
  --orange-dim: rgba(255, 107, 53, 0.15);
  --hot-pink: #ff2d87;
  --saffron: #ff9933;

  /* Text */
  --text-primary: #e8e6e1;
  --text-secondary: #9d9a93;
  --text-muted: #5a5752;

  /* Functional */
  --success: #28c840;
  --whatsapp: #25d366;
}
```

### Typography:
- **Display/Hero:** "Clash Display" from Fontshare (free, variable, unique) — https://api.fontshare.com/v2/css?f[]=clash-display@200,300,400,500,600,700&display=swap
- **Body:** "Satoshi" from Fontshare — https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700&display=swap
- **Mono/Terminal:** "JetBrains Mono" — from Google Fonts
- NEVER use Inter, Roboto, Arial, Space Grotesk, Poppins, or any overused font

### Icons:
Use Lucide Icons via CDN (https://unpkg.com/lucide@latest/dist/umd/lucide.min.js). They're clean, consistent, and modern. Use them for:
- Navigation items
- Process steps (MessageSquare, Zap, Rocket)
- Feature bullets (Check, ArrowRight, ExternalLink)
- Social links (Instagram, Mail, Phone)
- Service cards (Globe, Smartphone, BarChart3, ShoppingBag)

Also use Tabler Icons CDN as secondary: https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css

## PHASE 3: SECTIONS TO BUILD

### 3.1 — NAVIGATION (Sticky, minimal)
- Left: Logo wordmark `›PromptKaro▌` with blinking cursor (CSS animation)
- Right: Only 2 items — "Kaam Dekho" (anchor to demos) + WhatsApp CTA button (green, with Lucide Phone icon)
- Nav becomes solid dark on scroll (add backdrop-blur)
- Mobile: Hamburger NOT needed — just logo + WhatsApp button
- Height: 60px max. Don't waste vertical space.

### 3.2 — HERO SECTION (The showstopper)
- **Kinetic headline**: "Aapka Idea" stays static. Below it, a word rotates through: "Website" → "App" → "Dashboard" → "Catalog" → "Tool" with a swapping animation (clip-path or transform). Then "48 Ghante Mein Ready." appears
- **Terminal demo**: Below the headline, show a fake terminal window (with red/yellow/green dots) where text types out:
  ```
  > promptkaro build --business "Honest Developers"
  ✓ Analyzing requirements...
  ✓ Generating design system...
  ✓ Building responsive layout...
  ✓ Adding WhatsApp integration...
  ✓ Website ready! 🚀
  ```
  Each line appears with a typing effect and green checkmarks (use Lucide Check icon)
- **CTA**: Big lime button "Free Demo Mangao →" (links to WhatsApp) + subtle secondary text "Koi charge nahi. Pehle dekho, phir decide karo."
- **Background**: Subtle animated dot grid (CSS radial-gradient dots that slowly drift) + a gradient glow behind the hero text (lime/orange, very soft)
- **Scroll indicator**: Small animated chevron at bottom "↓ Scroll karo"

### 3.3 — DEMO WALL — "Yeh Bana Sakte Hain" (Bento Grid)
- **Bento grid layout** — NOT a uniform 2x2. Use asymmetric sizes:
  - Large card (spans 2 cols): Property Dealer Site — with a mini mockup/wireframe inside using CSS shapes
  - Medium card: Coaching Class Site
  - Medium card: Mobile Shop Catalog
  - Small card: Doctor/Clinic Site
  - Small card: "Aur Bahut Kuch..." (And much more) with a "+" icon

- Each card has:
  - Relevant Lucide icon (Home, GraduationCap, Smartphone, Stethoscope, Plus)
  - Title in bold
  - 2-line description
  - "View Demo →" link (greyed out with "Coming Soon" badge for now)
  - On hover: card lifts, border glows in lime, icon animates (subtle rotate or scale)

- Cards have a subtle noise texture background, slightly different shade from the main bg

### 3.4 — PROCESS — "Teen Step. Bas."
- 3 horizontal cards on desktop, vertical on mobile
- Each card is a "terminal command" style:
  ```
  01 > idea_batao
  WhatsApp pe requirement batao.
  Hindi, Gujarati, English — jo comfortable ho.
  ```
  ```
  02 > demo_dekho
  48 ghante mein working demo.
  Free. Pasand nahi toh koi charge nahi.
  ```
  ```
  03 > live_karo
  1 week mein domain + hosting ke saath live.
  Sab hum handle karte hain.
  ```
- Icons: Lucide MessageSquare, Zap, Rocket
- Connected by animated dashed line (CSS border-dashed with animation)
- Trust badge below: "🛡️ Free demo pehle. Payment baad mein. Zero risk."

### 3.5 — PRICING — "Seedha Price. Koi Jhol Nahi."
- 4 cards, horizontal scroll on mobile with snap
- Each card:
  - Tier name + emoji
  - Large price (₹ symbol prominent)
  - 4-5 features with Lucide Check icons
  - WhatsApp CTA button
- "Business" tier highlighted with lime border + "POPULAR" badge + slight scale-up
- Cards:
  1. 🟢 Starter ₹4,999 → 1-page, WhatsApp, Maps, responsive
  2. 🔵 Business ₹9,999 → 3-5 pages, form, gallery, SEO, GMB setup
  3. 🟣 Pro ₹19,999 → Custom app, catalog, calculator, analytics
  4. 🟡 Monthly ₹1,999/mo → Updates, hosting, content, social graphics
- Below cards: "Custom project? WhatsApp pe baat karo →"

### 3.6 — TRUST — "Kaun Hai Hum?"
- Split layout: Left side text, right side a stylized card/badge
- Text: "Main ek banker hoon jo code karta hai. 8+ saal banking mein. Ab AI + coding se local businesses ko digital bana raha hoon. Sabarkantha se, aapke liye."
- Badge/card on right: Location tags as pills (Idar, Himatnagar, Sabarkantha, Gujarat) + stat counters
- Stats row with count-up animation on scroll:
  - "48hr" — Average Delivery
  - "5+" — Projects
  - "100%" — Satisfaction
- Testimonial placeholder: Styled card with "Jaldi hi yahan real reviews aayenge" + WhatsApp icon

### 3.7 — FLOATING WHATSAPP
- Fixed bottom-right on desktop (circular green button, 56px, with WhatsApp icon from Lucide)
- Fixed bottom bar on mobile (full width, green, "WhatsApp pe baat karo" + icon)
- Pre-filled message: "Hi PromptKaro, mujhe apne business ke liye website chahiye"
- Subtle pulse animation on load, then calm
- Use wa.me/91XXXXXXXXXX (placeholder)

### 3.8 — FOOTER
- Minimal dark section
- Logo `›PromptKaro▌`
- "Made with ❤️ aur AI in Idar, Gujarat"
- Links row: WhatsApp • Instagram • Email (use Lucide icons)
- "© 2026 PromptKaro"
- Tiny text: "Powered by caffeine, Claude, and desi jugaad"

## PHASE 4: TECHNICAL REQUIREMENTS

- **Performance**: Total HTML+CSS+JS under 150KB (excluding fonts/icons CDN). No images.
- **Responsive**: Mobile-first. Test at 375px (phone), 768px (tablet), 1440px (desktop)
- **Animations**: All CSS-only. Use @keyframes, transitions, and Intersection Observer for scroll triggers. NO external animation libraries.
- **Smooth scroll**: CSS scroll-behavior: smooth + JS for nav anchors
- **CSS Architecture**: Separate files — style.css (layout + components), animations.css (all @keyframes + transitions), responsive.css (all media queries)
- **JS Architecture**: main.js (nav, smooth scroll, intersection observer), animations.js (scroll-triggered animations, count-up), terminal-effect.js (typing effect for hero)
- **Accessibility**: Semantic HTML, aria-labels on buttons, focus states on all interactive elements, prefers-reduced-motion media query to disable animations
- **SEO basics**: Proper meta title, description, OG tags for WhatsApp/social sharing
- **Noise/grain texture**: Use CSS pseudo-element with background-image: url("data:image/svg+xml,...") for film grain overlay — no external files
- **Custom cursor**: On desktop, change cursor to a small lime dot on hover over interactive elements (CSS only)

## PHASE 5: PLAYWRIGHT TESTING

Create comprehensive tests in tests/website.spec.js:

```javascript
// Test categories:
// 1. Visual & Layout
//    - Page loads without errors
//    - All sections visible on scroll
//    - Responsive layout at 375px, 768px, 1440px
//    - No horizontal overflow at any breakpoint
//    - Navigation is sticky and visible
//
// 2. Interactive Elements
//    - WhatsApp buttons have correct href (wa.me link)
//    - All nav anchor links scroll to correct sections
//    - Hover states work on cards
//    - Terminal typing animation runs
//
// 3. Performance
//    - Page loads in under 3 seconds
//    - No console errors
//    - All fonts load
//    - All icons render
//
// 4. Accessibility
//    - All images have alt text
//    - All buttons have accessible names
//    - Color contrast meets WCAG AA
//    - Focus states visible on tab navigation
//
// 5. Content
//    - Hindi text renders correctly
//    - All pricing visible and correct
//    - Phone number placeholder present
//    - Footer copyright year is 2026
```

Configure playwright.config.js for Chromium desktop + mobile viewport testing.

## PHASE 6: BUILD-TEST-IMPROVE LOOP

After building the complete site:

1. Run: `npx playwright test`
2. Fix ALL failing tests
3. Open in browser, visually check each section
4. Check mobile layout (375px viewport)
5. Verify all animations are smooth (no jank)
6. Check that the terminal typing effect works
7. Verify WhatsApp links work
8. Run Lighthouse audit mentally (check font loading, no layout shift)
9. Fix any issues found
10. Run tests again until ALL pass

Keep iterating until the site is flawless. Do not stop at "good enough."

## IMPORTANT REMINDERS:
- This must NOT look like a WordPress theme or a generic Tailwind template
- Every micro-interaction should feel deliberate and polished
- Hindi text should feel natural and conversational, not translated
- The terminal/coder aesthetic must be balanced with warmth — we're selling to shop owners, not developers
- Speed is critical — this must feel instant on a Jio connection
- The bento grid demo wall is the most important visual section — make it beautiful
- WhatsApp is the ONLY conversion mechanism. No contact forms. No email signups.

Now build it. Start with the HTML structure, then CSS (all 3 files), then JS (all 3 files), then tests. After building, run the tests and fix issues until everything passes.
ADDENDUM: LOGO & ICON ASSETS
The file assets/promptkaro_logo_assets.html in this project folder contains all finalized logo and icon assets. Before building the site, read that file and extract the following:
LOGO WORDMARK (Use in Navbar + Footer)
The primary logo is a terminal-style wordmark with these exact specifications:

Font: Rubik, weight 800
Structure: ›PromptKaro▌ where:

› = chevron character, color var(--lime) i.e. #c8ff00
Prompt = white (#fff on dark, #1a1a1a on light)
Karo = lime (#c8ff00 on dark, #ff6b35 on light)
▌ = blinking cursor block, 3px wide, color #c8ff00, with CSS animation:



css    @keyframes blink { 0%,50%{opacity:1} 51%,100%{opacity:0} }

The cursor MUST blink — this is the signature element of the logo

DARK BACKGROUND VERSION (Primary — for navbar, hero, footer):
html<div class="logo">
  <span class="logo-chevron">›</span><span class="logo-prompt">Prompt</span><span class="logo-karo">Karo</span><span class="logo-cursor"></span>
</div>
css.logo {
  font-family: 'Rubik', sans-serif;
  font-weight: 800;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
}
.logo-chevron { color: #c8ff00; margin-right: 2px; }
.logo-prompt { color: #fff; }
.logo-karo { color: #c8ff00; }
.logo-cursor {
  display: inline-block;
  width: 3px;
  height: 1.5rem;
  background: #c8ff00;
  margin-left: 3px;
  animation: blink 1.1s infinite;
}
LIGHT BACKGROUND VERSION (If ever needed):

Chevron: #ff6b35
Prompt: #1a1a1a
Karo: #ff6b35
Cursor: #ff6b35

ON SAFFRON/GRADIENT BACKGROUND:

Everything white (#fff), cursor white

FAVICON
Use a simple inline SVG favicon — a lime cursor block on dark:
html<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%23111114'/><rect x='12' y='6' width='8' height='20' rx='2' fill='%23c8ff00'/></svg>">
WHATSAPP BUSINESS PROFILE ICON
The app icon style is: dark background (#111114), lime cursor block centered. This is already in the assets file for screenshotting — but for the meta/OG image, generate a simple 512x512 version using the same SVG approach.
OG IMAGE (for WhatsApp/social sharing previews)
Create an og-image using an inline SVG or CSS-rendered element:

1200x630px
Dark background (#0a0a0c)
Logo wordmark centered: ›PromptKaro▌
Subtitle below: "AI-Powered Websites for Indian Businesses"
Save as og-image.html and take a screenshot, or render via meta tag

WHERE TO USE WHAT:
LocationVersionSizeNavbar (desktop)Dark wordmark, medium (1.8rem)With blinking cursorNavbar (mobile)Dark wordmark, small (1.3rem)With blinking cursorHero sectionDo NOT repeat logo here — hero has its own headlineFooterDark wordmark, small (1.2rem)With blinking cursorFaviconLime cursor block SVG32x32OG/meta imageFull wordmark on dark bg1200x630WhatsApp link previewSame as OG imageAuto-cropped
ASSET FILE LOCATION:
Copy the logo asset file into the project:
promptkaro/
├── assets/
│   └── promptkaro_logo_assets.html   ← logo reference file
├── index.html
├── css/
├── js/
└── tests/
CRITICAL RULES:

Do NOT use any image files for the logo — it's pure HTML+CSS
The cursor MUST blink on the live site — it's the brand signature
The chevron › is character U+203A (single right-pointing angle quotation mark), NOT a regular >
Font must be Rubik weight 800 — loaded from Google Fonts alongside the other project fonts
Logo colors must use the CSS variables defined in the master prompt
The logo must be a clickable link back to top of page (scroll to hero)
Extract the exact styles from promptkaro_logo_assets.html — do not redesign or modify the logo