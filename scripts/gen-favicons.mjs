/**
 * gen-favicons.mjs — Pure Node.js favicon generator for The Jungle Wey
 *
 * Generates:
 *   app/favicon.ico         (16×16 + 32×32 embedded PNGs)
 *   public/icon-32x32.png   (32×32 PNG)
 *   public/icon-192x192.png (192×192 PNG, rounded)
 *   public/apple-touch-icon.png (180×180 PNG, rounded)
 *
 * No npm dependencies — uses only Node.js built-ins (zlib).
 *
 * Design:
 *   - Capital T in #4ADE80 on #0B1210 background
 *   - Elegant elongated leaf growing from top-right of crossbar (#86EFAC)
 *   - Thin vein rendered at ≥64px for premium detail
 *   - Rounded corners on large icons (192/180px)
 */

import { deflateSync }              from 'node:zlib';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname }            from 'node:path';
import { fileURLToPath }            from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const APP  = join(ROOT, 'app');
const PUB  = join(ROOT, 'public');
if (!existsSync(PUB)) mkdirSync(PUB, { recursive: true });

// ═══════════════════════════════════════════════════════════════
//  CRC-32 (required by PNG chunk format)
// ═══════════════════════════════════════════════════════════════
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(data) {
  let c = 0xFFFFFFFF;
  for (const b of data) c = CRC_TABLE[(c ^ b) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

// ═══════════════════════════════════════════════════════════════
//  PNG encoder
// ═══════════════════════════════════════════════════════════════
function encodePNG(rgba, W, H) {
  function chunk(type, data) {
    const tb   = Buffer.from(type, 'ascii');
    const lenB = Buffer.allocUnsafe(4);  lenB.writeUInt32BE(data.length, 0);
    const crcB = Buffer.allocUnsafe(4);
    crcB.writeUInt32BE(crc32(Buffer.concat([tb, data])), 0);
    return Buffer.concat([lenB, tb, data, crcB]);
  }

  // IHDR: width, height, bitDepth=8, colorType=6 (RGBA), compress=0, filter=0, interlace=0
  const ihdr = Buffer.allocUnsafe(13);
  ihdr.writeUInt32BE(W, 0);
  ihdr.writeUInt32BE(H, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  // Raw scanlines: each row prefixed with filter byte 0 (None)
  const rowLen = 1 + W * 4;
  const raw    = Buffer.allocUnsafe(H * rowLen);
  for (let y = 0; y < H; y++) {
    raw[y * rowLen] = 0; // filter: None
    for (let x = 0; x < W; x++) {
      const s = (y * W + x) * 4;
      const d = y * rowLen + 1 + x * 4;
      raw[d]   = rgba[s];
      raw[d+1] = rgba[s+1];
      raw[d+2] = rgba[s+2];
      raw[d+3] = rgba[s+3];
    }
  }

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),  // PNG signature
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ═══════════════════════════════════════════════════════════════
//  ICO encoder  (embeds PNG blobs directly — supported since Win8)
// ═══════════════════════════════════════════════════════════════
function encodeICO(images) {
  // images = [{ png: Buffer, width, height }, ...]
  const n          = images.length;
  const headerSize = 6 + n * 16;
  const header     = Buffer.allocUnsafe(headerSize);

  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: 1 = ICO
  header.writeUInt16LE(n, 4); // image count

  let offset = headerSize;
  for (let i = 0; i < n; i++) {
    const { png, width, height } = images[i];
    const b = 6 + i * 16;
    header[b]   = width  >= 256 ? 0 : width;
    header[b+1] = height >= 256 ? 0 : height;
    header[b+2] = 0; header[b+3] = 0;         // color count, reserved
    header.writeUInt16LE(1,  b+4);             // color planes
    header.writeUInt16LE(32, b+6);             // bits per pixel
    header.writeUInt32LE(png.length, b+8);     // data size
    header.writeUInt32LE(offset,     b+12);    // data offset
    offset += png.length;
  }

  return Buffer.concat([header, ...images.map(img => img.png)]);
}

// ═══════════════════════════════════════════════════════════════
//  Pixel-level canvas renderer
// ═══════════════════════════════════════════════════════════════
function createCanvas(W, H) {
  const pixels = new Uint8Array(W * H * 4); // RGBA, all zeros (transparent)

  // Porter-Duff source-over blend at buffer index idx
  function blendAt(idx, sr, sg, sb, sa) {
    if (sa <= 0) return;
    const sA = sa / 255;
    const dA = pixels[idx+3] / 255;
    const oA = sA + dA * (1 - sA);
    if (oA < 0.0005) return;
    pixels[idx]   = ((sr * sA + pixels[idx]   * dA * (1 - sA)) / oA + 0.5) | 0;
    pixels[idx+1] = ((sg * sA + pixels[idx+1] * dA * (1 - sA)) / oA + 0.5) | 0;
    pixels[idx+2] = ((sb * sA + pixels[idx+2] * dA * (1 - sA)) / oA + 0.5) | 0;
    pixels[idx+3] = (oA * 255 + 0.5) | 0;
  }

  function setPixel(px, py, r, g, b, a) {
    if (px < 0 || px >= W || py < 0 || py >= H) return;
    blendAt(((py | 0) * W + (px | 0)) * 4, r, g, b, a);
  }

  // Axis-aligned rounded rectangle with sub-pixel AA at corners
  function fillRoundRect(x, y, w, h, rx, r, g, b, a = 255) {
    const x2 = x + w, y2 = y + h;
    const py0 = Math.max(0,   Math.floor(y));
    const py1 = Math.min(H,   Math.ceil(y2));
    const px0 = Math.max(0,   Math.floor(x));
    const px1 = Math.min(W,   Math.ceil(x2));

    for (let py = py0; py < py1; py++) {
      for (let px = px0; px < px1; px++) {
        let coverage = 1;
        if (rx > 0) {
          const cpx = px + 0.5, cpy = py + 0.5;
          // Are we in a corner zone?
          const inCX = cpx < x + rx || cpx > x2 - rx;
          const inCY = cpy < y + rx || cpy > y2 - rx;
          if (inCX && inCY) {
            const cx = cpx < x + rx ? x + rx : x2 - rx;
            const cy = cpy < y + rx ? y + rx : y2 - rx;
            const d  = Math.sqrt((cpx - cx) ** 2 + (cpy - cy) ** 2);
            coverage = Math.max(0, Math.min(1, rx + 0.5 - d));
            if (coverage <= 0) continue;
          }
        }
        blendAt((py * W + px) * 4, r, g, b, (a * coverage + 0.5) | 0);
      }
    }
  }

  // Scanline polygon fill with per-pixel coverage (AA at edges)
  function fillPolygon(pts, r, g, b, a = 255) {
    const ys  = pts.map(p => p[1]);
    const minY = Math.max(0,   Math.floor(Math.min(...ys)));
    const maxY = Math.min(H-1, Math.ceil(Math.max(...ys)));
    const n   = pts.length;

    for (let scanY = minY; scanY <= maxY; scanY++) {
      const scanLine = scanY + 0.5; // centre of pixel row
      const xs = [];
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        const [x0, y0] = pts[i], [x1, y1] = pts[j];
        if ((y0 < scanLine && y1 >= scanLine) ||
            (y1 < scanLine && y0 >= scanLine)) {
          xs.push(x0 + (scanLine - y0) / (y1 - y0) * (x1 - x0));
        }
      }
      xs.sort((a, b) => a - b);

      for (let k = 0; k + 1 < xs.length; k += 2) {
        const xL = xs[k], xR = xs[k + 1];
        const pxL = Math.max(0,   Math.floor(xL));
        const pxR = Math.min(W-1, Math.ceil(xR) - 1);
        for (let px = pxL; px <= pxR; px++) {
          // Coverage = intersection of [px, px+1] with [xL, xR]
          const cov = Math.max(0, Math.min(1, px + 1 - xL)) *
                      Math.max(0, Math.min(1, xR - px));
          if (cov > 0) blendAt((scanY * W + px) * 4, r, g, b, (a * cov + 0.5) | 0);
        }
      }
    }
  }

  return { pixels, fillRoundRect, fillPolygon };
}

// ═══════════════════════════════════════════════════════════════
//  Brand colours
// ═══════════════════════════════════════════════════════════════
const BG  = [11,  18,  16];  // #0B1210 — very dark jungle green
const TG  = [74,  222, 128]; // #4ADE80 — primary T green
const LG  = [134, 239, 172]; // #86EFAC — leaf (lighter, fresher)

// ═══════════════════════════════════════════════════════════════
//  Design renderer   (all measurements in 0–100 unit space)
//
//   T crossbar : x=12,  y=27,  w=76, h=16  (right edge x=88)
//   T stem     : x=41,  y=27,  w=18, h=57  (centred under crossbar)
//   Leaf       : 7-point polygon, base at right end of crossbar,
//                tip pointing upper-right
// ═══════════════════════════════════════════════════════════════
function renderIcon(size, roundedCorners = false) {
  const S  = size;
  const sc = v => v * S / 100;                          // design → pixel
  const { pixels, fillRoundRect, fillPolygon } = createCanvas(S, S);

  // ── Background ───────────────────────────────────────────
  const bgRx = roundedCorners ? sc(14) : 0;
  fillRoundRect(0, 0, S, S, bgRx, BG[0], BG[1], BG[2], 255);

  // ── T crossbar ───────────────────────────────────────────
  const tRx = Math.max(1, sc(3.5));
  fillRoundRect(sc(12), sc(27), sc(76), sc(16), tRx, TG[0], TG[1], TG[2]);

  // ── T stem ───────────────────────────────────────────────
  fillRoundRect(sc(41), sc(27), sc(18), sc(57), tRx, TG[0], TG[1], TG[2]);

  // ── Leaf (not rendered at 16px — too small) ───────────────
  if (size >= 32) {
    // Leaf base overlaps with top-right area of crossbar (x≈82-88),
    // tip points to upper-right (~x=91, y=8)
    const lp = [
      [80, 30],  // base left
      [87, 30],  // base right  (inside crossbar right end)
      [95, 14],  // right-side ascending
      [93,  8],  // just below tip
      [89,  7],  // tip
      [84, 11],  // left-side near tip
      [79, 22],  // left-side descending
    ].map(([x, y]) => [sc(x), sc(y)]);

    fillPolygon(lp, LG[0], LG[1], LG[2], 218);

    // ── Leaf vein (64px and above only) ─────────────────────
    if (size >= 64) {
      const vp = [
        [83.5, 28], [84.5, 28],
        [91.5,  9], [90.5,  9],
      ].map(([x, y]) => [sc(x), sc(y)]);
      fillPolygon(vp, TG[0], TG[1], TG[2], 110);
    }
  }

  return pixels;
}

// ═══════════════════════════════════════════════════════════════
//  Render all sizes
// ═══════════════════════════════════════════════════════════════
const spec = [
  { size: 16,  rounded: false },
  { size: 32,  rounded: false },
  { size: 180, rounded: true  },
  { size: 192, rounded: true  },
];

const pngMap = {};
for (const { size, rounded } of spec) {
  const px  = renderIcon(size, rounded);
  pngMap[size] = encodePNG(px, size, size);
}

// ─── favicon.ico — two sizes for maximum browser compatibility
const ico = encodeICO([
  { png: pngMap[16], width: 16,  height: 16  },
  { png: pngMap[32], width: 32,  height: 32  },
]);
writeFileSync(join(APP, 'favicon.ico'), ico);
console.log('✓ app/favicon.ico          (16×16 + 32×32 embedded PNGs)');

// ─── Static PNG assets
writeFileSync(join(PUB, 'icon-32x32.png'),      pngMap[32]);
console.log('✓ public/icon-32x32.png    (32×32)');

writeFileSync(join(PUB, 'icon-192x192.png'),    pngMap[192]);
console.log('✓ public/icon-192x192.png  (192×192, rounded corners)');

writeFileSync(join(PUB, 'apple-touch-icon.png'), pngMap[180]);
console.log('✓ public/apple-touch-icon.png (180×180, rounded corners)');

console.log('\n✅  All favicon assets generated successfully!');
