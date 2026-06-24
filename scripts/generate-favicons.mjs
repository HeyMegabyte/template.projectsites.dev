#!/usr/bin/env node
// generate-favicons.mjs — create the full favicon set referenced by index.html, brand-colored
// from _brand.json (brandHue), with ZERO external deps (pure node: zlib for PNG, BMP-in-ICO).
// Fixes the bug where index.html referenced 5 favicons that didn't exist (404 on every site).
// Run before `vite build` (writes into public/, which vite copies to dist/). Regenerate per brand.
import { readFileSync, writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pub = resolve(root, 'public');
const brand = JSON.parse(readFileSync(resolve(root, '_brand.json'), 'utf8'));
const val = (n) => (n && typeof n === 'object' && '$value' in n ? n.$value : n);
const hue = Number(val(brand?.color?.brandHue)) || 240;
const name = String(val(brand?.business?.name) || val(brand?.name) || 'A');
const initial = (name.match(/[A-Za-z0-9]/)?.[0] || 'A').toUpperCase();

// HSL → RGB (brand bg + a dark variant for the rounded square)
function hsl(h, s, l) {
  s /= 100; l /= 100;
  const k = (n) => (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}
const [r, g, b] = hsl(hue, 70, 55);
const hex = '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');

// ---- pure-node PNG encoder (solid rounded square, RGBA) ----
const crcTable = (() => { const t = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc32 = (buf) => { let c = 0xffffffff; for (const x of buf) c = crcTable[(c ^ x) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const c = Buffer.alloc(4); c.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, c]);
}
function pngSolid(size) {
  const px = Buffer.alloc(size * size * 4);
  const rad = Math.floor(size * 0.18);
  const inCorner = (x, y) => { // rounded-rect alpha mask
    const cx = x < rad ? rad : x >= size - rad ? size - 1 - rad : x;
    const cy = y < rad ? rad : y >= size - rad ? size - 1 - rad : y;
    return Math.hypot(x - cx, y - cy) <= rad;
  };
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const i = (y * size + x) * 4, on = inCorner(x, y);
    px[i] = r; px[i + 1] = g; px[i + 2] = b; px[i + 3] = on ? 255 : 0;
  }
  // add filter byte (0) per scanline
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) { raw[y * (size * 4 + 1)] = 0; px.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4); }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4); ihdr[8] = 8; ihdr[9] = 6; // 8-bit RGBA
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}
// ICO wrapping a 32x32 PNG (ICO supports embedded PNG since Vista)
function ico(png32) {
  const hdr = Buffer.alloc(6); hdr.writeUInt16LE(0, 0); hdr.writeUInt16LE(1, 2); hdr.writeUInt16LE(1, 4);
  const ent = Buffer.alloc(16); ent[0] = 32; ent[1] = 32; ent.writeUInt16LE(1, 4); ent.writeUInt16LE(32, 6);
  ent.writeUInt32LE(png32.length, 8); ent.writeUInt32LE(22, 12);
  return Buffer.concat([hdr, ent, png32]);
}

const png32 = pngSolid(32);
writeFileSync(resolve(pub, 'favicon-16x16.png'), pngSolid(16));
writeFileSync(resolve(pub, 'favicon-32x32.png'), png32);
writeFileSync(resolve(pub, 'apple-touch-icon.png'), pngSolid(180));
writeFileSync(resolve(pub, 'favicon.ico'), ico(png32));
// rich SVG favicon (brand bg + initial) + monochrome safari mask
writeFileSync(resolve(pub, 'favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="${hex}"/><text x="16" y="22" font-family="system-ui,sans-serif" font-size="18" font-weight="700" fill="#fff" text-anchor="middle">${initial}</text></svg>`);
writeFileSync(resolve(pub, 'safari-pinned-tab.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6"/><text x="16" y="22" font-family="system-ui" font-size="18" font-weight="700" fill="#fff" text-anchor="middle">${initial}</text></svg>`);
console.log(`[generate-favicons] wrote 6 favicons · brand=${hex} initial=${initial}`);
