/* PromptKaro — main.js
   Language switch (EN / ગુ), header state, mobile WhatsApp dock. */

(function () {
  'use strict';

  var root = document.documentElement;
  var WA_NUMBER = '919429051036';
  var STORAGE_KEY = 'pk-lang';

  /* ---------- Language ---------- */
  var toggle = document.getElementById('langToggle');
  var textEls = document.querySelectorAll('[data-gu]');
  var labelEls = document.querySelectorAll('[data-gu-label]');
  var altEls = document.querySelectorAll('[data-gu-alt]');
  var waEls = document.querySelectorAll('.js-wa');

  // Remember the English that shipped in the HTML, so the page needs no duplicate data-en.
  textEls.forEach(function (el) { el.dataset.en = el.textContent; });
  labelEls.forEach(function (el) { el.dataset.enLabel = el.getAttribute('aria-label') || ''; });
  altEls.forEach(function (el) { el.dataset.enAlt = el.getAttribute('alt') || ''; });

  function waHref(message) {
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(message);
  }

  function readLang() {
    try { return localStorage.getItem(STORAGE_KEY) === 'gu' ? 'gu' : 'en'; } catch (e) { return 'en'; }
  }

  function saveLang(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* private mode: language just won't persist */ }
  }

  function applyLang(lang) {
    var gu = lang === 'gu';
    root.lang = gu ? 'gu' : 'en';

    textEls.forEach(function (el) {
      el.textContent = gu ? el.dataset.gu : el.dataset.en;
    });
    labelEls.forEach(function (el) {
      el.setAttribute('aria-label', gu ? el.dataset.guLabel : el.dataset.enLabel);
    });
    altEls.forEach(function (el) {
      el.setAttribute('alt', gu ? el.dataset.guAlt : el.dataset.enAlt);
    });
    waEls.forEach(function (el) {
      var msg = gu ? el.dataset.msgGu : el.dataset.msgEn;
      if (msg) el.href = waHref(msg);
    });

    document.dispatchEvent(new CustomEvent('pk:lang', { detail: { lang: lang } }));
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.lang === 'gu' ? 'en' : 'gu';
      saveLang(next);
      applyLang(next);
    });
  }

  if (readLang() === 'gu') applyLang('gu');

  /* ---------- Header: a hairline appears once the page moves ---------- */
  var header = document.querySelector('.site-header');
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    });
  }
  if (header) {
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile dock: only while no other big WhatsApp button is on screen ---------- */
  var dock = document.getElementById('dock');
  var watched = ['heroCta', 'promiseCta', 'footerCta'].map(function (id) { return document.getElementById(id); }).filter(Boolean);
  if (dock && watched.length && 'IntersectionObserver' in window) {
    var visible = new Set();
    var started = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) visible.add(e.target); else visible.delete(e.target);
      });
      // Don't flash the dock on first paint before the hero has been measured.
      if (!started) { started = true; if (visible.size === 0 && window.scrollY < 40) return; }
      dock.classList.toggle('is-shown', visible.size === 0);
    }, { rootMargin: '0px 0px -10% 0px' });
    watched.forEach(function (el) { io.observe(el); });
  }
})();
