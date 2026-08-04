import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrderService } from '../modules/orders/orders.service';
import { Databases, ID } from 'appwrite';

// Mock generateOrderNumber so it's predictable
vi.mock('../lib/order-utils', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    generateOrderNumber: vi.fn(() => 'ORD-12345678-001'),
  };
});

describe('OrderService', () => {
  let orderService: OrderService;
  let mockDatabases: any;

  beforeEach(() => {
    orderService = new OrderService();
    mockDatabases = {
      createDocument: vi.fn(),
      getDocument: vi.fn(),
    };
  });

  describe('createOrder', () => {
    it('should create an order with correct pending status', async () => {
      const mockOrderDTO = {
        userId: 'user123',
        userEmail: 'test@example.com',
        items: [{ id: 'item1', title: 'Product 1', price: 1000, quantity: 2, variantTitle: '', image: '' }],
        totalPrice: 2000,
        shippingAddress: { name: 'John Doe', phone: '+56912345678', address: '123 Main St', city: 'Santiago', region: '', postal_code: '' },
        notes: 'Leave at door',
      };

      mockDatabases.createDocument.mockResolvedValueOnce({
        $id: 'doc123',
        order_number: 'ORD-12345678-001',
        total_price: 2000,
        status: 'pending',
        payment_status: 'pending'
      });

      const order = await orderService.createOrder(mockOrderDTO, mockDatabases as unknown as Databases);

      expect(mockDatabases.createDocument).toHaveBeenCalled();
      
      // Verify payload passed to createDocument
      const createPayload = mockDatabases.createDocument.mock.calls[0][3];
      expect(createPayload.status).toBe('pending');
      expect(createPayload.payment_status).toBe('pending');
      expect(createPayload.customer_email).toBe('test@example.com');
      expect(createPayload.total_price).toBe(2000);
      
      expect(order.$id).toBe('doc123');
    });

    it('should throw an error if Appwrite fails', async () => {
      mockDatabases.createDocument.mockRejectedValueOnce(new Error('Appwrite Error'));
      
      const mockOrderDTO = {
        userId: 'user123',
        userEmail: 'test@example.com',
        items: [],
        totalPrice: 0,
        shippingAddress: { name: 'John Doe', phone: '+56912345678', address: '123 Main St', city: 'Santiago', region: '', postal_code: '' },
      };

      await expect(orderService.createOrder(mockOrderDTO, mockDatabases as unknown as Databases)).rejects.toThrow('Failed to create order');
    });
  });

  describe('getAllOrders', () => {
    it('should query listDocuments with correct filters', async () => {
      mockDatabases.listDocuments = vi.fn().mockResolvedValueOnce({
        documents: [{ $id: 'doc1', status: 'pending' }],
        total: 1,
      });

      const res = await orderService.getAllOrders(mockDatabases as unknown as Databases, {
        status: 'pending',
        limit: 10,
      });

      expect(mockDatabases.listDocuments).toHaveBeenCalled();
      expect(res.total).toBe(1);
      expect(res.orders[0].$id).toBe('doc1');
    });
  });

  describe('getOrderStats', () => {
    it('should calculate revenue and status counts correctly', async () => {
      mockDatabases.listDocuments = vi.fn().mockResolvedValueOnce({
        documents: [
          { status: 'pending', total_price: 1000 },
          { status: 'shipped', total_price: 3000 },
        ],
        total: 2,
      });

      const stats = await orderService.getOrderStats(mockDatabases as unknown as Databases);

      expect(stats.total).toBe(2);
      expect(stats.pending).toBe(1);
      expect(stats.shipped).toBe(1);
      expect(stats.totalRevenue).toBe(4000);
      expect(stats.averageOrderValue).toBe(2000);
    });
  });

  describe('updateOrderStatus', () => {
    it('should update document with new status and tracking number', async () => {
      mockDatabases.updateDocument = vi.fn().mockResolvedValueOnce({
        $id: 'doc1',
        status: 'shipped',
        tracking_number: 'TRACK123',
      });

      const result = await orderService.updateOrderStatus(mockDatabases as unknown as Databases, {
        orderId: 'doc1',
        status: 'shipped',
        trackingNumber: 'TRACK123',
      });

      expect(mockDatabases.updateDocument).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        'doc1',
        { status: 'shipped', tracking_number: 'TRACK123' }
      );
      expect(result.status).toBe('shipped');
    });
  });
});

