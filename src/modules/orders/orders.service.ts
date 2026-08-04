import { ID, Databases, Query, type Models } from 'appwrite';
import { APP_CONFIG } from '@/infrastructure/config';
import type { CreateOrderDTO, OrderDocument } from './orders.types';
import { generateOrderNumber } from '@/lib/order-utils'; 

export interface ListOrdersParams {
  status?: string;
  searchQuery?: string;
  limit?: number;
  offset?: number;
  startDate?: string;
  endDate?: string;
}

export interface UpdateOrderStatusParams {
  orderId: string;
  status: string;
  trackingNumber?: string;
}

export interface OrderStatsResult {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export class OrderService {
  private get dbId() {
    return APP_CONFIG.appwrite.databaseId;
  }

  private get collectionId() {
    return APP_CONFIG.appwrite.collections.orders;
  }

  /**
   * Creates a new order in the database.
   * @param data Order data
   * @param databases Appwrite Databases instance (authenticated)
   */
  async createOrder(data: CreateOrderDTO, databases: Databases): Promise<OrderDocument> {
    const orderNumber = generateOrderNumber();

    const orderDoc = {
      customer_email: data.userEmail,
      customer_rut: data.userId, // Assuming RUT is ID as per original code
      customer_name: data.shippingAddress.name,
      order_number: orderNumber,
      total_price: data.totalPrice,
      status: 'pending' as const,
      payment_status: 'pending' as const,
      payment_method: null,
      payment_transaction_id: null,
      shipping_address_json: JSON.stringify(data.shippingAddress),
      items_json: JSON.stringify(data.items),
      notes: data.notes || '',
    };

    try {
      const response = await databases.createDocument<Models.Document & OrderDocument>(
        this.dbId,
        this.collectionId,
        ID.unique(),
        orderDoc
      );
      return response as unknown as OrderDocument;
    } catch (error) {
      console.error('Error creating order in Appwrite:', error);
      throw new Error('Failed to create order');
    }
  }

  /**
   * Retrieves an order by ID.
   */
  async getOrder(orderId: string, databases: Databases): Promise<OrderDocument | null> {
    try {
      const response = await databases.getDocument<Models.Document & OrderDocument>(
        this.dbId,
        this.collectionId,
        orderId
      );
      return response as unknown as OrderDocument;
    } catch (error) {
      return null;
    }
  }

  /**
   * List all orders with optional filtering and pagination.
   */
  async getAllOrders(
    databases: Databases,
    params: ListOrdersParams = {}
  ): Promise<{ orders: OrderDocument[]; total: number }> {
    const { status, searchQuery, limit = 50, offset = 0, startDate, endDate } = params;

    const queries: string[] = [
      Query.orderDesc('$createdAt'),
      Query.limit(limit),
      Query.offset(offset),
    ];

    if (status && status !== 'all') {
      queries.push(Query.equal('status', status));
    }

    if (searchQuery) {
      queries.push(Query.search('customer_email', searchQuery));
    }

    if (startDate) {
      queries.push(Query.greaterThanEqual('$createdAt', startDate));
    }

    if (endDate) {
      queries.push(Query.lessThanEqual('$createdAt', endDate));
    }

    try {
      const response = await databases.listDocuments<Models.Document & OrderDocument>(
        this.dbId,
        this.collectionId,
        queries
      );

      return {
        orders: response.documents as unknown as OrderDocument[],
        total: response.total,
      };
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  /**
   * Calculates order metrics and summary statistics.
   */
  async getOrderStats(databases: Databases): Promise<OrderStatsResult> {
    try {
      const allOrders = await databases.listDocuments<Models.Document & OrderDocument>(
        this.dbId,
        this.collectionId,
        [Query.limit(1000)]
      );

      const orders = allOrders.documents as unknown as OrderDocument[];
      const total = orders.length;

      const stats: OrderStatsResult = {
        total,
        pending: orders.filter((o) => o.status === 'pending').length,
        processing: orders.filter((o) => o.status === 'processing').length,
        shipped: orders.filter((o) => o.status === 'shipped').length,
        delivered: orders.filter((o) => o.status === 'delivered').length,
        cancelled: orders.filter((o) => o.status === 'cancelled').length,
        totalRevenue: orders.reduce((sum, o) => sum + (o.total_price || 0), 0),
        averageOrderValue: total > 0
          ? orders.reduce((sum, o) => sum + (o.total_price || 0), 0) / total
          : 0,
      };

      return stats;
    } catch (error) {
      console.error('Error fetching order stats:', error);
      throw error;
    }
  }

  /**
   * Updates order status and associated tracking information/timestamps.
   */
  async updateOrderStatus(
    databases: Databases,
    params: UpdateOrderStatusParams
  ): Promise<OrderDocument> {
    const { orderId, status, trackingNumber } = params;

    const updateData: Record<string, unknown> = {
      status,
    };

    if (trackingNumber) {
      updateData.tracking_number = trackingNumber;
    }

    if (status === 'shipped' && !trackingNumber) {
      updateData.shipped_at = new Date().toISOString();
    }

    if (status === 'delivered') {
      updateData.delivered_at = new Date().toISOString();
    }

    try {
      const response = await databases.updateDocument<Models.Document & OrderDocument>(
        this.dbId,
        this.collectionId,
        orderId,
        updateData
      );

      return response as unknown as OrderDocument;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
}

export const orderService = new OrderService();

