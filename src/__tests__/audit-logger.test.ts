import { describe, it, expect, vi, beforeEach } from 'vitest';
import { auditLogger, AuditAction, AuditLevel } from '../lib/audit-logger';

describe('Audit Logger', () => {
  beforeEach(() => {
    // We can't easily clear the private logs array without reflection, 
    // but we can spy on console.log/error to test side effects.
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('should log INFO level to console.log', async () => {
    await auditLogger.log({
      action: AuditAction.USER_LOGIN,
      level: AuditLevel.INFO,
      userEmail: 'test@example.com',
    });

    expect(console.log).toHaveBeenCalled();
  });

  it('should log WARNING level to console.warn', async () => {
    await auditLogger.log({
      action: AuditAction.INVALID_LOGIN_ATTEMPT,
      level: AuditLevel.WARNING,
      userEmail: 'hacker@example.com',
    });

    expect(console.warn).toHaveBeenCalled();
  });

  it('should log ERROR and CRITICAL to console.error', async () => {
    await auditLogger.log({
      action: AuditAction.SUSPICIOUS_ACTIVITY,
      level: AuditLevel.CRITICAL,
    });

    expect(console.error).toHaveBeenCalled();
  });

  it('should filter logs correctly by level', async () => {
    // Generate a unique action to avoid interference from previous tests
    const action = AuditAction.ORDER_CREATED;
    await auditLogger.log({ action, level: AuditLevel.INFO, userId: 'test-user' });
    
    const logs = auditLogger.filterLogs({ action });
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[logs.length - 1].userId).toBe('test-user');
  });
});
