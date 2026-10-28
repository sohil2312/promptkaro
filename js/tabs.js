/* PromptKaro — tabs.js
   Plain accessible tabs for any [data-tabset]: click, arrow keys, Home/End, roving tabindex,
   and a short crossfade between panels. Without JS every panel is shown. */

(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  Array.prototype.forEach.call(document.querySelectorAll('[data-tabset]'), function (set) {
    var tabs = Array.prototype.slice.call(set.querySelectorAll('[role="tab"]'));
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
    var current = 0;

    function select(i, focus) {
      if (i === current) { if (focus) tabs[i].focus(); return; }
      tabs.forEach(function (t, k) {
        t.setAttribute('aria-selected', k === i ? 'true' : 'false');
        t.tabIndex = k === i ? 0 : -1;
      });
      panels[current].hidden = true;
      panels[i].hidden = false;
      current = i;
      if (focus) tabs[i].focus();
      if (!reduce.matches && 'animate' in panels[i]) {
        panels[i].animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }],
          { duration: 260, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
      }
    }

    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(i, false); });
      t.addEventListener('keydown', function (e) {
        var to = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') to = (i + 1) % tabs.length;
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') to = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === 'Home') to = 0;
        else if (e.key === 'End') to = tabs.length - 1;
        if (to === null) return;
        e.preventDefault();
        select(to, true);
      });
    });
  });
})();
