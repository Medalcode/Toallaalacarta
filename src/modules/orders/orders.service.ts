import { ID, Databases, type Models } from 'appwrite';
import { APP_CONFIG } from '@/infrastructure/config';
import type { CreateOrderDTO, OrderDocument } from './orders.types';
import { generateOrderNumber } from '@/lib/order-utils'; 

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
}

export const orderService = new OrderService();
