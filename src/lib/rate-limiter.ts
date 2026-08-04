/**
 * Rate Limiting System
 * Protects against brute force attacks and spam
 */

export interface RateLimitEntry {
  count: number;
  resetTime: number;
  blockedUntil?: number;
}

export interface RateLimitStore {
  get(key: string): RateLimitEntry | undefined;
  set(key: string, entry: RateLimitEntry): void;
  delete(key: string): void;
  entries(): IterableIterator<[string, RateLimitEntry]>;
}

export class InMemoryRateLimitStore implements RateLimitStore {
  private attempts: Map<string, RateLimitEntry> = new Map();

  get(key: string): RateLimitEntry | undefined {
    return this.attempts.get(key);
  }

  set(key: string, entry: RateLimitEntry): void {
    this.attempts.set(key, entry);
  }

  delete(key: string): void {
    this.attempts.delete(key);
  }

  entries(): IterableIterator<[string, RateLimitEntry]> {
    return this.attempts.entries();
  }
}

export class RateLimiter {
  private store: RateLimitStore;
  private timer?: ReturnType<typeof setInterval>;
  private readonly cleanupInterval: number = 60000; // 1 minute

  constructor(store: RateLimitStore = new InMemoryRateLimitStore()) {
    this.store = store;
    
    // Cleanup expired entries periodically
    this.timer = setInterval(() => this.cleanup(), this.cleanupInterval);
    if (typeof this.timer === 'object' && typeof (this.timer as any).unref === 'function') {
      (this.timer as any).unref();
    }
  }

  /**
   * Stop background timer and release resources
   */
  destroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  /**
   * Check if an action is allowed
   */
  check(
    key: string,
    maxAttempts: number = 5,
    windowMs: number = 15 * 60 * 1000,
    blockDurationMs: number = 30 * 60 * 1000
  ): { allowed: boolean; remaining: number; resetIn: number } {
    const now = Date.now();
    const entry = this.store.get(key);

    if (entry?.blockedUntil && entry.blockedUntil > now) {
      return {
        allowed: false,
        remaining: 0,
        resetIn: Math.ceil((entry.blockedUntil - now) / 1000),
      };
    }

    if (!entry || entry.resetTime < now) {
      this.store.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return {
        allowed: true,
        remaining: maxAttempts - 1,
        resetIn: Math.ceil(windowMs / 1000),
      };
    }

    entry.count++;

    if (entry.count > maxAttempts) {
      entry.blockedUntil = now + blockDurationMs;
      this.store.set(key, entry);

      console.warn(`🚨 Rate limit exceeded for: ${key}`);

      return {
        allowed: false,
        remaining: 0,
        resetIn: Math.ceil(blockDurationMs / 1000),
      };
    }

    this.store.set(key, entry);
    return {
      allowed: true,
      remaining: maxAttempts - entry.count,
      resetIn: Math.ceil((entry.resetTime - now) / 1000),
    };
  }

  /**
   * Reset attempts for a key
   */
  reset(key: string): void {
    this.store.delete(key);
  }

  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (entry.resetTime < now && (!entry.blockedUntil || entry.blockedUntil < now)) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Get current status for a key
   */
  getStatus(key: string): RateLimitEntry | null {
    return this.store.get(key) || null;
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter();

/**
 * Rate limit configurations for different endpoints
 */
export const RATE_LIMITS = {
  LOGIN: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    blockDurationMs: 30 * 60 * 1000, // 30 minutes
  },
  SIGNUP: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    blockDurationMs: 2 * 60 * 60 * 1000, // 2 hours
  },
  PASSWORD_RESET: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    blockDurationMs: 60 * 60 * 1000, // 1 hour
  },
  API: {
    maxAttempts: 100,
    windowMs: 60 * 1000, // 1 minute
    blockDurationMs: 5 * 60 * 1000, // 5 minutes
  },
};

/**
 * Helper function to get client identifier (IP or email)
 */
export function getClientIdentifier(request: Request, email?: string): string {
  if (email) return `email:${email}`;
  
  // Try to get IP from headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';
  
  return `ip:${ip}`;
}

/**
 * Middleware helper for rate limiting
 */
export function checkRateLimit(
  identifier: string,
  config: typeof RATE_LIMITS.LOGIN
): { allowed: boolean; remaining: number; resetIn: number } {
  return rateLimiter.check(
    identifier,
    config.maxAttempts,
    config.windowMs,
    config.blockDurationMs
  );
}
