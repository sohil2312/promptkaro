"""Generates the sample landing pages that PromptKaro shows as previews.

Each business gets its own layout, type and art direction, the way a real studio would design
it: a retail storefront, a clinic with a live OPD card, a coaching timetable, a restaurant menu,
a property launch with floor plans. All businesses, names and copy are fictional sample content.
Pages are screenshotted by shoot.js (full-length desktop, first screen desktop and mobile).
Run: python3 tools/samples/build.py
"""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
WA = ('<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12.04 2C6.58 2 2.13 6.45 2.13 '
      '11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm5.8 14.13c-.25.69-1.44 '
      '1.32-2 1.41-.51.08-1.16.11-1.87-.12-.43-.14-.98-.32-1.69-.62-2.98-1.29-4.93-4.29-5.08-4.49-.15-.2-1.21-1.61-1.21-3.07s.77-2.18 1.04-2.48c.27-.3.6-.37.8-.37h.57c.18.01.43-.07.67.51.25.6.84 '
      '2.06.92 2.21.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.17-.31.39-.45.52-.15.15-.3.31-.13.6.17.3.77 1.27 1.65 2.06 1.13 1.01 2.09 1.32 2.39 1.47.3.15.47.13.64-.08.18-.2.74-.86.94-1.16.2-.3.4-.25.67-.15.27.1 '
      '1.74.82 2.04.97.3.15.5.22.57.35.08.12.08.72-.17 1.41Z"/></svg>')


def font(name, file):
    return f"@font-face{{font-family:'{name}';src:url(fonts/{file}) format('woff2');font-weight:100 900;font-display:block}}"


RESET = """*{box-sizing:border-box;margin:0;padding:0}html{-webkit-font-smoothing:antialiased}
img{display:block;max-width:100%}a{color:inherit;text-decoration:none}ul,ol{list-style:none}
.wrap{max-width:1180px;margin:0 auto;padding:0 32px}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:48px;padding:0 22px;font-weight:600;font-size:15px;white-space:nowrap}
.wa{background:#008069;color:#fff}
@media (max-width:700px){.wrap{padding:0 18px}.hide-m{display:none!important}nav{gap:12px!important}nav .brand{white-space:nowrap;font-size:18px!important}nav .btn{font-size:14px!important;padding:0 12px!important}nav .btn svg{width:16px}.offer{font-size:12px!important}}
"""


def doc(title, fonts, css, body, body_class=''):
    return (f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
            f'<title>{title}</title><style>{fonts}{RESET}{css}</style></head><body class="{body_class}">{body}</body></html>')


# ---------------------------------------------------------------- Shreeji Mobile: a retail storefront
MOBILE_CSS = """
body{font-family:'Brico';color:#0E1630;background:#fff;font-size:16px;line-height:1.5}
.offer{background:#FFD233;color:#0E1630;font-size:14px;font-weight:600;text-align:center;padding:9px 16px}
nav{display:flex;align-items:center;gap:28px;height:72px}
.brand{font-weight:800;font-size:22px;letter-spacing:-.02em;display:flex;align-items:center;gap:8px}
.brand i{width:28px;height:28px;border-radius:8px;background:#1D3B8F;display:inline-block;box-shadow:inset -8px -8px 0 #FFD233}
.links{display:flex;gap:24px;margin-left:auto;color:#58607A;font-size:15px}
nav .btn{border-radius:12px;height:44px}
.hero{background:#0E1A3F;color:#fff;border-radius:28px;display:grid;grid-template-columns:1.1fr .9fr;overflow:hidden;position:relative}
.hero-copy{padding:56px 0 56px 56px}
.kicker{display:inline-block;font-size:13px;font-weight:700;letter-spacing:.02em;color:#FFD233}
h1{font-size:64px;line-height:1;letter-spacing:-.04em;font-weight:800;margin:14px 0 16px}
.hero p{color:#B8C2E0;font-size:18px;max-width:30ch}
.price{display:flex;align-items:baseline;gap:12px;margin-top:26px}
.price b{font-size:44px;letter-spacing:-.03em}
.price s{color:#8592B8}
.price span{background:#24C16B;color:#06210F;font-size:13px;font-weight:700;padding:4px 10px;border-radius:999px}
.swatches{display:flex;gap:10px;margin-top:18px;align-items:center;color:#B8C2E0;font-size:14px}
.swatches i{width:22px;height:22px;border-radius:50%;box-shadow:0 0 0 2px #0E1A3F,0 0 0 3px #5A6890}
.swatches i:nth-child(1){background:#1d4a4e;box-shadow:0 0 0 2px #0E1A3F,0 0 0 4px #FFD233}.swatches i:nth-child(2){background:#d8c3a2}.swatches i:nth-child(3){background:#3a3d42}
.hero .ctas{display:flex;gap:12px;margin-top:30px}
.hero .ghost{border-radius:12px;box-shadow:inset 0 0 0 1.5px #5A6890;color:#fff}
.hero .wa{border-radius:12px}
.hero-art{position:relative;background:radial-gradient(70% 60% at 55% 50%,#2C4796,#0E1A3F 72%)}
.hero-art .p1{position:absolute;width:108%;right:-14%;top:-4%;filter:drop-shadow(0 40px 40px rgba(0,0,0,.45))}
.hero-art .p2{position:absolute;width:44%;left:0;bottom:2%;filter:drop-shadow(0 20px 24px rgba(0,0,0,.4));transform:rotate(-8deg)}
.badge{position:absolute;right:24px;bottom:24px;background:#fff;color:#0E1630;border-radius:14px;padding:10px 14px;font-size:13px;line-height:1.3}
.badge b{display:block;font-size:15px}
.cats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin:28px 0 64px}
.cat{background:#F2F4FA;border-radius:20px;padding:18px 18px 0;display:flex;flex-direction:column;justify-content:space-between;height:190px;overflow:hidden}
.cat b{font-size:18px}.cat small{color:#58607A;display:block}
.cat img{width:62%;align-self:flex-end;margin-bottom:-14px}
h2{font-size:38px;letter-spacing:-.035em;line-height:1.05;font-weight:800}
.head{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:22px}
.head a{color:#1D3B8F;font-weight:700;font-size:15px}
.products{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-bottom:72px}
.prod{border:1px solid #E6E9F2;border-radius:20px;padding:16px;display:grid;grid-template-columns:120px 1fr;gap:16px;align-items:center}
.prod .ph{background:#F2F4FA;border-radius:14px;aspect-ratio:1;display:grid;place-items:center}
.prod .ph img{width:86%}
.prod b{display:block;font-size:16px}
.prod small{color:#58607A;font-size:13px}
.prod .row{display:flex;align-items:center;justify-content:space-between;margin-top:10px}
.prod .row strong{font-size:18px}
.prod .row span{font-size:12px;font-weight:700;color:#0B7A3B;background:#E3F6EA;border-radius:999px;padding:3px 8px}
.prod .row span.low{color:#9A3412;background:#FDECDF}
.perks{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border-radius:24px;background:#F2F4FA;margin-bottom:72px}
.perks div{padding:28px}
.perks div+div{box-shadow:inset 1px 0 0 #DDE2EF}
.perks b{display:block;font-size:20px;letter-spacing:-.02em;margin:6px 0 4px}
.perks small{font-size:13px;font-weight:700;color:#1D3B8F}
.perks p{color:#58607A;font-size:15px}
.visit{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:56px}
.visit .card{border-radius:24px;padding:32px;background:#0E1A3F;color:#fff}
.open{display:inline-flex;align-items:center;gap:8px;font-size:14px;font-weight:700;color:#7BE3A6}
.open i{width:8px;height:8px;border-radius:50%;background:#24C16B}
.visit h3{font-size:28px;letter-spacing:-.03em;margin:10px 0 18px}
.hours div{display:flex;justify-content:space-between;padding:10px 0;box-shadow:inset 0 -1px 0 rgba(255,255,255,.1);color:#B8C2E0}
.hours b{color:#fff;font-weight:600}
.visit .ask{background:#FFD233;color:#0E1630}
.visit .ask p{font-size:17px;margin-bottom:22px;max-width:34ch}
.visit .ask .wa{border-radius:12px}
footer{border-top:1px solid #E6E9F2;padding:22px 0 32px;color:#58607A;font-size:14px;display:flex;justify-content:space-between}
@media (max-width:700px){
 nav{height:60px}.links{display:none}nav .btn{margin-left:auto;height:40px;padding:0 14px}
 .hero{grid-template-columns:1fr;border-radius:22px}.hero-copy{padding:30px 22px 8px}
 h1{font-size:42px}.price b{font-size:34px}.hero-art{height:300px}.hero-art .p1{width:88%;right:-6%;top:-6%}.hero-art .p2{width:40%}
 .hero .ctas{flex-wrap:wrap}
 .cats{grid-template-columns:1fr 1fr;margin:18px 0 44px}.cat{height:150px}
 h2{font-size:30px}.products{grid-template-columns:1fr;margin-bottom:44px}.prod{grid-template-columns:96px 1fr}
 .perks{grid-template-columns:1fr;margin-bottom:44px}.perks div+div{box-shadow:inset 0 1px 0 #DDE2EF}
 .visit{grid-template-columns:1fr}.visit .card{padding:24px}
 footer{flex-direction:column;gap:4px}
}
"""
MOBILE_BODY = f"""
<div class="offer">Exchange offer: up to ₹3,000 off when you bring your old phone</div>
<div class="wrap">
<nav><span class="brand"><i></i>Shreeji Mobile</span><span class="links"><a>Phones</a><a>Watches</a><a>Audio</a><a>Visit us</a></span><a class="btn wa">{WA}Chat with us</a></nav>
<header class="hero">
 <div class="hero-copy"><span class="kicker">NEW THIS WEEK</span><h1>The 5G phone<br>everyone asks for.</h1>
 <p>128 GB, 50 MP camera, two-day battery. We set it up and move your data before you leave.</p>
 <div class="price"><b>₹13,999</b><s>₹15,499</s><span>In stock</span></div>
 <div class="swatches"><i></i><i></i><i></i><span>Teal, sand, graphite</span></div>
 <div class="ctas"><a class="btn wa">{WA}Keep one for me</a><a class="btn ghost">Compare phones</a></div></div>
 <div class="hero-art"><img class="p2" src="img/phone-sand.webp" alt=""><img class="p1" src="img/phone.webp" alt="">
 <div class="badge"><b>Free setup</b>Data moved in the shop</div></div>
</header>
<div class="cats">
 <div class="cat"><div><b>Phones</b><small>24 models</small></div><img src="img/phone-graphite.webp" alt=""></div>
 <div class="cat"><div><b>Smart watches</b><small>9 models</small></div><img src="img/watch.webp" alt=""></div>
 <div class="cat"><div><b>Earbuds</b><small>12 models</small></div><img src="img/earbuds.webp" alt=""></div>
 <div class="cat"><div><b>Chargers</b><small>Cables and adapters</small></div><img src="img/charger.webp" alt=""></div>
</div>
<div class="head"><h2>Popular this week</h2><a>See all 60 products</a></div>
<div class="products">
 <div class="prod"><div class="ph"><img src="img/phone.webp" alt=""></div><div><b>5G phone, 128 GB</b><small>Teal, 50 MP camera</small><div class="row"><strong>₹13,999</strong><span>In stock</span></div></div></div>
 <div class="prod"><div class="ph"><img src="img/phone-sand.webp" alt=""></div><div><b>5G phone, 256 GB</b><small>Sand, more storage</small><div class="row"><strong>₹16,499</strong><span class="low">2 left</span></div></div></div>
 <div class="prod"><div class="ph"><img src="img/watch.webp" alt=""></div><div><b>Smart watch</b><small>Calls, steps, sleep</small><div class="row"><strong>₹2,499</strong><span>In stock</span></div></div></div>
 <div class="prod"><div class="ph"><img src="img/earbuds.webp" alt=""></div><div><b>Wireless earbuds</b><small>30 hours with the case</small><div class="row"><strong>₹1,299</strong><span>In stock</span></div></div></div>
 <div class="prod"><div class="ph"><img src="img/phone-graphite.webp" alt=""></div><div><b>4G phone, 64 GB</b><small>Graphite, big battery</small><div class="row"><strong>₹9,499</strong><span>In stock</span></div></div></div>
 <div class="prod"><div class="ph"><img src="img/charger.webp" alt=""></div><div><b>Fast charger 33W</b><small>Cable included</small><div class="row"><strong>₹899</strong><span>In stock</span></div></div></div>
</div>
<div class="perks">
 <div><small>In the shop</small><b>Setup and data transfer</b><p>Contacts, photos and WhatsApp moved while you wait.</p></div>
 <div><small>Exchange</small><b>Bring your old phone</b><p>We check it in front of you and give a fair price.</p></div>
 <div><small>After you buy</small><b>We handle warranty</b><p>Drop it with us. We deal with the service centre.</p></div>
</div>
<div class="visit">
 <div class="card"><span class="open"><i></i>Open now, till 9 pm</span><h3>Station Road, next to the post office</h3>
 <div class="hours"><div><span>Monday to Saturday</span><b>10 am to 9 pm</b></div><div><span>Sunday</span><b>11 am to 7 pm</b></div><div><span>Payment</span><b>UPI, cards, cash</b></div></div></div>
 <div class="card ask"><span class="kicker" style="color:#1D3B8F">NOT SURE WHAT TO BUY?</span><h3>Tell us your budget.</h3><p>Send your budget and what matters to you. We reply with three phones that fit, with photos.</p><a class="btn wa">{WA}Message on WhatsApp</a></div>
</div>
<footer><span>© 2026 Shreeji Mobile</span><span>Phones, watches and accessories</span></footer>
</div>"""

# ---------------------------------------------------------------- Shanti Clinic: calm, with a live OPD card
CLINIC_CSS = """
body{font-family:'Fig';color:#0F2A2C;background:#F7FBFB;font-size:16px;line-height:1.55}
nav{display:flex;align-items:center;gap:28px;height:76px}
.brand{font-weight:700;font-size:21px;display:flex;align-items:center;gap:10px}
.brand i{width:30px;height:30px;border-radius:50%;background:#0F6B73;position:relative;display:inline-block}
.brand i:before,.brand i:after{content:'';position:absolute;background:#fff;border-radius:2px;left:50%;top:50%;transform:translate(-50%,-50%)}
.brand i:before{width:14px;height:4px}.brand i:after{width:4px;height:14px}
.links{display:flex;gap:26px;margin-left:auto;color:#4E6566;font-size:15px}
nav .btn{border-radius:999px;height:44px}
.hero{display:grid;grid-template-columns:1.15fr .85fr;gap:40px;align-items:start;padding:40px 0 64px}
.pill{display:inline-flex;align-items:center;gap:8px;background:#E2F2F3;color:#0F6B73;border-radius:999px;padding:6px 12px;font-size:14px;font-weight:600}
h1{font-size:60px;line-height:1.04;letter-spacing:-.03em;font-weight:700;margin:18px 0}
h1 span{color:#0F6B73}
.lead{font-size:19px;color:#4E6566;max-width:36ch}
.trust{display:flex;gap:28px;margin-top:34px;color:#4E6566;font-size:15px}
.scope{width:70%;margin:20px 0 0 -8px;filter:drop-shadow(0 18px 20px rgba(15,42,44,.15))}
.trust b{display:block;color:#0F2A2C;font-size:22px}
.opd{background:#fff;border-radius:24px;box-shadow:0 1px 2px rgba(15,42,44,.06),0 24px 48px -24px rgba(15,42,44,.18);padding:26px;position:relative;overflow:hidden}
.opd small{color:#4E6566;font-size:14px}
.opd h3{font-size:22px;margin:2px 0 18px;position:relative}
.live{display:inline-flex;align-items:center;gap:6px;color:#0B7A55;font-weight:700;font-size:13px}
.live i{width:8px;height:8px;border-radius:50%;background:#16A34A;box-shadow:0 0 0 4px #DCFCE7}
.slots{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:14px 0 18px}
.slots span{border-radius:12px;background:#EEF6F6;text-align:center;padding:10px 0;font-size:14px;font-weight:600;color:#4E6566}
.slots span.gone{text-decoration:line-through;opacity:.5}
.slots span.on{background:#0F6B73;color:#fff}
.meter{display:flex;justify-content:space-between;font-size:14px;color:#4E6566;margin-bottom:8px}
.bar{height:8px;border-radius:99px;background:#E2F2F3;overflow:hidden;margin-bottom:20px}.bar i{display:block;height:100%;width:46%;background:#0F6B73;border-radius:99px}
.opd .wa{border-radius:999px;width:100%}
h2{font-size:40px;letter-spacing:-.03em;line-height:1.08;margin-bottom:10px}
.sub{color:#4E6566;margin-bottom:28px;max-width:52ch}
.services{display:grid;grid-template-columns:1fr 1fr;gap:0 48px;margin-bottom:72px}
.svc{display:grid;grid-template-columns:1fr auto;gap:4px 16px;padding:20px 0;border-bottom:1px solid #DCEAEA}
.svc b{font-size:18px}.svc em{font-style:normal;font-weight:700;color:#0F6B73}
.svc span{color:#4E6566;font-size:15px}.svc small{color:#4E6566;font-size:14px;text-align:right}
.doc{display:grid;grid-template-columns:auto 1fr auto;gap:28px;align-items:center;background:#0F6B73;color:#E6F4F5;border-radius:28px;padding:36px;margin-bottom:72px}
.mono{width:110px;height:110px;border-radius:50%;background:#E6F4F5;color:#0F6B73;display:grid;place-items:center;font-size:38px;font-weight:700}
.doc h3{font-size:30px;color:#fff;letter-spacing:-.02em}
.doc p{max-width:52ch;margin-top:6px}
.doc ul{display:grid;gap:8px;font-size:15px}
.doc li b{color:#fff}
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-bottom:64px}
.step{background:#fff;border-radius:22px;padding:24px;border:1px solid #DCEAEA}
.step small{font-weight:700;color:#0F6B73}
.step b{display:block;font-size:19px;margin:6px 0 4px}
.step p{color:#4E6566;font-size:15px}
.bubble{margin-top:16px;background:#D9FDD3;border-radius:12px 12px 4px 12px;padding:10px 12px;font-size:14px;max-width:90%;margin-left:auto}
.bubble.in{background:#F0F2F5;border-radius:12px 12px 12px 4px;margin-left:0}
footer{padding:24px 0 36px;color:#4E6566;font-size:14px;display:flex;justify-content:space-between;border-top:1px solid #DCEAEA}
@media (max-width:700px){
 nav{height:62px}.links{display:none}nav .btn{margin-left:auto;height:40px;padding:0 14px}
 .hero{grid-template-columns:1fr;padding:16px 0 44px;gap:28px}h1{font-size:40px}.lead{font-size:17px}.trust{gap:18px;flex-wrap:wrap}
 h2{font-size:30px}.services{grid-template-columns:1fr;margin-bottom:44px}
 .doc{grid-template-columns:1fr;padding:24px;gap:16px;margin-bottom:44px}.mono{width:76px;height:76px;font-size:26px}
 .steps{grid-template-columns:1fr;margin-bottom:44px}footer{flex-direction:column;gap:4px}
}
"""
CLINIC_BODY = f"""<div class="wrap">
<nav><span class="brand"><i></i>Shanti Clinic</span><span class="links"><a>Timings</a><a>Services</a><a>Doctor</a><a>Visit</a></span><a class="btn wa">{WA}Book on WhatsApp</a></nav>
<header class="hero">
 <div><span class="pill">Family doctor, all ages</span><h1>See the doctor <span>without the wait.</span></h1>
 <p class="lead">Book a token on WhatsApp, get a message when your turn is near, and walk in on time.</p>
 <div class="trust"><div><b>15 years</b>of family practice</div><div><b>3 languages</b>Gujarati, Hindi, English</div><div><b>Reports</b>on your phone</div></div><img class="scope hide-m" src="img/stethoscope.webp" alt=""></div>
 <div class="opd"><span class="live"><i></i>Evening OPD is open</span><h3>Today, 5 pm to 8 pm</h3>
 <small>Pick a time</small>
 <div class="slots"><span class="gone">5:00</span><span class="gone">5:30</span><span>6:00</span><span class="on">6:30</span><span>7:00</span><span class="gone">7:15</span><span>7:30</span><span>7:45</span></div>
 <div class="meter"><span>Tokens booked</span><b>14 of 30</b></div><div class="bar"><i></i></div>
 <a class="btn wa">{WA}Book 6:30 pm on WhatsApp</a></div>
</header>
<h2>What we treat</h2><p class="sub">General medicine for children, adults and elders. Fees are per visit and include a follow-up within 5 days.</p>
<div class="services">
 <div class="svc"><b>General check-up</b><em>₹300</em><span>Fever, cough, body pain, infections</span><small>15 min</small></div>
 <div class="svc"><b>Child care</b><em>₹300</em><span>Fever, growth, vaccines on schedule</span><small>15 min</small></div>
 <div class="svc"><b>Diabetes and BP</b><em>₹250</em><span>Monthly follow-up with sugar test</span><small>10 min</small></div>
 <div class="svc"><b>Lab tests</b><em>from ₹150</em><span>Sample at the clinic, report on WhatsApp</span><small>Same day</small></div>
 <div class="svc"><b>Elder care</b><em>₹350</em><span>Joint pain, sleep, medicine review</span><small>20 min</small></div>
 <div class="svc"><b>Health certificate</b><em>₹200</em><span>For school, job or travel</span><small>10 min</small></div>
</div>
<div class="doc"><div class="mono">AM</div>
 <div><h3>Dr. A. Mehta, MBBS</h3><p>Takes time to explain what is wrong and what to do next, in the language you are comfortable with.</p></div>
 <ul><li><b>Morning</b> 10 am to 1 pm</li><li><b>Evening</b> 5 pm to 8 pm</li><li><b>Sunday</b> closed</li></ul></div>
<h2>How booking works</h2><p class="sub">No app to install. Everything happens on WhatsApp.</p>
<div class="steps">
 <div class="step"><small>Step 1</small><b>Send a message</b><p>Tell us who is unwell and when you can come.</p><div class="bubble">Evening slot for my son? Fever since morning.</div></div>
 <div class="step"><small>Step 2</small><b>Get your token</b><p>We reply with a time and token number.</p><div class="bubble in">Booked for 6:30 pm, token 14.</div></div>
 <div class="step"><small>Step 3</small><b>Come on time</b><p>We message you 30 minutes before your turn.</p><div class="bubble in">Your turn is in 30 minutes.</div></div>
</div>
<footer><span>© 2026 Shanti Clinic</span><span>General medicine and family care</span></footer>
</div>"""

# ---------------------------------------------------------------- Vidya Classes: timetable and results
COACH_CSS = """
body{font-family:'Lex';color:#2A1115;background:#FFFBF6;font-size:16px;line-height:1.55}
nav{display:flex;align-items:center;gap:28px;height:76px;border-bottom:1px solid #EFE1E3}
.brand{font-weight:600;font-size:21px;display:flex;align-items:center;gap:10px}
.brand i{width:30px;height:30px;border-radius:6px;background:#7A1F2B;color:#FFFBF6;font-style:normal;font-size:17px;display:grid;place-items:center}
.links{display:flex;gap:26px;margin-left:auto;color:#6B5357;font-size:15px}
nav .btn{border-radius:10px;height:44px}
.hero{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;padding:56px 0 64px}
.adm{display:inline-block;background:#7A1F2B;color:#fff;border-radius:6px;padding:5px 10px;font-size:13px;font-weight:600}
h1{font-size:58px;line-height:1.05;letter-spacing:-.035em;font-weight:600;margin:18px 0}
h1 u{text-decoration:none;background:linear-gradient(transparent 62%,#F6C9CF 62%)}
.lead{font-size:19px;color:#6B5357;max-width:34ch}
.ctas{display:flex;gap:12px;margin-top:28px}.ctas .btn{border-radius:10px}.ghost{box-shadow:inset 0 0 0 1.5px #2A1115}
.art{position:relative;background:#F8EAEC;border-radius:22px;aspect-ratio:1/.82;display:grid;place-items:center}
.art img{width:78%;filter:drop-shadow(0 28px 30px rgba(42,17,21,.2))}
.report{position:absolute;left:-28px;bottom:-24px;background:#fff;border-radius:16px;box-shadow:0 18px 40px -16px rgba(42,17,21,.3);padding:16px 18px;width:250px}
.report small{color:#6B5357;font-size:12px}
.report b{display:block;font-size:15px;margin-bottom:8px}
.report div{display:flex;justify-content:space-between;font-size:14px;padding:4px 0}
.report div span:last-child{font-weight:600}
.report .up{color:#15803D}
h2{font-size:38px;letter-spacing:-.03em;font-weight:600;line-height:1.1;margin-bottom:8px}
.sub{color:#6B5357;margin-bottom:24px}
.tt{width:100%;border-collapse:separate;border-spacing:0;background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 0 0 1px #EFE1E3;margin-bottom:72px;font-size:15px}
.tt th{background:#2A1115;color:#FFFBF6;font-weight:500;text-align:left;padding:14px 18px;font-size:14px}
.tt td{padding:14px 18px;border-top:1px solid #EFE1E3}
.tt td:first-child{font-weight:600}
.tag{display:inline-block;border-radius:6px;padding:3px 8px;font-size:13px;font-weight:600}
.t-s{background:#E6F0FF;color:#1D4ED8}.t-m{background:#FDECDF;color:#9A3412}.t-c{background:#E9F7EE;color:#15803D}.t-x{background:#F8EAEC;color:#7A1F2B}
.seat{font-size:13px;color:#6B5357}.seat.low{color:#B91C1C;font-weight:600}
.cols{display:grid;grid-template-columns:1.1fr .9fr;gap:24px;margin-bottom:72px}
.week{background:#2A1115;color:#F8EAEC;border-radius:22px;padding:30px}
.week h3{font-size:24px;color:#fff;margin-bottom:16px;font-weight:600}
.week li{display:grid;grid-template-columns:90px 1fr;gap:12px;padding:12px 0;border-top:1px solid rgba(255,255,255,.12)}
.week li b{color:#F6C9CF;font-weight:600}
.fees{background:#fff;border-radius:22px;padding:30px;box-shadow:0 0 0 1px #EFE1E3}
.fees h3{font-size:24px;margin-bottom:6px;font-weight:600}
.fees p{color:#6B5357;font-size:15px;margin-bottom:12px}
.fees div{display:flex;justify-content:space-between;padding:12px 0;border-top:1px solid #EFE1E3}
.fees div b{font-weight:600}
.band{display:flex;align-items:center;justify-content:space-between;gap:24px;background:#7A1F2B;color:#fff;border-radius:22px;padding:40px;margin-bottom:56px}
.band h2{color:#fff;margin:0;font-size:32px}
.band .wa{background:#fff;color:#7A1F2B;border-radius:10px}
footer{padding:22px 0 36px;color:#6B5357;font-size:14px;display:flex;justify-content:space-between;border-top:1px solid #EFE1E3}
@media (max-width:700px){
 nav{height:62px}.links{display:none}nav .btn{margin-left:auto;height:40px;padding:0 14px}
 .hero{grid-template-columns:1fr;padding:24px 0 64px;gap:28px}h1{font-size:40px}.lead{font-size:17px}.ctas{flex-wrap:wrap}
 .report{left:12px;bottom:-36px;width:220px}
 h2{font-size:28px}.tt{font-size:13px;margin-bottom:44px}.tt th,.tt td{padding:10px}.tt .hm{display:none}
 .cols{grid-template-columns:1fr;margin-bottom:44px}.band{flex-direction:column;align-items:flex-start;padding:26px}.band h2{font-size:26px}
 footer{flex-direction:column;gap:4px}
}
"""
COACH_BODY = f"""<div class="wrap">
<nav><span class="brand"><i>V</i>Vidya Classes</span><span class="links"><a>Batches</a><a>Timetable</a><a>Fees</a><a>Admission</a></span><a class="btn wa">{WA}Admissions</a></nav>
<header class="hero">
 <div><span class="adm">Admissions open for June</span><h1>Small batches.<br>Weekly tests.<br><u>Parents always know.</u></h1>
 <p class="lead">Std 8 to 12, Science and Commerce. Every Saturday's test result reaches parents on WhatsApp the same evening.</p>
 <div class="ctas"><a class="btn wa">{WA}Book a free demo class</a><a class="btn ghost">See timetable</a></div></div>
 <div class="art"><img src="img/books.webp" alt="">
 <div class="report"><small>Sent to parents, Saturday 7:10 pm</small><b>Weekly test: Riya, Std 10</b>
 <div><span>Science</span><span>42 / 50</span></div><div><span>Maths</span><span>38 / 50</span></div><div><span>Since last week</span><span class="up">+6 marks</span></div></div></div>
</header>
<h2>Timetable</h2><p class="sub">Up to 20 students per batch. Doubt hour every evening from 6 to 7.</p>
<table class="tt"><thead><tr><th>Batch</th><th>Subject</th><th>Days</th><th class="hm">Time</th><th>Seats</th></tr></thead><tbody>
<tr><td>Std 10 A</td><td><span class="tag t-s">Science</span></td><td>Mon, Wed, Fri</td><td class="hm">7:00 to 8:30 am</td><td><span class="seat low">3 left</span></td></tr>
<tr><td>Std 10 B</td><td><span class="tag t-m">Maths</span></td><td>Tue, Thu, Sat</td><td class="hm">4:00 to 5:30 pm</td><td><span class="seat">8 left</span></td></tr>
<tr><td>Std 11 Sci</td><td><span class="tag t-s">Physics, Chemistry</span></td><td>Mon to Fri</td><td class="hm">6:30 to 8:00 am</td><td><span class="seat">6 left</span></td></tr>
<tr><td>Std 12 Com</td><td><span class="tag t-c">Accounts, Economics</span></td><td>Mon to Sat</td><td class="hm">5:30 to 7:00 pm</td><td><span class="seat low">2 left</span></td></tr>
<tr><td>Std 8 to 9</td><td><span class="tag t-x">All subjects</span></td><td>Mon to Fri</td><td class="hm">3:00 to 4:30 pm</td><td><span class="seat">10 left</span></td></tr>
</tbody></table>
<div class="cols">
 <div class="week"><h3>A week at Vidya</h3><ul>
 <li><b>Mon to Fri</b><span>Concept class, then practice in class</span></li>
 <li><b>Every day</b><span>Doubt hour, 6 to 7 pm, one teacher per subject</span></li>
 <li><b>Saturday</b><span>Written test on the week's chapters</span></li>
 <li><b>Saturday night</b><span>Marks and a short note sent to parents</span></li></ul></div>
 <div class="fees"><h3>Fees per year</h3><p>Pay in three parts. Study material included.</p>
 <div><span>Std 8 to 9</span><b>₹10,000</b></div><div><span>Std 10</span><b>₹18,000</b></div><div><span>Std 11 to 12 Science</span><b>₹24,000</b></div><div><span>Std 11 to 12 Commerce</span><b>₹20,000</b></div></div>
</div>
<div class="band"><h2>Not sure which batch fits? Sit in a free class.</h2><a class="btn wa">{WA}Book a demo class</a></div>
<footer><span>© 2026 Vidya Classes</span><span>Coaching for Std 8 to 12</span></footer>
</div>"""

# ---------------------------------------------------------------- Annapurna Dining: an editorial menu
FOOD_CSS = """
body{font-family:'Fig';color:#FBF3E6;background:#1B1410;font-size:16px;line-height:1.55}
nav{display:flex;align-items:center;gap:28px;height:80px}
.brand{font-family:'Fraunces';font-size:26px;font-weight:500;letter-spacing:-.01em}
.links{display:flex;gap:28px;margin-left:auto;color:#CDBFA8;font-size:15px}
nav .btn{border-radius:999px;height:44px}
.hero{text-align:center;padding:40px 0 0;position:relative}
.small-caps{font-size:13px;letter-spacing:.08em;color:#F2B07E;font-weight:600}
h1{font-family:'Fraunces';font-weight:400;font-size:84px;line-height:.98;letter-spacing:-.035em;margin:16px auto 18px;max-width:12ch}
h1 em{color:#F2B07E}
.hero p{color:#CDBFA8;font-size:19px;max-width:44ch;margin:0 auto}
.hero .ctas{display:flex;gap:12px;justify-content:center;margin-top:26px}
.hero .ctas .btn{border-radius:999px}
.ghost{box-shadow:inset 0 0 0 1px #6B5A4C;color:#FBF3E6}
.plate{width:min(760px,100%);margin:28px auto -40px;filter:drop-shadow(0 50px 60px rgba(0,0,0,.6))}
.facts{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid #3A2E26;border-bottom:1px solid #3A2E26;margin:0 0 80px;position:relative;background:#1B1410}
.facts div{padding:22px 24px;text-align:center}.facts div+div{box-shadow:inset 1px 0 0 #3A2E26}
.facts b{display:block;font-family:'Fraunces';font-weight:500;font-size:22px}
.facts span{color:#CDBFA8;font-size:14px}
.menu-head{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:28px}
h2{font-family:'Fraunces';font-weight:400;font-size:52px;letter-spacing:-.03em;line-height:1}
.menu-head p{color:#CDBFA8;font-size:15px;text-align:right}
.menu{display:grid;grid-template-columns:1fr 1fr;gap:16px 64px;margin-bottom:80px}
.menu h3{font-size:13px;letter-spacing:.08em;color:#F2B07E;font-weight:600;margin:10px 0 6px;grid-column:span 1}
.dish{display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:baseline;padding:10px 0}
.dish b{font-family:'Fraunces';font-weight:500;font-size:21px}
.dish i{border-bottom:1px dotted #5A4A3E;transform:translateY(-5px)}
.dish strong{font-family:'Fraunces';font-weight:500;font-size:19px;color:#F2B07E}
.dish small{grid-column:1/-1;color:#CDBFA8;font-size:14px;margin-top:-6px}
.veg{display:inline-block;width:13px;height:13px;border:1.5px solid #3FAE5A;border-radius:2px;position:relative;margin-left:8px;vertical-align:1px}
.veg:after{content:'';position:absolute;inset:2.5px;border-radius:50%;background:#3FAE5A}
.special{display:grid;grid-template-columns:1fr 1fr;gap:0;background:#2A201A;border-radius:28px;overflow:hidden;margin-bottom:80px}
.special .txt{padding:44px}
.special h3{font-family:'Fraunces';font-weight:400;font-size:40px;letter-spacing:-.02em;line-height:1.05;margin:10px 0 12px}
.special p{color:#CDBFA8;max-width:36ch}
.special .ph{background:radial-gradient(70% 60% at 50% 50%,#4A3627,#2A201A 75%);display:grid;place-items:center}
.special .ph img{width:86%;transform:rotate(-14deg)}
.reserve{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;margin-bottom:64px}
.reserve p{color:#CDBFA8;margin-top:12px;max-width:40ch}
.form{background:#FBF3E6;color:#1B1410;border-radius:24px;padding:28px}
.form small{font-size:13px;font-weight:600;color:#6B5A4C}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0 18px}
.chips span{border-radius:999px;box-shadow:inset 0 0 0 1px #D9CBB5;padding:8px 14px;font-size:14px;font-weight:600}
.chips span.on{background:#1B1410;color:#FBF3E6;box-shadow:none}
.form .wa{width:100%;border-radius:999px}
footer{padding:24px 0 40px;color:#CDBFA8;font-size:14px;display:flex;justify-content:space-between;border-top:1px solid #3A2E26}
@media (max-width:700px){
 nav{height:64px}.links{display:none}nav .btn{margin-left:auto;height:40px;padding:0 14px}.brand{font-size:22px}
 .hero{padding-top:20px}h1{font-size:46px}.hero p{font-size:17px}.hero .ctas{flex-wrap:wrap}.plate{margin:20px auto -20px}
 .facts{grid-template-columns:1fr;margin-bottom:52px}.facts div+div{box-shadow:inset 0 1px 0 #3A2E26}
 .menu-head{display:block}.menu-head p{text-align:left;margin-top:8px}h2{font-size:38px}
 .menu{grid-template-columns:1fr;margin-bottom:52px}.dish b{font-size:19px}
 .special{grid-template-columns:1fr;margin-bottom:52px}.special .txt{padding:26px}.special h3{font-size:30px}.special .ph{height:220px}
 .reserve{grid-template-columns:1fr;gap:24px}footer{flex-direction:column;gap:4px}
}
"""
V = '<span class="veg"></span>'
FOOD_BODY = f"""<div class="wrap">
<nav><span class="brand">Annapurna</span><span class="links"><a>Menu</a><a>Today's special</a><a>Timings</a><a>Reserve</a></span><a class="btn wa">{WA}Reserve a table</a></nav>
<header class="hero"><span class="small-caps">PURE VEGETARIAN, SINCE 1998</span>
 <h1>A thali that tastes like <em>home</em>.</h1>
 <p>Gujarati, Kathiyawadi and Punjabi thalis, refilled until you are full. Lunch and dinner, every day.</p>
 <div class="ctas"><a class="btn wa">{WA}Reserve on WhatsApp</a><a class="btn ghost">Read the menu</a></div>
 <img class="plate" src="img/thali.webp" alt=""></header>
<div class="facts"><div><b>Unlimited refills</b><span>On every thali</span></div><div><b>11:30 to 3:30, 7 to 10:30</b><span>Lunch and dinner</span></div><div><b>Tables for 2 to 12</b><span>Family seating upstairs</span></div></div>
<div class="menu-head"><h2>The menu</h2><p>Prices include taxes.<br>Jain food on request.</p></div>
<div class="menu">
 <div><h3>THALIS</h3>
 <div class="dish"><b>Gujarati thali{V}</b><i></i><strong>₹180</strong><small>Dal, kadhi, three sabzi, rotli, rice, farsan, sweet</small></div>
 <div class="dish"><b>Kathiyawadi thali{V}</b><i></i><strong>₹220</strong><small>Sev tameta, ringan olo, bajra rotla, chaas</small></div>
 <div class="dish"><b>Punjabi thali{V}</b><i></i><strong>₹240</strong><small>Paneer butter masala, dal makhani, naan, jeera rice</small></div>
 <div class="dish"><b>Mini thali{V}</b><i></i><strong>₹140</strong><small>Dal, one sabzi, rotli, rice. For a light lunch</small></div></div>
 <div><h3>FARSAN AND SWEETS</h3>
 <div class="dish"><b>Khaman{V}</b><i></i><strong>₹60</strong><small>Soft, with green chutney</small></div>
 <div class="dish"><b>Patra{V}</b><i></i><strong>₹70</strong><small>Steamed, tempered with sesame</small></div>
 <div class="dish"><b>Shrikhand{V}</b><i></i><strong>₹80</strong><small>Kesar and elaichi</small></div>
 <div class="dish"><b>Masala chaas{V}</b><i></i><strong>₹30</strong><small>The way it is made at home</small></div></div>
</div>
<div class="special"><div class="txt"><span class="small-caps">TODAY'S SPECIAL</span><h3>Kadhi, khichdi and bajra rotla</h3><p>Only on Thursdays, until it runs out. Message us before noon and we keep a plate for you.</p></div><div class="ph"><img src="img/thali.webp" alt=""></div></div>
<div class="reserve"><div><h2>Coming with family?</h2><p>Pick a day, time and how many of you are coming. We confirm on WhatsApp within minutes.</p></div>
 <div class="form"><small>Day</small><div class="chips"><span>Today</span><span class="on">Saturday</span><span>Sunday</span></div>
 <small>Time</small><div class="chips"><span>12:30 pm</span><span>1:30 pm</span><span class="on">8:00 pm</span><span>9:00 pm</span></div>
 <small>Guests</small><div class="chips"><span>2</span><span>4</span><span class="on">6</span><span>8+</span></div>
 <a class="btn wa">{WA}Reserve for 6 on Saturday</a></div></div>
<footer><span>© 2026 Annapurna Dining</span><span>Pure vegetarian dining</span></footer>
</div>"""

# ---------------------------------------------------------------- Aangan Homes: a launch with floor plans
PROP_CSS = """
body{font-family:'Fig';color:#1D2410;background:#F5F4EE;font-size:16px;line-height:1.55}
nav{display:flex;align-items:center;gap:28px;height:76px}
.brand{font-family:'Syne';font-weight:700;font-size:21px;display:flex;align-items:center;gap:10px}
.brand i{width:26px;height:26px;background:#3F4A1E;clip-path:polygon(50% 0,100% 40%,100% 100%,0 100%,0 40%)}
.links{display:flex;gap:26px;margin-left:auto;color:#5E664D;font-size:15px}
nav .btn{border-radius:6px;height:44px}
.hero{display:grid;grid-template-columns:1fr 1fr;gap:0;background:#E7EAD8;border-radius:10px;overflow:hidden;min-height:520px}
.hero-copy{padding:56px 48px;display:flex;flex-direction:column}
.chip{align-self:flex-start;font-size:13px;font-weight:600;border:1px solid #3F4A1E;border-radius:4px;padding:4px 10px}
h1{font-family:'Syne';font-weight:700;font-size:56px;line-height:1.02;letter-spacing:-.04em;margin:20px 0 16px}
.hero p{color:#5E664D;font-size:18px;max-width:34ch}
.hero .ctas{display:flex;gap:12px;margin-top:auto;padding-top:28px}
.hero .btn{border-radius:6px}.ghost{box-shadow:inset 0 0 0 1.5px #1D2410}
.hero-art{background:linear-gradient(180deg,#CFE0EA 0%,#E9EFE2 70%);position:relative;display:grid;place-items:end center}
.hero-art img{width:88%;margin-bottom:-10px}
.price-tag{position:absolute;left:24px;top:24px;background:#1D2410;color:#F5F4EE;border-radius:6px;padding:12px 16px;font-size:13px;line-height:1.3}
.price-tag b{display:block;font-family:'Syne';font-size:22px}
.facts{display:grid;grid-template-columns:repeat(4,1fr);margin:18px 0 72px;background:#fff;border-radius:10px}
.facts div{padding:22px 24px}.facts div+div{box-shadow:inset 1px 0 0 #E2E3D6}
.facts small{color:#5E664D;font-size:13px}.facts b{display:block;font-family:'Syne';font-size:20px;margin-top:2px}
h2{font-family:'Syne';font-weight:700;font-size:40px;letter-spacing:-.04em;line-height:1.05;margin-bottom:8px}
.sub{color:#5E664D;margin-bottom:24px}
.tabs{display:flex;gap:8px;margin-bottom:18px}
.tabs span{border-radius:4px;padding:8px 14px;font-size:14px;font-weight:600;background:#E7EAD8}
.tabs span.on{background:#1D2410;color:#F5F4EE}
.plan-wrap{display:grid;grid-template-columns:1.3fr .7fr;gap:18px;margin-bottom:72px}
.plan{background:#fff;border-radius:10px;padding:28px}
.fp{display:grid;grid-template-columns:1.2fr 1fr 1fr;grid-template-rows:150px 120px 110px;gap:0;border:4px solid #1D2410;background:#FBFBF7}
.fp div{border:1.5px solid #1D2410;margin:-.75px;display:flex;flex-direction:column;justify-content:center;align-items:center;font-size:13px;color:#5E664D;text-align:center}
.fp div b{color:#1D2410;font-size:14px;font-weight:600}
.fp .living{grid-row:1/3;background:#F2F4EA}.fp .bal{background:#E9F1F6}.fp .kit{background:#FBF4E8}
.fp .b2{grid-column:2/4}
.plan-note{display:flex;justify-content:space-between;margin-top:14px;font-size:14px;color:#5E664D}
.units{display:grid;gap:10px;align-content:start}
.unit{background:#fff;border-radius:10px;padding:18px 20px;display:grid;grid-template-columns:1fr auto;gap:2px 12px}
.unit b{font-family:'Syne';font-size:18px}.unit strong{font-family:'Syne';font-size:18px}
.unit span{color:#5E664D;font-size:14px}.unit em{font-style:normal;font-size:13px;font-weight:600;color:#15803D;text-align:right}
.unit em.low{color:#B45309}
.unit.on{box-shadow:inset 0 0 0 2px #1D2410}
.amen{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border-top:1px solid #D6D8C8;margin-bottom:72px}
.amen div{padding:22px 20px 22px 0}
.amen b{display:block;font-family:'Syne';font-size:18px;margin-bottom:4px}
.amen span{color:#5E664D;font-size:15px}
.visit{display:grid;grid-template-columns:1fr auto;gap:24px;align-items:center;background:#3F4A1E;color:#F5F4EE;border-radius:10px;padding:40px;margin-bottom:56px}
.visit h2{color:#F5F4EE;margin-bottom:6px;font-size:34px}
.visit p{color:#D6DBC0}
.days{display:flex;gap:8px;margin-top:18px}
.days span{border-radius:6px;background:rgba(245,244,238,.12);padding:8px 12px;font-size:14px;text-align:center;line-height:1.2}
.days span.on{background:#F5F4EE;color:#1D2410}
.days b{display:block;font-size:17px}
.visit .wa{border-radius:6px}
footer{padding:22px 0 36px;color:#5E664D;font-size:14px;display:flex;justify-content:space-between;border-top:1px solid #D6D8C8}
@media (max-width:700px){
 nav{height:62px}.links{display:none}nav .btn{margin-left:auto;height:40px;padding:0 14px}
 .hero{grid-template-columns:1fr;min-height:0}.hero-copy{padding:28px 22px}h1{font-size:38px}.hero p{font-size:17px}.hero .ctas{flex-wrap:wrap}
 .hero-art{height:300px}
 .facts{grid-template-columns:1fr 1fr;margin-bottom:44px}.facts div:nth-child(3){box-shadow:inset 0 1px 0 #E2E3D6}.facts div:nth-child(4){box-shadow:inset 1px 1px 0 #E2E3D6}
 h2{font-size:30px}.plan-wrap{grid-template-columns:1fr;margin-bottom:44px}.plan{padding:16px}
 .fp{grid-template-rows:120px 100px 90px}.fp div{font-size:11px}.fp div b{font-size:12px}
 .amen{grid-template-columns:1fr 1fr;margin-bottom:44px}
 .visit{grid-template-columns:1fr;padding:26px}.visit h2{font-size:28px}.days{flex-wrap:wrap}
 footer{flex-direction:column;gap:4px}
}
"""
PROP_BODY = f"""<div class="wrap">
<nav><span class="brand"><i></i>Aangan Homes</span><span class="links"><a>Floor plans</a><a>Amenities</a><a>Location</a><a>Visit</a></span><a class="btn wa">{WA}Book a site visit</a></nav>
<header class="hero">
 <div class="hero-copy"><span class="chip">Possession from March</span><h1>2 and 3 BHK homes with room to breathe.</h1>
 <p>Seven floors, a garden on the ground and sunlight on every side. Walk through the site any day of the week.</p>
 <div class="ctas"><a class="btn wa">{WA}Book a site visit</a><a class="btn ghost">See floor plans</a></div></div>
 <div class="hero-art"><div class="price-tag">2 BHK from<b>₹28 lakh</b>All-inclusive</div><img src="img/building.webp" alt=""></div>
</header>
<div class="facts"><div><small>Homes</small><b>56 in 2 towers</b></div><div><small>Sizes</small><b>1,050 to 1,480 sq ft</b></div><div><small>Floors</small><b>Ground plus 7</b></div><div><small>Booked so far</small><b>38 of 56</b></div></div>
<h2>Floor plans</h2><p class="sub">Every home has cross ventilation and a balcony facing the garden.</p>
<div class="tabs"><span class="on">2 BHK, 1,050 sq ft</span><span>2 BHK, 1,120 sq ft</span><span>3 BHK, 1,480 sq ft</span></div>
<div class="plan-wrap">
 <div class="plan"><div class="fp">
 <div class="living"><b>Living and dining</b>14 × 18 ft</div><div><b>Bedroom 1</b>12 × 12 ft</div><div><b>Bath</b>5 × 8 ft</div>
 <div class="kit"><b>Kitchen</b>8 × 10 ft</div><div><b>Bath</b>5 × 8 ft</div>
 <div class="bal"><b>Balcony</b>Garden facing</div><div class="b2"><b>Bedroom 2</b>11 × 12 ft</div></div>
 <div class="plan-note"><span>Carpet area 760 sq ft</span><span>East facing</span></div></div>
 <div class="units">
 <div class="unit on"><b>2 BHK, east</b><strong>₹28 lakh</strong><span>1,050 sq ft, floors 1 to 7</span><em>9 left</em></div>
 <div class="unit"><b>2 BHK, garden view</b><strong>₹30 lakh</strong><span>1,120 sq ft, floors 1 to 4</span><em class="low">3 left</em></div>
 <div class="unit"><b>3 BHK, corner</b><strong>₹41 lakh</strong><span>1,480 sq ft, floors 3 to 7</span><em>6 left</em></div>
 <div class="unit"><b>Shop, ground floor</b><strong>₹22 lakh</strong><span>320 sq ft, road facing</span><em class="low">2 left</em></div></div>
</div>
<div class="amen"><div><b>Garden</b><span>Play area and walking track</span></div><div><b>Lift and backup</b><span>In both towers</span></div><div><b>Parking</b><span>One covered spot per home</span></div><div><b>Loan help</b><span>We work with major banks</span></div></div>
<div class="visit"><div><h2>See the site this week</h2><p>Pick a day. We meet you at the gate and show you a finished sample flat.</p>
 <div class="days"><span>Thu<b>14</b></span><span class="on">Fri<b>15</b></span><span>Sat<b>16</b></span><span>Sun<b>17</b></span></div></div>
 <a class="btn wa">{WA}Book Friday on WhatsApp</a></div>
<footer><span>© 2026 Aangan Homes</span><span>Residential homes and shops</span></footer>
</div>"""

# The "with motion" example: the property launch with an orchestrated entrance and scroll reveals.
MOTION_CSS = """
@keyframes up{from{opacity:0;transform:translateY(28px)}}
@keyframes rise{from{opacity:0;transform:translateY(60px) scale(.96)}}
@keyframes float{50%{transform:translateY(-10px)}}
@keyframes pop{from{opacity:0;transform:scale(.8)}}
.motion .chip,.motion h1,.motion .hero p,.motion .hero .ctas{animation:up .9s cubic-bezier(.23,1,.32,1) both}
.motion .chip{animation-delay:.1s}.motion h1{animation-delay:.25s}.motion .hero p{animation-delay:.45s}.motion .hero .ctas{animation-delay:.6s}
.motion .hero-art img{animation:rise 1.2s cubic-bezier(.23,1,.32,1) .2s both,float 4s ease-in-out 1.4s infinite}
.motion .price-tag{animation:pop .6s cubic-bezier(.34,1.56,.64,1) 1.1s both}
.motion .facts div{animation:up .8s cubic-bezier(.23,1,.32,1) both}
.motion .facts div:nth-child(1){animation-delay:1.2s}.motion .facts div:nth-child(2){animation-delay:1.3s}.motion .facts div:nth-child(3){animation-delay:1.4s}.motion .facts div:nth-child(4){animation-delay:1.5s}
.motion .rv{opacity:0;transform:translateY(36px);transition:opacity .7s cubic-bezier(.23,1,.32,1),transform .9s cubic-bezier(.23,1,.32,1)}
.motion .rv.in{opacity:1;transform:none}
"""
MOTION_JS = """<script>
(function(){var els=document.querySelectorAll('h2,.sub,.tabs,.plan,.unit,.amen div,.visit');
var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target);}});},{threshold:.15});
els.forEach(function(el,i){el.classList.add('rv');if(el.classList.contains('unit'))el.style.transitionDelay=(i%4)*90+'ms';io.observe(el);});})();
</script>"""

SITES = {
    'mobile': ('Shreeji Mobile', font('Brico', 'bricolage-grotesque.woff2'), MOBILE_CSS, MOBILE_BODY),
    'clinic': ('Shanti Clinic', font('Fig', 'figtree.woff2'), CLINIC_CSS, CLINIC_BODY),
    'coaching': ('Vidya Classes', font('Lex', 'lexend.woff2'), COACH_CSS, COACH_BODY),
    'food': ('Annapurna Dining', font('Fraunces', 'fraunces.woff2') + font('Fig', 'figtree.woff2'), FOOD_CSS, FOOD_BODY),
    'property': ('Aangan Homes', font('Syne', 'syne.woff2') + font('Fig', 'figtree.woff2'), PROP_CSS, PROP_BODY),
}

if __name__ == '__main__':
    for key, (title, fonts, css, body) in SITES.items():
        with open(os.path.join(HERE, f'{key}.html'), 'w') as f:
            f.write(doc(title, fonts, css, body))
    title, fonts, css, body = SITES['property']
    with open(os.path.join(HERE, 'property-motion.html'), 'w') as f:
        f.write(doc(title, fonts, css + MOTION_CSS, body + MOTION_JS, 'motion'))
    print('written:', ', '.join(list(SITES) + ['property-motion']))
