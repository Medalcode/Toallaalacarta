import { describe, it, expect } from 'vitest';
import { generateBuyOrder, getTransbankStatusLabel, getWebpayTransaction } from '../lib/transbank';

describe('Transbank Integration Helpers', () => {
  it('should generate buy order with format O-<timestamp>-<random>', () => {
    const buyOrder = generateBuyOrder();
    expect(buyOrder).toMatch(/^O-\d{6}-\d{3}$/);
  });

  it('should generate unique buy orders', () => {
    const buyOrder1 = generateBuyOrder();
    const buyOrder2 = generateBuyOrder();
    expect(buyOrder1).not.toBe(buyOrder2);
  });

  it('should translate Transbank status codes to readable Spanish labels', () => {
    expect(getTransbankStatusLabel('AUTHORIZED')).toBe('Autorizado');
    expect(getTransbankStatusLabel('FAILED')).toBe('Fallido');
    expect(getTransbankStatusLabel('NULLIFIED')).toBe('Anulado');
    expect(getTransbankStatusLabel('PARTIALLY_NULLIFIED')).toBe('Parcialmente Anulado');
    expect(getTransbankStatusLabel('CAPTURED')).toBe('Capturado');
  });

  it('should return raw status string if status is unknown', () => {
    expect(getTransbankStatusLabel('UNKNOWN_STATUS' as any)).toBe('UNKNOWN_STATUS');
  });

  it('should return configured WebpayPlus transaction instance', () => {
    const tx = getWebpayTransaction();
    expect(tx).toBeDefined();
    expect(typeof tx.create).toBe('function');
    expect(typeof tx.commit).toBe('function');
  });
});
