/* PromptKaro — products.js
   Each product card holds a small piece of live UI that fills itself in once, when
   the card comes into view, then hands off to WhatsApp: the customer's message goes
   out, the AI agent does its step and replies.
   Without JS (or with reduced motion) every fragment is shown complete. */

(function () {
  'use strict';

  var cards = Array.prototype.slice.call(document.querySelectorAll('.product[data-demo]'));
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!cards.length) return;

  /* ---------- Helpers ---------- */
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function show(el) { el.classList.add('is-in'); }
  function all(root, sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }

  // Text appears letter by letter, in any script (clip, not substring, so Gujarati shapes stay intact).
  function typeIn(el) {
    var chars = Math.max(el.textContent.length, 1);
    return el.animate(
      [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }],
      { duration: chars * 42, easing: 'steps(' + chars + ', end)', fill: 'forwards' }
    ).finished;
  }

  // An agent step: spinner, then a check.
  function work(step, ms) {
    step.classList.add('is-working');
    show(step);
    return wait(ms).then(function () { step.classList.remove('is-working'); return wait(140); });
  }

  /* ---------- Demos ---------- */
  var demos = {
    // A search is typed, the map finds the shop, then its result resolves, chips last.
    search: function (card) {
      var query = card.querySelector('.frag-query');
      var map = card.querySelector('.frag-map-wrap');
      var result = card.querySelector('.frag-result');
      var chips = all(card, '.frag-chip');
      card.classList.add('is-typing');
      return typeIn(query).then(function () {
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
      var tiles = all(card, '.frag-tiles li');
      var share = card.querySelector('.frag-share');
      tiles.forEach(function (t, i) { setTimeout(function () { show(t); }, 120 + i * 170); });
      return wait(120 + tiles.length * 170 + 120).then(function () { show(share); });
    },

    // The customer asks in their own words; the agent works; matching products land, best first.
    assistant: function (card) {
      var query = card.querySelector('.ai-query');
      var steps = all(card, '.ai-steps .wa-agent');
      var picks = all(card, '.ai-pick');
      var share = card.querySelector('.frag-share');
      return typeIn(query).then(function () {
        return wait(250);
      }).then(function () {
        return steps.reduce(function (p, s, i) { return p.then(function () { return work(s, [520, 760, 620][i] || 600); }); }, Promise.resolve());
      }).then(function () {
        picks.forEach(function (pk, i) { setTimeout(function () { show(pk); }, i * 140); });
        return wait(picks.length * 140 + 320);
      }).then(function () {
        show(share);
        return wait(200);
      });
    },

    // Bars grow left to right; the total counts up alongside.
    chart: function (card) {
      var bars = all(card, '.frag-bars li');
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
    var dot = document.createElement('span');
    dot.className = 'tap';
    dot.setAttribute('aria-hidden', 'true');
    dot.style.left = (t.left - c.left + t.width / 2) + 'px';
    dot.style.top = (t.top - c.top + t.height / 2) + 'px';
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

  // The chat opens, the customer's message lands, the agent does its step, the AI agent replies.
  function converse(mini) {
    var out = mini.querySelector('.msg-out'), agent = mini.querySelector('.wa-agent'), reply = mini.querySelector('.msg-in');
    show(mini);
    return wait(380).then(function () {
      show(out);
      return wait(500);
    }).then(function () {
      return agent ? work(agent, 750) : null;
    }).then(function () {
      reply.classList.add('is-typing');
      show(reply);
      return wait(650);
    }).then(function () {
      reply.classList.remove('is-typing');
      return wait(300);
    });
  }

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
    assistant: function (card) {
      return tap(card, card.querySelector('.frag-share')).then(function () {
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
      setTimeout(function () {
        Promise.resolve(demos[card.dataset.demo](card)).then(function () {
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
