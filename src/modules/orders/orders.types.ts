export interface OrderItem {
  id: string; // Product/Variant ID
  title: string;
  variantTitle?: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  region: string;
  postal_code: string;
}

export interface CreateOrderDTO {
  userId: string;
  userEmail: string;
  items: OrderItem[];
  totalPrice: number;
  shippingAddress: ShippingAddress;
  notes?: string;
}

// Ensure this matches Appwrite document structure
export interface OrderDocument {
  $id?: string;
  customer_email: string;
  customer_rut: string;
  customer_name: string;
  order_number: string;
  total_price: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method?: string | null;
  payment_transaction_id?: string | null;
  shipping_address_json: string; // JSON stringified ShippingAddress
  items_json: string; // JSON stringified OrderItem[]
  notes?: string;
  tracking_number?: string | null;
  shipped_at?: string | null;
  delivered_at?: string | null;
}
