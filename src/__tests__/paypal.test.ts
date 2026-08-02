import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateAccessToken, PAYPAL_API_URL } from '../lib/paypal';

describe('PayPal Integration Utility', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('should throw an error if environment credentials are not configured', async () => {
    // In test runner without env vars set, generateAccessToken should throw explicit error
    await expect(generateAccessToken()).rejects.toThrow(/PayPal credentials not configured/);
  });

  it('should expose default sandbox API URL', () => {
    expect(PAYPAL_API_URL).toBeDefined();
    expect(typeof PAYPAL_API_URL).toBe('string');
  });
});
