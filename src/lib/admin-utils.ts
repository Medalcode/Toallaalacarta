/**
 * Admin utilities and helpers
 */

import { Client, Databases, Query, Account } from 'appwrite';
import { APPWRITE_CONFIG } from './appwrite';

/**
 * Check if a user is an admin
 * For now, we'll use a simple email-based check
 * In production, you should use Appwrite Teams or custom user attributes
 */
export async function isAdmin(token: string): Promise<boolean> {
  try {
    const client = new Client();
    client
      .setEndpoint(import.meta.env.PUBLIC_APPWRITE_ENDPOINT)
      .setProject(import.meta.env.PUBLIC_APPWRITE_PROJECT_ID)
      .setSession(token);

    const account = new Account(client);
    const user = await account.get();

    // Check if user email is in admin list
    const adminEmails = (import.meta.env.ADMIN_EMAILS || '').split(',').map((e: string) => e.trim());
    
    return adminEmails.includes(user.email);
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * Get all orders with optional filters
 */
export async function getAllOrders({
  token,
  status,
  searchQuery,
  limit = 50,
  offset = 0,
}: {
  token: string;
  status?: string;
  searchQuery?: string;
  limit?: number;
  offset?: number;
}) {
  const client = new Client();
  client
    .setEndpoint(import.meta.env.PUBLIC_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.PUBLIC_APPWRITE_PROJECT_ID)
    .setSession(token);

  const databases = new Databases(client);

  const queries: string[] = [
    Query.orderDesc('$createdAt'),
    Query.limit(limit),
    Query.offset(offset),
  ];

  // Filter by status if provided
  if (status && status !== 'all') {
    queries.push(Query.equal('status', status));
  }

  // Search by email or RUT if provided
  if (searchQuery) {
    // Try to search by email or RUT
    queries.push(Query.search('customer_email', searchQuery));
  }

  try {
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.DATABASE_ID,
      APPWRITE_CONFIG.COLLECTION_ORDERS,
      queries
    );

    return {
      orders: response.documents,
      total: response.total,
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
}

/**
 * Get order statistics
 */
export async function getOrderStats(token: string) {
  const client = new Client();
  client
    .setEndpoint(import.meta.env.PUBLIC_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.PUBLIC_APPWRITE_PROJECT_ID)
    .setSession(token);

  const databases = new Databases(client);

  try {
    // Get all orders
    const allOrders = await databases.listDocuments(
      APPWRITE_CONFIG.DATABASE_ID,
      APPWRITE_CONFIG.COLLECTION_ORDERS,
      [Query.limit(1000)] // Adjust based on your needs
    );

    const orders = allOrders.documents;

    // Calculate statistics
    const stats = {
      total: orders.length,
      pending: orders.filter((o: any) => o.status === 'pending').length,
      processing: orders.filter((o: any) => o.status === 'processing').length,
      shipped: orders.filter((o: any) => o.status === 'shipped').length,
      delivered: orders.filter((o: any) => o.status === 'delivered').length,
      cancelled: orders.filter((o: any) => o.status === 'cancelled').length,
      totalRevenue: orders.reduce((sum: number, o: any) => sum + (o.total_price || 0), 0),
      averageOrderValue: orders.length > 0 
        ? orders.reduce((sum: number, o: any) => sum + (o.total_price || 0), 0) / orders.length 
        : 0,
    };

    return stats;
  } catch (error) {
    console.error('Error fetching order stats:', error);
    throw error;
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus({
  token,
  orderId,
  status,
  trackingNumber,
}: {
  token: string;
  orderId: string;
  status: string;
  trackingNumber?: string;
}) {
  const client = new Client();
  client
    .setEndpoint(import.meta.env.PUBLIC_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.PUBLIC_APPWRITE_PROJECT_ID)
    .setSession(token);

  const databases = new Databases(client);

  try {
    const updateData: any = {
      status,
    };

    // Add tracking number if provided
    if (trackingNumber) {
      updateData.tracking_number = trackingNumber;
    }

    // Add timestamps based on status
    if (status === 'shipped' && !trackingNumber) {
      updateData.shipped_at = new Date().toISOString();
    }
    if (status === 'delivered') {
      updateData.delivered_at = new Date().toISOString();
    }

    const response = await databases.updateDocument(
      APPWRITE_CONFIG.DATABASE_ID,
      APPWRITE_CONFIG.COLLECTION_ORDERS,
      orderId,
      updateData
    );

    return response;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

/**
 * Get single order by ID
 */
export async function getOrderById(token: string, orderId: string) {
  const client = new Client();
  client
    .setEndpoint(import.meta.env.PUBLIC_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.PUBLIC_APPWRITE_PROJECT_ID)
    .setSession(token);

  const databases = new Databases(client);

  try {
    const order = await databases.getDocument(
      APPWRITE_CONFIG.DATABASE_ID,
      APPWRITE_CONFIG.COLLECTION_ORDERS,
      orderId
    );

    return order;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
}
