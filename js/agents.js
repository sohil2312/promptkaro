/* PromptKaro — agents.js
   1. Agent console: the owner's WhatsApp on the left, the agent's live log on the right.
      Six scenarios play as event scripts; tabs switch, autoplay advances (with pause).
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
    handling: { en: 'Agent is handling this chat', gu: 'એજન્ટ જવાબ આપે છે' },
    typing: { en: 'Agent is typing…', gu: 'એજન્ટ ટાઇપ કરે છે…' },
    auto: { en: 'Auto-reply', gu: 'ઓટો-રિપ્લાય' },
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
    crm: 'CRM'
  };

  /* ---------- Scenarios (sample businesses and customers) ---------- */
  var SCENARIOS = [
    { biz: 'Shreeji Mobile', who: 'Ravi K.', events: [
      { t: 'in', at: '7:42 pm', text: { en: 'Is the 5G phone (128 GB) available? Price?', gu: '5G ફોન (128 GB) છે? ભાવ?' } },
      { t: 'log', ms: 420, tool: T.ai, text: { en: 'Read message: stock and price question', gu: 'મેસેજ વાંચ્યો: સ્ટોક અને ભાવનો સવાલ' } },
      { t: 'log', ms: 610, tool: T.inv, text: { en: 'Checked inventory: 3 in stock', gu: 'ઇન્વેન્ટરી ચેક કરી: 3 સ્ટોકમાં' } },
      { t: 'log', ms: 540, tool: T.price, text: { en: 'Fetched price ₹13,999 and EMI ₹1,167/month', gu: 'ભાવ ₹13,999 અને EMI ₹1,167/મહિને મેળવ્યા' } },
      { t: 'out', at: '7:42 pm', text: { en: 'Yes, 3 in stock. ₹13,999, or ₹1,167 a month on EMI. Shall I keep one for you?', gu: 'હા, 3 સ્ટોકમાં છે. ₹13,999, અથવા EMI પર ₹1,167/મહિને. તમારા માટે એક રાખી દઉં?' },
        buttons: [{ en: 'Keep one', gu: 'એક રાખો' }, { en: 'Show EMI', gu: 'EMI બતાવો' }] },
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
    { biz: 'Sabar Properties', who: 'Ajay R.', events: [
      { t: 'in', at: '11:30 pm', text: { en: 'Looking for a 2 BHK in Idar', gu: 'ઇડરમાં 2 BHK જોઈએ છે' } },
      { t: 'log', ms: 420, tool: T.ai, text: { en: 'Read message: buying enquiry', gu: 'મેસેજ વાંચ્યો: ખરીદીની પૂછપરછ' } },
      { t: 'out', at: '11:30 pm', text: { en: "Happy to help. What's your budget?", gu: 'ચોક્કસ. તમારું બજેટ કેટલું છે?' },
        buttons: [{ en: 'Under ₹25 lakh', gu: '₹25 લાખથી ઓછું' }, { en: '₹25–35 lakh', gu: '₹25–35 લાખ' }, { en: 'Above ₹35 lakh', gu: '₹35 લાખથી વધુ' }] },
      { t: 'tap', i: 1, at: '11:31 pm' },
      { t: 'log', ms: 580, tool: T.list, text: { en: 'Matched 2 listings in budget', gu: 'બજેટમાં 2 લિસ્ટિંગ મળ્યા' } },
      { t: 'log', ms: 460, tool: T.crm, text: { en: 'Marked as a hot lead and alerted the owner', gu: 'હોટ લીડ ગણી માલિકને જાણ કરી' } },
      { t: 'out', at: '11:31 pm', cards: [
          { kind: 'listing', title: { en: '2 BHK, Gandhi Nagar, Idar', gu: '2 BHK, ગાંધીનગર, ઇડર' }, sub: { en: '₹28 lakh', gu: '₹28 લાખ' } },
          { kind: 'listing', title: { en: '2 BHK, Station Road, Idar', gu: '2 BHK, સ્ટેશન રોડ, ઇડર' }, sub: { en: '₹32 lakh', gu: '₹32 લાખ' } }],
        text: { en: 'Here are 2 that fit. Shall I fix a site visit?', gu: 'આ 2 બજેટમાં છે. સાઇટ વિઝિટ ગોઠવું?' } }
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
        var card = el('span', 'msg-card' + (c.kind === 'pay' ? ' msg-pay' : ''));
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

  /* ============================== Dashboards ============================== */
  var dashes = Array.prototype.slice.call(document.querySelectorAll('[data-dash]'));
  if (!dashes.length) return;

  // Sales: running totals through the day; the last four are the live sales.
  var SALES_BASE = [0, 2100, 5200, 8800, 12400, 17900, 21000, 26300, 29800, 32124];
  var SALES_LIVE = [
    { item: { en: 'Earbuds', gu: 'ઇયરબડ્સ' }, tag: 'UPI', amt: 1299 },
    { item: { en: 'Charger 33W', gu: 'ચાર્જર 33W' }, tag: { en: 'Cash', gu: 'રોકડ' }, amt: 899 },
    { item: { en: '5G phone', gu: '5G ફોન' }, tag: 'EMI', amt: 13999 },
    { item: { en: 'Phone cover', gu: 'કવર' }, tag: 'UPI', amt: 299 }
  ];
  var SALES_OLD = [
    { item: { en: 'Smart watch', gu: 'સ્માર્ટ વોચ' }, tag: 'UPI', amt: 2499 },
    { item: { en: 'USB cable', gu: 'USB કેબલ' }, tag: { en: 'Cash', gu: 'રોકડ' }, amt: 249 },
    { item: { en: 'Screen guard', gu: 'સ્ક્રીન ગાર્ડ' }, tag: 'UPI', amt: 199 }
  ];

  function sparkPaths(series) {
    var max = 50000, n = SALES_BASE.length + SALES_LIVE.length - 1;
    var pts = series.map(function (v, i) { return [(i / n) * 300, 60 - (v / max) * 56]; });
    var line = pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
    var last = pts[pts.length - 1];
    return { line: line, area: line + ' L' + last[0].toFixed(1) + ' 64 L0 64 Z' };
  }

  function saleRow(s) {
    var li = el('li');
    li.appendChild(el('span', null, tr(s.item)));
    li.appendChild(el('span', 'dash-tag', tr(s.tag)));
    li.appendChild(el('b', 'num', inr.format(s.amt)));
    return li;
  }

  var dashState = { sales: 4, queue: 3, fees: 4, stock: 4 };

  var DASH = {
    sales: {
      steps: SALES_LIVE.length,
      render: function (card, k) {
        var series = SALES_BASE.slice();
        var total = SALES_BASE[SALES_BASE.length - 1];
        var feedItems = SALES_OLD.slice();
        for (var j = 0; j < k; j++) { total += SALES_LIVE[j].amt; series.push(total); feedItems.unshift(SALES_LIVE[j]); }
        var p = sparkPaths(series);
        card.querySelector('#sparkLine').setAttribute('d', p.line);
        card.querySelector('#sparkArea').setAttribute('d', p.area);
        card.querySelector('#salesTotal').textContent = inr.format(total);
        var feed = card.querySelector('#salesFeed');
        feed.textContent = '';
        feedItems.slice(0, 3).forEach(function (s) { feed.appendChild(saleRow(s)); });
      },
      step: function (card, k) {
        var before = SALES_BASE[SALES_BASE.length - 1];
        for (var j = 0; j < k - 1; j++) before += SALES_LIVE[j].amt;
        DASH.sales.render(card, k);
        var feed = card.querySelector('#salesFeed');
        feed.firstElementChild.animate([{ opacity: 0, transform: 'translateY(-10px) scale(0.98)', backgroundColor: '#E7F8EF' }, { opacity: 1, transform: 'none', backgroundColor: '#FFFFFF' }],
          { duration: 700, easing: EASE_OUT });
        countTo(card.querySelector('#salesTotal'), before, before + SALES_LIVE[k - 1].amt, inr.format);
        var line = card.querySelector('#sparkLine');
        var len = line.getTotalLength();
        line.animate([{ strokeDasharray: len, strokeDashoffset: 40 }, { strokeDasharray: len, strokeDashoffset: 0 }], { duration: 600, easing: EASE_OUT });
      }
    },

    queue: {
      steps: 3,
      // k: 0 = now 12, 1 = now 13, 2 = agent booked 18, 3 = now 15
      render: function (card, k) {
        var now = [12, 13, 14, 15][k];
        var names = { 13: 'Meena', 14: 'Arjun', 15: 'Fatima', 16: 'Kunal', 17: 'Jaya', 18: 'Ravi' };
        var last = k >= 2 ? 18 : 17;
        if (k === 2) now = 14; // the agent's booking arrives while 14 is being seen
        card.querySelector('#queueNow').textContent = now;
        card.querySelector('#queueWait').textContent = (k >= 3 ? 8 : 9) + ' min';
        var list = card.querySelector('#queueList');
        list.textContent = '';
        for (var t = now + 1; t <= Math.min(last, now + 4); t++) {
          var li = el('li', t === 18 ? 'is-agent' : null);
          li.appendChild(el('b', 'num', String(t)));
          li.appendChild(el('span', null, names[t]));
          if (t === 18) li.appendChild(el('em', null, tr({ en: 'booked by agent', gu: 'એજન્ટે બુક કર્યું' })));
          list.appendChild(li);
        }
      },
      step: function (card, k) {
        var list = card.querySelector('#queueList');
        var big = card.querySelector('#queueNow');
        var advancing = k !== 2;
        var rows = Array.prototype.slice.call(list.children);
        var tops = rows.map(function (r) { return r.getBoundingClientRect().top; });
        DASH.queue.render(card, k);
        if (advancing) {
          big.animate([{ transform: 'translateY(-14px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 420, easing: SPRING });
          // Rows slide up into their new places.
          Array.prototype.slice.call(list.children).forEach(function (r, i) {
            var from = tops[i + 1];
            if (from != null) {
              var d = from - r.getBoundingClientRect().top;
              if (d) r.animate([{ transform: 'translateY(' + d + 'px)' }, { transform: 'none' }], { duration: 380, easing: EASE_OUT });
            }
          });
        } else {
          var added = list.lastElementChild;
          added.animate([{ opacity: 0, transform: 'translateY(10px)', backgroundColor: '#E7F8EF' }, { opacity: 1, transform: 'none', backgroundColor: '#FFFFFF' }],
            { duration: 700, easing: EASE_OUT });
        }
      }
    },

    fees: {
      steps: 4,
      kids: [{ n: 'Dhruv', a: 18000 }, { n: 'Isha', a: 18000 }, { n: 'Kavya', a: 20000 }, { n: 'Om', a: 18000 }],
      render: function (card, k) {
        var total = 298000;
        var list = card.querySelector('#feesList');
        list.textContent = '';
        DASH.fees.kids.forEach(function (kid, i) {
          var paid = i < k;
          if (paid) total += kid.a;
          var li = el('li', paid ? 'is-paid' : 'is-pending');
          li.appendChild(el('span', null, kid.n));
          li.appendChild(el('b', 'num', inr.format(kid.a)));
          list.appendChild(li);
        });
        var pct = total / 480000 * 100;
        card.querySelector('#feesRing').style.setProperty('--p', pct.toFixed(2));
        card.querySelector('#feesPct').textContent = Math.round(pct) + '%';
        card.querySelector('#feesTotal').textContent = inr.format(total);
        return total;
      },
      step: function (card, k) {
        var before = 298000;
        for (var j = 0; j < k - 1; j++) before += DASH.fees.kids[j].a;
        DASH.fees.render(card, k);
        countTo(card.querySelector('#feesTotal'), before, before + DASH.fees.kids[k - 1].a, inr.format);
        var row = card.querySelector('#feesList').children[k - 1];
        row.animate([{ backgroundColor: '#E7F8EF', transform: 'scale(1.03)' }, { backgroundColor: '#FFFFFF', transform: 'none' }], { duration: 700, easing: EASE_OUT });
      }
    },

    stock: {
      steps: 4,
      // 0: earbuds 5; 1: 4; 2: 2 and low; 3: reorder sent; 4: supplier confirmed
      render: function (card, k) {
        var buds = [5, 4, 2, 2, 2][k];
        var li = card.querySelectorAll('#stockList li')[1];
        li.classList.toggle('is-low', buds <= 2);
        var bar = li.querySelector('.stock-bar i');
        bar.className = 'lvl-' + buds;
        li.querySelector('b').textContent = buds;
        var events = card.querySelectorAll('#stockEvents li');
        events[0].hidden = k < 3;
        events[1].hidden = k < 4;
      },
      step: function (card, k) {
        var li = card.querySelectorAll('#stockList li')[1];
        var bar = li.querySelector('.stock-bar i');
        var w0 = bar.getBoundingClientRect().width;
        DASH.stock.render(card, k);
        if (k <= 2) {
          var w1 = bar.getBoundingClientRect().width || 1;
          bar.animate([{ transform: 'scaleX(' + (w0 / w1) + ')' }, { transform: 'none' }], { duration: 500, easing: EASE_OUT });
          li.querySelector('b').animate([{ transform: 'translateY(-6px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 300, easing: EASE_OUT });
        } else {
          var ev = card.querySelectorAll('#stockEvents li')[k - 3];
          ev.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 360, easing: EASE_OUT });
        }
      }
    }
  };

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

  // Finished state everywhere first (also the language-switch path).
  function renderAllFinal() {
    dashes.forEach(function (card) { DASH[card.dataset.dash].render(card, dashState[card.dataset.dash]); });
  }
  renderAllFinal();
  document.addEventListener('pk:lang', renderAllFinal);

  if (reduce.matches || !('IntersectionObserver' in window) || !('animate' in Element.prototype)) return;

  // Rewind, then play each board's events once while it's on screen.
  dashes.forEach(function (card) { dashState[card.dataset.dash] = 0; DASH[card.dataset.dash].render(card, 0); });
  var timers = {};
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var card = entry.target, key = card.dataset.dash, d = DASH[key];
      clearTimeout(timers[key]);
      if (!entry.isIntersecting) return;
      (function tick() {
        if (dashState[key] >= d.steps) { io.unobserve(card); return; }
        timers[key] = setTimeout(function () {
          dashState[key]++;
          d.step(card, dashState[key]);
          tick();
        }, dashState[key] === 0 ? 700 : 1500);
      })();
    });
  }, { threshold: 0.5 });
  dashes.forEach(function (card) { io.observe(card); });
})();
