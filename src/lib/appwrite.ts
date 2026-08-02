/**
 * @legacy Este módulo es compatibilidad histórica.
 * Para nuevos archivos, usar:
 *   - Config:  import { APP_CONFIG } from '@/infrastructure/config'
 *   - Cliente: import { appwriteService } from '@/infrastructure/database/appwrite.client'
 * Migración progresiva: no eliminar hasta que todos los imports apunten a infrastructure/
 */
import { appwriteService } from "@/infrastructure/database/appwrite.client";
import { APP_CONFIG } from "@/infrastructure/config";

// Re-export shared singleton instances from infrastructure service
export const account = appwriteService.account;
export const databases = appwriteService.databases;

// Constantes sincronizadas con la configuración centralizada de infraestructura
export const APPWRITE_CONFIG = {
  DATABASE_ID: APP_CONFIG.appwrite.databaseId,
  COLLECTION_PRODUCTS: APP_CONFIG.appwrite.collections.products,
  COLLECTION_VARIANTS: APP_CONFIG.appwrite.collections.variants,
  COLLECTION_CARTS: APP_CONFIG.appwrite.collections.carts,
  COLLECTION_CART_LINES: APP_CONFIG.appwrite.collections.cartLines,
  COLLECTION_ORDERS: APP_CONFIG.appwrite.collections.orders
};
