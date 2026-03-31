/* =============================================
   PromptKaro — terminal-effect.js
   Pixel wireframe build animation + word rotation
   ============================================= */

(function () {
  'use strict';

  /* =============================================
     WORD ROTATION
     Words are swapped by main.js applyLanguage()
     for the GU version. This module reads the
     active array from window.PK_WORDS.
     ============================================= */
  window.PK_WORDS_EN = ['Website', 'App', 'Dashboard', 'Catalog', 'Tool'];
  window.PK_WORDS_GU = ['વેબસાઈટ', 'એપ', 'ડેશબોર્ડ', 'કેટેલોગ', 'ટૂલ'];

  let wordIndex = 0;
  let activeWords = window.PK_WORDS_EN;
  const rotEl = document.getElementById('rotatingWord');

  function rotateWord() {
    if (!rotEl) return;
    rotEl.classList.add('exit');
    setTimeout(() => {
      wordIndex = (wordIndex + 1) % activeWords.length;
      rotEl.textContent = activeWords[wordIndex];
      rotEl.classList.remove('exit');
      rotEl.classList.add('enter');
      void rotEl.offsetWidth;
      rotEl.classList.remove('enter');
    }, 360);
  }

  // Expose so main.js can call after language switch
  window.PK_setWordLang = function (lang) {
    activeWords = lang === 'gu' ? window.PK_WORDS_GU : window.PK_WORDS_EN;
    wordIndex = 0;
    if (rotEl) {
      rotEl.textContent = activeWords[0];
    }
  };

  if (rotEl) {
    setInterval(rotateWord, 2600);
  }

  /* =============================================
     PIXEL WIREFRAME BUILD ANIMATION
     ============================================= */
  const canvas  = document.getElementById('terminalCanvas');
  const cmdEl   = document.getElementById('terminalCommand');
  const caretEl = document.getElementById('terminalCaret');
  const readyEl = document.getElementById('terminalReady');

  if (!canvas || !cmdEl || !readyEl) return;

  // 30 columns × 8 rows
  // Color codes: 0=empty, 1=lime(nav), 2=content, 3=orange(cta), 4=card, 5=divider
  const COLS = 30;

  const LAYOUTS = [
    {
      // Website: nav | hero (text left + image right) | divider | 4 feature cards | divider | footer
      cmdEn: 'build website',
      cmdGu: 'વેબસાઈટ બનાવો',
      readyEn: 'website.ready 🚀',
      readyGu: 'website.ready 🚀',
      map: [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [5,0,2,2,2,2,2,2,2,2,2,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4,4,4,0,5],
        [5,0,3,3,3,3,3,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4,4,4,0,5],
        [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
        [5,0,4,4,4,4,4,4,0,4,4,4,4,4,4,4,0,4,4,4,4,4,4,4,0,4,4,4,4,5],
        [5,0,4,4,4,4,4,4,0,4,4,4,4,4,4,4,0,4,4,4,4,4,4,4,0,4,4,4,4,5],
        [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
        [2,2,2,2,0,0,0,0,0,0,0,0,0,3,3,3,3,3,0,0,0,0,0,0,0,2,2,2,2,2],
      ],
    },
    {
      // App: top header | sidebar (nav items) + main content area | bottom tab bar
      cmdEn: 'build app',
      cmdGu: 'એપ બનાવો',
      readyEn: 'app.ready 🚀',
      readyGu: 'app.ready 🚀',
      map: [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [4,4,4,4,4,5,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,3,3,3,5],
        [4,1,1,1,4,5,0,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5],
        [4,1,1,1,4,5,0,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5],
        [4,1,1,1,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
        [4,1,1,1,4,5,0,4,4,4,4,4,0,4,4,4,4,4,0,4,4,4,4,4,0,4,4,4,0,5],
        [4,1,1,1,4,5,0,4,4,4,4,4,0,4,4,4,4,4,0,4,4,4,4,4,0,4,4,4,0,5],
        [4,4,4,4,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      ],
    },
    {
      // Dashboard: nav | 4 KPI stat cards | divider | large chart + side widget | divider
      cmdEn: 'build dashboard',
      cmdGu: 'ડેશબોર્ડ બનાવો',
      readyEn: 'dashboard.ready 🚀',
      readyGu: 'dashboard.ready 🚀',
      map: [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [5,0,3,3,3,3,3,0,3,3,3,3,3,0,3,3,3,3,3,0,3,3,3,3,3,0,0,0,0,5],
        [5,0,3,3,3,3,3,0,3,3,3,3,3,0,3,3,3,3,3,0,3,3,3,3,3,0,0,0,0,5],
        [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
        [5,0,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,0,4,4,4,4,4,4,4,4,0,5],
        [5,0,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,0,4,4,4,4,4,4,4,4,0,5],
        [5,0,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,0,4,4,4,4,4,4,4,4,0,5],
        [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
      ],
    },
  ];

  const TYPE_SPEED    = 44;   // ms per char
  const CELL_DELAY    = 16;   // ms per pixel cell
  const READY_PAUSE   = 2200; // ms to show ready msg
  const FADE_DURATION = 400;  // ms for canvas fade
  const PRE_DELAY     = 500;  // ms before typing starts

  let layoutIndex = 0;
  let running = false;
  let currentLang = 'en';

  // Expose lang setter for main.js
  window.PK_setTerminalLang = function (lang) {
    currentLang = lang;
  };

  function typeCommand(text, cb) {
    if (!cmdEl) return;
    let i = 0;
    cmdEl.textContent = '';
    if (caretEl) caretEl.style.display = 'inline';

    const iv = setInterval(() => {
      cmdEl.textContent += text[i];
      i++;
      if (i >= text.length) {
        clearInterval(iv);
        if (caretEl) caretEl.style.display = 'none';
        setTimeout(cb, 200);
      }
    }, TYPE_SPEED);
  }

  function buildPixelCanvas(map, cb) {
    // Clear canvas
    canvas.innerHTML = '';
    canvas.style.opacity = '1';
    readyEl.textContent = '';
    readyEl.style.opacity = '0';

    // Set grid template
    canvas.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;

    // Flatten the map into cells
    const cells = [];
    map.forEach(row => {
      row.forEach(code => {
        const cell = document.createElement('div');
        cell.className = `t-cell tc-${code}`;
        canvas.appendChild(cell);
        cells.push(cell);
      });
    });

    // Reveal cells one by one
    let i = 0;
    function revealNext() {
      if (i >= cells.length) {
        cb();
        return;
      }
      cells[i].style.opacity = '1';
      i++;
      setTimeout(revealNext, CELL_DELAY);
    }
    revealNext();
  }

  function showReady(text, cb) {
    readyEl.textContent = '✓ ' + text;
    readyEl.style.opacity = '1';
    setTimeout(cb, READY_PAUSE);
  }

  function fadeOutCanvas(cb) {
    canvas.style.transition = `opacity ${FADE_DURATION}ms ease`;
    canvas.style.opacity = '0';
    readyEl.style.transition = `opacity ${FADE_DURATION}ms ease`;
    readyEl.style.opacity = '0';
    setTimeout(() => {
      canvas.innerHTML = '';
      canvas.style.transition = '';
      readyEl.style.transition = '';
      cb();
    }, FADE_DURATION);
  }

  function runCycle() {
    if (!running) return;
    const layout = LAYOUTS[layoutIndex % LAYOUTS.length];
    layoutIndex++;

    const cmd   = currentLang === 'gu' ? layout.cmdGu   : layout.cmdEn;
    const ready = currentLang === 'gu' ? layout.readyGu : layout.readyEn;

    // Clear from previous run
    cmdEl.textContent = '';
    canvas.innerHTML = '';
    readyEl.textContent = '';
    readyEl.style.opacity = '0';
    if (caretEl) caretEl.style.display = 'inline';

    setTimeout(() => {
      typeCommand(cmd, () => {
        buildPixelCanvas(layout.map, () => {
          showReady(ready, () => {
            fadeOutCanvas(() => {
              setTimeout(runCycle, 300);
            });
          });
        });
      });
    }, PRE_DELAY);
  }

  // Start after page-load delay
  running = true;
  setTimeout(runCycle, 900);
})();
