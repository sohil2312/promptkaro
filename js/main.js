/* =============================================
   PromptKaro — main.js
   Nav scroll, smooth scroll, language toggle
   ============================================= */

(function () {
  'use strict';

  /* ---- Sticky nav: add class on scroll ---- */
  const body = document.body;
  let ticking = false;

  function handleScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 20) {
          body.classList.add('nav-scrolled');
        } else {
          body.classList.remove('nav-scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '60',
          10
        );
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- Language Toggle (EN | ગુ) ---- */
  const STORAGE_KEY = 'pk-lang';
  const toggleBtn   = document.getElementById('langToggle');
  let currentLang   = localStorage.getItem(STORAGE_KEY) || 'en';

  /**
   * Iterate all [data-en] elements and set their textContent
   * from the appropriate data attribute.
   */
  function applyLanguage(lang) {
    currentLang = lang;
    body.classList.toggle('lang-gu', lang === 'gu');
    document.documentElement.lang = lang === 'gu' ? 'gu' : 'en';
    localStorage.setItem(STORAGE_KEY, lang);

    // Update toggle button active state
    if (toggleBtn) {
      toggleBtn.classList.toggle('lang-active-gu', lang === 'gu');
    }

    // Swap all translatable text nodes
    document.querySelectorAll('[data-en]').forEach((el) => {
      const text = lang === 'gu' ? el.dataset.gu : el.dataset.en;
      if (text !== undefined) {
        el.textContent = text;
      }
    });

    // Tell terminal-effect.js about the language change
    if (typeof window.PK_setTerminalLang === 'function') {
      window.PK_setTerminalLang(lang);
    }

    // Tell terminal-effect.js to switch rotating words
    if (typeof window.PK_setWordLang === 'function') {
      window.PK_setWordLang(lang);
    }
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      applyLanguage(currentLang === 'gu' ? 'en' : 'gu');
    });
  }

  // Apply saved preference on load
  if (currentLang === 'gu') {
    applyLanguage('gu');
  }
})();
