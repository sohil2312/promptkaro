# Product render studio

The product images in `assets/img` are rendered here, not downloaded. All models are original,
generic designs built in code (no brands, no logos).

```
cd tools/render && npm install && cd ../..
npx serve . -p 4100 &
cd tools/render
node shoot.js earbuds,phone,watch,charger 900 out 0
node shoot.js earbuds,phone,watch,charger 420 out/frames "$(python3 -c "print(','.join(str(round(-40+i*80/23,2)) for i in range(24)))")"
node pack.js
```

- `studio.html`: scene, lighting (image-based + key light), materials and the product models.
- `shoot.js`: renders stills or turntable frames (yaw in degrees) to PNG.
- `pack.js`: crops all frames of a product to one shared box, writes `<name>-turn.webp` (6x4 sprite),
  `<name>-450.webp` and `<name>-thumb.webp`.
