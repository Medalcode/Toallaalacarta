/**
 * Input Validation and Sanitization
 * Protects against XSS, SQL Injection, and other attacks
 */

/**
 * Sanitize string input
 */
export function sanitizeString(input: string): string {
  if (!input) return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 1000); // Limit length
}

/**
 * Sanitize email
 */
export function sanitizeEmail(email: string): string {
  if (!email) return '';
  
  return email
    .trim()
    .toLowerCase()
    .substring(0, 255);
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 255;
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }
  
  if (password.length > 128) {
    errors.push('La contraseña no puede tener más de 128 caracteres');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra minúscula');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra mayúscula');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('La contraseña debe contener al menos un número');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('La contraseña debe contener al menos un carácter especial');
  }
  
  // Check for common passwords
  const commonPasswords = ['password', '12345678', 'qwerty', 'abc123', 'password123'];
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    errors.push('La contraseña es demasiado común');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate phone number (Chilean format)
 */
export function validatePhone(phone: string): boolean {
  if (!phone) return false;
  
  // Remove spaces, dashes, parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Chilean phone: +56912345678 or 912345678
  const phoneRegex = /^(\+?56)?[2-9]\d{8}$/;
  return phoneRegex.test(cleaned);
}

/**
 * Sanitize phone number
 */
export function sanitizePhone(phone: string): string {
  if (!phone) return '';
  
  return phone
    .replace(/[\s\-\(\)]/g, '')
    .substring(0, 15);
}

/**
 * Validate name
 */
export function validateName(name: string): boolean {
  if (!name || name.length < 2 || name.length > 100) return false;
  
  // Only letters, spaces, hyphens, apostrophes
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-']+$/;
  return nameRegex.test(name);
}

/**
 * Sanitize name
 */
export function sanitizeName(name: string): string {
  if (!name) return '';
  
  return name
    .trim()
    .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-']/g, '')
    .substring(0, 100);
}

/**
 * Validate address
 */
export function validateAddress(address: string): boolean {
  if (!address || address.length < 5 || address.length > 500) return false;
  return true;
}

/**
 * Sanitize address
 */
export function sanitizeAddress(address: string): string {
  if (!address) return '';
  
  return address
    .trim()
    .replace(/[<>]/g, '')
    .substring(0, 500);
}

/**
 * Validate postal code (Chilean format)
 */
export function validatePostalCode(code: string): boolean {
  if (!code) return true; // Optional field
  
  // Chilean postal code: 7 digits
  const codeRegex = /^\d{7}$/;
  return codeRegex.test(code.replace(/\s/g, ''));
}

/**
 * Sanitize postal code
 */
export function sanitizePostalCode(code: string): string {
  if (!code) return '';
  
  return code
    .replace(/\D/g, '')
    .substring(0, 7);
}

/**
 * Validate order number format
 */
export function validateOrderNumber(orderNumber: string): boolean {
  // Format: ORD-YYYYMMDD-XXX
  const orderRegex = /^ORD-\d{8}-\d{3}$/;
  return orderRegex.test(orderNumber);
}

/**
 * Validate amount (price)
 */
export function validateAmount(amount: number): boolean {
  return typeof amount === 'number' && 
         amount >= 0 && 
         amount <= 100000000 && // Max 100 million
         !isNaN(amount) &&
         isFinite(amount);
}

/**
 * Sanitize HTML (remove all HTML tags)
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  
  return html
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .trim()
    .substring(0, 5000);
}

/**
 * Validate URL
 */
export function validateUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Sanitize URL
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '';
  
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '';
    }
    return parsed.toString().substring(0, 2000);
  } catch {
    return '';
  }
}

/**
 * Validate JSON string
 */
export function validateJson(json: string): boolean {
  try {
    JSON.parse(json);
    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitize and validate object keys (prevent prototype pollution)
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized: any = {};
  
  for (const [key, value] of Object.entries(obj)) {
    // Skip dangerous keys
    if (['__proto__', 'constructor', 'prototype'].includes(key)) {
      continue;
    }
    
    // Sanitize string values
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized as T;
}

/**
 * Comprehensive validation for checkout data
 */
export function validateCheckoutData(data: {
  address: string;
  city: string;
  region?: string;
  postalCode?: string;
  phone: string;
  notes?: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!validateAddress(data.address)) {
    errors.push('Dirección inválida');
  }
  
  if (!data.city || data.city.length < 2 || data.city.length > 100) {
    errors.push('Ciudad inválida');
  }
  
  if (data.postalCode && !validatePostalCode(data.postalCode)) {
    errors.push('Código postal inválido');
  }
  
  if (!validatePhone(data.phone)) {
    errors.push('Teléfono inválido');
  }
  
  if (data.notes && data.notes.length > 1000) {
    errors.push('Las notas son demasiado largas');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Comprehensive validation for registration data
 */
export function validateRegistrationData(data: {
  email: string;
  password: string;
  firstName: string;
  rut: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!validateEmail(data.email)) {
    errors.push('Email inválido');
  }
  
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.valid) {
    errors.push(...passwordValidation.errors);
  }
  
  if (!validateName(data.firstName)) {
    errors.push('Nombre inválido');
  }
  
  // RUT validation is done separately with validateRut from rut.ts
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
