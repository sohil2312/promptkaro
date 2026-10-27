/* PromptKaro — showcase.js
   "What your site could look like": pick a business, see its sample site.
   Without JS every sample is listed one after another. */

(function () {
  'use strict';

  var root = document.getElementById('showcase');
  if (!root) return;

  var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
  var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';
  var current = 0;

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

    prev.getAnimations().forEach(function (a) { a.cancel(); });
    prev.hidden = true;
    next.hidden = false;
    current = index;

    if (!('animate' in next)) return;
    // Blur bridges the two states so the swap reads as one change, not two objects.
    var sample = next.querySelector('.sample');
    var copy = next.querySelector('.panel-copy');
    var travel = reduce.matches ? 'none' : 'translateY(6px)';
    if (sample) {
      sample.animate([
        { opacity: 0, filter: 'blur(4px)', transform: travel },
        { opacity: 1, filter: 'blur(0)', transform: 'none' }
      ], { duration: 260, easing: EASE_OUT });
    }
    if (copy) {
      copy.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220, delay: 40, easing: 'ease', fill: 'backwards' });
    }
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
})();
