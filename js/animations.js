/* =============================================
   PromptKaro — animations.js
   Scroll-triggered reveals + count-up animation
   ============================================= */

(function () {
  'use strict';

  /* ---- Scroll reveal with Intersection Observer ---- */
  const revealEls = document.querySelectorAll('.reveal-card');

  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: show all immediately
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  /* ---- Count-up animation for stats ---- */
  const statEls = document.querySelectorAll('.stat-val[data-target]');

  function easeOutQuad(t) {
    return t * (2 - t);
  }

  function countUp(el) {
    const target  = parseInt(el.dataset.target, 10);
    const suffix  = el.dataset.suffix || '';
    const duration = 1400; // ms
    const start   = performance.now();

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutQuad(progress);
      const current  = Math.round(eased * target);

      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  if ('IntersectionObserver' in window && statEls.length) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            countUp(entry.target);
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statEls.forEach((el) => statsObserver.observe(el));
  } else {
    // Fallback: set final values
    statEls.forEach((el) => {
      el.textContent = el.dataset.target + (el.dataset.suffix || '');
    });
  }
})();
