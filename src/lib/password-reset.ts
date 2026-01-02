/**
 * Password Reset Token Management
 * Handles creation, validation, and expiration of password reset tokens
 */

interface ResetToken {
  token: string;
  email: string;
  expiresAt: number;
  used: boolean;
}

class PasswordResetManager {
  private tokens: Map<string, ResetToken> = new Map();
  private readonly TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour
  private readonly cleanupInterval = 5 * 60 * 1000; // 5 minutes

  constructor() {
    // Cleanup expired tokens periodically
    setInterval(() => this.cleanup(), this.cleanupInterval);
  }

  /**
   * Generate a secure random token
   */
  private generateToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Create a password reset token for an email
   */
  createToken(email: string): string {
    const token = this.generateToken();
    const expiresAt = Date.now() + this.TOKEN_EXPIRY;

    this.tokens.set(token, {
      token,
      email: email.toLowerCase(),
      expiresAt,
      used: false,
    });

    console.log(`🔑 Password reset token created for: ${email}`);
    return token;
  }

  /**
   * Validate a reset token
   */
  validateToken(token: string): { valid: boolean; email?: string; error?: string } {
    const resetToken = this.tokens.get(token);

    if (!resetToken) {
      return { valid: false, error: 'Token inválido' };
    }

    if (resetToken.used) {
      return { valid: false, error: 'Este token ya ha sido utilizado' };
    }

    if (resetToken.expiresAt < Date.now()) {
      this.tokens.delete(token);
      return { valid: false, error: 'El token ha expirado' };
    }

    return { valid: true, email: resetToken.email };
  }

  /**
   * Mark a token as used
   */
  useToken(token: string): boolean {
    const resetToken = this.tokens.get(token);
    
    if (!resetToken) {
      return false;
    }

    resetToken.used = true;
    this.tokens.set(token, resetToken);
    
    // Delete after marking as used
    setTimeout(() => this.tokens.delete(token), 60000); // Delete after 1 minute
    
    return true;
  }

  /**
   * Cleanup expired tokens
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [token, data] of this.tokens.entries()) {
      if (data.expiresAt < now || data.used) {
        this.tokens.delete(token);
      }
    }
  }

  /**
   * Get token info (for debugging)
   */
  getTokenInfo(token: string): ResetToken | null {
    return this.tokens.get(token) || null;
  }

  /**
   * Revoke all tokens for an email
   */
  revokeTokensForEmail(email: string): void {
    const normalizedEmail = email.toLowerCase();
    for (const [token, data] of this.tokens.entries()) {
      if (data.email === normalizedEmail) {
        this.tokens.delete(token);
      }
    }
  }
}

// Singleton instance
export const passwordResetManager = new PasswordResetManager();
