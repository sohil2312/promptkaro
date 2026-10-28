/* PromptKaro — hero.js
   The hero stage shows exactly what the headline names, one thing at a time:
   website → a site in the browser, AI agent → the browser folds into a phone and a WhatsApp
   agent works, dashboard → the live dashboard, online store → a shop, catalogue → a catalogue page.
   The stage leads; it tells headline.js which word to show (the `pk:scene` event), so the word
   and the picture always change together. GSAP runs the timelines (js/vendor/gsap.min.js).
   Without JS the website shows with the chat under it. With reduced motion or no GSAP, scenes
   switch instantly from the dots. Autoplay pauses off screen, in a hidden tab and on the pause button. */

(function () {
  'use strict';

  var stage = document.getElementById('heroStage');
  var device = document.getElementById('stageDevice');
  var list = document.getElementById('chatList');
  if (!stage || !device || !list) return;

  var browser = device.querySelector('.stage-browser');
  var phone = device.querySelector('.stage-phone');
  var view = document.getElementById('stageView');
  var url = document.getElementById('stageUrl');
  var kind = document.getElementById('stageKind');
  var status = document.getElementById('chatStatus');
  var controls = document.getElementById('stageControls');
  var pauseBtn = document.getElementById('stagePause');
  var dotsWrap = document.getElementById('stageDots');
  var label = document.getElementById('stageLabel');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var narrow = window.matchMedia('(max-width: 700px)');
  var gsap = window.gsap;

  function lang() { return document.documentElement.lang === 'gu' ? 'gu' : 'en'; }
  function tr(o) { return o == null ? '' : typeof o === 'string' ? o : (o[lang()] || o.en); }
  var T = {
    agent: { en: 'AI agent replies', gu: 'AI એજન્ટ જવાબ આપે છે' },
    typing: { en: 'typing…', gu: 'ટાઇપ કરે છે…' },
    pause: { en: 'Pause the examples', gu: 'ઉદાહરણો રોકો' },
    play: { en: 'Play the examples', gu: 'ઉદાહરણો ચલાવો' },
    show: { en: 'Show example', gu: 'ઉદાહરણ બતાવો' }
  };

  /* ---------- Scenes, in the same order as the headline words ---------- */
  var SCENES = [
    { mode: 'browser', url: 'studioaakar.in', shot: '/assets/img/site-interior.webp', kind: { en: 'Website', gu: 'વેબસાઇટ' },
      label: { en: 'Website for an interior and architecture studio', gu: 'ઇન્ટિરિયર અને આર્કિટેક્ચર સ્ટુડિયોની વેબસાઇટ' } },
    { mode: 'phone',
      label: { en: 'WhatsApp AI agent for a furniture store: checks stock, books a visit', gu: 'ફર્નિચર સ્ટોરનો WhatsApp AI એજન્ટ: સ્ટોક તપાસે, વિઝિટ બુક કરે' } },
    { mode: 'browser', url: 'dashboard.shreejimobile.in', shot: '/assets/img/hero-dashboard.webp', fit: true,
      kind: { en: 'Dashboard', gu: 'ડેશબોર્ડ' },
      label: { en: 'Dashboard that fills itself from WhatsApp, UPI and billing', gu: 'WhatsApp, UPI અને બિલિંગથી જાતે ભરાતું ડેશબોર્ડ' } },
    { mode: 'browser', url: 'rangrez.in', shot: '/assets/img/site-boutique.webp', kind: { en: 'Online store', gu: 'ઓનલાઇન સ્ટોર' },
      label: { en: 'Online store for a boutique, orders on WhatsApp', gu: 'બુટિકનો ઓનલાઇન સ્ટોર, WhatsApp પર ઓર્ડર' } },
    { mode: 'browser', url: 'sheeshamhouse.in/sofas', shot: '/assets/img/mp-sofas.webp', mshot: '/assets/img/mp-sofas.webp', fit: 'always',
      kind: { en: 'Catalogue', gu: 'કેટલોગ' },
      label: { en: 'Catalogue for a furniture maker, every sofa with its price', gu: 'ફર્નિચર બનાવનારનું કેટલોગ, દરેક સોફા ભાવ સાથે' } }
  ];

  var steps = Array.prototype.slice.call(list.querySelectorAll('[data-step]'));
  var current = 0;
  var tl = null, pan = null, timer = 0;
  var paused = false, onScreen = true, started = false;

  // Phones get the phone-width screenshot, which scrolls instead of being cropped
  // (the catalogue page is one screen, so it is cropped from its top left everywhere).
  function srcFor(s) { return narrow.matches ? (s.mshot || s.shot.replace('.webp', '-m.webp')) : s.shot; }
  function fits(s) { return s.fit === 'always' || (s.fit && !narrow.matches); }
  function shotFor(s) {
    var img = new Image();
    img.className = 'stage-shot' + (fits(s) ? ' is-fit' : '');
    img.alt = '';
    img.decoding = 'async';
    img.src = srcFor(s);
    return img;
  }
  if (narrow.matches) view.querySelector('.stage-shot').src = srcFor(SCENES[0]);

  function setFrame(s) {
    if (s.url) { url.textContent = s.url; kind.textContent = tr(s.kind); }
    label.textContent = tr(s.label);
    Array.prototype.forEach.call(dotsWrap.children, function (d, i) { d.setAttribute('aria-current', i === current ? 'true' : 'false'); });
  }
  function announce(i) { document.dispatchEvent(new CustomEvent('pk:scene', { detail: { index: i } })); }

  // Instant switch: reduced motion, no GSAP, or a dot clicked while paused.
  function show(i) {
    if (tl) { tl.kill(); tl = null; }
    if (pan) { pan.kill(); pan = null; }
    current = i;
    var s = SCENES[i];
    gsap && gsap.set([browser, phone, device], { clearProps: 'all' });
    device.dataset.mode = s.mode;
    if (s.url) { view.textContent = ''; view.appendChild(shotFor(s)); }
    steps.forEach(function (st) { st.classList.remove('is-pending', 'is-working', 'is-typing'); });
    status.textContent = tr(T.agent);
    setFrame(s);
    announce(i);
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
    setFrame(SCENES[current]);
    if (status.textContent !== tr(T.typing)) status.textContent = tr(T.agent);
    Array.prototype.forEach.call(dotsWrap.children, function (b, i) { b.setAttribute('aria-label', tr(T.show) + ' ' + (i + 1) + ': ' + tr(SCENES[i].label)); });
    pauseBtn.setAttribute('aria-label', tr(paused ? T.play : T.pause));
  });

  if (reduce.matches || !gsap) {
    pauseBtn.hidden = true;
    return;
  }

  /* ---------- Animated path ---------- */
  gsap.defaults({ ease: 'expo.out' });

  // A long page scrolls itself slowly while its scene holds; a one-screen page breathes a little.
  function startPan(img, hold) {
    if (pan) pan.kill();
    var run = function () {
      var travel = Math.min(700, Math.max(0, img.getBoundingClientRect().height - view.clientHeight));
      pan = travel > 40
        ? gsap.to(img, { y: -travel, duration: hold - 1.2, ease: 'sine.inOut', delay: 1.4 })
        : gsap.fromTo(img, { scale: 1 }, { scale: 1.035, transformOrigin: '50% 0%', duration: hold + 1, ease: 'sine.inOut' });
      if (paused) pan.pause();
    };
    if (img.complete) run(); else img.addEventListener('load', run, { once: true });
  }

  // Bottom-anchored chat: add a message and slide the older ones up (FLIP); the new one rises in.
  function reveal(node) {
    var before = list.getBoundingClientRect().top;
    node.classList.remove('is-pending');
    var shift = before - list.getBoundingClientRect().top;
    if (shift) gsap.fromTo(list, { y: shift }, { y: 0, duration: 0.32 });
    var out = node.classList.contains('msg-out');
    gsap.fromTo(node, { opacity: 0, y: 10, scale: 0.96, transformOrigin: out ? '100% 100%' : node.classList.contains('wa-agent') ? '50% 50%' : '0% 100%' },
      { opacity: 1, y: 0, scale: 1, duration: 0.34, clearProps: 'transform,opacity' });
  }

  // The agent at work: customer message, agent step (spinner, then a tick), typing, reply.
  function chatTimeline(t, at) {
    steps.forEach(function (st) {
      if (st.hasAttribute('data-work')) {
        t.call(function () { st.classList.add('is-working'); reveal(st); }, null, at);
        at += 0.9;
        t.call(function () { st.classList.remove('is-working'); }, null, at);
        at += 0.35;
      } else if (st.hasAttribute('data-typing')) {
        t.call(function () { st.classList.add('is-typing'); reveal(st); status.textContent = tr(T.typing); }, null, at);
        at += 0.9;
        t.call(function () { st.classList.remove('is-typing'); status.textContent = tr(T.agent); }, null, at);
        at += 1.4;
      } else {
        t.call(function () { reveal(st); }, null, at);
        at += 1.0;
      }
    });
    return at;
  }

  // Width the device takes in each mode (CSS holds the resting values; this is for the morph).
  function widthFor(mode) {
    var full = device.parentNode.clientWidth;
    return mode === 'phone' ? Math.min(parseFloat(getComputedStyle(device).getPropertyValue('--phone-w')) || 320, full) : full;
  }

  var HOLD = 4.2;

  function go(next) {
    clearTimeout(timer);
    if (tl) tl.kill();
    var s = SCENES[next], prev = SCENES[current];
    var first = !started;
    started = true;
    current = next;
    var t = gsap.timeline({ paused: paused });
    tl = t;
    var at = 0;

    if (!first) {
      t.call(function () {
        announce(next); setFrame(s);
        if (prev.mode !== s.mode && pan) pan.kill();
        // The agent's chat starts empty every time it comes round.
        if (s.mode === 'phone') { steps.forEach(function (st) { st.classList.add('is-pending'); }); gsap.set(list, { clearProps: 'transform' }); status.textContent = tr(T.agent); }
      }, null, 0);
      if (prev.mode !== s.mode) {
        // The window folds into a phone (or opens back out): content out, frame morphs, content in.
        var from = prev.mode === 'phone' ? phone : browser;
        var to = s.mode === 'phone' ? phone : browser;
        if (s.url) t.call(function () { if (pan) pan.kill(); view.textContent = ''; view.appendChild(shotFor(s)); }, null, 0.3);
        // The browser keeps the slot's full width while the frame closes or opens around it.
        var full = widthFor('browser');
        t.call(function () { gsap.set(browser, { width: full, left: '50%', xPercent: -50 }); }, null, 0);
        t.to(from, { autoAlpha: 0, filter: 'blur(4px)', duration: 0.35, ease: 'power2.in' }, 0.05);
        t.fromTo(device, { width: widthFor(prev.mode) }, { width: widthFor(s.mode), borderRadius: s.mode === 'phone' ? 24 : 16, duration: 0.8, ease: 'power3.inOut' }, 0.1);
        t.fromTo(to, { autoAlpha: 0, filter: 'blur(4px)' }, { autoAlpha: 1, filter: 'blur(0px)', duration: 0.5, ease: 'power2.out' }, 0.35);
        t.call(function () {
          device.dataset.mode = s.mode;
          gsap.set([browser, phone, device], { clearProps: 'all' });
        }, null, 0.95);
        at = 0.95;
      } else {
        // Browser to browser: the new page settles in from a soft blur over the old one.
        var old = view.querySelector('.stage-shot');
        var img = shotFor(s);
        t.call(function () { if (pan) pan.pause(); view.appendChild(img); }, null, 0.05);
        t.fromTo(img, { opacity: 0, scale: 1.04, filter: 'blur(8px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out' }, 0.1);
        if (old) t.to(old, { opacity: 0, scale: 0.98, duration: 0.6, ease: 'power2.inOut' }, 0.1);
        t.call(function () { if (old) old.remove(); gsap.set(img, { clearProps: 'filter,scale,opacity,transform' }); }, null, 0.95);
        at = 0.95;
      }
      t.fromTo([url, kind], { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.06 }, 0.15);
    }

    var end;
    if (s.mode === 'phone') {
      end = chatTimeline(t, at + 0.3) + 1.2;
    } else {
      t.call(function () { startPan(view.querySelector('.stage-shot:last-child'), HOLD); }, null, at);
      end = at + HOLD;
    }
    t.call(function () { tl = null; queueNext(0); }, null, end);
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
      if (!started) setTimeout(function () { go(0); }, 350);
      else if (tl) { tl.resume(); if (pan) pan.resume(); }
      else queueNext(1500);
    }, { threshold: 0.35 }).observe(stage);
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { clearTimeout(timer); if (tl) tl.pause(); if (pan) pan.pause(); }
    else if (!paused && onScreen) { if (tl) tl.resume(); else queueNext(1500); if (pan) pan.resume(); }
  });
})();
