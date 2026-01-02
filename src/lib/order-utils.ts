/**
 * Utility functions for order management
 */

/**
 * Generates a unique order number
 * Format: ORD-YYYYMMDD-XXX
 * Example: ORD-20260102-001
 */
export function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
  
  return `ORD-${year}${month}${day}-${random}`;
}

/**
 * Formats a price for display in Chilean pesos
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(price);
}

/**
 * Validates Chilean phone number
 * Accepts formats: +56912345678, 912345678, 56912345678
 */
export function validateChileanPhone(phone: string): boolean {
  // Remove spaces and common separators
  const cleaned = phone.replace(/[\s\-()]/g, '');
  
  // Check if it matches Chilean phone patterns
  const patterns = [
    /^\+569\d{8}$/, // +56912345678
    /^569\d{8}$/,   // 56912345678
    /^9\d{8}$/,     // 912345678
  ];
  
  return patterns.some(pattern => pattern.test(cleaned));
}

/**
 * Formats Chilean phone number to standard format
 * Returns: +56912345678
 */
export function formatChileanPhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-()]/g, '');
  
  // If already has +56, return as is
  if (cleaned.startsWith('+56')) {
    return cleaned;
  }
  
  // If starts with 56, add +
  if (cleaned.startsWith('56')) {
    return '+' + cleaned;
  }
  
  // If starts with 9, add +56
  if (cleaned.startsWith('9')) {
    return '+56' + cleaned;
  }
  
  return phone; // Return original if can't format
}

/**
 * Order status types
 */
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

/**
 * Payment status types
 */
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

/**
 * Gets human-readable status label in Spanish
 */
export function getStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    pending: 'Pendiente',
    processing: 'En Proceso',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
  };
  
  return labels[status] || status;
}

/**
 * Gets payment status label in Spanish
 */
export function getPaymentStatusLabel(status: PaymentStatus): string {
  const labels: Record<PaymentStatus, string> = {
    pending: 'Pendiente',
    paid: 'Pagado',
    failed: 'Fallido',
    refunded: 'Reembolsado',
  };
  
  return labels[status] || status;
}

/**
 * Gets status color for UI
 */
export function getStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  
  return colors[status] || 'bg-gray-100 text-gray-800';
}

/**
 * Gets payment status color for UI
 */
export function getPaymentStatusColor(status: PaymentStatus): string {
  const colors: Record<PaymentStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-orange-100 text-orange-800',
  };
  
  return colors[status] || 'bg-gray-100 text-gray-800';
}

/**
 * Validates postal code (Chilean format)
 */
export function validatePostalCode(code: string): boolean {
  // Chilean postal codes are 7 digits
  return /^\d{7}$/.test(code);
}

/**
 * Chilean regions
 */
export const CHILEAN_REGIONS = [
  'Región de Arica y Parinacota',
  'Región de Tarapacá',
  'Región de Antofagasta',
  'Región de Atacama',
  'Región de Coquimbo',
  'Región de Valparaíso',
  'Región Metropolitana',
  'Región del Libertador General Bernardo O\'Higgins',
  'Región del Maule',
  'Región de Ñuble',
  'Región del Biobío',
  'Región de La Araucanía',
  'Región de Los Ríos',
  'Región de Los Lagos',
  'Región de Aysén del General Carlos Ibáñez del Campo',
  'Región de Magallanes y de la Antártica Chilena',
] as const;

export type ChileanRegion = typeof CHILEAN_REGIONS[number];
