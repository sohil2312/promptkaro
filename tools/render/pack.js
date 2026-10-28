// Crops every product's frames to one shared box, packs the 24-frame turntable sprite and the stills into assets/img.
const sharp = require('sharp'); const fs = require('fs');
// Union of visible pixels across all frames -> one shared square crop, so products fill tiles and frames stay aligned.
async function bbox(file, thr = 60) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let x0 = info.width, y0 = info.height, x1 = -1, y1 = -1;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    if (data[(y * info.width + x) * 4 + 3] > thr) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  }
  return { x0, y0, x1, y1, W: info.width };
}
(async () => {
  const out = require('path').join(__dirname, '../../assets/img/');
  for (const n of ['earbuds', 'phone', 'watch', 'charger']) {
    const files = fs.readdirSync('out/frames').filter(f => f.startsWith(n + '_'))
      .sort((a, b) => parseFloat(a.slice(n.length + 1)) - parseFloat(b.slice(n.length + 1)));
    if (files.length !== 24) throw new Error(n + ' frames: ' + files.length);
    let U = { x0: 1e9, y0: 1e9, x1: -1, y1: -1 };
    for (const f of files) { const b = await bbox('out/frames/' + f); U = { x0: Math.min(U.x0, b.x0), y0: Math.min(U.y0, b.y0), x1: Math.max(U.x1, b.x1), y1: Math.max(U.y1, b.y1) }; }
    const S = (await sharp('out/frames/' + files[0]).metadata()).width, pad = 0.06;
    let side = Math.max(U.x1 - U.x0, U.y1 - U.y0) * (1 + 2 * pad);
    side = Math.min(S, Math.round(side));
    const cx = (U.x0 + U.x1) / 2, cy = (U.y0 + U.y1) / 2;
    const L = Math.max(0, Math.min(S - side, Math.round(cx - side / 2)));
    const T = Math.max(0, Math.min(S - side, Math.round(cy - side / 2)));
    const F = 300, cols = 6, rows = 4;
    const composites = await Promise.all(files.map(async (f, i) => ({
      input: await sharp('out/frames/' + f).extract({ left: L, top: T, width: side, height: side }).resize(F).png().toBuffer(),
      left: (i % cols) * F, top: Math.floor(i / cols) * F })));
    await sharp({ create: { width: F * cols, height: F * rows, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite(composites).webp({ quality: 72, alphaQuality: 75, effort: 6 }).toFile(out + n + '-turn.webp');
    // Still: same relative crop from the 900px render
    const k = (await sharp('out/' + n + '_0.png').metadata()).width / S;
    const still = sharp('out/' + n + '_0.png').extract({ left: Math.round(L * k), top: Math.round(T * k), width: Math.round(side * k), height: Math.round(side * k) });
    await still.clone().resize(450).webp({ quality: 84, alphaQuality: 86, effort: 6 }).toFile(out + n + '-450.webp');
    await sharp('out/' + n + '_0.png').trim({ threshold: 10 }).resize({ height: 160 }).webp({ quality: 84, alphaQuality: 86 }).toFile(out + n + '-thumb.webp');
    console.log(n, 'crop', L, T, side, 'sizes', ['turn', '450', 'thumb'].map(s => Math.round(fs.statSync(out + n + '-' + s + '.webp').size / 1024) + 'KB').join(' '));
  }
})();
