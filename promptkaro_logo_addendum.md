# PromptKaro — Logo & Icon Assets Addendum
# Paste this AFTER the master prompt in Claude Code terminal
# This adds logo instructions without changing a single word of the master prompt

---

## ADDENDUM: LOGO & ICON ASSETS

The file `assets/promptkaro_logo_assets.html` in this project folder contains all finalized logo and icon assets. Before building the site, read that file and extract the following:

### LOGO WORDMARK (Use in Navbar + Footer)

The primary logo is a terminal-style wordmark with these exact specifications:
- Font: Rubik, weight 800
- Structure: `›PromptKaro▌` where:
  - `›` = chevron character, color var(--lime) i.e. #c8ff00
  - `Prompt` = white (#fff on dark, #1a1a1a on light)
  - `Karo` = lime (#c8ff00 on dark, #ff6b35 on light)
  - `▌` = blinking cursor block, 3px wide, color #c8ff00, with CSS animation:
    ```css
    @keyframes blink { 0%,50%{opacity:1} 51%,100%{opacity:0} }
    ```
- The cursor MUST blink — this is the signature element of the logo

### DARK BACKGROUND VERSION (Primary — for navbar, hero, footer):
```html
<div class="logo">
  <span class="logo-chevron">›</span><span class="logo-prompt">Prompt</span><span class="logo-karo">Karo</span><span class="logo-cursor"></span>
</div>
```
```css
.logo {
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
```

### LIGHT BACKGROUND VERSION (If ever needed):
- Chevron: #ff6b35
- Prompt: #1a1a1a
- Karo: #ff6b35
- Cursor: #ff6b35

### ON SAFFRON/GRADIENT BACKGROUND:
- Everything white (#fff), cursor white

### FAVICON
Use a simple inline SVG favicon — a lime cursor block on dark:
```html
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%23111114'/><rect x='12' y='6' width='8' height='20' rx='2' fill='%23c8ff00'/></svg>">
```

### WHATSAPP BUSINESS PROFILE ICON
The app icon style is: dark background (#111114), lime cursor block centered. This is already in the assets file for screenshotting — but for the meta/OG image, generate a simple 512x512 version using the same SVG approach.

### OG IMAGE (for WhatsApp/social sharing previews)
Create an og-image using an inline SVG or CSS-rendered element:
- 1200x630px
- Dark background (#0a0a0c)
- Logo wordmark centered: ›PromptKaro▌
- Subtitle below: "AI-Powered Websites for Indian Businesses"
- Save as og-image.html and take a screenshot, or render via meta tag

### WHERE TO USE WHAT:
| Location | Version | Size |
|---|---|---|
| Navbar (desktop) | Dark wordmark, medium (1.8rem) | With blinking cursor |
| Navbar (mobile) | Dark wordmark, small (1.3rem) | With blinking cursor |
| Hero section | Do NOT repeat logo here — hero has its own headline |
| Footer | Dark wordmark, small (1.2rem) | With blinking cursor |
| Favicon | Lime cursor block SVG | 32x32 |
| OG/meta image | Full wordmark on dark bg | 1200x630 |
| WhatsApp link preview | Same as OG image | Auto-cropped |

### ASSET FILE LOCATION:
Copy the logo asset file into the project:
```
promptkaro/
├── assets/
│   └── promptkaro_logo_assets.html   ← logo reference file
├── index.html
├── css/
├── js/
└── tests/
```

### CRITICAL RULES:
1. Do NOT use any image files for the logo — it's pure HTML+CSS
2. The cursor MUST blink on the live site — it's the brand signature
3. The chevron `›` is character U+203A (single right-pointing angle quotation mark), NOT a regular `>`
4. Font must be Rubik weight 800 — loaded from Google Fonts alongside the other project fonts
5. Logo colors must use the CSS variables defined in the master prompt
6. The logo must be a clickable link back to top of page (scroll to hero)
7. Extract the exact styles from promptkaro_logo_assets.html — do not redesign or modify the logo
