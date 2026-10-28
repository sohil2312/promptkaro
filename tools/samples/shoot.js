// Screenshots the sample sites: full-length desktop (for scrolling previews), first-screen
// desktop and mobile (for device renders). From the repo root with `npx serve . -p 4100` running:
//   node tools/samples/shoot.js
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const OUT = path.join(__dirname, 'out');
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  const only = process.argv[2] ? process.argv[2].split(',') : null;
  for (const key of ['mobile', 'clinic', 'coaching', 'food', 'property', 'interior', 'boutique', 'wedding', 'handicrafts', 'furniture', 'manufacturer'].filter((k) => !only || only.includes(k))) {
    const url = `http://localhost:4100/tools/samples/${key}`;
    const d = await b.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1.5 });
    await d.goto(url, { waitUntil: 'networkidle' }); await d.evaluate(() => document.fonts.ready);
    await d.screenshot({ path: `${OUT}/${key}-full.png`, fullPage: true });
    await d.screenshot({ path: `${OUT}/${key}-desk.png` });
    const m = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2.5 });
    await m.goto(url, { waitUntil: 'networkidle' }); await m.evaluate(() => document.fonts.ready);
    await m.screenshot({ path: `${OUT}/${key}-mob.png` });
    await m.screenshot({ path: `${OUT}/${key}-mobfull.png`, fullPage: true });
    await d.close(); await m.close();
    console.log('shot', key);
  }
  await b.close();
})();
