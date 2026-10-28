"""Generates the sample landing pages that PromptKaro shows as previews.

All businesses, names and copy are fictional sample content. Pages are screenshotted by
shoot.js into assets/img (desktop full-length, mobile, and device renders).
Run: python3 tools/samples/build.py
"""
import html
import os

HERE = os.path.dirname(os.path.abspath(__file__))
WA = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm5.8 14.13c-.25.69-1.44 1.32-2 1.41-.51.08-1.16.11-1.87-.12-.43-.14-.98-.32-1.69-.62-2.98-1.29-4.93-4.29-5.08-4.49-.15-.2-1.21-1.61-1.21-3.07s.77-2.18 1.04-2.48c.27-.3.6-.37.8-.37h.57c.18.01.43-.07.67.51.25.6.84 2.06.92 2.21.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.17-.31.39-.45.52-.15.15-.3.31-.13.6.17.3.77 1.27 1.65 2.06 1.13 1.01 2.09 1.32 2.39 1.47.3.15.47.13.64-.08.18-.2.74-.86.94-1.16.2-.3.4-.25.67-.15.27.1 1.74.82 2.04.97.3.15.5.22.57.35.08.12.08.72-.17 1.41Z"/></svg>'

BASE_CSS = """
*{box-sizing:border-box;margin:0;padding:0}
html{-webkit-font-smoothing:antialiased}
body{font-family:var(--body);color:var(--ink);background:var(--bg);line-height:1.55;font-size:17px}
img{display:block;max-width:100%}
a{color:inherit;text-decoration:none}
.wrap{max-width:1180px;margin:0 auto;padding:0 32px}
nav{display:flex;align-items:center;gap:28px;height:76px}
.brand{font-family:var(--display);font-weight:700;font-size:22px;letter-spacing:-.01em;display:flex;align-items:center;gap:10px}
.brand i{width:30px;height:30px;border-radius:var(--r-sm);background:var(--accent);display:inline-block}
.links{display:flex;gap:26px;margin-left:auto;font-size:15px;color:var(--muted)}
.btn{display:inline-flex;align-items:center;gap:8px;height:46px;padding:0 20px;border-radius:var(--r-btn);font-weight:600;font-size:15px;white-space:nowrap}
.btn-wa{background:#008069;color:#fff}
.btn-alt{box-shadow:inset 0 0 0 1.5px currentColor}
.hero{display:grid;grid-template-columns:1.05fr 1fr;gap:48px;align-items:center;padding:36px 0 72px}
.eyebrow-chip{display:inline-flex;gap:8px;align-items:center;padding:6px 12px;border-radius:999px;background:var(--soft);color:var(--accent-ink);font-size:14px;font-weight:600}
h1{font-family:var(--display);font-size:62px;line-height:1.02;letter-spacing:var(--track);margin:18px 0 18px;font-weight:var(--h-weight)}
.lead{font-size:20px;color:var(--muted);max-width:30ch}
.ctas{display:flex;gap:14px;margin-top:28px}
.hero-art{position:relative;border-radius:var(--r-lg);background:var(--panel);aspect-ratio:1/0.86;display:grid;place-items:center;overflow:hidden}
.hero-art img{width:84%;filter:drop-shadow(0 30px 40px rgba(0,0,0,.18))}
.tag{position:absolute;padding:10px 14px;border-radius:14px;background:#fff;box-shadow:0 10px 30px -12px rgba(0,0,0,.3);font-size:14px;line-height:1.3}
.tag b{display:block;font-size:16px}
.strip{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding:0 0 72px}
.strip div{padding:22px;border-radius:var(--r-md);background:var(--soft)}
.strip b{display:block;font-family:var(--display);font-size:19px;margin-bottom:4px}
.strip span{color:var(--muted);font-size:15px}
section h2{font-family:var(--display);font-size:40px;line-height:1.08;letter-spacing:var(--track);font-weight:var(--h-weight);margin-bottom:10px}
.sub{color:var(--muted);margin-bottom:28px}
.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;padding-bottom:80px}
.card{border-radius:var(--r-md);background:var(--card);padding:14px;box-shadow:var(--card-shadow)}
.card .ph{aspect-ratio:1;border-radius:calc(var(--r-md) - 6px);background:var(--panel);display:grid;place-items:center;margin-bottom:12px}
.card .ph img{width:78%}
.card b{display:block;font-weight:600}
.card .price{font-weight:700;margin-top:2px}
.card small{color:var(--muted)}
.card .mini{margin-top:10px;display:flex;justify-content:space-between;align-items:center}
.card .mini span{font-size:13px;color:#008069;font-weight:600}
.chips{display:flex;gap:10px;margin-bottom:22px}
.chips span{padding:8px 14px;border-radius:999px;background:var(--soft);font-size:14px;font-weight:600}
.chips span:first-child{background:var(--ink);color:var(--bg)}
.split{display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center;padding-bottom:80px}
.panel{border-radius:var(--r-lg);background:var(--panel);padding:36px}
.rows{display:grid;gap:0}
.rows div{display:flex;justify-content:space-between;padding:14px 0;border-bottom:1px solid var(--line)}
.rows div b{font-weight:600}
.band{border-radius:var(--r-lg);background:var(--accent);color:var(--on-accent);padding:44px;display:flex;align-items:center;justify-content:space-between;gap:24px;margin-bottom:56px}
.band h2{color:inherit;margin:0;font-size:36px}
.band .btn-wa{background:#fff;color:#0b5c4b}
footer{padding:28px 0 40px;color:var(--muted);font-size:14px;display:flex;justify-content:space-between;border-top:1px solid var(--line)}
.grid .card:nth-child(4n+2) .ph img{transform:scaleX(-1) rotate(-5deg) scale(.92)}
.grid .card:nth-child(4n+3) .ph img{transform:rotate(7deg) scale(1.06)}
.grid .card:nth-child(4n+4) .ph img{transform:scaleX(-1) rotate(4deg) scale(.86)}
.grid .card:nth-child(4n+2) .ph{filter:hue-rotate(-14deg) saturate(1.1)}
.grid .card:nth-child(4n+3) .ph{filter:hue-rotate(12deg)}
.grid .card:nth-child(4n+4) .ph{filter:saturate(.85) brightness(1.03)}
@media (max-width:700px){
  body{font-size:16px}
  .wrap{padding:0 18px}
  nav{height:64px}
  .links{display:none}
  nav .btn{margin-left:auto;height:40px;padding:0 14px}
  .hero{grid-template-columns:1fr;gap:24px;padding:12px 0 40px}
  h1{font-size:40px}
  .lead{font-size:17px}
  .ctas{flex-wrap:wrap}
  .strip{grid-template-columns:1fr;padding-bottom:44px}
  section h2{font-size:30px}
  .grid{grid-template-columns:repeat(2,1fr);gap:12px;padding-bottom:48px}
  .split{grid-template-columns:1fr;padding-bottom:48px}
  .panel{padding:22px}
  .band{flex-direction:column;align-items:flex-start;padding:28px}
  .band h2{font-size:28px}
  footer{flex-direction:column;gap:6px}
}
"""


def font_face(name, file):
    return f"@font-face{{font-family:'{name}';src:url(fonts/{file}) format('woff2');font-weight:100 900;font-display:block}}"


def page(cfg):
    e = html.escape
    theme = ':root{' + ';'.join(f'--{k}:{v}' for k, v in cfg['theme'].items()) + '}'
    fonts = '\n'.join(font_face(n, f) for n, f in cfg['fonts'])
    extra = cfg.get('css', '')
    links = ''.join(f'<a>{e(l)}</a>' for l in cfg['links'])
    tags = ''.join(f'<span class="tag" style="{t[2]}"><b>{e(t[0])}</b>{e(t[1])}</span>' for t in cfg.get('tags', []))
    strip = ''.join(f'<div><b>{e(a)}</b><span>{e(b)}</span></div>' for a, b in cfg['strip'])
    chips = ''.join(f'<span>{e(c)}</span>' for c in cfg.get('chips', []))
    cards = ''.join(
        f'<div class="card"><div class="ph"><img src="img/{img}.webp" alt=""></div><b>{e(n)}</b>'
        f'<small>{e(d)}</small><div class="mini"><span class="price">{e(p)}</span><span>{e(cfg.get("card_cta", "Order"))}</span></div></div>'
        for img, n, d, p in cfg['cards'])
    rows = ''.join(f'<div><span>{e(a)}</span><b>{e(b)}</b></div>' for a, b in cfg['rows'])
    return f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(cfg['name'])}</title><style>{fonts}{theme}{BASE_CSS}{extra}</style></head>
<body class="{cfg.get('body_class', '')}"><div class="wrap">
<nav><span class="brand"><i></i>{e(cfg['name'])}</span><span class="links">{links}</span><a class="btn btn-wa">{WA}{e(cfg['nav_cta'])}</a></nav>
<header class="hero"><div class="hero-copy"><span class="eyebrow-chip">{e(cfg['chip'])}</span><h1>{cfg['h1']}</h1><p class="lead">{e(cfg['lead'])}</p>
<div class="ctas"><a class="btn btn-wa">{WA}{e(cfg['cta'])}</a><a class="btn btn-alt">{e(cfg['cta2'])}</a></div></div>
<div class="hero-art"><img src="img/{cfg['hero_img']}.webp" alt="">{tags}</div></header>
<div class="strip">{strip}</div>
<section><h2>{e(cfg['grid_title'])}</h2><p class="sub">{e(cfg['grid_sub'])}</p><div class="chips">{chips}</div><div class="grid">{cards}</div></section>
<section class="split"><div><h2>{e(cfg['about_title'])}</h2><p class="sub" style="max-width:44ch">{e(cfg['about'])}</p></div>
<div class="panel"><div class="rows">{rows}</div></div></section>
<div class="band"><h2>{e(cfg['band'])}</h2><a class="btn btn-wa">{WA}{e(cfg['band_cta'])}</a></div>
<footer><span>© 2026 {e(cfg['name'])}</span><span>{e(cfg['footer'])}</span></footer>
</div></body></html>"""


SITES = {
    'mobile': dict(
        name='Shreeji Mobile', fonts=[('Brico', 'bricolage-grotesque.woff2')],
        theme={'display': "'Brico'", 'body': "'Brico'", 'ink': '#0E1630', 'muted': '#58607A', 'bg': '#F6F7FB', 'soft': '#E8ECF8',
               'panel': 'radial-gradient(80% 70% at 50% 40%, #FFFFFF, #DCE3F7)', 'card': '#FFFFFF', 'accent': '#1D3B8F', 'accent-ink': '#1D3B8F',
               'on-accent': '#FFFFFF', 'line': '#E2E6F0', 'r-sm': '8px', 'r-md': '18px', 'r-lg': '28px', 'r-btn': '12px', 'track': '-0.03em',
               'h-weight': '700', 'card-shadow': '0 1px 2px rgba(14,22,48,.06)'},
        links=['Phones', 'Watches', 'Audio', 'Visit us'], nav_cta='Chat with us', chip='New stock every week',
        h1='New phones.<br>Honest prices.', lead='Phones, watches and accessories, set up for you before you leave the shop.',
        cta='Order on WhatsApp', cta2='See all phones', hero_img='phone',
        tags=[('Free setup', 'We move your data', 'left:6%;top:12%'), ('In stock', '3 colours today', 'right:6%;bottom:12%')],
        strip=[('Data moved for you', 'Contacts, photos and WhatsApp, done in the shop.'), ('Exchange your old phone', 'Get a fair value on the spot.'),
               ('Warranty help', 'We handle the service centre for you.')],
        grid_title='Popular this week', grid_sub='Prices include GST. Order on WhatsApp and pick up the same day.',
        chips=['All', 'Phones', 'Watches', 'Audio', 'Chargers'],
        cards=[('phone', '5G phone, 128 GB', 'Teal, sand, graphite', '₹13,999'), ('watch', 'Smart watch', 'Fitness and calls', '₹2,499'),
               ('earbuds', 'Wireless earbuds', 'Up to 30 h battery', '₹1,299'), ('charger', 'Fast charger 33W', 'With cable', '₹899'),
               ('phone', '5G phone, 256 GB', 'Graphite', '₹16,499'), ('watch', 'Smart watch Pro', 'Bigger display', '₹3,299'),
               ('earbuds', 'Earbuds Lite', 'Everyday use', '₹899'), ('charger', 'Dual charger', 'Two ports', '₹1,199')],
        about_title='A shop that picks up the phone',
        about='Family-run since 2009. Come in to try a phone, or message us and we keep it ready for you.',
        rows=[('Monday to Saturday', '10 am to 9 pm'), ('Sunday', '11 am to 7 pm'), ('Address', 'Station Road'), ('Payment', 'UPI, cards, cash')],
        band='Tell us your budget. We will suggest the right phone.', band_cta='Message on WhatsApp', footer='Phones, watches and accessories',
    ),
    'clinic': dict(
        name='Shanti Clinic', fonts=[('Fig', 'figtree.woff2')],
        theme={'display': "'Fig'", 'body': "'Fig'", 'ink': '#0F2A2C', 'muted': '#4E6566', 'bg': '#FFFFFF', 'soft': '#E6F4F5',
               'panel': 'radial-gradient(90% 80% at 50% 40%, #FFFFFF, #D7EEF0)', 'card': '#F5FAFA', 'accent': '#0F6B73', 'accent-ink': '#0F6B73',
               'on-accent': '#FFFFFF', 'line': '#DCEAEA', 'r-sm': '50%', 'r-md': '16px', 'r-lg': '24px', 'r-btn': '999px', 'track': '-0.02em',
               'h-weight': '700', 'card-shadow': 'none'},
        links=['Timings', 'Services', 'Doctor', 'Visit'], nav_cta='Book on WhatsApp', chip='Family doctor',
        h1='Care for the whole family, close to home.', lead='Children and elders welcome. Book a time on WhatsApp and skip the waiting room.',
        cta='Book an appointment', cta2='See timings', hero_img='stethoscope',
        tags=[('Open today', '5 pm to 8 pm', 'left:7%;bottom:14%')],
        strip=[('Short waits', 'Book a slot and come at your time.'), ('Reminders on WhatsApp', 'We message you before your turn.'),
               ('Reports on your phone', 'Lab reports shared as PDF.')],
        grid_title='What we treat', grid_sub='General medicine for all ages.', chips=[],
        cards=[('stethoscope', 'General check-up', 'Adults and elders', '₹300'), ('stethoscope', 'Child care', 'Fever, cough, vaccines', '₹300'),
               ('stethoscope', 'Diabetes and BP', 'Regular follow-ups', '₹250'), ('stethoscope', 'Lab tests', 'Sample at the clinic', 'From ₹150')],
        card_cta='Book',
        about_title='Dr. A. Mehta, MBBS', about='Fifteen years of family practice. Takes time to explain, in Gujarati, Hindi or English.',
        rows=[('Morning OPD', '10 am to 1 pm'), ('Evening OPD', '5 pm to 8 pm'), ('Sunday', 'Closed'), ('Emergencies', 'Call before you come')],
        band='Need to see the doctor today?', band_cta='Book on WhatsApp', footer='General medicine and family care',
        css='.grid{grid-template-columns:repeat(4,1fr)}.card .ph img{width:70%}',
    ),
    'coaching': dict(
        name='Vidya Classes', fonts=[('Lex', 'lexend.woff2')],
        theme={'display': "'Lex'", 'body': "'Lex'", 'ink': '#2A1115', 'muted': '#6B5357', 'bg': '#FFFBF6', 'soft': '#F8EAEC',
               'panel': 'radial-gradient(90% 80% at 50% 40%, #FFFFFF, #F4DDE1)', 'card': '#FFFFFF', 'accent': '#7A1F2B', 'accent-ink': '#7A1F2B',
               'on-accent': '#FFFFFF', 'line': '#EFE1E3', 'r-sm': '6px', 'r-md': '14px', 'r-lg': '22px', 'r-btn': '10px', 'track': '-0.025em',
               'h-weight': '600', 'card-shadow': '0 1px 2px rgba(42,17,21,.06)'},
        links=['Batches', 'Fees', 'Our way', 'Admission'], nav_cta='Ask about admission', chip='Admissions open',
        h1='Small batches.<br>Weekly tests.<br>Real progress.', lead='Std 8 to 12, Science and Commerce. Parents get every test result on WhatsApp.',
        cta='Ask about admission', cta2='See batches', hero_img='books',
        tags=[('Next batch', 'Starts Monday, 7 am', 'right:6%;top:10%')],
        strip=[('Up to 20 students', 'Every student gets attention.'), ('Weekly tests', 'Marks shared with parents.'), ('Doubt hours', 'Every evening, 6 to 7.')],
        grid_title='Batches', grid_sub='Fees are per year and can be paid in three parts.', chips=['Std 8 to 10', 'Std 11 to 12', 'Science', 'Commerce'],
        cards=[('books', 'Std 10 Science', '7:00 am batch', '₹18,000'), ('books', 'Std 10 Maths', '4:00 pm batch', '₹12,000'),
               ('books', 'Std 12 Commerce', '5:30 pm batch', '₹20,000'), ('books', 'Std 12 Science', '6:30 am batch', '₹24,000')],
        card_cta='Enquire',
        about_title='Our way of teaching', about='Concepts first, then practice. Every chapter ends with a test, and every test ends with a talk.',
        rows=[('Batch size', 'Up to 20'), ('Tests', 'Every Saturday'), ('Study material', 'Included'), ('Demo class', 'Free, any day')],
        band='Not sure which batch? Try a free class.', band_cta='Book a demo class', footer='Coaching for Std 8 to 12',
    ),
    'food': dict(
        name='Annapurna Dining', fonts=[('Fraunces', 'fraunces.woff2'), ('Fig', 'figtree.woff2')],
        theme={'display': "'Fraunces'", 'body': "'Fig'", 'ink': '#FBF3E6', 'muted': '#CDBFA8', 'bg': '#1B1410', 'soft': '#2A201A',
               'panel': 'radial-gradient(80% 70% at 50% 45%, #3A2B21, #1B1410 75%)', 'card': '#241B16', 'accent': '#B23A12', 'accent-ink': '#F2B07E',
               'on-accent': '#FFF4E8', 'line': '#3A2E26', 'r-sm': '50%', 'r-md': '20px', 'r-lg': '32px', 'r-btn': '999px', 'track': '-0.02em',
               'h-weight': '500', 'card-shadow': 'none'},
        links=['Menu', 'The place', 'Timings', 'Reserve'], nav_cta='Reserve a table', chip='Pure vegetarian',
        h1='A thali that tastes like <em>home</em>.', lead='Gujarati, Kathiyawadi and Punjabi thalis, served fresh at lunch and dinner.',
        cta='Reserve a table', cta2='See the menu', hero_img='thali',
        tags=[('Today\'s special', 'Kadhi and khichdi', 'left:6%;top:10%;background:#2A201A;color:#FBF3E6')],
        strip=[('Unlimited thali', 'Refills until you are full.'), ('Family seating', 'Tables for 2 to 12.'), ('Order on WhatsApp', 'Pick up in 20 minutes.')],
        grid_title='The menu', grid_sub='Served 11:30 am to 3:30 pm and 7 pm to 10:30 pm.', chips=['Thalis', 'Snacks', 'Sweets', 'Drinks'],
        cards=[('thali', 'Gujarati thali', 'Dal, kadhi, 3 sabzi, rotis', '₹180'), ('thali', 'Kathiyawadi thali', 'Sev tameta, bajra rotla', '₹220'),
               ('thali', 'Punjabi thali', 'Paneer, dal makhani, naan', '₹240'), ('thali', 'Mini thali', 'For a light lunch', '₹140')],
        card_cta='Reserve',
        about_title='Cooked the way it is at home', about='No colours, no shortcuts. Ghee from a local dairy and vegetables bought every morning.',
        rows=[('Lunch', '11:30 am to 3:30 pm'), ('Dinner', '7 pm to 10:30 pm'), ('Seating', '80 guests'), ('Parking', 'Free, on site')],
        band='Coming with family this weekend?', band_cta='Reserve on WhatsApp', footer='Pure vegetarian dining',
        css="h1 em{font-style:italic;color:#F2B07E}.hero-art img{width:94%}.card{border:1px solid var(--line)}.chips span:first-child{background:#F2B07E;color:#1B1410}",
    ),
    'property': dict(
        name='Aangan Homes', fonts=[('Syne', 'syne.woff2'), ('Fig', 'figtree.woff2')],
        theme={'display': "'Syne'", 'body': "'Fig'", 'ink': '#1D2410', 'muted': '#5E664D', 'bg': '#F5F4EE', 'soft': '#E7EAD8',
               'panel': 'radial-gradient(90% 80% at 50% 40%, #FFFFFF, #DDE3C6)', 'card': '#FFFFFF', 'accent': '#3F4A1E', 'accent-ink': '#3F4A1E',
               'on-accent': '#F5F4EE', 'line': '#E2E3D6', 'r-sm': '4px', 'r-md': '6px', 'r-lg': '10px', 'r-btn': '6px', 'track': '-0.035em',
               'h-weight': '700', 'card-shadow': '0 1px 2px rgba(29,36,16,.06)'},
        links=['Homes', 'Amenities', 'Location', 'Visit'], nav_cta='Book a site visit', chip='Possession from March',
        h1='2 and 3 BHK homes with room to breathe.', lead='Seven floors, a garden on the ground, sunlight on every side. Book a visit on WhatsApp.',
        cta='Book a site visit', cta2='See floor plans', hero_img='building',
        tags=[('From ₹28 lakh', '2 BHK, 1,050 sq ft', 'right:5%;bottom:10%')],
        strip=[('Garden and play area', 'On the ground floor.'), ('Lift and power backup', 'For every tower.'), ('Loan help', 'We work with major banks.')],
        grid_title='Available homes', grid_sub='Prices are all-inclusive. Floor plans shared on WhatsApp.', chips=['All', '2 BHK', '3 BHK', 'Shops'],
        cards=[('building', '2 BHK, east facing', '1,050 sq ft, 3rd floor', '₹28 lakh'), ('building', '2 BHK, garden view', '1,120 sq ft, 1st floor', '₹30 lakh'),
               ('building', '3 BHK, corner', '1,480 sq ft, 5th floor', '₹41 lakh'), ('building', 'Shop, ground floor', '320 sq ft, road facing', '₹22 lakh')],
        card_cta='Plan',
        about_title='Built to last, priced to make sense', about='RCC frame, branded fittings and a clear title. Visit the site any day; we show you the work in progress.',
        rows=[('Possession', 'March'), ('Floors', 'Ground plus 7'), ('Parking', 'One per home'), ('Site visits', 'Every day, 9 am to 7 pm')],
        band='See the site this week.', band_cta='Book a visit on WhatsApp', footer='Residential homes and shops',
        css='.hero-art img{width:80%}.card .ph img{width:86%}',
    ),
}

MOTION_CSS = """
@keyframes up{from{opacity:0;transform:translateY(28px)}}
@keyframes rise{from{opacity:0;transform:translateY(60px) scale(.94)}}
@keyframes float{50%{transform:translateY(-12px)}}
@keyframes pop{from{opacity:0;transform:scale(.8)}}
.motion h1,.motion .lead,.motion .ctas,.motion .eyebrow-chip{animation:up .9s cubic-bezier(.23,1,.32,1) both}
.motion .eyebrow-chip{animation-delay:.1s}.motion h1{animation-delay:.25s}.motion .lead{animation-delay:.45s}.motion .ctas{animation-delay:.6s}
.motion .hero-art{animation:rise 1.2s cubic-bezier(.23,1,.32,1) .2s both}
.motion .hero-art img{animation:float 4s ease-in-out 1.4s infinite}
.motion .tag{animation:pop .6s cubic-bezier(.34,1.56,.64,1) 1.2s both}
.motion .strip div{animation:up .8s cubic-bezier(.23,1,.32,1) both}
.motion .strip div:nth-child(1){animation-delay:1.3s}.motion .strip div:nth-child(2){animation-delay:1.42s}.motion .strip div:nth-child(3){animation-delay:1.54s}
.motion .rv{opacity:0;transform:translateY(36px);transition:opacity .7s cubic-bezier(.23,1,.32,1),transform .9s cubic-bezier(.23,1,.32,1)}
.motion .rv.in{opacity:1;transform:none}
"""

# Scroll reveals for the motion sample: sections below the hero rise in as they enter.
MOTION_JS = """<script>
(function(){var els=document.querySelectorAll('section h2,section .sub,.chips,.card,.panel,.band');
var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target);}});},{threshold:.15});
els.forEach(function(el,i){el.classList.add('rv');if(el.classList.contains('card'))el.style.transitionDelay=(i%4)*90+'ms';io.observe(el);});})();
</script>"""

if __name__ == '__main__':
    for key, cfg in SITES.items():
        with open(os.path.join(HERE, f'{key}.html'), 'w') as f:
            f.write(page(cfg))
    # The "with motion" example: the property site with an orchestrated entrance
    motion = dict(SITES['property'])
    motion['css'] = motion.get('css', '') + MOTION_CSS
    motion['body_class'] = 'motion'
    with open(os.path.join(HERE, 'property-motion.html'), 'w') as f:
        f.write(page(motion).replace('</body>', MOTION_JS + '</body>'))
    print('written:', ', '.join(list(SITES) + ['property-motion']))
