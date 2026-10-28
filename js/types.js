/* PromptKaro — types.js
   Site types with live screens on rendered devices.
   - One-page site: a phone scrolls through a whole one-page site.
   - Multi-page site: a laptop moves through four pages of one site, the page chip follows.
   - Site with motion: the laptop plays a recording of the animated site.
   The screen content is warped onto the four screen corners measured from each render
   (data-quad, fractions of the image), so it sits on the glass at any card size.
   Everything plays only while visible; with reduced motion the first frame stays. */

(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var hasIO = 'IntersectionObserver' in window;

  /* ---------- Projective warp: a w×h rectangle onto four points ---------- */
  function adj(m) {
    return [m[4] * m[8] - m[5] * m[7], m[2] * m[7] - m[1] * m[8], m[1] * m[5] - m[2] * m[4],
      m[5] * m[6] - m[3] * m[8], m[0] * m[8] - m[2] * m[6], m[2] * m[3] - m[0] * m[5],
      m[3] * m[7] - m[4] * m[6], m[1] * m[6] - m[0] * m[7], m[0] * m[4] - m[1] * m[3]];
  }
  function mul(a, b) {
    var c = [];
    for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) {
      var s = 0; for (var k = 0; k < 3; k++) s += a[3 * i + k] * b[3 * k + j]; c[3 * i + j] = s;
    }
    return c;
  }
  function mulv(m, v) { return [m[0] * v[0] + m[1] * v[1] + m[2] * v[2], m[3] * v[0] + m[4] * v[1] + m[5] * v[2], m[6] * v[0] + m[7] * v[1] + m[8] * v[2]]; }
  function basis(p) {
    var m = [p[0], p[2], p[4], p[1], p[3], p[5], 1, 1, 1];
    var v = mulv(adj(m), [p[6], p[7], 1]);
    return mul(m, [v[0], 0, 0, 0, v[1], 0, 0, 0, v[2]]);
  }
  function project(w, h, q) {
    var s = basis([0, 0, w, 0, w, h, 0, h]);
    var d = basis(q);
    var t = mul(d, adj(s));
    for (var i = 0; i < 9; i++) t[i] /= t[8];
    return 'matrix3d(' + [t[0], t[3], 0, t[6], t[1], t[4], 0, t[7], 0, 0, 1, 0, t[2], t[5], 0, t[8]].join(',') + ')';
  }

  var lives = Array.prototype.slice.call(document.querySelectorAll('.type-live'));
  lives.forEach(function (box) {
    var screen = box.querySelector('.type-screen');
    var dims = box.dataset.screen.split('x').map(Number);
    var quad = box.dataset.quad.split(',').map(Number);
    screen.style.width = dims[0] + 'px';
    screen.style.height = dims[1] + 'px';
    function map() {
      var W = box.clientWidth, H = box.clientHeight;
      if (!W) return;
      var q = quad.map(function (v, i) { return v * (i % 2 ? H : W); });
      screen.style.transform = project(dims[0], dims[1], q);
      box.classList.add('is-mapped');
    }
    map();
    if ('ResizeObserver' in window) new ResizeObserver(map).observe(box);
    else window.addEventListener('resize', map);

    if (reduce.matches || !hasIO || !('animate' in Element.prototype)) return;
    var play = box.dataset.play === 'scroll' ? scroller(box, screen, dims) : pager(box, screen);
    new IntersectionObserver(function (e) { play(e[0].isIntersecting && !document.hidden); }, { threshold: 0.4 }).observe(box);
  });

  // One-page: ease down the page, hold, glide back to the top; again while it stays in view.
  function scroller(box, screen, dims) {
    var img = screen.querySelector('.type-scroll');
    var anim = null;
    function build() {
      var travel = img.getBoundingClientRect().height ? img.offsetHeight - dims[1] : 0;
      if (travel <= 0) return null;
      return img.animate([
        { transform: 'translateY(0)', offset: 0 },
        { transform: 'translateY(0)', offset: 0.06 },
        { transform: 'translateY(' + (-travel) + 'px)', offset: 0.7 },
        { transform: 'translateY(' + (-travel) + 'px)', offset: 0.78 },
        { transform: 'translateY(0)', offset: 1 }
      ], { duration: 14000, iterations: Infinity, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' });
    }
    return function (on) {
      if (on) {
        if (!anim) { if (!img.complete) { img.addEventListener('load', function () { anim = build(); }, { once: true }); return; } anim = build(); }
        else anim.play();
      } else if (anim) anim.pause();
    };
  }

  // Multi-page: Home, then each page in turn, with the page chip following.
  function pager(box, screen) {
    var pages = Array.prototype.slice.call(screen.querySelectorAll('.type-page'));
    var chips = Array.prototype.slice.call(box.querySelectorAll('.type-pages li'));
    var i = 0, timer = 0;
    function step() {
      var prev = pages[i];
      i = (i + 1) % pages.length;
      prev.classList.remove('is-on'); prev.classList.add('is-off');
      setTimeout(function () { prev.classList.remove('is-off'); }, 700);
      pages[i].classList.add('is-on');
      chips.forEach(function (c, k) { c.classList.toggle('is-on', k === i); });
    }
    return function (on) {
      clearInterval(timer);
      if (on) timer = setInterval(step, 2400);
    };
  }

  /* ---------- Site with motion: the recording plays only while visible ---------- */
  var video = document.getElementById('motionVideo');
  if (!video || !hasIO) return;
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
  new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; update(); }, { threshold: 0.4 }).observe(video);
  document.addEventListener('visibilitychange', update);
  if (reduce.addEventListener) reduce.addEventListener('change', update);
})();
