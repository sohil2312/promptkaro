/* PromptKaro — headline.js
   "See your ___ first." The word cycles through what we build: website, AI agent, dashboard,
   online store, catalogue. Split-flap transition: the old letters flip up and blur away one by
   one, the new ones flip in from below, the slot eases to the new word's width (so "first."
   glides instead of jumping), and a marigold underline redraws under the new word.
   The hero stage (hero.js) sets the pace: it fires `pk:scene` when it changes, so the word always
   names what the stage shows. Screen readers get the static sentence (visually hidden copy in the h1).
   Reduced motion or no GSAP: the word swaps without animation. */

(function () {
  'use strict';

  var slot = document.getElementById('heroWord');
  var gsap = window.gsap;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!slot) return;

  var WORDS = [
    { en: 'website', gu: 'વેબસાઇટ' },
    { en: 'AI agent', gu: 'AI એજન્ટ' },
    { en: 'dashboard', gu: 'ડેશબોર્ડ' },
    { en: 'online store', gu: 'ઓનલાઇન સ્ટોર' },
    { en: 'catalogue', gu: 'કેટલોગ' }
  ];
  var i = 0, busy = false, wanted = null;
  var animate = !!gsap && !reduce.matches;

  function lang() { return document.documentElement.lang === 'gu' ? 'gu' : 'en'; }

  // Latin words flip letter by letter. Gujarati letters join into conjuncts, so the word moves as one.
  function pieces(text) {
    if (lang() === 'gu') return [text];
    return Array.from(text);
  }

  function build(text) {
    var w = document.createElement('span');
    w.className = 'rot-word';
    pieces(text).forEach(function (ch) {
      var c = document.createElement('span');
      c.className = 'rot-ch';
      c.textContent = ch === ' ' ? ' ' : ch;
      w.appendChild(c);
    });
    return w;
  }

  // The underline lives on the slot and redraws from the left each time.
  var line = document.createElement('span');
  line.className = 'rot-line';
  slot.appendChild(line);

  function swap(index) {
    if (index === i) return;
    if (busy) { wanted = index; return; }
    i = index;
    var oldWord = slot.querySelector('.rot-word');
    if (!animate) { oldWord.replaceWith(build(WORDS[i][lang()])); return; }
    busy = true;
    var next = build(WORDS[i][lang()]);
    next.classList.add('is-next');
    slot.appendChild(next);

    var from = oldWord.getBoundingClientRect().width;
    var to = next.getBoundingClientRect().width;
    var tl = gsap.timeline({
      onComplete: function () {
        oldWord.remove();
        next.classList.remove('is-next');
        // The language may have changed mid-flip.
        if (next.textContent !== WORDS[i][lang()]) next.replaceWith(build(WORDS[i][lang()]));
        gsap.set(slot, { clearProps: 'width' });
        busy = false;
        if (wanted !== null) { var w = wanted; wanted = null; swap(w); }
      }
    });
    gsap.set(slot, { width: from });
    tl.to(line, { scaleX: 0, transformOrigin: '100% 50%', duration: 0.28, ease: 'power2.in' }, 0);
    tl.to(oldWord.children, { yPercent: -60, rotationX: 80, opacity: 0, filter: 'blur(6px)', duration: 0.34, ease: 'power2.in', stagger: 0.025 }, 0);
    tl.to(slot, { width: to, duration: 0.6, ease: 'expo.out' }, 0.18);
    tl.fromTo(next.children, { yPercent: 70, rotationX: -80, opacity: 0, filter: 'blur(6px)' },
      { yPercent: 0, rotationX: 0, opacity: 1, filter: 'blur(0px)', duration: 0.6, ease: 'expo.out', stagger: 0.035 }, 0.22);
    tl.fromTo(line, { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 0.5, ease: 'expo.out' }, 0.5);
  }

  // Language switch: show the current word in the new language straight away.
  document.addEventListener('pk:lang', function () {
    var w = slot.querySelector('.rot-word');
    if (w && !busy) { w.replaceWith(build(WORDS[i][lang()])); }
  });

  document.addEventListener('pk:scene', function (e) { swap(e.detail.index % WORDS.length); });
  if (animate) slot.classList.add('is-live');
})();
