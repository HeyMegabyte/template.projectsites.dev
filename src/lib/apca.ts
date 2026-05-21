/**
 * APCA contrast (Accessible Perceptual Contrast Algorithm) — WCAG 3.0 draft direction.
 *
 * Differs from WCAG 2.x relative-luminance contrast (which assumes sRGB and
 * struggles with high-saturation hues). APCA uses Lc (lightness-contrast)
 * with realistic perceptual weighting. Returns a signed Lc value:
 *
 *   |Lc| ≥ 75   ✓ Body text
 *   |Lc| ≥ 60   ✓ Body @ 18px
 *   |Lc| ≥ 45   ✓ Large headlines
 *   |Lc| ≥ 15   ✓ Decorative / non-text
 *
 * Negative Lc = dark text on light background.
 * Positive Lc = light text on dark background.
 *
 * This is a small pure-TS implementation of the public APCA-W3 algorithm.
 * For deeper analysis (font-size + weight matrices) use `apca-w3` npm.
 */

const TRC_ENC = 2.4;

const NORM_BG = 0.56;
const NORM_TXT = 0.57;
const REV_BG = 0.62;
const REV_TXT = 0.65;

const BLK_THRSH = 0.022;
const BLK_CLMP = 1.414;
const SCALE_BoW = 1.14;
const SCALE_WoB = 1.14;
const LO_BoW_OFFSET = 0.027;
const LO_WoB_OFFSET = 0.027;
const DELTA_Y_MIN = 0.0005;

function srgbToY([r, g, b]: [number, number, number]): number {
  const main = (x: number) => Math.pow(x / 255, TRC_ENC);
  return 0.2126729 * main(r) + 0.7151522 * main(g) + 0.0721750 * main(b);
}

function softClampBlack(Y: number): number {
  return Y >= BLK_THRSH ? Y : Y + Math.pow(BLK_THRSH - Y, BLK_CLMP);
}

/**
 * Returns Lc in the range roughly [-108, +106]. Positive = light text on dark bg.
 */
export function apcaContrast(text: [number, number, number], bg: [number, number, number]): number {
  let Ytext = softClampBlack(srgbToY(text));
  let Ybg = softClampBlack(srgbToY(bg));

  if (Math.abs(Ybg - Ytext) < DELTA_Y_MIN) return 0;

  let outputContrast: number;
  if (Ybg > Ytext) {
    // Black on White
    const SAPC = (Math.pow(Ybg, NORM_BG) - Math.pow(Ytext, NORM_TXT)) * SCALE_BoW;
    outputContrast = SAPC < LO_BoW_OFFSET ? 0 : SAPC - LO_BoW_OFFSET;
    return outputContrast * 100;
  }
  // White on Black
  const SAPC = (Math.pow(Ybg, REV_BG) - Math.pow(Ytext, REV_TXT)) * SCALE_WoB;
  outputContrast = SAPC > -LO_WoB_OFFSET ? 0 : SAPC + LO_WoB_OFFSET;
  return outputContrast * 100;
}

const ACCESSIBLE_THRESHOLDS = {
  bodyText: 75,
  bodyText18: 60,
  bodyText24: 45,
  largeHeadline: 30,
  decorative: 15,
} as const;

export type ApcaCategory = keyof typeof ACCESSIBLE_THRESHOLDS;

export function meetsApca(
  text: [number, number, number],
  bg: [number, number, number],
  category: ApcaCategory = 'bodyText',
): boolean {
  return Math.abs(apcaContrast(text, bg)) >= ACCESSIBLE_THRESHOLDS[category];
}

/**
 * Parse a CSS color string (hex / rgb()) to [r, g, b] sRGB triple.
 * Doesn't handle oklch() directly — convert through a canvas if you need that.
 */
export function parseSrgb(css: string): [number, number, number] | null {
  if (typeof document === 'undefined') return null;
  const ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) return null;
  ctx.fillStyle = '#000';
  ctx.fillStyle = css;
  const m = ctx.fillStyle.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (m) return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
  return null;
}
