/* PromptKaro — showcase.js
   "Real landing pages, not templates": pick a business, see its full sample site.
   Each preview takes itself on a slow tour of the page once it is on screen, and
   hands over the moment the visitor scrolls, clicks or uses the keyboard inside it.
   Without JS every preview is listed and scrollable. */

(function () {
  'use strict';

  var root = document.getElementById('showcase');
  if (!root) return;

  var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
  var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var current = 0;

  panels.forEach(function (p, i) { if (i !== current) p.hidden = true; });

  /* ---------- The tour: ease down through the page, pause, glide back up ---------- */
  var tour = { raf: 0, view: null };
  function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  function stopTour() {
    if (tour.raf) cancelAnimationFrame(tour.raf);
    tour.raf = 0;
    tour.view = null;
  }

  function startTour(view) {
    stopTour();
    if (reduce.matches || view.dataset.toured) return; // each preview tours once; after that it's the visitor's
    var img = view.querySelector('img');
    function go() {
      var max = view.scrollHeight - view.clientHeight;
      if (max <= 0) return;
      tour.view = view;
      view.scrollTop = 0;
      var down = Math.min(11000, Math.max(6000, max * 5)); // about 200px a second, never rushed
      var hold = 900, up = 1400, start = null;
      (function step(now) {
        if (tour.view !== view) return;
        if (start === null) start = now;
        var t = now - start;
        if (t < 500) view.scrollTop = 0;                                    // a beat on the hero first
        else if (t < 500 + down) view.scrollTop = max * easeInOut((t - 500) / down);
        else if (t < 500 + down + hold) view.scrollTop = max;
        else if (t < 500 + down + hold + up) view.scrollTop = max * (1 - easeInOut((t - 500 - down - hold) / up));
        else { view.scrollTop = 0; view.dataset.toured = 'done'; stopTour(); return; }
        tour.raf = requestAnimationFrame(step);
      })(performance.now());
    }
    if (img && !img.complete) img.addEventListener('load', go, { once: true }); else go();
  }

  // Any real interaction inside a preview ends the tour for good on that preview.
  panels.forEach(function (p) {
    var view = p.querySelector('.site-view');
    if (!view) return;
    ['wheel', 'pointerdown', 'touchstart', 'keydown'].forEach(function (ev) {
      view.addEventListener(ev, function () {
        view.dataset.toured = 'user';
        if (tour.view === view) stopTour();
      }, { passive: true });
    });
  });

  var onScreen = false;
  function tourCurrent() {
    var view = panels[current].querySelector('.site-view');
    if (view && onScreen) startTour(view);
  }

  /* ---------- Tabs ---------- */
  function select(index, focus) {
    if (index === current) { if (focus) tabs[index].focus(); return; }
    var prev = panels[current], next = panels[index];
    tabs.forEach(function (t, i) {
      var on = i === index;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    if (focus) tabs[index].focus();
    stopTour();
    prev.hidden = true;
    next.hidden = false;
    current = index;

    if ('animate' in next && !reduce.matches) {
      var preview = next.querySelector('.site-preview');
      var copy = next.querySelector('.panel-copy');
      // Blur bridges the swap so it reads as one change, not two objects.
      if (preview) preview.animate([
        { opacity: 0, filter: 'blur(4px)', transform: 'translateY(8px)' },
        { opacity: 1, filter: 'blur(0)', transform: 'none' }
      ], { duration: 280, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
      if (copy) copy.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220, delay: 40, easing: 'ease', fill: 'backwards' });
    }
    tourCurrent();
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

  // Tour only while the showcase is actually on screen; pause when it scrolls away.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      onScreen = entries[0].isIntersecting;
      if (onScreen) { if (!tour.view) tourCurrent(); } else stopTour();
    }, { threshold: 0.45 }).observe(root);
  }
})();
