import { describe, it, expect, vi } from 'vitest';
import { 
    generateOrderNumber, 
    validateChileanPhone, 
    formatChileanPhone, 
    formatPrice 
} from '../lib/order-utils';

describe('Order Utils', () => {
  describe('generateOrderNumber', () => {
    it('should generate a string starting with ORD-', () => {
      const orderNumber = generateOrderNumber();
      expect(orderNumber).toMatch(/^ORD-\d{8}-\d{3}$/);
    });

    it('should include the current date in YYYYMMDD format', () => {
      const date = new Date();
      const expectedDateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
      const orderNumber = generateOrderNumber();
      expect(orderNumber).toContain(expectedDateStr);
    });
  });

  describe('formatPrice', () => {
    it('should format numbers as CLP currency string', () => {
      // In jsdom environment, Intl might behave slightly differently but it should include the number 
      // and CLP or $ symbol. We'll do a loose check.
      const formatted = formatPrice(15000);
      expect(formatted.replace(/\s/g, '')).toMatch(/15[.,]000/);
    });
  });

  describe('validateChileanPhone', () => {
    it('should return true for valid formats', () => {
      expect(validateChileanPhone('+56912345678')).toBe(true);
      expect(validateChileanPhone('56912345678')).toBe(true);
      expect(validateChileanPhone('912345678')).toBe(true);
    });

    it('should return false for invalid formats', () => {
      expect(validateChileanPhone('1234567')).toBe(false); // Too short
      expect(validateChileanPhone('+56812345678')).toBe(false); // Wrong area code (not 9)
      expect(validateChileanPhone('abcdefghijk')).toBe(false); // Letters
    });
  });

  describe('formatChileanPhone', () => {
    it('should format phones to +569 format', () => {
      expect(formatChileanPhone('912345678')).toBe('+56912345678');
      expect(formatChileanPhone('56912345678')).toBe('+56912345678');
      expect(formatChileanPhone('+56912345678')).toBe('+56912345678');
    });

    it('should clean up spaces and dashes', () => {
      expect(formatChileanPhone('+56 9 1234-5678')).toBe('+56912345678');
    });
  });
});
