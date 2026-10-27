/* PromptKaro — products.js
   Each product card holds a small piece of live UI that fills itself in once, when
   the card comes into view. The EMI calculator stays usable afterwards.
   Without JS (or with reduced motion) every fragment is shown complete. */

(function () {
  'use strict';

  var cards = Array.prototype.slice.call(document.querySelectorAll('.product[data-demo]'));
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var rupees = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

  /* ---------- EMI calculator: a real control ---------- */
  var range = document.getElementById('emiMonths');
  var out = document.getElementById('emiMonthsOut');
  var emi = document.getElementById('emiValue');

  function renderEmi(months) {
    if (!range) return;
    var price = Number(range.dataset.price);
    var m = Math.round(months);
    out.textContent = m;
    emi.textContent = rupees.format(Math.round(price / m));
    var pct = ((months - range.min) / (range.max - range.min)) * 100;
    range.style.setProperty('--fill', pct.toFixed(2) + '%');
  }
  if (range) {
    range.addEventListener('input', function () { renderEmi(Number(range.value)); });
    renderEmi(Number(range.value));
  }

  /* ---------- Helpers ---------- */
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function show(el) { el.classList.add('is-in'); }
  function steps(card) { return Array.prototype.slice.call(card.querySelectorAll('[data-step]')); }

  /* ---------- Demos ---------- */
  var demos = {
    // A search is typed, then the shop's result resolves, chips last.
    search: function (card) {
      var query = card.querySelector('.frag-query');
      var result = card.querySelector('.frag-result');
      var chips = Array.prototype.slice.call(card.querySelectorAll('.frag-chip'));
      card.classList.add('is-typing');
      var chars = Math.max(query.textContent.length, 1);
      var typing = query.animate(
        [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }],
        { duration: chars * 45, easing: 'steps(' + chars + ', end)', fill: 'forwards' }
      );
      return typing.finished.then(function () {
        card.classList.remove('is-typing');
        return wait(220);
      }).then(function () {
        show(result);
        return wait(260);
      }).then(function () {
        chips.forEach(function (c, i) { setTimeout(function () { show(c); }, i * 90); });
      });
    },

    // Tiles start as shimmering skeletons and fill in one by one; the share button arrives last.
    catalog: function (card) {
      var tiles = Array.prototype.slice.call(card.querySelectorAll('.frag-tiles li'));
      var share = card.querySelector('.frag-share');
      tiles.forEach(function (t, i) { setTimeout(function () { show(t); }, 120 + i * 170); });
      return wait(120 + tiles.length * 170 + 120).then(function () { show(share); });
    },

    // The slider glides from 3 to 12 months; the monthly amount rolls with it.
    emi: function (card) {
      steps(card).forEach(show);
      if (!range) return Promise.resolve();
      var from = 3, to = Number(range.value) || 12;
      var start = null, duration = 1100;
      var ease = function (t) { return 1 - Math.pow(1 - t, 4); };
      return new Promise(function (resolve) {
        function frame(now) {
          if (start === null) start = now;
          var t = Math.min((now - start) / duration, 1);
          var v = from + (to - from) * ease(t);
          range.value = String(Math.round(v));
          renderEmi(v);
          if (t < 1 && !userTouched) requestAnimationFrame(frame); else resolve();
        }
        range.value = String(from);
        renderEmi(from);
        setTimeout(function () { requestAnimationFrame(frame); }, 250);
      });
    },

    // Bars grow left to right; the total counts up alongside.
    chart: function (card) {
      var bars = Array.prototype.slice.call(card.querySelectorAll('.frag-bars li'));
      var total = card.querySelector('[data-count]');
      var target = Number(total.dataset.count);
      bars.forEach(function (b, i) { setTimeout(function () { show(b); }, 100 + i * 70); });
      var start = null, duration = 900;
      return new Promise(function (resolve) {
        function frame(now) {
          if (start === null) start = now;
          var t = Math.min((now - start) / duration, 1);
          total.textContent = Math.round(target * (1 - Math.pow(1 - t, 3)));
          if (t < 1) requestAnimationFrame(frame); else resolve();
        }
        total.textContent = '0';
        setTimeout(function () { requestAnimationFrame(frame); }, 100);
      });
    }
  };

  // If someone grabs the slider mid-demo, the demo lets go immediately.
  var userTouched = false;
  if (range) {
    ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) {
      range.addEventListener(ev, function () { userTouched = true; }, { passive: true });
    });
  }

  if (reduce.matches || !('IntersectionObserver' in window) || !('animate' in Element.prototype)) return;

  // Arm: hide the parts that will fill in. Titles and copy are never hidden.
  cards.forEach(function (card) { if (card.dataset.demo !== 'emi') card.classList.add('is-armed'); });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var card = entry.target;
      io.unobserve(card);
      var run = demos[card.dataset.demo];
      setTimeout(function () {
        Promise.resolve(run(card)).then(function () {
          // Leave the finished state clean: no armed rules left behind.
          setTimeout(function () {
            card.classList.remove('is-armed');
            card.querySelectorAll('.is-in').forEach(function (el) { el.classList.remove('is-in'); });
          }, 400);
        });
      }, 150);
    });
  }, { threshold: 0.45 });

  cards.forEach(function (card) { io.observe(card); });

  // A tab hidden mid-demo shouldn't leave half-built cards behind.
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) return;
    cards.forEach(function (card) {
      card.getAnimations({ subtree: true }).forEach(function (a) { a.finish(); });
    });
  });
})();
