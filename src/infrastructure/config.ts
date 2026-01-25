export const APP_CONFIG = {
  appwrite: {
    endpoint: import.meta.env.PUBLIC_APPWRITE_ENDPOINT,
    projectId: import.meta.env.PUBLIC_APPWRITE_PROJECT_ID,
    databaseId: 'toalla-db', // Ideally from env
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
