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

    it('should include current YYYYMMDD date string', () => {
      const date = new Date();
      const expectedDateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
      const orderNumber = generateOrderNumber();
      expect(orderNumber).toContain(expectedDateStr);
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

    it('should return false for invalid area code or letters', () => {
      expect(validateChileanPhone('+56812345678')).toBe(false);
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

    it('should clean up spaces and dashes', () => {
      expect(formatChileanPhone('+56 9 1234-5678')).toBe('+56912345678');
    });
  });

  describe('formatPrice', () => {
    it('should format number to CLP currency string', () => {
      const price = 1000;
      const formatted = formatPrice(price);
      expect(formatted).toContain('1.000');
    });
  });

});
