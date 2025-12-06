import { describe, it, expect } from 'vitest';
import { validateRut, formatRut } from './rut';

describe('validateRut', () => {
  it('should validate correct RUTs', () => {
    expect(validateRut('11111111-1')).toBe(true);
    expect(validateRut('22222222-2')).toBe(true);
    expect(validateRut('33333333-3')).toBe(true);
    expect(validateRut('44444444-4')).toBe(true);
    expect(validateRut('55555555-5')).toBe(true);
    expect(validateRut('66666666-6')).toBe(true);
    expect(validateRut('77777777-7')).toBe(true);
    expect(validateRut('88888888-8')).toBe(true);
    expect(validateRut('99999999-9')).toBe(true);
    expect(validateRut('12345678-5')).toBe(true);
  });

  it('should validate RUT with K digit', () => {
    expect(validateRut('11223344-K')).toBe(true);
    expect(validateRut('11223344-k')).toBe(true);
    expect(validateRut('15000005-K')).toBe(true);
  });

  it('should validate RUT with 0 digit', () => {
    expect(validateRut('10000004-0')).toBe(true);
  });

  it('should validate RUTs with dots and dash', () => {
    expect(validateRut('11.111.111-1')).toBe(true);
    expect(validateRut('22.222.222-2')).toBe(true);
  });

  it('should reject invalid RUTs', () => {
    expect(validateRut('')).toBe(false);
    expect(validateRut('123')).toBe(false);
    expect(validateRut('11111111-2')).toBe(false);
    expect(validateRut('not-a-rut')).toBe(false);
  });
});

describe('formatRut', () => {
  it('should format RUT with dots and dash', () => {
    expect(formatRut('111111111')).toBe('11.111.111-1');
    expect(formatRut('12345678K')).toBe('12.345.678-K');
  });

  it('should handle already formatted RUT', () => {
    expect(formatRut('11.111.111-1')).toBe('11.111.111-1');
  });

  it('should handle empty input', () => {
    expect(formatRut('')).toBe('');
  });
});
