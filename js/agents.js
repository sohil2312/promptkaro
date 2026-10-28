/* PromptKaro — agents.js
   1. Agent console: the owner's WhatsApp on the left, the agent's live log on the right.
      Twelve scenarios play as event scripts; tabs switch, autoplay advances (with pause).
   2. Dashboards: four boards that tick through real-looking events once, while on screen.
   Without JS the first scenario and every dashboard show in their finished state. */

(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';
  var SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
  var inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
  function lang() { return document.documentElement.lang === 'gu' ? 'gu' : 'en'; }
  function tr(pair) { return pair ? (typeof pair === 'string' ? pair : pair[lang()]) : ''; }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  var UI = {
    handling: { en: 'AI agent is handling this chat', gu: 'AI એજન્ટ જવાબ આપે છે' },
    typing: { en: 'AI agent is typing…', gu: 'AI એજન્ટ ટાઇપ કરે છે…' },
    auto: { en: 'AI agent', gu: 'AI એજન્ટ' },
    working: { en: 'Working…', gu: 'કામ ચાલુ…' },
    done: { en: 'Done in {s}s', gu: '{s} સેકન્ડમાં પૂરું' },
    summary: { en: 'Handled in {s}s, no one had to pick up the phone', gu: '{s} સેકન્ડમાં પૂરું, કોઈએ ફોન ઉપાડવો ન પડ્યો' },
    pause: { en: 'Pause', gu: 'થોભાવો' },
    play: { en: 'Play all', gu: 'બધું ચલાવો' }
  };

  var T = {
    ai: 'AI',
    inv: { en: 'Inventory', gu: 'ઇન્વેન્ટરી' },
    price: { en: 'Price list', gu: 'ભાવ-પત્રક' },
    wa: 'WhatsApp',
    cal: { en: 'Calendar', gu: 'કેલેન્ડર' },
    rem: { en: 'Reminder', gu: 'રિમાઇન્ડર' },
    sheet: 'Google Sheet',
    pdf: 'PDF',
    ledger: { en: 'Ledger', gu: 'ખાતાવહી' },
    upi: 'UPI',
    bill: { en: 'Billing', gu: 'બિલિંગ' },
    google: 'Google',
    list: { en: 'Listings', gu: 'લિસ્ટિંગ' },
    crm: 'CRM',
    catalog: { en: 'Catalogue', gu: 'કેટલોગ' },
    quote: { en: 'Quote', gu: 'ભાવ' },
    photo: { en: 'Photos', gu: 'ફોટા' }
  };

  /* ---------- Scenarios (sample businesses and customers) ---------- */
  var SCENARIOS = [
    { biz: 'Shreeji Mobile', who: 'Ravi K.', events: [
      { t: 'in', at: '7:42 pm', text: { en: 'Is the 5G phone (128 GB) available? Price?', gu: '5G ફોન (128 GB) છે? ભાવ?' } },
      { t: 'log', ms: 420, tool: T.ai, text: { en: 'Read message: stock and price question', gu: 'મેસેજ વાંચ્યો: સ્ટોક અને ભાવનો સવાલ' } },
      { t: 'log', ms: 610, tool: T.inv, text: { en: 'Checked inventory: 3 in stock', gu: 'ઇન્વેન્ટરી ચેક કરી: 3 સ્ટોકમાં' } },
      { t: 'log', ms: 540, tool: T.price, text: { en: 'Fetched price ₹13,999 and the three colours', gu: 'ભાવ ₹13,999 અને ત્રણ રંગ મેળવ્યા' } },
      { t: 'out', at: '7:42 pm', text: { en: 'Yes, 3 in stock at ₹13,999, in teal, sand and graphite. Shall I keep one for you?', gu: 'હા, 3 સ્ટોકમાં છે, ₹13,999. ટીલ, સેન્ડ અને ગ્રેફાઇટ રંગમાં. તમારા માટે એક રાખી દઉં?' },
        buttons: [{ en: 'Keep one', gu: 'એક રાખો' }, { en: 'Show colours', gu: 'રંગ બતાવો' }] },
      { t: 'tap', i: 0, at: '7:43 pm' },
      { t: 'log', ms: 480, tool: T.inv, text: { en: 'Reserved 1 unit till 8 pm', gu: 'રાત્રે 8 સુધી 1 યુનિટ રાખ્યું' } },
      { t: 'log', ms: 350, tool: T.wa, text: { en: 'Told the owner', gu: 'માલિકને જાણ કરી' } },
      { t: 'out', at: '7:43 pm', text: { en: "Done. It's kept for you till 8 pm today.", gu: 'થઈ ગયું. આજે રાત્રે 8 સુધી તમારા માટે રાખ્યું છે.' } }
    ] },
    { biz: 'Shanti Clinic', who: 'Meena P.', events: [
      { t: 'in', at: '9:15 pm', text: { en: 'Can I see the doctor tomorrow evening?', gu: 'કાલે સાંજે ડૉક્ટરને બતાવી શકાય?' } },
      { t: 'log', ms: 400, tool: T.ai, text: { en: 'Read message: appointment request', gu: 'મેસેજ વાંચ્યો: એપોઇન્ટમેન્ટની વિનંતી' } },
      { t: 'log', ms: 650, tool: T.cal, text: { en: "Checked tomorrow's OPD: 6:30 pm free", gu: 'કાલની OPD ચેક કરી: સાંજે 6:30 ખાલી' } },
      { t: 'log', ms: 520, tool: T.cal, text: { en: 'Booked token 14', gu: 'ટોકન 14 બુક કર્યો' } },
      { t: 'log', ms: 380, tool: T.rem, text: { en: 'Set a reminder for 5:30 pm', gu: 'સાંજે 5:30નું રિમાઇન્ડર મૂક્યું' } },
      { t: 'out', at: '9:15 pm', text: { en: "Booked for tomorrow, 6:30 pm. Your token is 14. I'll remind you at 5:30.", gu: 'કાલે સાંજે 6:30 માટે બુક થયું. તમારો ટોકન 14 છે. 5:30 વાગ્યે યાદ કરાવીશ.' },
        buttons: [{ en: 'Directions', gu: 'રસ્તો' }, { en: 'Change time', gu: 'સમય બદલો' }] }
    ] },
    { biz: 'Vidya Classes', who: 'Kiran S.', events: [
      { t: 'in', at: '6:05 am', text: { en: 'Fees and timing for Std 10 Science?', gu: 'ધો. 10 સાયન્સની ફી અને સમય?' } },
      { t: 'log', ms: 410, tool: T.ai, text: { en: 'Read message: admission enquiry', gu: 'મેસેજ વાંચ્યો: એડમિશન પૂછપરછ' } },
      { t: 'log', ms: 560, tool: T.sheet, text: { en: 'Looked up the fee chart', gu: 'ફી ચાર્ટ જોયો' } },
      { t: 'log', ms: 330, tool: T.pdf, text: { en: 'Attached the brochure', gu: 'બ્રોશર જોડ્યું' } },
      { t: 'log', ms: 450, tool: T.sheet, text: { en: 'Added Kiran to the admissions list', gu: 'કિરણને એડમિશન લિસ્ટમાં ઉમેર્યા' } },
      { t: 'out', at: '6:05 am', cards: [{ kind: 'doc', title: 'Vidya Classes brochure.pdf', sub: { en: '4 pages', gu: '4 પાનાં' } }],
        text: { en: 'Std 10 Science: 7:00 am batch, ₹18,000 a year. Want a free demo class?', gu: 'ધો. 10 સાયન્સ: સવારે 7 ની બેચ, વર્ષની ₹18,000. મફત ડેમો ક્લાસ જોઈએ?' },
        buttons: [{ en: 'Book a demo class', gu: 'ડેમો ક્લાસ બુક કરો' }] },
      { t: 'tap', i: 0, at: '6:07 am' },
      { t: 'log', ms: 500, tool: T.cal, text: { en: 'Booked demo class: Monday, 7 am', gu: 'ડેમો ક્લાસ બુક: સોમવાર, સવારે 7' } },
      { t: 'out', at: '6:07 am', text: { en: 'See you on Monday at 7 am. Please bring a notebook.', gu: 'સોમવારે સવારે 7 વાગ્યે મળીએ. નોટબુક લેતા આવજો.' } }
    ] },
    { biz: 'Patel Hardware', who: 'Mehul Shah', events: [
      { t: 'log', ms: 520, tool: T.ledger, text: { en: 'Found ₹2,400 due from Mehul Shah', gu: 'મેહુલ શાહના ₹2,400 બાકી મળ્યા' } },
      { t: 'log', ms: 430, tool: T.upi, text: { en: 'Created a UPI payment link', gu: 'UPI પેમેન્ટ લિંક બનાવી' } },
      { t: 'out', at: '10:00 am', cards: [{ kind: 'pay', title: { en: 'Pay ₹2,400 by UPI', gu: '₹2,400 UPI થી ચૂકવો' }, sub: 'Patel Hardware' }],
        text: { en: 'Namaste Mehul bhai. ₹2,400 is due for October.', gu: 'નમસ્તે મેહુલભાઈ. ઓક્ટોબરના ₹2,400 બાકી છે.' } },
      { t: 'in', at: '10:12 am', text: { en: 'Paid just now 👍', gu: 'હમણાં જ ચૂકવ્યા 👍' } },
      { t: 'log', ms: 640, tool: T.upi, text: { en: 'Verified UPI payment of ₹2,400', gu: '₹2,400 નું UPI પેમેન્ટ ચકાસ્યું' } },
      { t: 'log', ms: 360, tool: T.ledger, text: { en: 'Marked paid in the ledger', gu: 'ખાતાવહીમાં જમા કર્યું' } },
      { t: 'out', at: '10:12 am', cards: [{ kind: 'doc', title: 'Receipt-October.pdf', sub: { en: '1 page', gu: '1 પાનું' } }],
        text: { en: 'Received, thank you! Your receipt is attached.', gu: 'મળી ગયા, આભાર! રસીદ જોડી છે.' } }
    ] },
    { biz: 'Annapurna Dining', who: 'Hetal D.', events: [
      { t: 'log', ms: 380, tool: T.bill, text: { en: 'Lunch bill closed for table 6', gu: 'ટેબલ 6 નું બપોરનું બિલ પૂરું થયું' } },
      { t: 'out', at: '2:40 pm', text: { en: 'Thank you for having lunch with us today! How was the thali?', gu: 'આજે અમારે ત્યાં જમવા બદલ આભાર! થાળી કેવી લાગી?' } },
      { t: 'in', at: '2:47 pm', text: { en: 'Very tasty, especially the kadhi!', gu: 'ખૂબ સરસ, ખાસ કરીને કઢી!' } },
      { t: 'log', ms: 450, tool: T.ai, text: { en: 'Read feedback: happy customer', gu: 'પ્રતિભાવ વાંચ્યો: ગ્રાહક ખુશ' } },
      { t: 'log', ms: 300, tool: T.google, text: { en: 'Picked the Google review link', gu: 'Google રિવ્યૂ લિંક પસંદ કરી' } },
      { t: 'out', at: '2:47 pm', text: { en: 'So glad you liked it! Would you leave us a short review?', gu: 'તમને ગમ્યું, ખૂબ આનંદ! એક નાનો રિવ્યૂ લખશો?' },
        buttons: [{ en: 'Write a review', gu: 'રિવ્યૂ લખો' }] }
    ] },
    { biz: 'Aangan Homes', who: 'Ajay R.', events: [
      { t: 'in', at: '11:30 pm', text: { en: 'Looking for a 2 BHK near the station', gu: 'સ્ટેશન પાસે 2 BHK જોઈએ છે' } },
      { t: 'log', ms: 420, tool: T.ai, text: { en: 'Read message: buying enquiry', gu: 'મેસેજ વાંચ્યો: ખરીદીની પૂછપરછ' } },
      { t: 'out', at: '11:30 pm', text: { en: "Happy to help. What's your budget?", gu: 'ચોક્કસ. તમારું બજેટ કેટલું છે?' },
        buttons: [{ en: 'Under ₹25 lakh', gu: '₹25 લાખથી ઓછું' }, { en: '₹25–35 lakh', gu: '₹25–35 લાખ' }, { en: 'Above ₹35 lakh', gu: '₹35 લાખથી વધુ' }] },
      { t: 'tap', i: 1, at: '11:31 pm' },
      { t: 'log', ms: 580, tool: T.list, text: { en: 'Matched 2 listings in budget', gu: 'બજેટમાં 2 લિસ્ટિંગ મળ્યા' } },
      { t: 'log', ms: 460, tool: T.crm, text: { en: 'Marked as a hot lead and alerted the owner', gu: 'હોટ લીડ ગણી માલિકને જાણ કરી' } },
      { t: 'out', at: '11:31 pm', cards: [
          { kind: 'listing', title: { en: '2 BHK, Aangan Homes, east facing', gu: '2 BHK, આંગણ હોમ્સ, પૂર્વમુખી' }, sub: { en: '₹28 lakh', gu: '₹28 લાખ' } },
          { kind: 'listing', title: { en: '2 BHK, Station Road, garden view', gu: '2 BHK, સ્ટેશન રોડ, બગીચા તરફ' }, sub: { en: '₹32 lakh', gu: '₹32 લાખ' } }],
        text: { en: 'Here are 2 that fit. Shall I fix a site visit?', gu: 'આ 2 બજેટમાં છે. સાઇટ વિઝિટ ગોઠવું?' } }
    ] },
    { biz: 'Sheesham House', who: 'Priya M.', events: [
      { t: 'in', at: '8:12 pm', text: { en: 'Can the blue velvet sofa be made 2.1 m long?', gu: 'વાદળી વેલ્વેટ સોફા 2.1 મીટર લાંબો બનાવી શકો?' } },
      { t: 'log', ms: 420, tool: T.ai, text: { en: 'Read message: custom size request', gu: 'મેસેજ વાંચ્યો: કસ્ટમ સાઇઝની વિનંતી' } },
      { t: 'log', ms: 600, tool: T.catalog, text: { en: 'Found Curve velvet sofa, sizes 1.8 to 2.6 m', gu: 'કર્વ વેલ્વેટ સોફા મળ્યો, 1.8 થી 2.6 મી' } },
      { t: 'log', ms: 520, tool: T.inv, text: { en: 'Checked blue velvet stock: 14 m', gu: 'વાદળી વેલ્વેટનો સ્ટોક: 14 મી' } },
      { t: 'out', at: '8:12 pm', cards: [{ img: '/assets/img/fur-velvet-card.webp', title: { en: 'Curve velvet sofa, 2.1 m', gu: 'કર્વ વેલ્વેટ સોફા, 2.1 મી' }, sub: { en: '₹39,500 · ready in 12 days', gu: '₹39,500 · 12 દિવસમાં તૈયાર' } }],
        text: { en: 'Yes. 2.1 m in the same blue is ₹39,500. Send a photo of your room and I will show it in place.', gu: 'હા. એ જ વાદળીમાં 2.1 મી ₹39,500. રૂમનો ફોટો મોકલો, સોફા ગોઠવીને બતાવીશ.' },
        buttons: [{ en: 'Send room photo', gu: 'રૂમનો ફોટો મોકલો' }, { en: 'Book showroom visit', gu: 'શોરૂમ વિઝિટ' }] }
    ] },
    { biz: 'Studio Aakar', who: 'Nirav D.', events: [
      { t: 'in', at: '4:05 pm', text: { en: 'We want our new 3 BHK designed. When can you visit?', gu: 'નવા 3 BHKનું ઇન્ટિરિયર કરાવવું છે. ક્યારે આવી શકો?' } },
      { t: 'log', ms: 420, tool: T.ai, text: { en: 'Read message: interior project lead', gu: 'મેસેજ વાંચ્યો: ઇન્ટિરિયર પ્રોજેક્ટની લીડ' } },
      { t: 'log', ms: 640, tool: T.cal, text: { en: "Found Saturday 11 am in the designer's calendar", gu: 'ડિઝાઇનરના કેલેન્ડરમાં શનિવાર 11 વાગ્યે ખાલી' } },
      { t: 'log', ms: 380, tool: T.crm, text: { en: 'Added Nirav as a new project', gu: 'નીરવને નવા પ્રોજેક્ટ તરીકે ઉમેર્યા' } },
      { t: 'out', at: '4:05 pm', cards: [{ img: '/assets/img/int-living-card.webp', title: { en: 'A recent living room', gu: 'તાજેતરનો લિવિંગ રૂમ' }, sub: { en: 'Mehta residence, 3 BHK', gu: 'મહેતા નિવાસ, 3 BHK' } }],
        text: { en: 'Our designer can visit on Saturday at 11 am. Please share the floor plan before that.', gu: 'અમારા ડિઝાઇનર શનિવારે 11 વાગ્યે આવી શકે. તે પહેલાં ફ્લોર પ્લાન મોકલજો.' },
        buttons: [{ en: 'Confirm Saturday', gu: 'શનિવાર નક્કી' }, { en: 'Other day', gu: 'બીજો દિવસ' }] }
    ] },
    { biz: 'Rangrez Boutique', who: 'Sneha P.', events: [
      { t: 'in', at: '9:40 pm', text: { en: 'Is the embroidered corset top there in M? Can I try it first?', gu: 'ભરતકામવાળું કોર્સેટ ટોપ M માં છે? પહેલાં ટ્રાય કરી શકું?' } },
      { t: 'log', ms: 400, tool: T.ai, text: { en: 'Read message: size and trial request', gu: 'મેસેજ વાંચ્યો: સાઇઝ અને ટ્રાયલ' } },
      { t: 'log', ms: 560, tool: T.inv, text: { en: 'Checked sizes: S, M and L in stock', gu: 'સાઇઝ ચેક કરી: S, M અને L સ્ટોકમાં' } },
      { t: 'log', ms: 480, tool: T.cal, text: { en: 'Found a try-at-home slot tomorrow, 6 pm', gu: 'કાલે સાંજે 6 નો ઘરે ટ્રાયલનો સમય મળ્યો' } },
      { t: 'out', at: '9:40 pm', cards: [{ img: '/assets/img/bou-corset-card.webp', title: { en: 'Embroidered corset top', gu: 'ભરતકામવાળું કોર્સેટ ટોપ' }, sub: '₹3,499' }],
        text: { en: 'M is in stock. We can bring S, M and L tomorrow at 6 pm. Alterations are free.', gu: 'M સ્ટોકમાં છે. કાલે સાંજે 6 વાગ્યે S, M અને L લઈ આવીએ. ઓલ્ટરેશન મફત.' },
        buttons: [{ en: 'Book the trial', gu: 'ટ્રાયલ બુક કરો' }] }
    ] },
    { biz: 'Himal Cooling Systems', who: 'Fresh Sip Beverages', events: [
      { t: 'in', at: '10:08 am', text: { en: 'Need a quote: 50 visi coolers, 330 L, with our logo. Delivery to two depots.', gu: 'ભાવ જોઈએ: 50 વિઝી કૂલર, 330 લિ, અમારા લોગો સાથે. બે ડેપોમાં ડિલિવરી.' } },
      { t: 'log', ms: 420, tool: T.ai, text: { en: 'Read message: bulk order enquiry', gu: 'મેસેજ વાંચ્યો: બલ્ક ઓર્ડર પૂછપરછ' } },
      { t: 'log', ms: 520, tool: T.price, text: { en: 'Applied the 50-unit price for HC-330', gu: 'HC-330 માટે 50 નંગનો ભાવ લગાવ્યો' } },
      { t: 'log', ms: 480, tool: T.quote, text: { en: 'Added branding and two-depot freight', gu: 'બ્રાન્ડિંગ અને બે ડેપોનું ભાડું ઉમેર્યું' } },
      { t: 'log', ms: 360, tool: T.pdf, text: { en: 'Created the quote PDF', gu: 'ક્વોટની PDF બનાવી' } },
      { t: 'log', ms: 300, tool: T.crm, text: { en: 'Alerted the sales head', gu: 'સેલ્સ હેડને જાણ કરી' } },
      { t: 'out', at: '10:09 am', cards: [{ kind: 'doc', title: 'Quote-FreshSip-HC330.pdf', sub: { en: '2 pages', gu: '2 પાનાં' } }],
        text: { en: '₹28,400 each for 50, branded, delivered to both depots in 3 weeks. The quote is attached.', gu: '50 માટે બ્રાન્ડિંગ સાથે એક નંગ ₹28,400, 3 અઠવાડિયામાં બંને ડેપો પર. ક્વોટ જોડ્યો છે.' },
        buttons: [{ en: 'Confirm order', gu: 'ઓર્ડર નક્કી' }, { en: 'Talk to sales', gu: 'સેલ્સ સાથે વાત' }] }
    ] },
    { biz: 'Shubh Utsav', who: 'Kavya & Arjun', events: [
      { t: 'in', at: '9:12 pm', text: { en: 'Our wedding is on 14 Feb, about 300 guests. Are you free?', gu: '14 ફેબ્રુઆરીએ લગ્ન છે, લગભગ 300 મહેમાન. તમે ફ્રી છો?' } },
      { t: 'log', ms: 420, tool: T.ai, text: { en: 'Read message: wedding enquiry', gu: 'મેસેજ વાંચ્યો: લગ્નની પૂછપરછ' } },
      { t: 'log', ms: 600, tool: T.cal, text: { en: 'Checked 12 to 15 Feb: free', gu: '12 થી 15 ફેબ્રુઆરી ચેક કર્યું: ખાલી' } },
      { t: 'log', ms: 480, tool: T.photo, text: { en: 'Picked 3 decor plans for 300 guests', gu: '300 મહેમાન માટે 3 સજાવટ પ્લાન પસંદ કર્યા' } },
      { t: 'out', at: '9:12 pm', cards: [{ img: '/assets/img/wed-table-card.webp', title: { en: 'Marigold and candle decor', gu: 'ગલગોટા અને મીણબત્તીની સજાવટ' }, sub: { en: 'Plan 1 of 3', gu: '3 માંથી પ્લાન 1' } }],
        text: { en: '14 Feb is open. Here is the first of three decor plans. Shall we meet this week?', gu: '14 ફેબ્રુઆરી ખાલી છે. ત્રણમાંથી પહેલો સજાવટ પ્લાન આ રહ્યો. આ અઠવાડિયે મળીએ?' },
        buttons: [{ en: 'See all 3 plans', gu: 'ત્રણેય પ્લાન' }, { en: 'Fix a meeting', gu: 'મીટિંગ ગોઠવો' }] }
    ] },
    { biz: 'Kala Haat', who: 'Riya S.', events: [
      { t: 'in', at: '5:30 pm', text: { en: 'Need 120 Diwali hampers for our office. What can you do?', gu: 'ઓફિસ માટે 120 દિવાળી હેમ્પર જોઈએ છે. શું કરી શકો?' } },
      { t: 'log', ms: 420, tool: T.ai, text: { en: 'Read message: corporate gifting', gu: 'મેસેજ વાંચ્યો: કોર્પોરેટ ગિફ્ટિંગ' } },
      { t: 'log', ms: 560, tool: T.inv, text: { en: 'Checked makers: 140 diya sets possible by 25 Oct', gu: 'કારીગરો ચેક કર્યા: 25 ઓક્ટો સુધીમાં 140 દીવા સેટ શક્ય' } },
      { t: 'log', ms: 420, tool: T.price, text: { en: 'Priced hamper: brass diya set and bowl', gu: 'હેમ્પરનો ભાવ: પિત્તળના દીવા અને વાટકો' } },
      { t: 'out', at: '5:31 pm', cards: [{ img: '/assets/img/craft-hero-card.webp', title: { en: 'Brass and terracotta hamper', gu: 'પિત્તળ અને માટીનું હેમ્પર' }, sub: { en: '₹1,850 each for 120', gu: '120 માટે એક ₹1,850' } }],
        text: { en: '120 hampers can be ready by 25 Oct, with your card inside. Shall I send a sample first?', gu: '25 ઓક્ટો સુધીમાં 120 હેમ્પર તૈયાર, અંદર તમારું કાર્ડ. પહેલાં નમૂનો મોકલું?' },
        buttons: [{ en: 'Send a sample', gu: 'નમૂનો મોકલો' }] }
    ] }
  ];

  /* ============================== Agent console ============================== */
  var app = document.getElementById('agentsApp');
  if (app) initConsole();

  function initConsole() {
    var tabs = Array.prototype.slice.call(app.querySelectorAll('[role="tab"]'));
    var stage = document.getElementById('agentStage');
    var chat = document.getElementById('agentChat');
    var log = document.getElementById('agentLog');
    var chatBox = chat.parentNode;
    var avatar = document.getElementById('agentAvatar');
    var customer = document.getElementById('agentCustomer');
    var biz = document.getElementById('agentBiz');
    var status = document.getElementById('agentStatus');
    var state = document.getElementById('agentState');
    var pauseBtn = document.getElementById('agentPause');

    var current = 0, runId = 0, autoplay = !reduce.matches, visible = false, nextTimer = 0;
    var statusKey = 'handling', stateKind = 'done', stateSecs = '0.0';

    function wait(ms, id) {
      return new Promise(function (resolve, reject) {
        setTimeout(function () { id === runId ? resolve() : reject('cancelled'); }, ms);
      });
    }
    function setStatus(key) { statusKey = key; status.textContent = tr(UI[key]); }
    function setState(kind, secs) {
      stateKind = kind; stateSecs = secs || stateSecs;
      state.classList.toggle('is-working', kind === 'working');
      state.textContent = kind === 'working' ? tr(UI.working) : tr(UI.done).replace('{s}', stateSecs);
    }

    // Append to the bottom-anchored chat; older messages slide up (FLIP).
    function push(list, node, animate) {
      var kids = Array.prototype.slice.call(list.children);
      var before = kids.map(function (k) { return k.getBoundingClientRect().top; });
      list.appendChild(node);
      while (list === chat && list.children.length > 12) list.removeChild(list.firstElementChild);
      if (!animate) return;
      kids.forEach(function (k, i) {
        if (!k.isConnected) return;
        var d = before[i] - k.getBoundingClientRect().top;
        if (d) k.animate([{ transform: 'translateY(' + d + 'px)' }, { transform: 'none' }], { duration: 320, easing: EASE_OUT });
      });
      var origin = node.classList.contains('msg-out') ? '100% 100%' : node.classList.contains('msg-in') ? '0% 100%' : '0% 50%';
      node.style.transformOrigin = origin;
      node.animate([{ opacity: 0, transform: 'translateY(8px) scale(0.96)' }, { opacity: 1, transform: 'none' }],
        { duration: 300, easing: EASE_OUT });
    }

    function message(ev, dir) {
      var li = el('li', 'msg msg-' + dir);
      if (dir === 'out') li.appendChild(el('span', 'msg-agent', tr(UI.auto)));
      (ev.cards || []).forEach(function (c) {
        var card = el('span', 'msg-card' + (c.kind === 'pay' ? ' msg-pay' : '') + (c.img ? ' msg-photo' : ''));
        if (c.img) {
          var im = el('img'); im.src = c.img; im.alt = ''; im.width = 480; im.height = 320; im.decoding = 'async';
          card.appendChild(im);
        }
        card.appendChild(el('b', null, tr(c.title)));
        card.appendChild(el('small', null, tr(c.sub)));
        li.appendChild(card);
      });
      li.appendChild(el('p', null, tr(ev.text)));
      if (ev.buttons) {
        var row = el('span', 'msg-buttons');
        ev.buttons.forEach(function (b) { row.appendChild(el('span', null, tr(b))); });
        li.appendChild(row);
      }
      li.appendChild(el('span', 'msg-meta', ev.at || ''));
      return li;
    }

    function logStep(ev) {
      var li = el('li', 'log-step is-working');
      li.appendChild(el('span', 'log-icon'));
      li.appendChild(el('span', 'log-text', tr(ev.text)));
      li.appendChild(el('span', 'log-tool', tr(ev.tool)));
      return li;
    }
    function finishStep(li, ms) {
      li.classList.remove('is-working');
      li.classList.add('is-done');
      var tool = li.querySelector('.log-tool');
      tool.textContent = tool.textContent + '  ' + (ms / 1000).toFixed(1) + 's';
    }

    function header(i) {
      var s = SCENARIOS[i];
      avatar.textContent = s.who.charAt(0);
      customer.textContent = s.who;
      biz.textContent = s.biz;
      stage.setAttribute('aria-labelledby', tabs[i].id);
    }

    function totalSecs(s) {
      var ms = 0;
      s.events.forEach(function (e) { if (e.t === 'log') ms += e.ms; if (e.t === 'out') ms += 700; });
      return (ms / 1000).toFixed(1);
    }

    function summary(s) {
      var li = el('li', 'log-summary', tr(UI.summary).replace('{s}', totalSecs(s)));
      return li;
    }

    // The finished conversation, instantly (reduced motion, language switch).
    function renderFinal(i) {
      runId++;
      clearTimeout(nextTimer);
      var s = SCENARIOS[i];
      header(i);
      chat.textContent = ''; log.textContent = '';
      var lastOut = null;
      s.events.forEach(function (ev) {
        if (ev.t === 'in') chat.appendChild(message(ev, 'in'));
        else if (ev.t === 'out') { lastOut = message(ev, 'out'); chat.appendChild(lastOut); }
        else if (ev.t === 'tap') {
          var picked = lastOut.querySelectorAll('.msg-buttons span')[ev.i];
          picked.classList.add('is-pressed');
          chat.appendChild(message({ text: { en: picked.textContent, gu: picked.textContent }, at: ev.at }, 'in'));
        } else if (ev.t === 'log') { var st = logStep(ev); log.appendChild(st); finishStep(st, ev.ms); }
      });
      log.appendChild(summary(s));
      setStatus('handling');
      setState('done', totalSecs(s));
    }

    function tapButton(btn, id) {
      if (reduce.matches) { btn.classList.add('is-pressed'); return Promise.resolve(); }
      var c = chatBox.getBoundingClientRect(), t = btn.getBoundingClientRect();
      var dot = el('span', 'tap');
      dot.setAttribute('aria-hidden', 'true');
      dot.style.left = (t.left - c.left + t.width / 2) + 'px';
      dot.style.top = (t.top - c.top + t.height / 2) + 'px';
      chatBox.appendChild(dot);
      return dot.animate([
        { transform: 'translate(40px, 50px)', opacity: 0 },
        { transform: 'none', opacity: 1 }
      ], { duration: 500, easing: EASE_OUT, fill: 'forwards' }).finished.then(function () {
        btn.classList.add('is-pressed');
        return dot.animate([{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(0.75)', opacity: 1, offset: 0.35 }, { transform: 'scale(1.5)', opacity: 0 }],
          { duration: 420, easing: 'ease-out', fill: 'forwards' }).finished;
      }).then(function () { dot.remove(); return wait(200, id); });
    }

    function play(i) {
      clearTimeout(nextTimer);
      var id = ++runId;
      current = i;
      var s = SCENARIOS[i];
      header(i);
      chat.textContent = ''; log.textContent = '';
      chatBox.querySelectorAll('.tap').forEach(function (d) { d.remove(); });
      setStatus('handling');
      setState('working');

      var lastOut = null;
      var chain = wait(450, id);
      s.events.forEach(function (ev) {
        chain = chain.then(function () {
          if (ev.t === 'in') {
            push(chat, message(ev, 'in'), true);
            return wait(650, id);
          }
          if (ev.t === 'log') {
            var st = logStep(ev);
            push(log, st, true);
            return wait(ev.ms + 180, id).then(function () { finishStep(st, ev.ms); return wait(160, id); });
          }
          if (ev.t === 'out') {
            setStatus('typing');
            var dots = el('li', 'msg msg-typing');
            dots.appendChild(el('span')); dots.appendChild(el('span')); dots.appendChild(el('span'));
            push(chat, dots, true);
            return wait(800, id).then(function () {
              dots.remove();
              lastOut = message(ev, 'out');
              push(chat, lastOut, true);
              setStatus('handling');
              return wait(ev.buttons ? 900 : 700, id);
            });
          }
          if (ev.t === 'tap') {
            var btn = lastOut.querySelectorAll('.msg-buttons span')[ev.i];
            return tapButton(btn, id).then(function () {
              push(chat, message({ text: { en: btn.textContent, gu: btn.textContent }, at: ev.at }, 'in'), true);
              return wait(600, id);
            });
          }
        });
      });
      chain.then(function () {
        push(log, summary(s), true);
        setState('done', totalSecs(s));
        scheduleNext();
      }, function () { /* cancelled by a newer run */ });
    }

    function scheduleNext() {
      clearTimeout(nextTimer);
      if (!autoplay || !visible) return;
      nextTimer = setTimeout(function () { select((current + 1) % SCENARIOS.length, false, true); }, 3200);
    }

    function select(i, focus, fromAuto) {
      tabs.forEach(function (t, k) {
        t.setAttribute('aria-selected', k === i ? 'true' : 'false');
        t.tabIndex = k === i ? 0 : -1;
      });
      if (focus) tabs[i].focus();
      if (fromAuto && tabs[i].scrollIntoView && visible) {
        var bar = tabs[i].parentNode;
        bar.scrollTo({ left: tabs[i].offsetLeft - 16, behavior: reduce.matches ? 'auto' : 'smooth' });
      }
      if (reduce.matches) { current = i; renderFinal(i); } else play(i);
    }

    function setAutoplay(on) {
      autoplay = on;
      pauseBtn.textContent = tr(on ? UI.pause : UI.play);
      pauseBtn.setAttribute('aria-pressed', on ? 'false' : 'true');
      if (on) {
        if (stateKind === 'done') select((current + 1) % SCENARIOS.length, false, true);
      } else clearTimeout(nextTimer);
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { setAutoplay(false); select(i, false); });
      tab.addEventListener('keydown', function (e) {
        var to = null;
        if (e.key === 'ArrowRight') to = (i + 1) % tabs.length;
        else if (e.key === 'ArrowLeft') to = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === 'Home') to = 0;
        else if (e.key === 'End') to = tabs.length - 1;
        if (to === null) return;
        e.preventDefault();
        setAutoplay(false);
        select(to, true);
      });
    });

    if (!reduce.matches) {
      pauseBtn.hidden = false;
      pauseBtn.addEventListener('click', function () { setAutoplay(!autoplay); });
    }

    document.addEventListener('pk:lang', function () {
      renderFinal(current);
      if (pauseBtn) pauseBtn.textContent = tr(autoplay ? UI.pause : UI.play);
      scheduleNext();
    });

    // Start when the console is on screen; hold autoplay while it isn't.
    renderFinal(0);
    if ('IntersectionObserver' in window) {
      var started = false;
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible && !started) { started = true; if (!reduce.matches) play(0); }
        else if (visible && stateKind === 'done') scheduleNext();
        else if (!visible) clearTimeout(nextTimer);
      }, { threshold: 0.4 }).observe(stage);
    }
  }

  /* ============================== Bot vs AI agent ============================== */
  var compare = document.getElementById('compare');
  if (compare) initCompare();

  function initCompare() {
    var replay = document.getElementById('compareReplay');
    var bot = compare.querySelector('[data-script="bot"]');
    var agent = compare.querySelector('[data-script="agent"]');
    var botOutcome = compare.querySelector('.compare-bot .cmp-outcome');
    var agentOutcome = compare.querySelector('.compare-agent .cmp-outcome');
    // Same message, two timelines. The agent is done while the bot is still on its menu.
    var BOT = [400, 1500, 2900, 3700, 5200, 6100];
    var AGENT = [400, 1050, 1750, 2450, 3200];
    var timers = [];

    function pop(node) {
      node.classList.add('is-in');
      if (reduce.matches) return;
      var out = node.classList.contains('msg-out');
      node.style.transformOrigin = out ? '100% 100%' : '0% 100%';
      node.animate([{ opacity: 0, transform: 'translateY(8px) scale(0.96)' }, { opacity: 1, transform: 'none' }], { duration: 300, easing: EASE_OUT });
    }
    function at(ms, fn) { timers.push(setTimeout(fn, ms)); }

    function play() {
      timers.forEach(clearTimeout); timers = [];
      if (replay) replay.hidden = true;
      compare.classList.add('is-armed');
      compare.querySelectorAll('.is-in, .is-working').forEach(function (n) { n.classList.remove('is-in', 'is-working'); });
      var b = bot.querySelectorAll('[data-c]');
      var a = agent.querySelectorAll('[data-c]');
      BOT.forEach(function (ms, i) { at(ms, function () { pop(b[i]); }); });
      at(6800, function () { pop(botOutcome); });
      AGENT.forEach(function (ms, i) {
        var node = a[i];
        at(ms, function () {
          if (node.classList.contains('wa-agent')) {
            node.classList.add('is-working');
            pop(node);
            at(560, function () { node.classList.remove('is-working'); });
          } else pop(node);
        });
      });
      at(3800, function () { pop(agentOutcome); });
      at(7400, function () {
        compare.classList.remove('is-armed');
        compare.querySelectorAll('.is-in').forEach(function (n) { n.classList.remove('is-in'); });
        if (replay) replay.hidden = false;
      });
    }

    if (replay) replay.addEventListener('click', play);
    if (reduce.matches || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      play();
    }, { threshold: 0.35 });
    io.observe(compare);
  }

  /* ============================== Automated dashboard ============================== */
  var db = document.getElementById('dashboard');
  if (db) initDashboard();

  function initDashboard() {
    var CH = { WhatsApp: { en: 'WhatsApp', gu: 'WhatsApp', cls: 'whatsapp' }, Website: { en: 'Website', gu: 'વેબસાઇટ', cls: 'website' }, Walkin: { en: 'Walk-in', gu: 'દુકાનમાં', cls: 'walkin' } };
    var PAID = { en: 'Paid, UPI', gu: 'ચૂકવ્યા, UPI' }, CASH = { en: 'Cash', gu: 'રોકડ' }, CARD = { en: 'Card', gu: 'કાર્ડ' };
    var ST = { packed: { en: 'Packed', gu: 'પેક' }, ready: { en: 'Ready for pickup', gu: 'લેવા માટે તૈયાર' }, done: { en: 'Delivered', gu: 'પહોંચાડ્યું' }, handed: { en: 'Handed over', gu: 'આપી દીધું' } };
    function item(img, en, gu) { return { img: img, name: { en: en, gu: gu } }; }
    var OLD = [
      { no: 1038, who: 'Ajay R.', item: item('watch', 'Smart watch', 'સ્માર્ટ વોચ'), amt: 2499, ch: 'WhatsApp', agent: true, pay: PAID, st: 'done' },
      { no: 1037, who: 'Nisha T.', item: item('phone', '5G phone, 256 GB', '5G ફોન, 256 GB'), amt: 16499, ch: 'Walkin', agent: false, pay: CARD, st: 'handed' },
      { no: 1036, who: 'Arjun M.', item: item('charger', 'Charger 33W', 'ચાર્જર 33W'), amt: 899, ch: 'Website', agent: false, pay: PAID, st: 'done' },
      { no: 1035, who: 'Fatima B.', item: item('earbuds', 'Earbuds', 'ઇયરબડ્સ'), amt: 1299, ch: 'WhatsApp', agent: true, pay: PAID, st: 'done' }
    ];
    // Four orders arrive live; the numbers add up to the static HTML.
    var LIVE = [
      { no: 1039, who: 'Ravi K.', item: item('earbuds', 'Earbuds', 'ઇયરબડ્સ'), amt: 1299, ch: 'WhatsApp', agent: true, pay: PAID, st: 'packed', chat: true, receipt: true,
        feed: [{ en: 'AI agent took an earbuds order from Ravi K.', gu: 'AI એજન્ટે રવિ કે.નો ઇયરબડ્સ ઓર્ડર લીધો' }, { en: 'Earbuds down to 2, reorder sent', gu: 'ઇયરબડ્સ 2 બાકી, ફરી ઓર્ડર મોકલ્યો' }], earbuds: 2 },
      { no: 1040, who: 'Meena P.', item: item('charger', 'Charger 33W', 'ચાર્જર 33W'), amt: 899, ch: 'Walkin', agent: false, pay: CASH, st: 'handed',
        feed: [{ en: 'Billing added a walk-in sale: Charger 33W', gu: 'બિલિંગે દુકાનનું વેચાણ ઉમેર્યું: ચાર્જર 33W' }] },
      { no: 1041, who: 'Kiran S.', item: item('phone', '5G phone, 128 GB', '5G ફોન, 128 GB'), amt: 13999, ch: 'WhatsApp', agent: true, pay: PAID, st: 'ready', chat: true, receipt: true,
        feed: [{ en: 'AI agent kept a 5G phone for Kiran S.', gu: 'AI એજન્ટે કિરણ એસ. માટે 5G ફોન રાખ્યો' }] },
      { no: 1042, who: 'Hetal D.', item: item('watch', 'Watch strap', 'ઘડિયાળનો પટ્ટો'), amt: 299, ch: 'Website', agent: false, pay: PAID, st: 'packed', receipt: true,
        feed: [{ en: 'Receipt sent to Hetal D. on WhatsApp', gu: 'હેતલ ડી.ને WhatsApp પર રસીદ મોકલી' }] }
    ];
    var OLD_FEED = [{ en: 'Review request sent to Ajay R.', gu: 'અજય આર.ને રિવ્યૂ માટે મેસેજ મોકલ્યો' }, { en: 'Receipt sent to Fatima B. on WhatsApp', gu: 'ફાતિમા બી.ને WhatsApp પર રસીદ મોકલી' }];
    var TODAY = [0, 2100, 5200, 8800, 12400, 17900, 21000, 26300, 29800, 32124, 33423, 34322, 48321, 48620];
    var BASE = { revenue: 32124, orders: 19, chats: 59, agent: 52, receipts: 20, reorders: 0, earbuds: 3 };

    var tbody = document.getElementById('dbOrders');
    var feedList = document.getElementById('dbFeed');
    var line = document.getElementById('dbLine'), area = document.getElementById('dbArea'), dot = document.getElementById('dbDot');
    var kRev = document.getElementById('kpiRevenue'), kOrd = document.getElementById('kpiOrders'), kChat = document.getElementById('kpiChats'), kAgent = document.getElementById('kpiAgent');
    var budsRow = db.querySelector('[data-sku="earbuds"]'), reorder = document.getElementById('dbReorder');
    var rReceipt = db.querySelector('[data-rule="receipt"]'), rReorder = db.querySelector('[data-rule="reorder"]');
    var step = LIVE.length; // finished state first

    function path(n) {
      var pts = TODAY.slice(0, n).map(function (v, i) { return [i / 13 * 600, 180 - 8 - v / 50000 * 160]; });
      var d = pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
      return { d: d, area: d + ' L' + pts[pts.length - 1][0].toFixed(1) + ' 180 L0 180 Z', last: pts[pts.length - 1] };
    }
    function row(o) {
      var r = el('tr'); r.dataset.order = o.no;
      r.appendChild(el('td', 'num', '#' + o.no));
      r.appendChild(el('td', null, o.who));
      var itd = el('td'), wrap = el('span', 'db-item'), im = document.createElement('img');
      im.src = '/assets/img/' + o.item.img + '-thumb.webp'; im.alt = ''; im.width = 40; im.height = 40; im.decoding = 'async';
      wrap.appendChild(im); wrap.appendChild(el('span', null, tr(o.item.name))); itd.appendChild(wrap); r.appendChild(itd);
      var ctd = el('td'), c = CH[o.ch];
      ctd.appendChild(el('span', 'db-ch db-ch-' + c.cls, tr(c)));
      if (o.agent) ctd.appendChild(el('span', 'db-agent', tr({ en: 'AI agent', gu: 'AI એજન્ટ' })));
      r.appendChild(ctd);
      r.appendChild(el('td', null, tr(o.pay)));
      var std = el('td'); std.appendChild(el('span', 'db-status db-' + (o.st === 'handed' ? 'done' : o.st), tr(ST[o.st]))); r.appendChild(std);
      r.appendChild(el('td', 'num db-amt', inr.format(o.amt)));
      return r;
    }
    function feedItem(t) { var li = el('li'); li.appendChild(el('span', 'log-icon')); li.appendChild(el('span', null, tr(t))); return li; }

    // Draw the board as it is after `k` live orders.
    function render(k) {
      var v = { revenue: BASE.revenue, orders: BASE.orders + k, chats: BASE.chats, agent: BASE.agent, receipts: BASE.receipts, reorders: BASE.reorders, earbuds: BASE.earbuds };
      var feed = OLD_FEED.slice();
      LIVE.slice(0, k).forEach(function (o) {
        v.revenue += o.amt;
        if (o.chat) { v.chats++; v.agent++; }
        if (o.receipt) v.receipts++;
        if (o.earbuds != null) { v.earbuds = o.earbuds; v.reorders++; }
        o.feed.forEach(function (f) { feed.unshift(f); });
      });
      var rows = LIVE.slice(0, k).reverse().concat(OLD).slice(0, 5);
      tbody.textContent = '';
      rows.forEach(function (o) { tbody.appendChild(row(o)); });
      feedList.textContent = '';
      feed.slice(0, 3).forEach(function (f) { feedList.appendChild(feedItem(f)); });
      kRev.textContent = inr.format(v.revenue); kOrd.textContent = v.orders; kChat.textContent = v.chats; kAgent.textContent = v.agent;
      var p = path(10 + k);
      line.setAttribute('d', p.d); area.setAttribute('d', p.area); dot.setAttribute('cx', p.last[0].toFixed(1)); dot.setAttribute('cy', p.last[1].toFixed(1));
      budsRow.classList.toggle('is-low', v.earbuds <= 2);
      budsRow.querySelector('b').textContent = v.earbuds;
      budsRow.querySelector('.db-bar i').className = 'lvl-' + v.earbuds;
      reorder.hidden = v.reorders === 0;
      rReceipt.textContent = v.receipts; rReorder.textContent = v.reorders;
      return v;
    }

    function pulse(node) { if (!reduce.matches) node.animate([{ transform: 'translateY(-5px)', opacity: 0.3 }, { transform: 'none', opacity: 1 }], { duration: 320, easing: EASE_OUT }); }

    function advance() {
      var before = render(step);
      step++;
      var after = render(step);
      if (reduce.matches) return;
      var newRow = tbody.firstElementChild;
      newRow.classList.add('is-new');
      newRow.animate([{ opacity: 0, transform: 'translateY(-10px)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: EASE_OUT });
      feedList.firstElementChild.animate([{ opacity: 0, transform: 'translateY(-8px)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: EASE_OUT });
      countTo(kRev, before.revenue, after.revenue, inr.format);
      [kOrd, kChat, kAgent, rReceipt, rReorder].forEach(function (n, i) {
        var keys = ['orders', 'chats', 'agent', 'receipts', 'reorders'];
        if (before[keys[i]] !== after[keys[i]]) pulse(n);
      });
      line.animate([{ strokeDasharray: '1200', strokeDashoffset: '60' }, { strokeDasharray: '1200', strokeDashoffset: '0' }], { duration: 600, easing: EASE_OUT });
      if (before.earbuds !== after.earbuds) {
        var bar = budsRow.querySelector('.db-bar i');
        bar.animate([{ transform: 'scaleX(' + (before.earbuds / after.earbuds) + ')' }, { transform: 'none' }], { duration: 500, easing: EASE_OUT });
        reorder.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 380, delay: 300, easing: EASE_OUT, fill: 'backwards' });
      }
    }

    render(step);
    document.addEventListener('pk:lang', function () { render(step); });
    if (reduce.matches || !('IntersectionObserver' in window) || !('animate' in Element.prototype)) return;

    step = 0; render(0); // rewind to earlier today, then play while on screen
    var timer = 0;
    new IntersectionObserver(function (entries) {
      clearTimeout(timer);
      if (!entries[0].isIntersecting) return;
      (function tick() {
        if (step >= LIVE.length) return;
        timer = setTimeout(function () { advance(); tick(); }, step === 0 ? 900 : 2600);
      })();
    }, { threshold: 0.3 }).observe(db);
  }

  function countTo(node, from, to, fmt) {
    if (reduce.matches) { node.textContent = fmt(to); return; }
    var start = null;
    function frame(now) {
      if (start === null) start = now;
      var t = Math.min((now - start) / 700, 1);
      node.textContent = fmt(Math.round(from + (to - from) * (1 - Math.pow(1 - t, 3))));
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
})();
