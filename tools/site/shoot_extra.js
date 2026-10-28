// Extra screenshots: the furniture site's pages (first screen) and the business dashboards (2x).
// From the repo root with `npx serve . -p 4100` running:  node tools/site/shoot_extra.js
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const d = await b.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1.5 });
  for (const k of ['furniture', 'furniture-sofas', 'furniture-custom', 'furniture-visit']) {
    await d.goto('http://localhost:4100/tools/samples/' + k, { waitUntil: 'networkidle' });
    await d.evaluate(() => document.fonts.ready);
    await d.screenshot({ path: 'tools/samples/out/' + k + '-first.png' });
  }
  const q = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.25 });
  for (const k of ['dash-furniture', 'dash-manufacturer', 'dash-wedding', 'dash-interior', 'dash-boutique', 'dash-handicrafts', 'dash-realestate']) {
    await q.goto('http://localhost:4100/tools/samples/' + k, { waitUntil: 'networkidle' });
    await q.evaluate(() => document.fonts.ready);
    await q.screenshot({ path: 'tools/samples/out/' + k + '.png' });
  }
  // The live mobile-shop dashboard as it looks on a phone, for the hero stage on phones.
  const m = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
  await m.goto('http://localhost:4100/', { waitUntil: 'networkidle' });
  await m.evaluate(() => document.querySelectorAll('#dashboard img').forEach((i) => { i.loading = 'eager'; }));
  await m.locator('#dashboard').scrollIntoViewIfNeeded(); await m.waitForTimeout(800);
  await m.locator('#dashboard').screenshot({ path: 'tools/samples/out/dashboard-mob.png' });
  await b.close();
})();
