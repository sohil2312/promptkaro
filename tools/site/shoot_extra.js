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
  for (const k of ['dash-furniture', 'dash-manufacturer', 'dash-wedding', 'dash-interior']) {
    await q.goto('http://localhost:4100/tools/samples/' + k, { waitUntil: 'networkidle' });
    await q.evaluate(() => document.fonts.ready);
    await q.screenshot({ path: 'tools/samples/out/' + k + '.png' });
  }
  await b.close();
})();
