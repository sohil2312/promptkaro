"""Six more sample sites: interior and architecture studio, boutique, wedding planner,
handicrafts, furniture, manufacturer. Same rules as build.py: each has its own layout, type and
art direction, all businesses are fictional, and every picture is a render made in
tools/render/blender (Cycles, from open-licensed models or modelled in Blender), never a drawing.
"""
from build import WA, font, doc


def font_i(name, file):
    return f"@font-face{{font-family:'{name}';src:url(fonts/{file}) format('woff2');font-weight:100 900;font-style:italic;font-display:block}}"


# ---------------------------------------------------------------- Studio Aakar: interiors and architecture
INTERIOR_CSS = """
body{font-family:'Manrope';color:#22201C;background:#F6F3EE;font-size:16px;line-height:1.6}
nav{display:flex;align-items:center;gap:32px;height:84px}
.brand{font-family:'Instrument';font-size:28px;letter-spacing:-.01em}
.brand em{font-style:italic;color:#8A6B4E}
.links{display:flex;gap:30px;margin-left:auto;font-size:14px;letter-spacing:.02em;color:#5D574E}
nav .btn{border-radius:0;height:44px;background:#22201C;color:#F6F3EE}
.hero h1{font-family:'Instrument';font-weight:400;font-size:96px;line-height:.95;letter-spacing:-.03em;max-width:11ch;margin:40px 0 0}
.hero h1 em{font-style:italic;color:#8A6B4E}
.hero-row{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;margin-bottom:28px}
.hero-row p{max-width:34ch;color:#5D574E;font-size:17px}
.hero-img{position:relative}
.hero-img img{width:100%;aspect-ratio:16/9;object-fit:cover}
.hero-img figcaption{position:absolute;left:20px;bottom:20px;background:rgba(246,243,238,.92);padding:12px 16px;font-size:13px;line-height:1.4}
.hero-img figcaption b{display:block;font-size:14px}
.services{display:grid;grid-template-columns:repeat(3,1fr);gap:40px;padding:80px 0;border-bottom:1px solid #DDD5C9}
.services small{font-size:12px;letter-spacing:.12em;color:#8A6B4E}
.services h3{font-family:'Instrument';font-weight:400;font-size:32px;margin:8px 0 10px;letter-spacing:-.01em}
.services p{color:#5D574E;font-size:15px}
h2{font-family:'Instrument';font-weight:400;font-size:60px;letter-spacing:-.02em;line-height:1;margin:80px 0 32px}
h2 em{font-style:italic;color:#8A6B4E}
.projects{display:grid;grid-template-columns:1.25fr 1fr;grid-template-rows:auto auto;gap:24px;margin-bottom:80px}
.projects figure img{width:100%;object-fit:cover}
.p1{grid-row:span 2}.p1 img{height:100%;aspect-ratio:auto;min-height:620px}
.p2 img{aspect-ratio:16/10}.p3 img{aspect-ratio:16/10}
.projects figcaption{display:flex;justify-content:space-between;font-size:14px;margin-top:10px;color:#5D574E}
.projects figcaption b{color:#22201C;font-weight:600}
.process{display:grid;grid-template-columns:repeat(4,1fr);gap:0;margin-bottom:80px;border-top:1px solid #22201C}
.process div{padding:22px 22px 0 0}
.process b{font-family:'Instrument';font-weight:400;font-size:26px;display:block;margin-bottom:6px}
.process span{color:#5D574E;font-size:15px}
.consult{display:grid;grid-template-columns:1fr 1fr;background:#22201C;color:#F6F3EE;margin-bottom:56px}
.consult .txt{padding:56px}
.consult h3{font-family:'Instrument';font-weight:400;font-size:48px;line-height:1;margin-bottom:16px}
.consult p{color:#C9C0B3;margin-bottom:28px;max-width:38ch}
.consult .wa{border-radius:0}
.consult img{width:100%;height:100%;object-fit:cover}
footer{display:flex;justify-content:space-between;padding:0 0 40px;font-size:13px;color:#5D574E}
@media (max-width:700px){
 nav{height:64px}.links{display:none}nav .btn{margin-left:auto}.brand{font-size:22px!important}
 .hero h1{font-size:52px;margin-top:16px}.hero-row{flex-direction:column;align-items:flex-start;gap:14px}
 .services{grid-template-columns:1fr;gap:28px;padding:48px 0}
 h2{font-size:40px;margin:52px 0 22px}.projects{grid-template-columns:1fr}.p1{grid-row:auto}.p1 img{min-height:0;aspect-ratio:4/5}
 .process{grid-template-columns:1fr 1fr;row-gap:20px}.consult{grid-template-columns:1fr}.consult .txt{padding:28px}.consult h3{font-size:36px}
 footer{flex-direction:column;gap:4px}
}
"""
INTERIOR_BODY = f"""<div class="wrap">
<nav><span class="brand">Studio <em>Aakar</em></span><span class="links"><a>Projects</a><a>Interiors</a><a>Architecture</a><a>Studio</a></span><a class="btn">{WA}Book a consultation</a></nav>
<header class="hero"><h1>Homes that feel <em>like you.</em></h1>
<div class="hero-row"><p>Interiors and architecture for homes, clinics and shops. We draw it, show it to you in 3D, and build it.</p><p style="text-align:right">Interiors · Architecture · Turnkey</p></div></header>
<figure class="hero-img"><img src="img/int-living.webp" alt=""><figcaption><b>Mehta residence, living room</b>3 BHK, 1,850 sq ft. Completed 2025</figcaption></figure>
<div class="services">
 <div><small>INTERIORS</small><h3>Rooms planned around how you live</h3><p>Layouts, materials, lighting and furniture, chosen with you and shown in 3D before work starts.</p></div>
 <div><small>ARCHITECTURE</small><h3>Buildings that suit the plot</h3><p>Plans, elevations and approvals for bungalows, clinics and small commercial buildings.</p></div>
 <div><small>TURNKEY</small><h3>One team from drawing to keys</h3><p>Carpenters, painters and electricians managed by us, with a weekly photo update on WhatsApp.</p></div>
</div>
<h2>Selected <em>work</em></h2>
<div class="projects">
 <figure class="p1"><img src="img/int-reading.webp" alt=""><figcaption><b>Reading corner, Desai home</b><span>Interiors, 2025</span></figcaption></figure>
 <figure class="p2"><img src="img/int-lounge.webp" alt=""><figcaption><b>Family lounge, Shah villa</b><span>Interiors, 2024</span></figcaption></figure>
 <figure class="p3"><img src="img/arch-model.webp" alt=""><figcaption><b>Three towers, housing study</b><span>Architecture, 2025</span></figcaption></figure>
</div>
<div class="process"><div><b>Site visit</b><span>We measure, listen and take photos.</span></div><div><b>Concept in 3D</b><span>See every room before anything is built.</span></div><div><b>Execution</b><span>Weekly updates and a fixed schedule.</span></div><div><b>Handover</b><span>A clean home and a care guide.</span></div></div>
<div class="consult"><div class="txt"><h3>Start with a free first visit.</h3><p>Send your plan or a few photos of the space. We reply with ideas and a time to visit.</p><a class="btn wa">{WA}Send photos on WhatsApp</a></div><img src="img/int-lounge.webp" alt=""></div>
<footer><span>© 2026 Studio Aakar</span><span>Interiors and architecture</span></footer>
</div>"""

# ---------------------------------------------------------------- Rangrez: a fashion boutique
BOUTIQUE_CSS = """
body{font-family:'Jost';color:#1E1A1D;background:#FFFCFA;font-size:16px;line-height:1.55}
.bar{background:#1E1A1D;color:#F7E7E2;text-align:center;font-size:13px;letter-spacing:.06em;padding:9px}
nav{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;height:80px;border-bottom:1px solid #EFE3DF}
.links{display:flex;gap:26px;font-size:14px;letter-spacing:.04em}
.brand{font-family:'Bodoni';font-size:34px;font-weight:500;letter-spacing:.14em}
nav .btn{justify-self:end;border-radius:999px;height:42px}
.hero{display:grid;grid-template-columns:1.35fr 1fr;gap:0;margin:24px 0 64px;background:#F6E4DF}
.hero img{width:100%;height:100%;object-fit:cover;aspect-ratio:16/10}
.hero .txt{padding:56px 48px;display:flex;flex-direction:column;justify-content:center}
.hero small{letter-spacing:.2em;font-size:12px;color:#9B4A52}
.hero h1{font-family:'Bodoni';font-weight:400;font-size:64px;line-height:1;margin:14px 0 16px}
.hero h1 i{font-style:italic}
.hero p{color:#5E5458;margin-bottom:26px}
.hero .btn{border-radius:999px;align-self:flex-start}
.cats{display:flex;gap:10px;justify-content:center;margin-bottom:28px}
.cats span{padding:9px 18px;border:1px solid #E4D3CE;border-radius:999px;font-size:14px}
.cats span.on{background:#1E1A1D;color:#fff;border-color:#1E1A1D}
h2{font-family:'Bodoni';font-weight:400;font-size:44px;text-align:center;margin-bottom:8px}
.sub{text-align:center;color:#5E5458;margin-bottom:28px}
.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:22px;margin-bottom:72px}
.item .ph{background:#F4EDEA;aspect-ratio:3/4;display:grid;place-items:center;position:relative}
.item .ph img{width:86%}
.item .tag{position:absolute;left:12px;top:12px;background:#fff;font-size:12px;padding:4px 10px;border-radius:999px}
.item b{display:block;font-weight:500;margin-top:12px}
.item .p{display:flex;gap:10px;align-items:baseline}.item .p strong{font-weight:600}.item .p s{color:#9A8F93;font-size:14px}
.sizes{display:flex;gap:6px;margin-top:8px}.sizes span{width:30px;height:30px;border:1px solid #E4D3CE;display:grid;place-items:center;font-size:12px;border-radius:50%}
.perks{display:grid;grid-template-columns:repeat(3,1fr);text-align:center;border-top:1px solid #EFE3DF;border-bottom:1px solid #EFE3DF;margin-bottom:64px}
.perks div{padding:30px}.perks div+div{box-shadow:inset 1px 0 0 #EFE3DF}
.perks b{font-family:'Bodoni';font-weight:500;font-size:22px;display:block}
.perks span{color:#5E5458;font-size:14px}
.visit{display:flex;align-items:center;justify-content:space-between;background:#1E1A1D;color:#fff;padding:40px 48px;margin-bottom:48px}
.visit h3{font-family:'Bodoni';font-weight:400;font-size:36px}
.visit p{color:#CDBFC3}
.visit .btn{border-radius:999px}
footer{display:flex;justify-content:space-between;padding-bottom:36px;color:#5E5458;font-size:13px}
@media (max-width:700px){
 nav{grid-template-columns:auto 1fr;height:64px}.links{display:none}.brand{font-size:24px!important}
 .hero{grid-template-columns:1fr}.hero .txt{padding:26px}.hero h1{font-size:44px}
 .cats{flex-wrap:wrap}h2{font-size:34px}.grid{grid-template-columns:1fr 1fr;gap:14px}
 .perks{grid-template-columns:1fr}.perks div+div{box-shadow:inset 0 1px 0 #EFE3DF}
 .visit{flex-direction:column;align-items:flex-start;gap:16px;padding:26px}footer{flex-direction:column;gap:4px}
}
"""
BOUTIQUE_BODY = f"""<div class="bar">THE FESTIVE EDIT IS HERE · FREE ALTERATIONS ON EVERY ORDER</div>
<div class="wrap">
<nav><span class="links"><a>New in</a><a>Women</a><a>Footwear</a><a>Accessories</a></span><span class="brand">RANGREZ</span><a class="btn wa">{WA}Order on WhatsApp</a></nav>
<header class="hero"><img src="img/bou-hero.webp" alt=""><div class="txt"><small>FESTIVE 2026</small><h1>The <i>festive</i> edit</h1><p>Hand-embroidered pieces, comfortable footwear and the accessories that finish the look. Try them at the boutique or at home.</p><a class="btn wa">{WA}See the collection</a></div></header>
<h2>New this week</h2><p class="sub">Every piece altered to fit you, free.</p>
<div class="cats"><span class="on">All</span><span>Tops</span><span>Footwear</span><span>Eyewear</span><span>Watches</span></div>
<div class="grid">
 <div class="item"><div class="ph"><span class="tag">New</span><img src="img/bou-corset.webp" alt=""></div><b>Embroidered corset top</b><div class="p"><strong>₹3,499</strong><s>₹4,200</s></div><div class="sizes"><span>S</span><span>M</span><span>L</span><span>XL</span></div></div>
 <div class="item"><div class="ph"><img src="img/bou-shoe.webp" alt=""></div><b>Knit sneakers, sky blue</b><div class="p"><strong>₹2,299</strong></div><div class="sizes"><span>5</span><span>6</span><span>7</span><span>8</span></div></div>
 <div class="item"><div class="ph"><span class="tag">2 left</span><img src="img/bou-sunglasses.webp" alt=""></div><b>Mirror aviators</b><div class="p"><strong>₹1,199</strong></div></div>
 <div class="item"><div class="ph"><img src="img/bou-watch.webp" alt=""></div><b>Chronograph watch, gold</b><div class="p"><strong>₹4,999</strong></div></div>
</div>
<div class="perks"><div><b>Try at home</b><span>We bring three sizes. Keep what fits.</span></div><div><b>Alterations in 2 days</b><span>Free on every purchase.</span></div><div><b>Order on WhatsApp</b><span>Photos, sizes and payment in one chat.</span></div></div>
<div class="visit"><div><h3>Visit the boutique</h3><p>Main Road, open 11 am to 9 pm, closed Tuesdays.</p></div><a class="btn wa">{WA}Book a trial slot</a></div>
<footer><span>© 2026 Rangrez Boutique</span><span>Clothing, footwear and accessories</span></footer>
</div>"""

# ---------------------------------------------------------------- Shubh Utsav: a wedding planner
WEDDING_CSS = """
body{font-family:'Fig';color:#2A1416;background:#FBF6EF;font-size:16px;line-height:1.6}
.hero{position:relative;min-height:760px;color:#FCEFD9;display:flex;flex-direction:column}
.hero>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.hero:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(30,8,10,.55),rgba(30,8,10,.05) 40%,rgba(30,8,10,.65))}
.hero>*:not(img){position:relative;z-index:1}
nav{display:flex;align-items:center;gap:28px;height:88px}
.brand{font-family:'Corm';font-size:30px;font-weight:600;letter-spacing:.02em}
.links{display:flex;gap:28px;margin-left:auto;font-size:14px;letter-spacing:.06em;color:#F3D9B5}
nav .btn{border-radius:999px;height:44px;background:#E2B866;color:#2A1416}
.hero .copy{margin-top:auto;padding-bottom:64px;text-align:center}
.hero small{letter-spacing:.3em;font-size:12px;color:#E2B866}
.hero h1{font-family:'Corm';font-weight:500;font-size:88px;line-height:.95;margin:14px 0 18px}
.hero h1 i{font-family:'CormI';font-weight:500}
.hero p{max-width:46ch;margin:0 auto 26px;color:#F3D9B5}
.hero .btn{border-radius:999px;background:#E2B866;color:#2A1416}
h2{font-family:'Corm';font-weight:500;font-size:56px;line-height:1;text-align:center;margin:88px 0 12px}
h2 i{font-family:'CormI'}
.sub{text-align:center;color:#6E5458;margin-bottom:40px}
.svc{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border-top:1px solid #E8D8C3;border-bottom:1px solid #E8D8C3}
.svc div{padding:30px 26px}.svc div+div{box-shadow:inset 1px 0 0 #E8D8C3}
.svc b{font-family:'Corm';font-size:28px;font-weight:600;display:block;margin-bottom:6px;color:#7A2430}
.svc span{color:#6E5458;font-size:15px}
.week{display:grid;grid-template-columns:repeat(5,1fr);gap:14px}
.day{background:#fff;border:1px solid #EADBC7;padding:22px;text-align:center}
.day small{color:#9C6B2E;font-size:12px;letter-spacing:.12em}
.day b{display:block;font-family:'Corm';font-size:30px;font-weight:600;margin:6px 0 2px}
.day span{color:#6E5458;font-size:14px}
.split{display:grid;grid-template-columns:1fr 1fr;gap:0;margin:88px 0 64px;background:#3A1418;color:#FCEFD9}
.split img{width:100%;height:100%;object-fit:cover}
.split .txt{padding:56px}
.split h3{font-family:'Corm';font-weight:500;font-size:46px;line-height:1;margin-bottom:16px}
.split p{color:#E6CDB0;margin-bottom:22px}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:22px}
.chips span{border:1px solid #8C5A5F;border-radius:999px;padding:7px 14px;font-size:14px}
.chips span.on{background:#E2B866;color:#2A1416;border-color:#E2B866}
.split .btn{border-radius:999px}
footer{display:flex;justify-content:space-between;padding-bottom:36px;color:#6E5458;font-size:13px}
@media (max-width:700px){
 .hero{min-height:620px}nav{height:66px}.links{display:none}nav .btn{margin-left:auto}.brand{font-size:24px!important}
 .hero h1{font-size:50px}h2{font-size:38px;margin-top:56px}
 .svc{grid-template-columns:1fr 1fr}.svc div:nth-child(3){box-shadow:inset 0 1px 0 #E8D8C3}.svc div:nth-child(4){box-shadow:inset 1px 1px 0 #E8D8C3}
 .week{grid-template-columns:1fr 1fr}.split{grid-template-columns:1fr;margin:56px 0 44px}.split .txt{padding:26px}.split h3{font-size:36px}
 footer{flex-direction:column;gap:4px}
}
"""
WEDDING_BODY = f"""<header class="hero"><img src="img/wed-hero.webp" alt="">
<div class="wrap" style="width:100%"><nav><span class="brand">Shubh Utsav</span><span class="links"><a>Weddings</a><a>Decor</a><a>Venues</a><a>Stories</a></span><a class="btn wa">{WA}Plan with us</a></nav></div>
<div class="copy wrap"><small>WEDDING PLANNERS</small><h1>Your wedding, <i>planned to the last diya.</i></h1><p>Decor, venues, food and guests for every function, from mehendi to reception. You enjoy the week; we run it.</p><a class="btn">{WA}Share your wedding date</a></div>
</header>
<div class="wrap">
<h2>Everything, <i>in one team</i></h2><p class="sub">One planner, one WhatsApp group, every vendor handled.</p>
<div class="svc"><div><b>Decor</b><span>Marigold, florals, lighting and stage design.</span></div><div><b>Venues</b><span>Lawns, banquets and destination options.</span></div><div><b>Food</b><span>Caterers tasted and booked with you.</span></div><div><b>Guests</b><span>Invites, RSVPs, rooms and pick-ups.</span></div></div>
<h2>A wedding <i>week</i></h2><p class="sub">A sample plan for a five-function wedding.</p>
<div class="week"><div class="day"><small>THURSDAY</small><b>Mehendi</b><span>Courtyard, afternoon</span></div><div class="day"><small>FRIDAY</small><b>Haldi</b><span>Home, morning</span></div><div class="day"><small>FRIDAY</small><b>Sangeet</b><span>Lawn, 7 pm</span></div><div class="day"><small>SATURDAY</small><b>Wedding</b><span>Mandap, 11 am</span></div><div class="day"><small>SUNDAY</small><b>Reception</b><span>Banquet, 8 pm</span></div></div>
<div class="split"><img src="img/wed-table.webp" alt=""><div class="txt"><h3>Tell us about your wedding</h3><p>Three answers and we send a plan with options and a quote on WhatsApp.</p>
<small>Guests</small><div class="chips"><span>Under 150</span><span class="on">150 to 400</span><span>400+</span></div>
<small>Functions</small><div class="chips"><span>Wedding only</span><span class="on">3 to 5</span><span>Full week</span></div>
<a class="btn wa">{WA}Get a plan on WhatsApp</a></div></div>
<footer><span>© 2026 Shubh Utsav Wedding Planners</span><span>Weddings and family functions</span></footer>
</div>"""

# ---------------------------------------------------------------- Kala Haat: handicrafts
CRAFT_CSS = """
body{font-family:'Work';color:#2B2118;background:#F4ECE0;font-size:16px;line-height:1.6}
nav{display:flex;align-items:center;gap:28px;height:80px}
.brand{font-family:'Young';font-size:26px}
.links{display:flex;gap:26px;margin-left:auto;color:#6B5B4B;font-size:15px}
nav .btn{border-radius:8px;height:44px}
.hero{display:grid;grid-template-columns:.85fr 1.15fr;gap:40px;align-items:center;padding:24px 0 72px}
.hero small{display:inline-block;background:#2B2118;color:#F4ECE0;font-size:13px;padding:5px 10px;border-radius:4px}
.hero h1{font-family:'Young';font-weight:400;font-size:62px;line-height:1.02;margin:18px 0}
.hero p{color:#6B5B4B;font-size:18px;max-width:34ch}
.hero .ctas{display:flex;gap:12px;margin-top:26px}.hero .btn{border-radius:8px}.ghost{box-shadow:inset 0 0 0 1.5px #2B2118}
.hero img{border-radius:18px;width:100%;aspect-ratio:16/10;object-fit:cover}
h2{font-family:'Young';font-weight:400;font-size:42px;line-height:1.05;margin-bottom:8px}
.sub{color:#6B5B4B;margin-bottom:26px}
.shop{display:grid;grid-template-columns:repeat(5,1fr);gap:16px;margin-bottom:72px}
.it{background:#FBF7F1;border-radius:14px;padding:12px}
.it .ph{aspect-ratio:1;display:grid;place-items:center;background:#EFE4D4;border-radius:10px}
.it img{width:82%}
.it b{display:block;margin-top:10px;font-weight:600;font-size:15px}
.it small{color:#6B5B4B;display:block;font-size:13px}
.it .row{display:flex;justify-content:space-between;align-items:center;margin-top:6px}
.it .row span{font-size:12px;font-weight:600;color:#7A4A1E;background:#F3DDC1;border-radius:999px;padding:3px 8px}
.makers{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-bottom:72px}
.maker{background:#2B2118;color:#F4ECE0;border-radius:16px;padding:26px}
.maker .m{width:54px;height:54px;border-radius:50%;background:#B8673F;display:grid;place-items:center;font-family:'Young';font-size:20px;margin-bottom:14px}
.maker b{font-family:'Young';font-weight:400;font-size:22px;display:block}
.maker small{color:#D9C3A5}
.maker p{color:#CDBBA4;font-size:15px;margin-top:10px}
.gift{display:grid;grid-template-columns:1fr 1fr;gap:0;background:#B8673F;color:#FFF6EA;border-radius:18px;overflow:hidden;margin-bottom:56px}
.gift .txt{padding:44px}
.gift h3{font-family:'Young';font-weight:400;font-size:38px;line-height:1.05;margin-bottom:12px}
.gift p{color:#FBE3CC;margin-bottom:20px}
.gift .btn{border-radius:8px;background:#FFF6EA;color:#7A3A1C}
.gift img{width:100%;height:100%;object-fit:cover}
footer{display:flex;justify-content:space-between;padding-bottom:36px;color:#6B5B4B;font-size:13px}
@media (max-width:700px){
 nav{height:64px}.links{display:none}nav .btn{margin-left:auto}.brand{font-size:21px!important}
 .hero{grid-template-columns:1fr;gap:22px;padding:12px 0 48px}.hero h1{font-size:42px}.hero .ctas{flex-wrap:wrap}
 h2{font-size:32px}.shop{grid-template-columns:1fr 1fr;margin-bottom:48px}.makers{grid-template-columns:1fr;margin-bottom:48px}
 .gift{grid-template-columns:1fr}.gift .txt{padding:26px}footer{flex-direction:column;gap:4px}
}
"""
CRAFT_BODY = f"""<div class="wrap">
<nav><span class="brand">Kala Haat</span><span class="links"><a>Shop</a><a>Makers</a><a>Gifting</a><a>Our story</a></span><a class="btn wa">{WA}Order on WhatsApp</a></nav>
<header class="hero"><div><small>Handmade, small batches</small><h1>Made by hand, by people you can meet.</h1><p>Terracotta, brass and glazed pottery from twelve artisan families. Every piece is a little different.</p>
<div class="ctas"><a class="btn wa">{WA}Shop on WhatsApp</a><a class="btn ghost">Meet the makers</a></div></div><img src="img/craft-hero.webp" alt=""></header>
<h2>In the workshop this week</h2><p class="sub">Made to order in about 7 days. We send a photo of your piece before it ships.</p>
<div class="shop">
 <div class="it"><div class="ph"><img src="img/craft-matka.webp" alt=""></div><b>Terracotta matka</b><small>Keeps water cool</small><div class="row"><strong>₹650</strong><span>Clay</span></div></div>
 <div class="it"><div class="ph"><img src="img/craft-vase.webp" alt=""></div><b>Glazed bottle vase</b><small>Indigo glaze</small><div class="row"><strong>₹1,150</strong><span>Glaze</span></div></div>
 <div class="it"><div class="ph"><img src="img/craft-bowl.webp" alt=""></div><b>Brass bowl</b><small>Hand-beaten, polished</small><div class="row"><strong>₹1,450</strong><span>Brass</span></div></div>
 <div class="it"><div class="ph"><img src="img/craft-diya.webp" alt=""></div><b>Brass diya</b><small>Set of 4</small><div class="row"><strong>₹899</strong><span>Brass</span></div></div>
 <div class="it"><div class="ph"><img src="img/craft-teacup.webp" alt=""></div><b>Painted teacup</b><small>With saucer</small><div class="row"><strong>₹540</strong><span>Ceramic</span></div></div>
</div>
<h2>Meet the makers</h2><p class="sub">Your order goes straight to the family who makes it.</p>
<div class="makers">
 <div class="maker"><div class="m">RP</div><b>Ramesh Prajapati</b><small>Terracotta, third generation</small><p>Wheel-thrown pots fired in a wood kiln behind his home.</p></div>
 <div class="maker"><div class="m">SK</div><b>Salma Kazi</b><small>Glazed pottery</small><p>Small batches in indigo and celadon, glazed by hand.</p></div>
 <div class="maker"><div class="m">MK</div><b>Mohan Kansara</b><small>Brassware</small><p>Bowls and diyas beaten and polished in his workshop.</p></div>
</div>
<div class="gift"><div class="txt"><h3>Gifts for Diwali and weddings</h3><p>Hampers of 20 to 500 pieces with your card inside. Samples sent before you order.</p><a class="btn">{WA}Ask for gifting options</a></div><img src="img/craft-hero.webp" alt=""></div>
<footer><span>© 2026 Kala Haat</span><span>Handmade pottery and brass</span></footer>
</div>"""

# ---------------------------------------------------------------- Sheesham House: furniture
FURN_CSS = """
body{font-family:'Manrope';color:#1F1B16;background:#FAF7F2;font-size:16px;line-height:1.55}
nav{display:flex;align-items:center;gap:28px;height:78px}
.brand{font-family:'News';font-weight:600;font-size:26px;letter-spacing:-.01em}
.links{display:flex;gap:26px;margin-left:auto;color:#6A6158;font-size:15px}
nav .btn{border-radius:6px;height:44px}
.hero{display:grid;grid-template-columns:.8fr 1.2fr;border-radius:18px;overflow:hidden;background:#EFE5D8}
.hero img{width:100%;height:100%;aspect-ratio:4/3;object-fit:cover;object-position:35% 50%}
.hero .txt{padding:48px 40px;display:flex;flex-direction:column;justify-content:center}
.hero h1{font-family:'News';font-weight:500;font-size:68px;line-height:.98;letter-spacing:-.02em}
.hero p{margin:14px 0 22px;color:#4A4038;font-size:18px}
.hero .btn{border-radius:6px}
.badges{display:flex;flex-wrap:wrap;gap:8px;margin-top:22px}
.badges span{background:rgba(250,247,242,.9);border-radius:999px;padding:8px 14px;font-size:14px;font-weight:600}
.cats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin:22px 0 64px}
.cats div{background:#EFE8DE;border-radius:14px;padding:16px 18px;display:flex;justify-content:space-between;align-items:center}
.cats b{font-family:'News';font-weight:500;font-size:22px}.cats small{color:#6A6158}
h2{font-family:'News';font-weight:500;font-size:46px;letter-spacing:-.02em;line-height:1.02;margin-bottom:8px}
.head{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:24px}
.head p{color:#6A6158}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-bottom:72px}
.card .ph{background:#EFE8DE;border-radius:14px;aspect-ratio:4/3;display:grid;place-items:center;position:relative}
.card img{width:84%}
.card .sw{position:absolute;right:14px;bottom:14px;display:flex;gap:6px}
.card .sw i{width:16px;height:16px;border-radius:50%;box-shadow:0 0 0 2px #fff}
.card .row{display:flex;justify-content:space-between;margin-top:12px}
.card b{font-weight:600}.card small{color:#6A6158;display:block}
.card strong{font-family:'News';font-weight:600;font-size:20px}
.room{display:grid;grid-template-columns:1.2fr .8fr;gap:0;background:#1F1B16;color:#FAF7F2;border-radius:18px;overflow:hidden;margin-bottom:56px}
.room img{width:100%;height:100%;object-fit:cover}
.room .txt{padding:44px}
.room h3{font-family:'News';font-weight:500;font-size:40px;line-height:1.02;margin-bottom:12px}
.room p{color:#CFC5B8;margin-bottom:18px}
.room ol{margin:0 0 22px 18px;list-style:decimal;color:#CFC5B8;display:grid;gap:6px}
.room .btn{border-radius:6px}
footer{display:flex;justify-content:space-between;padding-bottom:36px;color:#6A6158;font-size:13px}
@media (max-width:700px){
 nav{height:62px}.links{display:none}nav .btn{margin-left:auto}.brand{font-size:21px!important}
 .hero{grid-template-columns:1fr}.hero .txt{padding:26px}.hero img{aspect-ratio:4/3}.hero h1{font-size:40px}
 .cats{grid-template-columns:1fr 1fr}h2{font-size:34px}.head{display:block}.grid{grid-template-columns:1fr 1fr;gap:12px}
 .room{grid-template-columns:1fr}.room .txt{padding:26px}footer{flex-direction:column;gap:4px}
}
"""
FURN_BODY = f"""<div class="wrap">
<nav><span class="brand">Sheesham House</span><span class="links"><a>Sofas</a><a>Chairs</a><a>Lighting</a><a>Custom</a></span><a class="btn wa">{WA}Chat with us</a></nav>
<header class="hero"><div class="txt"><h1>Furniture made to last a generation.</h1><p>Solid wood frames, fabrics you can touch in the showroom, sizes made for your room.</p><a class="btn wa" style="align-self:flex-start">{WA}See the catalogue</a>
<div class="badges"><span>5-year frame warranty</span><span>Free delivery in the city</span><span>Custom sizes</span></div></div><img src="img/fur-hero.webp" alt=""></header>
<div class="cats"><div><b>Sofas</b><small>18 designs</small></div><div><b>Lounge chairs</b><small>12 designs</small></div><div><b>Poufs</b><small>6 fabrics</small></div><div><b>Lighting</b><small>9 lamps</small></div></div>
<div class="head"><div><h2>Bestsellers</h2><p>Prices include delivery and installation.</p></div></div>
<div class="grid">
 <div class="card"><div class="ph"><img src="img/fur-velvet.webp" alt=""><span class="sw"><i style="background:#1F3F8C"></i><i style="background:#3F6B4F"></i><i style="background:#8C3A52"></i></span></div><div class="row"><div><b>Curve velvet sofa</b><small>3 seater, 2.4 m</small></div><strong>₹42,000</strong></div></div>
 <div class="card"><div class="ph"><img src="img/fur-leather.webp" alt=""></div><div class="row"><div><b>Heritage leather sofa</b><small>Carved sheesham frame</small></div><strong>₹58,000</strong></div></div>
 <div class="card"><div class="ph"><img src="img/fur-chair.webp" alt=""><span class="sw"><i style="background:#E8643C"></i><i style="background:#2E5E5A"></i></span></div><div class="row"><div><b>Low lounge chair</b><small>Oak legs</small></div><strong>₹14,500</strong></div></div>
 <div class="card"><div class="ph"><img src="img/fur-damask.webp" alt=""></div><div class="row"><div><b>Damask accent chair</b><small>Purple and gold</small></div><strong>₹12,900</strong></div></div>
 <div class="card"><div class="ph"><img src="img/fur-pouf.webp" alt=""></div><div class="row"><div><b>Pleated silk pouf</b><small>60 cm</small></div><strong>₹6,800</strong></div></div>
 <div class="card"><div class="ph"><img src="img/fur-lamp.webp" alt=""></div><div class="row"><div><b>Glass base table lamp</b><small>Linen shade</small></div><strong>₹4,200</strong></div></div>
</div>
<div class="room"><img src="img/int-lounge.webp" alt=""><div class="txt"><h3>See it in your room before you buy</h3><p>Send us a photo of your room. We send it back with the sofa placed in it, in the size and fabric you pick.</p><ol><li>Send a photo and the wall length</li><li>Pick a design and fabric</li><li>Get your room with the piece in it</li></ol><a class="btn wa">{WA}Send a room photo</a></div></div>
<footer><span>© 2026 Sheesham House</span><span>Solid wood furniture</span></footer>
</div>"""

# ---------------------------------------------------------------- Himal Cooling: a manufacturer
MFG_CSS = """
body{font-family:'Archivo';color:#16191B;background:#F3F4F2;font-size:16px;line-height:1.55}
.wrap{max-width:1200px}
nav{display:flex;align-items:center;gap:32px;height:76px}
.brand{display:flex;align-items:baseline;gap:8px;font-weight:800;font-size:22px;letter-spacing:.08em}
.brand small{font-weight:500;font-size:13px;letter-spacing:0;color:#5E676C}
.links{display:flex;gap:28px;margin-left:auto;color:#3F474C;font-size:15px}
nav .btn{border-radius:8px;height:44px}
/* Hero: the product in a dark studio, with callouts to the parts that matter */
.hero{position:relative;border-radius:16px;overflow:hidden;background:#23272A;color:#EEF2F3}
.hero img{width:100%;aspect-ratio:16/10;object-fit:cover;object-position:60% 50%}
.hero .copy{position:absolute;left:48px;top:48px;max-width:430px}
.hero h1{font-weight:800;font-size:60px;line-height:1;letter-spacing:-.035em}
.hero p{color:#B9C2C6;font-size:18px;margin:16px 0 26px;max-width:34ch}
.hero .btn{border-radius:8px}
.hero .ghost{box-shadow:inset 0 0 0 1.5px #5E676C;color:#EEF2F3;margin-left:8px}
.call{position:absolute;display:flex;align-items:center;gap:10px;font-size:13px;color:#DDE4E6}
.call:before{content:'';width:9px;height:9px;border-radius:50%;background:#7FD3E6;box-shadow:0 0 0 4px rgba(127,211,230,.25)}
.call b{display:block;color:#fff;font-size:14px}
.call>span{background:rgba(20,23,25,.78);padding:6px 10px;border-radius:8px;backdrop-filter:blur(4px)}
.c1{left:71%;top:12%}.c2{left:71%;top:44%}.c3{left:71%;top:86%}
/* Lineup: every model, to scale */
.sec{padding:96px 0 0}
h2{font-weight:800;font-size:44px;line-height:1.05;letter-spacing:-.03em;max-width:18ch}
.lede{color:#4B5459;font-size:18px;margin-top:12px;max-width:52ch}
.lineup{margin-top:32px;border-radius:16px;overflow:hidden;background:#E7EAEC}
.lineup img{width:100%}
.specs{display:grid;grid-template-columns:repeat(5,1fr);gap:0;margin-top:0;border-top:1px solid #D5DADD}
.specs div{padding:18px 18px 4px 0}
.specs b{display:block;font-size:20px;font-weight:800;letter-spacing:-.01em}
.specs span{display:block;color:#4B5459;font-size:14px;line-height:1.5}
.specs em{font-style:normal;display:inline-block;margin-top:8px;font-size:13px;font-weight:600;color:#0F5B6B}
/* Branding: your logo on the canopy */
.brandrow{display:grid;grid-template-columns:1.25fr .75fr;gap:48px;align-items:center;margin-top:32px}
.brandrow img{width:100%;border-radius:16px;background:#ECEFF1}
.steps{display:grid;gap:22px}
.steps div{display:grid;grid-template-columns:36px 1fr;gap:14px}
.steps i{font-style:normal;width:36px;height:36px;border-radius:50%;background:#16191B;color:#fff;display:grid;place-items:center;font-weight:700;font-size:14px}
.steps b{display:block;font-size:17px}
.steps span{color:#4B5459;font-size:15px}
/* An order, week by week */
.weeks{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:32px}
.wk{background:#fff;border-radius:12px;padding:20px}
.wk small{color:#0F5B6B;font-weight:700;font-size:13px}
.wk b{display:block;font-size:18px;margin:4px 0}
.wk span{color:#4B5459;font-size:14px}
/* Quote on WhatsApp: show the message, not a fake form */
.quote{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;margin:96px 0 56px;padding:48px;border-radius:16px;background:#16191B;color:#EEF2F3}
.quote h2{color:#fff}
.quote p{color:#B9C2C6;margin:12px 0 24px}
.quote .btn{border-radius:8px}
.chat{background:#EFEAE2;border-radius:14px;padding:18px;display:grid;gap:8px}
.bub{max-width:85%;padding:9px 12px;border-radius:10px;font-size:14px;line-height:1.4;color:#111B21;background:#fff}
.bub.me{justify-self:end;background:#D9FDD3}
.bub small{display:block;text-align:right;color:#667781;font-size:11px;margin-top:2px}
footer{display:flex;justify-content:space-between;padding:0 0 36px;color:#5E676C;font-size:13px}
@media (max-width:700px){
 nav{height:62px}.links{display:none}nav .btn{margin-left:auto}.brand small{display:none}
 .hero{display:flex;flex-direction:column-reverse}.hero img{aspect-ratio:4/3;object-position:78% 50%}.hero .copy{position:static;padding:26px 22px 4px;max-width:none}.hero h1{font-size:38px}.hero p{font-size:16px}
 .hero .ghost{display:none}.call{display:none}
 .sec{padding-top:64px}h2{font-size:30px}
 .specs{grid-template-columns:1fr 1fr;row-gap:8px}.brandrow{grid-template-columns:1fr;gap:24px}
 .weeks{grid-template-columns:1fr 1fr}.quote{grid-template-columns:1fr;padding:26px;gap:24px;margin-top:64px}
 footer{flex-direction:column;gap:4px}
}
"""
MFG_BODY = f"""<div class="wrap">
<nav><span class="brand">HIMAL<small>Cooling Systems</small></span><span class="links"><a>Models</a><a>Branding</a><a>How we work</a><a>Dealers</a></span><a class="btn wa">{WA}<span class="hide-m">Ask for a quote</span><span class="show-m">Quote</span></a></nav>
<header class="hero"><img src="img/mfg-hero.webp" alt="">
 <div class="copy"><h1>Cold drinks, even at 43&nbsp;°C outside.</h1>
 <p>Visi coolers for beverage brands, dairies and shops. Built in our own factory, with your name on the canopy.</p>
 <a class="btn wa">{WA}Ask for a quote</a><a class="btn ghost">See the models</a></div>
 <span class="call c1"><span><b>Lit canopy</b>Your logo, LED backlit</span></span>
 <span class="call c2"><span><b>Double-glazed door</b>No fog in humid shops</span></span>
 <span class="call c3"><span><b>R290 compressor</b>Lower power bills</span></span>
</header>
<section class="sec"><h2>Five sizes, from a corner shop to a supermarket</h2><p class="lede">Shown to scale. Every model holds 2 to 8 °C, uses LED lighting inside and comes with a 2-year compressor warranty.</p>
<div class="lineup"><img src="img/mfg-lineup.webp" alt=""></div>
<div class="specs">
 <div><b>HC-220</b><span>220 L · 1 door</span><span>155 cm tall</span><em>Small shops</em></div>
 <div><b>HC-330</b><span>330 L · 1 door</span><span>195 cm tall</span><em>Beverage brands</em></div>
 <div><b>HC-450</b><span>450 L · 1 door</span><span>205 cm tall</span><em>Dairies</em></div>
 <div><b>HC-660D</b><span>660 L · 2 doors</span><span>200 cm tall</span><em>Supermarkets</em></div>
 <div><b>HC-1000D</b><span>1,000 L · 2 doors</span><span>210 cm tall</span><em>Distributors</em></div>
</div></section>
<section class="sec"><h2>Your brand on every cooler</h2><p class="lede">From 25 units we print your logo on the canopy and match the colour. You approve a sample before we make the batch.</p>
<div class="brandrow"><img src="img/mfg-brands.webp" alt="">
 <div class="steps">
  <div><i>1</i><p><b>Send your logo</b><span>Any file, on WhatsApp.</span></p></div>
  <div><i>2</i><p><b>See it on the cooler</b><span>A render like this one, in two days.</span></p></div>
  <div><i>3</i><p><b>Approve one sample</b><span>Built and photographed before the batch.</span></p></div>
 </div></div></section>
<section class="sec"><h2>An order of 50 coolers, week by week</h2>
<div class="weeks">
 <div class="wk"><small>Week 1</small><b>Quote and sample</b><span>Price, branding and a sample cooler.</span></div>
 <div class="wk"><small>Week 2</small><b>Production</b><span>Cabinets, wiring and glass doors.</span></div>
 <div class="wk"><small>Week 3</small><b>Testing</b><span>Every unit runs 24 hours at full load.</span></div>
 <div class="wk"><small>Week 4</small><b>Dispatch</b><span>Packed, loaded and tracked to your depots.</span></div>
</div></section>
<section class="quote"><div><h2>Ask for a quote on WhatsApp</h2><p>Tell us the model, how many and where they go. We reply with a price and a delivery date.</p><a class="btn wa">{WA}Message us on WhatsApp</a></div>
 <div class="chat"><div class="bub me">Need 50 × HC-330 with our logo, delivery to two depots.<small>10:08</small></div><div class="bub">Thanks. ₹28,400 each with branding, delivered in 3 weeks. Quote PDF attached.<small>10:09</small></div></div></section>
<footer><span>© 2026 Himal Cooling Systems</span><span>Commercial refrigeration manufacturer</span></footer>
</div>"""

# Extra pages of the furniture site, for the multi-page site preview: the nav marks the page you're on.
FURN_PAGES_CSS = """
.links a.on{color:#1F1B16;font-weight:700;box-shadow:inset 0 -2px 0 #1F1B16;padding-bottom:4px}
.page-head{padding:36px 0 26px;border-bottom:1px solid #E5DDD1;margin-bottom:28px}
.page-head small{color:#8A6B4E;font-weight:600;font-size:13px}
.page-head h1{font-family:'News';font-weight:500;font-size:56px;letter-spacing:-.02em;line-height:1;margin-top:6px}
.page-head p{color:#6A6158;margin-top:10px;max-width:56ch}
.filters{display:flex;gap:8px;margin-bottom:22px}.filters span{border:1px solid #DCD2C4;border-radius:999px;padding:7px 14px;font-size:14px}.filters span.on{background:#1F1B16;color:#fff;border-color:#1F1B16}
.steps3{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-bottom:40px}
.steps3 div{background:#EFE8DE;border-radius:14px;padding:24px}.steps3 b{font-family:'News';font-weight:500;font-size:24px;display:block;margin:6px 0}
.steps3 small{color:#8A6B4E;font-weight:700}.steps3 p{color:#6A6158;font-size:15px}
.sizes{display:grid;grid-template-columns:1.2fr .8fr;gap:24px;margin-bottom:56px;align-items:center}
.sizes img{border-radius:14px;width:100%}
.sizes table{width:100%;border-collapse:collapse;font-size:15px}.sizes td{padding:12px 0;border-bottom:1px solid #E5DDD1}.sizes td:last-child{text-align:right;font-weight:600}
.visit2{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:56px}
.visit2 img{border-radius:14px;width:100%;height:100%;object-fit:cover}
.visit2 .card{background:#1F1B16;color:#FAF7F2;border-radius:14px;padding:32px}
.visit2 h3{font-family:'News';font-weight:500;font-size:34px;margin-bottom:12px}
.visit2 .row{display:flex;justify-content:space-between;padding:11px 0;border-bottom:1px solid #3A332B;color:#CFC5B8}.visit2 .row b{color:#fff;font-weight:600}
.visit2 .btn{border-radius:6px;margin-top:22px}
"""


def furn_nav(active):
    names = ['Sofas', 'Chairs', 'Custom', 'Visit']
    links = ''.join(f'<a class="{"on" if n == active else ""}">{n}</a>' for n in names)
    return f'<nav><span class="brand">Sheesham House</span><span class="links">{links}</span><a class="btn wa">{WA}Chat with us</a></nav>'


FURN_SOFAS = f"""<div class="wrap">{furn_nav('Sofas')}
<div class="page-head"><small>CATALOGUE</small><h1>Sofas</h1><p>Every sofa has a solid sheesham frame. Pick a fabric and a length; we make it for you in about two weeks.</p></div>
<div class="filters"><span class="on">All sofas</span><span>2 seater</span><span>3 seater</span><span>Sectional</span><span>Velvet</span><span>Leather</span></div>
<div class="grid">
 <div class="card"><div class="ph"><img src="img/fur-velvet.webp" alt=""></div><div class="row"><div><b>Curve velvet sofa</b><small>3 seater, 2.4 m</small></div><strong>₹42,000</strong></div></div>
 <div class="card"><div class="ph"><img src="img/fur-leather.webp" alt=""></div><div class="row"><div><b>Heritage leather sofa</b><small>Carved frame</small></div><strong>₹58,000</strong></div></div>
 <div class="card"><div class="ph"><img src="img/fur-chair.webp" alt=""></div><div class="row"><div><b>Low lounge chair</b><small>Pairs with any sofa</small></div><strong>₹14,500</strong></div></div>
</div></div>"""

FURN_CUSTOM = f"""<div class="wrap">{furn_nav('Custom')}
<div class="page-head"><small>MADE TO ORDER</small><h1>Your size, your fabric</h1><p>Tell us the wall length and the fabric you like. We draw it, send you a photo of your room with the sofa in it, then make it.</p></div>
<div class="steps3"><div><small>Step 1</small><b>Measure the wall</b><p>Send the length and a photo on WhatsApp.</p></div><div><small>Step 2</small><b>Pick a fabric</b><p>40 velvets, linens and leathers in the showroom.</p></div><div><small>Step 3</small><b>See it, then order</b><p>We send your room with the sofa placed in it.</p></div></div>
<div class="sizes"><img src="img/int-lounge.webp" alt=""><table><tr><td>2 seater</td><td>from ₹28,000</td></tr><tr><td>3 seater</td><td>from ₹36,000</td></tr><tr><td>L-shaped</td><td>from ₹54,000</td></tr><tr><td>Delivery</td><td>about 2 weeks</td></tr></table></div></div>"""

FURN_VISIT = f"""<div class="wrap">{furn_nav('Visit')}
<div class="page-head"><small>SHOWROOM</small><h1>Sit on it before you buy it</h1><p>Every design on the floor, every fabric on the wall. Book a time and we keep a designer free for you.</p></div>
<div class="visit2"><img src="img/fur-hero.webp" alt=""><div class="card"><h3>Ring Road showroom</h3><div class="row"><span>Monday to Saturday</span><b>10 am to 8 pm</b></div><div class="row"><span>Sunday</span><b>11 am to 6 pm</b></div><div class="row"><span>Parking</span><b>In front</b></div><a class="btn wa">{WA}Book a showroom visit</a></div></div></div>"""

MORE = {
    'interior': ('Studio Aakar', font('Instrument', 'instrument-serif.woff2') + font_i('Instrument', 'instrument-serif-italic.woff2') + font('Manrope', 'manrope.woff2'), INTERIOR_CSS, INTERIOR_BODY),
    'boutique': ('Rangrez Boutique', font('Bodoni', 'bodoni-moda.woff2') + font('Jost', 'jost.woff2'), BOUTIQUE_CSS, BOUTIQUE_BODY),
    'wedding': ('Shubh Utsav', font('Corm', 'cormorant.woff2') + font('CormI', 'cormorant-italic.woff2') + font('Fig', 'figtree.woff2'), WEDDING_CSS, WEDDING_BODY),
    'handicrafts': ('Kala Haat', font('Young', 'young-serif.woff2') + font('Work', 'work-sans.woff2'), CRAFT_CSS, CRAFT_BODY),
    'furniture': ('Sheesham House', font('News', 'newsreader.woff2') + font('Manrope', 'manrope.woff2'), FURN_CSS, FURN_BODY),
    'manufacturer': ('Himal Cooling Systems', font('Archivo', 'archivo.woff2'), MFG_CSS, MFG_BODY),
}
FURN_FONTS = font('News', 'newsreader.woff2') + font('Manrope', 'manrope.woff2')
PAGES = {
    'furniture-sofas': ('Sofas · Sheesham House', FURN_FONTS, FURN_CSS + FURN_PAGES_CSS, FURN_SOFAS),
    'furniture-custom': ('Custom · Sheesham House', FURN_FONTS, FURN_CSS + FURN_PAGES_CSS, FURN_CUSTOM),
    'furniture-visit': ('Visit · Sheesham House', FURN_FONTS, FURN_CSS + FURN_PAGES_CSS, FURN_VISIT),
}
