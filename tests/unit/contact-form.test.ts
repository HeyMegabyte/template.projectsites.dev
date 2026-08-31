import { describe, it, expect } from 'vitest';
import { isValidPhone, isFieldValid, isValidEmail, isMinLength } from '@/components/ContactForm';

describe('ContactForm — phone replaces the dropped subject field', () => {
  describe('isValidPhone (optional — empty is valid, else ≥7 digits)', () => {
    it('treats an empty value as valid (phone is optional, never blocks submit)', () => {
      expect(isValidPhone('')).toBe(true);
      expect(isValidPhone('   ')).toBe(true);
    });
    it('accepts a plausible phone (≥7 digits, any formatting)', () => {
      expect(isValidPhone('4145559876')).toBe(true);
      expect(isValidPhone('(414) 555-9876')).toBe(true);
      expect(isValidPhone('+1 414 555 9876')).toBe(true);
    });
    it('rejects a non-empty value with too few digits', () => {
      expect(isValidPhone('415')).toBe(false);
      expect(isValidPhone('call me')).toBe(false);
    });
  });

  describe('isFieldValid routes phone (not subject)', () => {
    it('validates phone via isValidPhone', () => {
      expect(isFieldValid('phone', '')).toBe(true); // optional
      expect(isFieldValid('phone', '4145559876')).toBe(true);
      expect(isFieldValid('phone', '415')).toBe(false);
    });
    it('still validates name/email/message', () => {
      expect(isFieldValid('name', 'Al')).toBe(true);
      expect(isFieldValid('name', 'A')).toBe(false);
      expect(isFieldValid('email', 'a@b.co')).toBe(true);
      expect(isFieldValid('message', 'ten chars!!')).toBe(true);
      expect(isFieldValid('message', 'short')).toBe(false);
    });
  });

  it('shared helpers unchanged', () => {
    expect(isValidEmail('x@y.com')).toBe(true);
    expect(isMinLength('abc', 3)).toBe(true);
    expect(isMinLength('ab', 3)).toBe(false);
  });
});
