import { describe, it, expect } from 'vitest';
import {
  parseBrandHue,
  resolveBackdropMode,
  HERO_BACKDROP_CONFIGS,
  type HeroBackdropVariant,
} from './WebGLHeroBackdrop';

/**
 * The imperative WebGL path can't run in jsdom (no WebGL context), so these guard
 * the PURE decision logic that governs whether/what the backdrop renders — the
 * bits that keep it LCP-safe + always-legible.
 */

describe('parseBrandHue', () => {
  it('converts a degree string to a 0..1 turn', () => {
    expect(parseBrandHue('195')).toBeCloseTo(195 / 360, 6);
    expect(parseBrandHue('240')).toBeCloseTo(240 / 360, 6);
    expect(parseBrandHue(' 90 ')).toBeCloseTo(90 / 360, 6); // trims
  });
  it('falls back to 240° for blank / NaN / nullish input', () => {
    expect(parseBrandHue('')).toBeCloseTo(240 / 360, 6);
    expect(parseBrandHue(null)).toBeCloseTo(240 / 360, 6);
    expect(parseBrandHue(undefined)).toBeCloseTo(240 / 360, 6);
    expect(parseBrandHue('not-a-number')).toBeCloseTo(240 / 360, 6);
  });
  it('normalizes out-of-range degrees into 0..1', () => {
    expect(parseBrandHue('360')).toBeCloseTo(0, 6);
    expect(parseBrandHue('420')).toBeCloseTo(60 / 360, 6);
    expect(parseBrandHue('-30')).toBeCloseTo(330 / 360, 6);
  });
});

describe('resolveBackdropMode', () => {
  it('renders WebGL only when motion is allowed AND WebGL is available', () => {
    expect(resolveBackdropMode({ reducedMotion: false, webglOk: true })).toBe('webgl');
  });
  it('falls back to static when reduced-motion is requested (accessibility)', () => {
    expect(resolveBackdropMode({ reducedMotion: true, webglOk: true })).toBe('static');
  });
  it('falls back to static when WebGL is unavailable', () => {
    expect(resolveBackdropMode({ reducedMotion: false, webglOk: false })).toBe('static');
    expect(resolveBackdropMode({ reducedMotion: true, webglOk: false })).toBe('static');
  });
});

describe('HERO_BACKDROP_CONFIGS', () => {
  const variants: HeroBackdropVariant[] = ['aurora', 'waves', 'mesh'];
  it('defines all three variants with sane, text-legible params', () => {
    for (const v of variants) {
      const c = HERO_BACKDROP_CONFIGS[v];
      expect(c).toBeDefined();
      expect(c.scale).toBeGreaterThan(0);
      expect(c.speed).toBeGreaterThan(0);
      expect(c.sharpness).toBeGreaterThan(0);
      expect(c.sharpness).toBeLessThanOrEqual(1);
      expect(c.hueSpread).toBeGreaterThanOrEqual(0);
      // Intensity stays < 1 so the backdrop never overpowers foreground text.
      expect(c.intensity).toBeGreaterThan(0);
      expect(c.intensity).toBeLessThan(1);
    }
  });
});
