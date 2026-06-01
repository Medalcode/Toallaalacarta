/**
 * @legacy Este módulo es compatibilidad histórica.
 * Para nuevos archivos, usar:
 *   - Config:  import { APP_CONFIG } from '@/infrastructure/config'
 *   - Cliente: import { appwriteService } from '@/infrastructure/database/appwrite.client'
 * Migración progresiva: no eliminar hasta que todos los imports apunten a infrastructure/
 */
import { Client, Databases, Account } from 'appwrite';

export const client = new Client();

client
  .setEndpoint(import.meta.env.PUBLIC_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.PUBLIC_APPWRITE_PROJECT_ID);

export const databases = new Databases(client);
export const account = new Account(client);

// IDs constantes para bases de datos y colecciones
// Debes reemplazar estos valores con los IDs reales de tu proyecto en Appwrite
export const APPWRITE_CONFIG = {
  DATABASE_ID: 'toalla-db',
  COLLECTION_PRODUCTS: 'products',
  COLLECTION_VARIANTS: 'variants',
  COLLECTION_CARTS: 'carts',
  COLLECTION_CART_LINES: 'cart-lines',
  COLLECTION_ORDERS: 'orders'
};
