import { describe, it, expect } from 'vitest';
import {
  THEME_PRESETS,
  PRESET_NAMES,
  DEFAULT_PRESET,
  resolvePreset,
  normalizePresetName,
  type ThemePreset,
} from './themePresets.ts';

const RADIUS_KEYS: (keyof ThemePreset['radius'])[] = ['sm', 'md', 'lg', 'xl', '2xl', 'full'];
const SHADOW_KEYS: (keyof ThemePreset['shadow'])[] = ['sm', 'md', 'lg', 'glow'];
const DURATION_KEYS: (keyof ThemePreset['motion']['duration'])[] = ['fast', 'base', 'slow', 'scroll'];

describe('themePresets', () => {
  it('every preset has a structurally complete bundle', () => {
    for (const name of PRESET_NAMES) {
      const p = THEME_PRESETS[name];
      expect(p.label, `${name}.label`).toBeTruthy();
      expect(p.when, `${name}.when`).toBeTruthy();
      expect(p.font.heading, `${name}.font.heading`).toBeTruthy();
      expect(p.font.body, `${name}.font.body`).toBeTruthy();
      expect(p.font.mono, `${name}.font.mono`).toBeTruthy();
      for (const k of RADIUS_KEYS) expect(typeof p.radius[k], `${name}.radius.${k}`).toBe('string');
      for (const k of SHADOW_KEYS) expect(typeof p.shadow[k], `${name}.shadow.${k}`).toBe('string');
      expect(p.motion.easing, `${name}.motion.easing`).toContain('cubic-bezier');
      for (const k of DURATION_KEYS) expect(p.motion.duration[k], `${name}.motion.${k}`).toMatch(/ms$/);
    }
  });

  it('classic is the default and reproduces the historical look verbatim', () => {
    expect(DEFAULT_PRESET).toBe('classic');
    const c = THEME_PRESETS.classic;
    expect(c.font).toEqual({ heading: 'Space Grotesk', body: 'Inter', mono: 'JetBrains Mono' });
    expect(c.radius).toEqual({ sm: '0.375rem', md: '0.75rem', lg: '1rem', xl: '1.5rem', '2xl': '2rem', full: '9999px' });
    expect(c.motion.easing).toBe('cubic-bezier(0.16, 1, 0.3, 1)');
    expect(c.motion.duration).toEqual({ fast: '150ms', base: '250ms', slow: '450ms', scroll: '1200ms' });
  });

  it('covers every documented vertical personality', () => {
    expect(new Set(PRESET_NAMES)).toEqual(new Set(['classic', 'editorial', 'warm', 'luxe', 'brutalist']));
  });

  it('resolvePreset never throws and falls back to classic on bad input', () => {
    expect(resolvePreset('warm').font.heading).toBe('Poppins');
    expect(resolvePreset('LUXE').font.heading).toBe('Playfair Display'); // case-insensitive
    expect(resolvePreset('  editorial  ').label).toBe('Editorial'); // trimmed
    for (const bad of [undefined, null, '', 'nope', 42, {}, []]) {
      expect(resolvePreset(bad as unknown), String(bad)).toBe(THEME_PRESETS.classic);
    }
  });

  it('normalizePresetName returns a valid PresetName for anything', () => {
    expect(normalizePresetName('BRUTALIST')).toBe('brutalist');
    expect(normalizePresetName('garbage')).toBe('classic');
    expect(normalizePresetName(undefined)).toBe('classic');
    for (const n of PRESET_NAMES) expect(normalizePresetName(n)).toBe(n);
  });
});
