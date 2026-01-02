import type { APIRoute } from "astro";
import { getCart } from "@/lib/shopify";
import { Client, Databases, ID, Account } from "appwrite";
import { APPWRITE_CONFIG } from "@/lib/appwrite";
import { generateOrderNumber, formatChileanPhone, validateChileanPhone } from "@/lib/order-utils";
import { sendOrderConfirmationEmail } from "@/lib/email";

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const formData = await request.json();
    const { address, city, region, postalCode, phone, notes, cartId } = formData;

    // 1. Require Authentication
    const token = cookies.get("token")?.value;
    
    if (!token) {
        return new Response(JSON.stringify({ message: "Debes iniciar sesión para realizar un pedido" }), {
            status: 401,
        });
    }

    // 2. Setup Appwrite Client with Session
    const client = new Client();
    client
      .setEndpoint(import.meta.env.PUBLIC_APPWRITE_ENDPOINT)
      .setProject(import.meta.env.PUBLIC_APPWRITE_PROJECT_ID)
      .setSession(token);

    const account = new Account(client);
    const databases = new Databases(client);

    // 3. Get Authenticated User Details (source of truth)
    let user;
    try {
        user = await account.get();
    } catch (authError) {
        console.error("Authentication failed in checkout:", authError);
        return new Response(JSON.stringify({ message: "Sesión inválida o expirada" }), {
            status: 401,
        });
    }

    // 4. Validate Required Shipping Fields
    if (!address || !city) {
      return new Response(JSON.stringify({ message: "Dirección y ciudad son obligatorias" }), {
        status: 400,
      });
    }

    if (!cartId) {
      return new Response(JSON.stringify({ message: "Carrito no encontrado" }), {
        status: 400,
      });
    }

    // 5. Validate Phone if provided
    const customerPhone = phone || user.phone || '';
    if (customerPhone && !validateChileanPhone(customerPhone)) {
      return new Response(JSON.stringify({ message: "Número de teléfono inválido" }), {
        status: 400,
      });
    }

    // 6. Get Cart Details and Calculate Total
    let totalPrice = 0;
    let cartItems = [];
    let cart = null;

    try {
      cart = await getCart(cartId);
      if (!cart || !cart.lines || cart.lines.length === 0) {
        return new Response(JSON.stringify({ message: "El carrito está vacío" }), {
          status: 400,
        });
      }

      totalPrice = parseFloat(cart.cost.totalAmount.amount);
      
      // Extract cart items for storage
      cartItems = cart.lines.map((line: any) => ({
        id: line.merchandise.id,
        title: line.merchandise.product.title,
        variantTitle: line.merchandise.title,
        quantity: line.quantity,
        price: parseFloat(line.cost.totalAmount.amount),
        image: line.merchandise.image?.url || null,
      }));
    } catch (e) {
      console.error("Error fetching cart for checkout:", e);
      return new Response(JSON.stringify({ message: "Error al procesar el carrito" }), {
        status: 500,
      });
    }

    // 7. Generate Order Number
    const orderNumber = generateOrderNumber();

    // 8. Prepare Shipping Address JSON
    const shippingAddress = {
      name: user.name || '',
      phone: customerPhone ? formatChileanPhone(customerPhone) : '',
      address: address,
      city: city,
      region: region || '',
      postal_code: postalCode || '',
    };

    // 9. Create Order Document
    const order = await databases.createDocument(
      APPWRITE_CONFIG.DATABASE_ID,
      APPWRITE_CONFIG.COLLECTION_ORDERS,
      ID.unique(),
      {
        // Customer Information
        customer_email: user.email,
        customer_rut: user.$id, // RUT is stored as user ID
        customer_name: user.name || '',
        
        // Order Details
        order_number: orderNumber,
        total_price: totalPrice,
        status: 'pending',
        
        // Payment Information (will be updated when payment is processed)
        payment_status: 'pending',
        payment_method: null,
        payment_transaction_id: null,
        
        // Shipping Information
        shipping_address_json: JSON.stringify(shippingAddress),
        
        // Cart Items
        items_json: JSON.stringify(cartItems),
        
        // Additional Notes
        notes: notes || '',
        
        // Tracking (will be updated later)
        tracking_number: null,
        shipped_at: null,
        delivered_at: null,
      }
    );

    console.log(`✅ Order created: ${orderNumber} (${order.$id})`);

    // 10. Send Order Confirmation Email (non-blocking)
    try {
      await sendOrderConfirmationEmail({
        to: user.email,
        orderNumber,
        customerName: user.name || 'Cliente',
        totalPrice,
        items: cartItems,
        shippingAddress,
      });
    } catch (emailError) {
      // Log error but don't fail the order
      console.error('⚠️  Failed to send confirmation email:', emailError);
    }

    return new Response(JSON.stringify({ 
      orderId: order.$id,
      orderNumber: orderNumber,
      totalPrice: totalPrice,
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });

  } catch (error: any) {
    console.error("Checkout API Error:", error);
    return new Response(
      JSON.stringify({ 
        message: "Error procesando el pedido", 
        detail: error.message 
      }),
      { status: 500 }
    );
  }
};
