/**
 * Admin utilities and helpers
 */

import { Account } from 'appwrite';
import { appwriteService } from '@/infrastructure/database/appwrite.client';
import { orderService } from '@/modules/orders/orders.service';

/**
 * Check if a user is an admin
 * For now, we'll use a simple email-based check
 * In production, you should use Appwrite Teams or custom user attributes
 */
export async function isAdmin(token: string): Promise<boolean> {
  try {
    const { account } = appwriteService.createSessionClient(token);
    const user = await account.get();

    const adminEmails = (import.meta.env.ADMIN_EMAILS || '')
      .split(',')
      .map((e: string) => e.trim());

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
  startDate,
  endDate,
}: {
  token: string;
  status?: string;
  searchQuery?: string;
  limit?: number;
  offset?: number;
  startDate?: string;
  endDate?: string;
}) {
  const { databases } = appwriteService.createSessionClient(token);
  return orderService.getAllOrders(databases, {
    status,
    searchQuery,
    limit,
    offset,
    startDate,
    endDate,
  });
}

/**
 * Get order statistics
 */
export async function getOrderStats(token: string) {
  const { databases } = appwriteService.createSessionClient(token);
  return orderService.getOrderStats(databases);
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
  const { databases } = appwriteService.createSessionClient(token);
  return orderService.updateOrderStatus(databases, {
    orderId,
    status,
    trackingNumber,
  });
}

/**
 * Get single order by ID
 */
export async function getOrderById(token: string, orderId: string) {
  const { databases } = appwriteService.createSessionClient(token);
  const order = await orderService.getOrder(orderId, databases);
  if (!order) {
    throw new Error('Order not found');
  }
  return order;
}

