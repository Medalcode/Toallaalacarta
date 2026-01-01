import {
  HIDDEN_PRODUCT_TAG,
  SHOPIFY_GRAPHQL_API_ENDPOINT,
  TAGS,
} from "@/lib/constants";
import { isShopifyError } from "@/lib/typeGuards";
import { ensureStartsWith } from "@/lib/utils";
import {
  addToCartMutation,
  createCartMutation,
  editCartItemsMutation,
  removeFromCartMutation,
} from "./mutations/cart";
import { ID, Query } from "appwrite";
import { databases, APPWRITE_CONFIG } from "@/lib/appwrite";
import {
  createCustomerMutation,
  getCustomerAccessTokenMutation,
  getUserDetailsQuery,
} from "./mutations/customer";
import { getCartQuery } from "./queries/cart";
import {
  getCollectionProductsQuery,
  getCollectionQuery,
  getCollectionsQuery,
} from "./queries/collection";
import { getMenuQuery } from "./queries/menu";
import { getPageQuery, getPagesQuery } from "./queries/page";
import {
  getHighestProductPriceQuery,
  getProductQuery,
  getProductRecommendationsQuery,
  getProductsQuery,
} from "./queries/product";
import { getVendorsQuery } from "./queries/vendor";
import { mockProducts, mockCollections } from "./mockData";
import type {
  Cart,
  Collection,
  Connection,
  CustomerInput,
  Image,
  Menu,
  Page,
  PageInfo,
  Product,
  ShopifyAddToCartOperation,
  ShopifyCart,
  ShopifyCartOperation,
  ShopifyCollection,
  ShopifyCollectionOperation,
  ShopifyCollectionProductsOperation,
  ShopifyCollectionsOperation,
  ShopifyCreateCartOperation,
  ShopifyMenuOperation,
  ShopifyPageOperation,
  ShopifyPagesOperation,
  ShopifyProduct,
  ShopifyProductOperation,
  ShopifyProductRecommendationsOperation,
  ShopifyProductsOperation,
  ShopifyRemoveFromCartOperation,
  ShopifyUpdateCartOperation,
  registerOperation,
  user,
  userOperation,
} from "./types";

const domain = import.meta.env.PUBLIC_SHOPIFY_STORE_DOMAIN
  ? ensureStartsWith(import.meta.env.PUBLIC_SHOPIFY_STORE_DOMAIN, "https://")
  : "";
const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
const key = import.meta.env.PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

// Enable mock mode if Shopify credentials are not configured
const MOCK_MODE = !domain || !key;

if (MOCK_MODE) {
  console.warn('🎭 Running in MOCK MODE - Using demo data. Configure Shopify credentials to use real data.');
}

type ExtractVariables<T> = T extends { variables: object }
  ? T["variables"]
  : never;

export async function shopifyFetch<T>({
  headers,
  query,
  variables,
}: {
  cache?: RequestCache;
  headers?: HeadersInit;
  query: string;
  tags?: string[];
  variables?: ExtractVariables<T>;
}): Promise<{ status: number; body: T } | never> {
  try {
    // console.log("Headers being sent:", {
    //   "Content-Type": "application/json",
    //   "X-Shopify-Storefront-Access-Token": key,
    //   ...headers,
    // });

    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": key,
        ...headers,
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables }),
      }),
    });

    if (!result.ok) {
      throw new Error(`Request failed with status ${result.status}`);
    }

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body,
    };
  } catch (e) {
    if (isShopifyError(e)) {
      throw {
        cause: e.cause?.toString() || "unknown",
        status: e.status || 500,
        message: e.message,
        query,
      };
    }

    throw {
      error: e,
      query,
    };
  }
}

const removeEdgesAndNodes = (array: Connection<any>) => {
  return array.edges.map((edge) => edge?.node);
};

const reshapeCart = (cart: ShopifyCart): Cart => {
  if (!cart.cost?.totalTaxAmount) {
    cart.cost.totalTaxAmount = {
      amount: "0.0",
      currencyCode: "USD",
    };
  }

  return {
    ...cart,
    lines: removeEdgesAndNodes(cart.lines),
  };
};

const reshapeCollection = (
  collection: ShopifyCollection,
): Collection | undefined => {
  if (!collection) {
    return undefined;
  }

  return {
    ...collection,
    path: `/products/${collection.handle}`,
  };
};

const reshapeCollections = (collections: ShopifyCollection[]) => {
  const reshapedCollections = [];

  for (const collection of collections) {
    if (collection) {
      const reshapedCollection = reshapeCollection(collection);

      if (reshapedCollection) {
        reshapedCollections.push(reshapedCollection);
      }
    }
  }

  return reshapedCollections;
};

const reshapeImages = (images: Connection<Image>, productTitle: string) => {
  const flattened = removeEdgesAndNodes(images);

  return flattened.map((image) => {
    const filename = image.url.match(/.*\/(.*)\..*/)[1];
    return {
      ...image,
      altText: image.altText || `${productTitle} - ${filename}`,
    };
  });
};

const reshapeProduct = (
  product: ShopifyProduct,
  filterHiddenProducts: boolean = true,
) => {
  if (
    !product ||
    (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))
  ) {
    return undefined;
  }

  const { images, variants, ...rest } = product;

  return {
    ...rest,
    images: reshapeImages(images, product.title),
    variants: removeEdgesAndNodes(variants),
  };
};

const reshapeProducts = (products: ShopifyProduct[]) => {
  const reshapedProducts = [];

  for (const product of products) {
    if (product) {
      const reshapedProduct = reshapeProduct(product);

      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct);
      }
    }
  }

  return reshapedProducts;
};

export async function createCart(): Promise<Cart> {
  // Use Appwrite for backend if in MOCK_MODE (Database Mode)
  if (MOCK_MODE) {
    try {
      const doc = await databases.createDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTION_CARTS,
        ID.unique(),
        {
          created_at: new Date().toISOString(),
        }
      );
      
      return {
        id: doc.$id,
        checkoutUrl: '#checkout-disabled-in-demo',
        cost: {
          subtotalAmount: { amount: '0', currencyCode: 'CLP' },
          totalAmount: { amount: '0', currencyCode: 'CLP' },
          totalTaxAmount: { amount: '0', currencyCode: 'CLP' },
        },
        lines: [],
        totalQuantity: 0,
      };
    } catch (e) {
      console.error("Appwrite createCart error:", e);
      // Fallback to local
      return {
         id: 'offline-' + Date.now(),
         checkoutUrl: '#',
         cost: { subtotalAmount: {amount:'0', currencyCode:'CLP'}, totalAmount: {amount:'0', currencyCode:'CLP'}, totalTaxAmount: {amount:'0', currencyCode:'CLP'} },
         lines: [],
         totalQuantity: 0
      };
    }
  }

  const res = await shopifyFetch<ShopifyCreateCartOperation>({
    query: createCartMutation,
  });

  return reshapeCart(res.body.data.cartCreate.cart);
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number; attributes?: { key: string; value: string }[] }[],
): Promise<Cart> {
  // Return Appwrite cart in mock mode
  if (MOCK_MODE) {
    try {
      const newLine = lines[0]; // Assuming one line addition at a time usually
      const productId = newLine.merchandiseId.split('/').pop()?.split('Variant')[0];
      const product = mockProducts.find(p => p.id.includes(productId || ''));
      const variant = product?.variants.edges.find(e => e.node.id === newLine.merchandiseId)?.node;

      await databases.createDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTION_CART_LINES,
        ID.unique(),
        {
          cart_id: cartId,
          merchandise_id: newLine.merchandiseId,
          quantity: newLine.quantity,
          attributes_json: JSON.stringify(newLine.attributes || []),
          product_title: product?.title || 'Unknown Product',
          variant_title: variant?.title || 'Default Title',
          price_amount: parseFloat(variant?.price.amount || '0'),
          image_url: product?.images.edges[0]?.node.url || ''
        }
      );

      // Fetch updated cart
      return await getCart(cartId) || {
          id: cartId,
          checkoutUrl: '#',
          cost: { subtotalAmount: {amount:'0', currencyCode:'CLP'}, totalAmount: {amount:'0', currencyCode:'CLP'}, totalTaxAmount: {amount:'0', currencyCode:'CLP'} },
          lines: [],
          totalQuantity: 0
      };

    } catch (e) {
      console.error("Appwrite addToCart error:", e);
      // Fallback
      return {
          id: cartId,
          checkoutUrl: '#',
          cost: { subtotalAmount: {amount:'0', currencyCode:'CLP'}, totalAmount: {amount:'0', currencyCode:'CLP'}, totalTaxAmount: {amount:'0', currencyCode:'CLP'} },
          lines: [],
          totalQuantity: 0
      };
    }
  }

  const res = await shopifyFetch<ShopifyAddToCartOperation>({
    query: addToCartMutation,
    variables: {
      cartId,
      lines,
    },
    cache: "no-store",
  });
  return reshapeCart(res.body.data.cartLinesAdd.cart);
}

export async function removeFromCart(
  cartId: string,
  lineIds: string[],
): Promise<Cart> {
  // Return empty mock cart in mock mode
  if (MOCK_MODE) {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mockCart');
      if (stored) {
        const currentCart = JSON.parse(stored) as Cart;
        const updatedLines = currentCart.lines.filter(line => !lineIds.includes(line.id));
        
        const subtotal = updatedLines.reduce((sum, item) => 
          sum + parseFloat(item.cost.totalAmount.amount) * item.quantity, 0
        );

        const updatedCart = {
          ...currentCart,
          cost: {
            ...currentCart.cost,
            subtotalAmount: { amount: subtotal.toString(), currencyCode: 'CLP' },
            totalAmount: { amount: subtotal.toString(), currencyCode: 'CLP' },
          },
          lines: updatedLines,
          totalQuantity: updatedLines.reduce((sum, item) => sum + item.quantity, 0),
        };

        localStorage.setItem('mockCart', JSON.stringify(updatedCart));
        return updatedCart;
      }
    }
    return {
      id: cartId,
      checkoutUrl: '#',
      cost: {
        subtotalAmount: { amount: '0', currencyCode: 'CLP' },
        totalAmount: { amount: '0', currencyCode: 'CLP' },
        totalTaxAmount: { amount: '0', currencyCode: 'CLP' },
      },
      lines: [],
      totalQuantity: 0,
    };
  }

  const res = await shopifyFetch<ShopifyRemoveFromCartOperation>({
    query: removeFromCartMutation,
    variables: {
      cartId,
      lineIds,
    },
    cache: "no-store",
  });

  return reshapeCart(res.body.data.cartLinesRemove.cart);
}

export async function updateCart(
  cartId: string,
  lines: { id: string; merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  // Return updated mock cart in mock mode
  if (MOCK_MODE) {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mockCart');
      if (stored) {
        const currentCart = JSON.parse(stored) as Cart;
        // Update quantities
        const updatedLines = currentCart.lines.map(line => {
          const update = lines.find(u => u.id === line.id);
          if (update) {
            return { ...line, quantity: update.quantity };
          }
          return line;
        });

        const subtotal = updatedLines.reduce((sum, item) => 
          sum + parseFloat(item.cost.totalAmount.amount) * item.quantity, 0
        );

        const updatedCart = {
          ...currentCart,
          cost: {
            ...currentCart.cost,
            subtotalAmount: { amount: subtotal.toString(), currencyCode: 'CLP' },
            totalAmount: { amount: subtotal.toString(), currencyCode: 'CLP' },
          },
          lines: updatedLines,
          totalQuantity: updatedLines.reduce((sum, item) => sum + item.quantity, 0),
        };

        localStorage.setItem('mockCart', JSON.stringify(updatedCart));
        return updatedCart;
      }
    }
    return {
      id: cartId,
      checkoutUrl: '#',
      cost: {
        subtotalAmount: { amount: '0', currencyCode: 'CLP' },
        totalAmount: { amount: '0', currencyCode: 'CLP' },
        totalTaxAmount: { amount: '0', currencyCode: 'CLP' },
      },
      lines: [],
      totalQuantity: 0,
    };
  }

  const res = await shopifyFetch<ShopifyUpdateCartOperation>({
    query: editCartItemsMutation,
    variables: {
      cartId,
      lines,
    },
    cache: "no-store",
  });

  return reshapeCart(res.body.data.cartLinesUpdate.cart);
}

export async function getCart(cartId: string): Promise<Cart | undefined> {
  // Use Appwrite for backend if in MOCK_MODE
  if (MOCK_MODE) {
    try {
        // Fetch cart lines
        const linesResponse = await databases.listDocuments(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTION_CART_LINES,
            [Query.equal('cart_id', cartId), Query.limit(100)]
        );

        const lines = linesResponse.documents.map(doc => {
            return {
                id: doc.$id,
                quantity: doc.quantity,
                cost: {
                    totalAmount: { 
                        amount: String(doc.price_amount * doc.quantity), 
                        currencyCode: 'CLP' 
                    }
                },
                merchandise: {
                    id: doc.merchandise_id,
                    title: doc.variant_title || 'Variant',
                    selectedOptions: [{name: 'Title', value: doc.variant_title}], 
                    product: {
                        title: doc.product_title || 'Product',
                        handle: 'toalla-bano-premium-personalizada', // hardcoded fallback for url
                        featuredImage: { url: doc.image_url || '' },
                        images: { edges: [{ node: { url: doc.image_url || '', altText: '' } }] }
                    }
                },
                attributes: doc.attributes_json ? JSON.parse(doc.attributes_json) : []
            };
        });

        const subtotal = lines.reduce((sum: number, line: any) => sum + parseFloat(line.cost.totalAmount.amount), 0);
        
        return {
            id: cartId,
            checkoutUrl: '#',
            cost: {
                subtotalAmount: { amount: subtotal.toString(), currencyCode: 'CLP' },
                totalAmount: { amount: subtotal.toString(), currencyCode: 'CLP' },
                totalTaxAmount: { amount: '0', currencyCode: 'CLP' }
            },
            lines: lines as any[],
            totalQuantity: lines.reduce((sum: number, line: any) => sum + line.quantity, 0)
        };

    } catch (e) {
        console.error("Error getting Appwrite cart:", e);
        return undefined;
    }
  }

  const res = await shopifyFetch<ShopifyCartOperation>({
    query: getCartQuery,
    variables: { cartId },
    tags: [TAGS.cart],
    cache: "no-store",
  });

  // Old carts becomes `null` when you checkout.
  if (!res.body.data.cart) {
    return undefined;
  }

  return reshapeCart(res.body.data.cart);
}

export async function getCollection(
  handle: string,
): Promise<Collection | undefined> {
  const res = await shopifyFetch<ShopifyCollectionOperation>({
    query: getCollectionQuery,
    tags: [TAGS.collections],
    variables: {
      handle,
    },
  });

  return reshapeCollection(res.body.data.collection);
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey,
  filterCategoryProduct,
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
  filterCategoryProduct?: any[]; // Update the type based on your GraphQL schema
}): Promise<{ pageInfo: PageInfo | null; products: Product[] }> {
  // Return mock data if in mock mode
  if (MOCK_MODE) {
    const products = reshapeProducts(mockProducts);
    return {
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        endCursor: '',
      },
      products,
    };
  }

  const res = await shopifyFetch<ShopifyCollectionProductsOperation>({
    query: getCollectionProductsQuery,
    tags: [TAGS.collections, TAGS.products],
    variables: {
      handle: collection,
      reverse,
      sortKey: sortKey === "CREATED_AT" ? "CREATED" : sortKey,
      filterCategoryProduct,
    } as {
      handle: string;
      reverse?: boolean;
      sortKey?: string;
      filterCategoryProduct?: any[];
    },
  });

  if (!res.body.data.collection) {
    return { pageInfo: null, products: [] };
  }

  // return reshapeProducts(removeEdgesAndNodes(res.body.data.collection.products));
  const pageInfo = res.body.data?.collection?.products?.pageInfo;

  return {
    pageInfo,
    products: reshapeProducts(
      removeEdgesAndNodes(res.body.data.collection.products),
    ),
  };
}

export async function createCustomer(input: CustomerInput): Promise<any> {
  const res = await shopifyFetch<registerOperation>({
    query: createCustomerMutation,
    variables: {
      input,
    },
    cache: "no-store",
  });
  // console.log(res.body.data.customerCreate.customerUserErrors)

  const customer = res.body.data?.customerCreate?.customer;
  const customerCreateErrors =
    res.body.data?.customerCreate?.customerUserErrors;

  return { customer, customerCreateErrors };
}

export async function getCustomerAccessToken({
  email,
  password,
}: Partial<CustomerInput>): Promise<any> {
  const res = await shopifyFetch<any>({
    query: getCustomerAccessTokenMutation,
    variables: { input: { email, password } },
  });

  const token =
    res.body.data?.customerAccessTokenCreate?.customerAccessToken?.accessToken;
  const customerLoginErrors =
    res?.body?.data?.customerAccessTokenCreate?.customerUserErrors;

  return { token, customerLoginErrors };
}

export async function getUserDetails(accessToken: string): Promise<user> {
  const response = await shopifyFetch<userOperation>({
    query: getUserDetailsQuery,
    variables: {
      input: accessToken,
    },
    cache: "no-store",
  });

  return response.body.data;
}

export async function getCollections(): Promise<Collection[]> {
  // Return mock data if in mock mode
  if (MOCK_MODE) {
    return mockCollections;
  }

  const res = await shopifyFetch<ShopifyCollectionsOperation>({
    query: getCollectionsQuery,
    tags: [TAGS.collections],
  });
  const shopifyCollections = removeEdgesAndNodes(res.body?.data?.collections);
  const collections = [
    ...reshapeCollections(shopifyCollections).filter(
      (collection) => !collection.handle.startsWith("hidden"),
    ),
  ];

  return collections;
}

export async function getMenu(handle: string): Promise<Menu[]> {
  const res = await shopifyFetch<ShopifyMenuOperation>({
    query: getMenuQuery,
    tags: [TAGS.collections],
    variables: {
      handle,
    },
  });

  return (
    res.body?.data?.menu?.items.map((item: { title: string; url: string }) => ({
      title: item.title,
      path: item.url
        .replace(domain, "")
        .replace("/collections", "/search")
        .replace("/pages", ""),
    })) || []
  );
}

export async function getPage(handle: string): Promise<Page> {
  const res = await shopifyFetch<ShopifyPageOperation>({
    query: getPageQuery,
    variables: { handle },
  });

  return res.body.data.pageByHandle;
}

export async function getPages(): Promise<Page[]> {
  const res = await shopifyFetch<ShopifyPagesOperation>({
    query: getPagesQuery,
  });

  return removeEdgesAndNodes(res.body.data.pages);
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  // Return mock data if in mock mode
  if (MOCK_MODE) {
    const product = mockProducts.find(p => p.handle === handle);
    return product ? reshapeProduct(product, false) : undefined;
  }

  const res = await shopifyFetch<ShopifyProductOperation>({
    query: getProductQuery,
    tags: [TAGS.products],
    variables: {
      handle,
    },
  });

  return reshapeProduct(res.body.data.product, false);
}

export async function getProductRecommendations(
  productId: string,
): Promise<Product[]> {
  // Return mock data if in mock mode
  if (MOCK_MODE) {
    // Return random 3 products as recommendations
    const randomProducts = mockProducts
      .filter(p => p.id !== productId)
      .slice(0, 3);
    return reshapeProducts(randomProducts);
  }

  const res = await shopifyFetch<ShopifyProductRecommendationsOperation>({
    query: getProductRecommendationsQuery,
    tags: [TAGS.products],
    variables: {
      productId,
    },
  });

  return reshapeProducts(res.body.data.productRecommendations);
}

export async function getVendors({
  query,
  reverse,
  sortKey,
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<{ vendor: string; productCount: number }[]> {
  // Return mock data if in mock mode
  if (MOCK_MODE) {
    return [{ vendor: 'Toalla a la Carta', productCount: mockProducts.length }];
  }

  const res = await shopifyFetch<ShopifyProductsOperation>({
    query: getVendorsQuery,
    tags: [TAGS.products],
    variables: {
      query,
      reverse,
      sortKey,
    },
  });

  const products = removeEdgesAndNodes(res.body.data.products);

  // Create an array to store objects with vendor names and product counts
  const vendorProductCounts: { vendor: string; productCount: number }[] = [];

  // Process the products and count them by vendor
  products.forEach((product) => {
    const vendor = product.vendor;
    if (vendor) {
      // Check if the vendor is already in the array
      const existingVendor = vendorProductCounts.find(
        (v) => v.vendor === vendor,
      );

      if (existingVendor) {
        // Increment the product count for the existing vendor
        existingVendor.productCount++;
      } else {
        // Add a new vendor entry
        vendorProductCounts.push({ vendor, productCount: 1 });
      }
    }
  });

  return vendorProductCounts;
}

export async function getTags({
  query,
  reverse,
  sortKey,
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  // Return mock data if in mock mode
  if (MOCK_MODE) {
    return reshapeProducts(mockProducts);
  }

  const res = await shopifyFetch<ShopifyProductsOperation>({
    query: getProductsQuery,
    tags: [TAGS.products],
    variables: {
      query,
      reverse,
      sortKey,
    },
  });

  return reshapeProducts(removeEdgesAndNodes(res.body.data.products));
}

export async function getProducts({
  query,
  reverse,
  sortKey,
  cursor,
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
  cursor?: string;
}): Promise<{ pageInfo: PageInfo; products: Product[] }> {
  // Return mock data if in mock mode
  if (MOCK_MODE) {
    const products = reshapeProducts(mockProducts);
    return {
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        endCursor: '',
      },
      products,
    };
  }

  const res = await shopifyFetch<ShopifyProductsOperation>({
    query: getProductsQuery,
    tags: [TAGS.products],
    variables: {
      query,
      reverse,
      sortKey,
      cursor,
    },
  });

  const pageInfo = res.body.data?.products?.pageInfo;

  return {
    pageInfo,
    products: reshapeProducts(removeEdgesAndNodes(res.body.data.products)),
  };
}

export async function getHighestProductPrice(): Promise<{
  amount: string;
  currencyCode: string;
} | null> {
  // Return mock data if in mock mode
  if (MOCK_MODE) {
    return { amount: '120000', currencyCode: 'CLP' };
  }

  try {
    const res = await shopifyFetch<any>({
      query: getHighestProductPriceQuery,
    });

    const highestProduct = res?.body?.data?.products?.edges[0]?.node;
    const highestProductPrice = highestProduct?.variants?.edges[0]?.node?.price;

    return highestProductPrice || null;
  } catch (error) {
    console.log("Error fetching highest product price:", error);
    throw error;
  }
}
