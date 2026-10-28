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
    await expect(page.locator('h1')).toContainText('Pay only if you like');
  });

  test('every section has a heading', async ({ page }) => {
    await page.goto(PAGE_URL);
    for (const id of ['#work', '#how', '#products', '#agents', '#types', '#about', '#faq']) {
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

  for (const width of [320, 360, 768]) {
    test(`nothing spills past the screen at ${width}px, in English and Gujarati`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const lang of ['en', 'gu']) {
        await page.goto(PAGE_URL);
        if (lang === 'gu') await page.locator('#langToggle').click();
        const spill = await page.evaluate(() => [...document.querySelectorAll('main *')].filter((e) => {
          const r = e.getBoundingClientRect();
          if (!(r.width > 0 && (r.right > innerWidth + 1 || r.left < -1))) return false;
          for (let a = e.parentElement; a && a !== document.body; a = a.parentElement) {
            if (getComputedStyle(a).overflowX !== 'visible') return false; // inside a scroller on purpose
          }
          return true;
        }).map((e) => e.className).slice(0, 5));
        expect(spill, lang).toEqual([]);
      }
    });
  }

  test('contact details never break mid-word on tablets', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1000 });
    await page.goto(PAGE_URL);
    const narrow = await page.locator('.contact-list > div').evaluateAll((els) => els.filter((e) => e.getBoundingClientRect().width < 200).length);
    expect(narrow).toBe(0);
  });

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

    await page.locator('#tab-coaching').click();
    await expect(page.locator('#panel-coaching')).toBeVisible();
    await expect(page.locator('#panel-mobile')).toBeHidden();
    await expect(page.locator('#tab-coaching')).toHaveAttribute('aria-selected', 'true');

    await page.keyboard.press('ArrowRight');
    await expect(page.locator('#tab-food')).toBeFocused();
    await expect(page.locator('#panel-food')).toBeVisible();
    await page.keyboard.press('ArrowUp'); // the list runs down the side on wide screens
    await expect(page.locator('#panel-coaching')).toBeVisible();
    await page.keyboard.press('Home');
    await expect(page.locator('#panel-mobile')).toBeVisible();
  });

  test('examples are full landing pages that tour themselves, then hand over', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(PAGE_URL);
    const view = page.locator('#panel-mobile .site-view');
    await expect(view.locator('img')).toHaveAttribute('src', '/assets/img/site-mobile.webp');
    await page.locator('#showcase').scrollIntoViewIfNeeded();
    await expect.poll(() => view.evaluate((v) => v.scrollTop), { timeout: 6000 }).toBeGreaterThan(40);
    // scrolling yourself ends the tour for that preview
    await view.hover();
    await page.mouse.wheel(0, 10);
    await expect(view).toHaveAttribute('data-toured', 'user');
    // every preview is a long page, taller than its window
    for (const key of ['mobile', 'furniture', 'interior', 'boutique', 'property', 'manufacturer', 'wedding', 'handicrafts', 'clinic', 'coaching', 'food']) {
      const h = await page.locator(`#panel-${key} .site-view img`).getAttribute('height');
      expect(Number(h)).toBeGreaterThan(1500);
    }
  });

  test('product cards fill themselves in when scrolled into view', async ({ page }) => {
    await page.goto(PAGE_URL);
    for (const demo of ['search', 'catalog', 'assistant', 'chart']) {
      const card = page.locator(`.product[data-demo="${demo}"]`);
      await card.scrollIntoViewIfNeeded();
      await expect(card).not.toHaveClass(/is-armed/, { timeout: 12000 });
    }
    await expect(page.locator('.frag-chart [data-count]')).toHaveText('39');
    await expect(page.locator('.frag-chip-wa')).toBeVisible();
    await expect(page.locator('.frag-share')).toHaveCount(2);
    for (const share of await page.locator('.frag-share').all()) await expect(share).toBeVisible();
  });

  test('AI shopping assistant understands the request and picks matching products', async ({ page }) => {
    await page.goto(PAGE_URL);
    const card = page.locator('.product[data-demo="assistant"]');
    await card.scrollIntoViewIfNeeded();
    await expect(card).not.toHaveClass(/is-armed/, { timeout: 15000 });
    await expect(card.locator('.ai-query')).toHaveText('Phone under ₹15,000 with a good camera');
    await expect(card.locator('.ai-steps .wa-agent')).toHaveCount(3);
    await expect(card.locator('.ai-pick')).toHaveCount(3);
    await expect(card.locator('.ai-pick.is-best')).toHaveCount(1);
    for (const img of await card.locator('.ai-pick img').all()) {
      await expect.poll(() => img.evaluate((i) => i.complete && i.naturalWidth > 0)).toBe(true);
    }
  });

  test('product visuals are rendered photos that load, not vector icons', async ({ page }) => {
    await page.goto(PAGE_URL);
    await expect(page.locator('.frag-tiles svg')).toHaveCount(0);
    const imgs = page.locator('.frag-tiles .turn img');
    await expect(imgs).toHaveCount(4);
    await page.locator('.products').scrollIntoViewIfNeeded();
    for (const img of await imgs.all()) {
      await expect.poll(() => img.evaluate((i) => i.complete && i.naturalWidth > 0)).toBe(true);
      expect(await img.getAttribute('width')).toBe('450'); // explicit size, no layout shift
    }
    await expect(page.locator('.map-pin img')).toHaveCount(1);
  });

  test('on desktop the products turn with the mouse (turntable sprites)', async ({ page }, info) => {
    test.skip(info.project.name !== 'Desktop Chrome', 'turntables load only for a fine pointer');
    await page.goto(PAGE_URL);
    const card = page.locator('.product-marigold');
    await card.scrollIntoViewIfNeeded();
    const turn = card.locator('.turn').first();
    await expect(turn).toHaveClass(/is-sprite/, { timeout: 10000 });
    const box = await card.boundingBox();
    await page.mouse.move(box.x + 10, box.y + box.height / 2);
    await page.waitForTimeout(700);
    const left = await turn.evaluate((t) => t.style.backgroundPosition);
    await page.mouse.move(box.x + box.width - 10, box.y + box.height / 2, { steps: 8 });
    await page.waitForTimeout(700);
    const right = await turn.evaluate((t) => t.style.backgroundPosition);
    expect(left).not.toBe(right);
  });

  test('each product hands off to a WhatsApp conversation', async ({ page }) => {
    await page.goto(PAGE_URL);
    for (const demo of ['search', 'catalog', 'assistant']) {
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

  test('agent console plays a scenario: message, logged steps, auto-reply', async ({ page }) => {
    await page.goto(PAGE_URL);
    await page.locator('#agentStage').scrollIntoViewIfNeeded();
    await page.getByRole('tab', { name: 'Appointments' }).click();
    await expect(page.locator('#agentState')).toHaveText(/Done in \d+\.\ds/, { timeout: 12000 });
    await expect(page.locator('#agentLog .log-step.is-done')).toHaveCount(4);
    await expect(page.locator('#agentLog .log-step.is-working')).toHaveCount(0);
    await expect(page.locator('#agentChat .msg-out .msg-agent').first()).toHaveText('AI agent');
    await expect(page.locator('#agentChat')).toContainText('token is 14');
    await expect(page.locator('#agentCustomer')).toHaveText('Meena P.');
    await expect(page.locator('#agentPause')).toHaveText('Play all'); // clicking a tab hands control to the visitor
  });

  test('agent console keyboard tabs switch scenarios', async ({ page }) => {
    await page.goto(PAGE_URL);
    await page.getByRole('tab', { name: 'Orders' }).focus();
    await page.keyboard.press('End');
    await expect(page.locator('#atab-11')).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#agentBiz')).toHaveText('Kala Haat');
  });

  test('automated dashboard fills itself: orders arrive, numbers and rules update', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(PAGE_URL);
    const db = page.locator('#dashboard');
    await db.scrollIntoViewIfNeeded();
    // rewound to earlier today, then the live orders arrive
    await expect(page.locator('#kpiOrders')).toHaveText('23', { timeout: 15000 });
    await expect(page.locator('#kpiRevenue')).toHaveText('₹48,620');
    await expect(page.locator('#kpiChats')).toHaveText('61');
    await expect(page.locator('#dbOrders tr').first()).toContainText('#1042');
    await expect(page.locator('#dbOrders tr')).toHaveCount(5);
    await expect(page.locator('#dbStock [data-sku="earbuds"]')).toHaveClass(/is-low/);
    await expect(page.locator('#dbReorder')).toBeVisible();
    await expect(page.locator('[data-rule="receipt"]')).toHaveText('23');
    await expect(page.locator('[data-rule="reorder"]')).toHaveText('1');
    await expect(page.locator('#dbFeed li').first()).toContainText('Receipt sent to Hetal D.');
    // a real dashboard: chart, channels, insights and stock, not just bars
    for (const sel of ['.db-chart', '.db-channels', '.db-insights', '.db-stock', '.db-side']) {
      await expect(db.locator(sel)).toBeVisible();
    }
  });

  test('bot vs AI agent: same message, the agent books and the bot loops', async ({ page }) => {
    await page.goto(PAGE_URL);
    await page.locator('#compare').scrollIntoViewIfNeeded();
    await expect(page.locator('#compareReplay')).toBeVisible({ timeout: 12000 });
    const bot = page.locator('.compare-bot');
    const agent = page.locator('.compare-agent');
    await expect(bot.locator('.msg-bot').first()).toHaveText('Bot');
    await expect(agent.locator('.msg-agent')).toHaveText('AI agent');
    await expect(bot.locator('.cmp-outcome')).toHaveClass(/is-bad/);
    await expect(agent.locator('.cmp-outcome')).toHaveClass(/is-good/);
    await expect(agent.locator('.wa-agent')).toHaveCount(3);
    await expect(bot.locator('.msg-menu')).toBeVisible();
    // labels look different, not just read different
    const botBg = await bot.locator('.kind-tag').evaluate((e) => getComputedStyle(e).backgroundColor);
    const agentBg = await agent.locator('.kind-tag').evaluate((e) => getComputedStyle(e).backgroundColor);
    expect(botBg).not.toBe(agentBg);
  });

  test('site types: six realistic device views, each asking for a quote', async ({ page }) => {
    await page.goto(PAGE_URL);
    const cards = page.locator('#types .type-card');
    await expect(cards).toHaveCount(6);
    await page.locator('#types').scrollIntoViewIfNeeded();
    for (const card of await cards.all()) {
      const img = card.locator('.type-visual > img');
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((i) => i.complete && i.naturalWidth > 0)).toBe(true);
      expect(await img.getAttribute('src')).toMatch(/\/assets\/img\/device-[a-z]+\.webp$/);
      const href = decodeURIComponent(await card.locator('.js-wa').getAttribute('href'));
      expect(href).toContain('quote');
    }
    await expect(page.locator('#types svg')).toHaveCount(0);
  });

  test('the motion example plays its recording only while on screen', async ({ page }) => {
    await page.goto(PAGE_URL);
    const video = page.locator('#motionVideo');
    await expect.poll(() => video.evaluate((v) => v.paused)).toBe(true);
    await video.scrollIntoViewIfNeeded();
    await expect.poll(() => video.evaluate((v) => !v.paused && v.currentTime > 0), { timeout: 8000 }).toBe(true);
    await page.locator('#faq').scrollIntoViewIfNeeded();
    await expect.poll(() => video.evaluate((v) => v.paused)).toBe(true);
  });

  test('headline word rotates without moving the page, and reads as one sentence', async ({ page }) => {
    await page.setViewportSize({ width: 412, height: 915 });
    await page.goto(PAGE_URL);
    const h1 = page.locator('h1');
    const before = (await h1.boundingBox()).height;
    await expect(page.locator('#heroWord .rot-word').first()).toHaveText('AI agent', { timeout: 9000 });
    await expect(page.locator('#heroWord .rot-word').first()).toHaveText('dashboard', { timeout: 15000 });
    expect(Math.abs((await h1.boundingBox()).height - before)).toBeLessThan(2);
    await expect(h1.locator('.visually-hidden')).toHaveText('See your website first. Pay only if you like it.');
    // the text column uses the phone's width
    const lead = await page.locator('.hero-lead').boundingBox();
    expect(lead.width).toBeGreaterThan(412 - 2 * 16 - 8);
  });

  test('hero stage shows what the headline names, one thing at a time', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(PAGE_URL);
    const word = page.locator('#heroWord .rot-word').last();
    const device = page.locator('#stageDevice');
    // the stage starts on the headline's top line (measured after the entrance settles)
    await page.waitForTimeout(1000);
    const h1 = await page.locator('.hero-title').boundingBox();
    const stage = await device.boundingBox();
    expect(Math.abs(stage.y - h1.y)).toBeLessThan(16);
    // website: a site in the browser
    await expect(word).toHaveText('website');
    await expect(device).toHaveAttribute('data-mode', 'browser');
    await expect(page.locator('#stageUrl')).toHaveText('studioaakar.in');
    // AI agent: the browser folds into the phone and the agent works
    await expect(word).toHaveText('AI agent', { timeout: 9000 });
    await expect(device).toHaveAttribute('data-mode', 'phone', { timeout: 3000 });
    await expect(page.locator('.stage-browser')).toBeHidden();
    await expect(page.locator('#chatList .msg-agent').last()).toBeVisible({ timeout: 12000 });
    await expect(page.locator('#stageDots button')).toHaveCount(5);
    await expect(page.locator('#stageDots button').nth(1)).toHaveAttribute('aria-current', 'true');
    // pause holds the scene; a dot jumps to any example and the word follows
    await page.locator('#stagePause').click();
    await expect(page.locator('#stagePause')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#stageDots button').nth(2).click();
    await expect(device).toHaveAttribute('data-mode', 'browser');
    await expect(page.locator('#stageUrl')).toHaveText('dashboard.shreejimobile.in');
    await expect(page.locator('#stageKind')).toHaveText('Dashboard');
    await expect(word).toHaveText('dashboard', { timeout: 3000 });
    await expect(page.locator('.stage-phone')).toBeHidden();
  });

  test('site types show live screens warped onto the rendered devices', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(PAGE_URL);
    for (const sel of ['.type-onepage .type-live', '.type-multipage .type-live']) {
      const box = page.locator(sel);
      await box.scrollIntoViewIfNeeded();
      await expect(box).toHaveClass(/is-mapped/);
      const t = await box.locator('.type-screen').evaluate((e) => getComputedStyle(e).transform);
      expect(t).toContain('matrix3d');
    }
    const chips = page.locator('.type-multipage .type-pages li.is-on');
    const first = await chips.textContent();
    await expect.poll(() => chips.textContent(), { timeout: 6000 }).not.toBe(first);
  });

  test('dashboards for other businesses switch with tabs', async ({ page }) => {
    await page.goto(PAGE_URL);
    await expect(page.locator('.dash-more [role="tab"]')).toHaveCount(7);
    await expect(page.locator('#dpanel-furniture')).toBeVisible();
    await page.locator('#dtab-wedding').click();
    await expect(page.locator('#dpanel-wedding')).toBeVisible();
    await expect(page.locator('#dpanel-furniture')).toBeHidden();
    const img = page.locator('#dpanel-wedding img');
    await expect.poll(() => img.evaluate((i) => i.complete && i.naturalWidth)).toBe(1800);
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
    await expect(page.locator('h1')).toContainText('ગમે તો જ પૈસા');
    const href = await page.locator('#heroCta').getAttribute('href');
    expect(decodeURIComponent(href)).toContain('મફત ડેમો');

    await page.reload();
    await expect(page.locator('h1')).toContainText('ગમે તો જ પૈસા'); // persisted

    await page.locator('#langToggle').click();
    await expect(page.locator('h1')).toContainText('Pay only if you like');
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
    await expect(page.locator('.stage-browser')).toBeVisible();
    await expect(page.locator('#chatList .msg')).toHaveCount(4);
    await expect(page.locator('#chatList .msg').last()).toBeVisible();
    for (const id of ['#panel-mobile', '#panel-furniture', '#panel-interior', '#panel-boutique', '#panel-property', '#panel-manufacturer', '#panel-wedding', '#panel-handicrafts', '#panel-clinic', '#panel-coaching', '#panel-food']) {
      await expect(page.locator(id)).toBeVisible();
    }
    await expect(page.locator('#types .type-card')).toHaveCount(6);
    await expect(page.locator('.site-view img')).toHaveCount(11);
    await expect(page.locator('.dash-panel')).toHaveCount(7);
    await expect(page.locator('.ai-pick')).toHaveCount(3);
    await expect(page.locator('.frag-tiles li')).toHaveCount(4);
    await expect(page.locator('.frag-result')).toBeVisible();
    await expect(page.locator('.frag-chart [data-count]')).toHaveText('39');
    await expect(page.locator('#agentChat .msg')).toHaveCount(4);
    await expect(page.locator('#agentLog .log-step')).toHaveCount(5);
    await expect(page.locator('#kpiRevenue')).toHaveText('₹48,620');
    await expect(page.locator('#dbOrders tr')).toHaveCount(5);
    await expect(page.locator('.agent-tabs')).toBeHidden();
    await expect(page.locator('.compare .cmp-outcome.is-good')).toBeVisible();
    await expect(page.locator('.compare-bot .msg')).toHaveCount(6);
    await expect(page.locator('[data-rule="reorder"]')).toHaveText('1');
    await ctx.close();
  });

  test('reduced motion shows the whole conversation without playing it', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(PAGE_URL);
    await page.waitForTimeout(800);
    await expect(page.locator('#chatList .is-pending')).toHaveCount(0);
    await expect(page.locator('#chatReplay')).toBeHidden();
    // the dots still switch the stage, and the headline word follows without animating
    await page.locator('#stageDots button').nth(1).click();
    await expect(page.locator('#stageDevice')).toHaveAttribute('data-mode', 'phone');
    await expect(page.locator('#heroWord .rot-word')).toHaveText('AI agent');
    await page.locator('#showcase').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);
    expect(await page.locator('#panel-mobile .site-view').evaluate((v) => v.scrollTop)).toBe(0); // no auto tour
    await expect(page.locator('.product.is-armed')).toHaveCount(0);
    await expect(page.locator('#kpiOrders')).toHaveText('23'); // dashboard shown complete
    await page.locator('#motionVideo').scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    expect(await page.locator('#motionVideo').evaluate((v) => v.paused)).toBe(true);
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
    await expect(page.locator('#showcase [role="tab"]')).toHaveCount(11);
    await expect(page.locator('#agentsApp [role="tab"]')).toHaveCount(12);
    const tabs = page.getByRole('tab');
    for (const tab of await tabs.all()) {
      const controls = await tab.getAttribute('aria-controls');
      await expect(page.locator(`#${controls}`)).toHaveAttribute('role', 'tabpanel');
    }
  });
});

test.describe('7. Content', () => {
  test('no fixed prices or time promises: quotes on request', async ({ page }) => {
    await page.goto(PAGE_URL);
    const text = await page.locator('body').innerText();
    expect(text).not.toMatch(/₹\s?(4,999|9,999|19,999|1,999)/);
    expect(text).not.toMatch(/48\s?(hours|hrs?|h)\b/i);
    expect(text).not.toMatch(/calculator|EMI/);
    await expect(page.locator('#types')).toContainText('quote');
    const terms = read('terms.html');
    expect(terms).not.toMatch(/₹4,999|48 ?h(ou)?r/i);
    expect(terms).toContain('quote');
  });

  test('no phone number on display and no town names for now', async ({ page }) => {
    for (const url of ['/', '/terms.html', '/privacy.html']) {
      await page.goto(url);
      const text = await page.locator('body').innerText();
      expect(text, url).not.toMatch(/94290|9429051036|\+91/);
      expect(text, url).not.toMatch(/Idar|Himatnagar|Himmatnagar|Sabarkantha|ઇડર|હિંમતનગર/i);
    }
    await page.goto(PAGE_URL);
    await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
  });

  test('wordmark caret sits on the baseline at cap height', async ({ page }) => {
    await page.goto(PAGE_URL);
    const m = await page.evaluate(async () => {
      await document.fonts.ready;
      const w = document.querySelector('.site-header .wordmark');
      const probe = document.createElement('span');
      probe.style.cssText = 'display:inline-block;width:0;height:0';
      w.querySelector('.wordmark-karo').appendChild(probe);
      const base = probe.getBoundingClientRect().top;
      probe.remove();
      const c = w.querySelector('.wordmark-cursor').getBoundingClientRect();
      const fs = parseFloat(getComputedStyle(w).fontSize);
      return { bottom: c.bottom - base, height: c.height / fs };
    });
    expect(Math.abs(m.bottom)).toBeLessThan(1);
    expect(m.height).toBeGreaterThan(0.64);
    expect(m.height).toBeLessThan(0.72);
  });

  test('footer shows copyright and legal links', async ({ page }) => {
    await page.goto(PAGE_URL);
    await expect(page.locator('.footer-base')).toContainText('© 2026 PromptKaro');
    await expect(page.locator('a[href="/privacy.html"]')).toHaveCount(1);
    await expect(page.locator('a[href="/terms.html"]')).toHaveCount(1);
  });

  test('a missing page shows the branded 404 with a way back', () => {
    const notFound = read('404.html');
    expect(notFound).toContain('href="/"');
    expect(notFound).toContain('wa.me/919429051036');
    expect(notFound).toContain('wordmark');
  });

  test('sample sites each have their own layout and never repeat a photo in a row', () => {
    const keys = ['mobile', 'clinic', 'coaching', 'food', 'property', 'interior', 'boutique', 'wedding', 'handicrafts', 'furniture', 'manufacturer'];
    const pages = keys.map((k) => read(`tools/samples/${k}.html`));
    const bodies = pages.map((h) => h.replace(/<style>[\s\S]*?<\/style>/, '').replace(/>[^<]*</g, '><'));
    expect(new Set(bodies).size).toBe(keys.length); // different markup, not one template recoloured
    for (const [i, h] of pages.entries()) {
      const imgs = [...h.matchAll(/<img[^>]+src="([^"]+)"/g)].map((m) => m[1]);
      const counts = imgs.reduce((c, src) => ({ ...c, [src]: (c[src] || 0) + 1 }), {});
      expect(Math.max(...Object.values(counts)), keys[i]).toBeLessThanOrEqual(2);
    }
  });

  test('previews use a phone-sized screenshot on phones', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(PAGE_URL);
    const img = page.locator('#panel-mobile .site-view img');
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate((i) => i.currentSrc)).toContain('site-mobile-m.webp');
  });

  test('image credits name every open model with its licence', async ({ page }) => {
    await page.goto('/credits.html');
    await expect(page.locator('h1')).toHaveText('Image credits');
    await expect(page.locator('main li')).toHaveCount(16);
    await expect(page.locator('main li a[href*="creativecommons.org"]')).toHaveCount(16);
    await page.goto(PAGE_URL);
    await expect(page.locator('a[href="/credits.html"]')).toHaveCount(1);
  });

  test('legal pages use the new system and load', async ({ page }) => {
    for (const url of ['/privacy.html', '/terms.html', '/credits.html', '/404.html']) {
      await page.goto(url);
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('.legal-header .wordmark')).toBeVisible();
    }
  });
});

test.describe('9. Layout rules (Refactoring UI, Practical UI, Laws of UX)', () => {
  for (const width of [1440, 768, 390]) {
    test(`type scale, 4px grid and 44px targets at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(PAGE_URL);
      const v = await page.evaluate(() => {
        const out = { sizes: new Set(), grid: [], targets: [], cut: [] };
        for (const e of document.querySelectorAll('body *')) {
          if (e.closest('[data-ui],svg,.visually-hidden,[hidden],.sprite') || !e.getBoundingClientRect().width) continue;
          const cs = getComputedStyle(e);
          if ([...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) {
            const fs = parseFloat(cs.fontSize);
            if (fs < 30) out.sizes.add(Math.round(fs));
            if (cs.textOverflow === 'ellipsis' && e.scrollWidth > e.clientWidth + 1) out.cut.push(e.className);
          }
          for (const k of ['marginTop', 'marginBottom', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'rowGap', 'columnGap']) {
            const px = parseFloat(cs[k]);
            if (px > 0 && px % 4 !== 0 && !(k === 'marginTop' && e.matches('.btn'))) out.grid.push(`${e.className} ${k}=${px}`);
          }
          if (e.matches('a, button, [role=tab], summary') && !e.closest('p, .footer-links, dd, .ticks-list')) {
            const r = e.getBoundingClientRect();
            if (r.height < 44) out.targets.push(`${e.className || e.textContent.trim().slice(0, 20)} ${Math.round(r.height)}`);
          }
        }
        return { sizes: [...out.sizes].sort((a, b) => a - b), grid: out.grid, targets: out.targets, cut: out.cut };
      });
      // small text comes from one scale: 13, 15, 16, 18, 20–24 and the logo
      for (const sz of v.sizes) expect([13, 15, 16, 18, 20, 21, 22, 23, 24, 25, 26, 27, 28], `font ${sz}px`).toContain(sz);
      expect(v.grid).toEqual([]);
      expect(v.targets).toEqual([]);
      expect(v.cut).toEqual([]);
    });
  }

  test('CSS and JS are versioned by content so a deploy never mixes old and new files', () => {
    for (const f of ['index.html', 'terms.html', 'privacy.html', 'credits.html', '404.html']) {
      const refs = [...read(f).matchAll(/(?:href|src)="(\/(?:css|js)\/[^"]+)"/g)].map((m) => m[1]);
      expect(refs.length, f).toBeGreaterThan(0);
      for (const r of refs) expect(r, f).toMatch(/\?v=[0-9a-f]{10}$/);
    }
    expect(read('css/legal.css')).not.toContain('@import');
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
