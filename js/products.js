/* PromptKaro — products.js
   Each product card holds a small piece of live UI that fills itself in once, when
   the card comes into view, then hands off to WhatsApp: the customer's message goes
   out and the shop replies. The EMI calculator and its send button stay usable.
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

  /* Coin stack: one coin per ₹420 a month, so fewer months means a taller stack. */
  var coins = document.getElementById('emiCoins');
  var SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

  function setCoins(monthly) {
    if (!coins) return;
    var want = Math.max(1, Math.min(12, Math.round(monthly / 420)));
    var live = Array.prototype.slice.call(coins.querySelectorAll('.coin:not(.is-leaving)'));
    var animate = !reduce.matches && 'animate' in coins;

    for (var n = live.length; n < want; n++) {
      var c = document.createElement('i');
      c.className = 'coin';
      coins.appendChild(c);
      if (animate) {
        c.animate([
          { transform: 'translateY(-26px) rotateX(40deg)', opacity: 0 },
          { transform: 'none', opacity: 1 }
        ], { duration: 420, easing: SPRING });
      }
    }
    // Lift coins off the top; leaving coins no longer count, so a fast drag never removes one twice.
    for (var k = live.length - 1; k >= want; k--) {
      var coin = live[k];
      if (!animate) { coin.remove(); continue; }
      coin.classList.add('is-leaving');
      coin.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateY(-18px)', opacity: 0 }],
        { duration: 200, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'forwards' })
        .finished.then(function (a) { a.effect.target.remove(); }, function () {});
    }
  }

  function renderEmi(months) {
    if (!range) return;
    var price = Number(range.dataset.price);
    var m = Math.round(months);
    var monthly = Math.round(price / m);
    out.textContent = m;
    emi.textContent = rupees.format(monthly);
    setCoins(monthly);
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
    // A search is typed, the map finds the shop, then its result resolves, chips last.
    search: function (card) {
      var query = card.querySelector('.frag-query');
      var map = card.querySelector('.frag-map-wrap');
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
        if (map) show(map);          // map appears, the pin drops onto the shop
        return wait(map ? 820 : 0);
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
      var target = Number(total.dataset.before || total.dataset.count);
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

  /* ---------- WhatsApp hand-off: every product ends in a conversation ---------- */

  // A fingertip glides in, presses the target, and lifts away.
  function tap(card, target) {
    if (!target || reduce.matches) return Promise.resolve();
    var c = card.getBoundingClientRect();
    var t = target.getBoundingClientRect();
    var x = t.left - c.left + t.width / 2;
    var y = t.top - c.top + t.height / 2;
    var dot = document.createElement('span');
    dot.className = 'tap';
    dot.setAttribute('aria-hidden', 'true');
    dot.style.left = x + 'px';
    dot.style.top = y + 'px';
    card.appendChild(dot);
    var glide = dot.animate([
      { transform: 'translateZ(40px) translate(46px, 54px) scale(1)', opacity: 0 },
      { transform: 'translateZ(40px) translate(0, 0) scale(1)', opacity: 1 }
    ], { duration: 520, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'forwards' });
    return glide.finished.then(function () {
      target.classList.add('is-pressed');
      target.animate([{ transform: 'scale(1)' }, { transform: 'scale(0.95)' }, { transform: 'scale(1)' }],
        { duration: 260, easing: 'ease-out' });
      return dot.animate([
        { transform: 'translateZ(40px) scale(1)', opacity: 1 },
        { transform: 'translateZ(40px) scale(0.75)', opacity: 1, offset: 0.35 },
        { transform: 'translateZ(40px) scale(1.5)', opacity: 0 }
      ], { duration: 460, easing: 'ease-out', fill: 'forwards' }).finished;
    }).then(function () {
      target.classList.remove('is-pressed');
      dot.remove();
    });
  }

  // The chat opens, the customer's message lands, the shop types, the reply arrives.
  function converse(mini) {
    var msgs = mini.querySelectorAll('[data-wa-step]');
    var out = msgs[0], reply = msgs[1];
    show(mini);
    return wait(380).then(function () {
      show(out);
      return wait(650);
    }).then(function () {
      reply.classList.add('is-typing');
      show(reply);
      return wait(1100);
    }).then(function () {
      reply.classList.remove('is-typing');
      return wait(300);
    });
  }

  /* EMI plan message, written from the live slider value. */
  var emiSend = document.getElementById('emiSend');
  var emiChat = document.getElementById('emiChat');
  function planText() {
    var months = range ? Math.round(Number(range.value)) : 12;
    var amount = emi ? emi.textContent : '';
    return document.documentElement.lang === 'gu'
      ? 'EMI પ્લાન: 5G ફોન, ' + amount + ' × ' + months + ' મહિના'
      : 'EMI plan: 5G phone, ' + amount + ' × ' + months + ' months';
  }
  var sentPlan = null; // { months } so a language switch can rewrite the sent message
  function writePlan() {
    if (!emiChat) return;
    emiChat.querySelector('.js-plan').textContent = planText();
    sentPlan = { months: range ? range.value : '12' };
  }
  document.addEventListener('pk:lang', function () {
    if (!sentPlan || !range) return;
    var now = range.value;
    range.value = sentPlan.months; renderEmi(Number(range.value));
    emiChat.querySelector('.js-plan').textContent = planText();
    range.value = now; renderEmi(Number(now));
  });

  // A real button: visitors can change the months and send again; the shop answers each time.
  function resend() {
    writePlan();
    if (reduce.matches || !emiChat) return;
    var msgs = emiChat.querySelectorAll('.msg');
    var out = msgs[0], reply = msgs[1];
    out.animate([{ opacity: 0, transform: 'translateY(6px) scale(0.97)' }, { opacity: 1, transform: 'none' }],
      { duration: 260, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
    reply.classList.add('is-typing');
    setTimeout(function () { reply.classList.remove('is-typing'); }, 1000);
  }
  if (emiSend) emiSend.addEventListener('click', resend);
  if (emiChat) writePlan();

  var handoffs = {
    search: function (card) {
      return tap(card, card.querySelector('.frag-chip-wa')).then(function () {
        return converse(card.querySelector('.wa-mini'));
      });
    },
    catalog: function (card) {
      var pick = card.querySelectorAll('.frag-tiles li')[2]; // the earbuds
      return tap(card, pick).then(function () {
        pick.classList.add('is-picked');
        return converse(card.querySelector('.wa-mini'));
      }).then(function () {
        return wait(600);
      }).then(function () { pick.classList.remove('is-picked'); });
    },
    emi: function (card) {
      return wait(300).then(function () {
        return tap(card, emiSend);
      }).then(function () {
        writePlan();
        return converse(card.querySelector('.wa-mini'));
      });
    },
    // The owner's side: an enquiry arrives, today's pillar grows, the total ticks up.
    chart: function (card) {
      var toast = card.querySelector('.wa-toast');
      var today = card.querySelector('.frag-bars [data-before]');
      var total = card.querySelector('[data-count]');
      return wait(400).then(function () {
        show(toast);
        return wait(500);
      }).then(function () {
        var bar = today.querySelector('i');
        var before = bar.getBoundingClientRect().height;
        today.classList.remove(today.dataset.before);
        today.classList.add('v-9');
        var after = bar.getBoundingClientRect().height;
        bar.animate([{ transform: 'scaleY(' + (before / after) + ')' }, { transform: 'scaleY(1)' }],
          { duration: 520, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' });
        total.textContent = total.dataset.count;
        total.animate([{ transform: 'translateY(-6px)', opacity: 0.4 }, { transform: 'none', opacity: 1 }],
          { duration: 300, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
        return wait(520);
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
  cards.forEach(function (card) {
    card.classList.add('is-armed');
    var today = card.querySelector('.frag-bars [data-before]');
    if (today) { today.classList.remove('v-9'); today.classList.add(today.dataset.before); }
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var card = entry.target;
      io.unobserve(card);
      var run = demos[card.dataset.demo];
      setTimeout(function () {
        Promise.resolve(run(card)).then(function () {
          return handoffs[card.dataset.demo] ? handoffs[card.dataset.demo](card) : null;
        }).then(function () {
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
