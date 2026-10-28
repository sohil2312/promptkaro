// Renders product stills or turntable frames from studio.html.
// From the repo root: npx serve . -p 4100   then:   node tools/render/shoot.js <names> <size> <outDir> <yaws>
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [,, names='earbuds,phone,watch,charger,coin,pin', size='900', outDir='stills', yaws='0'] = process.argv;
  fs.mkdirSync(outDir, { recursive: true });
  const b = await chromium.launch({ args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: +size, height: +size } });
  p.on('pageerror', e => console.log('ERR', e.message));
  p.on('console', m => { if (m.type()==='error') console.log('CONSOLE', m.text()); });
  await p.goto(`http://localhost:4100/tools/render/studio?size=${size}`);
  await p.waitForFunction(() => window.ready === true, null, { timeout: 60000 });
  for (const n of names.split(',')) {
    for (const y of yaws.split(',')) {
      const url = await p.evaluate(([n, y, o]) => window.renderProduct(n, +y, o), [n, y, JSON.parse(process.env.OPTS || '{}')]);
      fs.writeFileSync(`${outDir}/${n}_${y}.png`, Buffer.from(url.split(',')[1], 'base64'));
    }
    console.log('done', n);
  }
  await b.close();
})();
