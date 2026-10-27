// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const PAGE_URL = '/';
const WA_PATTERN = /^https:\/\/wa\.me\/919429051036\?text=.+/;
const ROOT = path.join(__dirname, '..');
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');

// The production CSP from _headers, applied locally so violations fail the test.
const CSP = read('_headers').match(/Content-Security-Policy: (.+)/)[1].trim();

test.describe('1. Layout', () => {
  test('page has a clear title and one h1', async ({ page }) => {
    await page.goto(PAGE_URL);
    await expect(page).toHaveTitle(/PromptKaro/);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toContainText('48');
  });

  test('every section has a heading', async ({ page }) => {
    await page.goto(PAGE_URL);
    for (const id of ['#work', '#how', '#products', '#prices', '#about', '#faq']) {
      await expect(page.locator(`${id} h2`)).toHaveCount(1);
    }
  });

  test('header is sticky', async ({ page }) => {
    await page.goto(PAGE_URL);
    const pos = await page.locator('.site-header').evaluate((el) => getComputedStyle(el).position);
    expect(pos).toBe('sticky');
  });

  for (const width of [360, 390, 768, 1024, 1440, 1920]) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(PAGE_URL);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      expect(overflow).toBe(false);
    });
  }

  test('hero headline, sentence and primary action fit in 1280x800', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(PAGE_URL);
    await page.waitForTimeout(900); // entrance settles
    for (const sel of ['.hero-title', '.hero-lead', '#heroCta']) {
      const box = await page.locator(sel).boundingBox();
      expect(box, sel).not.toBeNull();
      expect(box.y + box.height, sel).toBeLessThanOrEqual(800);
    }
  });

  test('footer wordmark stays inside the container', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1000 });
    await page.goto(PAGE_URL);
    const { mark, container } = await page.evaluate(() => {
      const m = document.querySelector('.footer-mark').getBoundingClientRect();
      const c = document.querySelector('.site-footer .container');
      const cs = getComputedStyle(c);
      const r = c.getBoundingClientRect();
      return { mark: m.right, container: r.right - parseFloat(cs.paddingRight) };
    });
    expect(mark).toBeLessThanOrEqual(container + 2);
  });
});

test.describe('2. Conversion: WhatsApp', () => {
  test('every WhatsApp link has the real number and a prefilled message', async ({ page }) => {
    await page.goto(PAGE_URL);
    const hrefs = await page.locator('a[href*="wa.me"]').evaluateAll((els) => els.map((a) => a.getAttribute('href')));
    expect(hrefs.length).toBeGreaterThanOrEqual(10);
    hrefs.forEach((h) => expect(h).toMatch(WA_PATTERN));
  });

  test('WhatsApp links open in a new tab safely', async ({ page }) => {
    await page.goto(PAGE_URL);
    const bad = await page.locator('a[href*="wa.me"]').evaluateAll((els) =>
      els.filter((a) => a.target !== '_blank' || !/noopener/.test(a.rel)).length);
    expect(bad).toBe(0);
  });

  test('showcase CTA asks for the chosen business', async ({ page }) => {
    await page.goto(PAGE_URL);
    await page.getByRole('tab', { name: 'Clinic' }).click();
    const href = await page.locator('#panel-clinic .js-wa').getAttribute('href');
    expect(decodeURIComponent(href)).toContain('I run a clinic');
  });
});

test.describe('3. Interaction', () => {
  test('tabs switch panels and support arrow keys', async ({ page }) => {
    await page.goto(PAGE_URL);
    await expect(page.locator('#panel-mobile')).toBeVisible();
    await expect(page.locator('#panel-coaching')).toBeHidden();

    await page.getByRole('tab', { name: 'Coaching class' }).click();
    await expect(page.locator('#panel-coaching')).toBeVisible();
    await expect(page.locator('#panel-mobile')).toBeHidden();
    await expect(page.getByRole('tab', { name: 'Coaching class' })).toHaveAttribute('aria-selected', 'true');

    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('tab', { name: 'Clinic' })).toBeFocused();
    await expect(page.locator('#panel-clinic')).toBeVisible();
    await page.keyboard.press('End');
    await expect(page.locator('#panel-food')).toBeVisible();
  });

  test('sample card builds itself, then shows "Demo ready"', async ({ page }) => {
    await page.goto(PAGE_URL);
    await page.locator('#showcase').scrollIntoViewIfNeeded();
    const sample = page.locator('#panel-mobile .sample');
    await expect(sample).toHaveClass(/is-building/);
    await expect(sample.locator('.sample-status')).toHaveAttribute('data-state', 'ready', { timeout: 4000 });
    await expect(sample).not.toHaveClass(/is-building/);
    await expect(sample.locator('.sample-btn')).toBeVisible();

    await page.getByRole('tab', { name: 'Property dealer' }).click();
    const next = page.locator('#panel-property .sample');
    await expect(next).toHaveClass(/is-building/);
    await expect(next.locator('.sample-status')).toHaveAttribute('data-state', 'ready', { timeout: 4000 });
  });

  test('sample build status follows the language', async ({ page }) => {
    await page.goto(PAGE_URL);
    await page.locator('#langToggle').click();
    await expect(page.locator('#panel-mobile .sample-status-label')).toHaveText(/ડેમો તૈયાર|ભાવ-પત્રક/);
  });

  test('product cards fill themselves in when scrolled into view', async ({ page }) => {
    await page.goto(PAGE_URL);
    for (const demo of ['search', 'catalog', 'emi', 'chart']) {
      const card = page.locator(`.product[data-demo="${demo}"]`);
      await card.scrollIntoViewIfNeeded();
      await expect(card).not.toHaveClass(/is-armed/, { timeout: 12000 });
    }
    await expect(page.locator('.frag-chart [data-count]')).toHaveText('39');
    await expect(page.locator('.frag-chip-wa')).toBeVisible();
    await expect(page.locator('.frag-share')).toBeVisible();
  });

  test('coin stack follows the EMI: fewer months, more coins', async ({ page }) => {
    await page.goto(PAGE_URL);
    const range = page.locator('#emiMonths');
    await range.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1800);
    const live = page.locator('#emiCoins .coin:not(.is-leaving)');
    await range.fill('3');
    await expect(live).toHaveCount(11);
    await range.fill('24');
    await expect(live).toHaveCount(1);
    await expect(page.locator('#emiCoins .coin')).toHaveCount(1, { timeout: 2000 }); // leaving coins are removed
  });

  test('product visuals are rendered elements, not icon SVGs', async ({ page }) => {
    await page.goto(PAGE_URL);
    await expect(page.locator('.frag-tiles svg')).toHaveCount(0);
    await expect(page.locator('.frag-tiles .obj')).toHaveCount(4);
    await expect(page.locator('.map-pin')).toHaveCount(1);
  });

  test('each product hands off to a WhatsApp conversation', async ({ page }) => {
    await page.goto(PAGE_URL);
    for (const demo of ['search', 'catalog', 'emi']) {
      const card = page.locator(`.product[data-demo="${demo}"]`);
      await card.scrollIntoViewIfNeeded();
      await expect(card).not.toHaveClass(/is-armed/, { timeout: 12000 });
      await expect(card.locator('.wa-mini .msg-out')).toBeVisible();
      await expect(card.locator('.wa-mini .msg-in p')).toBeVisible();
      await expect(card.locator('.is-typing')).toHaveCount(0);
      await expect(card.locator('.tap')).toHaveCount(0); // fingertip cleaned up
    }
    const dash = page.locator('.product[data-demo="chart"]');
    await dash.scrollIntoViewIfNeeded();
    await expect(dash).not.toHaveClass(/is-armed/, { timeout: 12000 });
    await expect(dash.locator('.wa-toast')).toBeVisible();
    await expect(dash.locator('[data-count]')).toHaveText('39');
  });

  test('sending an EMI plan writes the live plan into the chat', async ({ page }) => {
    await page.goto(PAGE_URL);
    const card = page.locator('.product[data-demo="emi"]');
    await card.scrollIntoViewIfNeeded();
    await expect(card).not.toHaveClass(/is-armed/, { timeout: 12000 });
    await page.locator('#emiMonths').fill('6');
    await page.locator('#emiSend').click();
    await expect(page.locator('.js-plan')).toHaveText('EMI plan: 5G phone, ₹2,333 × 6 months');
    await page.locator('#langToggle').click();
    await expect(page.locator('.js-plan')).toHaveText('EMI પ્લાન: 5G ફોન, ₹2,333 × 6 મહિના');
  });

  test('EMI calculator works as a real control', async ({ page }) => {
    await page.goto(PAGE_URL);
    const range = page.locator('#emiMonths');
    await range.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1800); // demo glide finishes
    await expect(page.locator('#emiMonthsOut')).toHaveText('12');
    await expect(page.locator('#emiValue')).toHaveText('₹1,167');
    await range.fill('6');
    await expect(page.locator('#emiMonthsOut')).toHaveText('6');
    await expect(page.locator('#emiValue')).toHaveText('₹2,333');
    await range.focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('#emiMonthsOut')).toHaveText('7');
  });

  test('hero chat plays to the end and offers a replay', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(PAGE_URL);
    await expect(page.locator('#chatReplay')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('#chatList .is-pending')).toHaveCount(0);
    await expect(page.locator('#chatTyping')).toBeHidden();
  });

  test('FAQ items open', async ({ page }) => {
    await page.goto(PAGE_URL);
    const first = page.locator('#faq details').first();
    await first.locator('summary').click();
    await expect(first).toHaveAttribute('open', '');
    await expect(first.locator('p')).toBeVisible();
  });

  test('mobile dock appears only between the big CTAs', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(PAGE_URL);
    const dock = page.locator('#dock');
    await expect(dock).toBeHidden();
    await page.locator('#how').scrollIntoViewIfNeeded();
    await expect(dock).toBeVisible();
    await page.locator('#footerCta').scrollIntoViewIfNeeded();
    await expect(dock).toBeHidden();
  });
});

test.describe('4. Language', () => {
  test('switching to Gujarati translates text, labels and WhatsApp messages', async ({ page }) => {
    await page.goto(PAGE_URL);
    await page.locator('#langToggle').click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'gu');
    await expect(page.locator('h1')).toContainText('કલાકમાં');
    const href = await page.locator('#heroCta').getAttribute('href');
    expect(decodeURIComponent(href)).toContain('મફત ડેમો');

    await page.reload();
    await expect(page.locator('h1')).toContainText('કલાકમાં'); // persisted

    await page.locator('#langToggle').click();
    await expect(page.locator('h1')).toContainText('48 hours');
  });

  test('every translatable element has Gujarati text', async ({ page }) => {
    await page.goto(PAGE_URL);
    const empty = await page.locator('[data-gu]').evaluateAll((els) => els.filter((e) => !e.dataset.gu.trim()).length);
    expect(empty).toBe(0);
  });
});

test.describe('5. Robustness', () => {
  test('no console errors or CSP violations under the production policy', async ({ page }) => {
    await page.route('**/*', async (route) => {
      const res = await route.fetch();
      const headers = { ...res.headers() };
      if ((headers['content-type'] || '').includes('text/html')) headers['content-security-policy'] = CSP;
      await route.fulfill({ response: res, headers });
    });
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto(PAGE_URL, { waitUntil: 'networkidle' });
    await page.getByRole('tab', { name: 'Restaurant' }).click();
    await page.locator('#langToggle').click();
    await page.waitForTimeout(500);
    expect(errors).toEqual([]);
    await expect(page.locator('html')).toHaveClass(/js/); // the hashed inline script ran
  });

  test('all content is visible with JavaScript off', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto(PAGE_URL);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.chat-list .msg:not(.msg-typing)')).toHaveCount(5);
    for (const id of ['#panel-mobile', '#panel-coaching', '#panel-clinic', '#panel-property', '#panel-food']) {
      await expect(page.locator(id)).toBeVisible();
    }
    await expect(page.locator('.plan')).toHaveCount(3);
    await expect(page.locator('.frag-tiles li')).toHaveCount(4);
    await expect(page.locator('.frag-result')).toBeVisible();
    await expect(page.locator('.frag-chart [data-count]')).toHaveText('39');
    await ctx.close();
  });

  test('reduced motion shows the whole conversation without playing it', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(PAGE_URL);
    await page.waitForTimeout(800);
    await expect(page.locator('#chatList .is-pending')).toHaveCount(0);
    await expect(page.locator('#chatReplay')).toBeHidden();
    await page.locator('#showcase').scrollIntoViewIfNeeded();
    await expect(page.locator('#panel-mobile .sample')).not.toHaveClass(/is-building/);
    await expect(page.locator('.product.is-armed')).toHaveCount(0);
    await ctx.close();
  });

  test('fonts are self-hosted and the page loads quickly', async ({ page }) => {
    const external = [];
    page.on('request', (r) => { if (!r.url().startsWith('http://localhost')) external.push(r.url()); });
    const start = Date.now();
    await page.goto(PAGE_URL, { waitUntil: 'load' });
    expect(Date.now() - start).toBeLessThan(3000);
    expect(external).toEqual([]);
    expect(await page.evaluate(() => document.fonts.check('640 1em Anek'))).toBe(true);
  });
});

test.describe('6. Accessibility', () => {
  test('skip link reaches main content', async ({ page }) => {
    await page.goto(PAGE_URL);
    await page.keyboard.press('Tab');
    await expect(page.locator('.skip-link')).toBeFocused();
    await expect(page.locator('main#main')).toBeAttached();
  });

  test('icon-only and interactive controls have names', async ({ page }) => {
    await page.goto(PAGE_URL);
    const unnamed = await page.locator('a, button').evaluateAll((els) =>
      els.filter((el) => {
        const style = getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden') return false;
        return !(el.getAttribute('aria-label') || el.textContent.trim());
      }).length);
    expect(unnamed).toBe(0);
  });

  test('focus ring is visible on keyboard focus', async ({ page }) => {
    await page.goto(PAGE_URL);
    await page.keyboard.press('Tab'); // skip link
    await page.keyboard.press('Tab'); // wordmark
    const outline = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
    expect(outline).toBe('solid');
  });

  test('tabs expose correct ARIA wiring', async ({ page }) => {
    await page.goto(PAGE_URL);
    const tabs = page.getByRole('tab');
    await expect(tabs).toHaveCount(5);
    for (const tab of await tabs.all()) {
      const controls = await tab.getAttribute('aria-controls');
      await expect(page.locator(`#${controls}`)).toHaveAttribute('role', 'tabpanel');
    }
  });
});

test.describe('7. Content', () => {
  test('prices match the Terms of Service', async ({ page }) => {
    await page.goto(PAGE_URL);
    const prices = await page.locator('.plan-price').allTextContents();
    expect(prices.map((p) => p.trim())).toEqual(['₹4,999', '₹9,999', '₹19,999']);
    const terms = read('terms.html');
    for (const p of ['₹4,999', '₹9,999', '₹19,999']) expect(terms).toContain(p);
  });

  test('care plan price is shown', async ({ page }) => {
    await page.goto(PAGE_URL);
    await expect(page.locator('.care-price')).toHaveText('₹1,999');
  });

  test('footer shows copyright, place and legal links', async ({ page }) => {
    await page.goto(PAGE_URL);
    await expect(page.locator('.footer-base')).toContainText('© 2026 PromptKaro');
    await expect(page.locator('.footer-base')).toContainText('Idar');
    await expect(page.locator('a[href="/privacy.html"]')).toHaveCount(1);
    await expect(page.locator('a[href="/terms.html"]')).toHaveCount(1);
  });

  test('legal pages use the new system and load', async ({ page }) => {
    for (const url of ['/privacy.html', '/terms.html']) {
      await page.goto(url);
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('.legal-header .wordmark')).toBeVisible();
    }
  });
});

test.describe('8. Design rules (anti-slop lint)', () => {
  const css = ['css/style.css', 'css/motion.css', 'css/legal.css'].map(read).join('\n');
  const html = read('index.html');

  test('no transition: all, no width/height animation', () => {
    expect(css).not.toMatch(/transition:\s*all/);
    expect(css).not.toMatch(/transition:[^;]*\b(width|height|top|left)\b/);
  });

  test('no banned fonts, no monospace, no third-party font CDNs', () => {
    expect(css + html).not.toMatch(/Inter\b|Roboto|Poppins|Space Grotesk|Clash Display|Satoshi|JetBrains/);
    expect(css).not.toMatch(/monospace/);
    expect(html).not.toMatch(/fonts\.googleapis|fontshare/);
  });

  test('no emoji used as icons, no invented stats', () => {
    // The single 👍 lives inside the WhatsApp chat as message content.
    const withoutChat = html.replace(/<ol class="chat-list"[\s\S]*?<\/ol>/, '');
    expect(withoutChat).not.toMatch(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u);
    expect(html).not.toMatch(/100%|satisfaction|happy clients|\d+\+ projects/i);
  });

  test('every animation has a reduced-motion fallback', () => {
    expect(css).toMatch(/prefers-reduced-motion:\s*reduce/);
  });
});
