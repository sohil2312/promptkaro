"""Business dashboards for the 'more dashboards' gallery: furniture store, manufacturer,
wedding planner, interior studio. Each is a full owner's dashboard with sample data that fills
itself from WhatsApp, UPI and billing. Screenshotted at 2x by shoot.js for HD previews.
All businesses and numbers are fictional sample content.
"""
import os

HERE = os.path.dirname(os.path.abspath(__file__))

BASE = """
@font-face{font-family:'Manrope';src:url(fonts/manrope.woff2) format('woff2');font-weight:200 800}
*{box-sizing:border-box;margin:0;padding:0}html{-webkit-font-smoothing:antialiased}ul{list-style:none}
body{font-family:'Manrope';background:#F4F5F2;color:#16201B;font-size:14px;line-height:1.45}
.app{display:grid;grid-template-columns:220px 1fr;min-height:100vh}
.side{background:var(--side);color:#E9EEEA;padding:22px 16px;display:flex;flex-direction:column;gap:4px}
.logo{display:flex;align-items:center;gap:10px;font-weight:800;font-size:16px;margin-bottom:22px}
.logo i{width:30px;height:30px;border-radius:8px;background:var(--accent);display:grid;place-items:center;font-style:normal;color:#fff;font-size:14px}
.side a{padding:9px 12px;border-radius:8px;color:#C5D0CA;font-weight:600}
.side a.on{background:rgba(255,255,255,.1);color:#fff}
.side h6{font-size:11px;letter-spacing:.08em;color:#8FA199;margin:22px 0 8px 12px;font-weight:700}
.rule{background:rgba(255,255,255,.06);border-radius:10px;padding:10px 12px;display:grid;grid-template-columns:28px 1fr auto;gap:8px;align-items:center;font-size:12.5px;color:#DCE4DF;margin-bottom:6px}
.sw{width:26px;height:15px;border-radius:999px;background:#25D366;position:relative}.sw:after{content:'';position:absolute;right:2px;top:2px;width:11px;height:11px;border-radius:50%;background:#fff}
.rule b{color:#FFD27A}
main{padding:22px 26px}
.top{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px}
.top h1{font-size:22px;font-weight:800;letter-spacing:-.02em}.top small{color:#6B7771;display:block;font-size:13px}
.live{display:inline-flex;align-items:center;gap:6px;background:#E4F5EC;color:#0B7A47;font-weight:700;font-size:12px;padding:5px 10px;border-radius:999px}.live i{width:7px;height:7px;border-radius:50%;background:#16A34A}
.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:14px}
.kpi{background:#fff;border-radius:14px;padding:14px 16px;box-shadow:0 1px 2px rgba(16,24,20,.05)}
.kpi small{color:#6B7771;font-size:12px}.kpi b{display:block;font-size:26px;font-weight:800;letter-spacing:-.02em;margin:2px 0}
.up{color:#0B7A47;background:#E4F5EC;font-size:11.5px;font-weight:700;padding:2px 7px;border-radius:999px}.dn{color:#B42318;background:#FDECEA;font-size:11.5px;font-weight:700;padding:2px 7px;border-radius:999px}
.card{background:#fff;border-radius:14px;padding:16px;box-shadow:0 1px 2px rgba(16,24,20,.05)}
.card h3{font-size:14px;font-weight:800;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center}
.card h3 small{font-weight:600;color:#6B7771;font-size:12px}
.row{display:grid;gap:14px;margin-bottom:14px}
table{width:100%;border-collapse:collapse;font-size:13px}th{text-align:left;color:#6B7771;font-weight:600;font-size:12px;padding:6px 8px;border-bottom:1px solid #EEF0EC}
td{padding:9px 8px;border-bottom:1px solid #F1F2EF;vertical-align:middle}
.t{display:flex;align-items:center;gap:8px}.t img{width:34px;height:34px;border-radius:8px;object-fit:cover;background:#F2F0EB}
.pill{font-size:11.5px;font-weight:700;padding:3px 8px;border-radius:999px;white-space:nowrap}
.p-g{background:#E4F5EC;color:#0B7A47}.p-y{background:#FFF3D6;color:#8A5A00}.p-b{background:#E6EEFF;color:#2547A8}.p-r{background:#FDECEA;color:#B42318}.p-n{background:#EFF1EE;color:#4A5651}
.ai{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:700;color:#0B7A47}.ai:before{content:'';width:12px;height:12px;border-radius:4px;background:#0B7A47}
.bar{height:8px;border-radius:99px;background:#EEF0EC;overflow:hidden}.bar i{display:block;height:100%;border-radius:99px;background:var(--accent)}
.feed li{display:grid;grid-template-columns:18px 1fr auto;gap:8px;padding:7px 0;font-size:13px;border-bottom:1px solid #F1F2EF}
.feed li:before{content:'';width:16px;height:16px;border-radius:50%;background:#2BB673;margin-top:1px}
.feed small{color:#8A958F}
.insight{background:#F1EEFF;border-radius:10px;padding:10px 12px;margin-bottom:8px;font-size:13px;color:#2E2560}
.insight b{color:#5B3FD6}
"""


def page(title, accent, side_color, logo, name, nav, rules, body):
    navs = ''.join(f'<a class="{"on" if i == 0 else ""}">{n}</a>' for i, n in enumerate(nav))
    rl = ''.join(f'<div class="rule"><span class="sw"></span><span>{t}</span><b>{c}</b></div>' for t, c in rules)
    return (f'<!doctype html><html><head><meta charset="utf-8"><title>{title}</title><style>:root{{--accent:{accent};--side:{side_color}}}{BASE}</style></head>'
            f'<body><div class="app"><aside class="side"><div class="logo"><i>{logo}</i>{name}</div>{navs}<h6>AUTOMATIONS</h6>{rl}</aside><main>{body}</main></div></body></html>')


FURNITURE = page('Sheesham House dashboard', '#9A6B3F', '#231C15', 'S', 'Sheesham House',
    ['Overview', 'Orders', 'Production', 'Showroom', 'Customers'],
    [('Send fabric photos when someone asks', 31), ('Daily production photo to customer', 18), ('Ask for a review after delivery', 9)],
    """
<div class="top"><div><h1>Orders and production</h1><small>This month, compared with last month</small></div><span class="live"><i></i>Live, synced just now</span></div>
<div class="kpis">
 <div class="kpi"><small>Orders</small><b>64</b><span class="up">+18%</span></div>
 <div class="kpi"><small>Revenue</small><b>₹21.4 L</b><span class="up">+11%</span></div>
 <div class="kpi"><small>In production</small><b>18</b><span class="p-n pill">avg 12 days</span></div>
 <div class="kpi"><small>Showroom visits booked</small><b>37</b><span class="up">29 by the AI agent</span></div>
</div>
<div class="row" style="grid-template-columns:2fr 1fr">
 <div class="card"><h3>Production board <small>18 custom orders</small></h3>
  <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px">
   """ + ''.join(f'<div><div style="font-size:12px;font-weight:700;color:#6B7771;margin-bottom:8px">{stage} · {n}</div>' + ''.join(
       f'<div style="background:#F7F5F1;border-radius:10px;padding:8px;margin-bottom:8px"><img src="img/{img}.webp" style="width:100%;height:70px;object-fit:contain"><div style="font-weight:700;font-size:12.5px">{item}</div><div style="font-size:11.5px;color:#6B7771">{who}</div></div>'
       for img, item, who in cards) + '</div>' for stage, n, cards in [
       ('Approved', 4, [('fur-velvet', 'Curve sofa, 2.1 m', 'Priya M.'), ('fur-pouf', 'Silk pouf × 2', 'Rohan S.')]),
       ('Frame', 5, [('fur-leather', 'Heritage sofa', 'Desai family')]),
       ('Upholstery', 4, [('fur-chair', 'Lounge chair', 'Anita K.'), ('fur-damask', 'Accent chair', 'Studio Aakar')]),
       ('Polish', 3, [('fur-leather', '3 seater', 'Mehta home')]),
       ('Delivery', 2, [('fur-velvet', 'Curve sofa', 'Kavya R.')])]) + """
  </div></div>
 <div class="card"><h3>Fabric stock</h3>
  """ + ''.join(f'<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:5px"><span>{f}</span><b>{m} m</b></div><div class="bar"><i style="width:{w}%;{c}"></i></div></div>' for f, m, w, c in [
      ('Royal blue velvet', 14, 46, ''), ('Rust linen', 32, 80, ''), ('Tan leather', 6, 18, 'background:#D9534F'), ('Purple damask', 21, 60, ''), ('Olive boucle', 27, 70, '')]) + """
  <div class="insight"><b>AI insight:</b> tan leather will run out in about 9 days at this pace. Reorder 40 m?</div></div>
</div>
<div class="row" style="grid-template-columns:2fr 1fr">
 <div class="card"><h3>WhatsApp enquiries <small>today</small></h3><table><tr><th>Customer</th><th>Asked about</th><th>Handled by</th><th>Next step</th></tr>
  <tr><td>Priya M.</td><td><span class="t"><img src="img/fur-velvet.webp">Curve sofa in 2.1 m</span></td><td><span class="ai">AI agent</span></td><td><span class="pill p-g">Quote sent ₹39,500</span></td></tr>
  <tr><td>Rahul V.</td><td><span class="t"><img src="img/fur-lamp.webp">Table lamp, 2 pieces</span></td><td><span class="ai">AI agent</span></td><td><span class="pill p-b">Paid by UPI</span></td></tr>
  <tr><td>Neha J.</td><td><span class="t"><img src="img/fur-damask.webp">Accent chair fabric</span></td><td><span class="ai">AI agent</span></td><td><span class="pill p-y">Showroom Sat 4 pm</span></td></tr>
  <tr><td>Imran S.</td><td><span class="t"><img src="img/fur-leather.webp">Bulk order for a hotel</span></td><td>Owner</td><td><span class="pill p-r">Call back today</span></td></tr></table></div>
 <div class="card"><h3>Live activity</h3><ul class="feed"><li><span>Production photo sent to Anita K.</span><small>2m</small></li><li><span>UPI ₹8,400 matched to Rahul V.</span><small>9m</small></li><li><span>AI agent booked a showroom visit</span><small>14m</small></li><li><span>Review request sent to Kavya R.</span><small>1h</small></li></ul></div>
</div>""")

MANUFACTURER = page('Himal Cooling dashboard', '#0E6BA8', '#0F1B24', 'H', 'Himal Cooling',
    ['Overview', 'Quotes', 'Dispatch', 'Dealers', 'Service'],
    [('Quote PDF for every enquiry', 42), ('Dispatch update to the buyer', 27), ('Service reminder after 6 months', 63)],
    """
<div class="top"><div><h1>Sales and dispatch</h1><small>October, compared with September</small></div><span class="live"><i></i>Live, synced just now</span></div>
<div class="kpis">
 <div class="kpi"><small>Quotes sent</small><b>42</b><span class="up">38 within 1 hour</span></div>
 <div class="kpi"><small>Quote to order</small><b>38%</b><span class="up">+6 pts</span></div>
 <div class="kpi"><small>Units dispatched</small><b>1,140</b><span class="up">+9%</span></div>
 <div class="kpi"><small>On-time delivery</small><b>96%</b><span class="dn">2 late</span></div>
</div>
<div class="row" style="grid-template-columns:1.6fr 1fr">
 <div class="card"><h3>Quote pipeline <small>this week</small></h3><table><tr><th>Buyer</th><th>Model</th><th>Qty</th><th>Value</th><th>Status</th></tr>
  <tr><td>Fresh Sip Beverages</td><td><span class="t"><img src="img/mfg-fridge.webp">HC-330, branded</span></td><td>50</td><td>₹14.2 L</td><td><span class="pill p-y">Quote sent</span> <span class="ai">AI agent</span></td></tr>
  <tr><td>Sagar Dairy</td><td><span class="t"><img src="img/mfg-fridge.webp">HC-450</span></td><td>24</td><td>₹8.9 L</td><td><span class="pill p-g">Order confirmed</span></td></tr>
  <tr><td>CityMart stores</td><td><span class="t"><img src="img/mfg-fridge.webp">HC-660D</span></td><td>12</td><td>₹7.6 L</td><td><span class="pill p-b">Negotiating</span></td></tr>
  <tr><td>Care Pharmacy chain</td><td><span class="t"><img src="img/mfg-fridge.webp">HC-220</span></td><td>30</td><td>₹6.1 L</td><td><span class="pill p-y">Quote sent</span> <span class="ai">AI agent</span></td></tr>
  <tr><td>Spice Route hotels</td><td><span class="t"><img src="img/mfg-fridge.webp">HC-1000D</span></td><td>6</td><td>₹5.4 L</td><td><span class="pill p-n">Sample visit</span></td></tr></table></div>
 <div class="card"><h3>Units dispatched by week</h3>
  <div style="display:flex;align-items:flex-end;gap:14px;height:170px;padding:0 6px">""" + ''.join(
      f'<div style="flex:1;text-align:center"><div style="height:{h}px;background:{c};border-radius:8px 8px 3px 3px"></div><small style="color:#6B7771">{w}</small></div>' for w, h, c in [
          ('W1', 104, '#BFD7EA'), ('W2', 122, '#BFD7EA'), ('W3', 96, '#BFD7EA'), ('W4', 140, '#BFD7EA'), ('W5', 152, '#0E6BA8')]) + """</div>
  <div style="display:flex;justify-content:space-between;margin-top:12px;font-size:13px"><span>Factory capacity used</span><b>81%</b></div><div class="bar" style="margin-top:6px"><i style="width:81%"></i></div></div>
</div>
<div class="row" style="grid-template-columns:1fr 1fr 1fr">
 <div class="card"><h3>Production line</h3>""" + ''.join(f'<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #F1F2EF"><span>{a}</span><span class="pill {c}">{b}</span></div>' for a, b, c in [
     ('Line 1 · HC-330', 'Running', 'p-g'), ('Line 2 · HC-450', 'Running', 'p-g'), ('Line 3 · HC-660D', 'Changeover', 'p-y'), ('Paint shop', 'Running', 'p-g')]) + """</div>
 <div class="card"><h3>AI insights</h3><div class="insight"><b>Summer orders</b> from beverage brands start 3 weeks earlier than last year. Raise HC-330 stock.</div><div class="insight"><b>5 quotes</b> have had no reply for 4 days. Follow-ups are drafted.</div></div>
 <div class="card"><h3>Live activity</h3><ul class="feed"><li><span>Quote PDF sent to Fresh Sip</span><small>1m</small></li><li><span>Truck 2 left with 48 units</span><small>22m</small></li><li><span>Service reminder sent to 11 dealers</span><small>1h</small></li></ul></div>
</div>""")

WEDDING = page('Shubh Utsav dashboard', '#B23A48', '#2A1014', 'U', 'Shubh Utsav',
    ['Overview', 'Weddings', 'Vendors', 'Guests', 'Payments'],
    [('Answer guest questions on WhatsApp', 412), ('RSVP reminders', 186), ('Vendor payment reminders', 14)],
    """
<div class="top"><div><h1>Kavya &amp; Arjun · wedding week</h1><small>12 to 15 February · 300 guests</small></div><span class="live"><i></i>Live, synced just now</span></div>
<div class="kpis">
 <div class="kpi"><small>RSVPs</small><b>286 / 300</b><span class="up">14 pending</span></div>
 <div class="kpi"><small>Rooms booked</small><b>64</b><span class="p-n pill">2 hotels</span></div>
 <div class="kpi"><small>Budget used</small><b>₹18.6 L</b><span class="p-n pill">of ₹24 L</span></div>
 <div class="kpi"><small>Guest chats</small><b>431</b><span class="up">412 by the AI agent</span></div>
</div>
<div class="row" style="grid-template-columns:2fr 1fr">
 <div class="card"><h3>The week <small>tap a function for the run sheet</small></h3>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">""" + ''.join(
      f'<div style="background:#FBF5F0;border-radius:12px;padding:12px"><div style="font-size:12px;color:#8A5A5A;font-weight:700">{d}</div><div style="font-size:17px;font-weight:800;margin:2px 0 8px">{f}</div>' + ''.join(
          f'<div style="display:flex;gap:6px;align-items:center;font-size:12.5px;padding:3px 0"><span class="pill {c}" style="padding:1px 6px">{s}</span>{t}</div>' for t, s, c in tasks) + '</div>'
      for d, f, tasks in [
          ('THU 12', 'Mehendi', [('Decor: marigold canopy', '✓', 'p-g'), ('Mehendi artists × 6', '✓', 'p-g'), ('Snacks for 120', '✓', 'p-g')]),
          ('FRI 13', 'Haldi · Sangeet', [('Stage and DJ', '✓', 'p-g'), ('Choreographer', '✓', 'p-g'), ('Dinner for 250', '!', 'p-y')]),
          ('SAT 14', 'Wedding', [('Mandap flowers', '✓', 'p-g'), ('Pandit confirmed', '✓', 'p-g'), ('Baraat band', '!', 'p-y')]),
          ('SUN 15', 'Reception', [('Banquet hall', '✓', 'p-g'), ('Photo booth', '·', 'p-n'), ('Return gifts', '!', 'p-y')])]) + """
  </div><img src="img/wed-table.webp" style="width:100%;height:150px;object-fit:cover;border-radius:12px;margin-top:12px"></div>
 <div class="card"><h3>Vendors</h3>""" + ''.join(f'<div style="display:grid;grid-template-columns:1fr auto;gap:2px 8px;padding:9px 0;border-bottom:1px solid #F1F2EF"><b style="font-size:13px">{v}</b><span class="pill {c}">{s}</span><small style="color:#6B7771">{d}</small></div>' for v, s, c, d in [
      ('Marigold decor', 'Paid 50%', 'p-y', 'Balance ₹1.2 L on 10 Feb'), ('Caterer', 'Paid', 'p-g', 'Tasting done'), ('Photographer', 'Paid 30%', 'p-y', '2 shooters, drone'), ('Band', 'Confirming', 'p-r', 'AI agent asked twice'), ('Transport', 'Paid', 'p-g', '6 cars, 2 buses')]) + """
  <div class="insight" style="margin-top:12px"><b>AI insight:</b> 9 of the 14 pending RSVPs opened the invite. A reminder is set for tonight.</div></div>
</div>""")

INTERIOR = page('Studio Aakar dashboard', '#8A6B4E', '#1F1A15', 'A', 'Studio Aakar',
    ['Overview', 'Projects', 'Site visits', 'Clients', 'Payments'],
    [('Weekly photo update to clients', 12), ('Book site visits from WhatsApp', 9), ('Payment reminders by stage', 6)],
    """
<div class="top"><div><h1>Projects</h1><small>12 active · 3 starting this month</small></div><span class="live"><i></i>Live, synced just now</span></div>
<div class="kpis">
 <div class="kpi"><small>New enquiries</small><b>23</b><span class="up">this week</span></div>
 <div class="kpi"><small>Site visits booked</small><b>9</b><span class="up">by the AI agent</span></div>
 <div class="kpi"><small>Payments due</small><b>₹6.8 L</b><span class="p-n pill">4 milestones</span></div>
 <div class="kpi"><small>On schedule</small><b>10 of 12</b><span class="dn">2 delayed</span></div>
</div>
<div class="row" style="grid-template-columns:1.7fr 1fr">
 <div class="card"><h3>Active projects</h3><table><tr><th>Project</th><th>Stage</th><th>Progress</th><th>Next</th></tr>""" + ''.join(
      f'<tr><td><span class="t"><img src="img/{img}.webp" style="width:56px;height:40px">{p}</span></td><td><span class="pill {c}">{st}</span></td><td style="width:150px"><div class="bar"><i style="width:{w}%"></i></div></td><td>{n}</td></tr>' for img, p, st, c, w, n in [
          ('int-living', 'Mehta residence, 3 BHK', 'Handover', 'p-g', 96, 'Final walk-through, Fri'), ('int-lounge', 'Shah villa, lounge', 'Upholstery', 'p-b', 72, 'Sofa delivery, Tue'),
          ('int-reading', 'Desai home, study', 'Carpentry', 'p-y', 48, 'Shelf polish sample'), ('arch-model', 'Three towers, housing', 'Approvals', 'p-n', 30, 'Submit drawings'),
          ('int-living', 'Patel clinic, reception', 'Design', 'p-b', 18, '3D views to client')]) + """</table></div>
 <div class="card"><h3>Site visits this week</h3>""" + ''.join(f'<div style="display:grid;grid-template-columns:54px 1fr;gap:10px;padding:9px 0;border-bottom:1px solid #F1F2EF"><div style="background:#F3EEE7;border-radius:10px;text-align:center;padding:6px 0"><small style="color:#8A6B4E;font-weight:700">{d}</small><b style="display:block;font-size:17px">{n}</b></div><div><b style="font-size:13px">{w}</b><small style="display:block;color:#6B7771">{t}</small></div></div>' for d, n, w, t in [
      ('SAT', 16, 'Nirav D., new 3 BHK', '11 am · booked by AI agent'), ('SAT', 16, 'Dr. Patel, clinic', '4 pm · measurements'), ('MON', 18, 'Joshi family, villa', '10 am · booked by AI agent')]) + """
  <div class="insight" style="margin-top:12px"><b>AI insight:</b> enquiries with photos book a visit 3x more often. The agent now asks for photos first.</div></div>
</div>""")

BOUTIQUE = page('Rangrez dashboard', '#9B4A52', '#1E1A1D', 'R', 'Rangrez',
    ['Overview', 'Orders', 'Trials', 'Alterations', 'Stock'],
    [('Send size chart when asked', 58), ('Book try-at-home from WhatsApp', 21), ('Tell customer when alteration is ready', 34)],
    """
<div class="top"><div><h1>Festive season</h1><small>October, compared with September</small></div><span class="live"><i></i>Live, synced just now</span></div>
<div class="kpis">
 <div class="kpi"><small>Orders</small><b>186</b><span class="up">+34%</span></div>
 <div class="kpi"><small>Revenue</small><b>₹5.9 L</b><span class="up">+28%</span></div>
 <div class="kpi"><small>Try-at-home trials</small><b>21</b><span class="up">17 bought</span></div>
 <div class="kpi"><small>Alterations due</small><b>12</b><span class="p-n pill">avg 2 days</span></div>
</div>
<div class="row" style="grid-template-columns:1.4fr 1fr">
 <div class="card"><h3>Best sellers <small>this week</small></h3><table><tr><th>Product</th><th>Sizes left</th><th>Sold</th><th>Stock</th></tr>""" + ''.join(
      f'<tr><td><span class="t"><img src="img/{img}.webp">{n}</span></td><td>{sz}</td><td>{sold}</td><td><span class="pill {c}">{st}</span></td></tr>' for img, n, sz, sold, c, st in [
          ('bou-corset', 'Embroidered corset top', 'S · M · L', 42, 'p-y', '6 left'), ('bou-shoe', 'Knit sneakers, sky blue', '5 · 6 · 7 · 8', 31, 'p-g', 'In stock'),
          ('bou-sunglasses', 'Mirror aviators', 'One size', 27, 'p-r', '2 left'), ('bou-watch', 'Chronograph watch, gold', 'One size', 12, 'p-g', 'In stock')]) + """</table>
  <div class="insight" style="margin-top:12px"><b>AI insight:</b> M is 48% of corset top sales. Reorder 20 in M before Diwali week.</div></div>
 <div class="card"><h3>Try-at-home today</h3>""" + ''.join(f'<div style="display:grid;grid-template-columns:54px 1fr auto;gap:10px;align-items:center;padding:9px 0;border-bottom:1px solid #F1F2EF"><img src="img/{img}.webp" style="width:54px;height:54px;object-fit:contain;background:#F6EEEB;border-radius:10px"><div><b style="font-size:13px">{w}</b><small style="display:block;color:#6B7771">{t}</small></div><span class="pill {c}">{s}</span></div>' for img, w, t, s, c in [
      ('bou-corset', 'Sneha P.', '6 pm · S, M, L', 'Booked by AI', 'p-g'), ('bou-shoe', 'Ritu K.', '7 pm · size 6, 7', 'On the way', 'p-b'), ('bou-watch', 'Aman S.', '8 pm · gift wrap', 'Packed', 'p-y')]) + """</div>
</div>
<div class="row" style="grid-template-columns:1.4fr 1fr">
 <div class="card"><h3>Alterations <small>tailor queue</small></h3><table><tr><th>Customer</th><th>Piece</th><th>Change</th><th>Ready</th></tr>""" + ''.join(f'<tr><td>{a}</td><td>{b}</td><td>{c}</td><td><span class="pill {d}">{e}</span></td></tr>' for a, b, c, d, e in [
      ('Kavya R.', 'Corset top, M', 'Take in waist 2 cm', 'p-g', 'Today, told on WhatsApp'), ('Nisha T.', 'Lehenga blouse', 'Shorten sleeves', 'p-y', 'Tomorrow'), ('Pooja M.', 'Corset top, L', 'Lengthen 3 cm', 'p-y', 'Tomorrow'), ('Divya S.', 'Kurta set', 'Hem trousers', 'p-n', 'Fri')]) + """</table></div>
 <div class="card"><h3>Live activity</h3><ul class="feed"><li><span>AI agent sent the size chart to Ishita</span><small>1m</small></li><li><span>UPI ₹3,499 matched to Sneha P.</span><small>6m</small></li><li><span>Try-at-home booked for Aman S.</span><small>18m</small></li><li><span>Alteration ready message sent to Kavya R.</span><small>40m</small></li></ul></div>
</div>""")

HANDICRAFT = page('Kala Haat dashboard', '#B8673F', '#2B2118', 'K', 'Kala Haat',
    ['Overview', 'Orders', 'Makers', 'Gifting', 'Shipping'],
    [('Photo of the piece before it ships', 64), ('Order split to the right maker', 64), ('Gifting quote within 1 hour', 9)],
    """
<div class="top"><div><h1>Workshop orders</h1><small>This month · 12 maker families</small></div><span class="live"><i></i>Live, synced just now</span></div>
<div class="kpis">
 <div class="kpi"><small>Orders</small><b>64</b><span class="up">+22%</span></div>
 <div class="kpi"><small>Paid to makers</small><b>₹1.8 L</b><span class="p-n pill">this month</span></div>
 <div class="kpi"><small>Gift hampers</small><b>340</b><span class="up">3 companies</span></div>
 <div class="kpi"><small>Ready to ship</small><b>18</b><span class="p-y pill">photos sent</span></div>
</div>
<div class="row" style="grid-template-columns:1fr 1.3fr">
 <div class="card"><h3>Makers this week</h3>""" + ''.join(f'<div style="display:grid;grid-template-columns:40px 1fr auto;gap:10px;align-items:center;padding:9px 0;border-bottom:1px solid #F1F2EF"><span style="width:40px;height:40px;border-radius:50%;background:#B8673F;color:#fff;display:grid;place-items:center;font-weight:700">{i}</span><div><b style="font-size:13px">{n}</b><small style="display:block;color:#6B7771">{c}</small></div><div style="width:110px"><div class="bar"><i style="width:{w}%"></i></div><small style="color:#6B7771">{d} of {t} done</small></div></div>' for i, n, c, w, d, t in [
      ('RP', 'Ramesh Prajapati', 'Terracotta matkas', 70, 14, 20), ('SK', 'Salma Kazi', 'Glazed vases', 45, 9, 20), ('MK', 'Mohan Kansara', 'Brass diyas, bowls', 88, 120, 136)]) + """
  <div class="insight" style="margin-top:12px"><b>AI insight:</b> brass diyas will be short by 16 for the office hamper order. Ask Mohan for 2 extra days?</div></div>
 <div class="card"><h3>Orders <small>with the photo sent to the buyer</small></h3><table><tr><th>Piece</th><th>Buyer</th><th>Maker</th><th>Status</th></tr>""" + ''.join(
      f'<tr><td><span class="t"><img src="img/{img}.webp">{p}</span></td><td>{b}</td><td>{m}</td><td><span class="pill {c}">{s}</span></td></tr>' for img, p, b, m, c, s in [
          ('craft-matka', 'Terracotta matka', 'Asha V.', 'Ramesh', 'p-y', 'Photo sent'), ('craft-vase', 'Indigo bottle vase', 'Studio Aakar', 'Salma', 'p-b', 'Glazing'),
          ('craft-bowl', 'Brass bowl × 4', 'Neel D.', 'Mohan', 'p-g', 'Shipped'), ('craft-diya', 'Diya set × 120', 'Riya S. (office)', 'Mohan', 'p-y', 'In progress'), ('craft-teacup', 'Painted teacup', 'Farah M.', 'Salma', 'p-g', 'Delivered')]) + """</table></div>
</div>
<div class="row" style="grid-template-columns:1.4fr 1fr">
 <div class="card"><h3>Gifting pipeline</h3><table><tr><th>Company</th><th>Hamper</th><th>Qty</th><th>Status</th></tr>""" + ''.join(f'<tr><td>{a}</td><td>{b}</td><td>{c}</td><td><span class="pill {d}">{e}</span></td></tr>' for a, b, c, d, e in [
      ('Riya S. (office)', 'Brass diya set and bowl', 120, 'p-y', 'Sample approved'), ('Patel Builders', 'Terracotta and brass', 150, 'p-b', 'Quote sent by AI'), ('Shubh Utsav', 'Wedding return gifts', 70, 'p-g', 'Paid 50%')]) + """</table></div>
 <div class="card"><h3>Live activity</h3><ul class="feed"><li><span>Photo of matka sent to Asha V.</span><small>3m</small></li><li><span>Order #212 assigned to Salma</span><small>11m</small></li><li><span>Gifting quote sent to Patel Builders</span><small>26m</small></li><li><span>₹9,600 paid to Mohan for diyas</span><small>1h</small></li></ul></div>
</div>""")

REALESTATE = page('Aangan Homes dashboard', '#3F4A1E', '#1D2410', 'A', 'Aangan Homes',
    ['Overview', 'Leads', 'Site visits', 'Inventory', 'Payments'],
    [('Floor plan PDF on enquiry', 148), ('Site visit booking from WhatsApp', 39), ('Payment reminders by milestone', 22)],
    """
<div class="top"><div><h1>Sales and site visits</h1><small>Aangan Homes · 56 homes in 2 towers</small></div><span class="live"><i></i>Live, synced just now</span></div>
<div class="kpis">
 <div class="kpi"><small>New leads</small><b>148</b><span class="up">this month</span></div>
 <div class="kpi"><small>Site visits</small><b>39</b><span class="up">31 by the AI agent</span></div>
 <div class="kpi"><small>Homes booked</small><b>38 of 56</b><span class="up">+5 this month</span></div>
 <div class="kpi"><small>Payments due</small><b>₹62 L</b><span class="p-n pill">7 milestones</span></div>
</div>
<div class="row" style="grid-template-columns:1fr 1.25fr">
 <div class="card"><h3>Units by floor <small>tower A</small></h3>
  <div style="display:grid;grid-template-columns:28px repeat(4,1fr);gap:5px;font-size:11.5px">""" + ''.join(
      f'<span style="color:#6B7771;align-self:center">{7-f}</span>' + ''.join(
          f'<span style="border-radius:6px;padding:7px 0;text-align:center;font-weight:700;{st}">{u}</span>'
          for u, st in [((f'{7-f}0{n}'), ('background:#E4F5EC;color:#0B7A47' if (f * 4 + n) % 3 else 'background:#3F4A1E;color:#fff') if (f * 4 + n) % 5 else 'background:#FFF3D6;color:#8A5A00') for n in range(1, 5)])
      for f in range(7)) + """</div>
  <div style="display:flex;gap:12px;margin-top:10px;font-size:12px;color:#6B7771"><span><b style="color:#3F4A1E">■</b> Booked</span><span><b style="color:#0B7A47">■</b> Available</span><span><b style="color:#8A5A00">■</b> On hold</span></div></div>
 <div class="card"><h3>Hot leads <small>sorted by the AI agent</small></h3><table><tr><th>Lead</th><th>Looking for</th><th>Budget</th><th>Next</th></tr>""" + ''.join(
      f'<tr><td>{n}</td><td>{w}</td><td>{b}</td><td><span class="pill {c}">{x}</span></td></tr>' for n, w, b, c, x in [
          ('Ajay R.', '2 BHK, east facing', '₹25–35 L', 'p-g', 'Visit Fri 11 am'), ('Pooja M.', '3 BHK, corner', '₹40 L+', 'p-y', 'Floor plan sent'),
          ('Kunal S.', 'Shop, ground floor', '₹22 L', 'p-b', 'Loan call'), ('Dev P.', '2 BHK, garden view', '₹30 L', 'p-g', 'Visit Sat 10 am'), ('Meera J.', '2 BHK', 'Under ₹25 L', 'p-n', 'Nurture')]) + """</table>
  <img src="img/building.webp" style="width:100%;height:120px;object-fit:contain;margin-top:10px">
  <div class="insight"><b>AI insight:</b> leads who see the floor plan PDF book a visit 2.4x more often.</div></div>
</div>""")

DASHES = {'dash-boutique': BOUTIQUE, 'dash-handicrafts': HANDICRAFT, 'dash-realestate': REALESTATE, 'dash-furniture': FURNITURE, 'dash-manufacturer': MANUFACTURER, 'dash-wedding': WEDDING, 'dash-interior': INTERIOR}

if __name__ == '__main__':
    for k, html in DASHES.items():
        with open(os.path.join(HERE, k + '.html'), 'w') as f:
            f.write(html)
    print('written:', ', '.join(DASHES))
