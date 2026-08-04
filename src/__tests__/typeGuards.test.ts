import { describe, it, expect } from 'vitest';
import { isObject, isShopifyError } from '../lib/typeGuards';

describe('typeGuards', () => {
  describe('isObject', () => {
    it('should return true for record objects', () => {
      expect(isObject({ key: 'value' })).toBe(true);
      expect(isObject({})).toBe(true);
    });

    it('should return false for primitives and arrays', () => {
      expect(isObject(null)).toBe(false);
      expect(isObject(undefined)).toBe(false);
      expect(isObject('string')).toBe(false);
      expect(isObject(123)).toBe(false);
      expect(isObject([1, 2, 3])).toBe(false);
    });
  });

  describe('isShopifyError', () => {
    it('should identify Error instances as Shopify errors', () => {
      const err = new Error('Shopify API Error');
      expect(isShopifyError(err)).toBe(true);
    });

    it('should return false for non-error objects', () => {
      expect(isShopifyError({ message: 'plain object' })).toBe(false);
      expect(isShopifyError(null)).toBe(false);
    });
  });
});
