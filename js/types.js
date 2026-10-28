/* PromptKaro — types.js
   The "landing page with motion" card plays its recording on the laptop screen,
   only while the card is on screen. With reduced motion (or without JS) the
   still render and poster stay. */

(function () {
  'use strict';

  var video = document.getElementById('motionVideo');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!video || !('IntersectionObserver' in window)) return;

  var visible = false;
  function update() {
    if (visible && !reduce.matches && !document.hidden) {
      if (video.preload !== 'auto') video.preload = 'auto';
      var p = video.play();
      if (p && p.catch) p.catch(function () { /* autoplay refused: the poster stays */ });
    } else if (!video.paused) {
      video.pause();
    }
  }

  new IntersectionObserver(function (entries) {
    visible = entries[0].isIntersecting;
    update();
  }, { threshold: 0.4 }).observe(video);

  document.addEventListener('visibilitychange', update);
  if (reduce.addEventListener) reduce.addEventListener('change', update);
})();
