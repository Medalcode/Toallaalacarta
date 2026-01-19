import { describe, it, expect } from 'vitest';
import { 
  generateOrderNumber, 
  validateChileanPhone, 
  formatChileanPhone, 
  formatPrice 
} from './order-utils';

describe('Order Utils', () => {
  
  describe('generateOrderNumber', () => {
    it('should generate an order number with correct format', () => {
      const orderNum = generateOrderNumber();
      expect(orderNum).toMatch(/^ORD-\d{8}-\d{3}$/);
    });

    it('should generate unique order numbers', () => {
      const order1 = generateOrderNumber();
      const order2 = generateOrderNumber();
      expect(order1).not.toBe(order2);
    });
  });

  describe('validateChileanPhone', () => {
    it('should validate correct +569 format', () => {
      expect(validateChileanPhone('+56912345678')).toBe(true);
    });

    it('should validate correct 569 format', () => {
      expect(validateChileanPhone('56912345678')).toBe(true);
    });

    it('should validate correct 9 format', () => {
      expect(validateChileanPhone('912345678')).toBe(true);
    });

    it('should invalid incomplete numbers', () => {
      expect(validateChileanPhone('91234')).toBe(false);
    });

    it('should invalid text', () => {
      expect(validateChileanPhone('invalid')).toBe(false);
    });
  });

  describe('formatChileanPhone', () => {
    it('should format simple 9 number to +569', () => {
      expect(formatChileanPhone('912345678')).toBe('+56912345678');
    });

    it('should format 569 number to +569', () => {
      expect(formatChileanPhone('56912345678')).toBe('+56912345678');
    });

    it('should keep +569 format as is', () => {
      expect(formatChileanPhone('+56912345678')).toBe('+56912345678');
    });
  });

  describe('formatPrice', () => {
    it('should format number to CLP currency string', () => {
        // Since formatting depends on locale which might vary in test env, 
        // we check if it contains the currency symbol or correct digits
        const price = 1000;
        const formatted = formatPrice(price);
        // Expecting something like "$1.000" or "$ 1.000" or "CLP 1.000" depending on node version
        // Let's be flexible
        expect(formatted).toContain('1.000');
    });
  });

});
