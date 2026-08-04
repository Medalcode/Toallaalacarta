import { describe, it, expect } from 'vitest';
import {
  ordersToCSV,
  filterOrdersForExport,
  getExportStats,
  formatCurrency,
  formatDate,
  generateExportFilename,
} from '../lib/export-utils';

describe('export-utils', () => {
  const mockOrders: any[] = [
    {
      $id: 'ord-1',
      order_number: 'ORD-20260803-001',
      customer_name: 'Juan Pérez',
      customer_email: 'juan@example.com',
      customer_rut: '12345678-9',
      status: 'pending',
      payment_status: 'paid',
      total_price: 15000,
      shipping_address: {
        address: 'Av. Providencia 123',
        city: 'Santiago',
        phone: '+56912345678',
      },
      items: [{ title: 'Toalla Bordada', quantity: 2 }],
      tracking_number: 'TRK123',
      $createdAt: '2026-08-01T10:00:00.000Z',
    },
    {
      $id: 'ord-2',
      order_number: 'ORD-20260803-002',
      customer_name: 'Maria Silva',
      customer_email: 'maria@example.com',
      customer_rut: '98765432-1',
      status: 'shipped',
      payment_status: 'paid',
      total_price: 25000,
      shipping_address: {
        address: 'Calle Los Olivos 456',
        city: 'Viña del Mar',
        phone: '+56987654321',
      },
      items: [{ title: 'Toalla Baño', quantity: 1 }],
      tracking_number: 'TRK456',
      $createdAt: '2026-08-02T15:00:00.000Z',
    },
  ];

  describe('ordersToCSV', () => {
    it('should generate valid CSV header and rows', () => {
      const csv = ordersToCSV(mockOrders);
      expect(csv).toContain('Número de Orden,Fecha,Cliente,Email,RUT');
      expect(csv).toContain('ORD-20260803-001');
      expect(csv).toContain('Juan Pérez');
      expect(csv).toContain('ORD-20260803-002');
    });

    it('should handle empty orders list', () => {
      const csv = ordersToCSV([]);
      expect(csv).toContain('Número de Orden,Fecha,Cliente');
      expect(csv.split('\n').length).toBe(1);
    });
  });

  describe('filterOrdersForExport', () => {
    it('should filter orders by status', () => {
      const filtered = filterOrdersForExport(mockOrders, { status: 'shipped' });
      expect(filtered.length).toBe(1);
      expect(filtered[0].order_number).toBe('ORD-20260803-002');
    });

    it('should filter orders by search query', () => {
      const filtered = filterOrdersForExport(mockOrders, { searchQuery: 'juan' });
      expect(filtered.length).toBe(1);
      expect(filtered[0].customer_name).toBe('Juan Pérez');
    });
  });

  describe('getExportStats', () => {
    it('should calculate revenue and average correctly', () => {
      const stats = getExportStats(mockOrders);
      expect(stats.total).toBe(2);
      expect(stats.totalRevenue).toBe(40000);
      expect(stats.averageOrderValue).toBe(20000);
      expect(stats.statusCounts.pending).toBe(1);
      expect(stats.statusCounts.shipped).toBe(1);
    });
  });

  describe('formatters', () => {
    it('should format currency in CLP', () => {
      const formatted = formatCurrency(15000);
      expect(formatted).toContain('15.000');
    });

    it('should generate export filename with timestamp', () => {
      const filename = generateExportFilename('pedidos', 'csv');
      expect(filename).toMatch(/^pedidos_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\.csv$/);
    });
  });
});
