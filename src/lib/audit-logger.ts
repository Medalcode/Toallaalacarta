/**
 * Audit Logging System
 * Records important security and business events
 */

import { Client, Databases, ID } from 'appwrite';
import { APPWRITE_CONFIG } from './appwrite';

export enum AuditAction {
  // Authentication
  USER_LOGIN = 'user_login',
  USER_LOGOUT = 'user_logout',
  USER_REGISTER = 'user_register',
  PASSWORD_RESET_REQUEST = 'password_reset_request',
  PASSWORD_RESET_COMPLETE = 'password_reset_complete',
  PASSWORD_CHANGE = 'password_change',
  
  // Orders
  ORDER_CREATED = 'order_created',
  ORDER_UPDATED = 'order_updated',
  ORDER_STATUS_CHANGED = 'order_status_changed',
  ORDER_CANCELLED = 'order_cancelled',
  
  // Admin
  ADMIN_ACCESS = 'admin_access',
  ADMIN_ORDER_UPDATE = 'admin_order_update',
  ADMIN_EXPORT_DATA = 'admin_export_data',
  
  // Security
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  INVALID_LOGIN_ATTEMPT = 'invalid_login_attempt',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
}

export enum AuditLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

interface AuditLogEntry {
  action: AuditAction;
  level: AuditLevel;
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

class AuditLogger {
  private logs: AuditLogEntry[] = [];
  private maxLocalLogs = 1000;

  /**
   * Log an audit event
   */
  async log(entry: Omit<AuditLogEntry, 'timestamp'>): Promise<void> {
    const logEntry: AuditLogEntry = {
      ...entry,
      timestamp: new Date().toISOString(),
    };

    // Add to local cache
    this.logs.push(logEntry);
    if (this.logs.length > this.maxLocalLogs) {
      this.logs.shift(); // Remove oldest
    }

    // Log to console based on level
    this.consoleLog(logEntry);

    // Optionally save to database (for critical events)
    if (entry.level === AuditLevel.CRITICAL || entry.level === AuditLevel.ERROR) {
      await this.saveToDatabase(logEntry);
    }
  }

  /**
   * Log to console with appropriate level
   */
  private consoleLog(entry: AuditLogEntry): void {
    const message = `[${entry.level.toUpperCase()}] ${entry.action} - User: ${entry.userEmail || entry.userId || 'Anonymous'} - IP: ${entry.ipAddress || 'Unknown'}`;
    
    switch (entry.level) {
      case AuditLevel.CRITICAL:
      case AuditLevel.ERROR:
        console.error(message, entry.metadata);
        break;
      case AuditLevel.WARNING:
        console.warn(message, entry.metadata);
        break;
      default:
        console.log(message, entry.metadata);
    }
  }

  /**
   * Save critical logs to database
   */
  private async saveToDatabase(entry: AuditLogEntry): Promise<void> {
    try {
      // Only save from server-side with admin credentials
      // This would require a server-side only Appwrite client
      // For now, we'll just log to console
      console.log('💾 Would save to database:', entry);
    } catch (error) {
      console.error('Failed to save audit log to database:', error);
    }
  }

  /**
   * Get recent logs (for admin dashboard)
   */
  getRecentLogs(limit: number = 100): AuditLogEntry[] {
    return this.logs.slice(-limit);
  }

  /**
   * Filter logs by criteria
   */
  filterLogs(criteria: {
    action?: AuditAction;
    level?: AuditLevel;
    userId?: string;
    startDate?: Date;
    endDate?: Date;
  }): AuditLogEntry[] {
    return this.logs.filter(log => {
      if (criteria.action && log.action !== criteria.action) return false;
      if (criteria.level && log.level !== criteria.level) return false;
      if (criteria.userId && log.userId !== criteria.userId) return false;
      if (criteria.startDate && new Date(log.timestamp) < criteria.startDate) return false;
      if (criteria.endDate && new Date(log.timestamp) > criteria.endDate) return false;
      return true;
    });
  }
}

// Singleton instance
export const auditLogger = new AuditLogger();

/**
 * Helper functions for common audit scenarios
 */

export async function logUserLogin(userId: string, email: string, request: Request, success: boolean) {
  await auditLogger.log({
    action: success ? AuditAction.USER_LOGIN : AuditAction.INVALID_LOGIN_ATTEMPT,
    level: success ? AuditLevel.INFO : AuditLevel.WARNING,
    userId: success ? userId : undefined,
    userEmail: email,
    ipAddress: getIpAddress(request),
    userAgent: request.headers.get('user-agent') || undefined,
    metadata: { success },
  });
}

export async function logUserRegister(userId: string, email: string, request: Request) {
  await auditLogger.log({
    action: AuditAction.USER_REGISTER,
    level: AuditLevel.INFO,
    userId,
    userEmail: email,
    ipAddress: getIpAddress(request),
    userAgent: request.headers.get('user-agent') || undefined,
  });
}

export async function logPasswordReset(email: string, request: Request, stage: 'request' | 'complete') {
  await auditLogger.log({
    action: stage === 'request' ? AuditAction.PASSWORD_RESET_REQUEST : AuditAction.PASSWORD_RESET_COMPLETE,
    level: AuditLevel.INFO,
    userEmail: email,
    ipAddress: getIpAddress(request),
    userAgent: request.headers.get('user-agent') || undefined,
  });
}

export async function logOrderCreated(orderId: string, userId: string, email: string, total: number) {
  await auditLogger.log({
    action: AuditAction.ORDER_CREATED,
    level: AuditLevel.INFO,
    userId,
    userEmail: email,
    metadata: { orderId, total },
  });
}

export async function logOrderStatusChange(
  orderId: string,
  userId: string,
  oldStatus: string,
  newStatus: string,
  changedBy: string
) {
  await auditLogger.log({
    action: AuditAction.ORDER_STATUS_CHANGED,
    level: AuditLevel.INFO,
    userId,
    metadata: { orderId, oldStatus, newStatus, changedBy },
  });
}

export async function logRateLimitExceeded(identifier: string, endpoint: string, request: Request) {
  await auditLogger.log({
    action: AuditAction.RATE_LIMIT_EXCEEDED,
    level: AuditLevel.WARNING,
    ipAddress: getIpAddress(request),
    metadata: { identifier, endpoint },
  });
}

export async function logSuspiciousActivity(description: string, request: Request, metadata?: Record<string, any>) {
  await auditLogger.log({
    action: AuditAction.SUSPICIOUS_ACTIVITY,
    level: AuditLevel.CRITICAL,
    ipAddress: getIpAddress(request),
    userAgent: request.headers.get('user-agent') || undefined,
    metadata: { description, ...metadata },
  });
}

/**
 * Helper to extract IP address from request
 */
function getIpAddress(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0] || realIp || 'unknown';
}
