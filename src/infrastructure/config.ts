export const APP_CONFIG = {
  appwrite: {
    endpoint: import.meta.env.PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
    projectId: import.meta.env.PUBLIC_APPWRITE_PROJECT_ID || 'default',
    databaseId: import.meta.env.PUBLIC_APPWRITE_DATABASE_ID || 'toalla-db',
    collections: {
      products: 'products',
      variants: 'variants',
      carts: 'carts',
      cartLines: 'cart-lines',
      orders: 'orders',
    },
  },
  site: {
    name: 'Toalla a la Carta',
    url: import.meta.env.SITE_URL || 'http://localhost:4321',
  }
};
