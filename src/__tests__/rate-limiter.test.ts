import { describe, it, expect, beforeEach } from 'vitest';
import { rateLimiter, RateLimiter, RATE_LIMITS, checkRateLimit, getClientIdentifier } from '../lib/rate-limiter';

describe('RateLimiter System', () => {
  const testKey = 'test-ip:127.0.0.1';

  beforeEach(() => {
    rateLimiter.reset(testKey);
    rateLimiter.reset('email:test@example.com');
  });

  it('should allow initial requests within limit', () => {
    const result = rateLimiter.check(testKey, 3, 60000, 120000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2);
  });

  it('should decrement remaining attempts on subsequent requests', () => {
    rateLimiter.check(testKey, 3, 60000, 120000);
    const secondCall = rateLimiter.check(testKey, 3, 60000, 120000);
    expect(secondCall.allowed).toBe(true);
    expect(secondCall.remaining).toBe(1);
  });

  it('should block requests when limit is exceeded', () => {
    rateLimiter.check(testKey, 2, 60000, 120000);
    rateLimiter.check(testKey, 2, 60000, 120000);
    
    // Third call exceeds maxAttempts of 2
    const blockedCall = rateLimiter.check(testKey, 2, 60000, 120000);
    expect(blockedCall.allowed).toBe(false);
    expect(blockedCall.remaining).toBe(0);
    expect(blockedCall.resetIn).toBeGreaterThan(0);
  });

  it('should reset attempts when reset() is called', () => {
    rateLimiter.check(testKey, 2, 60000, 120000);
    rateLimiter.check(testKey, 2, 60000, 120000);
    
    rateLimiter.reset(testKey);
    
    const freshCall = rateLimiter.check(testKey, 2, 60000, 120000);
    expect(freshCall.allowed).toBe(true);
    expect(freshCall.remaining).toBe(1);
  });

  it('should resolve client identifier from email or headers', () => {
    const emailId = getClientIdentifier({ headers: new Headers() } as Request, 'user@domain.com');
    expect(emailId).toBe('email:user@domain.com');

    const headers = new Headers();
    headers.set('x-forwarded-for', '192.168.1.1, 10.0.0.1');
    const ipId = getClientIdentifier({ headers } as Request);
    expect(ipId).toBe('ip:192.168.1.1');
  });

  it('should run checkRateLimit helper function correctly', () => {
    const res = checkRateLimit('email:test@example.com', RATE_LIMITS.LOGIN);
    expect(res.allowed).toBe(true);
    expect(res.remaining).toBe(RATE_LIMITS.LOGIN.maxAttempts - 1);
  });

  it('should clean up timer without error when destroy() is called', () => {
    const limiter = new RateLimiter();
    expect(() => limiter.destroy()).not.toThrow();
  });
});

