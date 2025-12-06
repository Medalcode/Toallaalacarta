import { describe, it, expect } from 'vitest';
import {
  sanitizeString,
  validateEmail,
  validatePassword,
  validatePhone,
  validateName,
  validateAddress,
  validatePostalCode,
  validateOrderNumber,
  validateAmount,
  validateUrl,
  validateJson,
  sanitizeObject,
  validateCheckoutData,
  validateRegistrationData,
} from './validation';

describe('sanitizeString', () => {
  it('should remove angle brackets', () => {
    expect(sanitizeString('<script>alert("xss")</script>')).not.toContain('<');
    expect(sanitizeString('<b>bold</b>')).toBe('bbold/b');
  });

  it('should remove event handlers', () => {
    expect(sanitizeString('onclick=alert(1)')).not.toContain('onclick');
  });

  it('should remove javascript: protocol', () => {
    expect(sanitizeString('javascript:alert(1)')).not.toContain('javascript');
  });

  it('should trim whitespace', () => {
    expect(sanitizeString('  hello  ')).toBe('hello');
  });

  it('should limit length to 1000', () => {
    const long = 'a'.repeat(2000);
    expect(sanitizeString(long).length).toBe(1000);
  });

  it('should handle empty input', () => {
    expect(sanitizeString('')).toBe('');
    expect(sanitizeString(null as any)).toBe('');
    expect(sanitizeString(undefined as any)).toBe('');
  });
});

describe('validateEmail', () => {
  it('should validate correct emails', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('test@domain.cl')).toBe(true);
    expect(validateEmail('user.name+tag@domain.co')).toBe(true);
  });

  it('should reject invalid emails', () => {
    expect(validateEmail('not-an-email')).toBe(false);
    expect(validateEmail('')).toBe(false);
    expect(validateEmail('@domain.com')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
  });

  it('should reject excessively long emails', () => {
    const long = 'a'.repeat(256) + '@b.com';
    expect(validateEmail(long)).toBe(false);
  });
});

describe('validatePassword', () => {
  it('should accept strong passwords', () => {
    const result = validatePassword('StrongP@ss1');
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject short passwords', () => {
    const result = validatePassword('Ab1!');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('La contraseña debe tener al menos 8 caracteres');
  });

  it('should reject passwords without lowercase', () => {
    const result = validatePassword('UPPERCASE1!');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('La contraseña debe contener al menos una letra minúscula');
  });

  it('should reject passwords without uppercase', () => {
    const result = validatePassword('lowercase1!');
    expect(result.valid).toBe(false);
  });

  it('should reject passwords without numbers', () => {
    const result = validatePassword('NoDigits!');
    expect(result.valid).toBe(false);
  });

  it('should reject passwords without special chars', () => {
    const result = validatePassword('NoSpecial1');
    expect(result.valid).toBe(false);
  });

  it('should reject common passwords', () => {
    const result = validatePassword('Password123!');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('La contraseña es demasiado común');
  });
});

describe('validatePhone', () => {
  it('should validate Chilean mobile numbers', () => {
    expect(validatePhone('+56912345678')).toBe(true);
    expect(validatePhone('912345678')).toBe(true);
    expect(validatePhone('56912345678')).toBe(true);
  });

  it('should reject invalid phones', () => {
    expect(validatePhone('123')).toBe(false);
    expect(validatePhone('')).toBe(false);
    expect(validatePhone('notaphone')).toBe(false);
  });
});

describe('validateName', () => {
  it('should validate correct names', () => {
    expect(validateName('Juan')).toBe(true);
    expect(validateName('María José')).toBe(true);
    expect(validateName('José Hernández')).toBe(true);
  });

  it('should reject short names', () => {
    expect(validateName('')).toBe(false);
    expect(validateName('A')).toBe(false);
  });

  it('should reject names with invalid chars', () => {
    expect(validateName('User123')).toBe(false);
    expect(validateName('<script>')).toBe(false);
  });
});

describe('validateAddress', () => {
  it('should validate addresses', () => {
    expect(validateAddress('Av. Providencia 1234, Santiago')).toBe(true);
  });

  it('should reject short addresses', () => {
    expect(validateAddress('')).toBe(false);
    expect(validateAddress('abc')).toBe(false);
  });
});

describe('validatePostalCode', () => {
  it('should validate Chilean postal codes', () => {
    expect(validatePostalCode('8320000')).toBe(true);
  });

  it('should accept empty postal codes', () => {
    expect(validatePostalCode('')).toBe(true);
  });
});

describe('validateOrderNumber', () => {
  it('should validate order number format', () => {
    expect(validateOrderNumber('ORD-20251206-001')).toBe(true);
    expect(validateOrderNumber('ORD-20240101-999')).toBe(true);
  });

  it('should reject invalid formats', () => {
    expect(validateOrderNumber('')).toBe(false);
    expect(validateOrderNumber('INV-20251206-001')).toBe(false);
    expect(validateOrderNumber('ORD-20251206')).toBe(false);
  });
});

describe('validateAmount', () => {
  it('should validate amounts', () => {
    expect(validateAmount(1000)).toBe(true);
    expect(validateAmount(0)).toBe(true);
    expect(validateAmount(100000000)).toBe(true);
  });

  it('should reject invalid amounts', () => {
    expect(validateAmount(-1)).toBe(false);
    expect(validateAmount(NaN)).toBe(false);
    expect(validateAmount(Infinity)).toBe(false);
  });
});

describe('validateUrl', () => {
  it('should validate HTTPS URLs', () => {
    expect(validateUrl('https://example.com')).toBe(true);
    expect(validateUrl('http://example.com')).toBe(true);
  });

  it('should reject invalid URLs', () => {
    expect(validateUrl('not-a-url')).toBe(false);
    expect(validateUrl('')).toBe(false);
    expect(validateUrl('ftp://example.com')).toBe(false);
  });
});

describe('validateJson', () => {
  it('should validate JSON strings', () => {
    expect(validateJson('{"key": "value"}')).toBe(true);
    expect(validateJson('[]')).toBe(true);
    expect(validateJson('"string"')).toBe(true);
  });

  it('should reject invalid JSON', () => {
    expect(validateJson('{invalid}')).toBe(false);
    expect(validateJson('')).toBe(false);
  });
});

describe('sanitizeObject', () => {
  it('should remove prototype pollution keys', () => {
    const obj = sanitizeObject({ __proto__: { admin: true }, name: 'test' });
    expect(obj).not.toHaveProperty('__proto__');
    expect(obj).toHaveProperty('name', 'test');
  });

  it('should sanitize nested string values', () => {
    const obj = sanitizeObject({ nested: { value: '<script>alert(1)</script>' } });
    expect(obj.nested.value).not.toContain('<');
  });
});

describe('validateCheckoutData', () => {
  it('should validate correct checkout data', () => {
    const result = validateCheckoutData({
      address: 'Av. Providencia 1234',
      city: 'Santiago',
      phone: '+56912345678',
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject invalid checkout data', () => {
    const result = validateCheckoutData({
      address: '',
      city: '',
      phone: '123',
    });
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});

describe('validateRegistrationData', () => {
  it('should validate correct registration data', () => {
    const result = validateRegistrationData({
      email: 'user@example.com',
      password: 'StrongP@ss1',
      firstName: 'Juan',
      rut: '12345678-5',
    });
    expect(result.valid).toBe(true);
  });

  it('should reject invalid registration data', () => {
    const result = validateRegistrationData({
      email: 'invalid',
      password: 'weak',
      firstName: '',
      rut: '',
    });
    expect(result.valid).toBe(false);
  });
});
