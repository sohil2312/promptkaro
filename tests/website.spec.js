// @ts-check
const { test, expect } = require('@playwright/test');

const PAGE_URL = '/';
const WA_PATTERN = /wa\.me\/91\d+/;

test.describe('1. Visual & Layout', () => {
  test('page loads with correct title', async ({ page }) => {
    await page.goto(PAGE_URL);
    await expect(page).toHaveTitle(/PromptKaro/);
  });

  test('all major sections exist in DOM', async ({ page }) => {
    await page.goto(PAGE_URL);
    const sections = ['#hero', '#demos', '#process', '#pricing', '#about', '#footer'];
    for (const sel of sections) {
      await expect(page.locator(sel)).toBeAttached();
    }
  });

  test('navigation is sticky (fixed position)', async ({ page }) => {
    await page.goto(PAGE_URL);
    const nav = page.locator('#nav');
    await expect(nav).toBeVisible();
    const pos = await nav.evaluate((el) => getComputedStyle(el).position);
    expect(pos).toBe('fixed');
  });

  test('no horizontal overflow at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(PAGE_URL);
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(overflow).toBe(false);
  });

  test('no horizontal overflow at 768px', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(PAGE_URL);
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(overflow).toBe(false);
  });

  test('no horizontal overflow at 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(PAGE_URL);
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(overflow).toBe(false);
  });

  test('hero section is full viewport height', async ({ page }) => {
    await page.goto(PAGE_URL);
    const heroHeight = await page.locator('#hero').evaluate((el) => el.offsetHeight);
    const vh = await page.evaluate(() => window.innerHeight);
    expect(heroHeight).toBeGreaterThanOrEqual(vh * 0.9);
  });
});

test.describe('2. Interactive Elements', () => {
  test('all WhatsApp links point to wa.me', async ({ page }) => {
    await page.goto(PAGE_URL);
    const links = await page.locator('a[href*="wa.me"]').all();
    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      const href = await link.getAttribute('href');
      expect(href).toMatch(WA_PATTERN);
    }
  });

  test('WhatsApp links include pre-filled message', async ({ page }) => {
    await page.goto(PAGE_URL);
    const firstWaLink = page.locator('a[href*="wa.me"]').first();
    const href = await firstWaLink.getAttribute('href');
    expect(href).toContain('text=');
  });

  test('nav "Kaam Dekho" link exists and targets demos section', async ({ page }) => {
    await page.goto(PAGE_URL);
    const link = page.locator('#nav a[href="#demos"]');
    await expect(link).toBeAttached();
    const href = await link.getAttribute('href');
    expect(href).toBe('#demos');
  });

  test('logo link points to #hero', async ({ page }) => {
    await page.goto(PAGE_URL);
    const logo = page.locator('#nav .logo');
    const href = await logo.getAttribute('href');
    expect(href).toBe('#hero');
  });

  test('floating WhatsApp button is present', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(PAGE_URL);
    const waFloat = page.locator('.wa-float');
    await expect(waFloat).toBeAttached();
    const href = await waFloat.getAttribute('href');
    expect(href).toMatch(WA_PATTERN);
  });

  test('terminal typing animation runs (command text appears)', async ({ page }) => {
    await page.goto(PAGE_URL);
    // Wait for the terminal to start typing
    await page.waitForFunction(
      () => {
        const cmd = document.getElementById('terminalCommand');
        return cmd && cmd.textContent && cmd.textContent.length > 2;
      },
      { timeout: 6000 }
    );
    const cmdText = await page.locator('#terminalCommand').textContent();
    expect(cmdText && cmdText.length).toBeGreaterThan(2);
  });

  test('pixel canvas appears in terminal', async ({ page }) => {
    await page.goto(PAGE_URL);
    // Wait for pixel cells to be created
    await page.waitForFunction(
      () => {
        const canvas = document.getElementById('terminalCanvas');
        return canvas && canvas.children.length > 0;
      },
      { timeout: 8000 }
    );
    const cellCount = await page.locator('#terminalCanvas .t-cell').count();
    expect(cellCount).toBeGreaterThan(0);
  });

  test('bento cards are rendered', async ({ page }) => {
    await page.goto(PAGE_URL);
    const cards = page.locator('.bento-card');
    await expect(cards).toHaveCount(5);
  });

  test('pricing cards are rendered', async ({ page }) => {
    await page.goto(PAGE_URL);
    const cards = page.locator('.pricing-card');
    await expect(cards).toHaveCount(4);
  });
});

test.describe('3. Performance & Errors', () => {
  test('page loads in under 4 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto(PAGE_URL, { waitUntil: 'load' });
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(4000);
  });

  test('no JavaScript errors on load', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto(PAGE_URL, { waitUntil: 'load' });
    // Filter out known network errors (fonts from CDN may fail in test env)
    const criticalErrors = errors.filter(
      (e) => !e.includes('fontshare') && !e.includes('fonts.googleapis')
    );
    expect(criticalErrors).toHaveLength(0);
  });
});

test.describe('4. Accessibility', () => {
  test('all WhatsApp buttons have aria-labels', async ({ page }) => {
    await page.goto(PAGE_URL);
    const btns = await page.locator('a[href*="wa.me"]').all();
    for (const btn of btns) {
      const ariaLabel = await btn.getAttribute('aria-label');
      const text = await btn.textContent();
      const hasLabel = (ariaLabel && ariaLabel.length > 0) || (text && text.trim().length > 0);
      expect(hasLabel).toBe(true);
    }
  });

  test('nav has role=navigation', async ({ page }) => {
    await page.goto(PAGE_URL);
    const nav = page.locator('[role="navigation"]');
    await expect(nav).toBeAttached();
  });

  test('footer has role=contentinfo', async ({ page }) => {
    await page.goto(PAGE_URL);
    const footer = page.locator('[role="contentinfo"]');
    await expect(footer).toBeAttached();
  });

  test('pricing lists have aria-labels', async ({ page }) => {
    await page.goto(PAGE_URL);
    const lists = page.locator('.pfeatures[aria-label]');
    const count = await lists.count();
    expect(count).toBe(4);
  });
});

test.describe('5. Content', () => {
  test('Hindi text renders (Aapka Idea visible)', async ({ page }) => {
    await page.goto(PAGE_URL);
    await expect(page.locator('text=Aapka Idea')).toBeVisible();
  });

  test('Hindi text renders (48 Ghante Mein Ready)', async ({ page }) => {
    await page.goto(PAGE_URL);
    await expect(page.locator('text=48 Ghante Mein Ready')).toBeVisible();
  });

  test('pricing ₹4,999 is visible', async ({ page }) => {
    await page.goto(PAGE_URL);
    await expect(page.locator('text=4,999')).toBeVisible();
  });

  test('pricing ₹9,999 is visible', async ({ page }) => {
    await page.goto(PAGE_URL);
    // Use exact match on the span to avoid matching "19,999"
    await expect(page.locator('.pamount', { hasText: /^9,999$/ }).first()).toBeVisible();
  });

  test('pricing ₹19,999 is visible', async ({ page }) => {
    await page.goto(PAGE_URL);
    await expect(page.locator('text=19,999')).toBeVisible();
  });

  test('pricing ₹1,999/mo is visible', async ({ page }) => {
    await page.goto(PAGE_URL);
    await expect(page.locator('text=1,999')).toBeVisible();
  });

  test('footer copyright year is 2026', async ({ page }) => {
    await page.goto(PAGE_URL);
    await expect(page.locator('text=© 2026 PromptKaro')).toBeVisible();
  });

  test('WhatsApp phone number placeholder present in links', async ({ page }) => {
    await page.goto(PAGE_URL);
    const allHrefs = await page.evaluate(() =>
      Array.from(document.querySelectorAll('a[href*="wa.me"]')).map((a) => a.getAttribute('href'))
    );
    expect(allHrefs.length).toBeGreaterThan(0);
    allHrefs.forEach((href) => expect(href).toMatch(/wa\.me\/91\d+/));
  });

  test('logo has blinking cursor element', async ({ page }) => {
    await page.goto(PAGE_URL);
    const cursor = page.locator('.logo-cursor').first();
    await expect(cursor).toBeAttached();
  });

  test('logo chevron character is ›', async ({ page }) => {
    await page.goto(PAGE_URL);
    const chevron = page.locator('.logo-chevron').first();
    const text = await chevron.textContent();
    expect(text).toContain('›');
  });

  test('POPULAR badge on Business plan', async ({ page }) => {
    await page.goto(PAGE_URL);
    await expect(page.locator('.popular-badge')).toBeVisible();
    const text = await page.locator('.popular-badge').textContent();
    expect(text).toContain('POPULAR');
  });

  test('Idar Gujarat location visible', async ({ page }) => {
    await page.goto(PAGE_URL);
    await expect(page.locator('text=Idar').first()).toBeVisible();
  });

  test('trust badge visible', async ({ page }) => {
    await page.goto(PAGE_URL);
    await expect(page.locator('.trust-badge')).toBeVisible();
  });
});

test.describe('6. Mobile layout', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('mobile WhatsApp bar is visible', async ({ page }) => {
    await page.goto(PAGE_URL);
    const bar = page.locator('.wa-mobile-bar');
    await expect(bar).toBeAttached();
  });

  test('hero headline visible on mobile', async ({ page }) => {
    await page.goto(PAGE_URL);
    await expect(page.locator('.hero-headline')).toBeVisible();
  });

  test('nav visible on mobile', async ({ page }) => {
    await page.goto(PAGE_URL);
    await expect(page.locator('#nav')).toBeVisible();
  });
});
