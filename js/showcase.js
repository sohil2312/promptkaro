/* PromptKaro — showcase.js
   "What your site could look like": pick a business, watch its sample site build
   itself from the price list, then tilt it around. Without JS every sample is
   listed, complete, one after another. */

(function () {
  'use strict';

  var root = document.getElementById('showcase');
  if (!root) return;

  var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
  var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  var EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';
  var STATUS = {
    en: { building: 'Building from your price list…', ready: 'Demo ready' },
    gu: { building: 'તમારા ભાવ-પત્રકથી બને છે…', ready: 'ડેમો તૈયાર' }
  };
  var current = 0;
  var seen = false;

  function lang() { return document.documentElement.lang === 'gu' ? 'gu' : 'en'; }

  /* ---------- Build status chip, added to every sample (decorative) ---------- */
  var samples = panels.map(function (p) { return p.querySelector('.sample'); });
  samples.forEach(function (sample) {
    var chip = document.createElement('span');
    chip.className = 'sample-status';
    chip.setAttribute('aria-hidden', 'true');
    chip.dataset.state = 'ready';
    chip.innerHTML = '<span class="sample-status-icon"></span><span class="sample-status-label"></span>';
    sample.querySelector('.sample-head').prepend(chip);
    var shine = document.createElement('span');
    shine.className = 'sample-shine';
    shine.setAttribute('aria-hidden', 'true');
    sample.appendChild(shine);
    setStatus(sample, 'ready');
  });

  function setStatus(sample, state) {
    var chip = sample.querySelector('.sample-status');
    chip.dataset.state = state;
    chip.querySelector('.sample-status-label').textContent = STATUS[lang()][state];
  }

  document.addEventListener('pk:lang', function () {
    samples.forEach(function (s) { setStatus(s, s.querySelector('.sample-status').dataset.state); });
  });

  /* ---------- The build: header wipes in, rows resolve, button pops ---------- */
  var buildTimers = [];

  function build(sample) {
    buildTimers.forEach(clearTimeout);
    buildTimers = [];
    if (reduce.matches) { setStatus(sample, 'ready'); return; }

    var parts = [sample.querySelector('.sample-head'), sample.querySelector('.sample-lead')]
      .concat(Array.prototype.slice.call(sample.querySelectorAll('.sample-rows li')))
      .concat([sample.querySelector('.sample-note'), sample.querySelector('.sample-btn')]);

    parts.forEach(function (p) { p.classList.remove('is-in'); });
    sample.classList.add('is-building');
    setStatus(sample, 'building');
    void sample.offsetWidth; // commit the "empty" state so transitions run

    // Header and lead first, then rows like a waterfall, the action last.
    var times = [0, 160];
    var rows = parts.length - 4;
    for (var i = 0; i < rows; i++) times.push(320 + i * 150);
    times.push(320 + rows * 150 + 80);   // note
    times.push(320 + rows * 150 + 230);  // button

    parts.forEach(function (p, i) {
      buildTimers.push(setTimeout(function () { p.classList.add('is-in'); }, times[i]));
    });
    buildTimers.push(setTimeout(function () {
      sample.classList.remove('is-building');
      parts.forEach(function (p) { p.classList.remove('is-in'); });
      setStatus(sample, 'ready');
    }, times[times.length - 1] + 320));
  }

  /* ---------- Tabs ---------- */
  panels.forEach(function (p, i) { if (i !== current) p.hidden = true; });

  function select(index, focus) {
    if (index === current) { if (focus) tabs[index].focus(); return; }
    var prev = panels[current];
    var next = panels[index];

    tabs.forEach(function (t, i) {
      var on = i === index;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    if (focus) tabs[index].focus();

    prev.getAnimations({ subtree: true }).forEach(function (a) { a.cancel(); });
    prev.hidden = true;
    next.hidden = false;
    current = index;

    var copy = next.querySelector('.panel-copy');
    if (copy && 'animate' in copy) {
      copy.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220, delay: 40, easing: 'ease', fill: 'backwards' });
    }
    if (samples[index] && 'animate' in samples[index] && !reduce.matches) {
      samples[index].animate([
        { opacity: 0, transform: 'translateY(8px) scale(0.98)' },
        { opacity: 1, transform: 'none' }
      ], { duration: 280, easing: EASE_OUT });
    }
    build(samples[index]);
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { select(i, false); });
    tab.addEventListener('keydown', function (e) {
      var to = null;
      if (e.key === 'ArrowRight') to = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') to = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') to = 0;
      else if (e.key === 'End') to = tabs.length - 1;
      if (to === null) return;
      e.preventDefault();
      select(to, true);
      tabs[to].scrollIntoView({ block: 'nearest', inline: 'nearest' });
    });
  });

  // First build when the showcase is properly on screen.
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      if (seen || !entries[0].isIntersecting) return;
      seen = true;
      io.disconnect();
      build(samples[current]);
    }, { threshold: 0.35 });
    io.observe(root);
  }

  /* ---------- Tactile tilt: a damped spring toward the pointer ---------- */
  var MAX_TILT = 5; // degrees

  samples.forEach(function (sample) {
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
      sample.style.transform = 'rotateX(' + pos.y.toFixed(3) + 'deg) rotateY(' + pos.x.toFixed(3) + 'deg) scale(' + press.toFixed(4) + ')';
      var moving = Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y) + Math.abs(vel.x) + Math.abs(vel.y) > 0.01 ||
                   Math.abs(pressTarget - press) > 0.0005;
      if (moving) raf = requestAnimationFrame(step);
      else {
        raf = 0;
        if (!target.x && !target.y && pressTarget === 1) sample.style.transform = '';
      }
    }
    function kick() { if (!raf) raf = requestAnimationFrame(step); }

    sample.addEventListener('pointermove', function (e) {
      if (!finePointer.matches || reduce.matches || e.pointerType !== 'mouse') return;
      var r = sample.getBoundingClientRect();
      var nx = (e.clientX - r.left) / r.width - 0.5;
      var ny = (e.clientY - r.top) / r.height - 0.5;
      target.x = nx * MAX_TILT * 2;
      target.y = -ny * MAX_TILT * 2;
      sample.style.setProperty('--mx', ((nx + 0.5) * 100).toFixed(1) + '%');
      sample.style.setProperty('--my', ((ny + 0.5) * 100).toFixed(1) + '%');
      sample.classList.add('is-tilting');
      kick();
    });
    sample.addEventListener('pointerleave', function () {
      target.x = 0; target.y = 0; pressTarget = 1;
      sample.classList.remove('is-tilting');
      kick();
    });
    // Squish on press, for touch too: the card feels like it has give.
    sample.addEventListener('pointerdown', function () { if (!reduce.matches) { pressTarget = 0.98; kick(); } });
    sample.addEventListener('pointerup', function () { pressTarget = 1; kick(); });
    sample.addEventListener('pointercancel', function () { pressTarget = 1; kick(); });
  });
})();
