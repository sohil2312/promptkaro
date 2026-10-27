/* PromptKaro — turntable.js
   Product renders that turn. Each .turn shows a still render; on desktop (fine pointer,
   no data saver, motion allowed) it swaps in a 24-frame turntable sprite once the card is
   on screen. The product spins into place, then follows the mouse across its card. */

(function () {
  'use strict';

  var turns = Array.prototype.slice.call(document.querySelectorAll('.turn[data-turn]'));
  if (!turns.length || !('IntersectionObserver' in window)) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  var conn = navigator.connection || {};
  if (reduce.matches || !fine.matches || conn.saveData || /(^|-)2g$/.test(conn.effectiveType || '')) return;

  var FRAMES = 24, COLS = 6, ROWS = 4, REST = 12; // frame 12 faces the camera like the still

  function frameAt(el, f) {
    var i = Math.max(0, Math.min(FRAMES - 1, Math.round(f)));
    if (el._shown === i) return;
    el._shown = i;
    var col = i % COLS, row = Math.floor(i / COLS);
    el.style.backgroundPosition = (col / (COLS - 1) * 100) + '% ' + (row / (ROWS - 1) * 100) + '%';
  }

  function animate(el) {
    if (el._raf) return;
    (function step() {
      // Ease toward the target frame; small residue snaps.
      el._f += (el._target - el._f) * 0.16;
      if (Math.abs(el._target - el._f) < 0.05) el._f = el._target;
      frameAt(el, el._f);
      el._raf = el._f === el._target ? 0 : requestAnimationFrame(step);
    })();
  }

  function activate(el) {
    var img = new Image();
    img.decoding = 'async';
    img.onload = function () {
      el.style.backgroundImage = 'url("' + el.dataset.turn + '")';
      el._f = 0; el._target = REST;
      frameAt(el, 0);
      el.classList.add('is-sprite');
      animate(el); // spins into place from the side
    };
    img.src = el.dataset.turn;

    // Follow the mouse across the whole product card, not just the tile.
    var card = el.closest('.product') || el.parentNode;
    if (card._turns) { card._turns.push(el); return; }
    card._turns = [el];
    card.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width; // 0..1
      card._turns.forEach(function (t, k) {
        if (!t.classList.contains('is-sprite')) return;
        // Neighbouring products lean slightly differently, like objects on a shelf.
        t._target = Math.max(0, Math.min(FRAMES - 1, x * (FRAMES - 1) + (k - 1.5) * 0.6));
        animate(t);
      });
    });
    card.addEventListener('pointerleave', function () {
      card._turns.forEach(function (t) { if (t.classList.contains('is-sprite')) { t._target = REST; animate(t); } });
    });
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      activate(e.target);
    });
  }, { rootMargin: '200px 0px', threshold: 0.01 });
  turns.forEach(function (t) { io.observe(t); });
})();
