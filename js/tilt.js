/* PromptKaro — tilt.js
   Cards with give: tilt toward the mouse through a damped spring (lags, settles,
   never snaps) and squish slightly on press. Applies to the product cards. */

(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  function attach(card, maxTilt) {
    var shine = document.createElement('span');
    shine.className = 'tilt-shine';
    shine.setAttribute('aria-hidden', 'true');
    card.appendChild(shine);

    var target = { x: 0, y: 0 };
    var pos = { x: 0, y: 0 };
    var vel = { x: 0, y: 0 };
    var press = 1, pressTarget = 1;
    var raf = 0;

    function step() {
      // Spring: stiffness 0.08, damping 0.78 per frame. Settles in ~0.5s with a hint of overshoot.
      ['x', 'y'].forEach(function (k) {
        vel[k] = (vel[k] + (target[k] - pos[k]) * 0.08) * 0.78;
        pos[k] += vel[k];
      });
      press += (pressTarget - press) * 0.35;
      card.style.transform = 'rotateX(' + pos.y.toFixed(3) + 'deg) rotateY(' + pos.x.toFixed(3) + 'deg) scale(' + press.toFixed(4) + ')';
      var moving = Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y) + Math.abs(vel.x) + Math.abs(vel.y) > 0.01 ||
                   Math.abs(pressTarget - press) > 0.0005;
      if (moving) raf = requestAnimationFrame(step);
      else {
        raf = 0;
        if (!target.x && !target.y && pressTarget === 1) card.style.transform = '';
      }
    }
    function kick() { if (!raf) raf = requestAnimationFrame(step); }

    card.addEventListener('pointermove', function (e) {
      if (!finePointer.matches || reduce.matches || e.pointerType !== 'mouse') return;
      var r = card.getBoundingClientRect();
      var nx = (e.clientX - r.left) / r.width - 0.5;
      var ny = (e.clientY - r.top) / r.height - 0.5;
      target.x = nx * maxTilt * 2;
      target.y = -ny * maxTilt * 2;
      card.style.setProperty('--mx', ((nx + 0.5) * 100).toFixed(1) + '%');
      card.style.setProperty('--my', ((ny + 0.5) * 100).toFixed(1) + '%');
      card.classList.add('is-tilting');
      kick();
    });
    card.addEventListener('pointerleave', function () {
      target.x = 0; target.y = 0; pressTarget = 1;
      card.classList.remove('is-tilting');
      kick();
    });
    // Squish on press (touch too), but not when the press is on a real control like the EMI slider.
    card.addEventListener('pointerdown', function (e) {
      if (reduce.matches || e.target.closest('input, a, button')) return;
      pressTarget = 0.98; kick();
    });
    card.addEventListener('pointerup', function () { pressTarget = 1; kick(); });
    card.addEventListener('pointercancel', function () { pressTarget = 1; kick(); });
  }

  // Large cards, so a small tilt is enough to feel physical.
  document.querySelectorAll('[data-tilt]').forEach(function (el) { attach(el, 3); });
})();
