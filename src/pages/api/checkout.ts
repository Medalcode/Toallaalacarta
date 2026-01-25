import type { APIRoute } from "astro";
import { getCart } from "@/lib/shopify";
import { appwriteService } from "@/infrastructure/database/appwrite.client";
import { orderService } from "@/modules/orders/orders.service";
import { validateChileanPhone, formatChileanPhone } from "@/lib/order-utils";
import { sendOrderConfirmationEmail } from "@/lib/email";
import type { CreateOrderDTO, OrderItem } from "@/modules/orders/orders.types";

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const formData = await request.json();
    const { address, city, region, postalCode, phone, notes, cartId } = formData;

    // 1. Authentication
    const token = cookies.get("token")?.value;
    if (!token) {
      return new Response(JSON.stringify({ message: "Debes iniciar sesión para realizar un pedido" }), { status: 401 });
    }

    // 2. Setup Scoped Client
    const { account, databases } = appwriteService.createSessionClient(token);

    // 3. Get User
    let user;
    try {
      user = await account.get();
    } catch (authError) {
      return new Response(JSON.stringify({ message: "Sesión inválida o expirada" }), { status: 401 });
    }

    // 4. Validate Inputs
    if (!address || !city) {
      return new Response(JSON.stringify({ message: "Dirección y ciudad son obligatorias" }), { status: 400 });
    }
    if (!cartId) {
      return new Response(JSON.stringify({ message: "Carrito no encontrado" }), { status: 400 });
    }
    const customerPhone = phone || user.phone || '';
    if (customerPhone && !validateChileanPhone(customerPhone)) {
      return new Response(JSON.stringify({ message: "Número de teléfono inválido" }), { status: 400 });
    }

    // 5. Get Cart
    let cart;
    try {
      cart = await getCart(cartId);
      if (!cart || !cart.lines || cart.lines.length === 0) {
        return new Response(JSON.stringify({ message: "El carrito está vacío" }), { status: 400 });
      }
    } catch (e) {
      console.error("Cart error:", e);
      return new Response(JSON.stringify({ message: "Error al procesar el carrito" }), { status: 500 });
    }

    const totalPrice = parseFloat(cart.cost.totalAmount.amount);
    const cartItems: OrderItem[] = cart.lines.map((line: any) => ({
      id: line.merchandise.id,
      title: line.merchandise.product.title,
      variantTitle: line.merchandise.title,
      quantity: line.quantity,
      price: parseFloat(line.cost.totalAmount.amount),
      image: line.merchandise.image?.url || null,
    }));

    // 6. Prepare DTO
    const shippingAddress = {
      name: user.name || '',
      phone: customerPhone ? formatChileanPhone(customerPhone) : '',
      address,
      city,
      region: region || '',
      postal_code: postalCode || '',
    };

    const orderDTO: CreateOrderDTO = {
      userId: user.$id,
      userEmail: user.email,
      items: cartItems,
      totalPrice,
      shippingAddress,
      notes,
    };

    // 7. Create Order via Service
    const order = await orderService.createOrder(orderDTO, databases);

    console.log(`✅ Order created: ${order.order_number} (${order.$id})`);

    // 8. Send Email (Infrastructure concern)
    // NOTE: Ideally this should be an Event Subscriber, but explicit call is fine for now
    await sendOrderConfirmationEmail({
      to: user.email,
      orderNumber: order.order_number,
      customerName: user.name || 'Cliente',
      totalPrice,
      items: cartItems,
      shippingAddress,
    }).catch(e => console.error('⚠️ Failed to send confirmation email:', e));

    return new Response(JSON.stringify({ 
      orderId: order.$id,
      orderNumber: order.order_number,
      totalPrice,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
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
