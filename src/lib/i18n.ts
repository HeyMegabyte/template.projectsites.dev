import { useState, useEffect, useCallback } from 'react';

/**
 * Minimal client-side i18n (idea #156).
 *
 * Designed for small marketing sites where you need 2-4 languages, not 40.
 * For real-scale i18n, swap in i18next, react-intl, or Lingui later.
 *
 * Usage:
 *
 *   // src/locales/en.ts
 *   export default { greeting: 'Hello', cta: 'Get started' };
 *
 *   // src/locales/es.ts
 *   export default { greeting: 'Hola', cta: 'Empezar' };
 *
 *   // src/lib/i18n.config.ts
 *   import en from '../locales/en';
 *   import es from '../locales/es';
 *   export const locales = { en, es };
 *   export const defaultLocale = 'en';
 *
 *   // Then in a component:
 *   const { t, locale, setLocale } = useTranslation();
 *   return <h1>{t('greeting')}</h1>;
 *
 * Locale resolution priority:
 *   1. `?lang=` query parameter (sticky once set)
 *   2. `localStorage['projectsites:locale']`
 *   3. `navigator.language.split('-')[0]`
 *   4. `defaultLocale`
 */

type Dict = Record<string, string>;
type Locales = Record<string, Dict>;

let _locales: Locales = { en: {} };
let _defaultLocale = 'en';

export function configureI18n(locales: Locales, defaultLocale = 'en'): void {
  _locales = locales;
  _defaultLocale = defaultLocale;
}

const STORAGE_KEY = 'projectsites:locale';

function pickInitialLocale(): string {
  if (typeof window === 'undefined') return _defaultLocale;
  const url = new URL(window.location.href);
  const qp = url.searchParams.get('lang');
  if (qp && _locales[qp]) return qp;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && _locales[stored]) return stored;
  } catch {
    /* private mode */
  }
  const nav = navigator.language?.split('-')[0];
  if (nav && _locales[nav]) return nav;
  return _defaultLocale;
}

export function useTranslation() {
  const [locale, setLocaleState] = useState<string>(() => pickInitialLocale());

  const t = useCallback(
    (key: string, fallback?: string): string => {
      return _locales[locale]?.[key] ?? _locales[_defaultLocale]?.[key] ?? fallback ?? key;
    },
    [locale],
  );

  const setLocale = useCallback((next: string) => {
    if (!_locales[next]) return;
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* private mode */
    }
    document.documentElement.lang = next;
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return { t, locale, setLocale, availableLocales: Object.keys(_locales) };
}

/** Format a number using the current locale. */
export function formatNumber(value: number, locale?: string, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(locale ?? pickInitialLocale(), options).format(value);
}

/** Format a date using the current locale. */
export function formatDate(date: Date | string, locale?: string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale ?? pickInitialLocale(), options).format(d);
}

/** Format a currency value using the current locale. */
export function formatCurrency(amount: number, currency = 'USD', locale?: string): string {
  return new Intl.NumberFormat(locale ?? pickInitialLocale(), {
    style: 'currency',
    currency,
  }).format(amount);
}

/** Format a relative time (e.g. "2 days ago"). */
export function formatRelativeTime(from: Date | string, locale?: string): string {
  const d = typeof from === 'string' ? new Date(from) : from;
  const diff = (d.getTime() - Date.now()) / 1000;
  const rtf = new Intl.RelativeTimeFormat(locale ?? pickInitialLocale(), { numeric: 'auto' });
  const abs = Math.abs(diff);
  if (abs < 60) return rtf.format(Math.round(diff), 'second');
  if (abs < 3600) return rtf.format(Math.round(diff / 60), 'minute');
  if (abs < 86_400) return rtf.format(Math.round(diff / 3600), 'hour');
  if (abs < 2_592_000) return rtf.format(Math.round(diff / 86_400), 'day');
  if (abs < 31_536_000) return rtf.format(Math.round(diff / 2_592_000), 'month');
  return rtf.format(Math.round(diff / 31_536_000), 'year');
}
