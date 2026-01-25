import { WebpayPlus, Options, IntegrationType } from 'transbank-sdk';

/**
 * Transbank configuration
 */
export const TRANSBANK_CONFIG = {
  // Integration environment (sandbox)
  integration: {
    commerceCode: import.meta.env.TRANSBANK_COMMERCE_CODE || '597055555532',
    apiKey: import.meta.env.TRANSBANK_API_KEY || '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C',
  },
  // Production environment
  production: {
    commerceCode: import.meta.env.TRANSBANK_PROD_COMMERCE_CODE,
    apiKey: import.meta.env.TRANSBANK_PROD_API_KEY,
  },
  environment: (import.meta.env.TRANSBANK_ENVIRONMENT || 'integration') as 'integration' | 'production',
};

/**
 * Get configured Webpay Plus instance
 */
export function getWebpayPlus() {
  const isProduction = TRANSBANK_CONFIG.environment === 'production';
  const config = isProduction ? TRANSBANK_CONFIG.production : TRANSBANK_CONFIG.integration;

  if (!config.commerceCode || !config.apiKey) {
    throw new Error('Transbank credentials not configured');
  }

  const options = new Options(
    config.commerceCode,
    config.apiKey,
    isProduction ? IntegrationType.LIVE : IntegrationType.TEST
  );

  return new WebpayPlus(options);
}

/**
 * Generate unique buy order ID
 */
export function generateBuyOrder(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `TBK-${timestamp}-${random}`;
}

/**
 * Transbank transaction status types
 */
export type TransbankStatus = 'AUTHORIZED' | 'FAILED' | 'NULLIFIED' | 'PARTIALLY_NULLIFIED' | 'CAPTURED';

/**
 * Get human-readable status label
 */
export function getTransbankStatusLabel(status: TransbankStatus): string {
  const labels: Record<TransbankStatus, string> = {
    AUTHORIZED: 'Autorizado',
    FAILED: 'Fallido',
    NULLIFIED: 'Anulado',
    PARTIALLY_NULLIFIED: 'Parcialmente Anulado',
    CAPTURED: 'Capturado',
  };
  return labels[status] || status;
}
