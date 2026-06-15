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
});
