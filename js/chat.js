/* PromptKaro — chat.js
   The hero's one orchestrated moment: the WhatsApp conversation plays out once.
   Without JS, or with reduced motion, the whole conversation is simply shown. */

(function () {
  'use strict';

  var list = document.getElementById('chatList');
  var chat = document.getElementById('chat');
  var typing = document.getElementById('chatTyping');
  var status = document.getElementById('chatStatus');
  var replay = document.getElementById('chatReplay');
  if (!list || !chat || !typing || !status) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduce.matches || !('animate' in Element.prototype)) return;

  var EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';
  var STATUS = {
    en: { online: 'online', typing: 'typing…' },
    gu: { online: 'ઓનલાઇન', typing: 'ટાઇપ કરે છે…' }
  };
  var steps = Array.prototype.slice.call(list.querySelectorAll('[data-step]'));
  var timers = [];
  var running = false;

  function lang() { return document.documentElement.lang === 'gu' ? 'gu' : 'en'; }
  function setStatus(key) { status.textContent = STATUS[lang()][key]; status.dataset.state = key; }
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  // Show an element inside the bottom-anchored list, sliding older messages up (FLIP).
  function reveal(el, isNew) {
    var before = list.getBoundingClientRect().top;
    if (el === typing) el.hidden = false; else el.classList.remove('is-pending');
    var after = list.getBoundingClientRect().top;
    var shift = before - after;
    if (shift) {
      list.animate([{ transform: 'translateY(' + shift + 'px)' }, { transform: 'translateY(0)' }],
        { duration: 320, easing: EASE_OUT });
    }
    if (isNew) {
      var out = el.classList.contains('msg-out');
      el.style.transformOrigin = out ? '100% 100%' : el.classList.contains('chat-day') ? '50% 50%' : '0% 100%';
      el.animate([
        { opacity: 0, transform: 'translateY(8px) scale(0.96)' },
        { opacity: 1, transform: 'none' }
      ], { duration: 300, easing: EASE_OUT });
    }
  }

  function hideTyping() {
    var before = list.getBoundingClientRect().top;
    typing.hidden = true;
    var after = list.getBoundingClientRect().top;
    if (before !== after) {
      list.animate([{ transform: 'translateY(' + (before - after) + 'px)' }, { transform: 'translateY(0)' }],
        { duration: 200, easing: EASE_OUT });
    }
  }

  function play() {
    clearTimers();
    running = true;
    if (replay) replay.hidden = true;
    steps.forEach(function (s) { s.classList.add('is-pending'); });
    typing.hidden = true;
    setStatus('online');

    var t = 500;
    steps.forEach(function (step, i) {
      if (step.hasAttribute('data-typing')) {
        later(function () { setStatus('typing'); reveal(typing, true); }, t);
        t += 1100;
        later(function () { hideTyping(); reveal(step, true); setStatus('online'); }, t);
      } else if (step.classList.contains('chat-day')) {
        t += 300;
        later(function () { reveal(step, true); }, t);
      } else {
        later(function () { reveal(step, true); }, t);
      }
      t += i === 0 ? 900 : 1000;
    });

    later(function () {
      running = false;
      if (replay) {
        replay.hidden = false;
        replay.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 240, easing: 'ease' });
      }
    }, t);
  }

  // Start once, when the chat is properly on screen; after the hero has settled.
  var started = false;
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      if (started || !entries[0].isIntersecting) return;
      started = true;
      io.disconnect();
      steps.forEach(function (s) { s.classList.add('is-pending'); });
      setTimeout(play, 350);
    }, { threshold: 0.5 });
    io.observe(chat);
  }

  // If the tab is hidden mid-play, finish instantly rather than leave a half conversation.
  document.addEventListener('visibilitychange', function () {
    if (document.hidden && running) {
      clearTimers();
      running = false;
      typing.hidden = true;
      steps.forEach(function (s) { s.classList.remove('is-pending'); });
      setStatus('online');
      if (replay) replay.hidden = false;
    }
  });

  document.addEventListener('pk:lang', function () { setStatus(status.dataset.state || 'online'); });

  if (replay) replay.addEventListener('click', play);
})();
