/* PromptKaro — hero.js
   The hero stage: a website, its product and its WhatsApp agent, changing together.
   Scene 1 is the PromptKaro story itself (a shop owner asks for a site and gets a demo).
   Every scene after that is one business: the product card transforms into that business's
   website (a circle opening from the card), the site scrolls itself, and the business's AI
   agent answers a customer in the phone. GSAP runs the timelines (js/vendor/gsap.min.js).
   Without JS, or with reduced motion, scene 1 is shown complete and the dots switch scenes
   instantly. Autoplay pauses off screen, in a hidden tab and on the pause button. */

(function () {
  'use strict';

  var stage = document.getElementById('heroStage');
  var list = document.getElementById('chatList');
  if (!stage || !list) return;

  var view = document.getElementById('stageView');
  var url = document.getElementById('stageUrl');
  var kind = document.getElementById('stageKind');
  var product = document.getElementById('stageProduct');
  var pName = document.getElementById('stageProductName');
  var pSub = document.getElementById('stageProductSub');
  var pPrice = document.getElementById('stageProductPrice');
  var pImg = product.querySelector('img');
  var chatName = document.getElementById('chatName');
  var chatAvatar = document.getElementById('chatAvatar');
  var status = document.getElementById('chatStatus');
  var typing = document.getElementById('chatTyping');
  var controls = document.getElementById('stageControls');
  var pauseBtn = document.getElementById('stagePause');
  var dotsWrap = document.getElementById('stageDots');
  var label = document.getElementById('stageLabel');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var gsap = window.gsap;

  function lang() { return document.documentElement.lang === 'gu' ? 'gu' : 'en'; }
  function tr(o) { return o == null ? '' : typeof o === 'string' ? o : (o[lang()] || o.en); }
  var T = {
    online: { en: 'online', gu: 'ઓનલાઇન' },
    typing: { en: 'typing…', gu: 'ટાઇપ કરે છે…' },
    agent: { en: 'AI agent replies', gu: 'AI એજન્ટ જવાબ આપે છે' },
    agentTag: { en: 'AI agent', gu: 'AI એજન્ટ' },
    pause: { en: 'Pause the examples', gu: 'ઉદાહરણો રોકો' },
    play: { en: 'Play the examples', gu: 'ઉદાહરણો ચલાવો' },
    show: { en: 'Show example', gu: 'ઉદાહરણ બતાવો' }
  };
  var WEB = { en: 'Website', gu: 'વેબસાઇટ' };

  /* ---------- Scenes ---------- */
  var SCENES = [
    { key: 'promptkaro', url: 'shreejimobile.in', shot: '/assets/img/site-mobile.webp', kind: WEB,
      label: { en: 'Website for a mobile shop, made from one WhatsApp chat', gu: 'એક WhatsApp ચેટથી બનેલી મોબાઇલ શોપની વેબસાઇટ' },
      product: { img: '/assets/img/phone-450.webp', name: { en: '5G phone, 128 GB', gu: '5G ફોન, 128 GB' }, sub: 'Shreeji Mobile', price: '₹13,999' },
      story: true },
    { key: 'furniture', url: 'sheeshamhouse.in', shot: '/assets/img/site-furniture.webp', kind: WEB,
      label: { en: 'Furniture store: website and WhatsApp AI agent', gu: 'ફર્નિચર સ્ટોર: વેબસાઇટ અને WhatsApp AI એજન્ટ' },
      product: { img: '/assets/img/fur-velvet-thumb.webp', name: { en: 'Curve velvet sofa', gu: 'કર્વ વેલ્વેટ સોફા' }, sub: 'Sheesham House', price: '₹42,000' },
      chat: { name: 'Sheesham House', avatar: 'S', msgs: [
        { out: { en: 'Does the blue sofa come in 2.1 metres?', gu: 'વાદળી સોફા 2.1 મીટરમાં મળશે?' }, at: '11:02' },
        { step: { en: 'Checked custom sizes and fabric stock', gu: 'કસ્ટમ સાઇઝ અને કાપડનો સ્ટોક ચેક કર્યો' } },
        { in: { en: 'Yes. 2.1 m in the same blue velvet is ₹39,500, delivered in 12 days. Shall I send a photo in your room?', gu: 'હા. એ જ વાદળી વેલ્વેટમાં 2.1 મી ₹39,500, 12 દિવસમાં ડિલિવરી. તમારા રૂમમાં ફોટો મોકલું?' }, at: '11:02' }
      ] } },
    { key: 'dashboard', url: 'dashboard.shreejimobile.in', shot: '/assets/img/hero-dashboard.webp', kind: { en: 'Automated dashboard', gu: 'ઓટોમેટેડ ડેશબોર્ડ' },
      label: { en: 'Automated dashboard that fills itself from WhatsApp, UPI and billing', gu: 'WhatsApp, UPI અને બિલિંગથી જાતે ભરાતું ડેશબોર્ડ' },
      product: { kpi: 48620, from: 41120, name: { en: 'Revenue today', gu: 'આજની આવક' }, sub: { en: '+12% on last Tuesday', gu: 'ગયા મંગળવાર કરતાં +12%' } },
      chat: { name: 'Shreeji Mobile', avatar: 'S', status: { en: 'automations', gu: 'ઓટોમેશન' }, msgs: [
        { step: { en: 'UPI payment matched to order #1042', gu: 'UPI પેમેન્ટ ઓર્ડર #1042 સાથે મેળવ્યું' } },
        { in: { en: 'Receipt sent to Hetal D. Earbuds are down to 2, so I sent the supplier a reorder for 20.', gu: 'હેતલ ડી.ને રસીદ મોકલી. ઇયરબડ્સ 2 બાકી છે, એટલે સપ્લાયરને 20નો ઓર્ડર મોકલ્યો.' }, at: '18:40' },
        { in: { en: 'Today so far: 23 orders, ₹48,620. 54 of 61 chats handled by the AI agent.', gu: 'આજે અત્યાર સુધી: 23 ઓર્ડર, ₹48,620. 61માંથી 54 ચેટ AI એજન્ટે સંભાળી.' }, at: '18:41' }
      ] } },
    { key: 'interior', url: 'studioaakar.in', shot: '/assets/img/site-interior.webp', kind: WEB,
      label: { en: 'Interior and architecture studio: website and WhatsApp AI agent', gu: 'ઇન્ટિરિયર અને આર્કિટેક્ચર સ્ટુડિયો: વેબસાઇટ અને WhatsApp AI એજન્ટ' },
      product: { img: '/assets/img/int-reading-thumb.webp', photo: true, name: { en: '3D concept, reading corner', gu: '3D કોન્સેપ્ટ, રીડિંગ કોર્નર' }, sub: 'Studio Aakar', price: { en: 'Ready', gu: 'તૈયાર' } },
      chat: { name: 'Studio Aakar', avatar: 'A', msgs: [
        { out: { en: 'We need our 3 BHK living room designed. Can you visit?', gu: 'અમારા 3 BHKનો લિવિંગ રૂમ ડિઝાઇન કરાવવો છે. મુલાકાત લઈ શકો?' }, at: '16:15' },
        { step: { en: 'Found a free slot in the designer’s calendar', gu: 'ડિઝાઇનરના કેલેન્ડરમાં ખાલી સમય શોધ્યો' } },
        { in: { en: 'Our designer can visit on Saturday at 11 am. Please send the floor plan or a few photos before that.', gu: 'અમારા ડિઝાઇનર શનિવારે સવારે 11 વાગ્યે આવી શકે. તે પહેલાં ફ્લોર પ્લાન કે થોડા ફોટા મોકલજો.' }, at: '16:15' }
      ] } },
    { key: 'boutique', url: 'rangrez.in', shot: '/assets/img/site-boutique.webp', kind: WEB,
      label: { en: 'Boutique: website and WhatsApp AI agent', gu: 'બુટિક: વેબસાઇટ અને WhatsApp AI એજન્ટ' },
      product: { img: '/assets/img/bou-corset-thumb.webp', name: { en: 'Embroidered corset top', gu: 'ભરતકામવાળું કોર્સેટ ટોપ' }, sub: 'Rangrez', price: '₹3,499' },
      chat: { name: 'Rangrez Boutique', avatar: 'R', msgs: [
        { out: { en: 'Is the corset top available in M?', gu: 'કોર્સેટ ટોપ M સાઇઝમાં છે?' }, at: '20:31' },
        { step: { en: 'Checked sizes in stock', gu: 'સ્ટોકમાં સાઇઝ ચેક કરી' } },
        { in: { en: 'Yes, M is in stock. We can bring S, M and L to your home tomorrow evening to try.', gu: 'હા, M સ્ટોકમાં છે. કાલે સાંજે S, M અને L ઘરે ટ્રાય કરવા લાવી શકીએ.' }, at: '20:31' }
      ] } },
    { key: 'manufacturer', url: 'himalcooling.in', shot: '/assets/img/site-manufacturer.webp', kind: WEB,
      label: { en: 'Manufacturer: website and WhatsApp AI agent for quotes', gu: 'મેન્યુફેક્ચરર: વેબસાઇટ અને ક્વોટ માટે WhatsApp AI એજન્ટ' },
      product: { img: '/assets/img/mfg-fridge-thumb.webp', name: { en: 'HC-330 visi cooler', gu: 'HC-330 વિઝી કૂલર' }, sub: 'Himal Cooling Systems', price: '330 L' },
      chat: { name: 'Himal Cooling', avatar: 'H', msgs: [
        { out: { en: 'Quote for 50 HC-330 coolers with our logo?', gu: 'અમારા લોગો સાથે 50 HC-330 કૂલરનો ભાવ?' }, at: '10:08' },
        { step: { en: 'Applied bulk price and branding cost', gu: 'બલ્ક ભાવ અને બ્રાન્ડિંગ ખર્ચ ગણ્યો' } },
        { in: { en: '₹28,400 each for 50, branded, delivery in 3 weeks. I have sent the quote PDF to this chat.', gu: '50 માટે બ્રાન્ડિંગ સાથે એક નંગ ₹28,400, 3 અઠવાડિયામાં ડિલિવરી. ક્વોટની PDF આ ચેટમાં મોકલી છે.' }, at: '10:09' }
      ] } },
    { key: 'wedding', url: 'shubhutsav.in', shot: '/assets/img/site-wedding.webp', kind: WEB,
      label: { en: 'Wedding planner: website and WhatsApp AI agent', gu: 'વેડિંગ પ્લાનર: વેબસાઇટ અને WhatsApp AI એજન્ટ' },
      product: { img: '/assets/img/wed-table-thumb.webp', photo: true, name: { en: 'Marigold decor plan', gu: 'ગલગોટાની સજાવટ' }, sub: 'Shubh Utsav', price: { en: '3 options', gu: '3 વિકલ્પ' } },
      chat: { name: 'Shubh Utsav', avatar: 'U', msgs: [
        { out: { en: 'Wedding on 14 February, about 300 guests. Are you free?', gu: '14 ફેબ્રુઆરીએ લગ્ન છે, લગભગ 300 મહેમાન. તમે ફ્રી છો?' }, at: '21:12' },
        { step: { en: 'Checked the team calendar for 12 to 15 Feb', gu: '12 થી 15 ફેબ્રુઆરીનું કેલેન્ડર ચેક કર્યું' } },
        { in: { en: '14 February is open. I am sending three decor plans and a sample week plan now.', gu: '14 ફેબ્રુઆરી ખાલી છે. ત્રણ સજાવટના પ્લાન અને અઠવાડિયાનો પ્લાન હમણાં મોકલું છું.' }, at: '21:12' }
      ] } }
  ];

  var storySteps = Array.prototype.slice.call(list.querySelectorAll('[data-step]'));
  var current = 0;
  var tl = null, pan = null, timer = 0;
  var paused = false, onScreen = true, started = false;

  /* ---------- Static setters (used by both the animated and the instant path) ---------- */
  function setProduct(s) {
    var p = s.product;
    product.classList.toggle('is-kpi', !!p.kpi);
    pImg.classList.toggle('is-photo', !!p.photo);
    if (p.kpi) {
      pImg.src = '/assets/img/earbuds-thumb.webp';
      pPrice.textContent = '₹' + p.kpi.toLocaleString('en-IN');
    } else {
      pImg.src = p.img;
      pPrice.textContent = tr(p.price);
    }
    pName.textContent = tr(p.name);
    pSub.textContent = tr(p.sub);
  }
  function setHead(s) {
    var c = s.chat;
    chatName.textContent = c ? c.name : 'PromptKaro';
    chatAvatar.textContent = c ? c.avatar : '›';
    status.textContent = c ? tr(c.status || T.agent) : tr(T.online);
  }
  function setFrame(s) {
    url.textContent = s.url;
    kind.textContent = tr(s.kind);
    label.textContent = tr(s.label);
    Array.prototype.forEach.call(dotsWrap.children, function (d, i) { d.setAttribute('aria-current', i === current ? 'true' : 'false'); });
  }
  function shotFor(s) {
    var img = new Image();
    img.className = 'stage-shot';
    img.alt = '';
    img.decoding = 'async';
    img.width = 1100;
    img.src = s.shot;
    return img;
  }
  function msgNode(m) {
    var li = document.createElement('li');
    if (m.step) {
      li.className = 'wa-agent';
      li.innerHTML = '<span class="log-icon"></span><span></span>';
      li.lastChild.textContent = tr(m.step);
    } else {
      li.className = 'msg ' + (m.out ? 'msg-out' : 'msg-in');
      if (m.in) {
        var tag = document.createElement('span'); tag.className = 'msg-agent'; tag.textContent = tr(T.agentTag); li.appendChild(tag);
        var dots = document.createElement('span'); dots.className = 'wa-dots'; dots.innerHTML = '<i></i><i></i><i></i>'; li.appendChild(dots);
      }
      var p = document.createElement('p'); p.textContent = tr(m.out || m.in); li.appendChild(p);
      var meta = document.createElement('span'); meta.className = 'msg-meta'; meta.textContent = m.at; li.appendChild(meta);
    }
    li.dataset.scene = '1';
    return li;
  }
  function clearSceneMessages() {
    Array.prototype.forEach.call(list.querySelectorAll('[data-scene]'), function (n) { n.remove(); });
  }

  // Instant switch: reduced motion, no GSAP, or a dot clicked while things are paused.
  function show(i) {
    current = i;
    var s = SCENES[i];
    view.textContent = '';
    view.appendChild(shotFor(s));
    setProduct(s); setHead(s); setFrame(s);
    clearSceneMessages();
    typing.hidden = true;
    storySteps.forEach(function (st) { st.hidden = !s.story; st.classList.remove('is-pending'); });
    if (!s.story) s.chat.msgs.forEach(function (m) { list.insertBefore(msgNode(m), typing); });
  }

  /* ---------- Dots and pause ---------- */
  SCENES.forEach(function (s, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', tr(T.show) + ' ' + (i + 1) + ': ' + tr(s.label));
    b.addEventListener('click', function () {
      if (i === current) return;
      if (reduce.matches || !gsap || paused) show(i); else go(i);
    });
    dotsWrap.appendChild(b);
  });
  controls.hidden = false;
  setFrame(SCENES[0]);

  function setPaused(p) {
    paused = p;
    pauseBtn.setAttribute('aria-pressed', p ? 'true' : 'false');
    pauseBtn.setAttribute('aria-label', tr(p ? T.play : T.pause));
    if (tl) { if (p) tl.pause(); else tl.resume(); }
    if (pan) { if (p) pan.pause(); else pan.resume(); }
    if (!p && !tl) queueNext(1200);
  }
  pauseBtn.addEventListener('click', function () { setPaused(!paused); });

  document.addEventListener('pk:lang', function () {
    var s = SCENES[current];
    setProduct(s); setHead(s); setFrame(s);
    if (!s.story) {
      var nodes = list.querySelectorAll('[data-scene]');
      var msgs = s.chat.msgs;
      Array.prototype.forEach.call(nodes, function (n, k) {
        var m = msgs[k]; if (!m) return;
        if (m.step) n.lastChild.textContent = tr(m.step);
        else { n.querySelector('p').textContent = tr(m.out || m.in); var t = n.querySelector('.msg-agent'); if (t) t.textContent = tr(T.agentTag); }
      });
    }
    Array.prototype.forEach.call(dotsWrap.children, function (b, i) { b.setAttribute('aria-label', tr(T.show) + ' ' + (i + 1) + ': ' + tr(SCENES[i].label)); });
    pauseBtn.setAttribute('aria-label', tr(paused ? T.play : T.pause));
  });

  if (reduce.matches || !gsap) {
    // Show everything at once; the dots still let people look at each example.
    pauseBtn.hidden = true;
    return;
  }

  /* ---------- Animated path ---------- */
  gsap.defaults({ ease: 'expo.out' });

  // The site scrolls itself: a slow ease down the page and back, while the scene holds.
  function startPan(img) {
    if (pan) pan.kill();
    var go = function () {
      var travel = Math.max(0, img.getBoundingClientRect().height - view.clientHeight);
      pan = gsap.to(img, { y: -travel, duration: Math.min(9, 3 + travel / 220), ease: 'sine.inOut', delay: 0.8, yoyo: true, repeat: 1, repeatDelay: 0.6 });
      if (paused) pan.pause();
    };
    if (img.complete) go(); else img.addEventListener('load', go, { once: true });
  }

  // Bottom-anchored chat: add a node and slide older messages up (FLIP), new one rises in.
  function reveal(node) {
    var before = list.getBoundingClientRect().top;
    if (node === typing) node.hidden = false;
    else if (node.parentNode !== list) list.insertBefore(node, typing);
    else node.classList.remove('is-pending');
    var shift = before - list.getBoundingClientRect().top;
    if (shift) gsap.fromTo(list, { y: shift }, { y: 0, duration: 0.32 });
    if (node !== typing) {
      var out = node.classList.contains('msg-out');
      gsap.fromTo(node, { opacity: 0, y: 10, scale: 0.96, transformOrigin: out ? '100% 100%' : node.classList.contains('wa-agent') || node.classList.contains('chat-day') ? '50% 50%' : '0% 100%' },
        { opacity: 1, y: 0, scale: 1, duration: 0.34, clearProps: 'transform,opacity' });
    }
  }

  // Scene 1: the PromptKaro story, message by message.
  function storyTimeline(t) {
    storySteps.forEach(function (st) { st.hidden = false; st.classList.add('is-pending'); });
    var at = 0.5;
    storySteps.forEach(function (st, i) {
      if (st.hasAttribute('data-typing')) {
        t.call(function () { status.textContent = tr(T.typing); reveal(typing); }, null, at);
        at += 1.0;
        t.call(function () { typing.hidden = true; reveal(st); status.textContent = tr(T.online); }, null, at);
      } else {
        t.call(function () { reveal(st); }, null, at);
      }
      at += i === 0 ? 0.9 : 1.0;
    });
    return at;
  }

  // A business scene: customer message, agent step (spinner, then a tick), typing, reply.
  function chatTimeline(t, s, at) {
    s.chat.msgs.forEach(function (m) {
      var node = msgNode(m);
      if (m.step) {
        node.classList.add('is-working');
        t.call(function () { reveal(node); }, null, at);
        at += 0.9;
        t.call(function () { node.classList.remove('is-working'); }, null, at);
        at += 0.3;
      } else if (m.in) {
        node.classList.add('is-typing');
        t.call(function () { reveal(node); status.textContent = tr(T.typing); }, null, at);
        at += 0.9;
        t.call(function () { node.classList.remove('is-typing'); status.textContent = tr(s.chat.status || T.agent); }, null, at);
        at += 1.2;
      } else {
        t.call(function () { reveal(node); }, null, at);
        at += 1.0;
      }
    });
    return at;
  }

  function go(next) {
    clearTimeout(timer);
    if (tl) tl.kill();
    var s = SCENES[next];
    var first = !started;
    started = true;
    current = next;
    var t = gsap.timeline({ paused: paused });
    tl = t;

    if (!first) {
      // 1. The product card spins away and the next one springs in from the other side.
      t.to(product, { rotationY: -90, opacity: 0.2, scale: 0.92, duration: 0.32, ease: 'power2.in' }, 0);
      t.call(function () { setProduct(s); }, null, 0.32);
      t.fromTo(product, { rotationY: 90, scale: 0.92 }, { rotationY: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.6)' }, 0.32);
      if (s.product.kpi) {
        var n = { v: s.product.from };
        t.to(n, { v: s.product.kpi, duration: 1.4, ease: 'power3.out', onUpdate: function () { pPrice.textContent = '₹' + Math.round(n.v).toLocaleString('en-IN'); } }, 0.5);
      }

      // 2. The website opens out of the card: a circle grows from the card's centre.
      var old = view.querySelector('.stage-shot');
      var img = shotFor(s);
      var vr = view.getBoundingClientRect(), pr = product.getBoundingClientRect();
      var cx = ((pr.left + pr.width / 2 - vr.left) / vr.width * 100).toFixed(1) + '%';
      var cy = ((pr.top + pr.height / 2 - vr.top) / vr.height * 100).toFixed(1) + '%';
      t.call(function () {
        img.style.clipPath = 'circle(0% at ' + cx + ' ' + cy + ')';
        view.appendChild(img);
        setFrame(s);
      }, null, 0.45);
      t.to(img, { clipPath: 'circle(150% at ' + cx + ' ' + cy + ')', duration: 1.1, ease: 'power3.inOut' }, 0.5);
      if (old) {
        t.to(old, { scale: 0.94, opacity: 0.4, filter: 'blur(3px)', transformOrigin: '50% 0%', duration: 1.0, ease: 'power2.inOut' }, 0.5);
        t.call(function () { old.remove(); img.style.clipPath = ''; startPan(img); }, null, 1.65);
      }
      t.fromTo(url, { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.4 }, 0.55);

      // 3. The phone switches to this business: old messages lift away, the header changes.
      t.to(list.children, { opacity: 0, y: -16, duration: 0.3, stagger: 0.02, ease: 'power2.in' }, 0.2);
      t.call(function () {
        clearSceneMessages();
        storySteps.forEach(function (st) { st.hidden = true; });
        gsap.set(list.children, { clearProps: 'opacity,transform' });
        typing.hidden = true;
        setHead(s);
      }, null, 0.6);
      t.fromTo([chatName, chatAvatar, status], { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.05 }, 0.62);
    } else {
      startPan(view.querySelector('.stage-shot'));
    }

    var end = s.story ? storyTimeline(t) : chatTimeline(t, s, first ? 0.4 : 1.4);
    t.call(function () { tl = null; queueNext(2600); }, null, end);
  }

  function queueNext(ms) {
    clearTimeout(timer);
    if (paused || !onScreen || document.hidden) return;
    timer = setTimeout(function () { go((current + 1) % SCENES.length); }, ms);
  }

  // Start when the stage is on screen; hold while it isn't.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      onScreen = entries[0].isIntersecting;
      if (!onScreen) { clearTimeout(timer); if (tl) tl.pause(); if (pan) pan.pause(); return; }
      if (paused) return;
      if (!started) { storySteps.forEach(function (st) { st.classList.add('is-pending'); }); setTimeout(function () { go(0); }, 350); }
      else if (tl) { tl.resume(); if (pan) pan.resume(); }
      else queueNext(1500);
    }, { threshold: 0.35 }).observe(stage);
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { clearTimeout(timer); if (tl) tl.pause(); if (pan) pan.pause(); }
    else if (!paused && onScreen) { if (tl) tl.resume(); else queueNext(1500); if (pan) pan.resume(); }
  });
})();
