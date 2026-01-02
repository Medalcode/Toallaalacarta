/**
 * Inventory Management Utilities
 * Functions for managing product inventory
 */

import { databases } from './appwrite';
import { ID, Query } from 'appwrite';

const DATABASE_ID = import.meta.env.PUBLIC_APPWRITE_DATABASE_ID || 'toalla-db';
const INVENTORY_COLLECTION_ID = 'inventory';
const INVENTORY_HISTORY_COLLECTION_ID = 'inventory_history';

export interface InventoryItem {
  $id: string;
  $createdAt: string;
  product_id: string;
  product_title: string;
  variant_id?: string;
  variant_title?: string;
  sku?: string;
  quantity: number;
  low_stock_threshold: number;
  reorder_point: number;
  last_updated_by?: string;
  notes?: string;
}

export interface InventoryHistory {
  $id: string;
  $createdAt: string;
  inventory_id: string;
  product_title: string;
  change_type: 'adjustment' | 'sale' | 'restock' | 'return';
  quantity_before: number;
  quantity_after: number;
  quantity_change: number;
  reason?: string;
  changed_by: string;
  order_id?: string;
}

/**
 * Get all inventory items
 */
export async function getAllInventory(): Promise<InventoryItem[]> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      INVENTORY_COLLECTION_ID,
      [Query.orderDesc('$createdAt'), Query.limit(100)]
    );
    return response.documents as unknown as InventoryItem[];
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return [];
  }
}

/**
 * Get inventory by product ID
 */
export async function getInventoryByProduct(productId: string): Promise<InventoryItem | null> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      INVENTORY_COLLECTION_ID,
      [Query.equal('product_id', productId)]
    );
    return response.documents[0] as unknown as InventoryItem || null;
  } catch (error) {
    console.error('Error fetching inventory for product:', error);
    return null;
  }
}

/**
 * Get low stock items
 */
export async function getLowStockItems(): Promise<InventoryItem[]> {
  try {
    const allItems = await getAllInventory();
    return allItems.filter(item => item.quantity <= item.low_stock_threshold);
  } catch (error) {
    console.error('Error fetching low stock items:', error);
    return [];
  }
}

/**
 * Create inventory item
 */
export async function createInventoryItem(data: {
  product_id: string;
  product_title: string;
  variant_id?: string;
  variant_title?: string;
  sku?: string;
  quantity: number;
  low_stock_threshold?: number;
  reorder_point?: number;
  changed_by: string;
}): Promise<InventoryItem | null> {
  try {
    const item = await databases.createDocument(
      DATABASE_ID,
      INVENTORY_COLLECTION_ID,
      ID.unique(),
      {
        product_id: data.product_id,
        product_title: data.product_title,
        variant_id: data.variant_id || '',
        variant_title: data.variant_title || '',
        sku: data.sku || '',
        quantity: data.quantity,
        low_stock_threshold: data.low_stock_threshold || 10,
        reorder_point: data.reorder_point || 5,
        last_updated_by: data.changed_by,
      }
    );

    // Log history
    await logInventoryChange({
      inventory_id: item.$id,
      product_title: data.product_title,
      change_type: 'restock',
      quantity_before: 0,
      quantity_after: data.quantity,
      quantity_change: data.quantity,
      reason: 'Initial stock',
      changed_by: data.changed_by,
    });

    return item as unknown as InventoryItem;
  } catch (error) {
    console.error('Error creating inventory item:', error);
    return null;
  }
}

/**
 * Update inventory quantity
 */
export async function updateInventoryQuantity(
  inventoryId: string,
  newQuantity: number,
  changeType: 'adjustment' | 'sale' | 'restock' | 'return',
  changedBy: string,
  reason?: string,
  orderId?: string
): Promise<boolean> {
  try {
    // Get current item
    const currentItem = await databases.getDocument(
      DATABASE_ID,
      INVENTORY_COLLECTION_ID,
      inventoryId
    ) as unknown as InventoryItem;

    const quantityBefore = currentItem.quantity;
    const quantityChange = newQuantity - quantityBefore;

    // Update quantity
    await databases.updateDocument(
      DATABASE_ID,
      INVENTORY_COLLECTION_ID,
      inventoryId,
      {
        quantity: newQuantity,
        last_updated_by: changedBy,
      }
    );

    // Log history
    await logInventoryChange({
      inventory_id: inventoryId,
      product_title: currentItem.product_title,
      change_type: changeType,
      quantity_before: quantityBefore,
      quantity_after: newQuantity,
      quantity_change: quantityChange,
      reason,
      changed_by: changedBy,
      order_id: orderId,
    });

    console.log(`✅ Inventory updated: ${currentItem.product_title} (${quantityBefore} → ${newQuantity})`);
    return true;
  } catch (error) {
    console.error('Error updating inventory:', error);
    return false;
  }
}

/**
 * Decrease inventory (for sales)
 */
export async function decreaseInventory(
  productId: string,
  quantity: number,
  orderId?: string
): Promise<boolean> {
  try {
    const item = await getInventoryByProduct(productId);
    if (!item) {
      console.warn(`Inventory item not found for product: ${productId}`);
      return false;
    }

    const newQuantity = Math.max(0, item.quantity - quantity);
    return await updateInventoryQuantity(
      item.$id,
      newQuantity,
      'sale',
      'system',
      `Sold ${quantity} units`,
      orderId
    );
  } catch (error) {
    console.error('Error decreasing inventory:', error);
    return false;
  }
}

/**
 * Increase inventory (for restocks/returns)
 */
export async function increaseInventory(
  productId: string,
  quantity: number,
  changeType: 'restock' | 'return',
  changedBy: string,
  reason?: string
): Promise<boolean> {
  try {
    const item = await getInventoryByProduct(productId);
    if (!item) {
      console.warn(`Inventory item not found for product: ${productId}`);
      return false;
    }

    const newQuantity = item.quantity + quantity;
    return await updateInventoryQuantity(
      item.$id,
      newQuantity,
      changeType,
      changedBy,
      reason
    );
  } catch (error) {
    console.error('Error increasing inventory:', error);
    return false;
  }
}

/**
 * Log inventory change to history
 */
async function logInventoryChange(data: {
  inventory_id: string;
  product_title: string;
  change_type: 'adjustment' | 'sale' | 'restock' | 'return';
  quantity_before: number;
  quantity_after: number;
  quantity_change: number;
  reason?: string;
  changed_by: string;
  order_id?: string;
}): Promise<void> {
  try {
    await databases.createDocument(
      DATABASE_ID,
      INVENTORY_HISTORY_COLLECTION_ID,
      ID.unique(),
      {
        inventory_id: data.inventory_id,
        product_title: data.product_title,
        change_type: data.change_type,
        quantity_before: data.quantity_before,
        quantity_after: data.quantity_after,
        quantity_change: data.quantity_change,
        reason: data.reason || '',
        changed_by: data.changed_by,
        order_id: data.order_id || '',
      }
    );
  } catch (error) {
    console.error('Error logging inventory change:', error);
  }
}

/**
 * Get inventory history for an item
 */
export async function getInventoryHistory(inventoryId: string): Promise<InventoryHistory[]> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      INVENTORY_HISTORY_COLLECTION_ID,
      [
        Query.equal('inventory_id', inventoryId),
        Query.orderDesc('$createdAt'),
        Query.limit(50)
      ]
    );
    return response.documents as unknown as InventoryHistory[];
  } catch (error) {
    console.error('Error fetching inventory history:', error);
    return [];
  }
}

/**
 * Get inventory statistics
 */
export async function getInventoryStats() {
  try {
    const items = await getAllInventory();
    const lowStockItems = items.filter(item => item.quantity <= item.low_stock_threshold);
    const outOfStockItems = items.filter(item => item.quantity === 0);
    const totalValue = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      totalItems: items.length,
      totalUnits: totalValue,
      lowStockCount: lowStockItems.length,
      outOfStockCount: outOfStockItems.length,
      lowStockItems,
      outOfStockItems,
    };
  } catch (error) {
    console.error('Error calculating inventory stats:', error);
    return {
      totalItems: 0,
      totalUnits: 0,
      lowStockCount: 0,
      outOfStockCount: 0,
      lowStockItems: [],
      outOfStockItems: [],
    };
  }
}
